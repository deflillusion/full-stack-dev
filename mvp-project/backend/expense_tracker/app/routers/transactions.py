from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Transaction, User, Account, Category
from app.schemas import TransactionGet, TransactionCreate, TransactionUpdate
from datetime import datetime
from app.dependencies import get_current_user

router = APIRouter()


@router.post("/", response_model=TransactionGet)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Проверяем, что счет принадлежит пользователю
    account = db.query(Account).filter(
        Account.id == transaction.account_id,
        Account.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Проверяем, что категория принадлежит пользователю
    category = db.query(Category).filter(
        Category.id == transaction.category_id,
        Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    try:
        if transaction.transaction_type_id == 3:  # Перевод
            if not transaction.to_account_id:
                raise HTTPException(
                    status_code=400, detail="to_account_id is required for transfers")

            to_account = db.query(Account).filter(
                Account.id == transaction.to_account_id,
                Account.user_id == current_user.id
            ).first()
            if not to_account:
                raise HTTPException(
                    status_code=404, detail="Destination account not found")

            # Создаем транзакцию списания
            withdrawal = Transaction(
                user_id=current_user.id,
                account_id=transaction.account_id,
                category_id=transaction.category_id,
                transaction_type_id=3,
                amount=-abs(transaction.amount),
                description=transaction.description,
                datetime=transaction.datetime
            )
            db.add(withdrawal)
            db.flush()

            # Создаем транзакцию зачисления
            deposit = Transaction(
                user_id=current_user.id,
                account_id=transaction.to_account_id,
                category_id=transaction.category_id,
                transaction_type_id=3,
                amount=abs(transaction.amount),
                description=transaction.description,
                datetime=transaction.datetime,
                related_transaction_id=withdrawal.id
            )
            db.add(deposit)
            db.flush()

            # Связываем транзакции
            withdrawal.related_transaction_id = deposit.id
            db.commit()
            db.refresh(withdrawal)
            return withdrawal

        else:  # Доход или расход
            amount = transaction.amount
            if transaction.transaction_type_id == 2:  # Расход
                amount = -amount if amount > 0 else abs(amount)

            new_transaction = Transaction(
                user_id=current_user.id,
                account_id=transaction.account_id,
                category_id=transaction.category_id,
                transaction_type_id=transaction.transaction_type_id,
                amount=amount,
                description=transaction.description,
                datetime=transaction.datetime
            )
            db.add(new_transaction)
            db.commit()
            db.refresh(new_transaction)
            return new_transaction
    except Exception as e:
        db.rollback()
        print(f"Error creating transaction: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{transaction_id}", response_model=TransactionGet)
def update_transaction(
    transaction_id: int,
    transaction: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for key, value in transaction.dict(exclude_unset=True).items():
        setattr(db_transaction, key, value)

    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if db_transaction.related_transaction_id:
        related_transaction = db.query(Transaction).filter(
            Transaction.id == db_transaction.related_transaction_id
        ).first()
        if related_transaction:
            db.delete(related_transaction)

    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted"}


@router.get("/{transaction_id}", response_model=TransactionGet)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction


@router.get("/", response_model=List[TransactionGet])
def get_transactions(
    year: Optional[int] = None,
    month: Optional[int] = None,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id)

    if account_id:
        query = query.filter(Transaction.account_id == account_id)

    if year and month:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        query = query.filter(
            Transaction.datetime >= start_date,
            Transaction.datetime < end_date
        )

    transactions = query.order_by(Transaction.datetime.desc()).all()
    return transactions
