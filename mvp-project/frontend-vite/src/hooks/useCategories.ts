import { useState, useCallback } from 'react';
import { categoriesApi } from '@/api';
import type { Category } from '@/types/types';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
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
    }, []);

    const addCategory = useCallback(async (name: string) => {
        try {
            const response = await categoriesApi.create({ name });
            setCategories(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Ошибка при создании категории:', err);
            throw new Error('Не удалось создать категорию');
        }
    }, []);

    const updateCategory = useCallback(async (id: number, name: string) => {
        try {
            const response = await categoriesApi.update(id, { name });
            setCategories(prev =>
                prev.map(cat => cat.id === id ? response.data : cat)
            );
            return response.data;
        } catch (err) {
            console.error('Ошибка при обновлении категории:', err);
            throw new Error('Не удалось обновить категорию');
        }
    }, []);

    const deleteCategory = useCallback(async (id: number) => {
        try {
            await categoriesApi.delete(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err) {
            console.error('Ошибка при удалении категории:', err);
            throw new Error('Не удалось удалить категорию');
        }
    }, []);

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