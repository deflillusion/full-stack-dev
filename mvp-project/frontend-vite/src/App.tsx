"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "@/components/TransactionList"
import { TransactionChart } from "@/components/TransactionChart"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { AccountSelector } from "@/components/AccountSelector"
import { TabNavigation } from "@/components/TabNavigation"
import { TransactionDrawer } from "@/components/TransactionDrawer"
import type { Transaction } from "@/types/transaction"
import { saveTransactions, getTransactions } from "@/utils/localStorage"
import dayjs from "dayjs"

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAccount, setSelectedAccount] = useState("Все счета")

  useEffect(() => {
    setTransactions(getTransactions())
  }, [])

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

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
    const currentMonth = dayjs().format("YYYY-MM")
    return transactions
      .filter(
        (t) => (selectedAccount === "Все счета" || t.toAccount === selectedAccount) && t.date.startsWith(currentMonth),
      )
      .sort((a, b) => {
        const dateTimeA = dayjs(`${a.date} ${a.time}`)
        const dateTimeB = dayjs(`${b.date} ${b.time}`)
        return dateTimeB.valueOf() - dateTimeA.valueOf() // Сортировка по убыванию (новые сверху)
      })
  }, [transactions, selectedAccount])

  const accounts = useMemo(() => {
    const accountSet = new Set(transactions.map((t) => t.toAccount).filter(Boolean))
    return ["Все счета", ...Array.from(accountSet)]
  }, [transactions])

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

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

      <div className="mb-4">
        <AccountSelector accounts={accounts} selectedAccount={selectedAccount} onSelectAccount={setSelectedAccount} />
      </div>

      <div className="mb-16">
        {activeTab === "overview" && (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Финансовый обзор за {dayjs().format("MMMM YYYY")}</CardTitle>
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
                    <h3 className="text-lg font-semibold">Доходы</h3>
                    <p className="text-2xl text-green-600">{totalIncome.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">Расходы</h3>
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
      </div>

      <TransactionDrawer onSubmit={addTransaction} />
      <TabNavigation onTabChange={setActiveTab} />
    </div>
  )
}

