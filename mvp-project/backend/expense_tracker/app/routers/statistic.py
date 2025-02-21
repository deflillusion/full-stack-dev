from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import func
from ..database import get_db
from .. import models, schemas
from typing import Optional
from app.auth import get_current_active_user

router = APIRouter()


@router.get("/monthly-summary/", response_model=schemas.MonthlySummary)
def get_monthly_summary(
    year: int,
    month: int,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db),
    # Добавляем текущего пользователя
    current_user: models.User = Depends(get_current_active_user)
):
    start_date = datetime(year, month, 1)
    end_date = datetime(
        year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)

    # Базовый запрос с фильтрацией по пользователю
    base_query = db.query(models.Transaction).filter(
        models.Transaction.user_id == current_user.id  # Добавляем фильтр по пользователю
    )

    if account_id:
        # Проверяем, принадлежит ли счет текущему пользователю
        account = db.query(models.Account).filter(
            models.Account.id == account_id,
            models.Account.user_id == current_user.id  # Проверяем владельца счета
        ).first()
        if not account:
            raise HTTPException(
                status_code=404, detail="Счет не найден или не принадлежит текущему пользователю")

        base_query = base_query.filter(
            models.Transaction.account_id == account_id)
        initial_balance = account.balance
    else:
        # Получаем начальный баланс всех счетов текущего пользователя
        initial_balance = db.query(func.sum(models.Account.balance)).filter(
            models.Account.user_id == current_user.id  # Фильтруем счета по пользователю
        ).scalar() or 0.0

    # Фильтруем транзакции по дате
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

        # Для отображения общей суммы переводов по конкретному счету
        total_transfers = abs(outgoing_transfers) + incoming_transfers
        # Для расчета баланса учитываем как входящие, так и исходящие переводы
        transfer_balance = outgoing_transfers + incoming_transfers
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
