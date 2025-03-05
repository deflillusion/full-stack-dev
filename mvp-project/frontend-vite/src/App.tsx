"use client"

import { useState, useCallback } from "react"
import { AccountSelector } from "@/components/AccountSelector"
import { TabNavigation } from "@/components/TabNavigation"
import { TransactionDrawer } from "@/components/TransactionDrawer"
import { MonthSelector } from "@/components/MonthSelector"
import { SettingsPage } from "@/components/SettingsPage"
import { OverviewTab } from "@/components/OverviewTab"
import { TransactionsTab } from "@/components/TransactionsTab"
import { ChartTab } from "@/components/ChartTab"
import { useAccounts } from "@/hooks/useAccounts"
import { transactionsApi } from '@/api' // Импортируем напрямую API
import dayjs from "dayjs"
import { Toaster } from "sonner"
import ErrorBoundary from "@/components/ErrorBoundary"
import type { Transaction } from "@/types/types"

export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedAccount, setSelectedAccount] = useState("Все счета")
  const { accounts, isLoading, error } = useAccounts()
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"))

  // Оптимизированный fetchTransactions с использованием useCallback
  const fetchTransactions = useCallback(async () => {
    try {
      const params: {
        account_id?: number;
        year?: string;
        month?: string
      } = {};

      if (selectedAccount !== "Все счета") {
        const accountId = accounts?.find(a => a.name === selectedAccount)?.id;
        if (accountId) {
          params.account_id = accountId;
        }
      }

      const [year, month] = currentMonth.split('-').map(String);
      params.year = year;
      params.month = month;

      // Возвращаем результат вызова API
      return await transactionsApi.getAll(params);
    } catch (error) {
      console.error("Ошибка при загрузке транзакций:", error);
      throw error;
    }
  }, [selectedAccount, currentMonth, accounts]);

  // Обработчики для переключения месяцев
  const handlePreviousMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, "month").format("YYYY-MM"))
  }

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, "month").format("YYYY-MM"))
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 pb-20 md:pb-4 md:pl-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Учет расходов и доходов</h1>

            <div className="mb-4 flex justify-between items-center">
              <AccountSelector
                accounts={accounts || []}
                selectedAccount={selectedAccount}
                onSelectAccount={setSelectedAccount}
                isLoading={isLoading}
                error={error}
              />
              <MonthSelector
                currentMonth={currentMonth}
                onPreviousMonth={handlePreviousMonth}
                onNextMonth={handleNextMonth}
              />
            </div>

            <div className="mb-28 md:mb-4">
              {activeTab === "overview" && (
                <OverviewTab
                  currentMonth={currentMonth}
                  selectedAccount={selectedAccount}
                  accounts={accounts || []}
                />
              )}

              {activeTab === "transactions" && (
                <TransactionsTab
                  currentMonth={currentMonth}
                  selectedAccount={selectedAccount}
                  accounts={accounts || []}
                />
              )}

              {activeTab === "chart" && (
                <ChartTab
                  currentMonth={currentMonth}
                  selectedAccount={selectedAccount}
                  accounts={accounts || []}
                />
              )}

              {activeTab === "settings" && (
                <div className="max-w-6xl mx-auto">
                  <SettingsPage />
                </div>
              )}
            </div>
          </div>
        </div>

        <TransactionDrawer
          accounts={accounts || []}
          fetchTransactions={fetchTransactions}
        />
        <TabNavigation onTabChange={setActiveTab} />
      </div>
      <Toaster richColors />
    </ErrorBoundary>
  )
}