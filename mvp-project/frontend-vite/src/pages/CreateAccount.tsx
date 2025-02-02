import React, { useState } from 'react';
import { createAccount } from '../api';
import {
    Container, TextField, Button, Typography, Box, Card,
    AppBar, Toolbar, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface AccountData {
    name: string;
    balance: number;
    description?: string;
}

const CreateAccount: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [balance, setBalance] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const accountData: AccountData = {
                name,
                balance: parseFloat(balance),
                description: description || undefined
            };

            await createAccount(token!, accountData);
            navigate('/accounts');
        } catch (error) {
            alert('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <IconButton edge="start" onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">Create Account</Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Card sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Balance"
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={3}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Account'}
                        </Button>
                    </form>
                </Card>
            </Container>
        </Box>
    );
};

export default CreateAccount;
