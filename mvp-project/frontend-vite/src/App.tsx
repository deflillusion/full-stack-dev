"use client";

import { useState, useCallback, useEffect } from "react";
import { AccountSelector } from "@/components/AccountSelector";
import { TabNavigation } from "@/components/TabNavigation";
import { TransactionDrawer } from "@/components/TransactionDrawer";
import { MonthSelector } from "@/components/MonthSelector";
import { SettingsPage } from "@/components/SettingsPage";
import { OverviewTab } from "@/components/OverviewTab";
import { TransactionsTab } from "@/components/TransactionsTab";
import { ChartTab } from "@/components/ChartTab";
import { useAccounts } from "@/hooks/useAccounts";
import { transactionsApi } from "@/api"; // Импортируем напрямую API
import dayjs from "dayjs";
import { Toaster } from "@/components/ui/toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { Transaction } from "@/types/types";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import AuthPage from "@/pages/AuthPage";
import { authApi } from "@/api"; // Импортируем новый API
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Outlet, Route, Routes } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Authenticated,
  ClerkProvider,
  RedirectToSignIn,
} from "@clerk/clerk-react";


export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAccount, setSelectedAccount] = useState("Все счета");
  const { accounts, isLoading: isLoadingAccounts, error: accountsError } = useAccounts();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [shouldRefreshTransactions, setShouldRefreshTransactions] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [refreshDate, setRefreshDate] = useState(new Date());

  // Получаем токен Clerk
  const { getToken, isSignedIn } = useAuth();

  // Функция для обновления списка транзакций
  const refreshTransactions = useCallback(() => {
    setShouldRefreshTransactions(prev => prev + 1);
  }, []);

  // Функция для обновления токена
  const updateToken = async () => {
    if (isSignedIn) {
      try {
        // Используем шаблон LongLivedToken для получения токена с длительным сроком действия
        const token = await getToken({ template: "LongLivedToken" });
        console.log("Обновление токена:", token ? "Токен получен" : "Токен отсутствует");

        if (token) {
          localStorage.setItem("clerk_token", token);
          console.log("Токен обновлен в localStorage");
        }
      } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
      }
    }
  };

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const checkToken = async () => {
      if (isSignedIn) {
        try {
          // Используем шаблон LongLivedToken для получения токена с длительным сроком действия
          const token = await getToken({ template: "LongLivedToken" });
          console.log("App: Токен получен:", token ? token.substring(0, 20) + "..." : "Токен отсутствует");

          if (token) {
            localStorage.setItem("clerk_token", token);
            console.log("App: Токен сохранен в localStorage");
            console.log("App: Проверка токена в localStorage:", localStorage.getItem("clerk_token") ? "Токен есть" : "Токен отсутствует");

            // Проверяем токен на бэкенде
            try {
              const response = await authApi.verifyToken();
              console.log("App: Токен успешно проверен на бэкенде", response);
            } catch (error) {
              console.error("App: Ошибка при проверке токена на бэкенде:", error);
            }
          }
        } catch (error) {
          console.error("App: Ошибка получения токена Clerk:", error);
        }
      } else {
        console.log("App: Пользователь не вошел");
      }
    };

    checkToken();

    // Настраиваем периодическое обновление токена каждые 5 минут
    const tokenRefreshInterval = setInterval(updateToken, 5 * 60 * 1000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(tokenRefreshInterval);
  }, [getToken, isSignedIn]);

  // Обработчики для переключения месяцев
  const handlePreviousMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, "month").format("YYYY-MM"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, "month").format("YYYY-MM"));
  };

  // Обновление всех данных при изменении месяца
  useEffect(() => {
    setRefreshDate(new Date());
  }, [selectedMonth]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="expense-tracker-theme">
      <ErrorBoundary>
        <SignedIn>
          <div className="min-h-screen bg-background">
            <div className="container max-w-[1152px] mx-auto p-4 pb-20 md:pb-4 md:pl-20">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Учет расходов и доходов</h1>
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>

              <div className="mb-6 flex flex-row justify-between items-center">
                <AccountSelector
                  accounts={accounts || []}
                  selectedAccount={selectedAccount}
                  onSelectAccount={setSelectedAccount}
                  isLoading={isLoadingAccounts}
                  error={accountsError}
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
                    onEdit={() => { }}
                    onDelete={() => { }}
                    refreshTrigger={shouldRefreshTransactions}
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

            <TransactionDrawer
              accounts={accounts || []}
              selectedAccount={selectedAccount}
              currentMonth={currentMonth}
              onTransactionAdded={refreshTransactions}
            />
            <TabNavigation onTabChange={setActiveTab} />
          </div>
        </SignedIn>
        <SignedOut>
          <AuthPage />
        </SignedOut>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
