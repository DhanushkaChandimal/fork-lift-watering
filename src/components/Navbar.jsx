import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const NavigationBar = ({ user }) => {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out. Please try again.');
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand href="/" className="fw-bold">
                    🔋 <span className="d-none d-sm-inline">Forklift Battery System</span>
                    <span className="d-inline d-sm-none">FBWS</span>
                </Navbar.Brand>
                
                {user && (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto align-items-center">
                                <Nav.Item className="text-light me-3">
                                    <small>
                                        Welcome, <strong>{user.displayName || user.email}</strong>
                                    </small>
                                </Nav.Item>
                                <Nav.Item>
                                    <Button variant="outline-light" size="sm" onClick={handleSignOut}>
                                        Sign Out
                                    </Button>
                                </Nav.Item>
                            </Nav>
                        </Navbar.Collapse>
                    </>
                )}
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
