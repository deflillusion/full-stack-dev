import { useState, useEffect, useCallback } from 'react';
import { accountsApi, DeleteResponse } from '@/api';
import type { Account } from '@/types/types';
import { useAuth, useUser } from '@clerk/clerk-react';

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isSignedIn } = useUser();
    const { getToken } = useAuth();

    const fetchAccounts = useCallback(async () => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.log('Пользователь не авторизован, запросы счетов не отправляются');
            setIsLoading(false);
            return;
        }

        // Проверяем наличие токена
        const token = localStorage.getItem("clerk_token");
        if (!token) {
            console.log('Токен отсутствует, запросы счетов не отправляются');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await accountsApi.getAll();
            setAccounts(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке счетов:', err);
            setError('Не удалось загрузить счета');
        } finally {
            setIsLoading(false);
        }
    }, [isSignedIn]);

    useEffect(() => {
        // Запрашиваем данные только если пользователь авторизован
        if (isSignedIn) {
            fetchAccounts();
        } else {
            // Если пользователь не авторизован, очищаем данные
            setAccounts([]);
            setIsLoading(false);
        }
    }, [fetchAccounts, isSignedIn]);

    const addAccount = useCallback(async (data: { name: string; balance: number }) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            const response = await accountsApi.create(data);
            setAccounts(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Ошибка при создании счета:', err);
            throw new Error('Не удалось создать счет');
        }
    }, [isSignedIn]);

    const updateAccount = useCallback(async (id: number, data: Partial<Account>) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            const response = await accountsApi.update(id, data);
            setAccounts(prev =>
                prev.map(account => account.id === id ? response.data : account)
            );
            return response.data;
        } catch (err) {
            console.error('Ошибка при обновлении счета:', err);
            throw new Error('Не удалось обновить счет');
        }
    }, [isSignedIn]);

    const deleteAccount = useCallback(async (id: number) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            const result: DeleteResponse = await accountsApi.delete(id);

            // Проверяем результат операции
            if (!result.success) {
                console.error('Ошибка при удалении счета:', result.error);
                throw new Error(result.error || 'Не удалось удалить счет с существующими транзакциями');
            }

            // Если успешно, обновляем состояние
            setAccounts(prev => prev.filter(account => account.id !== id));
            return true;
        } catch (err) {
            console.error('Ошибка при удалении счета:', err);
            throw err instanceof Error ? err : new Error('Не удалось удалить счет');
        }
    }, [isSignedIn]);

    return {
        accounts,
        isLoading,
        error,
        fetchAccounts,
        addAccount,
        updateAccount,
        deleteAccount
    };
}