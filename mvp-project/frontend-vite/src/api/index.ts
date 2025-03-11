import axios from 'axios';
import type { Account, Category, Transaction } from "@/types/types";


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

// Добавляем перехватчик запросов для добавления токена Clerk
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("clerk_token");
    console.log("API запрос:", config.method?.toUpperCase(), config.url);
    console.log("Токен в localStorage:", token ? "Токен есть" : "Токен отсутствует");

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log("Добавлен заголовок Authorization");
    } else {
        console.warn("Токен отсутствует в localStorage, запрос будет отправлен без авторизации");
    }

    console.log("API заголовки:", config.headers);
    return config;
});

// Добавляем перехватчик ответов для обработки ошибок авторизации
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 (Unauthorized) и запрос еще не повторялся
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            console.log("Получена ошибка 401, пробуем обновить токен");

            try {
                // Пытаемся получить новый токен от Clerk
                // Для этого нужно использовать window.Clerk, но мы не можем напрямую импортировать его здесь
                // Поэтому просто перезагружаем страницу, чтобы App.tsx получил новый токен
                console.log("Перенаправляем пользователя на страницу входа для обновления токена");
                window.location.href = "/sign-in";
                return Promise.reject(error);
            } catch (refreshError) {
                console.error("Ошибка при обновлении токена:", refreshError);
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// API для аутентификации
export const authApi = {
    register: () => api.post('/auth/register'),
    verifyToken: () => api.post('/auth/verify-token')
};

// API для счетов
export const accountsApi = {
    getAll: () => api.get<Account[]>('/accounts/'),
    getById: (id: number) => api.get<Account>(`/accounts/${id}`),
    create: (data: { name: string; balance: number }) =>
        api.post<Account>('/accounts/', data),
    update: (id: number, data: Partial<Account>) =>
        api.put<Account>(`/accounts/${id}`, data),
    delete: (id: number) => api.delete(`/accounts/${id}`)
};

// API для статистики
export const statisticsApi = {
    getMonthlySummary: (year: number, month: number, account_id?: number) =>
        api.get('/statistic/monthly-summary/', {
            params: { year, month, account_id }
        }),
    getExpensesByCategory: (year: string, month: string, account_id?: number) =>
        api.get('/statistic/expenses-by-category/', {
            params: {
                year: parseInt(year),
                month: parseInt(month),
                account_id
            }
        }),
};

export const categoriesApi = {
    getAll: () => api.get<Category[]>('/categories'),
    create: (data: { name: string; transaction_type_id: number }) =>
        api.post<Category>('/categories', data),
    update: (id: number, data: { name: string; transaction_type_id: number }) =>
        api.put<Category>(`/categories/${id}`, data),
    delete: (id: number) => api.delete(`/categories/${id}`)
};


export const transactionsApi = {
    getAll: (params?: {
        account_id?: number;
        year?: string;
        month?: string;
    }) => api.get('/transactions/', { params }),

    getById: (id: number) => api.get(`/transactions/${id}`),

    create: (data: {
        amount: number;
        description: string;
        datetime: string;
        account_id: number;
        category_id: number;
        transaction_type_id: number;
        to_account_id?: number;
    }) => api.post('/transactions/', data),

    update: (id: number, data: Partial<Transaction>) =>
        api.put(`/transactions/${id}`, data),

    delete: (id: number) => api.delete(`/transactions/${id}`),
};


export type TransactionType = {
    id: number;
    name: string;
}

export const transactionTypesApi = {
    getAll: () => api.get<TransactionType[]>('/categories/transaction_types'),
};