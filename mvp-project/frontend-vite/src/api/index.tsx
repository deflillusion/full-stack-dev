import axios from 'axios';

const API_URL = 'http://localhost:8000/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
export const getTransactions = (token: string) => {
  return api.get('/transactions/', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createTransaction = (token: string, data: any) => {
  return api.post('/transactions/', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteTransaction = (token: string, id: number) => {
  return api.delete(`/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Categories
export const getCategories = (token: string) => {
  return api.get('/categories/', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createCategory = (token: string, data: any) => {
  return api.post('/categories/', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteCategory = (token: string, id: number) => {
  return api.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Accounts
export const getAccounts = (token: string) => {
  return api.get('/accounts/', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createAccount = (token: string, data: any) => {
  return api.post('/accounts/', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteAccount = (token: string, id: number) => {
  return api.delete(`/accounts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Transaction Types
export const getTransactionTypes = (token: string) => {
  return api.get('/transaction-types/', {
    headers: { Authorization: `Bearer ${token}` }
  });
};
