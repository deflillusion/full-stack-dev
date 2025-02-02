import React, { useState, useEffect } from 'react';
import { createTransaction, getCategories, getAccounts } from '../api';
import type { Category, Account, TransactionForm } from '../types';
import {
    Container, TextField, Button, Typography, Box,
    AppBar, Toolbar, IconButton, Card,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';

interface TransactionData {
    category_id: number;
    account_id: number;
    transaction_type_id: number;
    amount: number;
    description: string | null;
    datetime: string;
}

const CreateTransaction: React.FC = () => {
    const navigate = useNavigate();
    const [categoryId, setCategoryId] = useState<string>('');
    const [accountId, setAccountId] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [datetime, setDatetime] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [categoriesRes, accountsRes] = await Promise.all([
                    getCategories(token),
                    getAccounts(token),
                ]);
                setCategories(categoriesRes.data);
                setAccounts(accountsRes.data);
            } catch (error) {
                alert('Failed to fetch data');
                navigate('/');
            }
        };

        fetchData();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
                if (!selectedCategory) {
                    throw new Error('Please select a category');
                }

                const finalAmount = transactionType === 'expense'
                    ? -Math.abs(parseFloat(amount))
                    : Math.abs(parseFloat(amount));

                const transactionData: TransactionData = {
                    category_id: parseInt(categoryId),
                    account_id: parseInt(accountId),
                    transaction_type_id: selectedCategory.transaction_type_id,
                    amount: finalAmount,
                    description: description || null,
                    datetime: new Date(datetime).toISOString()
                };

                await createTransaction(token, transactionData);
                navigate('/transactions');
            } catch (error) {
                console.error('Transaction error:', error);
                alert('Failed to create transaction: ' + (error.message || error.response?.data?.detail || 'Unknown error'));
            }
        }
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        sx={{ color: '#007AFF' }}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: '#000', flexGrow: 1, fontWeight: 600 }}>
                        New Transaction
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 2 }}>
                <Card sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <ToggleButtonGroup
                            value={transactionType}
                            exclusive
                            onChange={(e, newType) => newType && setTransactionType(newType)}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <ToggleButton
                                value="expense"
                                sx={{
                                    color: '#FF3B30',
                                    '&.Mui-selected': {
                                        color: '#FF3B30',
                                        backgroundColor: 'rgba(255, 59, 48, 0.1)'
                                    }
                                }}
                            >
                                <RemoveIcon sx={{ mr: 1 }} />
                                Expense
                            </ToggleButton>
                            <ToggleButton
                                value="income"
                                sx={{
                                    color: '#34C759',
                                    '&.Mui-selected': {
                                        color: '#34C759',
                                        backgroundColor: 'rgba(52, 199, 89, 0.1)'
                                    }
                                }}
                            >
                                <AddIcon sx={{ mr: 1 }} />
                                Income
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <TextField
                            fullWidth
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <Typography color={transactionType === 'expense' ? '#FF3B30' : '#34C759'}>
                                        {transactionType === 'expense' ? '-' : '+'}$
                                    </Typography>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryId}
                                label="Category"
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                {categories
                                    .filter(category =>
                                        transactionType === 'expense'
                                            ? category.transaction_type_id === 2
                                            : category.transaction_type_id === 1
                                    )
                                    .map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Account</InputLabel>
                            <Select
                                value={accountId}
                                label="Account"
                                onChange={(e) => setAccountId(e.target.value)}
                            >
                                {accounts.map((account) => (
                                    <MenuItem key={account.id} value={account.id}>
                                        {account.name} (${account.balance})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            type="datetime-local"
                            label="Date and Time"
                            value={datetime}
                            onChange={(e) => setDatetime(e.target.value)}
                            sx={{ mb: 2 }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                                bgcolor: '#007AFF',
                                height: 48,
                                fontSize: 16,
                            }}
                        >
                            Create Transaction
                        </Button>
                    </form>
                </Card>
            </Container>
        </Box>
    );
};

export default CreateTransaction;