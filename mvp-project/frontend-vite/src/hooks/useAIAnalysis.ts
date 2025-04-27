import { useState } from 'react';
import { api } from '@/lib/api';
import { ApiAiAnalysis } from '@/types/types';

export function useAIAnalysis() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<ApiAiAnalysis | null>(null);

    // Анализ транзакций за 12 месяцев (для годового графика)
    const analyzeTransactions = async (accountId?: number, categoryId?: number, currentMonth?: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            // Подготовка параметров запроса
            const params: Record<string, string | number> = {};
            if (accountId) params.account_id = accountId;
            if (categoryId) params.category_id = categoryId;
            if (currentMonth) {
                params.current_month = currentMonth;
                params.monthly_only = "true";
            }

            // Отправка запроса на сервер для глубокого анализа с помощью ChatGPT
            const response = await api.post('/ai/analyze-transactions', params);

            if (response.data && typeof response.data === 'object') {
                setAnalysis(response.data);
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (err: any) {
            setError(err.message || 'Ошибка при анализе транзакций');
            console.error('Ошибка при анализе транзакций:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Новая функция для анализа только транзакций за текущий месяц (для месячного графика)
    const analyzeMonthlyTransactions = async (accountId?: number, categoryId?: number, currentMonth?: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            // Подготовка параметров запроса
            const params: Record<string, string | number> = {};
            if (accountId) params.account_id = accountId;
            if (categoryId) params.category_id = categoryId;
            if (currentMonth) {
                params.current_month = currentMonth;
                params.monthly_only = "true";
            }

            // Отправка запроса на сервер для анализа месячных данных
            const response = await api.post('/ai/analyze-transactions', params);

            if (response.data && typeof response.data === 'object') {
                setAnalysis(response.data);
            } else {
                throw new Error('Неверный формат данных от сервера');
            }
        } catch (err: any) {
            setError(err.message || 'Ошибка при анализе транзакций');
            console.error('Ошибка при анализе месячных транзакций:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        analyzeTransactions,
        analyzeMonthlyTransactions,
        isLoading,
        error,
        analysis
    };
} 