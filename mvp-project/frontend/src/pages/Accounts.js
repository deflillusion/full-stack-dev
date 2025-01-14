import React, { useState, useEffect } from 'react';
import { getAccounts } from '../api';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await getAccounts(token);
                setAccounts(response.data);
            }
        };
        fetchAccounts();
    }, []);

    return (
        <div>
            <h1>Accounts</h1>
            <ul>
                {accounts.map((account) => (
                    <li key={account.id}>{account.name}: {account.balance}</li>
                ))}
            </ul>
        </div>
    );
};

export default Accounts;