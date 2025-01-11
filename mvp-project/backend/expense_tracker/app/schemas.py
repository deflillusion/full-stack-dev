from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TransactionBase(BaseModel):
    user_id: int
    category_id: int
    amount: float
    description: Optional[str] = None
    datetime: datetime


class TransactionCreate(TransactionBase):
    pass


class TransactionGet(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    user_id: Optional[int]
    category_id: Optional[int]
    amount: Optional[float]
    description: Optional[str]
    datetime: Optional[datetime]


class CategoryBase(BaseModel):
    name: str
    description: str


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True


class AccountBase(BaseModel):
    name: str
    balance: Optional[float] = 0.0


class AccountCreate(AccountBase):
    pass


class AccountResponse(AccountBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
