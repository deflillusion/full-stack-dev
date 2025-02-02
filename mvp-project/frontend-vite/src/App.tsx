import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Transactions from './pages/Transactions';
import CreateTransaction from './pages/CreateTransaction';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import CreateCategory from './pages/CreateCategory';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
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
    </>
  )
}

export default App
