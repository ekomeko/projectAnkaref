import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import UserNavbar from './UserNavbar';

function UserCategorys() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const getData = async () => {
        const url = 'http://localhost:5259/api/category/GetCategorys';
        try {
            const response = await axios.get(url);
            localStorage.setItem('catId', response.data.CategoryId);
            const filteredCategories = response.data.map(category => ({
                categoryId: category.categoryId,
                categoryName: category.categoryName
            }));
            setCategories(filteredCategories);
        } catch (error) {
            console.error('Hata:', error);
            setErrorMessage('Veri alınamadı.');
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
        <UserNavbar />
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>Categories</h1>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.categoryId}>
                                    <td>{category.categoryName}</td>
                                    <td><button className="btn btn-primary" onClick={() => navigate('/user/categorys/' + category.categoryId)}>Select</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
        </>
    );
}

export default UserCategorys;
