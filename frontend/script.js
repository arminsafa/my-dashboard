const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // --- Routing & Auth Check ---
    const path = window.location.pathname;
    const isDashboard = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    const user = JSON.parse(localStorage.getItem('dashboard_user'));

    if (isDashboard && !user) {
        window.location.href = 'login.html';
        return;
    }

    if (!isDashboard && user && (path.endsWith('login.html') || path.endsWith('signup.html'))) {
        window.location.href = 'index.html';
        return;
    }

    // --- Auth Logic ---
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                if (result.success) {
                    localStorage.setItem('dashboard_user', JSON.stringify(result.data));
                    window.location.href = 'index.html';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Connection error. Is the backend running?');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role: 'Supervisor' })
                });

                const result = await response.json();
                if (result.success) {
                    localStorage.setItem('dashboard_user', JSON.stringify(result.data));
                    window.location.href = 'index.html';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Connection error. Is the backend running?');
            }
        });
    }

    // --- Dashboard Initialization ---
    if (isDashboard && user) {
        initDashboard(user);
    }
});

function initDashboard(user) {
    // Set User Info
    document.getElementById('user-name').innerText = user.name;
    document.getElementById('user-role').innerText = user.role;
    document.getElementById('user-avatar').innerText = user.name.charAt(0).toUpperCase();

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('dashboard_user');
        window.location.href = 'login.html';
    });

    // Lead Management
    const leadFormContainer = document.getElementById('lead-form-container');
    const leadForm = document.getElementById('lead-form');
    const leadsBody = document.getElementById('leads-body');
    const showAddLeadBtn = document.getElementById('show-add-lead-btn');
    const cancelLeadBtn = document.getElementById('cancel-lead-btn');

    showAddLeadBtn.addEventListener('click', () => {
        leadForm.reset();
        document.getElementById('lead-id').value = '';
        document.getElementById('form-title').innerText = 'Add New Lead';
        leadFormContainer.style.display = 'block';
    });

    cancelLeadBtn.addEventListener('click', () => {
        leadFormContainer.style.display = 'none';
    });

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('lead-id').value;
        const data = {
            client_name: document.getElementById('client_name').value,
            phone_number: document.getElementById('phone_number').value,
            country: document.getElementById('country').value,
            status: document.getElementById('status').value,
            assigned_agent: document.getElementById('assigned_agent').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/leads/${id}` : `${API_BASE}/leads`;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                leadFormContainer.style.display = 'none';
                fetchLeads();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error saving lead.');
        }
    });

    // Fetch initial leads
    fetchLeads();

    // Simulated Real-time Data
    const activeCallsEl = document.getElementById('active-calls-count');
    if (activeCallsEl) {
        let count = 12;
        setInterval(() => {
            const change = Math.floor(Math.random() * 3) - 1;
            count = Math.max(8, Math.min(18, count + change));
            activeCallsEl.innerText = count;
        }, 3000);
    }

    // Chart Animation
    const bars = document.querySelectorAll('.chart-bar');
    setTimeout(() => {
        bars.forEach(bar => {
            const targetHeight = bar.getAttribute('data-height');
            bar.style.height = targetHeight + '%';
        });
    }, 500);
}

async function fetchLeads() {
    const leadsBody = document.getElementById('leads-body');
    try {
        const response = await fetch(`${API_BASE}/leads`);
        const result = await response.json();

        if (result.success) {
            renderLeads(result.data);
        }
    } catch (error) {
        console.error('Error fetching leads:', error);
    }
}

function renderLeads(leads) {
    const leadsBody = document.getElementById('leads-body');
    leadsBody.innerHTML = '';

    leads.forEach(lead => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${lead.client_name}</td>
            <td>${lead.phone_number}</td>
            <td>${lead.country}</td>
            <td><span class="status-badge status-${lead.status.toLowerCase()}">${lead.status}</span></td>
            <td>${lead.assigned_agent || 'Unassigned'}</td>
            <td class="actions-cell">
                <button class="btn-edit" onclick="editLead(${lead.id}, '${lead.client_name}', '${lead.phone_number}', '${lead.country}', '${lead.status}', '${lead.assigned_agent || ''}')">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-delete" onclick="deleteLead(${lead.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        leadsBody.appendChild(tr);
    });
}

async function deleteLead(id) {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
        const response = await fetch(`${API_BASE}/leads/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
            fetchLeads();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error deleting lead.');
    }
}

function editLead(id, name, phone, country, status, agent) {
    document.getElementById('lead-id').value = id;
    document.getElementById('client_name').value = name;
    document.getElementById('phone_number').value = phone;
    document.getElementById('country').value = country;
    document.getElementById('status').value = status;
    document.getElementById('assigned_agent').value = agent;

    document.getElementById('form-title').innerText = 'Edit Lead';
    document.getElementById('lead-form-container').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Attach functions to window for onclick handlers
window.deleteLead = deleteLead;
window.editLead = editLead;
