"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionList } from "@/components/TransactionList"
import { TransactionChart } from "@/components/TransactionChart"
import { TabNavigation } from "@/components/TabNavigation"
import { TransactionDrawer } from "@/components/TransactionDrawer"
import type { Transaction } from "@/types/transaction"
import { saveTransactions, getTransactions } from "@/utils/localStorage"

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState("overview")

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

  const balance = transactions.reduce((acc, t) => {
    if (t.type === "income") return acc + t.amount
    if (t.type === "expense") return acc - t.amount
    return acc // для переводов баланс не меняется
  }, 0)

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

      <TabNavigation onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "overview" && (
          <Card>
            <CardHeader>
              <CardTitle>Баланс: {balance.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionChart transactions={transactions} />
            </CardContent>
          </Card>
        )}

        {activeTab === "transactions" && (
          <TransactionList transactions={transactions} onEdit={updateTransaction} onDelete={deleteTransaction} />
        )}

        {activeTab === "chart" && (
          <Card>
            <CardContent>
              <TransactionChart transactions={transactions} />
            </CardContent>
          </Card>
        )}
      </div>

      <TransactionDrawer onSubmit={addTransaction} />
    </div>
  )
}

