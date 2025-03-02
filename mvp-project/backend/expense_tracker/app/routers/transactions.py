from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Transaction, User
from app.schemas import TransactionGet, TransactionCreate, TransactionUpdate
from datetime import datetime
from typing import List, Optional
from app.auth import get_current_active_user

router = APIRouter(

)


# @router.post("/", response_model=TransactionGet)
# def create_transaction(
#     transaction: TransactionCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_active_user)
# ):
#     new_transaction = Transaction(
#         **transaction.dict(), user_id=current_user.id)
#     db.add(new_transaction)
#     db.commit()
#     db.refresh(new_transaction)
#     return new_transaction


@router.post("/", response_model=TransactionGet)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        if transaction.transaction_type_id == 3:  # Перевод
            if not transaction.to_account_id:
                raise HTTPException(
                    status_code=400, detail="Для перевода необходимо указать счет получателя")

            # Создаем транзакцию списания
            withdrawal = Transaction(
                amount=-abs(transaction.amount),
                description=transaction.description,
                datetime=transaction.datetime,
                account_id=transaction.account_id,
                transaction_type_id=3,
                category_id=transaction.category_id,
                user_id=current_user.id
            )
            db.add(withdrawal)
            db.flush()

            # Создаем транзакцию зачисления
            deposit = Transaction(
                amount=abs(transaction.amount),
                description=transaction.description,
                datetime=transaction.datetime,
                account_id=transaction.to_account_id,
                transaction_type_id=3,
                category_id=transaction.category_id,
                user_id=current_user.id,
                related_transaction_id=withdrawal.id
            )
            db.add(deposit)
            db.flush()

            withdrawal.related_transaction_id = deposit.id
            db.commit()
            return withdrawal

        else:  # Доход или расход
            amount = transaction.amount  # Получаем сумму

            if transaction.transaction_type_id == 2:  # Расход
                if amount > 0:
                    amount = -amount  # Обычный расход (делаем отрицательным)
                else:
                    # Возврат расхода (делаем положительным)
                    amount = abs(amount)

            elif transaction.transaction_type_id == 1:  # Доход
                # if amount < 0:
                #     amount = -amount  # Возврат дохода (делаем отрицательным)
                pass

            new_transaction = Transaction(
                amount=amount,
                description=transaction.description,
                datetime=transaction.datetime,
                account_id=transaction.account_id,
                transaction_type_id=transaction.transaction_type_id,
                category_id=transaction.category_id,
                user_id=current_user.id
            )
            db.add(new_transaction)
            db.commit()
            db.refresh(new_transaction)
            return new_transaction

    except Exception as e:
        db.rollback()
        print(f"Error creating transaction: {str(e)}")  # Для отладки
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{transaction_id}", response_model=TransactionGet)
def update_transaction(
    transaction_id: int,
    transaction: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    existing_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not existing_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for key, value in transaction.dict(exclude_unset=True).items():
        setattr(existing_transaction, key, value)

    db.commit()
    db.refresh(existing_transaction)
    return existing_transaction


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted successfully"}


@router.get("/", response_model=List[TransactionGet])
def get_transactions(
    year: Optional[int] = None,
    month: Optional[int] = None,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id)

    # Фильтрация по счету
    if account_id:
        query = query.filter(Transaction.account_id == account_id)

    # Фильтрация по месяцу и году
    if year and month:
        try:
            start_date = datetime(year, month, 1)
            if month == 12:
                end_date = datetime(year + 1, 1, 1)
            else:
                end_date = datetime(year, month + 1, 1)

            query = query.filter(
                Transaction.datetime >= start_date,
                Transaction.datetime < end_date
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Неверный формат даты"
            )

    # Получаем все транзакции, отсортированные по дате
    transactions = query.order_by(Transaction.datetime.desc()).all()

    return transactions
