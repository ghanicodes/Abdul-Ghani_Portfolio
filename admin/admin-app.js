document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const apiBaseUrl = 'https://abdul-ghani-portfolio.vercel.app/api';

    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    }

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('button');
        
        submitBtn.innerText = "Authenticating...";
        submitBtn.disabled = true;

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
                showDashboard();
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Server error. Make sure backend is running.');
        } finally {
            submitBtn.innerText = "Login to Dashboard";
            submitBtn.disabled = false;
        }
    });

    // Handle Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        window.location.reload();
    });

    function showDashboard() {
        loginSection.classList.add('hidden');
        dashboardSection.style.display = 'block'; // Changed to block for layout consistency
        
        // Sidebar Toggle for Mobile
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
        
        const adminData = JSON.parse(localStorage.getItem('adminData'));
        if (adminData) {
            document.getElementById('adminNameDisplay').innerText = `Welcome, ${adminData.username}`;
        }
        
        fetchMessages();
    }

    async function fetchMessages() {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`${apiBaseUrl}/admin/contacts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
                // Token expired or invalid
                logoutBtn.click();
                return;
            }

            const messages = await response.json();
            renderMessages(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    function renderMessages(messages) {
        const body = document.getElementById('messagesBody');
        const totalCount = document.getElementById('totalMsgCount');
        const recentCount = document.getElementById('recentMsgCount');
        
        body.innerHTML = '';
        totalCount.innerText = messages.length;
        
        // Calculate recent (last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        let recent = 0;

        messages.forEach(msg => {
            const date = new Date(msg.createdAt);
            if (date > oneDayAgo) recent++;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td><strong>${msg.name}</strong></td>
                <td><a href="mailto:${msg.email}">${msg.email}</a></td>
                <td>${msg.subject || '-'}</td>
                <td>${msg.message}</td>
            `;
            body.appendChild(row);
        });
        
        recentCount.innerText = recent;
    }
});
