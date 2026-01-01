import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { secondaryAuth } from '../lib/firebaseConfig';
import { pendingUsersService } from '../services/pendingUsersService';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';

const AdminPanel = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        setLoading(true);
        try {
            const users = await pendingUsersService.getAllPendingUsers();
            setPendingUsers(users);
        } catch (error) {
            console.error('Error loading pending users:', error);
            setMessage({ type: 'danger', text: 'Failed to load pending users' });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (pendingUser) => {
        setProcessing(pendingUser.id);
        setMessage({ type: '', text: '' });

        try {
            // Use secondary auth to create user without affecting admin session
            const userCredential = await createUserWithEmailAndPassword(
                secondaryAuth,
                pendingUser.email,
                pendingUser.password
            );

            // Update profile with display name
            await updateProfile(userCredential.user, {
                displayName: pendingUser.displayName
            });

            // Send email verification to the new user
            await sendEmailVerification(userCredential.user);

            // Sign out from secondary auth (doesn't affect main admin session)
            await secondaryAuth.signOut();

            // Remove from pending pool
            await pendingUsersService.removePendingUser(pendingUser.id);

            setMessage({ 
                type: 'success', 
                text: `User ${pendingUser.displayName} approved successfully! Verification email sent.` 
            });

            // Reload pending users
            loadPendingUsers();
        } catch (error) {
            console.error('Error approving user:', error);
            setMessage({ 
                type: 'danger', 
                text: `Failed to approve user: ${error.message}` 
            });
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (pendingUser) => {
        if (!window.confirm(`Are you sure you want to reject ${pendingUser.displayName}'s registration request?`)) {
            return;
        }

        setProcessing(pendingUser.id);
        setMessage({ type: '', text: '' });

        try {
            await pendingUsersService.removePendingUser(pendingUser.id);
            setMessage({ 
                type: 'info', 
                text: `Registration request from ${pendingUser.displayName} rejected.` 
            });
            loadPendingUsers();
        } catch (error) {
            console.error('Error rejecting user:', error);
            setMessage({ 
                type: 'danger', 
                text: `Failed to reject user: ${error.message}` 
            });
        } finally {
            setProcessing(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container fluid className="py-4">
            <div className="text-center mb-4">
                <h1 className="display-5 mb-3">Admin Panel - Pending Registrations</h1>
                <p className="text-muted">
                    Review and approve user registration requests ({pendingUsers.length}/10 pending)
                </p>
            </div>

            {message.text && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : pendingUsers.length === 0 ? (
                <Alert variant="info" className="text-center">
                    No pending registration requests at this time.
                </Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Display Name</th>
                            <th>Email</th>
                            <th>Requested At</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map(user => (
                            <tr key={user.id}>
                                <td className="fw-bold">{user.displayName}</td>
                                <td>{user.email}</td>
                                <td>{formatDate(user.requestedAt)}</td>
                                <td>
                                    <Badge bg="warning" text="dark">Pending</Badge>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="success" 
                                            size="sm"
                                            onClick={() => handleApprove(user)}
                                            disabled={processing === user.id}
                                        >
                                            {processing === user.id ? 'Processing...' : 'Approve'}
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleReject(user)}
                                            disabled={processing === user.id}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default AdminPanel;
