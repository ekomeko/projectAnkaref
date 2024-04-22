import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate eklenmiştir
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

function Login() {
  const [UserMail, setUserMail] = useState('');
  const [UserPassword, setUserPassword] = useState('');

  const navigate = useNavigate();

  const handleUserMailChange = (value) => {
      setUserMail(value);
  };
  
  const handleUserPasswordChange = (value) => {
      setUserPassword(value);
  };

  const handleLogin = async () => {
    const data = {
        UserMail: UserMail,
        UserPassword: UserPassword,
    };

    const url = 'http://localhost:5259/api/User/login';

    try {
        const response = await axios.post(url, data);
        localStorage.setItem('user', response.data.UserName);


        if (response.status === 200) {
            // Make a request to /api/User/GetUsers with userName
            const getUserUrl = `http://localhost:5259/api/User/GetUsers?userName=${response.data.UserName}`;
            
            const userResponse = await axios.get(getUserUrl);
            
            const users = userResponse.data;

            const currentUser = users.find(user => user.UserName === response.data.UserName);

            if (userResponse.status === 200) {
                if (userResponse.data.length > 0) {
                    const userId = currentUser.UserId;
                    localStorage.setItem('userId', userId);
                    console.log(`UserId: ${userId}`);
                } else {
                    console.error('User not found');
                }

                if (response.data.UserRole === "1") {
                    navigate("/admin");
                } else if (response.data.UserRole === "0") {
                    navigate("/user");
                } else {
                    console.error('Kullanici rolü tanimlanmamiş.');
                }
            } else {
                console.error('Failed to retrieve user information');
            }
        } else {
            console.error('Login failed');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
}



    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" className="mx-3" onClick={handleShow}>
                Login
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Mail</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                                onChange={(e) => handleUserMailChange(e.target.value)}
                            />
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                autoFocus
                                onChange={(e) => handleUserPasswordChange(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleLogin()}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Login;
