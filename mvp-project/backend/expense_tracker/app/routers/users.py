from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models import User, Category
from app.schemas import UserCreate, UserRead, Token
from app.auth import authenticate_user, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import datetime, timedelta

router = APIRouter()


# Категории по умолчанию
DEFAULT_CATEGORIES = [
    {"name": "Продукты", "transaction_type_id": 2},  # 2 - Расход
    {"name": "Зарплата", "transaction_type_id": 1},  # 1 - Доход
    {"name": "Развлечения", "transaction_type_id": 2},
    {"name": "Транспорт", "transaction_type_id": 2},
    {"name": "Здоровье", "transaction_type_id": 2},
    {"name": "Квартира", "transaction_type_id": 2},
    {"name": "Перевод", "transaction_type_id": 3},  # 3 - Перевод
]


@router.post("/register", response_model=UserRead)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        email=user.email,
        created=datetime.utcnow(),
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # Создаем категории по умолчанию
    for category in DEFAULT_CATEGORIES:
        db_category = Category(
            name=category["name"],
            transaction_type_id=category["transaction_type_id"],
            user_id=db_user.id
        )
        db.add(db_category)

    db.commit()  # Фиксируем изменения
    return db_user


@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
