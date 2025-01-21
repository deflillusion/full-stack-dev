import React, { useState } from 'react';
import { loginUser } from '../api';
import { 
    Container, TextField, Button, Typography, Box, Card,
    AppBar, Toolbar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });
            localStorage.setItem('token', response.data.access_token);
            navigate('/'); // Редирект на главную страницу после входа
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0} 
                sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ color: '#000', flexGrow: 1, fontWeight: 600 }}>
                        Sign In
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                            variant="outlined"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                                bgcolor: '#007AFF',
                                height: 48,
                                fontSize: 16,
                                mb: 2
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/register')}
                            sx={{ color: '#007AFF' }}
                        >
                            Create Account
                        </Button>
                    </form>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;