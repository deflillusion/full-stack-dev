from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from sqlalchemy import func
from ..database import get_db
from .. import models, schemas
from typing import Optional

router = APIRouter()


@router.get("/monthly-summary/", response_model=schemas.MonthlySummary)
def get_monthly_summary(
    year: int,
    month: int,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    start_date = datetime(year, month, 1)
    end_date = datetime(
        year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)

    # Базовый запрос для транзакций
    base_query = db.query(models.Transaction).filter(
        models.Transaction.datetime >= start_date,
        models.Transaction.datetime < end_date
    )

    # Если указан account_id, добавляем фильтр по счету
    if account_id:
        # Проверяем существование счета
        account = db.query(models.Account).filter(
            models.Account.id == account_id).first()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        base_query = base_query.filter(
            models.Transaction.account_id == account_id)
        initial_balance = account.balance  # Изначальный баланс счета
    else:
        # Если счет не указан, получаем общий начальный баланс по всем счетам
        initial_balance = db.query(
            func.sum(models.Account.balance)).scalar() or 0.0

    # Расход за выбранный месяц
    total_expenses = base_query.filter(
        models.Transaction.transaction_type_id == 2  # Тип "Расход"
    ).with_entities(func.sum(models.Transaction.amount)).scalar() or 0.0

    # Доход за выбранный месяц
    total_income = base_query.filter(
        models.Transaction.transaction_type_id == 1  # Тип "Доход"
    ).with_entities(func.sum(models.Transaction.amount)).scalar() or 0.0

    # Переводы между счетами за выбранный месяц
    total_transfers = base_query.filter(
        models.Transaction.transaction_type_id == 3  # Тип "Перевод между счетами"
    ).with_entities(func.sum(models.Transaction.amount)).scalar() or 0.0

    # Рассчитываем конечный баланс
    end_balance = initial_balance + total_income - abs(total_expenses)

    return schemas.MonthlySummary(
        end_balance=end_balance,
        total_expenses=abs(total_expenses),
        total_income=total_income,
        total_transfers=abs(total_transfers)
    )
