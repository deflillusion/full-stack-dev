import { useState, useCallback, useEffect } from 'react';
import { transactionsApi } from '@/api';
import type { Transaction } from '@/types/types';
import { useAuth, useUser } from '@clerk/clerk-react';

export function useTransactions(account_id?: number, currentMonth?: string) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isSignedIn } = useUser();
    const { getToken } = useAuth();

    const fetchTransactions = useCallback(async () => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.log('Пользователь не авторизован, запросы не отправляются');
            return;
        }

        // Проверяем наличие токена
        const token = localStorage.getItem("clerk_token");
        if (!token) {
            console.log('Токен отсутствует, запросы не отправляются');
            return;
        }

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
    }, [account_id, currentMonth, isSignedIn]);

    useEffect(() => {
        // Запрашиваем данные только если пользователь авторизован
        if (isSignedIn) {
            fetchTransactions();
        } else {
            // Если пользователь не авторизован, очищаем данные
            setTransactions([]);
        }
    }, [fetchTransactions, isSignedIn]);

    const addTransaction = useCallback(async (data: Transaction) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            const response = await transactionsApi.create(data);
            // Добавляем новую транзакцию в локальный список без повторного запроса
            setTransactions(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error adding transaction:', err);
            throw new Error('Ошибка при добавлении транзакции');
        }
    }, [fetchTransactions, isSignedIn]);

    const deleteTransaction = useCallback(async (id: number) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            await transactionsApi.delete(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting transaction:', err);
            throw new Error('Ошибка при удалении транзакции');
        }
    }, [isSignedIn]);

    const updateTransaction = useCallback(async (id: number, data: Transaction) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            const response = await transactionsApi.update(id, data);
            setTransactions(prev =>
                prev.map(t => t.id === id ? response.data : t)
            );
        } catch (err) {
            console.error('Error updating transaction:', err);
            throw new Error('Ошибка при обновлении транзакции');
        }
    }, [isSignedIn]);

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