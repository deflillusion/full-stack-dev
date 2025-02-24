import { useState } from 'react';
import { statisticsApi } from '@/api';
import type { ApiExpensesByCategory, ApiMonthlySummary } from '@/types/types';

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