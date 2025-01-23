import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    return api.post('/users/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

// Transactions
export const getTransactions = (token, skip = 0, limit = 10) =>
    api.get(`/transactions?skip=${skip}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const createTransaction = (token, data) =>
    api.post('/transactions', {
        category_id: data.category_id,
        account_id: data.account_id,
        transaction_type_id: data.transaction_type_id,
        amount: data.amount,
        description: data.description,
        datetime: data.datetime
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const updateTransaction = (token, id, data) => api.put(`/transactions/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteTransaction = (token, id) => api.delete(`/transactions/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Transaction Types
export const getTransactionTypes = (token) => api.get('/transaction_types', {
    headers: { Authorization: `Bearer ${token}` }
});

// Categories
export const getCategories = (token) => api.get('/categories', { headers: { Authorization: `Bearer ${token}` } });
export const createCategory = (token, data) =>
    api.post('/categories', {
        name: data.name,
        description: data.description,
        transaction_type_id: data.transaction_type_id
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const updateCategory = (token, id, data) => api.put(`/categories/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteCategory = (token, id) => api.delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Accounts
export const getAccounts = (token) => api.get('/accounts', { headers: { Authorization: `Bearer ${token}` } });
export const createAccount = (token, data) => api.post('/accounts', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateAccount = (token, id, data) => api.put(`/accounts/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteAccount = (token, id) => api.delete(`/accounts/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export default api;