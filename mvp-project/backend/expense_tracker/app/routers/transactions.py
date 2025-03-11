from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Transaction, User, Account, Category
from app.schemas import TransactionGet, TransactionCreate, TransactionUpdate
from datetime import datetime
from typing import List, Optional
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

    # Создаем транзакцию
    new_transaction = Transaction(
        user_id=current_user.id,
        account_id=transaction.account_id,
        category_id=transaction.category_id,
        transaction_type_id=transaction.transaction_type_id,
        amount=transaction.amount,
        description=transaction.description,
        datetime=transaction.datetime
    )
    db.add(new_transaction)

    # Обновляем баланс счета
    if transaction.transaction_type_id == 1:  # Доход
        account.balance += transaction.amount
    elif transaction.transaction_type_id == 2:  # Расход
        account.balance -= transaction.amount
    elif transaction.transaction_type_id == 3:  # Перевод
        # Проверяем, что счет назначения принадлежит пользователю
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

        # Создаем парную транзакцию для счета назначения
        to_transaction = Transaction(
            user_id=current_user.id,
            account_id=transaction.to_account_id,
            category_id=transaction.category_id,
            transaction_type_id=transaction.transaction_type_id,
            amount=transaction.amount,
            description=transaction.description,
            datetime=transaction.datetime
        )
        db.add(to_transaction)

        # Обновляем балансы счетов
        account.balance -= transaction.amount
        to_account.balance += transaction.amount

        # Связываем транзакции
        new_transaction.related_transaction_id = to_transaction.id
        to_transaction.related_transaction_id = new_transaction.id

    db.commit()
    db.refresh(new_transaction)
    return new_transaction


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

    # Обновляем поля транзакции
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

    # Если это перевод, удаляем связанную транзакцию
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
        # Фильтрация по году и месяцу
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
