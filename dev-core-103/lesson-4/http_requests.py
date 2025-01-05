import os
import json
import requests


def save_to_file(data, file_path):
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"Ошибка при сохранении файла: {e}")


def send_get_request(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при выполнении GET-запроса: {e}")
        return None


def main():
    base_url = "https://jsonplaceholder.typicode.com/posts"
    file_path = "dev-core-103/lesson-4/posts_data.json"

    while True:
        print("\nМеню:")
        print("1. Получить список постов")
        print("2. Получить детали поста по ID")
        print("3. Выход")

        choice = input("Выберите действие: ")

        if choice == "1":
            # Получение списка постов
            posts = send_get_request(base_url)
            if posts is not None:
                save_to_file(posts, file_path)
                print(f"Список постов сохранён в {file_path}")

        elif choice == "2":
            # Получение деталей поста по ID
            try:
                post_id = int(input("Введите ID поста: "))
                post_details = send_get_request(f"{base_url}/{post_id}")
                if post_details:
                    print("Детали поста:", json.dumps(
                        post_details, ensure_ascii=False, indent=4))
            except ValueError:
                print("Некорректный ID. Пожалуйста, введите числовое значение.")

        elif choice == "3":
            print("Выход из программы.")
            break

        else:
            print("Некорректный выбор. Пожалуйста, попробуйте снова.")


if __name__ == "__main__":
    main()
