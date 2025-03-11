from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Category, User, TransactionType
from app.schemas import CategoryCreate, CategoryGet, TransactionTypeGet
from app.dependencies import get_current_user

router = APIRouter(

)


@router.post("/", response_model=CategoryGet)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.name == category.name,
        Category.user_id == current_user.id,
        Category.transaction_type_id == category.transaction_type_id
    ).first()
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists")

    new_category = Category(
        name=category.name,
        transaction_type_id=category.transaction_type_id,
        user_id=current_user.id
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("/", response_model=List[CategoryGet])
def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    categories = db.query(Category).filter(
        Category.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return categories


@router.get("/transaction_types", response_model=List[TransactionTypeGet])
def get_transaction_types(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction_types = db.query(TransactionType).all()
    return transaction_types


@router.get("/{category_id}", response_model=CategoryGet)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category


@router.put("/{category_id}", response_model=CategoryGet)
def update_category(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_category.name = category.name
    db_category.transaction_type_id = category.transaction_type_id

    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted"}
