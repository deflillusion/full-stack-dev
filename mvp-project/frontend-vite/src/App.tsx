import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import './App.css';
import Transactions from './pages/Transactions';
import CreateTransaction from './pages/CreateTransaction';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import CreateCategory from './pages/CreateCategory';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/create-transaction" element={<CreateTransaction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/create" element={<CreateCategory />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
