import React, { useState } from 'react';
import { registerUser } from '../api';
import { 
    Container, TextField, Button, Typography, Box, Card,
    AppBar, Toolbar, IconButton 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ username, email, password });
            alert('Registration successful');
            navigate('/login'); // Редирект на страницу входа после регистрации
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0} 
                sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <IconButton edge="start" sx={{ color: '#007AFF' }} onClick={() => navigate('/login')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: '#000', flexGrow: 1, fontWeight: 600 }}>
                        Create Account
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
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                fontSize: 16
                            }}
                        >
                            Create Account
                        </Button>
                    </form>
                </Card>
            </Container>
        </Box>
    );
};

export default Register;