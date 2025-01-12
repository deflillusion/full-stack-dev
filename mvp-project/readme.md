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


```mermaid
erDiagram
    User {
        int id
        string username
        string password
        string email
        datetime created
    }

    Account {
        int id
        int user_id
        string name
        float balance
        datetime created
    }

    Category {
        int id
        int user_id
        string name
        int transaction_type_id
        string description
    }

    Transactions {
        int id
        int user_id
        int account_id
        int category_id
        float amount
        int transaction_type_id
        string description
        datetime datetime
    }

    Transaction_type {
        int id
        string name
    }

    User ||--o{ Account : "имеет"
    User ||--o{ Transactions : "связан с"
    Account ||--o{ Transactions : "участвует в"
    Category ||--o{ Transactions : "связана с"
    Transaction_type ||--o{ Category : "определяет"
    Transaction_type ||--o{ Transactions : "определяет"



