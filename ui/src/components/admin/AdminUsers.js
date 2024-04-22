import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import AdminNavbar from './AdminNavbar';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    const handleEditUser = (user) => {
        setEditedUser(user);
        setShowModal(true);
    };

    useEffect(() => {
        const getUsers = async () => {
            const url = 'http://localhost:5259/api/User/GetUsers';
            try {
                const response = await axios.get(url);
                setUsers(response.data);
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('User data could not be fetched.');
            }
        };

        getUsers();
    }, []);

    const handleSaveUser = async () => {
        try {
            // Make an API PUT request to update the user with the specified userId
            const url = `http://localhost:5259/api/User/UpdateUser/${editedUser.UserId}`;
            const response = await axios.put(url, editedUser);

            if (response.status === 200) {
                setShowModal(false);
                console.log(`User with ID ${editedUser.UserId} updated successfully.`);
                // Optionally, you can update the user list or perform other actions on success.
            } else {
                console.error('Failed to update user.');
                // Handle the error or show a message to the user.
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle the API request error, e.g., show an error message to the user.
        }
    };

    return (
        <>
        <AdminNavbar />
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>Users</h1>
                    {errorMessage && <p>{errorMessage}</p>}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.UserId}>
                                    <td>{user.UserId}</td>
                                    <td>{user.UserName}</td>
                                    <td>{user.UserMail}</td>
                                    <td>{user.UserPassword}</td>
                                    <td>{user.UserRole}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUserName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter User Name"
                                value={editedUser.UserName || ''}
                                onChange={(e) => setEditedUser({ ...editedUser, UserName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserMail">
                            <Form.Label>User Mail</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter User Mail"
                                value={editedUser.UserMail || ''}
                                onChange={(e) => setEditedUser({ ...editedUser, UserMail: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserPassword">
                            <Form.Label>User Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter User Password"
                                value={editedUser.UserPassword || ''}
                                onChange={(e) => setEditedUser({ ...editedUser, UserPassword: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUserRole">
                            <Form.Label>User Role</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter User Role"
                                value={editedUser.UserRole || ''}
                                onChange={(e) => setEditedUser({ ...editedUser, UserRole: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveUser}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </>
    );
}

export default AdminUsers;
