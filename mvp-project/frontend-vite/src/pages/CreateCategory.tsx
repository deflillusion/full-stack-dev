import React, { useState, useEffect } from 'react';
import { createCategory, getTransactionTypes } from '../api';
import { useNavigate } from 'react-router-dom';
import {
    Container, TextField, Button, Typography, Box,
    AppBar, Toolbar, IconButton, Card,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TransactionType {
  id: number;
  name: string;
}

interface CategoryData {
  name: string;
  description: string | null;
  transaction_type_id: number;
}

const CreateCategory: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [transactionTypeId, setTransactionTypeId] = useState<string>('');
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionTypes = async (): Promise<void> => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await getTransactionTypes(token);
        setTransactionTypes(response.data);
      } catch (error) {
        alert('Failed to fetch transaction types');
      }
    };

    fetchTransactionTypes();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const categoryData: CategoryData = {
        name,
        description: description || null,
        transaction_type_id: parseInt(transactionTypeId)
      };

      await createCategory(token!, categoryData);
      navigate('/categories');
    } catch (error) {
      const errorMessage = (error as any).response?.data?.detail || 'Failed to create category';
      alert(errorMessage);
    } finally {
      setLoading(false);
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
                    New Category
                </Typography>
            </Toolbar>
        </AppBar>

        <Container sx={{ mt: 2 }}>
            <Card sx={{ p: 2 }}>
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
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Transaction Type</InputLabel>
                        <Select
                            value={transactionTypeId}
                            label="Transaction Type"
                            onChange={(e) => setTransactionTypeId(e.target.value)}
                        >
                            {transactionTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        Create Category
                    </Button>
                </form>
            </Card>
        </Container>
    </Box>
  );
};

export default CreateCategory;
