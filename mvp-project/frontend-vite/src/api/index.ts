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

// Кэш для хранения результатов запросов
const apiCache = {
    last12MonthsData: null as any,
    last12MonthsParams: null as any,
    last12MonthsTimestamp: 0
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
    getLast12Months: (current_month: string, account_id?: number, category_id?: number, signal?: AbortSignal) => {
        // Создаем строку с параметрами для сравнения
        const paramsKey = JSON.stringify({ current_month, account_id, category_id });
        const now = Date.now();

        // Если в кэше есть данные и они не устарели (менее 30 секунд) и параметры совпадают
        if (
            apiCache.last12MonthsData &&
            apiCache.last12MonthsParams === paramsKey &&
            now - apiCache.last12MonthsTimestamp < 30000
        ) {
            console.log("Возвращаем закэшированные данные за 12 месяцев");
            return Promise.resolve(apiCache.last12MonthsData);
        }

        // Иначе делаем новый запрос
        console.log("Выполняем новый запрос за 12 месяцев с параметрами:",
            { current_month, account_id, category_id, hasSignal: !!signal });

        return api.get('/statistic/last-12-months/', {
            params: {
                current_month,
                account_id,
                category_id
            },
            signal // Передаем сигнал в запрос
        }).then(response => {
            // Проверяем, что запрос не был отменен
            if (signal && signal.aborted) {
                console.log("Запрос был отменен, не сохраняем в кэш");
                // Выбрасываем ошибку отмены
                const error: any = new Error('Запрос был отменен');
                error.name = 'CanceledError';
                error.code = 'ERR_CANCELED';
                throw error;
            }

            // Кэшируем результат
            console.log("Сохраняем результат запроса в кэш");
            apiCache.last12MonthsData = response;
            apiCache.last12MonthsParams = paramsKey;
            apiCache.last12MonthsTimestamp = now;
            return response;
        }).catch(err => {
            // Если ошибка вызвана отменой запроса, просто пробрасываем её дальше
            if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' ||
                (err instanceof DOMException && err.name === 'AbortError')) {
                console.log("Запрос был отменен:", err.message || err.name);
                throw err;
            }

            // Для других ошибок логируем и пробрасываем дальше
            console.error("Ошибка при запросе статистики за 12 месяцев:", err);
            throw err;
        });
    },

    getAiAnalysis: (current_month: string, account_id?: number, category_id?: number, signal?: AbortSignal) => {
        console.log("Запрос ИИ-анализа за 12 месяцев с параметрами:",
            { current_month, account_id, category_id, hasSignal: !!signal });

        return api.get('/statistic/ai-analysis/last-12-months/', {
            params: {
                current_month,
                account_id,
                category_id
            },
            signal // Передаем сигнал в запрос
        });
    },
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
        category_id?: number;
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

    exportToExcel: (params?: {
        account_id?: number;
        year?: string;
        month?: string;
        category_id?: number;
    }) => {
        // Создаем URL с параметрами запроса
        const url = new URL(`${API_URL}/transactions/export/excel`);

        // Добавляем токен авторизации
        const token = localStorage.getItem("clerk_token");

        // Добавляем параметры, если они есть
        if (params) {
            if (params.account_id) url.searchParams.append('account_id', params.account_id.toString());
            if (params.year) url.searchParams.append('year', params.year);
            if (params.month) url.searchParams.append('month', params.month);
            if (params.category_id) url.searchParams.append('category_id', params.category_id.toString());
        }

        // Открываем URL в новом окне для скачивания
        // Добавляем Authorization заголовок через POST, так как GET запрос не может включать заголовки
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = url.toString();

        // Добавляем заголовок авторизации через скрытое поле
        // (на сервере нужно обрабатывать этот параметр)
        if (token) {
            const tokenField = document.createElement('input');
            tokenField.type = 'hidden';
            tokenField.name = 'token';
            tokenField.value = token;
            form.appendChild(tokenField);
        }

        // Добавляем форму в DOM, отправляем и удаляем
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
};


export type TransactionType = {
    id: number;
    name: string;
}

export const transactionTypesApi = {
    getAll: () => api.get<TransactionType[]>('/categories/transaction_types'),
};