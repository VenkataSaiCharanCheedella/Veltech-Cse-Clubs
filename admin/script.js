/**
 * ==========================================================================
 * CSE CLUBS COUNCIL - EXECUTIVE ADMIN PANEL SCRIPT
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. Backend Configuration API URL & Credentials Fallback
// Paste your Google Apps Script Web App Deployment URL below
// --------------------------------------------------------------------------
const API_URL = "https://script.google.com/macros/s/AKfycbzdRehj2G4iW45YUWeR-sIQH_Vm5R8dRNSmbK2zPzidGxH1De-w_BxPVSvCu-cv7IR21g/exec";

const DEFAULT_ADMIN_USER = "admin";
const DEFAULT_ADMIN_PASS = "ChangeMe123!";

// --------------------------------------------------------------------------
// 2. Global Admin State
// --------------------------------------------------------------------------
let adminApplicationsList = [];
let adminSettings = {
    registration_status: "OPEN",
    registration_open: "",
    registration_close: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
};

const ALL_CLUBS_KEYS = [
    'Coding Club', 'Innovation Club', 'CyberSentinel Club', 'Animatrix Club',
    'Magazine Club', 'Fusion & Fashion Club', 'Nature Club', 'Yoga Club',
    'AspireX Club', 'AppNova Club', 'VelSecure Cybersecurity Club'
];

// --------------------------------------------------------------------------
// 3. Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    checkSessionAuth();
    initLoginHandler();
    initControlPanelEvents();
    initTableSearchAndExport();
});

// --------------------------------------------------------------------------
// 4. Session & Authentication Handlers
// --------------------------------------------------------------------------
function checkSessionAuth() {
    const isAuthenticated = sessionStorage.getItem('cse_council_admin_logged') === 'true';
    const loginOverlay = document.getElementById('loginOverlay');
    const adminDashboard = document.getElementById('adminDashboard');

    if (isAuthenticated) {
        loginOverlay.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        fetchDashboardData();
    } else {
        loginOverlay.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
    }
}

function initLoginHandler() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginSpinner = document.getElementById('loginSpinner');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();

        loginError.classList.add('hidden');
        loginSpinner.classList.remove('hidden');
        loginSubmitBtn.disabled = true;

        try {
            let authSuccess = false;

            if (API_URL && API_URL.trim() !== "") {
                // Remote Google Apps Script Auth
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({
                        action: 'adminLogin',
                        username: username,
                        password: password
                    })
                });
                const result = await response.json();
                authSuccess = (result.status === 'success' && result.authenticated === true);
            } else {
                // Fallback authentication
                authSuccess = (username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS);
            }

            if (authSuccess) {
                sessionStorage.setItem('cse_council_admin_logged', 'true');
                checkSessionAuth();
            } else {
                loginError.classList.remove('hidden');
            }
        } catch (err) {
            console.error('Auth error:', err);
            // Fallback check on network error
            if (username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS) {
                sessionStorage.setItem('cse_council_admin_logged', 'true');
                checkSessionAuth();
            } else {
                loginError.classList.remove('hidden');
            }
        } finally {
            loginSpinner.classList.add('hidden');
            loginSubmitBtn.disabled = false;
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('cse_council_admin_logged');
        checkSessionAuth();
    });

    document.getElementById('refreshDataBtn').addEventListener('click', () => {
        fetchDashboardData();
    });
}

// --------------------------------------------------------------------------
// 5. Control Panel & Settings Handlers
// --------------------------------------------------------------------------
function initControlPanelEvents() {
    const statusToggle = document.getElementById('regStatusToggle');
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');

    statusToggle.addEventListener('change', async () => {
        const newStatus = statusToggle.checked ? 'OPEN' : 'CLOSED';
        document.getElementById('statusToggleLabel').innerHTML = `Status: <strong>${newStatus}</strong>`;
        await updateRegistrationSettings({ registration_status: newStatus });
    });

    saveScheduleBtn.addEventListener('click', async () => {
        const openVal = document.getElementById('openDateTime').value;
        const closeVal = document.getElementById('closeDateTime').value;

        await updateRegistrationSettings({
            registration_open: openVal ? new Date(openVal).toISOString() : '',
            registration_close: closeVal ? new Date(closeVal).toISOString() : ''
        });
    });
}

async function updateRegistrationSettings(settingsPayload) {
    adminSettings = { ...adminSettings, ...settingsPayload };
    updateAdminTimerDisplay();

    if (API_URL && API_URL.trim() !== "") {
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'updateSettings',
                    settings: settingsPayload
                })
            });
            alert('Registration settings updated in Google Sheets!');
        } catch (err) {
            console.error('Error updating settings:', err);
            alert('Failed to update remote settings. Updated locally.');
        }
    } else {
        alert('Settings updated locally (Connect API_URL to sync Google Sheets).');
    }
}

function updateAdminTimerDisplay() {
    const statusText = adminSettings.registration_status || 'OPEN';
    document.getElementById('metricActiveStatus').textContent = statusText;
    document.getElementById('regStatusToggle').checked = (statusText === 'OPEN');
    document.getElementById('statusToggleLabel').innerHTML = `Status: <strong>${statusText}</strong>`;

    const countdownEl = document.getElementById('adminTimerCountdown');
    if (statusText === 'CLOSED') {
        countdownEl.textContent = 'Registrations are Currently CLOSED';
        return;
    }

    if (adminSettings.registration_close) {
        const closeTime = new Date(adminSettings.registration_close).getTime();
        const now = new Date().getTime();
        const diff = closeTime - now;

        if (diff <= 0) {
            countdownEl.textContent = 'Registration Timer Expired (Auto-Closed)';
        } else {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            countdownEl.textContent = `Registration closes in ${d} Days ${h} Hours ${m} Minutes`;
        }
    }
}

// --------------------------------------------------------------------------
// 6. Fetch Dashboard Data & Real-time Analytics Engine
// --------------------------------------------------------------------------
async function fetchDashboardData() {
    if (API_URL && API_URL.trim() !== "") {
        try {
            const [settingsRes, recentRes] = await Promise.all([
                fetch(`${API_URL}?action=getSettings`).then(r => r.json()),
                fetch(`${API_URL}?action=getRecent`).then(r => r.json())
            ]);

            if (settingsRes.status === 'success' && settingsRes.settings) {
                adminSettings = settingsRes.settings;
                updateAdminTimerDisplay();
            }

            if (recentRes.status === 'success' && Array.isArray(recentRes.data)) {
                adminApplicationsList = recentRes.data;
            }
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            loadDemoDashboardData();
        }
    } else {
        loadDemoDashboardData();
    }

    renderMetricsAndAnalytics();
    renderRecentApplicationsTable();
}

function loadDemoDashboardData() {
    // Generate realistic demo data when API_URL is unconfigured
    adminApplicationsList = [
        { timestamp: '2026-08-07 10:15', category: 'Leadership', name: 'Rahul Sharma', vtu: '1VT21CS045', role: 'Technical Head', dept: 'CSE', year: '3rd Year', phone: '9876543210', email: 'rahul@gmail.com', skills: 'Python, Node.js, Leadership', exp: 'Organized Hackathon 2025', mentorName: 'Dr. G. S. Prasad', mentorPhone: '9448833221' },
        { timestamp: '2026-08-07 11:30', category: 'Club', name: 'Ananya Rao', vtu: '1VT22CS012', role: 'Coding Club', dept: 'ISE', year: '2nd Year', phone: '9812345678', email: 'ananya@gmail.com', skills: 'C++, DSA, Competitive Coding', exp: 'CodeChef 3-star', mentorName: 'Mrs. L. V. Geetha', mentorPhone: '9448833222' },
        { timestamp: '2026-08-07 12:05', category: 'Club', name: 'Vikram Verma', vtu: '1VT23AI089', role: 'CyberSentinel Club', dept: 'AIML', year: '1st Year', phone: '9765432109', email: 'vikram@gmail.com', skills: 'Linux, Wireshark, CTF', exp: 'TryHackMe top 5%', mentorName: 'Dr. T. S. Naveen', mentorPhone: '9448833223' },
        { timestamp: '2026-08-07 12:40', category: 'Leadership', name: 'Sneha Patel', vtu: '1VT21CS099', role: 'Vice President', dept: 'CSE', year: '3rd Year', phone: '9988776655', email: 'sneha@gmail.com', skills: 'Project Mgmt, Public Speaking', exp: 'Class Representative', mentorName: 'Dr. M. S. Suresh', mentorPhone: '9448833224' },
        { timestamp: '2026-08-07 13:10', category: 'Club', name: 'Karthik N', vtu: '1VT22DS033', role: 'AppNova Club', dept: 'DS', year: '2nd Year', phone: '9123456780', email: 'karthik@gmail.com', skills: 'Flutter, Firebase, Kotlin', exp: 'Built 2 PlayStore Apps', mentorName: 'Mr. R. K. Ramesh', mentorPhone: '9448833225' }
    ];
    updateAdminTimerDisplay();
}

function renderMetricsAndAnalytics() {
    const totalApps = adminApplicationsList.length;
    const leadershipApps = adminApplicationsList.filter(a => a.category === 'Leadership').length;
    const clubApps = adminApplicationsList.filter(a => a.category === 'Club').length;

    document.getElementById('metricTotalApps').textContent = totalApps;
    document.getElementById('metricLeadershipApps').textContent = leadershipApps;
    document.getElementById('metricClubApps').textContent = clubApps;

    // Render Club Breakdown Meters
    const clubCounts = {};
    ALL_CLUBS_KEYS.forEach(c => clubCounts[c] = 0);

    adminApplicationsList.forEach(app => {
        if (app.category === 'Club' && app.role) {
            const matchedKey = ALL_CLUBS_KEYS.find(k => k.toLowerCase().includes(app.role.toLowerCase()) || app.role.toLowerCase().includes(k.toLowerCase()));
            if (matchedKey) {
                clubCounts[matchedKey] = (clubCounts[matchedKey] || 0) + 1;
            }
        }
    });

    const metersContainer = document.getElementById('clubMetersGrid');
    metersContainer.innerHTML = ALL_CLUBS_KEYS.map(club => {
        const count = clubCounts[club] || 0;
        const max = Math.max(...Object.values(clubCounts), 1);
        const percent = Math.min(100, Math.round((count / max) * 100));

        return `
            <div class="club-meter-item">
                <div class="meter-header">
                    <span>${club}</span>
                    <span>${count} apps</span>
                </div>
                <div class="meter-track">
                    <div class="meter-fill" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    }).join('');

    // Demographics Breakdown
    const yearCounts = { '1st Year': 0, '2nd Year': 0, '3rd Year': 0, '4th Year': 0 };
    const deptCounts = {};

    adminApplicationsList.forEach(app => {
        if (app.year && yearCounts[app.year] !== undefined) yearCounts[app.year]++;
        if (app.dept) deptCounts[app.dept] = (deptCounts[app.dept] || 0) + 1;
    });

    const yearList = document.getElementById('yearBreakdownList');
    yearList.innerHTML = Object.keys(yearCounts).map(y => {
        const c = yearCounts[y];
        const pct = totalApps > 0 ? Math.round((c / totalApps) * 100) : 0;
        return `
            <div class="mini-bar-row">
                <span class="mini-bar-label">${y}</span>
                <div class="mini-bar-track"><div class="meter-fill" style="width: ${pct}%;"></div></div>
                <span class="mini-bar-val">${c}</span>
            </div>
        `;
    }).join('');

    const deptList = document.getElementById('deptBreakdownList');
    deptList.innerHTML = Object.keys(deptCounts).map(d => {
        const c = deptCounts[d];
        const pct = totalApps > 0 ? Math.round((c / totalApps) * 100) : 0;
        return `
            <div class="mini-bar-row">
                <span class="mini-bar-label">${d}</span>
                <div class="mini-bar-track"><div class="meter-fill" style="width: ${pct}%;"></div></div>
                <span class="mini-bar-val">${c}</span>
            </div>
        `;
    }).join('');
}

// --------------------------------------------------------------------------
// 7. Applications Table & Export CSV Handler
// --------------------------------------------------------------------------
function renderRecentApplicationsTable(filterQuery = '') {
    const tbody = document.getElementById('tableBody');
    const query = filterQuery.toLowerCase().trim();

    const filtered = adminApplicationsList.filter(app => {
        return (
            app.name.toLowerCase().includes(query) ||
            app.vtu.toLowerCase().includes(query) ||
            app.role.toLowerCase().includes(query) ||
            app.dept.toLowerCase().includes(query)
        );
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No applications found matching criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((app, index) => `
        <tr>
            <td>${app.timestamp || 'Just now'}</td>
            <td><span class="badge-cat ${app.category}">${app.category}</span></td>
            <td><strong>${app.name}</strong></td>
            <td><code>${app.vtu}</code></td>
            <td>${app.role}</td>
            <td>${app.dept} / ${app.year}</td>
            <td>${app.phone}</td>
            <td>
                <span class="action-link" onclick="openDetailModal(${index})">View Details</span>
            </td>
        </tr>
    `).join('');
}

function initTableSearchAndExport() {
    document.getElementById('tableSearchInput').addEventListener('input', (e) => {
        renderRecentApplicationsTable(e.target.value);
    });

    document.getElementById('exportCsvBtn').addEventListener('click', exportToCSV);
    document.getElementById('closeDetailModalBtn').addEventListener('click', closeDetailModal);
}

function openDetailModal(index) {
    const app = adminApplicationsList[index];
    if (!app) return;

    const content = document.getElementById('detailModalContent');
    content.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item"><label>Candidate Name</label><span>${app.name}</span></div>
            <div class="detail-item"><label>VTU USN</label><span>${app.vtu}</span></div>
            <div class="detail-item"><label>Category</label><span>${app.category}</span></div>
            <div class="detail-item"><label>Position / Club</label><span>${app.role}</span></div>
            <div class="detail-item"><label>Department & Year</label><span>${app.dept} - ${app.year} (Sec ${app.section || 'N/A'})</span></div>
            <div class="detail-item"><label>Phone & Email</label><span>${app.phone}<br>${app.email}</span></div>
            <div class="detail-item"><label>Mentor Name</label><span>${app.mentorName || 'N/A'}</span></div>
            <div class="detail-item"><label>Mentor Phone</label><span>${app.mentorPhone || 'N/A'}</span></div>
        </div>

        <div class="detail-block">
            <h5>Technical & Domain Skills</h5>
            <p>${app.skills || 'N/A'}</p>
        </div>

        <div class="detail-block">
            <h5>Past Experience & Projects</h5>
            <p>${app.exp || app.experience || 'N/A'}</p>
        </div>

        <div class="detail-grid">
            <div class="detail-item"><label>GitHub</label><span>${app.github ? `<a href="${app.github}" target="_blank" class="action-link">View Profile</a>` : 'N/A'}</span></div>
            <div class="detail-item"><label>LinkedIn</label><span>${app.linkedin ? `<a href="${app.linkedin}" target="_blank" class="action-link">View Profile</a>` : 'N/A'}</span></div>
        </div>
    `;

    document.getElementById('detailModal').classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

function exportToCSV() {
    if (adminApplicationsList.length === 0) {
        alert('No applications data available to export.');
        return;
    }

    const headers = ['Timestamp', 'Category', 'VTU Number', 'Full Name', 'Department', 'Year', 'Section', 'Phone', 'Email', 'Role / Club', 'Skills', 'Experience', 'Mentor Name', 'Mentor Phone'];
    const rows = adminApplicationsList.map(a => [
        `"${a.timestamp || ''}"`,
        `"${a.category || ''}"`,
        `"${a.vtu || ''}"`,
        `"${a.name || ''}"`,
        `"${a.dept || ''}"`,
        `"${a.year || ''}"`,
        `"${a.section || ''}"`,
        `"${a.phone || ''}"`,
        `"${a.email || ''}"`,
        `"${a.role || ''}"`,
        `"${(a.skills || '').replace(/"/g, '""')}"`,
        `"${(a.exp || a.experience || '').replace(/"/g, '""')}"`,
        `"${a.mentorName || ''}"`,
        `"${a.mentorPhone || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cse_council_recruitment_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
