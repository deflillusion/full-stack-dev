import { useState } from 'react';
import { api } from '@/lib/api';

export function useAIAnalysis() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const analyzeTransactions = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const response = await api.post('/ai/analyze-transactions');
            setAnalysis(response.data.analysis);
        } catch (err) {
            setError('Ошибка при анализе транзакций');
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