import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from '../Login';
import Registration from '../Registration';


function NavbarCustom() {

  return (

    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
      
        <Navbar.Brand href="#home" className='mx-5'>Project-2</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3 mx-2">
            <Login />
            <Registration />
          </Nav>
        </Navbar.Collapse>
      
    </Navbar>
  );
}

export default NavbarCustom;