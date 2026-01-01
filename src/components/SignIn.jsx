import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { pendingUsersService } from "../services/pendingUsersService";

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
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card border-0 shadow-lg p-5">
                <h2 className="h3 fw-bold text-center">Welcome Back</h2>
                <p className="text-muted text-center">Sign in to your account</p>

                <form onSubmit={handleSignIn}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👀" : "👁️‍🗨️"}
                            </button>
                            {errors.password && (
                                <div className="invalid-feedback d-block">{errors.password}</div>
                            )}
                        </div>
                    </div>

                    {errors.general && (
                        <div className="alert alert-danger text-center" role="alert">
                            {errors.general}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={"btn btn-primary btn-lg w-100"}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <small className="text-muted text-center mt-4">
                    Don't have an account? <span 
                        role="button" 
                        className="text-primary text-decoration-underline"
                        onClick={onSwitchToRegister}
                    >
                        Create one here
                    </span>
                </small>
            </div>
        </div>
    );
};

export default SignIn;