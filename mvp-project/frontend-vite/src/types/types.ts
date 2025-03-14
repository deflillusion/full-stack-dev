// Типы для фронтенда
export type TransactionType = "income" | "expense" | "transfer"

export type TransactionCategory = "food" | "transport" | "entertainment" | "utilities" | "salary" | "other"

export interface ApiTransaction {
    id: number;
    amount: number;
    description: string;
    datetime: string;
    account_id: number;
    category_id: number;
    transaction_type_id: number;
    user_id: number;
    related_transaction_id?: number;
}

export interface Transaction {
    category_id: number;
    account_id: number;
    transaction_type_id: number;
    amount: number;
    description: string;
    datetime: string;
    id: number;
    user_id: number;
    category?: string;
    account?: string;
    type: TransactionType;
    date?: string;
    time?: string;
    toAccount?: string;
    fromAccount?: string;
}

export interface Account {
    id: number;
    name: string;
    balance: number;
    user_id: number;
}

export interface Category {
    id: number;
    name: string;
    transaction_type_id: number;
    user_id: number;
}

export interface ApiMonthlySummary {
    end_balance: number;
    total_expenses: number;
    total_income: number;
    total_transfers: number;
}

export interface ApiExpensesByCategory {
    category: string;
    amount: number;
    percentage: number;
}

// Хелперы для преобразования типов
export function apiToFrontendTransaction(
    apiTransaction: ApiTransaction,
    categories: Record<number, string>,
    accounts: Record<number, string>
): Transaction {
    const typeMap = {
        1: 'income',
        2: 'expense',
        3: 'transfer'
    } as const;

    return {
        id: apiTransaction.id,
        type: typeMap[apiTransaction.transaction_type_id as 1 | 2 | 3],
        amount: apiTransaction.amount,
        category_id: apiTransaction.category_id,  // Добавляем недостающие поля
        account_id: apiTransaction.account_id,
        transaction_type_id: apiTransaction.transaction_type_id,
        datetime: apiTransaction.datetime,
        user_id: apiTransaction.user_id,
        category: categories[apiTransaction.category_id] as TransactionCategory,
        description: apiTransaction.description,
        date: apiTransaction.datetime.split(' ')[0],
        time: apiTransaction.datetime.split(' ')[1],
        account: accounts[apiTransaction.account_id],
        toAccount: accounts[apiTransaction.account_id],
        fromAccount: apiTransaction.related_transaction_id
            ? accounts[apiTransaction.related_transaction_id]
            : undefined
    };
}


export interface User {
    id: number;
    name: string;
    email: string;
}

