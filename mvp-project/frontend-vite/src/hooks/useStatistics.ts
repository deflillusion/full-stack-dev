import { useState } from 'react';
import { statisticsApi } from '@/api';
import type { ApiMonthlySummary } from '@/types/types';

export function useStatistics() {
    const [summary, setSummary] = useState<ApiMonthlySummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMonthlySummary = async (year: number, month: number, account_id?: number) => {
        try {
            setIsLoading(true);
            const response = await statisticsApi.getMonthlySummary(year, month, account_id);
            setSummary(response.data);
            return response.data;
        } catch (err) {
            setError('Ошибка при загрузке статистики');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        summary,
        isLoading,
        error,
        fetchMonthlySummary
    };
}