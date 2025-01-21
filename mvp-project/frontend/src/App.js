import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import Transactions from './pages/Transactions';
import CreateTransaction from './pages/CreateTransaction';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/create-transaction" element={<CreateTransaction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;