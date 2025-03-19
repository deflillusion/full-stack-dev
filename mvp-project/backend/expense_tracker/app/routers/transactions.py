from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Transaction, User, Account, Category
from app.schemas import TransactionGet, TransactionCreate, TransactionUpdate
from datetime import datetime
import pandas as pd
from io import BytesIO
from app.dependencies import get_current_user

router = APIRouter()


@router.post("/", response_model=TransactionGet)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Проверяем, что счет принадлежит пользователю
    account = db.query(Account).filter(
        Account.id == transaction.account_id,
        Account.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Проверяем, что категория принадлежит пользователю
    category = db.query(Category).filter(
        Category.id == transaction.category_id,
        Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    try:
        if transaction.transaction_type_id == 3:  # Перевод
            if not transaction.to_account_id:
                raise HTTPException(
                    status_code=400, detail="to_account_id is required for transfers")

            to_account = db.query(Account).filter(
                Account.id == transaction.to_account_id,
                Account.user_id == current_user.id
            ).first()
            if not to_account:
                raise HTTPException(
                    status_code=404, detail="Destination account not found")

            # Создаем транзакцию списания
            withdrawal = Transaction(
                user_id=current_user.id,
                account_id=transaction.account_id,
                category_id=transaction.category_id,
                transaction_type_id=3,
                amount=-abs(transaction.amount),
                description=transaction.description,
                datetime=transaction.datetime
            )
            db.add(withdrawal)
            db.flush()

            # Создаем транзакцию зачисления
            deposit = Transaction(
                user_id=current_user.id,
                account_id=transaction.to_account_id,
                category_id=transaction.category_id,
                transaction_type_id=3,
                amount=abs(transaction.amount),
                description=transaction.description,
                datetime=transaction.datetime,
                related_transaction_id=withdrawal.id
            )
            db.add(deposit)
            db.flush()

            # Связываем транзакции
            withdrawal.related_transaction_id = deposit.id
            db.commit()
            db.refresh(withdrawal)
            return withdrawal

        else:  # Доход или расход
            amount = transaction.amount
            if transaction.transaction_type_id == 2:  # Расход
                amount = -amount if amount > 0 else abs(amount)

            new_transaction = Transaction(
                user_id=current_user.id,
                account_id=transaction.account_id,
                category_id=transaction.category_id,
                transaction_type_id=transaction.transaction_type_id,
                amount=amount,
                description=transaction.description,
                datetime=transaction.datetime
            )
            db.add(new_transaction)
            db.commit()
            db.refresh(new_transaction)
            return new_transaction
    except Exception as e:
        db.rollback()
        print(f"Error creating transaction: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{transaction_id}", response_model=TransactionGet)
def update_transaction(
    transaction_id: int,
    transaction: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for key, value in transaction.dict(exclude_unset=True).items():
        setattr(db_transaction, key, value)

    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if db_transaction.related_transaction_id:
        related_transaction = db.query(Transaction).filter(
            Transaction.id == db_transaction.related_transaction_id
        ).first()
        if related_transaction:
            db.delete(related_transaction)

    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted"}


@router.get("/{transaction_id}", response_model=TransactionGet)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction


@router.get("/", response_model=List[TransactionGet])
def get_transactions(
    year: Optional[int] = None,
    month: Optional[int] = None,
    account_id: Optional[int] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id)

    if account_id:
        query = query.filter(Transaction.account_id == account_id)

    if category_id:
        query = query.filter(Transaction.category_id == category_id)

    if year and month:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        query = query.filter(
            Transaction.datetime >= start_date,
            Transaction.datetime < end_date
        )

    transactions = query.order_by(Transaction.datetime.desc()).all()
    return transactions


@router.get("/export/excel")
def export_transactions_to_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    year: Optional[int] = None,
    month: Optional[int] = None,
    account_id: Optional[int] = None,
    category_id: Optional[int] = None,
):
    """
    Экспортирует транзакции пользователя в файл Excel.
    Можно фильтровать по году, месяцу, счету и категории.
    """
    # Получаем транзакции с применением тех же фильтров, что и в get_transactions
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id)

    if account_id:
        query = query.filter(Transaction.account_id == account_id)

    if category_id:
        query = query.filter(Transaction.category_id == category_id)

    if year and month:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        query = query.filter(
            Transaction.datetime >= start_date,
            Transaction.datetime < end_date
        )

    transactions = query.order_by(Transaction.datetime.desc()).all()

    # Получаем словари имен счетов и категорий для подстановки
    accounts = {
        account.id: account.name
        for account in db.query(Account).filter(Account.user_id == current_user.id).all()
    }

    categories = {
        category.id: category.name
        for category in db.query(Category).filter(Category.user_id == current_user.id).all()
    }

    # Подготавливаем данные для экспорта, форматируя их для Excel
    transaction_data = []
    for t in transactions:
        # Определяем тип транзакции
        transaction_type = "Доход"
        if t.transaction_type_id == 2:
            transaction_type = "Расход"
        elif t.transaction_type_id == 3:
            transaction_type = "Перевод"

        # Добавляем данные о транзакции в читаемом формате
        transaction_data.append({
            "Дата": t.datetime.strftime("%Y-%m-%d"),
            "Время": t.datetime.strftime("%H:%M:%S"),
            "Тип": transaction_type,
            "Сумма": abs(t.amount),  # Абсолютное значение для удобства
            "Направление": "Приход" if t.amount > 0 else "Расход",
            "Счет": accounts.get(t.account_id, "Неизвестный счет"),
            "Категория": categories.get(t.category_id, "Неизвестная категория"),
            "Описание": t.description or "-"
        })

    # Если нет транзакций, возвращаем пустой Excel с заголовками
    if not transaction_data:
        transaction_data = [{
            "Дата": "", "Время": "", "Тип": "", "Сумма": "",
            "Направление": "", "Счет": "", "Категория": "", "Описание": ""
        }]

    # Создаем DataFrame из данных
    df = pd.DataFrame(transaction_data)

    # Создаем Excel-файл в памяти
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, sheet_name="Транзакции", index=False)

        # Получаем объект листа для форматирования
        workbook = writer.book
        worksheet = writer.sheets["Транзакции"]

        # Форматирование для денежных значений
        money_format = workbook.add_format({'num_format': '#,##0.00'})

        # Автоширина колонок
        for i, col in enumerate(df.columns):
            column_width = max(df[col].astype(
                str).map(len).max(), len(col)) + 2
            worksheet.set_column(i, i, column_width)

        # Устанавливаем формат для колонки с суммой
        worksheet.set_column(3, 3, None, money_format)  # Колонка "Сумма"

    # Готовим файл для скачивания
    output.seek(0)

    # Формируем имя файла с учетом примененных фильтров
    filename = "transactions"
    if year and month:
        filename += f"_{year}-{month:02d}"
    if account_id:
        account_name = accounts.get(account_id, "").replace(" ", "_")
        filename += f"_{account_name}"
    if category_id:
        category_name = categories.get(category_id, "").replace(" ", "_")
        filename += f"_{category_name}"

    headers = {
        'Content-Disposition': f'attachment; filename="{filename}.xlsx"'
    }

    return Response(
        output.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers
    )
