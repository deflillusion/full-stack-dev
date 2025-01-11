from app.routers import users
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base, get_db
from app.models import Transaction, Category
from app.schemas import TransactionCreate, TransactionUpdate, CategoryCreate, Category
from typing import List
from app.routers import accounts, transactions, categories

# Создаем приложение
app = FastAPI()

# Инициализация базы данных
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
app.include_router(transactions.router,
                   prefix="/transactions", tags=["Transactions"])
app.include_router(categories.router, prefix="/categories",
                   tags=["Categories"])
