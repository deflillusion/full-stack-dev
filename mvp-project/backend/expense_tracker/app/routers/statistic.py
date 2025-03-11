from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import func
from ..database import get_db
from .. import models, schemas
from typing import Optional
from app.dependencies import get_current_user

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
