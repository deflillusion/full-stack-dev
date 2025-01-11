from app.routers import users
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base, get_db
from app.models import Transaction, Category
from app.schemas import TransactionGet, TransactionCreate, TransactionUpdate, CategoryCreate, Category
from typing import List
from app.routers import accounts

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


@router.post("/transactions/", response_model=TransactionCreate)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    new_transaction = Transaction(**transaction.dict())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


@router.put("/transactions/{transaction_id}", response_model=TransactionUpdate)
def update_transaction(transaction_id: int, transaction: TransactionUpdate, db: Session = Depends(get_db)):
    existing_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id).first()
    if not existing_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for key, value in transaction.dict(exclude_unset=True).items():
        setattr(existing_transaction, key, value)

    db.commit()
    db.refresh(existing_transaction)
    return existing_transaction


@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"detail": "Transaction deleted successfully"}


@router.get("/", response_model=List[TransactionGet])
def read_transactions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).offset(skip).limit(limit).all()
    return transactions
