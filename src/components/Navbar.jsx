import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { isAdmin } from '../lib/adminConfig';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import '../styles/App.css';

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
        <Navbar className="navbar-sams" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/" className="navbar-brand-sams">
                    ⚡ <span className="d-none d-sm-inline">Forklift Battery System</span>
                    <span className="d-inline d-sm-none">FBS</span>
                </Navbar.Brand>
                
                {user && (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto align-items-center">
                                <Nav.Link href="/" className="nav-link-sams">
                                    🏠 Dashboard
                                </Nav.Link>
                                {isAdmin(user) && (
                                    <Nav.Link href="/admin" className="nav-link-sams">
                                        📋 Admin Panel
                                    </Nav.Link>
                                )}
                                <Nav.Link href="/profile" className="nav-link-sams">
                                    👤 Profile
                                </Nav.Link>
                                <Nav.Item className="text-light me-3">
                                    Welcome, <strong>{user.displayName || user.email}</strong>
                                </Nav.Item>
                                <Nav.Item>
                                    <Button 
                                        variant="light" 
                                        size="sm" 
                                        onClick={handleSignOut}
                                        className="btn-fw-600"
                                    >
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
