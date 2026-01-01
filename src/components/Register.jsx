import { useState } from "react";
import { pendingUsersService } from "../services/pendingUsersService";
import "../styles/Auth.css";

const Register = ({ onSwitchToSignIn }) => {
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Display name validation
        if (!formData.displayName.trim()) {
            newErrors.displayName = "Display name is required";
        } else if (formData.displayName.trim().length < 2) {
            newErrors.displayName = "Display name must be at least 2 characters";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Check if user is already in the pending pool
            const existingPendingUser = await pendingUsersService.getPendingUserByEmail(formData.email.trim());
            
            if (existingPendingUser) {
                setErrors({
                    general: "Your registration request is already pending. Please wait for an administrator to approve your account, or contact an administrator for assistance."
                });
                setIsLoading(false);
                return;
            }

            // Add user to pending registration pool
            await pendingUsersService.addPendingUser({
                displayName: formData.displayName.trim(),
                email: formData.email.trim(),
                password: formData.password // Note: In production, you should hash this or handle it more securely
            });

            setFormData({
                displayName: "",
                email: "",
                password: "",
                confirmPassword: ""
            });
            
            alert("Registration request submitted! An administrator will review and approve your account. You will be able to sign in after approval.");
            
            // Switch back to sign in page
            if (onSwitchToSignIn) {
                onSwitchToSignIn();
            }
        } catch (err) {
            const errorMessage = err?.message || 'An unknown error occurred';
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
                    Join our professional battery watering tracking system. 
                    Streamline your warehouse operations and maximize fleet efficiency.
                </p>
                <div className="auth-illustration">🔋</div>
            </div>

            <div className="auth-right-section">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2 className="auth-card-title">Create Account</h2>
                        <p className="auth-card-subtitle">Register to access the system</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="auth-form-group">
                            <label className="auth-form-label">Display Name</label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => handleInputChange('displayName', e.target.value)}
                                className={`auth-form-input ${errors.displayName ? 'is-invalid' : ''}`}
                                placeholder="Enter your name"
                            />
                            {errors.displayName && (
                                <div className="auth-error-message">{errors.displayName}</div>
                            )}
                        </div>

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

                        <div className="auth-form-group">
                            <label className="auth-form-label">Confirm Password</label>
                            <div className="auth-input-group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className={`auth-form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className="auth-error-message">{errors.confirmPassword}</div>
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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{' '}
                        <span className="auth-link" onClick={onSwitchToSignIn}>
                            Sign in here
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
