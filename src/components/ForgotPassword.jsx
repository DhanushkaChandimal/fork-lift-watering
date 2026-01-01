import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import "../styles/Auth.css";

const ForgotPassword = ({ onBackToSignIn }) => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");

        // Validate email
        if (!email.trim()) {
            setErrors({ email: "Please enter your email address" });
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ email: "Please enter a valid email address" });
            return;
        }

        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage(
                "Password reset email sent! Please check your inbox and follow the instructions to reset your password."
            );
            setEmail("");
        } catch (err) {
            let errorMessage = "An error occurred. Please try again.";

            if (err.code) {
                switch (err.code) {
                    case "auth/user-not-found":
                        errorMessage = "No account found with this email address.";
                        break;
                    case "auth/invalid-email":
                        errorMessage = "Invalid email address format.";
                        break;
                    case "auth/too-many-requests":
                        errorMessage = "Too many requests. Please try again later.";
                        break;
                    case "auth/network-request-failed":
                        errorMessage = "Network error. Please check your internet connection.";
                        break;
                    default:
                        errorMessage = err.message || "Failed to send reset email. Please try again.";
                }
            }

            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left-section">
                <div className="auth-brand-logo">🚜</div>
                <h1 className="auth-brand-title">Forklift Water Management</h1>
                <p className="auth-brand-description">
                    Reset your password and regain access to your account
                </p>
                <div className="auth-illustration">🔑</div>
            </div>

            <div className="auth-right-section">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2 className="auth-title">Forgot Password</h2>
                        <p className="auth-subtitle">
                            Enter your email address and we'll send you instructions to reset your password
                        </p>
                    </div>

                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            {successMessage}
                        </div>
                    )}

                    {errors.general && (
                        <div className="alert alert-danger" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                <i className="bi bi-envelope me-2"></i>
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={`mb-3 form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 auth-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send me-2"></i>
                                    Send Reset Link
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <button
                            onClick={onBackToSignIn}
                            className="btn btn-link auth-link"
                            disabled={isLoading}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
