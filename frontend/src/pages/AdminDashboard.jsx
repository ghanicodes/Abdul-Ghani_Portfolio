import React, { useState, useEffect } from 'react';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Apply admin light theme
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#1e293b';

    const data = JSON.parse(localStorage.getItem('adminData'));
    setAdminData(data);
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${apiBaseUrl}/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.reload();
  };

  const toggleSidebar = () => setIsSidebarActive(!isSidebarActive);

  // Stats calculation
  const totalMessages = messages.length;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentMessages = messages.filter(msg => new Date(msg.createdAt) > oneDayAgo).length;

  return (
    <div className="dashboard">
      {/* Mobile Header */}
      <div className="mobile-nav">
        <a href="#" className="sidebar-logo">Admin<span>Panel</span></a>
        <button id="sidebarToggle" className="toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <aside className={`sidebar ${isSidebarActive ? 'active' : ''}`} id="sidebar">
        <a href="#" className="sidebar-logo">Admin<span>Panel</span></a>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="#" className="nav-link active">
              <i className="fas fa-envelope"></i>
              <span>Messages</span>
            </a>
          </li>
        </ul>
        <div className="logout-btn" id="logoutBtn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h1>Contact Messages</h1>
            <p className="subtitle">Manage your inquiries</p>
          </div>
          <div className="user-info">
            <div className="avatar"><i className="fas fa-user-shield"></i></div>
            <span id="adminNameDisplay">{adminData ? `Welcome, ${adminData.username}` : 'Admin'}</span>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Messages</h3>
            <div className="value" id="totalMsgCount">{totalMessages}</div>
          </div>
          <div className="stat-card">
            <h3>Last 24 Hours</h3>
            <div className="value" id="recentMsgCount">{recentMessages}</div>
          </div>
        </div>

        <div className="content-card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody id="messagesBody">
                {messages.map((msg, index) => {
                  const date = new Date(msg.createdAt);
                  return (
                    <tr key={index}>
                      <td>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td><strong>{msg.name}</strong></td>
                      <td><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
                      <td>{msg.subject || '-'}</td>
                      <td>{msg.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
