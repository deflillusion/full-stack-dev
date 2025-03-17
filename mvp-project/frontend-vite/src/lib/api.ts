import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем перехватчик для добавления токена авторизации
api.interceptors.request.use(async (config) => {
    // Проверяем, есть ли токен в локальном хранилище
    const token = localStorage.getItem('clerk_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}); 