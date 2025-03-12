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
import { Toaster } from "sonner";
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


export default function ExpenseTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAccount, setSelectedAccount] = useState("Все счета");
  const { accounts, isLoading, error } = useAccounts();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));

  // Получаем токен Clerk
  const { getToken, isSignedIn } = useAuth();

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

  // Оптимизированный fetchTransactions с использованием useCallback
  const fetchTransactions = useCallback(async () => {
    try {
      const params: {
        account_id?: number;
        year?: string;
        month?: string;
      } = {};

      if (selectedAccount !== "Все счета") {
        const accountId = accounts?.find((a) => a.name === selectedAccount)?.id;
        if (accountId) {
          params.account_id = accountId;
        }
      }

      const [year, month] = currentMonth.split("-").map(String);
      params.year = year;
      params.month = month;

      // Токен теперь добавляется автоматически в перехватчике запросов
      return await transactionsApi.getAll(params);
    } catch (error) {
      console.error("Ошибка при загрузке транзакций:", error);
      throw error;
    }
  }, [selectedAccount, currentMonth, accounts]);

  // Обработчики для переключения месяцев
  const handlePreviousMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, "month").format("YYYY-MM"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, "month").format("YYYY-MM"));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 pb-20 md:pb-4 md:pl-20">
          <div className="max-w-6xl mx-auto">

            <SignedOut>
              <AuthPage />
            </SignedOut>

            <SignedIn>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Учет расходов и доходов</h1>
                <UserButton />
              </div>

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
                    onEdit={() => { }}
                    onDelete={() => { }}
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
            </SignedIn>
          </div>
        </div>

        <SignedIn>
          <TransactionDrawer
            accounts={accounts || []}
          />
          <TabNavigation onTabChange={setActiveTab} />
        </SignedIn>
      </div>
      <Toaster richColors />
    </ErrorBoundary>
  );
}
