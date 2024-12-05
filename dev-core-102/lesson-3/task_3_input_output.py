import os
script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, "data.txt")

user_data = []


def add_data():
    user_name = input("Введите Ваше имя: ")
    try:
        user_age = int(input("Введите возраст участника: "))
    except ValueError:
        print("Ошибка: пожалуйста, введите число.")
        return
    user_color = input("Введите Ваш любимый цвет: ")

    data = f"{user_name}, {user_age}, {user_color}\n"

    user_data.append(data)

    with open(file_path, "w") as file:
        file.write(data)

    print(
        f"Ваши данные Имя:{user_name}, Возраст: {user_age}, Любимый цвет: {user_color}.")


def read_data():
    try:
        with open(file_path, "r") as file:
            lines = file.readlines()
        print("Сохранённые данные:")
        for line in lines:
            user_name, user_age, user_color = line.strip().split(", ")
            print(
                f"Имя: {user_name}, Возраст: {user_age}, Любимый цвет: {user_color}")
    except FileNotFoundError:
        print("Файл не найден. Сначала добавьте данные.")
        return

    data = {
        "name": user_name,
        "age": user_age,
        "email": user_color,
    }
    user_data.append(data)
    print(
        f"Ваши данные имя:{user_name}, возраст: {user_age}, любимый цвет {user_color}.")


def main_menu():
    while True:
        choice = input(
            """Выберите действие: 
            1 - Добавить данные, 
            2 - Прочитать данные, 
            3 - Выход: 
            """)
        if choice == "1":
            add_data()
        elif choice == "2":
            read_data()
        elif choice == "3":
            print("Выход из программы.")
            break
        else:
            print("Некорректный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main_menu()
