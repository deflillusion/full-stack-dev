from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database
from datetime import datetime
from app.auth import get_current_user


router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"],
)


@router.post("/", response_model=schemas.AccountResponse)
def create_account(account: schemas.AccountCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db_account = models.Account(user_id=current_user.id, name=account.name,
                                balance=account.balance, created_at=datetime.now())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@router.get("/{account_id}", response_model=schemas.AccountResponse)
def get_account(account_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    account = db.query(models.Account).filter(
        models.Account.id == account_id, models.Account.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.put("/{account_id}", response_model=schemas.AccountResponse)
def update_account(account_id: int, account: schemas.AccountCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db_account = db.query(models.Account).filter(
        models.Account.id == account_id, models.Account.user_id == current_user.id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    db_account.name = account.name
    db_account.balance = account.balance
    db.commit()
    db.refresh(db_account)
    return db_account


@router.delete("/{account_id}")
def delete_account(account_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db_account = db.query(models.Account).filter(
        models.Account.id == account_id, models.Account.user_id == current_user.id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(db_account)
    db.commit()
    return {"message": "Account deleted successfully"}
