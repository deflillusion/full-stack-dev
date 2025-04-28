import logging
import random
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command

from dotenv import load_dotenv
import os
from quotes import inspirational_quotes

# Загружаем переменные из .env
load_dotenv()

API_TOKEN = os.getenv('API_TOKEN')  # Получаем токен из .env

# Устанавливаем логирование для отслеживания ошибок
logging.basicConfig(level=logging.INFO)

# Создаем экземпляры бота
bot = Bot(token=API_TOKEN)

# Создаем диспетчер
dp = Dispatcher()


@dp.message(Command('start'))
async def send_welcome(message: types.Message):
    await message.reply("Привет! Напиши /quote, и я отправлю тебе вдохновляющую цитату.")


@dp.message(Command('quote'))
async def send_quote(message: types.Message):
    quote = random.choice(inspirational_quotes)
    await message.answer(quote)  


async def on_start():
    await dp.start_polling(bot)

if __name__ == '__main__':
    import asyncio
    asyncio.run(on_start())  
