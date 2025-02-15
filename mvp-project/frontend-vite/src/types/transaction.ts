export type TransactionType = "income" | "expense" | "transfer"

export type TransactionCategory = "food" | "transport" | "entertainment" | "utilities" | "salary" | "other"

export interface Transaction {
    id: number
    description: string
    amount: number
    type: TransactionType
    category: TransactionCategory
    date: string
    time: string
    toAccount?: string
}

