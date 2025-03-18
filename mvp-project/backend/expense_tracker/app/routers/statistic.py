from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from sqlalchemy import func, case, distinct
from ..database import get_db
from .. import models, schemas
from typing import Optional, List
from app.dependencies import get_current_user
import json
import calendar
import numpy as np
from collections import defaultdict

router = APIRouter()


@router.get("/monthly-summary/", response_model=schemas.MonthlySummary)
def get_monthly_summary(
    year: int,
    month: int,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    start_date = datetime(year, month, 1)
    end_date = datetime(
        year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)

    # Базовый запрос с фильтрацией по пользователю
    base_query = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id
    )

    if account_id:
        # Проверяем, принадлежит ли счет текущему пользователю
        account = db.query(models.Account).filter(
            models.Account.id == account_id,
            models.Account.user_id == current_user.id
        ).first()
        if not account:
            raise HTTPException(
                status_code=404,
                detail="Счет не найден или не принадлежит текущему пользователю"
            )

        # Получаем все транзакции до начала выбранного месяца
        previous_transactions = base_query.filter(
            models.Transaction.account_id == account_id,
            models.Transaction.datetime < start_date
        )

        # Считаем сумму всех предыдущих транзакций
        previous_balance = (
            previous_transactions.with_entities(
                func.sum(models.Transaction.amount)
            ).scalar() or 0.0
        )

        # Начальный баланс счета плюс сумма всех предыдущих транзакций
        initial_balance = account.balance + previous_balance

        base_query = base_query.filter(
            models.Transaction.account_id == account_id)
    else:
        # Для всех счетов
        accounts_balance = db.query(func.sum(models.Account.balance)).filter(
            models.Account.user_id == current_user.id
        ).scalar() or 0.0

        # Получаем все транзакции до начала выбранного месяца
        previous_transactions = base_query.filter(
            models.Transaction.datetime < start_date
        )

        # Считаем сумму всех предыдущих транзакций
        previous_balance = (
            previous_transactions.with_entities(
                func.sum(models.Transaction.amount)
            ).scalar() or 0.0
        )

        initial_balance = accounts_balance + previous_balance

    # Фильтруем транзакции текущего месяца
    current_month_query = base_query.filter(
        models.Transaction.datetime >= start_date,
        models.Transaction.datetime < end_date
    )

    # Расход за выбранный месяц
    total_expenses = current_month_query.filter(
        models.Transaction.transaction_type_id == 2
    ).with_entities(func.sum(models.Transaction.amount)).scalar() or 0.0

    # Доход за выбранный месяц
    total_income = current_month_query.filter(
        models.Transaction.transaction_type_id == 1
    ).with_entities(func.sum(models.Transaction.amount)).scalar() or 0.0

# Переводы за выбранный месяц
    if account_id:
        # Исходящие переводы (отрицательные)
        outgoing_transfers = current_month_query.filter(
            models.Transaction.transaction_type_id == 3,
            models.Transaction.amount < 0
        ).with_entities(func.sum(models.Transaction.amount)).scalar() or 0.0

        # Входящие переводы (положительные)
        incoming_transfers = current_month_query.filter(
            models.Transaction.transaction_type_id == 3,
            models.Transaction.amount > 0
        ).with_entities(func.sum(models.Transaction.amount)).scalar() or 0.0

        # Показываем фактическое значение переводов (отрицательное или положительное)
        total_transfers = outgoing_transfers + incoming_transfers
        # Для расчета баланса используем то же значение
        transfer_balance = total_transfers
    else:
        # Для всех счетов не показываем переводы, так как они взаимно компенсируются
        total_transfers = 0
        transfer_balance = 0

    # Рассчитываем конечный баланс
    end_balance = initial_balance + total_income - \
        abs(total_expenses) + transfer_balance

    return schemas.MonthlySummary(
        end_balance=end_balance,
        total_expenses=abs(total_expenses),
        total_income=total_income,
        total_transfers=total_transfers
    )


@router.get("/expenses-by-category/", response_model=list[schemas.ExpensesByCategory])
def get_expenses_by_category(
    year: int,
    month: int,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    start_date = datetime(year, month, 1)
    end_date = datetime(
        year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)

    # Базовый запрос с фильтрацией по пользователю и типу транзакции (расходы)
    base_query = db.query(
        models.Category.name.label('category'),
        func.sum(models.Transaction.amount).label('amount')
    ).join(
        models.Transaction,
        models.Category.id == models.Transaction.category_id
    ).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.transaction_type_id == 2,  # только расходы
        models.Transaction.datetime >= start_date,
        models.Transaction.datetime < end_date
    )

    if account_id:
        # Проверяем, принадлежит ли счет пользователю
        account = db.query(models.Account).filter(
            models.Account.id == account_id,
            models.Account.user_id == current_user.id
        ).first()
        if not account:
            raise HTTPException(
                status_code=404,
                detail="Счет не найден или не принадлежит текущему пользователю"
            )
        base_query = base_query.filter(
            models.Transaction.account_id == account_id)

    # Группируем по категориям и получаем суммы
    expenses = base_query.group_by(
        models.Category.name
    ).all()

    # Считаем общую сумму расходов
    total_expenses = sum(abs(expense.amount) for expense in expenses)

    # Формируем результат с процентами
    result = []
    for expense in expenses:
        percentage = (abs(expense.amount) / total_expenses *
                      100) if total_expenses > 0 else 0
        result.append({
            "category": expense.category,
            "amount": abs(expense.amount),
            "percentage": percentage
        })

    # Сортируем по сумме расходов (по убыванию)
    result.sort(key=lambda x: x["amount"], reverse=True)

    return result


@router.get("/last-12-months/", response_model=list[schemas.MonthlyStatistic])
def get_last_12_months(
    current_month: str,  # формат YYYY-MM
    account_id: Optional[int] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Получает данные о доходах и расходах за последние 12 месяцев,
    включая текущий месяц
    """
    try:
        year, month = map(int, current_month.split('-'))
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Неверный формат месяца. Используйте YYYY-MM"
        )

    # Вычисляем начальную и конечную даты для периода в 12 месяцев
    end_date = datetime(
        year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)

    # Вычисляем дату, которая была 12 месяцев назад
    start_year = year - 1 if month < 12 else year
    start_month = month + 1 if month < 12 else 1
    start_date = datetime(start_year, start_month, 1)

    # Базовый запрос с фильтрацией по пользователю
    base_query = db.query(
        func.strftime('%Y-%m', models.Transaction.datetime).label('month'),
        func.sum(
            case(
                (models.Transaction.transaction_type_id ==
                 1, models.Transaction.amount),
                else_=0
            )
        ).label('income'),
        func.sum(
            case(
                (models.Transaction.transaction_type_id ==
                 2, func.abs(models.Transaction.amount)),
                else_=0
            )
        ).label('expense')
    ).filter(
        models.Transaction.user_id == current_user.id,
        models.Transaction.datetime >= start_date,
        models.Transaction.datetime < end_date
    )

    # Применяем фильтры, если они указаны
    if account_id:
        # Проверяем, принадлежит ли счет пользователю
        account = db.query(models.Account).filter(
            models.Account.id == account_id,
            models.Account.user_id == current_user.id
        ).first()
        if not account:
            raise HTTPException(
                status_code=404,
                detail="Счет не найден или не принадлежит текущему пользователю"
            )
        base_query = base_query.filter(
            models.Transaction.account_id == account_id)

    if category_id:
        # Проверяем, существует ли категория
        category = db.query(models.Category).filter(
            models.Category.id == category_id
        ).first()
        if not category:
            raise HTTPException(
                status_code=404,
                detail="Категория не найдена"
            )
        base_query = base_query.filter(
            models.Transaction.category_id == category_id)

    # Группируем по месяцам
    result = base_query.group_by(
        func.strftime('%Y-%m', models.Transaction.datetime)
    ).order_by(
        func.strftime('%Y-%m', models.Transaction.datetime)
    ).all()

    # Форматируем результат
    monthly_data = []
    for entry in result:
        monthly_data.append({
            "month": entry.month,
            "income": float(entry.income),
            "expense": float(entry.expense),
            "balance": float(entry.income - entry.expense)
        })

    return monthly_data


@router.get("/ai-analysis/last-12-months/")
def get_ai_analysis(
    current_month: str = Query(...,
                               description="Текущий месяц в формате YYYY-MM"),
    account_id: Optional[int] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Получает AI-анализ данных о доходах и расходах за последние 12 месяцев
    """
    try:
        # Вызываем существующую функцию, чтобы получить базовые данные
        monthly_data = get_last_12_months(
            current_month, account_id, category_id, db, current_user
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при получении данных для анализа: {str(e)}"
        )

    try:
        # Анализ тенденций и паттернов
        insights = analyze_trends(monthly_data)

        # Анализ сезонности
        seasonal_insights = analyze_seasonality(monthly_data)

        # Анализ аномалий
        anomalies = detect_anomalies(monthly_data)

        # Рекомендации по бюджету
        budget_recommendations = generate_budget_recommendations(monthly_data)

        # Возвращаем все результаты анализа
        return {
            "insights": insights,
            "seasonal_insights": seasonal_insights,
            "anomalies": anomalies,
            "budget_recommendations": budget_recommendations
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при анализе данных: {str(e)}"
        )


def analyze_trends(monthly_data):
    """Анализирует тенденции в доходах и расходах"""
    if not monthly_data:
        return {"message": "Недостаточно данных для анализа тенденций."}

    income_trend = []
    expense_trend = []
    balance_trend = []
    months = []

    for entry in monthly_data:
        income_trend.append(entry["income"])
        expense_trend.append(entry["expense"])
        balance_trend.append(entry["balance"])
        months.append(entry["month"])

    # Рассчитываем средние значения
    avg_income = sum(income_trend) / len(income_trend) if income_trend else 0
    avg_expense = sum(expense_trend) / \
        len(expense_trend) if expense_trend else 0
    avg_balance = sum(balance_trend) / \
        len(balance_trend) if balance_trend else 0

    # Рассчитываем тренды (используем простую линейную регрессию)
    income_slope = calculate_trend(income_trend)
    expense_slope = calculate_trend(expense_trend)

    # Формируем выводы
    insights = {
        "income": {
            "average": round(avg_income, 2),
            "trend": "растут" if income_slope > 0.05 else "падают" if income_slope < -0.05 else "стабильны",
            "trend_value": round(income_slope * 100, 2)  # Процентное изменение
        },
        "expense": {
            "average": round(avg_expense, 2),
            "trend": "растут" if expense_slope > 0.05 else "падают" if expense_slope < -0.05 else "стабильны",
            # Процентное изменение
            "trend_value": round(expense_slope * 100, 2)
        },
        "balance": {
            "average": round(avg_balance, 2),
            "positive_months": sum(1 for b in balance_trend if b > 0),
            "negative_months": sum(1 for b in balance_trend if b <= 0)
        }
    }

    # Добавляем текстовые рекомендации
    insights["summary"] = []

    # Анализ доходов
    if income_slope > 0.05:
        insights["summary"].append(
            f"Ваши доходы растут (+{round(income_slope * 100, 2)}% в месяц). Это хорошая тенденция!")
    elif income_slope < -0.05:
        insights["summary"].append(
            f"Ваши доходы снижаются ({round(income_slope * 100, 2)}% в месяц). Стоит обратить на это внимание.")
    else:
        insights["summary"].append(
            "Ваши доходы остаются стабильными на протяжении года.")

    # Анализ расходов
    if expense_slope > 0.05:
        insights["summary"].append(
            f"Ваши расходы растут (+{round(expense_slope * 100, 2)}% в месяц). Возможно, стоит пересмотреть бюджет.")
    elif expense_slope < -0.05:
        insights["summary"].append(
            f"Вы успешно сокращаете расходы ({round(expense_slope * 100, 2)}% в месяц). Отличная работа!")
    else:
        insights["summary"].append(
            "Ваши расходы остаются стабильными на протяжении года.")

    # Анализ баланса
    if insights["balance"]["positive_months"] == len(balance_trend):
        insights["summary"].append(
            "У вас положительный баланс каждый месяц. Превосходно!")
    elif insights["balance"]["negative_months"] > insights["balance"]["positive_months"]:
        insights["summary"].append(
            f"У вас отрицательный баланс в {insights['balance']['negative_months']} месяцах из {len(balance_trend)}. Рекомендуем пересмотреть расходы.")
    else:
        insights["summary"].append(
            f"У вас положительный баланс в {insights['balance']['positive_months']} месяцах из {len(balance_trend)}.")

    return insights


def analyze_seasonality(monthly_data):
    """Анализирует сезонные паттерны в расходах и доходах"""
    if not monthly_data or len(monthly_data) < 4:
        return {"message": "Недостаточно данных для анализа сезонности."}

    # Группируем по сезонам (зима, весна, лето, осень)
    seasonal_data = {
        "зима": {"income": [], "expense": [], "months": []},
        "весна": {"income": [], "expense": [], "months": []},
        "лето": {"income": [], "expense": [], "months": []},
        "осень": {"income": [], "expense": [], "months": []}
    }

    # Сопоставление месяцев и сезонов
    season_map = {
        "01": "зима", "02": "зима", "12": "зима",
        "03": "весна", "04": "весна", "05": "весна",
        "06": "лето", "07": "лето", "08": "лето",
        "09": "осень", "10": "осень", "11": "осень"
    }

    for entry in monthly_data:
        month = entry["month"].split('-')[1]  # Получаем номер месяца (MM)
        season = season_map.get(month)
        if season:
            seasonal_data[season]["income"].append(entry["income"])
            seasonal_data[season]["expense"].append(entry["expense"])
            seasonal_data[season]["months"].append(entry["month"])

    # Вычисляем средние значения по сезонам
    seasonal_analysis = {}
    for season, data in seasonal_data.items():
        if data["income"] and data["expense"]:
            seasonal_analysis[season] = {
                "avg_income": round(sum(data["income"]) / len(data["income"]), 2),
                "avg_expense": round(sum(data["expense"]) / len(data["expense"]), 2),
                "num_months": len(data["months"]),
                "months": data["months"]
            }

    # Определяем сезон с наибольшими доходами и расходами
    if seasonal_analysis:
        max_income_season = max(seasonal_analysis.items(),
                                key=lambda x: x[1]["avg_income"])[0]
        max_expense_season = max(
            seasonal_analysis.items(), key=lambda x: x[1]["avg_expense"])[0]

        # Формируем выводы
        insights = {
            "seasonal_data": seasonal_analysis,
            "max_income_season": max_income_season,
            "max_expense_season": max_expense_season,
            "summary": []
        }

        # Добавляем текстовые рекомендации
        insights["summary"].append(
            f"Наибольшие доходы у вас в сезон {max_income_season} (в среднем {seasonal_analysis[max_income_season]['avg_income']} в месяц).")
        insights["summary"].append(
            f"Наибольшие расходы у вас в сезон {max_expense_season} (в среднем {seasonal_analysis[max_expense_season]['avg_expense']} в месяц).")

        # Если сезоны с макс. доходами и расходами совпадают
        if max_income_season == max_expense_season:
            insights["summary"].append(
                f"В сезон {max_income_season} у вас как наибольшие доходы, так и наибольшие расходы.")

        return insights
    else:
        return {"message": "Недостаточно данных для анализа сезонности."}


def detect_anomalies(monthly_data):
    """Выявляет аномалии в доходах и расходах"""
    if not monthly_data or len(monthly_data) < 3:
        return {"message": "Недостаточно данных для выявления аномалий."}

    income_values = [entry["income"] for entry in monthly_data]
    expense_values = [entry["expense"] for entry in monthly_data]
    months = [entry["month"] for entry in monthly_data]

    # Вычисляем среднее и стандартное отклонение
    mean_income = sum(income_values) / len(income_values)
    mean_expense = sum(expense_values) / len(expense_values)

    std_income = (
        sum((x - mean_income) ** 2 for x in income_values) / len(income_values)) ** 0.5
    std_expense = (sum((x - mean_expense) **
                   2 for x in expense_values) / len(expense_values)) ** 0.5

    # Выявляем аномалии (значения, отклоняющиеся более чем на 2 стандартных отклонения)
    income_anomalies = []
    expense_anomalies = []

    for i, (income, expense, month) in enumerate(zip(income_values, expense_values, months)):
        if abs(income - mean_income) > 2 * std_income:
            income_anomalies.append({
                "month": month,
                "value": income,
                "deviation": round((income - mean_income) / mean_income * 100, 2) if mean_income else 0
            })

        if abs(expense - mean_expense) > 2 * std_expense:
            expense_anomalies.append({
                "month": month,
                "value": expense,
                "deviation": round((expense - mean_expense) / mean_expense * 100, 2) if mean_expense else 0
            })

    # Формируем выводы
    anomalies = {
        "income_anomalies": income_anomalies,
        "expense_anomalies": expense_anomalies,
        "summary": []
    }

    # Добавляем текстовые рекомендации
    if income_anomalies:
        for anomaly in income_anomalies:
            direction = "выше" if anomaly["deviation"] > 0 else "ниже"
            anomalies["summary"].append(
                f"В месяце {anomaly['month']} ваш доход был на {abs(anomaly['deviation'])}% {direction} среднего.")
    else:
        anomalies["summary"].append(
            "Значительных отклонений в доходах не обнаружено.")

    if expense_anomalies:
        for anomaly in expense_anomalies:
            direction = "выше" if anomaly["deviation"] > 0 else "ниже"
            anomalies["summary"].append(
                f"В месяце {anomaly['month']} ваши расходы были на {abs(anomaly['deviation'])}% {direction} среднего.")
    else:
        anomalies["summary"].append(
            "Значительных отклонений в расходах не обнаружено.")

    return anomalies


def generate_budget_recommendations(monthly_data):
    """Генерирует рекомендации по бюджету на основе исторических данных"""
    if not monthly_data or len(monthly_data) < 2:
        return {"message": "Недостаточно данных для формирования рекомендаций по бюджету."}

    # Собираем последние данные
    latest_month = monthly_data[-1]["month"]
    income_values = [entry["income"] for entry in monthly_data]
    expense_values = [entry["expense"] for entry in monthly_data]

    # Вычисляем средние значения и тренды
    avg_income = sum(income_values) / len(income_values)
    avg_expense = sum(expense_values) / len(expense_values)
    income_trend = calculate_trend(income_values)
    expense_trend = calculate_trend(expense_values)

    # Прогнозируем доходы и расходы на следующий месяц
    predicted_income = income_values[-1] * (1 + income_trend)
    predicted_expense = expense_values[-1] * (1 + expense_trend)

    # Рассчитываем оптимальные расходы
    optimal_expense = predicted_income * 0.8  # 80% от прогнозируемого дохода

    # Формируем рекомендации
    recommendations = {
        "current_data": {
            "latest_month": latest_month,
            "avg_monthly_income": round(avg_income, 2),
            "avg_monthly_expense": round(avg_expense, 2)
        },
        "predictions": {
            "next_month_income": round(predicted_income, 2),
            "next_month_expense": round(predicted_expense, 2)
        },
        "recommendations": {
            "recommended_expense": round(optimal_expense, 2),
            "recommended_savings": round(predicted_income - optimal_expense, 2)
        },
        "summary": []
    }

    # Добавляем текстовые рекомендации
    rec_diff = round(optimal_expense - predicted_expense, 2)
    if rec_diff < 0:
        saving_potential = abs(rec_diff)
        recommendations["summary"].append(
            f"Рекомендуем сократить расходы на {saving_potential} в следующем месяце для достижения оптимального баланса.")
        recommendations["summary"].append(
            f"Это позволит вам сохранить около {round(recommendations['recommendations']['recommended_savings'], 2)} от прогнозируемого дохода.")
    else:
        recommendations["summary"].append(
            f"Ваши расходы находятся в рамках рекомендуемого бюджета.")
        recommendations["summary"].append(
            f"Рекомендуем сохранить около {round(recommendations['recommendations']['recommended_savings'], 2)} от прогнозируемого дохода.")

    if expense_trend > 0:
        recommendations["summary"].append(
            f"Обратите внимание, что ваши расходы имеют тенденцию к росту (+{round(expense_trend * 100, 2)}% в месяц).")

    return recommendations


def calculate_trend(values):
    """Рассчитывает тренд изменения значений (простая линейная регрессия)"""
    if not values or len(values) < 2:
        return 0

    # Нормализуем значения для расчета процентного изменения
    if values[0] == 0:
        return 0  # Избегаем деления на ноль

    normalized_values = [v / values[0] for v in values]
    n = len(normalized_values)
    x = list(range(n))

    # Рассчитываем наклон с помощью линейной регрессии
    x_mean = sum(x) / n
    y_mean = sum(normalized_values) / n

    numerator = sum((x[i] - x_mean) * (normalized_values[i] - y_mean)
                    for i in range(n))
    denominator = sum((x[i] - x_mean) ** 2 for i in range(n))

    # Избегаем деления на ноль
    slope = numerator / denominator if denominator != 0 else 0

    # Возвращаем среднее изменение за месяц
    return slope / (n - 1) if n > 1 else 0
