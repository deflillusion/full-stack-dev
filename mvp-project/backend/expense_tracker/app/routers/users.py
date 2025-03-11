# import logging
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from datetime import datetime
# from app.database import get_db
# from app.models import User, Category, Account
# from app.schemas import UserRead
# from app.clerk import get_clerk_user  # Clerk user extractor

# router = APIRouter()

# # Категории по умолчанию
# DEFAULT_CATEGORIES = [
#     {"name": "Продукты", "transaction_type_id": 2},
#     {"name": "Зарплата", "transaction_type_id": 1},
#     {"name": "Развлечения", "transaction_type_id": 2},
#     {"name": "Транспорт", "transaction_type_id": 2},
#     {"name": "Здоровье", "transaction_type_id": 2},
#     {"name": "Квартира", "transaction_type_id": 2},
#     {"name": "Перевод", "transaction_type_id": 3},
# ]

# # Счета по умолчанию
# DEFAULT_ACCOUNTS = [
#     {"name": "Наличные", "balance": 0.0},
#     {"name": "Банковский счет", "balance": 0.0}
# ]


# # Настраиваем логирование
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)


# @router.post("/register", response_model=UserRead)
# def register_user(
#     db: Session = Depends(get_db), clerk_user: dict = Depends(get_clerk_user)
# ):
#     logger.debug(f"Получен clerk_user: {clerk_user}")

#     user_id = clerk_user["id"]
#     email = clerk_user["email_addresses"][0]["email_address"]

#     # Проверяем, пришел ли username
#     username = clerk_user.get("username") or email.split("@")[0]
#     if not username:
#         username = f"user_{user_id[:6]}"

#     logger.debug(
#         f"Создается пользователь: ID={user_id}, Email={email}, Username={username}")

#     # Проверяем, есть ли пользователь
#     existing_user = db.query(User).filter(User.id == user_id).first()
#     if existing_user:
#         logger.debug("Пользователь уже существует в базе данных")
#         return existing_user

#     # Создаем нового пользователя
#     db_user = User(
#         id=user_id,
#         username=username,
#         email=email,
#         created=datetime.utcnow(),
#         is_active=True
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)

#     logger.debug(f"Пользователь создан: {db_user}")

#     return db_user
