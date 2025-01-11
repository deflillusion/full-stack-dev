from app.routers import users
from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base, get_db
from app.models import Transaction, Category
from app.schemas import TransactionCreate, TransactionUpdate, CategoryCreate, Category
from typing import List
from app.routers import accounts


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.post("/categories/", response_model=Category)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(Category).filter(
        Category.name == category.name).first()
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists.")

    db_category = Category(
        name=category.name, description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/categories/", response_model=List[Category])
async def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.get("/categories/{category_id}", response_model=Category)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    return category
