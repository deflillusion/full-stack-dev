from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import TransactionType

def init_transaction_types():
    db: Session = SessionLocal()
    try:
        # Проверяем, есть ли уже данные в таблице
        if db.query(TransactionType).count() == 0:
            # Добавляем типы транзакций
            transaction_types = [
                TransactionType(name="Доход"),
                TransactionType(name="Расход"),
                TransactionType(name="Перевод между счетами")
            ]
            db.add_all(transaction_types)
            db.commit()
    finally:
        db.close()