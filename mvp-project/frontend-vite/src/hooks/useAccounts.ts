import { useState, useEffect } from 'react';
import { accountsApi } from '@/api';
import type { Account } from '@/types/types';

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await accountsApi.getAll();
            setAccounts(response.data);
        } catch (err) {
            setError('Ошибка при загрузке счетов');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addAccount = async (name: string, balance: number) => {
        try {
            setIsLoading(true);
            const response = await accountsApi.create({ name, balance });
            setAccounts(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError('Ошибка при создании счета');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return {
        accounts,
        isLoading,
        error,
        addAccount,
        refetch: fetchAccounts
    };
}