import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

function Registration() {
    const [UserName, setUserName] = useState('');
    const [UserMail, setUserMail] = useState('');
    const [UserPassword, setUserPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUserNameChange = (value) => {
        setUserName(value);
    }
    const handleUserMailChange = (value) => {
        setUserMail(value);
    }
    const handleUserPasswordChange = (value) => {
        setUserPassword(value);
    }
    const handleSave = () => {
        // Kontrolleri yap
        if (!UserName || !UserMail || !UserPassword) {
            setErrorMessage('Lütfen tüm alanları doldurun.');
            return;
        }

        if (!isValidEmail(UserMail)) {
            setErrorMessage('Geçerli bir e-posta adresi girin.');
            return;
        }

        // Sunucuya göndermeden önce diğer işlemleri burada yapabilirsiniz.

        const data = {
            UserName: UserName,
            UserMail: UserMail,
            UserPassword: UserPassword,
            UserRole: 0
        }

        const url = 'http://localhost:5259/api/User/registration'; // veya Azure API URL'niz

        try {
            axios.post(url, data)
                .then((result) => {
                    alert(result.data);
                    handleClose(); // Kayıt başarılıysa modalı kapat
                })
                .catch((error) => {
                    if (error.response) {
                        // Sunucu hatası
                        console.error('Sunucu Yanıtı:', error.response.data);
                        console.error('Durum Kodu:', error.response.status);
                        setErrorMessage('Sunucu hatası: ' + error.response.data);
                    } else if (error.request) {
                        // Yanıt alınamadı
                        console.error('Yanıt alınamadı:', error.request);
                        setErrorMessage('Yanıt alınamadı.');
                    } else {
                        // Diğer hatalar
                        console.error('Hata:', error.message);
                        setErrorMessage('Bir hata oluştu: ' + error.message);
                    }
                });
        } catch (error) {
            console.error('Bir istisna oluştu:', error);
            setErrorMessage('Bir istisna oluştu: ' + error.message);
        }
    }

    // E-posta geçerliliğini kontrol eden bir yardımcı işlev
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setErrorMessage('');
    }
    const handleShow = () => setShow(true);

    return (
        <Fragment>
            <Button variant="primary" className="mx-3" onClick={handleShow}>
                Register
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                autoFocus
                                onChange={(e) => handleUserNameChange(e.target.value)}
                            />
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
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleSave()}>
                        Register
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default Registration;
