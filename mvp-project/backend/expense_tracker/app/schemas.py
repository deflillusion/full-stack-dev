from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class TransactionBase(BaseModel):
    # user_id: int
    category_id: int
    account_id: int
    transaction_type_id: int
    amount: float
    description: Optional[str] = None
    datetime: datetime


class TransactionCreate(TransactionBase):

    to_account_id: Optional[int] = None  # Для переводов между счетами


class TransactionGet(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class TransactionUpdate(BaseModel):
    # user_id: Optional[int]
    category_id: Optional[int]
    amount: Optional[float]
    description: Optional[str]
    datetime: Optional[datetime]


class CategoryBase(BaseModel):
    name: str
    transaction_type_id: int


class CategoryCreate(CategoryBase):
    pass


class CategoryGet(CategoryBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class AccountBase(BaseModel):
    # user_id: int
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


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    created: datetime
    is_active: bool

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class TransactionTypeGet(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class MonthlySummary(BaseModel):
    end_balance: float
    total_expenses: float
    total_income: float
    total_transfers: float

    class Config:
        from_attributes = True


class ExpensesByCategory(BaseModel):
    category: str
    amount: float
    percentage: float

    class Config:
        from_attributes = True
