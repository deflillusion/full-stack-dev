from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    transaction_type_id = Column(Integer, ForeignKey("transaction_types.id"))
    description = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))

    transactions = relationship("Transaction", back_populates="category")
    user = relationship("User", back_populates="categories")


class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    category_id = Column(Integer, ForeignKey('categories.id'))
    amount = Column(Float)
    description = Column(String, nullable=True)
    datetime = Column(DateTime)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    transaction_type_id = Column(Integer, ForeignKey("transaction_types.id"))

    account = relationship("Account", back_populates="transactions")
    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    transaction_type = relationship("TransactionType")


class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")


class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)  # Добавляем атрибут hashed_password
    email = Column(String, unique=True)
    created = Column(DateTime)
    is_active = Column(Boolean, default=True)

    transactions = relationship("Transaction", back_populates="user")
    accounts = relationship("Account", back_populates="user")
    categories = relationship("Category", back_populates="user")


class TransactionType(Base):
    __tablename__ = "transaction_types"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
