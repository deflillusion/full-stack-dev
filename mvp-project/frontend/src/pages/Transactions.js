import React, { useState, useEffect } from 'react';
import { getTransactions } from '../api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await getTransactions(token);
                setTransactions(response.data);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div>
            <h1>Transactions</h1>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>{transaction.description}: {transaction.amount}</li>
                ))}
            </ul>
        </div>
    );
};

export default Transactions;