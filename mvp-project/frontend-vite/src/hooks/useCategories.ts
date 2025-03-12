import { useState, useCallback, useEffect } from 'react';
import { categoriesApi } from '@/api';
import type { Category } from '@/types/types';
import { useAuth, useUser } from '@clerk/clerk-react';


type CategoryCreateData = {
    name: string;
    transaction_type_id: number;
}

type CategoryUpdateData = {
    name: string;
    transaction_type_id: number;
}


export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isSignedIn } = useUser();
    const { getToken } = useAuth();

    const fetchCategories = useCallback(async () => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.log('Пользователь не авторизован, запросы категорий не отправляются');
            setIsLoading(false);
            return;
        }

        // Проверяем наличие токена
        const token = localStorage.getItem("clerk_token");
        if (!token) {
            console.log('Токен отсутствует, запросы категорий не отправляются');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await categoriesApi.getAll();
            setCategories(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке категорий:', err);
            setError('Не удалось загрузить категории');
        } finally {
            setIsLoading(false);
        }
    }, [isSignedIn]);


    useEffect(() => {
        // Запрашиваем данные только если пользователь авторизован
        if (isSignedIn) {
            fetchCategories();
        } else {
            // Если пользователь не авторизован, очищаем данные
            setCategories([]);
            setIsLoading(false);
        }
    }, [fetchCategories, isSignedIn]);

    const addCategory = useCallback(async (data: CategoryCreateData) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            const response = await categoriesApi.create(data);
            setCategories(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Ошибка при создании категории:', err);
            throw new Error('Не удалось создать категорию');
        }
    }, [isSignedIn]);

    const updateCategory = useCallback(async (id: number, data: CategoryUpdateData) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            const response = await categoriesApi.update(id, data);
            setCategories(prev =>
                prev.map(cat => cat.id === id ? response.data : cat)
            );
            return response.data;
        } catch (err) {
            console.error('Ошибка при обновлении категории:', err);
            throw new Error('Не удалось обновить категорию');
        }
    }, [isSignedIn]);

    const deleteCategory = useCallback(async (id: number) => {
        // Проверяем, авторизован ли пользователь
        if (!isSignedIn) {
            console.error('Пользователь не авторизован');
            throw new Error('Необходимо авторизоваться');
        }

        try {
            await categoriesApi.delete(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err) {
            console.error('Ошибка при удалении категории:', err);
            throw new Error('Не удалось удалить категорию');
        }
    }, [isSignedIn]);



    return {
        categories,
        isLoading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
    };
}