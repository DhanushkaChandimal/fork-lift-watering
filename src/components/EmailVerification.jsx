import { useState } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const EmailVerification = ({ user }) => {
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');

    const handleResendVerification = async () => {
        setSending(true);
        setMessage('');
        
        try {
            await sendEmailVerification(user);
            setMessage('Verification email sent! Please check your inbox and spam folder.');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setSending(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleCheckVerification = () => {
        window.location.reload();
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <div className="card border-0 shadow-lg p-5 text-center" style={{ maxWidth: '500px' }}>
                <div className="mb-4">
                    <h2 className="h3 fw-bold mb-3">📧 Verify Your Email</h2>
                    <p className="text-muted">
                        We've sent a verification email to:
                    </p>
                    <p className="fw-bold">{user?.email}</p>
                    <p className="text-muted small">
                        Please check your inbox and click the verification link to activate your account.
                    </p>
                </div>

                {message && (
                    <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-3">
                        {message}
                    </Alert>
                )}

                <div className="d-grid gap-2">
                    <Button 
                        variant="primary" 
                        onClick={handleCheckVerification}
                    >
                        I've Verified My Email
                    </Button>
                    
                    <Button 
                        variant="outline-primary" 
                        onClick={handleResendVerification}
                        disabled={sending}
                    >
                        {sending ? 'Sending...' : 'Resend Verification Email'}
                    </Button>

                    <Button 
                        variant="outline-secondary" 
                        onClick={handleSignOut}
                        className="mt-3"
                    >
                        Sign Out
                    </Button>
                </div>

                <p className="text-muted small mt-4 mb-0">
                    💡 Tip: Check your spam folder if you don't see the email
                </p>
            </div>
        </Container>
    );
};

export default EmailVerification;
