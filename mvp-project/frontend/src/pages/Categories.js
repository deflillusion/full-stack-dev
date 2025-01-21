import React, { useState, useEffect } from 'react';
import { getCategories } from '../api';
import { 
    Container, Typography, Box, Card, List, ListItem,
    ListItemText, AppBar, Toolbar, IconButton, Fab 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await getCategories(token);
                    setCategories(response.data);
                } catch (error) {
                    alert('Failed to fetch categories');
                }
            }
        };

        fetchCategories();
    }, []);

    return (
        <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0} 
                sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
                <Toolbar>
                    <IconButton edge="start" sx={{ color: '#007AFF' }} onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: '#000', flexGrow: 1, fontWeight: 600 }}>
                        Categories
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container sx={{ mt: 2 }}>
                <Card>
                    <List>
                        {categories.map((category) => (
                            <ListItem 
                                key={category.id}
                                divider
                                sx={{
                                    '&:last-child': { borderBottom: 'none' },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {category.name}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Container>

            <Fab 
                color="primary"
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

export default Categories;