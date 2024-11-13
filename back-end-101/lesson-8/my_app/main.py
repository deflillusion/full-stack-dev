import json
import argparse
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "..", "data")
DB_NAME = os.path.join(DB_DIR, "tasks.json")


# Инициализация файла данных
def init_db():
    if not os.path.exists(DB_NAME):
        os.makedirs(DB_DIR)
        with open(DB_NAME, 'w', encoding='utf-8') as f:
            json.dump([], f)  # Инициализация пустого списка задач


# Чтение всех задач из JSON файла
def load_tasks():
    with open(DB_NAME, 'r', encoding='utf-8') as f:
        return json.load(f)


# Сохранение задач в JSON файл
def save_tasks(tasks):
    with open(DB_NAME, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, ensure_ascii=False, indent=4)


# Добавление новой задачи
def add_task(title):
    tasks = load_tasks()
    task_id = max(task["id"] for task in tasks) + 1 if tasks else 1
    task = {"id": task_id, "title": title, "completed": False}
    tasks.append(task)
    save_tasks(tasks)
    return "Задача успешно добавлена."


# Просмотр всех задач
def list_tasks():
    tasks = load_tasks()
    if not tasks:
        print("Список задач пуст.")
    else:
        print("Список всех задач:")
        for task in tasks:
            status = "✅" if task["completed"] else "❌"
            print(f"{task['id']}. {task['title']} - {status}")


# Обновление задачи
def update_task(task_id, new_title=None, new_status=None):
    tasks = load_tasks()
    task = next((task for task in tasks if task["id"] == task_id), None)

    if not task:
        return f"Задача с ID {task_id} не найдена."

    if new_title:
        task["title"] = new_title
    if new_status is not None:
        task["completed"] = bool(int(new_status))

    save_tasks(tasks)
    return f"Задача с ID {task_id} успешно обновлена."


# Удаление задачи
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [task for task in tasks if task["id"] != task_id]
    save_tasks(tasks)
    return f"Задача с ID {task_id} успешно удалена."


# Основная функция для обработки аргументов командной строки
def main():
    init_db()

    parser = argparse.ArgumentParser(description="Управление списком задач")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Подкоманда для добавления задачи
    parser_add = subparsers.add_parser(
        "add", help="Добавить новую задачу (add `Наименование задачи`)")
    parser_add.add_argument(
        "title", type=str, help="Добавить новую задачу (add `Наименование задачи`)")

    # Подкоманда для просмотра всех задач
    parser_list = subparsers.add_parser("list", help="Просмотр всех задач")

    # Подкоманда для обновления задачи
    parser_update = subparsers.add_parser(
        "update", help="Обновить задачу, с аргументом --title Новое название задачи, --status Новый статус задачи (0 - не выполнена, 1 - выполнена)")
    parser_update.add_argument("id", type=int, help="ID задачи для обновления")
    parser_update.add_argument(
        "--title", type=str, help="Новое название задачи")
    parser_update.add_argument(
        "--status", choices=["0", "1"], help="Новый статус задачи (0 - не выполнена, 1 - выполнена)")

    # Подкоманда для удаления задачи
    parser_delete = subparsers.add_parser("delete", help="Удалить задачу")
    parser_delete.add_argument("id", type=int, help="ID задачи для удаления")

    args = parser.parse_args()

    # Обработка команд
    if args.command == "add":
        print(add_task(args.title))
    elif args.command == "list":
        list_tasks()
    elif args.command == "update":
        new_status = None
        if args.status is not None:
            new_status = bool(int(args.status))
        print(update_task(args.id, args.title, new_status))
    elif args.command == "delete":
        print(delete_task(args.id))


if __name__ == "__main__":
    main()
