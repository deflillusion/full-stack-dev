

def choose_trip_destination():
    preference = input(
        "Какой отдых вы предпочитаете: 1. Активный или 2. Расслабляющий? ").strip().lower()

    if preference == "1":
        print("Выберите вариант:")
        print("1. Горы")
        print("2. Лес")
        print("3. Пустыня")
        activity_choice = input("Введите ваш выбор (1, 2, или 3): ").strip()

        if activity_choice == "1":
            destination = "горы"
            recommendation = "Не забудьте теплую одежду и ботинки для треккинга!"
        elif activity_choice == "2":
            destination = "лес"
            recommendation = "Возьмите с собой репеллент от насекомых и палатку."
        elif activity_choice == "3":
            destination = "пустыня"
            recommendation = "Обязательно возьмите с собой воду и защиту от солнца."
        else:
            print("Некорректный выбор. Попробуйте снова.")
            return

    elif preference == "2":
        print("Выберите вариант:")
        print("1. Пляж")
        print("2. SPA")
        print("3. Гостиница")
        relaxation_choice = input("Введите ваш выбор (1, 2, или 3): ").strip()

        if relaxation_choice == "1":
            destination = "пляж"
            recommendation = "Не забудьте взять солнцезащитный крем!"
        elif relaxation_choice == "2":
            destination = "SPA"
            recommendation = "Расслабьтесь и наслаждайтесь процедурами!"
        elif relaxation_choice == "3":
            destination = "гостиница"
            recommendation = "Позвольте себе отдых с комфортом."
        else:
            print("Некорректный выбор. Попробуйте снова.")
            return

    else:
        print("Некорректный ввод. Пожалуйста, выберите '1' или '2'.")
        return

    # бюджет
    budget = input(
        "Какой у вас бюджет на поездку? Введите сумму (в тенге): ").strip()
    if budget.isdigit():
        budget = int(budget)
        if budget < 25000:
            budget_message = "С таким бюджетом рассмотрите близкие варианты или однодневные поездки."
        elif 25000 <= budget < 100000:
            budget_message = "Вполне реально отправиться в ближайший регион или бюджетное путешествие."
        else:
            budget_message = "Ваш бюджет позволяет выбрать любое направление!"
    else:
        budget_message = "Некорректный ввод бюджета. Но вы всегда можете найти подходящий вариант!"

    print("\n--- Ваш выбор ---")
    print(f"Вы выбрали отдых: {destination.capitalize()}.")
    print(recommendation)
    print(budget_message)


def main_menu():
    while True:
        print("\nВыберите действие:")
        print("1. Выбор отдыха")
        print("2. Выйти")
        choice = input("Введите номер действия: ")

        if choice == "1":
            choose_trip_destination()
        elif choice == "2":
            print("Программа завершена.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main_menu()
