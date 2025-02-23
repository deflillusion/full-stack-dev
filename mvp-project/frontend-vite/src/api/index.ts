import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Интерцептор для токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API для транзакций
export const transactionsApi = {
    getAll: () => api.get('/transactions/'),
    create: (data: {
        amount: number;
        description: string;
        datetime: string;
        account_id: number;
        category_id: number;
        transaction_type_id: number;
        to_account_id?: number;
    }) => api.post('/transactions/', data),
    update: (id: number, data: any) => api.put(`/transactions/${id}`, data),
    delete: (id: number) => api.delete(`/transactions/${id}`),
};

// API для счетов
export const accountsApi = {
    getAll: () => api.get('/accounts/'),
    create: (data: { name: string; balance: number }) =>
        api.post('/accounts/', data),
};

// API для статистики
export const statisticsApi = {
    getMonthlySummary: (year: number, month: number, account_id?: number) =>
        api.get('/statistic/monthly-summary/', {
            params: { year, month, account_id }
        }),
};

export const categoriesApi = {
    getAll: () => api.get('/categories/'),
    create: (data: { name: string }) => api.post('/categories/', data),
};