import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebaseConfig';
import { isAdmin } from './lib/adminConfig';
import ForkliftDashboard from "./components/ForkliftDashboard";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import NavigationBar from "./components/Navbar";
import EmailVerification from "./components/EmailVerification";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is logged in but email is not verified, show verification page
  if (user && !user.emailVerified) {
    return <EmailVerification user={user} />;
  }

  return (
    <>
      <NavigationBar user={user} />
      <Routes>
        <Route 
          path='/auth' 
          element={
            user ? (
              <Navigate to="/" replace />
            ) : showRegister ? (
              <Register onSwitchToSignIn={() => setShowRegister(false)} />
            ) : (
              <SignIn onSwitchToRegister={() => setShowRegister(true)} />
            )
          }
        />
        <Route 
          path='/admin' 
          element={
            user && isAdmin(user) ? (
              <AdminPanel user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path='/' 
          element={user ? <ForkliftDashboard user={user} /> : <Navigate to="/auth" replace />}
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App
