import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Card, Grid, IconButton,
    AppBar, Toolbar, Button, Fab, List, ListItem, ListItemText
} from '@mui/material';
import {
    AccountBalanceWallet,
    Receipt,
    Category,
    Person,
    Add
} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../api';

const MenuButton = ({ icon, title, onClick }) => (
    <Card
        onClick={onClick}
        sx={{
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { bgcolor: 'rgba(0,122,255,0.05)' }
        }}
    >
        {icon}
        <Typography sx={{ mt: 1 }}>{title}</Typography>
    </Card>
);

const Home = () => {
    const navigate = useNavigate();
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchRecentTransactions = async () => {
            try {
                const response = await getTransactions(token);
                // Берем только последние 10 транзакций
                setRecentTransactions(response.data.slice(0, 10));
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        };

        fetchRecentTransactions();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh', pb: 8 }}>
            <AppBar position="static" elevation={0}
                sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ color: '#000', flexGrow: 1, fontWeight: 600 }}>
                        Finance Tracker
                    </Typography>
                    <Button
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ color: '#FF3B30' }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <MenuButton
                            icon={<Receipt sx={{ fontSize: 40, color: '#007AFF' }} />}
                            title="Transactions"
                            onClick={() => navigate('/transactions')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <MenuButton
                            icon={<AccountBalanceWallet sx={{ fontSize: 40, color: '#34C759' }} />}
                            title="Accounts"
                            onClick={() => navigate('/accounts')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <MenuButton
                            icon={<Category sx={{ fontSize: 40, color: '#FF9500' }} />}
                            title="Categories"
                            onClick={() => navigate('/categories')}
                        />
                    </Grid>
                </Grid>

                <Card sx={{ mt: 3 }}>
                    <List>
                        <ListItem sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Recent Transactions
                            </Typography>
                        </ListItem>
                        {recentTransactions.map((transaction) => (
                            <ListItem
                                key={transaction.id}
                                divider
                                sx={{
                                    '&:last-child': { borderBottom: 'none' },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {transaction.description}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2"
                                            sx={{ color: transaction.amount > 0 ? '#34C759' : '#FF3B30' }}
                                        >
                                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Container>

            <Box sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 2
            }}>
                <Fab
                    color="primary"
                    onClick={() => navigate('/transactions')}
                    variant="extended"
                    sx={{
                        bgcolor: '#007AFF',
                        mr: 1
                    }}
                >
                    <Receipt sx={{ mr: 1 }} />
                    All Transactions
                </Fab>
                <Fab
                    color="primary"
                    onClick={() => navigate('/create-transaction')}
                    sx={{ bgcolor: '#007AFF' }}
                >
                    <Add />
                </Fab>
            </Box>
        </Box>
    );
};

export default Home;