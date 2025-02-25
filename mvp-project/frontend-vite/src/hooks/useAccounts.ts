import { useState, useEffect, useCallback } from 'react';
import { accountsApi } from '@/api';
import type { Account } from '@/types/types';

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = useCallback(async () => {
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
    }, []);

    const addAccount = useCallback(async (data: { name: string; balance: number }) => {
        try {
            const response = await accountsApi.create(data);
            setAccounts(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Ошибка при создании счета:', err);
            throw new Error('Не удалось создать счет');
        }
    }, []);

    const updateAccount = useCallback(async (id: number, data: Partial<Account>) => {
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
    }, []);

    const deleteAccount = useCallback(async (id: number) => {
        try {
            await accountsApi.delete(id);
            setAccounts(prev => prev.filter(account => account.id !== id));
        } catch (err) {
            console.error('Ошибка при удалении счета:', err);
            throw new Error('Не удалось удалить счет');
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return {
        accounts,
        isLoading,
        error,
        refetchAccounts: fetchAccounts,
        addAccount,
        updateAccount,
        deleteAccount
    };
}