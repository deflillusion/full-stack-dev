import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><Link to="/accounts">Accounts</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/create-transaction">Create Transaction</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;