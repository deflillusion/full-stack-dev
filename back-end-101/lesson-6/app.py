import requests
import numpy as np

# URL API для получения одного случайного числа
url = "https://www.randomnumberapi.com/api/v1.0/random?min=1&max=100&count=1"

def fetch_random_number():
    try:
        response = requests.get(url)
        response.raise_for_status()
        # Получаем первое число из списка
        number = response.json()[0]
        return number
    except requests.RequestException as e:
        print("Ошибка при запросе данных:", e)
        return None

# Получаем случайное число
random_number = fetch_random_number()

if random_number is not None:
    # Используем numpy для добавления числа 10
    result = np.add(random_number, 10)
    print("Случайное число:", random_number)
    print("Случайное число + 10 =", result)
else:
    print("Не удалось получить случайное число.")
