"use client"

import { useState, useEffect, useMemo } from "react"
import { AccountSelector } from "@/components/AccountSelector"
import { TabNavigation } from "@/components/TabNavigation"
import { TransactionDrawer } from "@/components/TransactionDrawer"
import { MonthSelector } from "@/components/MonthSelector"
import { SettingsPage } from "@/components/SettingsPage"
import { OverviewTab } from "@/components/OverviewTab"
import { TransactionsTab } from "@/components/TransactionsTab"
import { ChartTab } from "@/components/ChartTab"
import type { Transaction, TransactionCategory } from "@/types/types"
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
      const parsedAccounts = JSON.parse(savedAccounts)
      setAccounts(parsedAccounts.length > 0 ? parsedAccounts : ["Основной счет"])
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
        return dateTimeB.valueOf() - dateTimeA.valueOf()
      })
  }, [transactions, selectedAccount, currentMonth])

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 pb-20 md:pb-4 md:pl-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

          <div className="mb-4 flex justify-between items-center">
            <AccountSelector
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelectAccount={setSelectedAccount}
            />
            <MonthSelector
              currentMonth={currentMonth}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />
          </div>

          <div className="mb-28 md:mb-4">
            {activeTab === "overview" && (
              <OverviewTab transactions={filteredTransactions} currentMonth={currentMonth} />
            )}

            {activeTab === "transactions" && (
              <TransactionsTab
                transactions={filteredTransactions}
                onEdit={updateTransaction}
                onDelete={deleteTransaction}
              />
            )}

            {activeTab === "chart" && <ChartTab transactions={filteredTransactions} />}

            {activeTab === "settings" && (
              <div className="max-w-2xl mx-auto">
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
              </div>
            )}
          </div>
        </div>
      </div>

      <TransactionDrawer onSubmit={addTransaction} accounts={accounts} />
      <TabNavigation onTabChange={setActiveTab} />
    </div>
  )
}

