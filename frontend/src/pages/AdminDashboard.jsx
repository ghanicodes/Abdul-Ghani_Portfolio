import React, { useState, useEffect } from 'react';
import '../styles/admin.css';

const AdminDashboard = () => {
  // Navigation active tab: 'overview' | 'mern' | 'shopify' | 'messages'
  const [activeTab, setActiveTab] = useState('overview');

  // Data state
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Mobile sidebar toggle
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // Form state for project Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    category: 'mern',
    img: '',
    desc: '',
    tags: '',
    live: '',
    github: '',
    order: 0,
    isFeatured: true,
    status: 'active',
  });
  const [imageInputType, setImageInputType] = useState('file'); // 'file' | 'url'

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Apply admin light theme
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#1e293b';

    const data = JSON.parse(localStorage.getItem('adminData'));
    setAdminData(data);

    fetchAdminData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdminData = async () => {
    const token = localStorage.getItem('adminToken');
    setLoading(true);
    try {
      // Fetch messages
      const msgRes = await fetch(`${apiBaseUrl}/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.status === 401) {
        handleLogout();
        return;
      }
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      // Fetch projects
      const projRes = await fetch(`${apiBaseUrl}/admin/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Error fetching data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.reload();
  };

  const toggleSidebar = () => setIsSidebarActive(!isSidebarActive);

  // Modal open handlers
  const openAddModal = (defaultCategory = 'mern') => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: defaultCategory,
      img: '',
      desc: '',
      tags: '',
      live: '',
      github: '',
      order: projects.length + 1,
      isFeatured: true,
      status: 'active',
    });
    setImageInputType('file');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'mern',
      img: project.img || '',
      desc: project.desc || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
      live: project.live || '',
      github: project.github || '',
      order: project.order !== undefined ? project.order : 0,
      isFeatured: project.isFeatured !== undefined ? project.isFeatured : true,
      status: project.status || 'active',
    });
    setImageInputType('url');
    setIsModalOpen(true);
  };

  // Image Upload handler (Base64 file reader)
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Save Project (Create / Update)
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desc.trim() || !formData.img.trim()) {
      showToast('Title, Description, and Image are required', 'error');
      return;
    }

    const token = localStorage.getItem('adminToken');
    const endpoint = editingProject 
      ? `${apiBaseUrl}/admin/projects/${editingProject._id}`
      : `${apiBaseUrl}/admin/projects`;
    const method = editingProject ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to save project');
      }

      showToast(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      setIsModalOpen(false);
      fetchAdminData();
    } catch (error) {
      console.error('Error saving project:', error);
      showToast(error.message, 'error');
    }
  };

  // Delete Project handler
  const handleDeleteProject = async () => {
    if (!deleteConfirmProject) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${apiBaseUrl}/admin/projects/${deleteConfirmProject._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete project');

      showToast('Project deleted successfully!');
      setDeleteConfirmProject(null);
      fetchAdminData();
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast(error.message, 'error');
    }
  };

  // Computed counts
  const mernProjects = projects.filter(p => p.category?.toLowerCase() === 'mern');
  const shopifyProjects = projects.filter(p => p.category?.toLowerCase() === 'shopify');
  const totalMessages = messages.length;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentMessages = messages.filter(msg => new Date(msg.createdAt) > oneDayAgo).length;

  // Filter projects by search
  const filterBySearch = (list) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(p => 
      p.title?.toLowerCase().includes(term) || 
      p.desc?.toLowerCase().includes(term) ||
      (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(term)))
    );
  };

  return (
    <div className="dashboard">
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-box ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Mobile Navigation Header */}
      <div className="mobile-nav">
        <a href="#" className="sidebar-logo">Admin<span>CMS</span></a>
        <button id="sidebarToggle" className="toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarActive ? 'active' : ''}`} id="sidebar">
        <a href="#" className="sidebar-logo">Ghani<span>CMS</span></a>
        <ul className="nav-menu">
          <li className="nav-item">
            <a 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('overview'); setIsSidebarActive(false); }}
            >
              <i className="fas fa-chart-pie"></i>
              <span>Overview</span>
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${activeTab === 'mern' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('mern'); setIsSidebarActive(false); }}
            >
              <i className="fas fa-code"></i>
              <span>MERN Projects</span>
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${activeTab === 'shopify' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('shopify'); setIsSidebarActive(false); }}
            >
              <i className="fas fa-shopping-bag"></i>
              <span>Shopify Stores</span>
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('messages'); setIsSidebarActive(false); }}
            >
              <i className="fas fa-envelope"></i>
              <span>Contact Inquiries</span>
            </a>
          </li>
        </ul>
        <div className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content Body */}
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h1>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'mern' && 'MERN Stack Projects'}
              {activeTab === 'shopify' && 'Shopify Project Stores'}
              {activeTab === 'messages' && 'Contact Inquiries'}
            </h1>
            <p className="subtitle">
              {activeTab === 'overview' && 'Manage your portfolio content & inquiries in one place'}
              {activeTab === 'mern' && 'Control and customize MERN projects on your portfolio'}
              {activeTab === 'shopify' && 'Manage custom Shopify stores and themes'}
              {activeTab === 'messages' && 'View messages sent through your portfolio contact form'}
            </p>
          </div>
          <div className="user-info">
            <div className="avatar"><i className="fas fa-user-shield"></i></div>
            <span>{adminData ? `Welcome, ${adminData.username}` : 'Admin'}</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-mern">
            <h3>MERN Projects</h3>
            <div className="value">{mernProjects.length}</div>
          </div>
          <div className="stat-card stat-shopify">
            <h3>Shopify Stores</h3>
            <div className="value">{shopifyProjects.length}</div>
          </div>
          <div className="stat-card stat-msg">
            <h3>Total Inquiries</h3>
            <div className="value">{totalMessages}</div>
          </div>
          <div className="stat-card">
            <h3>24h Messages</h3>
            <div className="value">{recentMessages}</div>
          </div>
        </div>

        {/* --- VIEW TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="content-card">
            <div className="content-header">
              <h2>Quick Actions & System Summary</h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-primary-custom" onClick={() => openAddModal('mern')}>
                  <i className="fas fa-plus"></i> Add MERN Project
                </button>
                <button className="btn-secondary-custom" onClick={() => openAddModal('shopify')}>
                  <i className="fas fa-plus"></i> Add Shopify Store
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>All Active Projects Overview</h3>
              {loading ? (
                <p style={{ color: '#64748b' }}>Loading projects...</p>
              ) : projects.length === 0 ? (
                <p style={{ color: '#64748b' }}>No projects found in database.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Tags</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(project => (
                        <tr key={project._id}>
                          <td>
                            <img src={project.img} alt={project.title} className="admin-project-thumb" />
                          </td>
                          <td>
                            <strong>{project.title}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              {project.live ? <a href={project.live} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>Live Demo <i className="fas fa-external-link-alt"></i></a> : 'No live link'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge badge-${project.category}`}>
                              {project.category?.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div className="project-tags-admin">
                              {Array.isArray(project.tags) && project.tags.map((tag, idx) => (
                                <span key={idx} className="project-tag-pill">{tag}</span>
                              ))}
                            </div>
                          </td>
                          <td><strong>#{project.order || 0}</strong></td>
                          <td>
                            <span className={`badge badge-${project.status}`}>
                              {project.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn-action-icon btn-action-edit" onClick={() => openEditModal(project)} title="Edit Project">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn-action-icon btn-action-delete" onClick={() => setDeleteConfirmProject(project)} title="Delete Project">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW TAB 2: MERN PROJECTS --- */}
        {activeTab === 'mern' && (
          <div className="content-card">
            <div className="content-header">
              <h2>Manage MERN Projects ({mernProjects.length})</h2>
              <div className="header-actions">
                <div className="search-wrapper">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search MERN projects..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-primary-custom" onClick={() => openAddModal('mern')}>
                  <i className="fas fa-plus"></i> Add MERN Project
                </button>
              </div>
            </div>

            {loading ? (
              <p style={{ color: '#64748b' }}>Loading MERN projects...</p>
            ) : filterBySearch(mernProjects).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <i className="fas fa-code fa-3x" style={{ color: '#cbd5e1', marginBottom: '1rem' }}></i>
                <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>No MERN projects found.</p>
                <button className="btn-primary-custom" style={{ marginTop: '1rem' }} onClick={() => openAddModal('mern')}>
                  Add your first MERN project
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title & Links</th>
                      <th>Tags</th>
                      <th>Order</th>
                      <th>Featured</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterBySearch(mernProjects).map(project => (
                      <tr key={project._id}>
                        <td>
                          <img src={project.img} alt={project.title} className="admin-project-thumb" />
                        </td>
                        <td>
                          <strong>{project.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                            {project.live && <a href={project.live} target="_blank" rel="noreferrer" style={{ color: '#6366f1', marginRight: '10px' }}>Live Demo <i className="fas fa-external-link-alt"></i></a>}
                            {project.github && <a href={project.github} target="_blank" rel="noreferrer" style={{ color: '#475569' }}>GitHub <i className="fab fa-github"></i></a>}
                          </div>
                        </td>
                        <td>
                          <div className="project-tags-admin">
                            {Array.isArray(project.tags) && project.tags.map((tag, idx) => (
                              <span key={idx} className="project-tag-pill">{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td><strong>#{project.order || 0}</strong></td>
                        <td>
                          {project.isFeatured ? (
                            <span className="badge badge-featured">Initial 3</span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Expand List</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge badge-${project.status}`}>
                            {project.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action-icon btn-action-edit" onClick={() => openEditModal(project)} title="Edit Project">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn-action-icon btn-action-delete" onClick={() => setDeleteConfirmProject(project)} title="Delete Project">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW TAB 3: SHOPIFY PROJECTS --- */}
        {activeTab === 'shopify' && (
          <div className="content-card">
            <div className="content-header">
              <h2>Manage Shopify Stores ({shopifyProjects.length})</h2>
              <div className="header-actions">
                <div className="search-wrapper">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search Shopify stores..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-primary-custom" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={() => openAddModal('shopify')}>
                  <i className="fas fa-plus"></i> Add Shopify Store
                </button>
              </div>
            </div>

            {loading ? (
              <p style={{ color: '#64748b' }}>Loading Shopify projects...</p>
            ) : filterBySearch(shopifyProjects).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <i className="fas fa-shopping-bag fa-3x" style={{ color: '#cbd5e1', marginBottom: '1rem' }}></i>
                <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>No Shopify store projects found.</p>
                <button className="btn-primary-custom" style={{ marginTop: '1rem' }} onClick={() => openAddModal('shopify')}>
                  Add your first Shopify store project
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Store Image</th>
                      <th>Store Title & Links</th>
                      <th>Tech & Badges</th>
                      <th>Order</th>
                      <th>Featured</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterBySearch(shopifyProjects).map(project => (
                      <tr key={project._id}>
                        <td>
                          <img src={project.img} alt={project.title} className="admin-project-thumb" />
                        </td>
                        <td>
                          <strong>{project.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                            {project.live && <a href={project.live} target="_blank" rel="noreferrer" style={{ color: '#10b981', marginRight: '10px' }}>Live Store <i className="fas fa-external-link-alt"></i></a>}
                            {project.github && <a href={project.github} target="_blank" rel="noreferrer" style={{ color: '#475569' }}>Repository <i className="fab fa-github"></i></a>}
                          </div>
                        </td>
                        <td>
                          <div className="project-tags-admin">
                            {Array.isArray(project.tags) && project.tags.map((tag, idx) => (
                              <span key={idx} className="project-tag-pill">{tag}</span>
                            ))}
                          </div>
                        </td>
                        <td><strong>#{project.order || 0}</strong></td>
                        <td>
                          {project.isFeatured ? (
                            <span className="badge badge-featured">Initial 3</span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Expand List</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge badge-${project.status}`}>
                            {project.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action-icon btn-action-edit" onClick={() => openEditModal(project)} title="Edit Project">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn-action-icon btn-action-delete" onClick={() => setDeleteConfirmProject(project)} title="Delete Project">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW TAB 4: CONTACT MESSAGES --- */}
        {activeTab === 'messages' && (
          <div className="content-card">
            <div className="content-header">
              <h2>Contact Form Inquiries ({messages.length})</h2>
            </div>
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
                <tbody>
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#64748b' }}>No messages received yet.</td>
                    </tr>
                  ) : (
                    messages.map((msg, index) => {
                      const date = new Date(msg.createdAt);
                      return (
                        <tr key={index}>
                          <td>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td><strong>{msg.name}</strong></td>
                          <td><a href={`mailto:${msg.email}`} style={{ color: '#6366f1' }}>{msg.email}</a></td>
                          <td>{msg.subject || '-'}</td>
                          <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{msg.message}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ==================================================== */}
      {/* ADD / EDIT PROJECT MODAL */}
      {/* ==================================================== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSaveProject}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Project Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., E-Commerce LMS Platform" 
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="mern">MERN Stack Project</option>
                      <option value="shopify">Shopify Store Project</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Project Description *</label>
                  <textarea 
                    rows="3" 
                    placeholder="Provide a clear, detailed overview of the project architecture and features..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    required
                  ></textarea>
                </div>

                {/* Image Selection Toggle & Preview */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0 }}>Project Image *</label>
                    <div style={{ fontSize: '0.82rem', color: '#6366f1', cursor: 'pointer' }}>
                      <span 
                        onClick={() => setImageInputType('file')} 
                        style={{ fontWeight: imageInputType === 'file' ? 700 : 400, marginRight: '10px' }}
                      >
                        <i className="fas fa-upload"></i> Upload File
                      </span>
                      <span 
                        onClick={() => setImageInputType('url')} 
                        style={{ fontWeight: imageInputType === 'url' ? 700 : 400 }}
                      >
                        <i className="fas fa-link"></i> Image URL
                      </span>
                    </div>
                  </div>

                  {imageInputType === 'file' ? (
                    <div className="image-upload-box" onClick={() => document.getElementById('projectImageFileInput').click()}>
                      <i className="fas fa-cloud-upload-alt fa-2x" style={{ color: '#6366f1', marginBottom: '0.5rem' }}></i>
                      <p style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                        Click to select an image file from your device
                      </p>
                      <input 
                        id="projectImageFileInput"
                        type="file" 
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageFileChange}
                      />
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="e.g. /images/bootcamp-tracker.png or https://example.com/image.jpg"
                      value={formData.img}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                      required
                    />
                  )}

                  {/* Live Thumbnail Preview */}
                  {formData.img && (
                    <div className="image-preview-wrapper" style={{ marginTop: '0.75rem' }}>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Image Preview:</p>
                      <img src={formData.img} alt="Preview" onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/300x160?text=Invalid+Image+URL'; }} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Technologies / Tags (comma-separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React.js, Node.js, Express.js, MongoDB" 
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Live Demo URL</label>
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      value={formData.live}
                      onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>GitHub Repository URL</label>
                    <input 
                      type="url" 
                      placeholder="https://github.com/..." 
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Display Order Position</label>
                    <input 
                      type="number" 
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', height: '100%', paddingTop: '1.4rem' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: '#6366f1' }}
                      />
                      Initial 3 Featured
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary-custom" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  <i className="fas fa-save"></i> {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ==================================================== */}
      {deleteConfirmProject && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button className="modal-close-btn" onClick={() => setDeleteConfirmProject(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <i className="fas fa-exclamation-triangle fa-3x" style={{ color: '#ef4444', marginBottom: '1rem' }}></i>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                Delete "{deleteConfirmProject.title}"?
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Are you sure you want to delete this project? This action cannot be undone and will immediately remove it from your portfolio.
              </p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn-secondary-custom" onClick={() => setDeleteConfirmProject(null)}>
                Cancel
              </button>
              <button className="btn-danger-custom" onClick={handleDeleteProject}>
                <i className="fas fa-trash"></i> Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
