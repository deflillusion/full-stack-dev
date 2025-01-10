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


class TransactionUpdate(BaseModel):
    user_id: Optional[int]
    category_id: Optional[int]
    amount: Optional[float]
    description: Optional[str]
    datetime: Optional[datetime]
