/**
 * ==========================================================================
 * CSE CLUBS COUNCIL RECRUITMENT PORTAL - PUBLIC SCRIPT MODULE
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. Backend Configuration API URL
// Vercel Serverless Endpoint for MySQL Database
// --------------------------------------------------------------------------
const API_URL = "/api/submit";

// --------------------------------------------------------------------------
// 2. Data Definitions (5 Leadership Roles & 11 Clubs)
// --------------------------------------------------------------------------
const LEADERSHIP_ROLES = [
    {
        id: 'vp',
        title: 'Vice President',
        icon: 'VP',
        desc: 'Assist the Council President in overall strategic planning, departmental liaison, and club oversight.',
        badge: 'Executive Board',
        eligibleYears: ['2nd Year', '3rd Year'],
        details: '<strong>About the Role</strong><br>The Vice President serves as the second-in-command of the CSE Clubs Council and works closely with the President to ensure the smooth functioning of all clubs. This role focuses on coordination, leadership, and maintaining communication between the Executive Council and Club Heads.<br><br><strong>Key Responsibilities</strong><ul><li>Assist the President in managing all CSE clubs.</li><li>Coordinate with Club Heads and monitor club progress.</li><li>Conduct meetings in the President\'s absence.</li><li>Ensure clubs remain active and responsibilities are fulfilled.</li><li>Support planning and execution of department-wide initiatives.</li></ul><br><strong>Ideal Candidate:</strong> A responsible leader with strong communication, teamwork, and organizational skills.'
    },
    {
        id: 'events-head',
        title: 'Events Head',
        icon: 'EH',
        desc: 'Lead execution of hackathons, tech symposiums, workshops, and inter-departmental competitions.',
        badge: 'Operational Lead',
        eligibleYears: ['2nd Year', '3rd Year'],
        details: '<strong>About the Role</strong><br>The Events Head is responsible for planning and supervising events conducted by every club. This role ensures that clubs remain active by organizing engaging activities and maintaining a structured event calendar throughout the academic year.<br><br><strong>Key Responsibilities</strong><ul><li>Ensure every club conducts at least one event every two weeks.</li><li>Coordinate event planning with Club Heads.</li><li>Review and approve event proposals.</li><li>Oversee event execution and quality.</li><li>Maintain the annual CSE Clubs event calendar.</li></ul><br><strong>Ideal Candidate:</strong> Someone with excellent planning, leadership, and event management skills.'
    },
    {
        id: 'tech-head',
        title: 'Technical Head',
        icon: 'TH',
        desc: 'Oversee technical infrastructure, developer initiatives, code repositories, and tech judging.',
        badge: 'Technical Lead',
        eligibleYears: ['2nd Year', '3rd Year'],
        details: '<strong>About the Role</strong><br>The Technical Head oversees all technical operations of the CSE Clubs Council. This role ensures that digital platforms, registrations, websites, certificates, and technical resources are managed efficiently for all clubs.<br><br><strong>Key Responsibilities</strong><ul><li>Maintain the CSE Clubs website and recruitment portal.</li><li>Manage registration forms, databases, and Google Sheets.</li><li>Provide technical support during workshops and events.</li><li>Develop digital tools and automate club processes.</li><li>Ensure all technical systems operate smoothly.</li></ul><br><strong>Ideal Candidate:</strong> A student interested in web development, software development, automation, or technical problem-solving.'
    },
    {
        id: 'media-head',
        title: 'Social Media Head',
        icon: 'MH',
        desc: 'Drive digital presence, branding, visual content creation, and official outreach across platforms.',
        badge: 'Creative Lead',
        eligibleYears: ['2nd Year', '3rd Year'],
        details: '<strong>About the Role</strong><br>The Social Media Head manages the digital identity of the CSE Clubs Council by promoting events, achievements, and activities across various social media platforms. This role helps increase student engagement and the visibility of all clubs.<br><br><strong>Key Responsibilities</strong><ul><li>Manage official Instagram and LinkedIn pages.</li><li>Promote all club events and announcements.</li><li>Create engaging posts, reels, and promotional content.</li><li>Coordinate with clubs for media coverage.</li><li>Maintain a consistent and professional online presence.</li></ul><br><strong>Ideal Candidate:</strong> A creative communicator with an interest in branding, content creation, and digital marketing.'
    },
    {
        id: 'doc-head',
        title: 'Documentation Head',
        icon: 'DH',
        desc: 'Manage official communications, event reports, council archives, and administrative records.',
        badge: 'Administrative Lead',
        eligibleYears: ['2nd Year', '3rd Year'],
        details: '<strong>About the Role</strong><br>The Documentation Head is responsible for maintaining accurate records of all club activities. This role ensures that reports, attendance, photographs, and official documents are properly organized and submitted on time.<br><br><strong>Key Responsibilities</strong><ul><li>Prepare reports for every event conducted.</li><li>Maintain attendance and participation records.</li><li>Archive photographs, videos, and event documents.</li><li>Submit reports to the President, Faculty Advisors, and HOD.</li><li>Maintain organized digital records for future reference.</li></ul><br><strong>Ideal Candidate:</strong> A detail-oriented student with good writing, organization, and documentation skills.'
    }
];

const CLUBS_LIST = [
    {
        id: 'coding-club',
        title: 'Coding Club',
        icon: 'CC',
        desc: 'Hub for competitive programming, DSA masterclasses, web development, and hackathons.',
        category: 'Tech',
        details: 'Stay current with efficient and trending CSE coding technologies while strengthening algorithmic skills to solve real-world problems.'
    },
    {
        id: 'innovation-club',
        title: 'Innovation Club',
        icon: 'IC',
        desc: 'Fostering startup ideas, prototype building, hardware tinkering, and patent assistance.',
        category: 'R&D',
        details: 'A hands-on space for innovative and creative activities beyond the classroom, where students can turn ideas into practical outcomes.'
    },
    {
        id: 'cybersentinel-club',
        title: 'CyberSentinel Club',
        icon: 'CSC',
        desc: 'Ethical hacking, Capture The Flag (CTF) challenges, network security, and defense tutorials.',
        category: 'Security',
        details: 'Build awareness of internet safety and a secure online environment while learning cyber and information-security skills that help protect others from cybercrime.'
    },
    {
        id: 'animatrix-club',
        title: 'Animatrix Club',
        icon: 'AC',
        desc: '3D animation, UI/UX design, game development, VFX graphics, and digital media production.',
        category: 'Creative',
        details: 'Develop skills in character animation, game-application design, and visual design. The club also creates innovative logos, banners, and university-magazine creatives.'
    },
    {
        id: 'magazine-club',
        title: 'Magazine Club',
        icon: 'MC',
        desc: 'Publishing the official departmental tech magazine, newsletter articles, and editorial blogs.',
        category: 'Media',
        details: 'Bring together relevant ideas and perspectives from history, politics, economics, literature, philosophy, and Indian culture through student-led publication.'
    },
    {
        id: 'fusion-fashion-club',
        title: 'Fusion & Fashion Club',
        icon: 'FFC',
        desc: 'Styling, cultural show choreography, creative design, and college fest representation.',
        category: 'Cultural',
        details: 'A creative space that helps members think imaginatively and bring their best ideas to life through current fashion trends and design.'
    },
    {
        id: 'nature-club',
        title: 'Nature Club',
        icon: 'NC',
        desc: 'Environmental awareness drives, campus plantation, sustainability projects, and eco-trips.',
        category: 'Social',
        details: 'Develop awareness of and interest in the natural environment through meetings, talks, workshops, study groups, and field trips.'
    },
    {
        id: 'yoga-club',
        title: 'Yoga Club',
        icon: 'YC',
        desc: 'Mental wellness, mindfulness sessions, physical fitness, and stress relief workshops.',
        category: 'Wellness',
        details: 'Empower students, faculty, and staff to lead healthier and happier lives by incorporating the principles of yoga into daily routines.'
    },
    {
        id: 'aspirex-club',
        title: 'AspireX Club',
        icon: 'AX',
        desc: 'Career guidance, mock technical interviews, resume building, and higher studies mentorship.',
        category: 'Career',
        details: 'Strengthen logical and problem-solving skills for entrance examinations and higher-studies pathways through focused guidance and peer learning.'
    },
    {
        id: 'appnova-club',
        title: 'AppNova Club',
        icon: 'ANC',
        desc: 'Native & cross-platform mobile app development (Flutter, React Native, Android Studio).',
        category: 'Tech',
        details: 'Explore how to design new web and mobile applications while developing technical knowledge, imagination, and product-thinking skills.'
    },
    {
        id: 'velsecure-club',
        title: 'VelSecure Cybersecurity Club',
        icon: 'VSC',
        desc: 'Advanced vulnerability assessment, cloud security, cryptography, and red-teaming labs.',
        category: 'Security',
        details: 'Promote internet safety and a secure online environment while training members in cyber and information-security skills to protect people from cybercrime.'
    }
];

// --------------------------------------------------------------------------
// 3. Application State & Variables
// --------------------------------------------------------------------------
let isRegistrationOpen = true;
let countdownTimerInterval = null;
let currentActiveRoleType = null; // 'leadership' or 'club'
let currentActiveRoleName = null;

// Regex Patterns for Validation
const REGEX_REGISTRATION_NUMBER = /^\d{5}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_PHONE = /^[6-9]\d{9}$/;

// --------------------------------------------------------------------------
// 4. Initializer on DOM Ready
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initProgressBar();
    initNavbarScroll();
    initMandatoryRulesModal();
    renderCards();
    initSearchAndFilter();
    initFormValidations();
    initClubDetailsModal();
    initFormSubmissions();
    initRegistrationStatusAndTimer();
    initBackToTop();
});

// --------------------------------------------------------------------------
// 5. Ambient Particles Effect
// --------------------------------------------------------------------------
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.35 + 0.1
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > width) p.dx *= -1;
            if (p.y < 0 || p.y > height) p.dy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffffff';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// --------------------------------------------------------------------------
// 6. UI Scroll Handlers & Progress Bar
// --------------------------------------------------------------------------
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = `${scrolled}%`;
    });
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --------------------------------------------------------------------------
// 7. Mandatory Rules Modal Logic
// --------------------------------------------------------------------------
function initMandatoryRulesModal() {
    const rulesModal = document.getElementById('rulesModal');
    const checkbox = document.getElementById('acceptRulesCheckbox');
    const continueBtn = document.getElementById('continueRulesBtn');

    // Show modal immediately on page load
    rulesModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    checkbox.addEventListener('change', () => {
        continueBtn.disabled = !checkbox.checked;
    });

    continueBtn.addEventListener('click', () => {
        if (checkbox.checked) {
            rulesModal.style.opacity = '0';
            setTimeout(() => {
                rulesModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 300);
            showToast('Recruitment instructions accepted. Welcome!', 'success');
        }
    });
}

// --------------------------------------------------------------------------
// 8. Render Cards for Leadership & Clubs
// --------------------------------------------------------------------------
function renderCards() {
    const leadContainer = document.getElementById('leadershipGrid');
    const clubContainer = document.getElementById('clubsGrid');

    // Render Leadership Cards
    const presidentHtml = `
        <div class="role-card glass-card no-click" style="cursor: default; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.02);">
            <div class="card-content">
                <h4 class="card-title">President</h4>
                <div style="margin-top: 1.2rem;">
                    <p style="margin:0; color: #ffffff; font-weight: 700; font-size: 1.2rem; letter-spacing: 0.02em;">Cheedella Venkata Sai Charan</p>
                    <p style="margin:0; font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.4rem; font-weight: 600; letter-spacing: 0.05em;">VTU24996</p>
                    <a href="https://Charancheedella.xyz" target="_blank" style="display: inline-block; margin-top: 1rem; color: #60a5fa; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s ease;">
                        Charancheedella.xyz <span style="font-size: 1.1em; margin-left: 2px;">&nearr;</span>
                    </a>
                </div>
            </div>
        </div>
    `;

    leadContainer.innerHTML = presidentHtml + LEADERSHIP_ROLES.map(role => `
        <div class="role-card glass-card" data-type="leadership" data-id="${role.id}" data-title="${role.title}" data-search="${role.desc}">
            <div class="card-content">
                <h4 class="card-title">${role.title}</h4>
            </div>
            <div class="card-footer">
                <div class="card-footer-actions">
                    <button type="button" class="card-details-btn" data-role-id="${role.id}">
                        Know More About Role
                    </button>
                    <span class="card-action-btn">
                        Apply <span>&rarr;</span>
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    // Render Club Cards
    clubContainer.innerHTML = CLUBS_LIST.map(club => `
        <div class="role-card glass-card" data-type="club" data-id="${club.id}" data-title="${club.title}" data-search="${club.desc}">
            <div class="card-content">
                <h4 class="card-title">${club.title}</h4>
            </div>
            <div class="card-footer">
                <div class="card-footer-actions">
                    <button type="button" class="card-details-btn" data-club-id="${club.id}">
                        Know More About Club
                    </button>
                    <span class="card-action-btn">
                        Apply <span>&rarr;</span>
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    // Attach Click Event to all Cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('no-click')) return;
            const type = card.getAttribute('data-type');
            const title = card.getAttribute('data-title');
            if (type && title) {
                openApplicationModal(type, title);
            }
        });
    });

    document.querySelectorAll('.card-details-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            let item = null;
            let isRole = false;

            if (button.dataset.clubId) {
                item = CLUBS_LIST.find(i => i.id === button.dataset.clubId);
            } else if (button.dataset.roleId) {
                item = LEADERSHIP_ROLES.find(i => i.id === button.dataset.roleId);
                isRole = true;
            }

            if (item) openClubDetails(item, isRole);
        });
    });
}

function initClubDetailsModal() {
    const modal = document.getElementById('clubDetailsModal');
    document.getElementById('closeClubDetailsBtn').addEventListener('click', closeClubDetails);
    document.getElementById('closeClubDetailsFooterBtn').addEventListener('click', closeClubDetails);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeClubDetails();
    });
}

function openClubDetails(item, isRole = false) {
    document.getElementById('clubDetailsTitle').textContent = item.title;
    document.getElementById('clubDetailsCategory').textContent = item.category || item.badge;
    document.getElementById('clubDetailsDescription').innerHTML = item.details;

    const commitmentNote = document.getElementById('leadershipCommitmentNote');
    if (commitmentNote) {
        if (isRole) {
            commitmentNote.classList.remove('hidden');
        } else {
            commitmentNote.classList.add('hidden');
        }
    }

    document.getElementById('clubDetailsModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeClubDetails() {
    document.getElementById('clubDetailsModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// --------------------------------------------------------------------------
// 9. Search and Category Filter Logic
// --------------------------------------------------------------------------
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const tabBtns = document.querySelectorAll('.tab-btn');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }
            filterCards();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.classList.add('hidden');
            filterCards();
        });
    }

    tabBtns.forEach(tab => {
        tab.addEventListener('click', () => {
            tabBtns.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterCards();
        });
    });
}

function filterCards() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-filter');

    const leadSection = document.getElementById('leadershipSection');
    const clubsSection = document.getElementById('clubsSection');

    let visibleLeadCount = 0;
    let visibleClubCount = 0;

    document.querySelectorAll('#leadershipGrid .role-card').forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const desc = (card.dataset.search || '').toLowerCase();
        const matchesQuery = title.includes(query) || desc.includes(query);
        const matchesTab = activeTab === 'all' || activeTab === 'leadership';

        if (matchesQuery && matchesTab) {
            card.classList.remove('hidden');
            visibleLeadCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    document.querySelectorAll('#clubsGrid .role-card').forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const desc = (card.dataset.search || '').toLowerCase();
        const matchesQuery = title.includes(query) || desc.includes(query);
        const matchesTab = activeTab === 'all' || activeTab === 'clubs';

        if (matchesQuery && matchesTab) {
            card.classList.remove('hidden');
            visibleClubCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    leadSection.style.display = (visibleLeadCount > 0) ? 'block' : 'none';
    clubsSection.style.display = (visibleClubCount > 0) ? 'block' : 'none';
}

// --------------------------------------------------------------------------
// 10. Application Modal & Form Switching
// --------------------------------------------------------------------------
function triggerClubApplyingAsChange() {
    const applyAsSelect = document.getElementById('clubApplyingAs');
    if (!applyAsSelect) return;
    const val = applyAsSelect.value;
    const isLeadership = (val === 'Club Head' || val === 'Vice Head');

    updateClubYearOptions(val);

    document.querySelectorAll('.club-leadership-only').forEach(el => {
        if (!isLeadership) {
            el.classList.add('hidden');
            el.querySelectorAll('input, select, textarea').forEach(input => {
                input.removeAttribute('required');
                input.classList.remove('invalid');
                input.dataset.touched = 'false';
                const errorSpan = document.getElementById(input.id + 'Error');
                if (errorSpan) errorSpan.classList.remove('visible');
            });
        } else {
            el.classList.remove('hidden');
            el.querySelectorAll('input, select, textarea').forEach(input => {
                const id = input.id;
                if (['clubSkills', 'clubExperience', 'clubWhy', 'clubContribute'].includes(id)) {
                    input.setAttribute('required', 'true');
                }
            });
        }
    });
}

document.getElementById('clubApplyingAs').addEventListener('change', triggerClubApplyingAsChange);

function updateClubYearOptions(applyingAs) {
    const yearSelect = document.getElementById('clubYear');
    if (!yearSelect) return;

    const allYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const eligibleYears = applyingAs === 'Club Head' || applyingAs === 'Vice Head'
        ? ['2nd Year', '3rd Year']
        : allYears;
    const previousValue = yearSelect.value;

    yearSelect.innerHTML = [
        '<option value="">Select Year</option>',
        ...eligibleYears.map(year => `<option value="${year}">${year}</option>`)
    ].join('');

    if (eligibleYears.includes(previousValue)) {
        yearSelect.value = previousValue;
    }
}

function openApplicationModal(type, title) {
    if (!isRegistrationOpen) {
        showToast('Registrations are currently closed.', 'error');
        return;
    }

    currentActiveRoleType = type;
    currentActiveRoleName = title;

    const appModal = document.getElementById('appModal');
    const modalTitle = document.getElementById('formModalTitle');

    const leadForm = document.getElementById('leadershipForm');
    const clubForm = document.getElementById('clubForm');

    if (type === 'leadership') {
        modalTitle.textContent = `Leadership Role: ${title}`;
        document.getElementById('leadPositionApplied').value = title;

        leadForm.classList.remove('hidden');
        clubForm.classList.add('hidden');
    } else {
        modalTitle.textContent = `Club Application: ${title}`;
        document.getElementById('clubNameAuto').value = title;

        clubForm.classList.remove('hidden');
        leadForm.classList.add('hidden');

        triggerClubApplyingAsChange();
    }

    appModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
    const appModal = document.getElementById('appModal');
    appModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

document.getElementById('closeAppModalBtn').addEventListener('click', closeApplicationModal);

document.getElementById('appModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('appModal')) {
        closeApplicationModal();
    }
});

// 4th Year Exception Modal Logic
function openFourthYearModal() {
    if (!isRegistrationOpen) {
        showToast('Registrations are currently closed.', 'error');
        return;
    }
    const modal = document.getElementById('fourthYearModal');

    // Populate Club dropdown dynamically if not already populated
    const clubSelect = document.getElementById('fyClubName');
    if (clubSelect && clubSelect.options.length <= 1) {
        CLUBS_LIST.forEach(club => {
            const option = document.createElement('option');
            option.value = club.title;
            option.textContent = club.title;
            clubSelect.appendChild(option);
        });
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeFourthYearModal() {
    const modal = document.getElementById('fourthYearModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

document.getElementById('openFourthYearBtn').addEventListener('click', (e) => {
    e.preventDefault();
    openFourthYearModal();
});
document.getElementById('closeFourthYearModalBtn').addEventListener('click', closeFourthYearModal);
document.getElementById('fourthYearModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('fourthYearModal')) {
        closeFourthYearModal();
    }
});

// --------------------------------------------------------------------------
// 11. Real-time Form Validations & Character Counters
// --------------------------------------------------------------------------
function initFormValidations() {
    setupLeadershipValidation();
    setupClubValidation();
    setupFourthYearValidation();
    setupContactValidation();
    setupCharCounters();
}

function setupCharCounters() {
    const textareas = [
        { id: 'leadSkills', countId: 'leadSkillsCount' },
        { id: 'leadExperience', countId: 'leadExpCount' },
        { id: 'leadWhy', countId: 'leadWhyCount' },
        { id: 'leadContribute', countId: 'leadContributeCount' },
        { id: 'clubSkills', countId: 'clubSkillsCount' },
        { id: 'clubExperience', countId: 'clubExpCount' },
        { id: 'clubWhy', countId: 'clubWhyCount' },
        { id: 'clubContribute', countId: 'clubContributeCount' },
        { id: 'fyReason', countId: 'fyReasonCount' },
        { id: 'fycReason', countId: 'fycReasonCount' }
    ];

    textareas.forEach(item => {
        const el = document.getElementById(item.id);
        const countEl = document.getElementById(item.countId);
        if (el && countEl) {
            el.addEventListener('input', () => {
                countEl.textContent = el.value.length;
            });
        }
    });
}

function setupLeadershipValidation() {
    const form = document.getElementById('leadershipForm');
    const submitBtn = document.getElementById('leadSubmitBtn');

    const inputs = {
        vtu: { el: document.getElementById('leadVtu'), err: document.getElementById('leadVtuError'), check: val => REGEX_REGISTRATION_NUMBER.test(val.trim()) },
        name: { el: document.getElementById('leadFullName'), err: document.getElementById('leadFullNameError'), check: val => val.trim().length >= 3 },
        year: { el: document.getElementById('leadYear'), err: document.getElementById('leadYearError'), check: val => val === '2nd Year' || val === '3rd Year' },
        phone: { el: document.getElementById('leadPhone'), err: document.getElementById('leadPhoneError'), check: val => REGEX_PHONE.test(val.trim()) },
        email: { el: document.getElementById('leadEmail'), err: document.getElementById('leadEmailError'), check: val => REGEX_EMAIL.test(val.trim()) },
        skills: { el: document.getElementById('leadSkills'), err: document.getElementById('leadSkillsError'), check: val => val.trim().length >= 10 },
        exp: { el: document.getElementById('leadExperience'), err: document.getElementById('leadExpError'), check: val => val.trim().length >= 10 },
        why: { el: document.getElementById('leadWhy'), err: document.getElementById('leadWhyError'), check: val => val.trim().length >= 10 },
        contribute: { el: document.getElementById('leadContribute'), err: document.getElementById('leadContributeError'), check: val => val.trim().length >= 10 },
        avail: { el: document.getElementById('leadAvailability'), err: document.getElementById('leadAvailError'), check: val => val !== '' },
        mentorName: { el: document.getElementById('leadMentorName'), err: document.getElementById('leadMentorNameError'), check: val => val.trim().length >= 3 },
        mentorPhone: { el: document.getElementById('leadMentorPhone'), err: document.getElementById('leadMentorPhoneError'), check: val => REGEX_PHONE.test(val.trim()) },
        dec: { el: document.getElementById('leadDeclaration'), err: document.getElementById('leadDecError'), check: el => el.checked }
    };

    function validate() {
        let isValid = true;

        Object.keys(inputs).forEach(key => {
            const item = inputs[key];
            const valid = key === 'dec' ? item.check(item.el) : item.check(item.el.value);

            if (item.el.dataset.touched === 'true') {
                if (!valid) {
                    item.el.classList.add('invalid');
                    if (item.err) item.err.classList.add('visible');
                } else {
                    item.el.classList.remove('invalid');
                    if (item.err) item.err.classList.remove('visible');
                }
            }
            if (!valid) isValid = false;
        });

        submitBtn.disabled = !isValid;
        return isValid;
    }

    Object.keys(inputs).forEach(key => {
        const item = inputs[key];
        const eventName = item.el.tagName === 'SELECT' || item.el.type === 'checkbox' ? 'change' : 'input';

        item.el.addEventListener(eventName, () => {
            item.el.dataset.touched = 'true';
            validate();
        });
        item.el.addEventListener('blur', () => {
            item.el.dataset.touched = 'true';
            validate();
        });
    });
}

function setupClubValidation() {
    const form = document.getElementById('clubForm');
    const submitBtn = document.getElementById('clubSubmitBtn');

    const inputs = {
        vtu: { el: document.getElementById('clubVtu'), err: document.getElementById('clubVtuError'), check: val => REGEX_REGISTRATION_NUMBER.test(val.trim()) },
        name: { el: document.getElementById('clubFullName'), err: document.getElementById('clubFullNameError'), check: val => val.trim().length >= 3 },
        applyAs: { el: document.getElementById('clubApplyingAs'), err: document.getElementById('clubApplyingAsError'), check: val => val !== '' },
        year: { el: document.getElementById('clubYear'), err: document.getElementById('clubYearError'), check: val => val !== '' },
        phone: { el: document.getElementById('clubPhone'), err: document.getElementById('clubPhoneError'), check: val => REGEX_PHONE.test(val.trim()) },
        email: { el: document.getElementById('clubEmail'), err: document.getElementById('clubEmailError'), check: val => REGEX_EMAIL.test(val.trim()) },
        skills: { el: document.getElementById('clubSkills'), err: document.getElementById('clubSkillsError'), check: val => val.trim().length >= 10 },
        exp: { el: document.getElementById('clubExperience'), err: document.getElementById('clubExpError'), check: val => val.trim().length >= 10 },
        why: { el: document.getElementById('clubWhy'), err: document.getElementById('clubWhyError'), check: val => val.trim().length >= 10 },
        contribute: { el: document.getElementById('clubContribute'), err: document.getElementById('clubContributeError'), check: val => val.trim().length >= 10 },
        mentorName: { el: document.getElementById('clubMentorName'), err: document.getElementById('clubMentorNameError'), check: val => val.trim().length >= 3 },
        mentorPhone: { el: document.getElementById('clubMentorPhone'), err: document.getElementById('clubMentorPhoneError'), check: val => REGEX_PHONE.test(val.trim()) },
        dec: { el: document.getElementById('clubDeclaration'), err: document.getElementById('clubDecError'), check: el => el.checked }
    };

    function validate() {
        let isValid = true;
        const applyingAsVal = inputs.applyAs.el.value;
        const yearVal = inputs.year.el.value;
        const isMember = (applyingAsVal === 'Member');

        // Custom Rule: Club Head / Vice Head must be 2nd or 3rd Year
        if ((applyingAsVal === 'Club Head' || applyingAsVal === 'Vice Head') && (yearVal === '1st Year' || yearVal === '4th Year')) {
            inputs.year.err.textContent = 'Club Head and Vice Head roles require 2nd or 3rd Year standing.';
            inputs.year.err.classList.add('visible');
            inputs.year.el.classList.add('invalid');
            isValid = false;
        }

        Object.keys(inputs).forEach(key => {
            const item = inputs[key];

            // Bypassing validation of leadership-only fields if they are applying as Member
            const isLeadershipField = ['skills', 'exp', 'why', 'contribute'].includes(key);
            if (isMember && isLeadershipField) {
                item.el.classList.remove('invalid');
                if (item.err) item.err.classList.remove('visible');
                return; // skip validation checks for this field
            }

            const valid = key === 'dec' ? item.check(item.el) : item.check(item.el.value);

            if (item.el.dataset.touched === 'true') {
                if (!valid && key !== 'year') {
                    item.el.classList.add('invalid');
                    if (item.err) item.err.classList.add('visible');
                } else if (valid && key !== 'year') {
                    item.el.classList.remove('invalid');
                    if (item.err) item.err.classList.remove('visible');
                }
            }
            if (!valid) isValid = false;
        });

        submitBtn.disabled = !isValid;
        return isValid;
    }

    Object.keys(inputs).forEach(key => {
        const item = inputs[key];
        const eventName = item.el.tagName === 'SELECT' || item.el.type === 'checkbox' ? 'change' : 'input';

        item.el.addEventListener(eventName, () => {
            item.el.dataset.touched = 'true';
            validate();
        });
        item.el.addEventListener('blur', () => {
            item.el.dataset.touched = 'true';
            validate();
        });
    });

    // Run field visibility toggle and validate whenever Applying As changes
    inputs.applyAs.el.addEventListener('change', () => {
        triggerClubApplyingAsChange();
        validate();
    });
}

function setupFourthYearValidation() {
    const form = document.getElementById('fourthYearForm');
    const submitBtn = document.getElementById('fySubmitBtn');

    const inputs = {
        appType: { el: document.getElementById('fyApplicationType'), err: null, check: val => val !== '' },
        vtu: { el: document.getElementById('fyVtu'), err: document.getElementById('fyVtuError'), check: val => REGEX_REGISTRATION_NUMBER.test(val.trim()) },
        name: { el: document.getElementById('fyFullName'), err: document.getElementById('fyFullNameError'), check: val => val.trim().length >= 3 },
        phone: { el: document.getElementById('fyPhone'), err: document.getElementById('fyPhoneError'), check: val => REGEX_PHONE.test(val.trim()) },
        email: { el: document.getElementById('fyEmail'), err: document.getElementById('fyEmailError'), check: val => REGEX_EMAIL.test(val.trim()) },
        clubName: { el: document.getElementById('fyClubName'), err: null, check: val => document.getElementById('fyApplicationType').value === 'Club Leadership' ? val !== '' : true },
        position: { el: document.getElementById('fyPosition'), err: null, check: val => val !== '' },
        mentorName: { el: document.getElementById('fyMentorName'), err: document.getElementById('fyMentorNameError'), check: val => val.trim().length >= 2 },
        mentorPhone: { el: document.getElementById('fyMentorPhone'), err: document.getElementById('fyMentorPhoneError'), check: val => REGEX_PHONE.test(val.trim()) },
        reason: { el: document.getElementById('fyReason'), err: document.getElementById('fyReasonError'), check: val => val.trim().length >= 50 },
        dec: { el: document.getElementById('fyDeclaration'), err: document.getElementById('fyDecError'), check: el => el.checked }
    };

    function validate() {
        let isValid = true;
        Object.keys(inputs).forEach(key => {
            const item = inputs[key];
            const valid = key === 'dec' ? item.check(item.el) : item.check(item.el.value);
            if (item.el.dataset.touched === 'true') {
                if (!valid && item.err) {
                    item.el.classList.add('invalid');
                    item.err.classList.add('visible');
                } else if (item.err) {
                    item.el.classList.remove('invalid');
                    item.err.classList.remove('visible');
                }
            }
            if (!valid) isValid = false;
        });
        submitBtn.disabled = !isValid;
        return isValid;
    }

    Object.keys(inputs).forEach(key => {
        const item = inputs[key];
        const eventName = item.el.tagName === 'SELECT' || item.el.type === 'checkbox' ? 'change' : 'input';
        item.el.addEventListener(eventName, () => {
            item.el.dataset.touched = 'true';
            validate();
        });
        item.el.addEventListener('blur', () => {
            item.el.dataset.touched = 'true';
            validate();
        });
    });

    // Handle Application Type changes
    inputs.appType.el.addEventListener('change', (e) => {
        const type = e.target.value;
        const clubContainer = document.getElementById('fyClubNameContainer');
        const posSelect = document.getElementById('fyPosition');

        if (type === 'Club Leadership') {
            clubContainer.classList.remove('hidden');
            posSelect.disabled = false;
            posSelect.innerHTML = `
                <option value="">Select Position</option>
                <option value="Club Head">Club Head</option>
                <option value="Vice Head">Vice Head</option>
            `;
        } else if (type === 'Council Leadership') {
            clubContainer.classList.add('hidden');
            posSelect.disabled = false;
            posSelect.innerHTML = `
                <option value="">Select Position</option>
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Events Head">Events Head</option>
                <option value="Technical Head">Technical Head</option>
                <option value="Social Media Head">Social Media Head</option>
                <option value="Documentation Head">Documentation Head</option>
            `;
        } else {
            clubContainer.classList.add('hidden');
            posSelect.disabled = true;
            posSelect.innerHTML = '<option value="">Select Application Type First</option>';
        }

        // Reset Club Name if hidden
        if (type !== 'Club Leadership') {
            inputs.clubName.el.value = '';
        }

        validate();
    });
}

function setupContactValidation() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');

    const inputs = {
        name: { el: document.getElementById('contactName'), err: document.getElementById('contactNameError'), check: val => val.trim().length >= 3 },
        vtu: { el: document.getElementById('contactVtu'), err: document.getElementById('contactVtuError'), check: val => REGEX_REGISTRATION_NUMBER.test(val.trim()) },
        year: { el: document.getElementById('contactYear'), err: null, check: val => val !== '' },
        query: { el: document.getElementById('contactQuery'), err: document.getElementById('contactQueryError'), check: val => val.trim().length >= 10 }
    };

    function validate() {
        let isValid = true;
        Object.keys(inputs).forEach(key => {
            const item = inputs[key];
            const valid = item.check(item.el.value);
            if (item.el.dataset.touched === 'true') {
                if (!valid) {
                    item.el.classList.add('invalid');
                    if (item.err) item.err.classList.add('visible');
                } else {
                    item.el.classList.remove('invalid');
                    if (item.err) item.err.classList.remove('visible');
                }
            }
            if (!valid) isValid = false;
        });
        submitBtn.disabled = !isValid;
        return isValid;
    }

    Object.keys(inputs).forEach(key => {
        const item = inputs[key];
        const eventName = item.el.tagName === 'SELECT' ? 'change' : 'input';
        item.el.addEventListener(eventName, () => {
            item.el.dataset.touched = 'true';
            validate();
        });
        item.el.addEventListener('blur', () => {
            item.el.dataset.touched = 'true';
            validate();
        });
    });
}

// --------------------------------------------------------------------------
// 12. Form Submissions to Apps Script
// --------------------------------------------------------------------------
function initFormSubmissions() {
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('contactSubmitBtn');

        const formData = {
            category: 'ContactQuery',
            name: document.getElementById('contactName').value.trim(),
            vtu: document.getElementById('contactVtu').value.trim(),
            year: document.getElementById('contactYear').value,
            query: document.getElementById('contactQuery').value.trim()
        };

        setSubmittingState(submitBtn, null, true);

        try {
            await postSubmissionData(formData);
            showToast('Query submitted successfully!', 'success');

            // Clear out the filled data and reset validation state
            const form = document.getElementById('contactForm');
            form.reset();
            form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
            form.querySelectorAll('.field-error.visible').forEach(el => el.classList.remove('visible'));
            form.querySelectorAll('[data-touched="true"]').forEach(el => delete el.dataset.touched);

            submitBtn.disabled = true;
        } catch (error) {
            console.error('Submission failed:', error);
            showToast(error.message || 'Submission failed. Please try again.', 'error');
            setSubmittingState(submitBtn, null, false);
        }
    });

    document.getElementById('fourthYearForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('fySubmitBtn');
        const spinner = document.createElement('div');
        spinner.className = 'spinner';

        const appType = document.getElementById('fyApplicationType').value;
        const category = appType === 'Club Leadership' ? 'FourthYearClub' : 'FourthYear';

        const formData = {
            category: category,
            vtu: document.getElementById('fyVtu').value.trim(),
            name: document.getElementById('fyFullName').value.trim(),
            dept: 'CSE', // hardcoded as per requirement
            year: '4th Year',
            section: '',
            phone: document.getElementById('fyPhone').value.trim(),
            email: document.getElementById('fyEmail').value.trim(),
            clubName: document.getElementById('fyClubName').value, // Will be empty if not Club Leadership
            position: document.getElementById('fyPosition').value,
            mentorName: document.getElementById('fyMentorName').value.trim(),
            mentorPhone: document.getElementById('fyMentorPhone').value.trim(),
            reason: document.getElementById('fyReason').value.trim()
        };

        setSubmittingState(submitBtn, null, true);

        try {
            await postSubmissionData(formData);
            showToast('Exception Request Submitted Successfully!', 'success');
            document.getElementById('fourthYearForm').reset();

            // Reset dynamic dropdowns
            document.getElementById('fyClubNameContainer').classList.add('hidden');
            const posSelect = document.getElementById('fyPosition');
            posSelect.disabled = true;
            posSelect.innerHTML = '<option value="">Select Application Type First</option>';

            closeFourthYearModal();
        } catch (error) {
            console.error('Submission failed:', error);
            showToast('Submission failed. Please try again.', 'error');
        } finally {
            setSubmittingState(submitBtn, null, false);
        }
    });

    document.getElementById('leadershipForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('leadSubmitBtn');
        const spinner = submitBtn.querySelector('.spinner');

        const formData = {
            category: 'Leadership',
            vtu: document.getElementById('leadVtu').value.trim(),
            name: document.getElementById('leadFullName').value.trim(),
            dept: 'CSE',
            year: document.getElementById('leadYear').value,
            section: '',
            phone: document.getElementById('leadPhone').value.trim(),
            email: document.getElementById('leadEmail').value.trim(),
            position: document.getElementById('leadPositionApplied').value,
            skills: document.getElementById('leadSkills').value.trim(),
            experience: document.getElementById('leadExperience').value.trim(),
            github: document.getElementById('leadGithub').value.trim(),
            linkedin: document.getElementById('leadLinkedin').value.trim(),
            portfolio: document.getElementById('leadPortfolio').value.trim(),
            why: document.getElementById('leadWhy').value.trim(),
            contribution: document.getElementById('leadContribute').value.trim(),
            availability: document.getElementById('leadAvailability').value,
            mentorName: document.getElementById('leadMentorName').value.trim(),
            mentorPhone: document.getElementById('leadMentorPhone').value.trim()
        };

        if (checkDuplicateSubmission(formData.vtu, formData.position)) {
            showToast('You have already applied for this leadership position!', 'error');
            return;
        }

        setSubmittingState(submitBtn, spinner, true);

        try {
            await postSubmissionData(formData);
            markSubmissionLocal(formData.vtu, formData.position);
            closeApplicationModal();
            openSuccessModal();
            document.getElementById('leadershipForm').reset();
        } catch (err) {
            showToast(err.message || 'Submission failed. Please try again.', 'error');
        } finally {
            setSubmittingState(submitBtn, spinner, false);
        }
    });

    document.getElementById('clubForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('clubSubmitBtn');
        const spinner = submitBtn.querySelector('.spinner');

        const applyingAs = document.getElementById('clubApplyingAs').value;
        const isMember = (applyingAs === 'Member');

        const formData = {
            category: 'Club',
            vtu: document.getElementById('clubVtu').value.trim(),
            name: document.getElementById('clubFullName').value.trim(),
            dept: 'CSE',
            clubName: document.getElementById('clubNameAuto').value,
            applyingAs: applyingAs,
            year: document.getElementById('clubYear').value,
            section: '',
            phone: document.getElementById('clubPhone').value.trim(),
            email: document.getElementById('clubEmail').value.trim(),
            skills: isMember ? "" : document.getElementById('clubSkills').value.trim(),
            experience: isMember ? "" : document.getElementById('clubExperience').value.trim(),
            why: isMember ? "" : document.getElementById('clubWhy').value.trim(),
            contribution: isMember ? "" : document.getElementById('clubContribute').value.trim(),
            github: isMember ? "" : document.getElementById('clubGithub').value.trim(),
            linkedin: isMember ? "" : document.getElementById('clubLinkedin').value.trim(),
            portfolio: isMember ? "" : document.getElementById('clubPortfolio').value.trim(),
            mentorName: document.getElementById('clubMentorName').value.trim(),
            mentorPhone: document.getElementById('clubMentorPhone').value.trim()
        };

        if (checkDuplicateSubmission(formData.vtu, formData.clubName)) {
            showToast('You have already submitted an application for this club!', 'error');
            return;
        }

        setSubmittingState(submitBtn, spinner, true);

        try {
            await postSubmissionData(formData);
            markSubmissionLocal(formData.vtu, formData.clubName);
            closeApplicationModal();
            openSuccessModal();
            document.getElementById('clubForm').reset();
        } catch (err) {
            showToast(err.message || 'Submission failed. Please try again.', 'error');
        } finally {
            setSubmittingState(submitBtn, spinner, false);
        }
    });
}

function setSubmittingState(button, spinner, isSubmitting) {
    if (isSubmitting) {
        button.disabled = true;
        if (spinner) spinner.classList.remove('hidden');
    } else {
        button.disabled = false;
        if (spinner) spinner.classList.add('hidden');
    }
}

async function postSubmissionData(payload) {
    if (!API_URL || API_URL.trim() === "") {
        // Fallback simulation when API_URL is not yet connected
        console.warn('API_URL is empty. Simulating background submit...');
        await new Promise(resolve => setTimeout(resolve, 1200));
        return { status: 'success', message: 'Demo submission logged locally' };
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'submitApplication', data: payload })
    });

    const result = await response.json();
    if (result.status !== 'success') {
        throw new Error(result.message || 'Error recording submission in Google Sheets.');
    }
    return result;
}

function checkDuplicateSubmission(vtu, roleOrClub) {
    const key = `submitted_${vtu}_${roleOrClub.replace(/\s+/g, '_')}`;
    return localStorage.getItem(key) === 'true';
}

function markSubmissionLocal(vtu, roleOrClub) {
    const key = `submitted_${vtu}_${roleOrClub.replace(/\s+/g, '_')}`;
    localStorage.setItem(key, 'true');
}

// --------------------------------------------------------------------------
// 13. Success Screen Modal Logic
// --------------------------------------------------------------------------
function openSuccessModal() {
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

document.getElementById('closeSuccessBtn').addEventListener('click', () => {
    const successModal = document.getElementById('successModal');
    successModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
});

// --------------------------------------------------------------------------
// 14. Registration Status & Live Countdown Timer
// --------------------------------------------------------------------------
async function initRegistrationStatusAndTimer() {
    let settings = {
        status: 'OPEN',
        closeTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // Default 5 days fallback
    };

    if (API_URL && API_URL.trim() !== "") {
        try {
            const res = await fetch(`${API_URL}?action=getSettings`);
            const data = await res.json();
            if (data.status === 'success' && data.settings) {
                settings.status = data.settings.registration_status || 'OPEN';
                if (data.settings.registration_close) {
                    settings.closeTime = data.settings.registration_close;
                }
            }
        } catch (err) {
            console.error('Failed fetching live registration settings:', err);
        }
    }

    applyRegistrationState(settings);
}

function applyRegistrationState(settings) {
    const closedMessage = document.getElementById('closedMessage');
    const timerGrid = document.getElementById('timerGrid');

    if (settings.status === 'CLOSED') {
        isRegistrationOpen = false;
        if (timerGrid) timerGrid.classList.add('hidden');
        if (closedMessage) closedMessage.classList.remove('hidden');
        return;
    }

    isRegistrationOpen = true;
    if (timerGrid) timerGrid.classList.remove('hidden');
    if (closedMessage) closedMessage.classList.add('hidden');

    startCountdownTimer(new Date(settings.closeTime).getTime());
}

function startCountdownTimer(targetTimestamp) {
    if (countdownTimerInterval) clearInterval(countdownTimerInterval);

    function update() {
        const now = new Date().getTime();
        const difference = targetTimestamp - now;

        if (difference <= 0) {
            clearInterval(countdownTimerInterval);
            applyRegistrationState({ status: 'CLOSED' });
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('timerDays').textContent = String(days).padStart(2, '0');
        document.getElementById('timerHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    countdownTimerInterval = setInterval(update, 1000);
}

// --------------------------------------------------------------------------
// 15. Toast Notification System
// --------------------------------------------------------------------------
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
        success: '✅',
        error: '⚠️',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span>${iconMap[type] || 'ℹ️'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}
