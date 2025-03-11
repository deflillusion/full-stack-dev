from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
import jwt
import json
from urllib.request import urlopen
import logging
import requests
from app.config import settings

logger = logging.getLogger(__name__)

# URL для получения публичных ключей Clerk
CLERK_JWKS_URL = "https://tough-grouse-31.clerk.accounts.dev/.well-known/jwks.json"
CLERK_SECRET_KEY = settings.CLERK_SECRET_KEY

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


async def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Проверяет Clerk-токен и возвращает текущего пользователя"""
    logger.info("Начинаем верификацию токена Clerk")

    if not authorization:
        logger.error("Отсутствует заголовок Authorization")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Отсутствует заголовок Authorization",
        )

    if not authorization.startswith("Bearer "):
        logger.error("Неверный формат токена: не начинается с 'Bearer '")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный формат токена",
        )

    token = authorization.split("Bearer ")[1]
    logger.info(f"Получен токен длиной {len(token)} символов")

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
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Clerk key ID",
            )

        # Декодируем токен
        logger.info("Декодируем токен")
        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(
            json.dumps(public_keys[kid]))
        payload = jwt.decode(token, public_key, algorithms=["RS256"])
        logger.info(
            f"Токен успешно декодирован. Payload: {json.dumps(payload)}")

        # Получаем ID пользователя из токена
        user_id = payload.get("sub")
        logger.info(f"ID пользователя из токена: {user_id}")

        # Проверяем, есть ли пользователь в БД
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            # Если пользователя нет в БД, получаем данные из Clerk API
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
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Ошибка получения данных пользователя",
                )

            clerk_user = response.json()
            email = clerk_user["email_addresses"][0]["email_address"]
            username = clerk_user.get("username") or email.split(
                "@")[0] or f"user_{user_id[:6]}"

            # Создаем пользователя в БД
            from datetime import datetime
            user = User(
                id=user_id,
                email=email,
                username=username,
                created=datetime.utcnow(),
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"Создан новый пользователь: {user_id}")

        return user

    except jwt.ExpiredSignatureError:
        logger.error("Токен истек")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Токен истек",
        )
    except jwt.InvalidTokenError as e:
        logger.error(f"Недействительный токен: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен",
        )
    except Exception as e:
        logger.error(f"Ошибка при верификации токена: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ошибка верификации токена",
        )
