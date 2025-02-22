from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Transaction, User
from app.schemas import TransactionGet, TransactionCreate, TransactionUpdate
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
        db.flush()  # Получаем ID первой транзакции

        # Создаем транзакцию зачисления
        deposit = Transaction(
            amount=abs(transaction.amount),
            description=transaction.description,
            datetime=transaction.datetime,
            account_id=transaction.to_account_id,
            transaction_type_id=3,
            category_id=transaction.category_id,
            user_id=current_user.id,
            related_transaction_id=withdrawal.id  # ID списания
        )
        db.add(deposit)
        db.flush()  # Получаем ID второй транзакции

        # Обновляем первую транзакцию, добавляя ссылку на вторую
        withdrawal.related_transaction_id = deposit.id

        db.commit()
        return withdrawal


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
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id).offset(skip).limit(limit).all()
    return transactions
