import React, { useState, useEffect } from 'react';
import { getCategories } from '../api';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await getCategories(token);
                    setCategories(response.data);
                } catch (error) {
                    alert('Failed to fetch categories');
                }
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            <h1>Categories</h1>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;