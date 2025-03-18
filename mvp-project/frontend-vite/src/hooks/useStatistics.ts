import { useState, useCallback } from 'react';
import { statisticsApi } from '@/api';
import type { ApiExpensesByCategory, ApiMonthlySummary, ApiMonthlyStatistic, ApiAiAnalysis } from '@/types/types';

export function useStatistics() {
    const [summary, setSummary] = useState<ApiMonthlySummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMonthlySummary = async (year: string, month: string, account_id?: number) => {
        try {
            setIsLoading(true);
            const response = await statisticsApi.getMonthlySummary(
                parseInt(year),
                parseInt(month),
                account_id
            );
            setSummary(response.data);
        } catch (err) {
            setError('Ошибка при загрузке статистики');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { summary, isLoading, error, fetchMonthlySummary };
}


export function useExpensesByCategory() {
    const [expenses, setExpenses] = useState<ApiExpensesByCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchExpensesByCategory = async (year: string, month: string, account_id?: number) => {
        try {
            setIsLoading(true);
            const response = await statisticsApi.getExpensesByCategory(year, month, account_id);
            setExpenses(response.data);
        } catch (err) {
            setError('Ошибка при загрузке расходов по категориям');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return { expenses, isLoading, error, fetchExpensesByCategory };
}

export function useLast12MonthsStatistics() {
    const [monthlyData, setMonthlyData] = useState<ApiMonthlyStatistic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLast12MonthsData = useCallback((
        currentMonth: string,
        account_id?: number,
        category_id?: number
    ) => {
        // Создаём новый контроллер для управления абортом
        const controller = new AbortController();
        const signal = controller.signal;

        // Немедленно выполняем запрос в асинхронной функции
        (async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await statisticsApi.getLast12Months(
                    currentMonth,
                    account_id,
                    category_id,
                    signal // Передаём сигнал для возможности отмены запроса
                );

                // Проверяем, что запрос не был отменён
                if (!signal.aborted) {
                    setMonthlyData(response.data);
                }
            } catch (err: any) { // Указываем тип any для обработки разных типов ошибок
                // Проверяем, не является ли ошибка результатом отмены запроса
                // Обработка ошибок отмены для axios (CanceledError) и fetch (AbortError)
                if (
                    !(err instanceof DOMException && err.name === 'AbortError') &&
                    !(err.name === 'CanceledError') &&
                    !(err.code === 'ERR_CANCELED')
                ) {
                    setError('Ошибка при загрузке статистики за 12 месяцев');
                    console.error(err);
                } else {
                    console.log('Запрос был отменён пользователем при навигации');
                }
            } finally {
                if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        })();

        // Сразу возвращаем функцию для отмены запроса
        return () => {
            controller.abort();
        };
    }, []);

    return { monthlyData, isLoading, error, fetchLast12MonthsData };
}

export function useAiAnalysis() {
    const [analysisData, setAnalysisData] = useState<ApiAiAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAiAnalysis = useCallback((
        currentMonth: string,
        account_id?: number,
        category_id?: number
    ) => {
        // Создаём новый контроллер для управления абортом
        const controller = new AbortController();
        const signal = controller.signal;

        // Немедленно выполняем запрос в асинхронной функции
        (async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await statisticsApi.getAiAnalysis(
                    currentMonth,
                    account_id,
                    category_id,
                    signal // Передаём сигнал для возможности отмены запроса
                );

                // Проверяем, что запрос не был отменён
                if (!signal.aborted) {
                    setAnalysisData(response.data);
                }
            } catch (err: any) { // Указываем тип any для обработки разных типов ошибок
                // Проверяем, не является ли ошибка результатом отмены запроса
                // Обработка ошибок отмены для axios (CanceledError) и fetch (AbortError)
                if (
                    !(err instanceof DOMException && err.name === 'AbortError') &&
                    !(err.name === 'CanceledError') &&
                    !(err.code === 'ERR_CANCELED')
                ) {
                    setError('Ошибка при получении ИИ-анализа');
                    console.error(err);
                } else {
                    console.log('Запрос был отменён пользователем при навигации');
                }
            } finally {
                if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        })();

        // Сразу возвращаем функцию для отмены запроса
        return () => {
            controller.abort();
        };
    }, []);

    return { analysisData, isLoading, error, fetchAiAnalysis };
}