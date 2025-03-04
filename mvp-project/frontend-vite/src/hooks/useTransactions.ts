import { useState, useCallback, useEffect } from 'react';
import { transactionsApi } from '@/api';
import type { Transaction } from '@/types/types';

export function useTransactions(account_id?: number, currentMonth?: string) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let params: { account_id?: number; year?: string; month?: string } = {};

            if (account_id) {
                params.account_id = account_id;
            }

            if (currentMonth) {
                const [year, month] = currentMonth.split('-').map(String);
                params.year = year;
                params.month = month;
            }

            const response = await transactionsApi.getAll(params);
            setTransactions(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Ошибка при загрузке транзакций');
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    }, [account_id, currentMonth]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = useCallback(async (data: Transaction) => {
        try {
            const response = await transactionsApi.create(data);
            fetchTransactions(); // Обновляем список транзакций после добавления
        } catch (err) {
            console.error('Error adding transaction:', err);
            throw new Error('Ошибка при добавлении транзакции');
        }
    }, [fetchTransactions]);

    const deleteTransaction = useCallback(async (id: number) => {
        try {
            await transactionsApi.delete(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting transaction:', err);
            throw new Error('Ошибка при удалении транзакции');
        }
    }, []);

    const updateTransaction = useCallback(async (id: number, data: Transaction) => {
        try {
            const response = await transactionsApi.update(id, data);
            setTransactions(prev =>
                prev.map(t => t.id === id ? response.data : t)
            );
        } catch (err) {
            console.error('Error updating transaction:', err);
            throw new Error('Ошибка при обновлении транзакции');
        }
    }, []);

    return {
        transactions,
        isLoading,
        error,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction
    };
}