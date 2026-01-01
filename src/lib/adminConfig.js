// Add admin emails here to grant admin privileges
export const ADMIN_EMAILS = [
    "dhanushkamcr@gmail.com"
];

// Check if a user is an admin
export const isAdmin = (user) => {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email.toLowerCase());
};
