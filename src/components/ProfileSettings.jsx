import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { forkliftService } from "../services/forkliftService";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import "../styles/App.css";

const ProfileSettings = ({ user }) => {
    const [displayName, setDisplayName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!displayName.trim()) {
            setError("Display name cannot be empty");
            return;
        }

        if (displayName.trim().length < 2) {
            setError("Display name must be at least 2 characters");
            return;
        }

        if (displayName.trim() === user?.displayName) {
            setError("New display name is the same as the current one");
            return;
        }

        setIsLoading(true);

        try {
            const oldDisplayName = user?.displayName || user?.email || "Unknown User";

            // Update user profile
            await updateProfile(auth.currentUser, {
                displayName: displayName.trim(),
            });

            // Update all historical watering records
            const updatedCount = await forkliftService.updateAllWateredByRecords(
                oldDisplayName,
                displayName.trim()
            );

            setSuccess(
                `Display name updated successfully! ${updatedCount} historical watering ${updatedCount === 1 ? 'record' : 'records'} updated with your new name.`
            );
            
            // Force a small delay to show success message before potential re-render
            setTimeout(() => {
                window.location.reload();
            }, 2000);

            setDisplayName("");
        } catch (err) {
            let errorMessage = "Failed to update profile. Please try again.";

            if (err.code) {
                switch (err.code) {
                    case "auth/requires-recent-login":
                        errorMessage =
                            "For security reasons, please sign out and sign in again before changing your profile.";
                        break;
                    case "auth/network-request-failed":
                        errorMessage = "Network error. Please check your internet connection.";
                        break;
                    default:
                        errorMessage = err.message || errorMessage;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-person-circle me-2"></i>
                                Profile Settings
                            </h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="mb-4">
                                <h6 className="text-muted">Account Information</h6>
                                <div className="border-start border-primary border-3 ps-3 py-2 bg-light">
                                    <div className="mb-2">
                                        <strong>Email:</strong> {user?.email}
                                    </div>
                                    <div>
                                        <strong>Current Display Name:</strong>{" "}
                                        {user?.displayName || "Not set"}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError("")}>
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success" dismissible onClose={() => setSuccess("")}>
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {success}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <strong>New Display Name</strong>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your display name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        disabled={isLoading}
                                        maxLength={50}
                                    />
                                    <Form.Text className="text-muted">
                                        This name will be shown in the navigation bar and recorded with
                                        future watering logs.
                                    </Form.Text>
                                </Form.Group>

                                <div className="alert alert-warning">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <strong>Important:</strong> Changing your display name will update
                                    ALL watering records across the system, including historical records
                                    where your name is recorded. This ensures consistency throughout the
                                    database.
                                </div>

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isLoading}
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-lg me-2"></i>
                                                Update Display Name
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        href="/"
                                        disabled={isLoading}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
};

export default ProfileSettings;
