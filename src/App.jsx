import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebaseConfig';
import ForkliftDashboard from "./components/ForkliftDashboard";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import NavigationBar from "./components/Navbar";

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
          path='/' 
          element={user ? <ForkliftDashboard user={user} /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </>
  )
}

export default App
