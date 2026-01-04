# Forklift Battery Watering Management System

A comprehensive web application for tracking and managing forklift battery watering schedules. This system helps maintenance teams ensure forklift batteries are watered regularly, preventing equipment damage and extending battery life.

## 🌐 Live Demo

- **Application**: [https://6259-forklifts.vercel.app/auth](https://6259-forklifts.vercel.app/auth)
- **Practice Mode**: [https://6259-forklifts.vercel.app/practice](https://6259-forklifts.vercel.app/practice) - Try all features with sample data!

## 🚀 Features

### Core Functionality
- **Real-time Forklift Tracking**: Monitor all forklifts with visual indicators based on watering urgency
- **Automated Priority System**: 
  - 🔴 Red (Urgent): Not watered for 14+ days or never watered
  - 🟡 Yellow (Warning): Not watered for 10-13 days
  - 🟢 Green (Good): Watered within the last 10 days
- **Watering History**: Track who watered each forklift and when
- **Service Management**: Mark forklifts as out-of-service and automatically adjust watering schedules
- **Practice Mode**: Test the system with sample data without affecting real records

### User Management
- **Email Verification**: Secure email verification for all new users
- **Pending Users Pool**: Registration requests are stored in a pending users pool awaiting admin review
- **Admin Approval System**: Admin panel for approving or rejecting user registrations from the pool
- **Profile Management**: Users can update their display names
- **Role-Based Access**: Admin-only features protected by role checking

### Authentication
- User registration with admin approval workflow
- Email/password authentication via Firebase
- Password reset functionality
- Email verification requirement
- Profile settings for users to update their information

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.11.0
- **UI Framework**: React Bootstrap 2.10.10 + Bootstrap 5.3.8
- **State Management**: TanStack React Query 5.90.16
- **Backend**: Firebase (Authentication + Firestore Database)
- **Deployment**: Vercel

## 📁 Project Structure

```
fork-lift-watering/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── modals/
│   │   │   ├── AddForkliftModal.jsx
│   │   │   ├── ServiceStatusModal.jsx
│   │   │   └── WaterBatteryModal.jsx
│   │   ├── tables/
│   │   │   └── ForkliftTable.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── EmailVerification.jsx
│   │   ├── Footer.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ForkliftDashboard.jsx
│   │   ├── Navbar.jsx
│   │   ├── PracticeDashboard.jsx
│   │   ├── ProfileSettings.jsx
│   │   ├── Register.jsx
│   │   └── SignIn.jsx
│   ├── hooks/
│   │   └── useForklift.js
│   ├── lib/
│   │   ├── adminConfig.js
│   │   └── firebaseConfig.js
│   ├── services/
│   │   ├── forkliftService.js
│   │   ├── pendingUsersService.js
│   │   └── userService.js
│   ├── styles/
│   │   ├── App.css
│   │   └── Auth.css
│   ├── utils/
│   │   └── forkliftUtils.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## 🎯 Usage Guide

### For Regular Users

1. **Register an Account**
   - Click "Register" on the sign-in page
   - Provide email, display name, and password
   - Your registration will be added to the pending users pool
   - Wait for admin approval

2. **After Admin Approval**
   - Check your email for verification link
   - Verify your email address
   - Sign in to access the dashboard

3. **Water a Forklift**
   - Locate the forklift in the dashboard
   - Click "Water Battery"
   - Select the date (defaults to today)
   - Confirm

4. **Practice Mode**
   - Navigate to the Practice Dashboard via the navbar or visit [https://6259-forklifts.vercel.app/practice](https://6259-forklifts.vercel.app/practice)
   - Test all features with sample data
   - Changes are local and don't affect the real database
   - No login required - perfect for trying out the system!

### For Administrators

1. **Access Admin Panel**
   - Sign in with an admin email
   - Click "Admin Panel" in the navbar

2. **Approve/Reject Users from Pending Pool**
   - Review pending registration requests in the pending users pool
   - Approve to create the account and send verification email
   - Reject to remove the registration request from the pool

3. **Manage Forklifts**
   - Add new forklifts to the system
   - Mark forklifts as out-of-service
   - Return forklifts to active service
   - System automatically adjusts watering dates based on service status

## 🎨 Key Features Explained

### Priority Coloring System
The application uses a color-coded system to indicate watering urgency:
- **Red (Urgent)**: 14+ days since last watering or never watered
- **Yellow (Warning)**: 10-13 days since last watering
- **Green (Good)**: 0-9 days since last watering

### Service Status Management
When a forklift is marked out-of-service:
- It's moved to a separate "Out of Service" section
- When returned to service, the system intelligently adjusts the last watering date
- If watered during out-of-service period, date is set to return date
- If watered before going out, the out-of-service period is added to maintain accurate tracking

### Dual-Dashboard System
- **Main Dashboard**: Connected to Firebase, tracks real forklifts
- **Practice Dashboard**: Uses local state with sample data for training/testing

### Registration Approval Workflow
The application implements a secure registration process:
1. **User Submits Registration**: New users enter their details on the registration page
2. **Pending Users Pool**: Registration data is stored in a Firestore collection (`pendingUsers`)
3. **Admin Review**: Administrators can view all pending requests in the Admin Panel
4. **Approval Process**: 
   - When approved, a Firebase Authentication account is created
   - User receives a verification email
   - Registration is moved from pending pool to registered users
5. **Rejection Process**: Registration is removed from the pending pool without creating an account

## 🔐 Security Features

- Email verification required for all users
- Pending users pool system for registration management
- Admin approval workflow for new registrations (no direct account creation)
- Role-based access control for admin features
- Secondary authentication for creating users (doesn't affect admin session)
- Protected routes requiring authentication
- Duplicate registration prevention (checks both pending pool and registered users)

## 🌐 Deployment

This application is deployed on Vercel and accessible at:
- **Main Application**: [https://6259-forklifts.vercel.app/auth](https://6259-forklifts.vercel.app/auth)
- **Practice Demo**: [https://6259-forklifts.vercel.app/practice](https://6259-forklifts.vercel.app/practice)

## 📝 License

This project is private and proprietary.

## 👨‍💻 Author

**Dhanushka**

Developed for efficient forklift battery maintenance management.
