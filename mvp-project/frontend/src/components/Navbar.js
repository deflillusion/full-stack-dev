import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Expense Tracker
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
                <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
                <Button color="inherit" component={Link} to="/accounts">Accounts</Button>
                <Button color="inherit" component={Link} to="/categories">Categories</Button>
                <Button color="inherit" component={Link} to="/create-transaction">Create Transaction</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;