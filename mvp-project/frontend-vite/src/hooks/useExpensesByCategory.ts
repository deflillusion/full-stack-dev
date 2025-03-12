import { useState } from 'react';
import { statisticsApi } from '@/api';
import type { ApiExpensesByCategory } from '@/types/types';
import { useAuth, useUser } from '@clerk/clerk-react';

export function useExpensesByCategory() {
    const [expenses, setExpenses] = useState<ApiExpensesByCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isSignedIn } = useUser();

    const fetchExpensesByCategory = async (year: string, month: string, account_id?: number) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.log('Пользователь не авторизован, запросы статистики не отправляются');
            return;
        }

        // Проверяем наличие токена
        const token = localStorage.getItem("clerk_token");
        if (!token) {
            console.log('Токен отсутствует, запросы статистики не отправляются');
            return;
        }

        try {
            setIsLoading(true);
            setError(null); // Сбрасываем ошибку перед новым запросом
            console.log('Fetching expenses for:', { year, month, account_id }); // Отладка
            const response = await statisticsApi.getExpensesByCategory(year, month, account_id);
            console.log('Response:', response.data); // Отладка
            setExpenses(response.data);
        } catch (err) {
            console.error('Error details:', err); // Расширенный лог ошибки
            setError('Ошибка при загрузке расходов по категориям');
            setExpenses([]); // Очищаем данные при ошибке
        } finally {
            setIsLoading(false);
        }
    };

    return {
        expenses,
        isLoading,
        error,
        fetchExpensesByCategory
    };
}