import type { Transaction } from "../types/transaction"

export const saveTransactions = (transactions: Transaction[]) => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

export const getTransactions = (): Transaction[] => {
    const transactions = localStorage.getItem("transactions")
    return transactions ? JSON.parse(transactions) : []
}

