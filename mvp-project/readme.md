## Мой личный проект (MVP)

**Название проекта**: Учет расходов и доходов

**Описание**: Приложение для учета дохходов и расходов, с категориями, и вводом записей.

**Ключевые функции**:
1. Регистрация и авторизация пользователей.
2. Создание и управление счетами и категориями.
3. Ввод записей.
4. Вывод отчета за период (неделя, месяц, год), по категориям, по счетам.


**User Stories**:
- *Как пользователь*, я хочу создавать записи доходов и расходов.
- *Как пользователь*, я хочу выводить отчеты.

Структура проекта:
/mvp-project
├── README.md
├── backend/
│   └── app.py
├── frontend/
│   └── images/
│   └── index.html
├── base/
│   └── base.db




SQLite таблицы
Таблица Users
    id:
    username:
    password:
    email:
    created:

Таблица Category:
    id:
    name:
    transaction_type_id:
    description:

Таблица Transactions:
    id:
    user_id:
    category_id:
    amount:
    transaction_type_id:
    description:
    datetime:


Таблица transaction_type:
    id:
    name: (Доход, Расход, Перевод)


