import React, { useState, useEffect } from 'react';
import { getTransactions } from '../api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await getTransactions(token);
                    setTransactions(response.data);
                } catch (error) {
                    alert('Failed to fetch transactions');
                }
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div>
            <h1>Transactions</h1>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.description} - {transaction.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Transactions;