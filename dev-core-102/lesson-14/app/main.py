from fastapi import HTTPException, Depends
import sqlite3
import os
from pydantic import BaseModel
from typing import List
from typing import Optional


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "..", "data")
DB_NAME = os.path.join(DB_DIR, "todo_list.db")


class Task(BaseModel):
    id: int
    title: str
    completed: bool = False


class TaskUpdate(BaseModel):
    new_title: str = None
    new_status: bool = None


# Инициализация базы данных
def init_db():
    if not os.path.exists(DB_NAME):
        os.makedirs(DB_DIR)
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
            return cursor.lastrowid
    except sqlite3.Error as e:
        print(f"Ошибка при добавлении задачи: {e}")
        raise HTTPException(
            status_code=500, detail=f"Ошибка при добавлении задачи: {e}")


# Просмотр всех задач
def list_tasks():
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, title, completed FROM tasks")
            tasks = cursor.fetchall()

            task_list = []
            for task in tasks:
                task_list.append(
                    Task(id=int(task[0]), title=task[1], completed=bool(task[2])))
            return task_list
    except sqlite3.Error as e:
        print(f"Ошибка при извлечении задач: {e}")
        raise HTTPException(
            status_code=500, detail=f"Ошибка при извлечении задач")


# Функция для обновления задачи в базе данных
def update_task(task_id: int, new_title: str = None, new_status: bool = None):
    if new_title is None and new_status is None:
        raise HTTPException(
            status_code=400, detail=f"Не переданы данные для обновления")

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
                return {"message": f"Задача с ID {task_id} успешно обновлена."}
            else:
                raise HTTPException(
                    status_code=404, detail=f"Задача с таким ID не найдена или изменений не требуется")
    except sqlite3.Error as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка при обновлении задачи: {e}")


# Функция для удаления задачи
def delete_task(task_id: int):
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))

            if cursor.rowcount == 0:
                raise HTTPException(
                    status_code=404, detail=f"Задача с ID {task_id} не найдена.")
            else:
                conn.commit()
                return {"message": f"Задача с ID {task_id} успешно удалена."}
    except sqlite3.Error as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка при удалении задачи: {e}")


def get_task_by_id(task_id):
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()

            cursor.execute(
                "SELECT id, title, completed FROM tasks WHERE id = ?", (task_id,))
            task = cursor.fetchone()

            if task:

                return Task(id=task[0], title=task[1], completed=bool(task[2]))
            else:

                raise HTTPException(
                    status_code=404, detail=f"Задача не найдена")

    except sqlite3.Error as e:
        print(f"Ошибка при извлечении задачи: {e}")
        raise HTTPException(
            status_code=500, detail=f"Ошибка при извлечении задачи")


def handle_choice_1():
    title = input("Введите название задачи: ").strip()
    if title:
        task_id = add_task(title)
        print(f"Задача с ID {task_id} добавлена.")
    else:
        print("Название задачи не может быть пустым.")


def handle_choice_2():
    try:
        task_id = int(
            input("Введите ID задачи для удаления: ").strip())
        result = delete_task(task_id)
        print(result["message"])
    except ValueError:
        print("Ошибка: ID задачи должен быть числом.")
    except HTTPException as e:
        print(e.detail)


def handle_choice_3():
    tasks = list_tasks()
    if tasks:
        print("\nСписок задач:")
        for task in tasks:
            status = "Выполнена" if task.completed else "Не выполнена"
            print(f"{task.id}. {task.title} — {status}")
    else:
        print("Список задач пуст.")


def handle_choice_4():
    try:
        task_id = int(
            input("Введите ID задачи для обновления: ").strip())
        new_title = input(
            "Введите новое название задачи (или оставьте пустым): ").strip()
        new_status_input = input(
            "Изменить статус? (введите 'да' или 'нет'): ").strip().lower()

        new_status = None
        if new_status_input == "да":
            status_input = input(
                "Введите новый статус (0 — не выполнена, 1 — выполнена): ").strip()
            new_status = status_input == "1"

        result = update_task(task_id, new_title or None, new_status)
        print(result["message"])
    except ValueError:
        print("Ошибка: ID задачи или статус должны быть числом.")
    except HTTPException as e:
        print(e.detail)


def main():
    init_db()
    print("Добро пожаловать в систему управления списком дел!")

    while True:
        print("\n--- Меню ---")
        print("1. Добавить новую задачу")
        print("2. Удалить задачу")
        print("3. Показать все задачи")
        print("4. Обновить задачу")
        print("5. Выход")

        choice = input("Выберите действие: ").strip()

        if choice == "1":
            handle_choice_1()

        elif choice == "2":
            handle_choice_2()

        elif choice == "3":
            handle_choice_3()

        elif choice == "4":
            handle_choice_4()

        elif choice == "5":
            print("Выход из программы. До свидания!")
            break

        else:
            print("Ошибка: неверный выбор. Попробуйте снова.")


if __name__ == "__main__":
    main()
