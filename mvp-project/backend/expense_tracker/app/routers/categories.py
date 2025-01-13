from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Category, User
from app.schemas import CategoryCreate, CategoryGet
from app.auth import get_current_active_user

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)

@router.post("/", response_model=CategoryGet)
def create_category(
    category: CategoryCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    db_category = db.query(Category).filter(
        Category.name == category.name, Category.user_id == current_user.id).first()
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists.")

    new_category = Category(
        name=category.name, 
        description=category.description,
        transaction_type_id=category.transaction_type_id,  # Добавляем поле transaction_type_id
        user_id=current_user.id  # Связываем категорию с текущим пользователем
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", response_model=List[CategoryGet])
def read_categories(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    categories = db.query(Category).filter(Category.user_id == current_user.id).offset(skip).limit(limit).all()
    return categories

@router.get("/{category_id}", response_model=CategoryGet)
def read_category(
    category_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    return category

@router.put("/{category_id}", response_model=CategoryGet)
def update_category(
    category_id: int, 
    category: CategoryCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    existing_category = db.query(Category).filter(Category.id == category_id, Category.user_id == current_user.id).first()
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found.")
    
    for key, value in category.dict(exclude_unset=True).items():
        setattr(existing_category, key, value)
    
    db.commit()
    db.refresh(existing_category)
    return existing_category

@router.delete("/{category_id}")
def delete_category(
    category_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    category = db.query(Category).filter(Category.id == category_id, Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    
    db.delete(category)
    db.commit()
    return {"detail": "Category deleted successfully"}