// State
let token = localStorage.getItem('portfolio_admin_token') || '';
let state = {
  projects: [],
  experiences: [],
  services: [],
  content: {}
};

// DOM Elements
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const tabsBar = document.getElementById('tabsBar');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const adminPassword = document.getElementById('adminPassword');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const toastBox = document.getElementById('toastBox');

// Tab Counts
const tabCountProjects = document.getElementById('tabCountProjects');
const tabCountExp = document.getElementById('tabCountExp');
const tabCountServices = document.getElementById('tabCountServices');

// Containers
const projectsGrid = document.getElementById('projectsGrid');
const projectCountText = document.getElementById('projectCountText');
const expList = document.getElementById('expList');
const expCountText = document.getElementById('expCountText');
const servicesGrid = document.getElementById('servicesGrid');
const servicesCountText = document.getElementById('servicesCountText');

// Modals
const projectModal = document.getElementById('projectModal');
const expModal = document.getElementById('expModal');
const serviceModal = document.getElementById('serviceModal');

// Toast helper
function showToast(message, type = 'success') {
  toastBox.textContent = message;
  toastBox.className = `toast-box is-show toast-${type}`;
  setTimeout(() => {
    toastBox.classList.remove('is-show');
  }, 2800);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('is-active'));
    btn.classList.add('is-active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('is-active');
  });
});

// Modal close triggers
document.querySelectorAll('.modal-close-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('is-open'));
  });
});

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', (e) => {
    if (e.target === m) m.classList.remove('is-open');
  });
});

// Authentication
async function checkAuth() {
  if (!token) {
    showLogin();
    return;
  }

  try {
    const res = await fetch('/api/auth', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      showDashboard();
      loadAllData();
    } else {
      logout();
    }
  } catch (err) {
    showLogin();
  }
}

function showLogin() {
  loginView.style.display = 'flex';
  dashboardView.style.display = 'none';
  tabsBar.style.display = 'none';
  logoutBtn.style.display = 'none';
}

function showDashboard() {
  loginView.style.display = 'none';
  dashboardView.style.display = 'block';
  tabsBar.style.display = 'block';
  logoutBtn.style.display = 'inline-flex';
}

function logout() {
  token = '';
  localStorage.removeItem('portfolio_admin_token');
  showLogin();
  showToast('Signed out.');
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginSubmitBtn.disabled = true;
  loginSubmitBtn.textContent = 'Signing in...';

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword.value })
    });

    const data = await res.json();
    if (res.ok && data.token) {
      token = data.token;
      localStorage.setItem('portfolio_admin_token', token);
      adminPassword.value = '';
      showToast('Signed in successfully.');
      showDashboard();
      loadAllData();
    } else {
      showToast(data.error || 'Invalid password.', 'error');
    }
  } catch (err) {
    showToast('Connection failed.', 'error');
  } finally {
    loginSubmitBtn.disabled = false;
    loginSubmitBtn.textContent = 'Sign In';
  }
});

logoutBtn.addEventListener('click', logout);

// Load all data
async function loadAllData() {
  try {
    const res = await fetch('/api/content');
    const data = await res.json();

    if (res.ok) {
      state.projects = data.projects || [];
      state.experiences = data.experiences || [];
      state.services = data.services || [];
      state.content = data.content || {};

      renderProjects();
      renderExperiences();
      renderServices();
      populateHeroForm();
      populateAboutForm();
      populateContactForm();
    }
  } catch (err) {
    showToast('Failed to load content.', 'error');
  }
}

/* =========================================================================
   1. PROJECTS TAB (WITH DRAG & DROP REORDERING)
   ========================================================================= */
function renderProjects() {
  tabCountProjects.textContent = state.projects.length;
  projectCountText.textContent = `${state.projects.length} projects published. Drag cards to reorder.`;

  if (state.projects.length === 0) {
    projectsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);">No projects found.</div>`;
    return;
  }

  projectsGrid.innerHTML = state.projects.map(p => {
    const tagsArr = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const tagsHtml = tagsArr.map(t => `<span class="p-tag">${escapeHtml(t)}</span>`).join('');
    const imgSrc = p.image || 'images/jasakita.webp';
    const finalSrc = imgSrc.startsWith('http') ? imgSrc : '/' + imgSrc.replace(/^\//, '');

    return `
      <div class="p-admin-card" data-id="${p.id}" draggable="true">
        <div class="p-drag-handle" title="Drag to reorder">&#x22EE;&#x22EE;</div>
        <div class="p-thumb">
          <img src="${escapeHtml(finalSrc)}" alt="${escapeHtml(p.title)}" onerror="this.src='https://placehold.co/600x400/181d21/00e599?text=Preview+Image'">
          <span class="p-chip">${escapeHtml(p.chip || 'Project')}</span>
          <span class="p-order">#${p.order_index ?? 0}</span>
        </div>
        <div class="p-body">
          <h4 class="p-title">${escapeHtml(p.title)}</h4>
          <p class="p-desc">${escapeHtml(p.description)}</p>
          <div class="p-tags">${tagsHtml}</div>
          <div class="p-footer">
            <span class="p-cat-badge">${escapeHtml(p.category)}</span>
            <div class="p-actions">
              <button class="btn btn-secondary btn-sm" onclick="openEditProject(${p.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProject(${p.id})">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initDragAndDrop();
}

let draggedCard = null;

function initDragAndDrop() {
  const cards = projectsGrid.querySelectorAll('.p-admin-card');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCard = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.id);
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      cards.forEach(c => c.classList.remove('drag-over'));
      saveNewProjectOrder();
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedCard && draggedCard !== card) {
        card.classList.add('drag-over');
      }
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      if (!draggedCard || draggedCard === card) return;

      const allCards = Array.from(projectsGrid.querySelectorAll('.p-admin-card'));
      const draggedIdx = allCards.indexOf(draggedCard);
      const targetIdx = allCards.indexOf(card);

      if (draggedIdx < targetIdx) {
        projectsGrid.insertBefore(draggedCard, card.nextSibling);
      } else {
        projectsGrid.insertBefore(draggedCard, card);
      }
    });
  });
}

async function saveNewProjectOrder() {
  const currentCards = Array.from(projectsGrid.querySelectorAll('.p-admin-card'));
  const newOrderIds = currentCards.map(c => Number(c.dataset.id));

  // Update order badges in real-time
  currentCards.forEach((c, idx) => {
    const badge = c.querySelector('.p-order');
    if (badge) badge.textContent = `#${idx}`;
  });

  // Re-sort in-memory state
  state.projects.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));

  try {
    const res = await fetch('/api/projects', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'reorder',
        orders: newOrderIds
      })
    });

    if (res.ok) {
      showToast('Order updated.');
    }
  } catch (err) {
    showToast('Failed to save order.', 'error');
  }
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
  document.getElementById('projectForm').reset();
  document.getElementById('fieldId').value = '';
  document.getElementById('fieldOrder').value = state.projects.length;
  document.getElementById('fieldImage').value = 'images/jasakita.webp';
  document.getElementById('modalHeading').textContent = 'New Project';
  projectModal.classList.add('is-open');
});

window.openEditProject = function(id) {
  const p = state.projects.find(item => item.id === id);
  if (!p) return;

  document.getElementById('fieldId').value = p.id;
  document.getElementById('fieldTitle').value = p.title || '';
  document.getElementById('fieldCategory').value = p.category || '';
  document.getElementById('fieldChip').value = p.chip || '';
  document.getElementById('fieldImage').value = p.image || '';
  document.getElementById('fieldOrder').value = p.order_index ?? 0;
  document.getElementById('fieldTags').value = p.tags || '';
  document.getElementById('fieldDesc').value = p.description || '';

  document.getElementById('modalHeading').textContent = `Edit Project #${p.id}`;
  projectModal.classList.add('is-open');
};

document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('fieldId').value;
  const isEdit = Boolean(id);

  const payload = {
    title: document.getElementById('fieldTitle').value,
    category: document.getElementById('fieldCategory').value,
    chip: document.getElementById('fieldChip').value,
    image: document.getElementById('fieldImage').value,
    order_index: Number(document.getElementById('fieldOrder').value) || 0,
    tags: document.getElementById('fieldTags').value,
    description: document.getElementById('fieldDesc').value
  };
  if (isEdit) payload.id = Number(id);

  try {
    const res = await fetch('/api/projects', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      projectModal.classList.remove('is-open');
      showToast(isEdit ? 'Project updated.' : 'Project added.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to save project.', 'error');
  }
});

window.deleteProject = async function(id) {
  if (!confirm('Delete this project?')) return;
  try {
    const res = await fetch('/api/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      showToast('Project deleted.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to delete project.', 'error');
  }
};

/* =========================================================================
   2. EXPERIENCE TAB
   ========================================================================= */
function renderExperiences() {
  tabCountExp.textContent = state.experiences.length;
  expCountText.textContent = `${state.experiences.length} career entries.`;

  if (state.experiences.length === 0) {
    expList.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);">No experience entries found.</div>`;
    return;
  }

  expList.innerHTML = state.experiences.map(e => {
    let bulletsArr = [];
    try {
      bulletsArr = typeof e.bullets === 'string' ? JSON.parse(e.bullets || '[]') : (e.bullets || []);
    } catch (err) {
      bulletsArr = [e.bullets];
    }

    const bulletsHtml = bulletsArr.map(b => `<li>${escapeHtml(b)}</li>`).join('');

    return `
      <div class="exp-admin-item">
        <div class="exp-admin-header">
          <div>
            <div class="exp-admin-company">${escapeHtml(e.company)} <span class="exp-admin-period">(${escapeHtml(e.company_period)})</span></div>
            <div class="exp-admin-role">${escapeHtml(e.role_title)} &bull; <span class="exp-admin-period">${escapeHtml(e.role_period)}</span></div>
          </div>
          <div class="p-actions">
            <button class="btn btn-secondary btn-sm" onclick="openEditExp(${e.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteExp(${e.id})">Delete</button>
          </div>
        </div>
        ${e.stack ? `<div class="exp-admin-stack"><strong>${escapeHtml(e.stack)}</strong></div>` : ''}
        <ul class="exp-admin-bullets">
          ${bulletsHtml}
        </ul>
      </div>
    `;
  }).join('');
}

document.getElementById('addExpBtn').addEventListener('click', () => {
  document.getElementById('expForm').reset();
  document.getElementById('expFieldId').value = '';
  document.getElementById('expOrder').value = state.experiences.length;
  document.getElementById('expModalHeading').textContent = 'New Experience';
  expModal.classList.add('is-open');
});

window.openEditExp = function(id) {
  const e = state.experiences.find(item => item.id === id);
  if (!e) return;

  document.getElementById('expFieldId').value = e.id;
  document.getElementById('expCompany').value = e.company || '';
  document.getElementById('expCompanyPeriod').value = e.company_period || '';
  document.getElementById('expRoleTitle').value = e.role_title || '';
  document.getElementById('expRolePeriod').value = e.role_period || '';
  document.getElementById('expStack').value = e.stack || '';
  document.getElementById('expOrder').value = e.order_index ?? 0;

  let bulletsArr = [];
  try {
    bulletsArr = typeof e.bullets === 'string' ? JSON.parse(e.bullets || '[]') : (e.bullets || []);
  } catch (err) {
    bulletsArr = [e.bullets];
  }
  document.getElementById('expBullets').value = bulletsArr.join('\n');

  document.getElementById('expModalHeading').textContent = `Edit Experience #${e.id}`;
  expModal.classList.add('is-open');
};

document.getElementById('expForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('expFieldId').value;
  const isEdit = Boolean(id);

  const bulletsLines = document.getElementById('expBullets').value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const payload = {
    company: document.getElementById('expCompany').value,
    company_period: document.getElementById('expCompanyPeriod').value,
    role_title: document.getElementById('expRoleTitle').value,
    role_period: document.getElementById('expRolePeriod').value,
    stack: document.getElementById('expStack').value,
    bullets: bulletsLines,
    order_index: Number(document.getElementById('expOrder').value) || 0
  };
  if (isEdit) payload.id = Number(id);

  try {
    const res = await fetch('/api/experiences', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      expModal.classList.remove('is-open');
      showToast(isEdit ? 'Experience updated.' : 'Experience added.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to save experience.', 'error');
  }
});

window.deleteExp = async function(id) {
  if (!confirm('Delete this experience entry?')) return;
  try {
    const res = await fetch('/api/experiences', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      showToast('Experience deleted.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to delete experience.', 'error');
  }
};

/* =========================================================================
   3. SERVICES TAB
   ========================================================================= */
function renderServices() {
  tabCountServices.textContent = state.services.length;
  servicesCountText.textContent = `${state.services.length} services available.`;

  if (state.services.length === 0) {
    servicesGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);">No services found.</div>`;
    return;
  }

  servicesGrid.innerHTML = state.services.map((s, idx) => {
    const tagsArr = (s.tags || '').split(',').map(t => t.trim()).filter(Boolean);
    const tagsHtml = tagsArr.map(t => `<span class="p-tag">${escapeHtml(t)}</span>`).join('');
    const imgSrc = s.image || 'images/siarvi.webp';
    const finalSrc = imgSrc.startsWith('http') ? imgSrc : '/' + imgSrc.replace(/^\//, '');

    return `
      <div class="p-admin-card" data-id="${s.id}">
        <div class="p-thumb">
          <img src="${escapeHtml(finalSrc)}" alt="${escapeHtml(s.title)}">
          <span class="p-chip">0${idx + 1}</span>
          <span class="p-order">#${s.order_index ?? 0}</span>
        </div>
        <div class="p-body">
          <h4 class="p-title">${escapeHtml(s.title)}</h4>
          <p class="p-desc">${escapeHtml(s.description)}</p>
          <div class="p-tags">${tagsHtml}</div>
          <div class="p-footer">
            <span></span>
            <div class="p-actions">
              <button class="btn btn-secondary btn-sm" onclick="openEditService(${s.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteService(${s.id})">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('addServiceBtn').addEventListener('click', () => {
  document.getElementById('serviceForm').reset();
  document.getElementById('serviceFieldId').value = '';
  document.getElementById('serviceOrder').value = state.services.length;
  document.getElementById('serviceImage').value = 'images/siarvi.webp';
  document.getElementById('serviceModalHeading').textContent = 'New Service';
  serviceModal.classList.add('is-open');
});

window.openEditService = function(id) {
  const s = state.services.find(item => item.id === id);
  if (!s) return;

  document.getElementById('serviceFieldId').value = s.id;
  document.getElementById('serviceTitle').value = s.title || '';
  document.getElementById('serviceDesc').value = s.description || '';
  document.getElementById('serviceImage').value = s.image || '';
  document.getElementById('serviceTags').value = s.tags || '';
  document.getElementById('serviceOrder').value = s.order_index ?? 0;

  document.getElementById('serviceModalHeading').textContent = `Edit Service #${s.id}`;
  serviceModal.classList.add('is-open');
};

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('serviceFieldId').value;
  const isEdit = Boolean(id);

  const payload = {
    title: document.getElementById('serviceTitle').value,
    description: document.getElementById('serviceDesc').value,
    image: document.getElementById('serviceImage').value,
    tags: document.getElementById('serviceTags').value,
    order_index: Number(document.getElementById('serviceOrder').value) || 0
  };
  if (isEdit) payload.id = Number(id);

  try {
    const res = await fetch('/api/services', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      serviceModal.classList.remove('is-open');
      showToast(isEdit ? 'Service updated.' : 'Service added.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to save service.', 'error');
  }
});

window.deleteService = async function(id) {
  if (!confirm('Delete this service?')) return;
  try {
    const res = await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      showToast('Service deleted.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to delete service.', 'error');
  }
};

/* =========================================================================
   4. HERO & CONTACT TAB
   ========================================================================= */
function populateHeroForm() {
  const h = state.content.hero || {};
  document.getElementById('heroRoleTag').value = h.roleTag || '';
  document.getElementById('heroLocationTag').value = h.locationTag || '';
  document.getElementById('heroHeading1').value = h.headingLine1 || '';
  document.getElementById('heroHeading2').value = h.headingLine2 || '';
  document.getElementById('heroIntro').value = h.intro || '';

  const m = h.metrics || [];
  document.getElementById('heroM1Val').value = m[0]?.val || '';
  document.getElementById('heroM1Lbl').value = m[0]?.lbl || '';
  document.getElementById('heroM2Val').value = m[1]?.val || '';
  document.getElementById('heroM2Lbl').value = m[1]?.lbl || '';
  document.getElementById('heroM3Val').value = m[2]?.val || '';
  document.getElementById('heroM3Lbl').value = m[2]?.lbl || '';

  document.getElementById('heroTicker').value = h.tickerItems || '';
}

document.getElementById('heroForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const heroData = {
    roleTag: document.getElementById('heroRoleTag').value,
    locationTag: document.getElementById('heroLocationTag').value,
    headingLine1: document.getElementById('heroHeading1').value,
    headingLine2: document.getElementById('heroHeading2').value,
    intro: document.getElementById('heroIntro').value,
    metrics: [
      { val: document.getElementById('heroM1Val').value, lbl: document.getElementById('heroM1Lbl').value },
      { val: document.getElementById('heroM2Val').value, lbl: document.getElementById('heroM2Lbl').value },
      { val: document.getElementById('heroM3Val').value, lbl: document.getElementById('heroM3Lbl').value }
    ],
    tickerItems: document.getElementById('heroTicker').value
  };

  try {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key: 'hero', data: heroData })
    });
    if (res.ok) {
      showToast('Hero settings saved.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to save Hero section.', 'error');
  }
});

function populateContactForm() {
  const c = state.content.contact || {};
  document.getElementById('contactHeading').value = c.heading || '';
  document.getElementById('contactDesc').value = c.desc || '';
  document.getElementById('contactEmail').value = c.email || '';
  document.getElementById('contactGithub').value = c.github || '';
  document.getElementById('contactLinkedin').value = c.linkedin || '';
  document.getElementById('contactLocation').value = c.location || '';
  document.getElementById('contactLocationUrl').value = c.locationUrl || '';
}

document.getElementById('contactFormSettings').addEventListener('submit', async (e) => {
  e.preventDefault();
  const contactData = {
    heading: document.getElementById('contactHeading').value,
    desc: document.getElementById('contactDesc').value,
    email: document.getElementById('contactEmail').value,
    github: document.getElementById('contactGithub').value,
    linkedin: document.getElementById('contactLinkedin').value,
    location: document.getElementById('contactLocation').value,
    locationUrl: document.getElementById('contactLocationUrl').value,
    cvLink: state.content.about?.cvLink || 'assets/CV_Pajar_Software_Engineer.pdf'
  };

  try {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key: 'contact', data: contactData })
    });
    if (res.ok) {
      showToast('Contact settings saved.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to save Contact section.', 'error');
  }
});

/* =========================================================================
   5. ABOUT TAB
   ========================================================================= */
function populateAboutForm() {
  const a = state.content.about || {};
  document.getElementById('aboutCvLink').value = a.cvLink || '';
  document.getElementById('aboutLead').value = a.aboutLead || '';
  document.getElementById('aboutSub').value = a.aboutSub || '';

  const specs = a.specSheet || [];
  const findSpec = (key) => specs.find(s => s.k === key)?.v || '';
  document.getElementById('specName').value = findSpec('Name') || 'Pajar';
  document.getElementById('specRole').value = findSpec('Role') || 'Software Engineer';
  document.getElementById('specBased').value = findSpec('Based In') || 'Bogor, West Java, ID';
  document.getElementById('specExp').value = findSpec('Experience') || '3+ Years';
  document.getElementById('specFocus').value = findSpec('Focus') || '';
  document.getElementById('specStatus').value = findSpec('Status') || 'Open to WFO — Jabodetabek';
}

document.getElementById('aboutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const aboutData = {
    cvLink: document.getElementById('aboutCvLink').value,
    aboutLead: document.getElementById('aboutLead').value,
    aboutSub: document.getElementById('aboutSub').value,
    specSheet: [
      { k: 'Name', v: document.getElementById('specName').value },
      { k: 'Role', v: document.getElementById('specRole').value },
      { k: 'Based In', v: document.getElementById('specBased').value },
      { k: 'Experience', v: document.getElementById('specExp').value },
      { k: 'Focus', v: document.getElementById('specFocus').value },
      { k: 'Status', v: document.getElementById('specStatus').value }
    ]
  };

  try {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key: 'about', data: aboutData })
    });
    if (res.ok) {
      showToast('About profile saved.');
      loadAllData();
    }
  } catch (err) {
    showToast('Failed to save About section.', 'error');
  }
});

// Init
checkAuth();
