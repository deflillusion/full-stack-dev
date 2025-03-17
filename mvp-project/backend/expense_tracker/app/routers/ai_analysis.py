from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Получаем транзакции пользователя
        transactions = db.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).all()

        if not transactions:
            raise HTTPException(
                status_code=404, detail="Транзакции не найдены")

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

        # Запрос к ChatGPT с новым API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Ты финансовый аналитик. Проанализируй транзакции и дай советы по улучшению финансового положения. Рассмотри структуру расходов по категориям и сделай выводы о приоритетах трат. Предложи конкретные рекомендации по оптимизации расходов и увеличению доходов. Используй дружелюбный тон и конкретные рекомендации."},
                {"role": "user", "content": transaction_text}
            ]
        )

        analysis = response.choices[0].message.content

        return {"analysis": analysis}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
