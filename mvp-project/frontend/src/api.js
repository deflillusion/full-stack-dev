import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (credentials) => {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    return api.post('/users/token', params);
};
export const getTransactions = (token) => api.get('/transactions', {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
export const getAccounts = (token) => api.get('/accounts', {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
export const getCategories = (token) => api.get('/categories', {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const createTransaction = (token, transactionData) => api.post('/transactions', transactionData, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export default api;