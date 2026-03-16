import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AdminLayout = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="">
                        Admin / Staff - Dookki Hanoi
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="admin-navbar" />
                    <Navbar.Collapse id="admin-navbar">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="">
                                Tổng quan
                            </Nav.Link>
                            <Nav.Link as={Link} to="menu">
                                Quản lý Menu
                            </Nav.Link>
                            <Nav.Link as={Link} to="buffet">
                                Quản lý Buffet
                            </Nav.Link>
                            <Nav.Link as={Link} to="tables">
                                Quản lý Bàn & QR
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4 mb-5">
                <Outlet />
            </Container>
        </>
    );
};

export default AdminLayout;