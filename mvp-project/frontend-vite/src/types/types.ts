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
    id: number;
    type: "income" | "expense" | "transfer";
    amount: number;
    description: string;
    date: string;
    time: string;
    category: string;
    toAccount: string;
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
        category: categories[apiTransaction.category_id] as TransactionCategory,
        description: apiTransaction.description,
        date: apiTransaction.datetime.split(' ')[0],
        time: apiTransaction.datetime.split(' ')[1],
        toAccount: accounts[apiTransaction.account_id],
        fromAccount: apiTransaction.related_transaction_id ?
            accounts[apiTransaction.related_transaction_id] : undefined
    };
}

export interface Account {
    id: number;
    name: string;
    balance: number;
    user_id: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

