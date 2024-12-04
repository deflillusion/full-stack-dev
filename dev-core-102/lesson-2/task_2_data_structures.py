participant_list = []
event_location = []


def add_participant():
    participant_name = input("Введите имя участника конференции: ")
    participant_age = int(input("Введите возраст участника: "))
    participant_email = input("Введите email участника: ")
    participant_id = len(participant_list) + 1

    participant = {
        "id": participant_id,
        "name": participant_name,
        "age": participant_age,
        "email": participant_email,
    }

    participant_list.append(participant)
    print(
        f"Участник '{participant_name}' зарегистрирован с ID {participant_id}.")


def add_location():
    location_name = input(
        "Введите наименование места проведения конференции: ")
    location_id = len(event_location) + 1

    location = (location_id, location_name)
    event_location.append(location)

    print(
        f"Место проведения конференции '{location_name}' добавлено с ID {location_id}.")


def view_list(participants):
    if not participants:
        print("Список участников пуст.")
        return

    print("\nСписок участников:")
    for participant in participants:
        print(
            f"ID: {participant['id']}, Имя: {participant['name']}, Возраст: {participant['age']}, Email: {participant['email']}"
        )


def view_location(locations):
    if not locations:
        print("Список мест проведения конференции пуст.")
        return

    print("\nСписок мест проведения конференции:")
    for location in locations:
        print(f"ID: {location[0]}, Название: {location[1]}")


def main_menu():
    while True:
        print("\nВыберите действие:")
        print("1. Добавить участника")
        print("2. Добавить локацию проведения")
        print("3. Список участников")
        print("4. Список локаций")
        print("5. Выйти")
        choice = input("Введите номер действия: ")

        if choice == "1":
            add_participant()
        elif choice == "2":
            add_location()
        elif choice == "3":
            view_list(participant_list)
        elif choice == "4":
            view_location(event_location)
        elif choice == "5":
            print("Программа завершена.")
            break
        else:
            print("Неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main_menu()
