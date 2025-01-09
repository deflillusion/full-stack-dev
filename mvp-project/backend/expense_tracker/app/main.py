# backend/app.py

from fastapi import FastAPI
from app.database import Base, engine
from app.routers import users

app = FastAPI()

# Создание таблиц
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в Expense Tracker API"}


app.include_router(users.router)
