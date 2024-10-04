# Конвертация температуры с Цельсия в Фаренгейты
import random
num = int(input("Введите число градуса в Цельсиях: "))

print(str(num*1.8+32), "градусов по Фаренгейту")

# Чётное или нечётное
num1 = int(input("Введите число: "))

if num1 % 2 == 0:
    print("Число чётное")
else:
    print("Число нечётное")


# Простое число


a = int(input("Введите число: "))
k = 0
for i in range(2, a // 2+1):
    if (a % i == 0):
        k = k+1
if (k <= 0):
    print("Число простое")
else:
    print("Число не является простым")


# Игра "Угадай число"
random_num = random.randint(0, 9)
print("Угадай число от 0 до 9")
num2 = int(input("Введите число от 0 до 9: "))
if num2 < random_num:
    print("Загаданное число больше")
elif num2 > random_num:
    print("Загаданное число меньше")
else:
    print("Вы угадали число!")
