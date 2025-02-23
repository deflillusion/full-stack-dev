import { useState, useEffect } from 'react';
import { transactionsApi } from '@/api';
import type { Transaction, ApiTransaction } from '@/types/types';

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const response = await transactionsApi.getAll();
            setTransactions(response.data);
        } catch (err) {
            setError('Ошибка при загрузке транзакций');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addTransaction = async (transaction: Omit<ApiTransaction, 'id' | 'user_id'>) => {
        try {
            setIsLoading(true);
            const response = await transactionsApi.create(transaction);
            setTransactions(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError('Ошибка при создании транзакции');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTransaction = async (id: number) => {
        try {
            setIsLoading(true);
            await transactionsApi.delete(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError('Ошибка при удалении транзакции');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return {
        transactions,
        isLoading,
        error,
        addTransaction,
        deleteTransaction,
        refetch: fetchTransactions
    };
}