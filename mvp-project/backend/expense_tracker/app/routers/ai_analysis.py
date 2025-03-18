from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import openai
from datetime import datetime
from pydantic import BaseModel

from ..database import get_db
from ..models import Transaction, User, Category
from ..config import Settings
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)


class TransactionAnalysis(BaseModel):
    amount: float
    description: str
    transaction_type_id: int


settings = Settings()
if not settings.openai_api_key:
    raise ValueError("OPENAI_API_KEY не установлен в переменных окружения")

# Создаем клиент OpenAI
client = openai.OpenAI(api_key=settings.openai_api_key)


@router.post("/analyze-transactions")
async def analyze_transactions(
    account_id: Optional[int] = None,
    category_id: Optional[int] = None,
    current_month: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Получаем транзакции пользователя с фильтрами
        query = db.query(Transaction).filter(
            Transaction.user_id == current_user.id)

        # Применяем фильтры, если они есть
        if account_id:
            query = query.filter(Transaction.account_id == account_id)

        if category_id:
            query = query.filter(Transaction.category_id == category_id)

        if current_month:
            year, month = current_month.split('-')
            start_date = f"{year}-{month}-01"
            if month == '12':
                next_year = str(int(year) + 1)
                next_month = '01'
            else:
                next_year = year
                next_month = str(int(month) + 1).zfill(2)
            end_date = f"{next_year}-{next_month}-01"

            query = query.filter(
                Transaction.datetime >= start_date,
                Transaction.datetime < end_date
            )

        transactions = query.all()

        if not transactions:
            return {
                "trends": {
                    "insights": ["Недостаточно данных для анализа."],
                    "recommendations": []
                },
                "seasonal": {
                    "insights": ["Недостаточно данных для сезонного анализа."],
                    "recommendations": []
                },
                "anomalies": {
                    "items": [],
                    "recommendations": []
                },
                "budget": {
                    "recommendations": ["Добавьте транзакции для получения бюджетных рекомендаций."],
                    "savings_potential": None
                }
            }

        # Получаем категории пользователя
        categories = {
            category.id: category.name
            for category in db.query(Category).filter(
                Category.user_id == current_user.id
            ).all()
        }

        # Подготовка данных для анализа
        transaction_text = "Анализ транзакций:\n"
        total_income = 0
        total_expense = 0

        # Группируем расходы по категориям
        categories_expenses = {}

        for transaction in transactions:
            amount = abs(transaction.amount)
            category_name = categories.get(
                transaction.category_id, "Без категории")

            if transaction.transaction_type_id == 1:  # доход
                total_income += amount
                transaction_text += f"Доход: {amount} тенге. - {category_name} - {transaction.description}\n"
            elif transaction.transaction_type_id == 2:  # расход
                total_expense += amount
                transaction_text += f"Расход: {amount} тенге. - {category_name} - {transaction.description}\n"

                # Добавляем в словарь расходов по категориям
                if category_name not in categories_expenses:
                    categories_expenses[category_name] = 0
                categories_expenses[category_name] += amount

        transaction_text += f"\nОбщий доход: {total_income} тенге.\n"
        transaction_text += f"Общий расход: {total_expense} тенге.\n"

        # Добавляем статистику по категориям
        transaction_text += "\nРасходы по категориям:\n"
        for category_name, amount in categories_expenses.items():
            percentage = (amount / total_expense *
                          100) if total_expense > 0 else 0
            transaction_text += f"{category_name}: {amount} тенге ({percentage:.1f}%)\n"

        # Запрос к ChatGPT с новым API для структурированного анализа
        filter_info = []
        if account_id:
            filter_info.append(f"для счета с ID {account_id}")
        if category_id:
            category_name = categories.get(category_id, f"с ID {category_id}")
            filter_info.append(f"для категории '{category_name}'")
        if current_month:
            filter_info.append(f"за месяц {current_month}")

        filter_text = " ".join(filter_info) if filter_info else "за все время"

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """Ты финансовый аналитик. Проанализируй транзакции и подготовь структурированный анализ в JSON формате со следующими разделами:
                1. Тренды (trends): общие тенденции в доходах и расходах
                2. Сезонность (seasonal): периодические изменения в финансах
                3. Аномалии (anomalies): необычные транзакции или выбросы
                4. Бюджетные рекомендации (budget): советы по оптимизации
                
                Формат ответа должен быть строго JSON:
                {
                  "trends": {
                    "insights": ["список выводов о трендах", "..."],
                    "recommendations": ["рекомендации по трендам", "..."]
                  },
                  "seasonal": {
                    "insights": ["выводы о сезонности", "..."],
                    "recommendations": ["рекомендации по сезонности", "..."]
                  },
                  "anomalies": {
                    "items": [
                      {"period": "период", "description": "описание аномалии"}
                    ],
                    "recommendations": ["рекомендации по аномалиям", "..."]
                  },
                  "budget": {
                    "recommendations": ["бюджетные рекомендации", "..."],
                    "savings_potential": "текст о потенциале экономии"
                  }
                }
                
                Ответь ТОЛЬКО в этом JSON формате без дополнительного текста до или после JSON."""},
                {"role": "user", "content": f"Анализ транзакций {filter_text}:\n{transaction_text}"}
            ],
            response_format={"type": "json_object"}
        )

        # Извлекаем JSON из ответа
        analysis_json = response.choices[0].message.content

        # Возвращаем JSON напрямую
        from json import loads
        return loads(analysis_json)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
