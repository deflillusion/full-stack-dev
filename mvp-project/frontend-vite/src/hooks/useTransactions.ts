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

            console.log('Запрос транзакций с параметрами:', { account_id, currentMonth, params });
            const response = await transactionsApi.getAll(params);
            console.log('Получены транзакции:', response.data);
            setTransactions(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Ошибка при загрузке транзакций');
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    }, [account_id, currentMonth, isSignedIn]);

    // Загружаем транзакции при монтировании компонента и при изменении параметров
    useEffect(() => {
        console.log('useEffect: Изменились параметры запроса:', { account_id, currentMonth });
        if (isSignedIn) {
            fetchTransactions();
        } else {
            setTransactions([]);
        }
    }, [account_id, currentMonth, fetchTransactions, isSignedIn]);

    const addTransaction = useCallback(async (data: Transaction) => {
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            console.log('Добавление новой транзакции:', data);
            const response = await transactionsApi.create(data);
            console.log('Транзакция успешно добавлена:', response.data);

            // Обновляем список транзакций
            await fetchTransactions();
            return response.data;
        } catch (err) {
            console.error('Error adding transaction:', err);
            throw new Error('Ошибка при добавлении транзакции');
        }
    }, [fetchTransactions, isSignedIn]);

    const deleteTransaction = useCallback(async (id: number) => {
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            console.log('Удаление транзакции:', id);
            await transactionsApi.delete(id);
            console.log('Транзакция успешно удалена');
            await fetchTransactions();
        } catch (err) {
            console.error('Error deleting transaction:', err);
            throw new Error('Ошибка при удалении транзакции');
        }
    }, [fetchTransactions, isSignedIn]);

    const updateTransaction = useCallback(async (id: number, data: Transaction) => {
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            console.log('Обновление транзакции:', { id, data });
            await transactionsApi.update(id, data);
            console.log('Транзакция успешно обновлена');
            await fetchTransactions();
        } catch (err) {
            console.error('Error updating transaction:', err);
            throw new Error('Ошибка при обновлении транзакции');
        }
    }, [fetchTransactions, isSignedIn]);

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