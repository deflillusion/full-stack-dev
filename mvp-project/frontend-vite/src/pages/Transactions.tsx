import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../api';
import { 
  List, ListItem, ListItemText, Typography, Container, AppBar, 
  Toolbar, IconButton, Card, Box, Fab 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  datetime: string;
  category_id: number;
  account_id: number;
}

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTransactions = async (): Promise<void> => {
      try {
        const response = await getTransactions(token);
        setTransactions(response.data);
      } catch (error) {
        if ((error as any).response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          alert('Failed to fetch transactions');
        }
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleBack = () => {
    navigate('/'); // Явно указываем переход на главную страницу
  };

  const handleDelete = async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await deleteTransaction(token, id);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        alert('Failed to delete transaction');
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#F2F2F7', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)' }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            sx={{ color: '#007AFF' }} 
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#000', flexGrow: 1, fontWeight: 600 }}>
            Transactions
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ mt: 2 }}>
        <Card>
          <List sx={{ bgcolor: 'white' }}>
            {transactions.map((transaction) => (
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
                    <Typography variant="body2" sx={{ color: transaction.amount > 0 ? '#34C759' : '#FF3B30' }}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </Typography>
                  }
                />
                <IconButton onClick={() => handleDelete(transaction.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Card>
      </Container>

      <Fab 
        color="primary" 
        onClick={() => navigate('/create-transaction')}
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

export default Transactions;