import { useState } from 'react';
import { api } from '@/lib/api';
import { ApiAiAnalysis } from '@/types/types';

export function useAIAnalysis() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<ApiAiAnalysis | null>(null);

    const analyzeTransactions = async (accountId?: number, categoryId?: number, currentMonth?: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            // Подготовка параметров запроса
            const params: Record<string, string | number> = {};
            if (accountId) params.account_id = accountId;
            if (categoryId) params.category_id = categoryId;
            if (currentMonth) params.current_month = currentMonth;

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

    return {
        analyzeTransactions,
        isLoading,
        error,
        analysis
    };
} 