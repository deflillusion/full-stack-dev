import React, { useState, useEffect } from 'react';
import { getAccounts, deleteAccount } from '../api';
import {
    Container, Typography, Box, Card, List, ListItem,
    ListItemText, AppBar, Toolbar, IconButton, Fab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await getAccounts(token);
                setAccounts(response.data);
                setError(null);
            } catch (error) {
                setError('Failed to fetch accounts');
                setAccounts([]);
            }
        };

        fetchAccounts();
    }, [navigate]);

    const handleAddAccount = () => {
        navigate('/accounts/create');
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await deleteAccount(token, id);
                setAccounts(accounts.filter(a => a.id !== id));
            } catch (error) {
                alert('Failed to delete account');
            }
        }
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0}
                sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <IconButton edge="start" sx={{ color: '#007AFF' }} onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: '#000', flexGrow: 1, fontWeight: 600 }}>
                        Accounts
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 2 }}>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Card>
                    <List>
                        {accounts.length === 0 ? (
                            <ListItem>
                                <ListItemText primary="No accounts found" />
                            </ListItem>
                        ) : (
                            accounts.map((account) => (
                                <ListItem
                                    key={account.id}
                                    divider
                                    sx={{
                                        '&:last-child': { borderBottom: 'none' },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                {account.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: '#007AFF' }}>
                                                Balance: ${account.balance}
                                            </Typography>
                                        }
                                    />
                                    <IconButton onClick={() => handleDelete(account.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            ))
                        )}
                    </List>
                </Card>
            </Container>

            <Fab
                color="primary"
                onClick={handleAddAccount}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    bgcolor: '#007AFF'
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default Accounts;