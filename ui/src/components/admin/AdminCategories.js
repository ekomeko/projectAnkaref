import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState('');



  const handleNameChange = (value) => {
    setCategoryName(value);
  }

  const handleSave = async () => {
    const data = {
      CategoryName: categoryName,
    };

    const url = 'http://localhost:5259/api/category/AddCategorys';

    try {
      const result = await axios.post(url, data);
      alert(result.data);
      setShow(false); 
      getData(); 
    } catch (error) {
      console.error('Error adding category:', error);
     
    }
  }

  const getData = async () => {
    const url = 'http://localhost:5259/api/category/GetCategorys';
    try {
      const response = await axios.get(url);
      const filteredCategories = response.data.map(category => ({
        categoryId: category.categoryId,
        categoryName: category.categoryName
      }));
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Hata:', error);
      setErrorMessage('Data could not be fetched.');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <AdminNavbar />
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
                    <td>
                      <button className="btn btn-primary" onClick={() => navigate('/admin/categorys/' + category.categoryId)}>Select</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className="container">
        <div>
          <Button variant="primary" onClick={() => setShow(true)}>
            Add new category
          </Button>

          <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    autoFocus
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default AdminCategories;
