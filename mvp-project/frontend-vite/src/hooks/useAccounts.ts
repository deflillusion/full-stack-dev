import { useState, useEffect } from 'react';
import { accountsApi } from '@/api';
import type { Account } from '@/types/types';

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await accountsApi.getAll();
            setAccounts(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке счетов:', err);
            setError('Не удалось загрузить счета');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return { accounts, isLoading, error, refetchAccounts: fetchAccounts };
}