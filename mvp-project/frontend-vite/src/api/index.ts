import axios from 'axios';

const API_URL = 'http://localhost:8000';

// const api = axios.create({
//     baseURL: API_URL,
//     withCredentials: true,
// });


// Тестовый токен для разработки
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFcmljayIsImV4cCI6MTc0MDQxODI3N30.GTPF6HkIgMp54-GPF24i93VqqZlq5WOKgVlAb46MCfc';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Authorization': `Bearer ${TEST_TOKEN}` // Добавляем тестовый токен в заголовки
    }
});
// Тестовый токен для разработки



// Интерцептор для токена
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// API для транзакций


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
    getAll: () => api.get('/categories/'),
    create: (data: { name: string }) => api.post('/categories/', data),
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