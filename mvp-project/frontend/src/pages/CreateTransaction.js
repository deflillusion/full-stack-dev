import React, { useState } from 'react';
import { createTransaction } from '../api';
import { 
  Container, TextField, Button, Typography, Box, 
  AppBar, Toolbar, IconButton, Card 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateTransaction = () => {
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [transactionTypeId, setTransactionTypeId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [datetime, setDatetime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const transactionData = {
                    category_id: parseInt(categoryId),
                    account_id: parseInt(accountId),
                    transaction_type_id: parseInt(transactionTypeId),
                    amount: parseFloat(amount),
                    description: description,
                    datetime: new Date(datetime).toISOString()
                };
                await createTransaction(token, transactionData);
                alert('Transaction created successfully');
            } catch (error) {
                alert('Failed to create transaction');
            }
        }
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <IconButton edge="start" sx={{ color: '#007AFF' }}>
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
                        <TextField
                            fullWidth
                            label="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Account"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            sx={{ mb: 2 }}
                        />
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