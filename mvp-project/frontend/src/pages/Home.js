import React, { useEffect } from 'react';
import { 
    Container, Typography, Box, Card, Grid, IconButton,
    AppBar, Toolbar, Button 
} from '@mui/material';
import { 
    AccountBalanceWallet, 
    Receipt, 
    Category,
    Person
} from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
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
            </Container>
        </Box>
    );
};

export default Home;