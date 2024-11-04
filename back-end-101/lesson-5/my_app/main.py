# my_app/main.py
import os

from dotenv import load_dotenv
load_dotenv()

# Теперь можно получить доступ к переменным из .env
api_key = os.environ.get("API_KEY")
debug_mode_str = os.environ.get("DEBUG_MODE")

# Преобразовать debug_mode в логическое значение
debug_mode = debug_mode_str.lower() == 'true' if debug_mode_str is not None else False

print("API_KEY:", api_key)
print("DEBUG_MODE:", debug_mode)