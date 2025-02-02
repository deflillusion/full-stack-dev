import React, { useState, useEffect } from 'react';
import { getTransactions } from '../api';
import {
    Container, Typography, Box, Card, Grid, IconButton,
    AppBar, Toolbar, Button, Fab, List, ListItem, ListItemText
} from '@mui/material';
import {
    AccountBalanceWallet,
    Receipt,
    Category,
    Add
} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { MenuButton } from '../components/ui/menu-button';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    datetime: string;
}

interface MenuItem {
    icon: JSX.Element;
    title: string;
    path: string;
    color: string;
}

const Home: React.FC = () => {
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const navigate = useNavigate();

    const menuItems = [
        {
            icon: <Receipt sx={{ fontSize: 40, color: '#007AFF' }} />,
            title: "Transactions",
            path: "/transactions"
        },
        {
            icon: <AccountBalanceWallet sx={{ fontSize: 40, color: '#34C759' }} />,
            title: "Accounts",
            path: "/accounts"
        },
        {
            icon: <Category sx={{ fontSize: 40, color: '#FF9500' }} />,
            title: "Categories",
            path: "/categories"
        }
    ];

    const handleLogout = (): void => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchRecentTransactions = async (): Promise<void> => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await getTransactions(token);
                setRecentTransactions(response.data.slice(0, 10));
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        };

        fetchRecentTransactions();
    }, [navigate]);

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
                    {menuItems.map((item) => (
                        <Grid item xs={6} key={item.title}>
                            <MenuButton
                                icon={item.icon}
                                title={item.title}
                                onClick={() => navigate(item.path)}
                            />
                        </Grid>
                    ))}
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