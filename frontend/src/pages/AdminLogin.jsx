import React, { useState, useEffect } from 'react';
import '../styles/admin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  useEffect(() => {
    // Apply admin light theme
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#1e293b';
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        onLoginSuccess();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error. Make sure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Admin<span>Panel</span></h2>
          <p>Please enter your credentials to login</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-login" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
