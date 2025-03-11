from fastapi import FastAPI, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app.models import User
from app.routers import accounts, transactions, categories, statistic, clerk
from app.init_data import init_transaction_types
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Загружаем переменные окружения
load_dotenv()

# Clerk API settings
CLERK_API_KEY = os.getenv("CLERK_API_KEY")
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

# Проверяем, что все переменные загружены
if not CLERK_API_KEY:
    raise ValueError("CLERK_API_KEY не найден в .env")
if not CLERK_JWKS_URL:
    raise ValueError("CLERK_JWKS_URL не найден в .env")
if not CLERK_SECRET_KEY:
    raise ValueError("CLERK_SECRET_KEY не найден в .env")

# Создаем приложение
app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
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

# Подключаем роутеры
app.include_router(clerk.router, prefix="/auth", tags=["Auth"])
app.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
app.include_router(transactions.router,
                   prefix="/transactions", tags=["Transactions"])
app.include_router(categories.router, prefix="/categories",
                   tags=["Categories"])
app.include_router(statistic.router, prefix="/statistic", tags=["Statistic"])
