"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionForm } from "@/components/TransactionForm"
import { TransactionList } from "@/components/TransactionList"
import { TransactionChart } from "@/components/TransactionChart"
import type { Transaction } from "@/types/types"
import type { Account } from "@/types/types"
import type { Category } from "@/types/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExpenseTracker() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [filter, setFilter] = useState({ type: "all", category: "all", startDate: "", endDate: "" })

    useEffect(() => {
        const savedTransactions = localStorage.getItem("transactions")
        const savedAccounts = localStorage.getItem("accounts")
        const savedCategories = localStorage.getItem("categories")
        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions))
        }
        if (savedAccounts) {
            setAccounts(JSON.parse(savedAccounts))
        }
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions))
    }, [transactions])

    const addTransaction = (newTransaction: Omit<Transaction, "id">) => {
        const transaction = { ...newTransaction, id: Date.now() }
        setTransactions([...transactions, transaction])
        updateAccountBalances(transaction)
    }

    const updateTransaction = (updatedTransaction: Transaction) => {
        const oldTransaction = transactions.find((t) => t.id === updatedTransaction.id)
        if (oldTransaction) {
            // Revert the old transaction
            updateAccountBalances({ ...oldTransaction, amount: -oldTransaction.amount })
            // Apply the new transaction
            updateAccountBalances(updatedTransaction)
        }
        setTransactions(transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)))
        setEditingTransaction(null)
    }

    const deleteTransaction = (id: number) => {
        const transactionToDelete = transactions.find((t) => t.id === id)
        if (transactionToDelete) {
            updateAccountBalances({ ...transactionToDelete, amount: -transactionToDelete.amount })
        }
        setTransactions(transactions.filter((t) => t.id !== id))
    }

    const updateAccountBalances = (transaction: Transaction) => {
        setAccounts(
            accounts.map((account) => {
                if (account.id === transaction.fromAccount) {
                    return { ...account, balance: account.balance - transaction.amount }
                }
                if (transaction.type === "transfer" && account.id === transaction.toAccount) {
                    return { ...account, balance: account.balance + transaction.amount }
                }
                return account
            }),
        )
    }

    const filteredTransactions = transactions.filter(
        (t) =>
            (filter.type === "all" || t.type === filter.type) &&
            (filter.category === "all" || t.category === filter.category) &&
            (!filter.startDate || t.date >= filter.startDate) &&
            (!filter.endDate || t.date <= filter.endDate),
    )

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Общий баланс: {totalBalance.toFixed(2)}</h2>
                <div className="space-x-2">
                    <a href="/Accounts">
                        <Button>Управление счетами</Button>
                    </a>
                    <a href="/Categories">
                        <Button>Управление категориями</Button>
                    </a>
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{editingTransaction ? "Редактировать транзакцию" : "Добавить новую транзакцию"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionForm
                        onSubmit={editingTransaction ? updateTransaction : addTransaction}
                        initialData={editingTransaction || undefined}
                    />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="type-filter">Тип</Label>
                        <Select value={filter.type} onValueChange={(value) => setFilter({ ...filter, type: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все</SelectItem>
                                <SelectItem value="income">Доходы</SelectItem>
                                <SelectItem value="expense">Расходы</SelectItem>
                                <SelectItem value="transfer">Переводы</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="category-filter">Категория</Label>
                        <Select value={filter.category} onValueChange={(value) => setFilter({ ...filter, category: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="start-date">Начальная дата</Label>
                        <Input
                            id="start-date"
                            type="date"
                            value={filter.startDate}
                            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="end-date">Конечная дата</Label>
                        <Input
                            id="end-date"
                            type="date"
                            value={filter.endDate}
                            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>График доходов и расходов</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionChart transactions={filteredTransactions} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Список транзакций</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionList
                        transactions={filteredTransactions}
                        onEdit={setEditingTransaction}
                        onDelete={deleteTransaction}
                        accounts={accounts}
                        categories={categories}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

