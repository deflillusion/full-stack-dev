import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import CreateTransaction from './pages/CreateTransaction';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/transactions" component={Transactions} />
                <Route path="/accounts" component={Accounts} />
                <Route path="/categories" component={Categories} />
                <Route path="/create-transaction" component={CreateTransaction} />
            </Switch>
        </Router>
    );
};

export default App;