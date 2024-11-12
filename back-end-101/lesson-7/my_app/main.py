import sqlite3
import argparse

DB_NAME = "todo_list.db"


# Инициализация базы данных
def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                completed BOOLEAN NOT NULL CHECK (completed IN (0, 1))
            )
        """)
        conn.commit()


# Добавление новой задачи
def add_task(title):
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO tasks (title, completed) VALUES (?, ?)", (title, False))
            conn.commit()
            print(f"Задача успешно добавлена.")
    except sqlite3.Error as e:
        print(f"Ошибка при добавлении задачи: {e}")


# Просмотр всех задач
def list_tasks():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, completed FROM tasks")
        tasks = cursor.fetchall()

        if not tasks:
            print("Список задач пуст.")
        else:
            print("Список всех задач:")
            for task in tasks:
                status = "✅" if task[2] else "❌"
                print(f"{task[0]}. {task[1]} - {status}")


# Обновление задачи
def update_task(task_id, new_title=None, new_status=None):
    if new_title is None and new_status is None:
        print("Не переданы данные для обновления.")

    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            updates_made = False

            if new_title:
                cursor.execute(
                    "UPDATE tasks SET title = ? WHERE id = ?", (new_title, task_id))
                updates_made = True

            if new_status is not None:
                cursor.execute(
                    "UPDATE tasks SET completed = ? WHERE id = ?", (new_status, task_id))
                updates_made = True

            if updates_made and cursor.rowcount > 0:
                conn.commit()
                print(f"Задача с ID {task_id} успешно обновлена.")
            else:
                print(
                    f"Задача с ID {task_id} не найдена или изменения не требуются.")

    except sqlite3.Error as e:
        print(f"Ошибка при обновлении задачи: {e}")


# Удаление задачи
def delete_task(task_id):
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))

            if cursor.rowcount == 0:
                print(f"Задача с ID {task_id} не найдена.")
            else:
                conn.commit()
                print(f"Задача с ID {task_id} успешно удалена.")

    except sqlite3.Error as e:
        print(f"Ошибка при удалении задачи: {e}")


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
        add_task(args.title)
    elif args.command == "list":
        list_tasks()
    elif args.command == "update":
        # Если передан новый статус, преобразуем его в булево значение
        new_status = None
        if args.status is not None:
            new_status = bool(int(args.status))
        update_task(args.id, args.title, new_status)
    elif args.command == "delete":
        delete_task(args.id)


if __name__ == "__main__":
    main()
