from fastapi import FastAPI, HTTPException
import sqlite3
import os
from pydantic import BaseModel
from typing import List
from typing import Optional

app = FastAPI()


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "..", "data")
DB_NAME = os.path.join(DB_DIR, "todo_list.db")


class Task(BaseModel):
    id: int = Optional[int]
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


@app.on_event("startup")
def startup_event():
    init_db()


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


@app.post("/tasks", response_model=Task)
def create_task(task: Task):
    new_task_id = add_task(task.title)
    return Task(id=new_task_id, title=task.title, completed=bool(False))


@app.get("/tasks", response_model=List[Task])
def get_tasks():
    tasks = list_tasks()
    return tasks


@app.put("/tasks/{task_id}")
def update_task_route(task_id: int, task_update: TaskUpdate):
    if not task_update.new_title and task_update.new_status is None:
        raise HTTPException(
            status_code=400, detail=f"Не переданы данные для обновления")
    return update_task(task_id, task_update.new_title, task_update.new_status)


@app.delete("/tasks/{task_id}")
def delete_task_route(task_id: int):
    return delete_task(task_id)


@app.get("/tasks/{task_id}")
def read_task(task_id: int):
    task = get_task_by_id(task_id)
    return task
