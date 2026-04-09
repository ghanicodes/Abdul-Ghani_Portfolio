import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Portfolio Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Admin Section */}
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            )
          } 
        />

        {/* Redirect any other route to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
