import logging
import requests
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Category, Account
from app.schemas import UserRead
from app.config import settings
from app.dependencies import get_current_user
import jwt
from urllib.request import urlopen

logger = logging.getLogger(__name__)

router = APIRouter()

# URL для получения публичных ключей Clerk
CLERK_JWKS_URL = "https://tough-grouse-31.clerk.accounts.dev/.well-known/jwks.json"
CLERK_SECRET_KEY = settings.CLERK_SECRET_KEY

# Категории по умолчанию
DEFAULT_CATEGORIES = [
    {"name": "Продукты", "transaction_type_id": 2},
    {"name": "Зарплата", "transaction_type_id": 1},
    {"name": "Развлечения", "transaction_type_id": 2},
    {"name": "Транспорт", "transaction_type_id": 2},
    {"name": "Здоровье", "transaction_type_id": 2},
    {"name": "Квартира", "transaction_type_id": 2},
    {"name": "Перевод", "transaction_type_id": 3},
]

# Счета по умолчанию
DEFAULT_ACCOUNTS = [
    {"name": "Наличные", "balance": 0.0},
    {"name": "Банковский счет", "balance": 0.0}
]

# Функция для получения публичных ключей Clerk (JWKS)


def get_clerk_public_keys():
    try:
        response = urlopen(CLERK_JWKS_URL)
        return json.loads(response.read())
    except Exception as e:
        logger.error(f"Ошибка при получении публичных ключей Clerk: {e}")
        raise HTTPException(
            status_code=500, detail="Could not fetch Clerk public keys"
        )


def verify_token(token: str):
    """Проверяет Clerk-токен и возвращает данные пользователя"""
    logger.info("Начинаем верификацию токена Clerk")

    try:
        # Получаем публичные ключи Clerk
        logger.info("Получаем публичные ключи Clerk")
        jwks = get_clerk_public_keys()
        public_keys = {key["kid"]: key for key in jwks["keys"]}
        logger.info(f"Получено {len(public_keys)} публичных ключей")

        # Декодируем заголовок JWT, чтобы получить `kid`
        logger.info("Декодируем заголовок JWT")
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]
        logger.info(f"Получен kid: {kid}")

        # Проверяем, есть ли ключ
        if kid not in public_keys:
            logger.error(f"Недействительный Clerk key ID: {kid}")
            raise HTTPException(status_code=401, detail="Invalid Clerk key ID")

        # Декодируем токен
        logger.info("Декодируем токен")
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(
            json.dumps(public_keys[kid]))
        payload = jwt.decode(token, public_key, algorithms=["RS256"])
        logger.info(
            f"Токен успешно декодирован. Payload: {json.dumps(payload)}")

        return payload

    except jwt.ExpiredSignatureError:
        logger.error("Токен истек")
        raise HTTPException(status_code=401, detail="Токен истек")
    except jwt.InvalidTokenError as e:
        logger.error(f"Недействительный токен: {e}")
        raise HTTPException(status_code=401, detail="Недействительный токен")
    except Exception as e:
        logger.error(f"Ошибка при верификации токена: {e}")
        raise HTTPException(
            status_code=401, detail="Ошибка верификации токена")


@router.post("/register", response_model=UserRead)
def register_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Создаёт нового пользователя в базе и добавляет ему категории и счета по умолчанию"""
    user_id = current_user.id

    # Проверяем, есть ли у пользователя категории
    categories = db.query(Category).filter(Category.user_id == user_id).all()
    if not categories:
        # Добавляем категории
        for category in DEFAULT_CATEGORIES:
            db.add(Category(user_id=user_id, **category))

    # Проверяем, есть ли у пользователя счета
    accounts = db.query(Account).filter(Account.user_id == user_id).all()
    if not accounts:
        # Добавляем счета
        for account in DEFAULT_ACCOUNTS:
            db.add(Account(user_id=user_id, created_at=datetime.utcnow(), **account))

    db.commit()
    db.refresh(current_user)

    logger.info(f"Пользователь {user_id} успешно зарегистрирован")
    return current_user


@router.post("/verify-token")
def verify_token_endpoint(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Проверяет токен Clerk и возвращает информацию о пользователе"""
    logger.info("Проверка токена Clerk")

    if not authorization:
        logger.error("Отсутствует заголовок Authorization")
        raise HTTPException(
            status_code=401, detail="Отсутствует заголовок Authorization")

    if not authorization.startswith("Bearer "):
        logger.error("Неверный формат токена: не начинается с 'Bearer '")
        raise HTTPException(status_code=401, detail="Неверный формат токена")

    token = authorization.split("Bearer ")[1]
    logger.info(f"Получен токен длиной {len(token)} символов")

    # Верифицируем токен
    payload = verify_token(token)

    # Получаем ID пользователя из токена
    user_id = payload.get("sub")
    logger.info(f"ID пользователя из токена: {user_id}")

    # Проверяем, есть ли пользователь в БД
    user = db.query(User).filter(User.id == user_id).first()

    # Если пользователя нет в БД, получаем данные из Clerk API
    if not user:
        logger.info(
            f"Пользователь {user_id} не найден в БД, получаем данные из Clerk API")
        headers = {"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
        response = requests.get(
            f"https://api.clerk.dev/v1/users/{user_id}",
            headers=headers
        )

        if response.status_code != 200:
            logger.error(
                f"Ошибка при получении данных пользователя из Clerk: {response.text}")
            raise HTTPException(
                status_code=401, detail="Ошибка получения данных пользователя")

        clerk_user = response.json()
        email = clerk_user["email_addresses"][0]["email_address"]
        username = clerk_user.get("username") or email.split(
            "@")[0] or f"user_{user_id[:6]}"

        # Создаем пользователя в БД
        user = User(
            id=user_id,
            email=email,
            username=username,
            created=datetime.utcnow(),
            is_active=True
        )
        db.add(user)

        # Добавляем категории
        for category in DEFAULT_CATEGORIES:
            db.add(Category(user_id=user_id, **category))

        # Добавляем счета
        for account in DEFAULT_ACCOUNTS:
            db.add(Account(user_id=user_id, created_at=datetime.utcnow(), **account))

        db.commit()
        db.refresh(user)
        logger.info(f"Создан новый пользователь: {user_id}")

    return {"user_id": user_id, "is_registered": True}
