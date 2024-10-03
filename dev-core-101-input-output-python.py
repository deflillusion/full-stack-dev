name = input("Введите Ваше имя: ")
age = input("Введите Ваш возраст: ")

print(f"Привет, {name}. Тебе {age} лет.")

age = int(age)

if age <= 100:
    print("Вам исполнится 100 лет в", 100-age+2024, "году")
else:
    print("Вам более 100 лет.")
