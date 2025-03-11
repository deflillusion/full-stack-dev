import os
from dotenv import load_dotenv

load_dotenv()  # Загружаем переменные окружения из .env


class Settings:
    CLERK_SECRET_KEY: str = os.getenv(
        "CLERK_SECRET_KEY")


settings = Settings()
