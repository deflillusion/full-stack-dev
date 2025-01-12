from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Category, User
from app.schemas import CategoryCreate, Category as CategorySchema
from app.auth import get_current_active_user

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.post("/", response_model=CategorySchema)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_category = db.query(Category).filter(
        Category.name == category.name, Category.user_id == current_user.id).first()
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists.")

    db_category = Category(
        name=category.name,
        description=category.description,
        user_id=current_user.id  # Связываем категорию с текущим пользователем
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.get("/", response_model=List[CategorySchema])
async def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(Category).filter(Category.user_id == current_user.id).all()


@router.get("/{category_id}", response_model=CategorySchema)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    category = db.query(Category).filter(
        Category.id == category_id, Category.user_id == current_user.id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    return category
