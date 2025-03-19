import os
from dotenv import load_dotenv
from pathlib import Path

# Получаем путь к директории backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent
# Загружаем переменные окружения из .env в директории backend
load_dotenv(BASE_DIR / '.env')


class Settings:
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY")
    clerk_secret_key: str = os.getenv("CLERK_SECRET_KEY")  # Добавляем второй вариант для совместимости
    clerk_api_url: str = "https://api.clerk.com/v1"
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "your-secret-key")
    jwt_algorithm: str = "HS256"
    openai_api_key: str = os.getenv("OPENAI_API_KEY")


settings = Settings()
