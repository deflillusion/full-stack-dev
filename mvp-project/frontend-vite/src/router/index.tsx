import { createBrowserRouter, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Transactions from '../pages/Transactions';
import CreateTransaction from '../pages/CreateTransaction';
import Accounts from '../pages/Accounts';
import Categories from '../pages/Categories';
import CreateCategory from '../pages/CreateCategory';
import CreateAccount from '../pages/CreateAccount';

export const router = createBrowserRouter([
  {
    path: '/',
    element: localStorage.getItem('token') ? <Home /> : <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/transactions',
    element: <Transactions />,
  },
  {
    path: '/create-transaction',
    element: <CreateTransaction />,
  },
  {
    path: '/accounts',
    element: <Accounts />,
  },
  {
    path: '/categories',
    element: <Categories />,
  },
  {
    path: '/categories/create',
    element: <CreateCategory />,
  },
  {
    path: '/accounts/create',
    element: <CreateAccount />,
  }
]);
