import React, { useState } from 'react';
import { createTransaction } from '../api';

const CreateTransaction = () => {
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [transactionTypeId, setTransactionTypeId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [datetime, setDatetime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const transactionData = {
                    category_id: parseInt(categoryId),
                    account_id: parseInt(accountId),
                    transaction_type_id: parseInt(transactionTypeId),
                    amount: parseFloat(amount),
                    description: description,
                    datetime: new Date(datetime).toISOString()
                };
                await createTransaction(token, transactionData);
                alert('Transaction created successfully');
            } catch (error) {
                alert('Failed to create transaction');
            }
        }
    };

    return (
        <div>
            <h1>Create Transaction</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Category ID"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Account ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Transaction Type ID"
                    value={transactionTypeId}
                    onChange={(e) => setTransactionTypeId(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="datetime-local"
                    placeholder="Datetime"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateTransaction;