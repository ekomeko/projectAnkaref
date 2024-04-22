import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function AdminNavbar() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleCategoryClick = () => {
    navigate('/admin/categorys');
};


const handleOldActivitysClick = () => {
  navigate('/admin/OldActivitys');
};

const handleHomeClick = () => {
  navigate('/admin');
};

const handleUsersClick = () => {
  navigate('/admin/ManUsers');
}

const handleATP = () => {
  navigate('/admin/About');
};

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
      <Navbar.Brand onClick={handleHomeClick} className='mx-5'>Project-2</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className=" flex-grow-1 pe-3 mx-2">
          <Nav.Link onClick={handleHomeClick}>  <span>Welcome {JSON.stringify(user)}</span></Nav.Link>
          <Nav.Link onClick={handleCategoryClick}>Categorys</Nav.Link>

          <Nav.Link  onClick={handleOldActivitysClick}>Old Activitys</Nav.Link>

          <Nav.Link onClick={handleATP}>About This Project</Nav.Link>

          <Nav.Link onClick={handleUsersClick}>Users</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        <Button className='mx-4' onClick={handleLogout}>Logout</Button>
      </Navbar.Collapse>


    </Navbar>
  );
}

export default AdminNavbar;