import os
from dotenv import load_dotenv
from pathlib import Path

# Получаем путь к директории backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent
# Загружаем переменные окружения из .env в директории backend
load_dotenv(BASE_DIR / '.env')


class Settings:
    CLERK_SECRET_KEY: str = os.getenv(
        "CLERK_SECRET_KEY")
    openai_api_key: str = os.getenv(
        "OPENAI_API_KEY")


settings = Settings()
