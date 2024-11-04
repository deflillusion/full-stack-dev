# utils/helpers.py

import time

# Задача Постирать одежду
def sort_clothes():  # Отсортировать одежду по цветам
    print("Отсортировать одежду по цветам")
    time.sleep(1)



def put_clothes():  # Положить оперделенное количество одежды в стиральную машину
    print("Положить оперделенное количество одежды в стиральную машину")
    time.sleep(1)



def detergent():    # Залить моющее средство в стиральную машину
    print("Залить моющее средство в стиральную машину")
    time.sleep(1)



def washing_programm():  # Выбрать нужную программу стирки
    print("Выбрать нужную программу стирки")
    time.sleep(1)



def run_programm():  # Запустить стиральную машину
    print("Запустить стиральную машину")
    time.sleep(1)


def washing_clothes(): #Стирка одежды
    print("Начинаем стирку")
    time.sleep(1)
    sort_clothes()
    put_clothes()
    detergent()
    washing_programm()
    run_programm()
    print("Ждем пока постирается")

