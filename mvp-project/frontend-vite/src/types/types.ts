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

export interface ApiMonthlyStatistic {
    month: string;
    income: number;
    expense: number;
    balance: number;
}

export interface ApiAiAnalysisInsight {
    income: {
        average: number;
        trend: string;
        trend_value: number;
    };
    expense: {
        average: number;
        trend: string;
        trend_value: number;
    };
    balance: {
        average: number;
        positive_months: number;
        negative_months: number;
    };
    summary: string[];
}

export interface ApiAiSeasonalInsight {
    seasonal_data?: {
        [season: string]: {
            avg_income: number;
            avg_expense: number;
            num_months: number;
            months: string[];
        };
    };
    max_income_season?: string;
    max_expense_season?: string;
    summary: string[];
    message?: string;
}

export interface ApiAiAnomaly {
    income_anomalies: Array<{
        month: string;
        value: number;
        deviation: number;
    }>;
    expense_anomalies: Array<{
        month: string;
        value: number;
        deviation: number;
    }>;
    summary: string[];
    message?: string;
}

export interface ApiAiBudgetRecommendation {
    current_data?: {
        latest_month: string;
        avg_monthly_income: number;
        avg_monthly_expense: number;
    };
    predictions?: {
        next_month_income: number;
        next_month_expense: number;
    };
    recommendations?: {
        recommended_expense: number;
        recommended_savings: number;
    };
    summary: string[];
    message?: string;
}

// Старая версия интерфейса AI анализа
export interface ApiAiAnalysisOld {
    insights: ApiAiAnalysisInsight;
    seasonal_insights: ApiAiSeasonalInsight;
    anomalies: ApiAiAnomaly;
    budget_recommendations: ApiAiBudgetRecommendation;
}

// Новая версия интерфейса AI анализа
export interface ApiAiAnalysis {
    trends: {
        insights: string[];
        recommendations: string[];
    };
    seasonal: {
        insights: string[];
        recommendations: string[];
    };
    anomalies: {
        items: Array<{
            period: string;
            description: string;
        }>;
        recommendations: string[];
    };
    budget: {
        recommendations: string[];
        savings_potential?: string;
    };
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

