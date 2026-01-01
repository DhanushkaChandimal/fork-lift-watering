import { useState } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../styles/App.css';

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
        <div className="verification-container">
            <div className="verification-card">
                <div className="verification-icon">📧</div>
                <h2 className="verification-title">Verify Your Email</h2>
                <p className="verification-text-muted">
                    We've sent a verification email to:
                </p>
                <p className="verification-email">
                    {user?.email}
                </p>
                <p className="verification-description">
                    Please check your inbox and click the verification link to activate your account.
                </p>

                {message && (
                    <Alert 
                        variant={message.includes('Error') ? 'danger' : 'success'} 
                        className="alert-rounded mb-4"
                    >
                        {message}
                    </Alert>
                )}

                <div className="d-flex flex-column gap-2">
                    <Button 
                        className="btn-sams-primary btn-full-width"
                        onClick={handleCheckVerification}
                    >
                        I've Verified My Email
                    </Button>
                    
                    <Button 
                        variant="outline-primary"
                        onClick={handleResendVerification}
                        disabled={sending}
                        className="btn-full-width btn-fw-600"
                    >
                        {sending ? 'Sending...' : 'Resend Verification Email'}
                    </Button>

                    <Button 
                        className="btn-sams-secondary btn-full-width mt-2"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                </div>

                <p className="verification-tip">
                    💡 Tip: Check your spam folder if you don't see the email
                </p>
            </div>
        </div>
    );
};

export default EmailVerification;
