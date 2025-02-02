
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base, get_db
from app.models import Transaction, Category, Account
from app.schemas import TransactionCreate, TransactionUpdate, CategoryCreate, CategoryGet, AccountResponse
from typing import List
from app.routers import users, accounts, transactions, categories
from app.init_data import init_transaction_types
from fastapi.middleware.cors import CORSMiddleware


# Создаем приложение
app = FastAPI()


# Настройка CORS
origins = [
    "http://localhost:8080",  # Добавьте сюда адрес вашего фронтенда
    "http://127.0.0.1:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация базы данных
Base.metadata.create_all(bind=engine)


init_transaction_types()


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
