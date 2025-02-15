"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "@/components/TransactionList"
import { TransactionChart } from "@/components/TransactionChart"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { AccountSelector } from "@/components/AccountSelector"
import { TabNavigation } from "@/components/TabNavigation"
import { TransactionDrawer } from "@/components/TransactionDrawer"
import { MonthSelector } from "@/components/MonthSelector"
import { SettingsPage } from "@/components/SettingsPage"
import { Badge } from "@/components/ui/badge"
import type { Transaction, TransactionCategory } from "@/types/transaction"
import { saveTransactions, getTransactions } from "@/utils/localStorage"
import dayjs from "dayjs"

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAccount, setSelectedAccount] = useState("Все счета")
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"))
  const [categories, setCategories] = useState<TransactionCategory[]>([
    "food",
    "transport",
    "entertainment",
    "utilities",
    "salary",
    "other",
  ])
  const [accounts, setAccounts] = useState<string[]>(["Основной счет"])

  useEffect(() => {
    setTransactions(getTransactions())
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
    const savedAccounts = localStorage.getItem("accounts")
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    }
  }, [])

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts))
  }, [accounts])

  const addTransaction = (newTransaction: Omit<Transaction, "id">) => {
    setTransactions([...transactions, { ...newTransaction, id: Date.now() }])
  }

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t)))
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(
        (t) => (selectedAccount === "Все счета" || t.toAccount === selectedAccount) && t.date.startsWith(currentMonth),
      )
      .sort((a, b) => {
        const dateTimeA = dayjs(`${a.date} ${a.time}`)
        const dateTimeB = dayjs(`${b.date} ${b.time}`)
        return dateTimeB.valueOf() - dateTimeA.valueOf() // Сортировка по убыванию (новые сверху)
      })
  }, [transactions, selectedAccount, currentMonth])

  const balance = filteredTransactions.reduce((acc, t) => {
    if (t.type === "income") return acc + t.amount
    if (t.type === "expense") return acc - t.amount
    return acc // для переводов баланс не меняется
  }, 0)

  const categorySums = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === "expense") {
          acc[t.category] = (acc[t.category] || 0) + t.amount
        }
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredTransactions])

  const totalIncome = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === "income") return acc + t.amount
      return acc
    }, 0)
  }, [filteredTransactions])

  const totalExpenses = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === "expense") return acc + t.amount
      return acc
    }, 0)
  }, [filteredTransactions])

  const getTransactionTypeLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "income":
        return "Доход"
      case "expense":
        return "Расход"
      case "transfer":
        return "Перевод"
      default:
        return "Неизвестно"
    }
  }

  const getTransactionTypeBadgeVariant = (type: Transaction["type"]) => {
    switch (type) {
      case "income":
        return "success"
      case "expense":
        return "destructive"
      case "transfer":
        return "secondary"
      default:
        return "default"
    }
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, "month").format("YYYY-MM"))
  }

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, "month").format("YYYY-MM"))
  }

  const handleAddCategory = (newCategory: string) => {
    setCategories([...categories, newCategory as TransactionCategory])
  }

  const handleEditCategory = (oldCategory: string, newCategory: string) => {
    setCategories(categories.map((c) => (c === oldCategory ? (newCategory as TransactionCategory) : c)))
    setTransactions(
      transactions.map((t) =>
        t.category === oldCategory ? { ...t, category: newCategory as TransactionCategory } : t,
      ),
    )
  }

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter((c) => c !== categoryToDelete))
    setTransactions(transactions.map((t) => (t.category === categoryToDelete ? { ...t, category: "other" } : t)))
  }

  const handleAddAccount = (newAccount: string) => {
    setAccounts([...accounts, newAccount])
  }

  const handleEditAccount = (oldAccount: string, newAccount: string) => {
    setAccounts(accounts.map((a) => (a === oldAccount ? newAccount : a)))
    setTransactions(transactions.map((t) => (t.toAccount === oldAccount ? { ...t, toAccount: newAccount } : t)))
  }

  const handleDeleteAccount = (accountToDelete: string) => {
    setAccounts(accounts.filter((a) => a !== accountToDelete))
    setTransactions(
      transactions.map((t) => (t.toAccount === accountToDelete ? { ...t, toAccount: "Основной счет" } : t)),
    )
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

      <div className="mb-4 flex justify-between items-center">
        <AccountSelector accounts={accounts} selectedAccount={selectedAccount} onSelectAccount={setSelectedAccount} />
        <MonthSelector
          currentMonth={currentMonth}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <div className="mb-16">
        {activeTab === "overview" && (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Финансовый обзор за {dayjs(currentMonth).format("MMMM YYYY")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Баланс</h3>
                    <p className={`text-2xl ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      <Badge variant="success">Доходы</Badge>
                    </h3>
                    <p className="text-2xl text-green-600">{totalIncome.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      <Badge variant="destructive">Расходы</Badge>
                    </h3>
                    <p className="text-2xl text-red-600">{totalExpenses.toFixed(2)}</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Расходы по категориям</h3>
                <CategoryPieChart transactions={filteredTransactions} type="expense" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Расходы по категориям</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {Object.entries(categorySums)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, sum]) => (
                      <li key={category} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span>{category}</span>
                        <span>{sum.toFixed(2)}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "transactions" && (
          <TransactionList
            transactions={filteredTransactions}
            onEdit={updateTransaction}
            onDelete={deleteTransaction}
          />
        )}

        {activeTab === "chart" && (
          <Card>
            <CardContent>
              <TransactionChart transactions={filteredTransactions} />
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <SettingsPage
            categories={categories}
            accounts={accounts}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddAccount={handleAddAccount}
            onEditAccount={handleEditAccount}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </div>

      <TransactionDrawer onSubmit={addTransaction} />
      <TabNavigation onTabChange={setActiveTab} />
    </div>
  )
}

