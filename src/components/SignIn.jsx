import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { pendingUsersService } from "../services/pendingUsersService";
import "../styles/Auth.css";

const SignIn = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Please enter your email";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Please enter your password";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            );

            setFormData({
                email: "",
                password: ""
            });

        } catch (err) {
            let errorMessage = 'An unknown error occurred';
            
            // Handle Firebase auth errors with user-friendly messages
            if (err.code) {
                // Check if user is in pending pool for invalid credential error
                if (err.code === 'auth/invalid-credential') {
                    try {
                        const pendingUser = await pendingUsersService.getPendingUserByEmail(formData.email);
                        if (pendingUser) {
                            errorMessage = 'Your registration is pending admin approval. Please wait for an administrator to approve your account before signing in.';
                        } else {
                            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
                        }
                    } catch {
                        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
                    }
                } else {
                    switch (err.code) {
                        case 'auth/invalid-email':
                            errorMessage = 'Invalid email address format.';
                            break;
                        case 'auth/user-disabled':
                            errorMessage = 'This account has been disabled. Please contact an administrator.';
                            break;
                        case 'auth/user-not-found':
                            errorMessage = 'No account found with this email. Please check your email or register for a new account.';
                            break;
                        case 'auth/wrong-password':
                            errorMessage = 'Incorrect password. Please try again.';
                            break;
                        case 'auth/too-many-requests':
                            errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage = 'Network error. Please check your internet connection and try again.';
                            break;
                        case 'auth/email-not-verified':
                            errorMessage = 'Please verify your email address before signing in. Check your inbox for the verification email.';
                            break;
                        default:
                            errorMessage = err.message || 'Failed to sign in. Please try again.';
                    }
                }
            }
            
            setErrors({general: errorMessage});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left-section">
                <div className="auth-brand-logo">⚡</div>
                <h1 className="auth-brand-title">Forklift Battery Management</h1>
                <p className="auth-brand-description">
                    Professional battery watering tracking system for warehouse operations. 
                    Keep your fleet running at peak performance.
                </p>
                <div className="auth-illustration">🏭</div>
            </div>

            <div className="auth-right-section">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2 className="auth-card-title">Welcome Back</h2>
                        <p className="auth-card-subtitle">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSignIn}>
                        <div className="auth-form-group">
                            <label className="auth-form-label">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`auth-form-input ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="your.email@email.com"
                            />
                            {errors.email && (
                                <div className="auth-error-message">{errors.email}</div>
                            )}
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-form-label">Password</label>
                            <div className="auth-input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`auth-form-input ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="auth-error-message">{errors.password}</div>
                            )}
                        </div>

                        {errors.general && (
                            <div className="auth-alert auth-alert-danger">
                                {errors.general}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="auth-submit-btn"
                        >
                            {isLoading ? (
                                <>
                                    <span className="auth-spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?{' '}
                        <span className="auth-link" onClick={onSwitchToRegister}>
                            Create one here
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;