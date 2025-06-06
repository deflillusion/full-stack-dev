from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database
from datetime import datetime
from typing import List
from app.schemas import AccountCreate, AccountResponse
from app.models import Account, User, Transaction
from app.dependencies import get_current_user
from app.database import get_db


router = APIRouter(

)


@router.post("/", response_model=schemas.AccountResponse)
def create_account(
    account: schemas.AccountCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Создает новый счет для текущего пользователя"""
    db_account = Account(
        user_id=current_user.id,
        name=account.name,
        balance=account.balance,
        created_at=datetime.utcnow()
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@router.get("/{account_id}", response_model=schemas.AccountResponse)
def get_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Получает счет по ID"""
    db_account = db.query(Account).filter(
        Account.id == account_id, Account.user_id == current_user.id).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account


@router.get("/", response_model=List[AccountResponse])
def get_accounts(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Получает список счетов текущего пользователя"""
    accounts = db.query(Account).filter(
        Account.user_id == current_user.id).offset(skip).limit(limit).all()
    return accounts


@router.put("/{account_id}", response_model=schemas.AccountResponse)
def update_account(
    account_id: int,
    account: schemas.AccountCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Обновляет счет по ID"""
    db_account = db.query(Account).filter(
        Account.id == account_id, Account.user_id == current_user.id).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")

    db_account.name = account.name
    db_account.balance = account.balance

    db.commit()
    db.refresh(db_account)
    return db_account


@router.delete("/{account_id}")
def delete_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Удаляет счет по ID"""
    db_account = db.query(Account).filter(
        Account.id == account_id, Account.user_id == current_user.id).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Account not found")

    # Проверяем наличие транзакций, связанных с этим счетом
    transactions_count = db.query(Transaction).filter(
        Transaction.account_id == account_id
    ).count()

    if transactions_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete account: {transactions_count} transactions found. Delete transactions first."
        )

    db.delete(db_account)
    db.commit()
    return {"message": "Account deleted"}
