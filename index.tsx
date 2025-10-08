// --- TYPE DEFINITIONS ---
interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    organization?: string;
    category: string;
    address?: string;
    city?: string;
    state?: string;
    notes?: string;
    dateAdded: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
}

interface Activity {
    text: string;
    icon: string;
    time: string;
}

// In-memory data for the current user
let contacts: Contact[] = [];
let categories: Category[] = [];
let activities: Activity[] = [];

let currentEditId: number | null = null;
let currentUserId: number | null = null;

const defaultData = {
    contacts: [
        { id: 1672532400001, firstName: 'Elena', lastName: 'Rodriguez', phone: '202-555-0181', email: 'elena.r@innovate.com', organization: 'Innovate Inc.', category: '1', address: '123 Tech Ave', city: 'Metropolis', state: 'NY', notes: 'Primary contact for Project Alpha.', dateAdded: '2023-01-01T10:00:00.000Z' },
        { id: 1672532400002, firstName: 'Marcus', lastName: 'Chen', phone: '202-555-0199', email: 'marcus.chen@apex.co', organization: 'Apex Supplies', category: '2', address: '456 Industrial Rd', city: 'Gotham', state: 'NJ', notes: 'Our main supplier for raw materials.', dateAdded: '2023-02-15T11:30:00.000Z' },
        { id: 1672532400003, firstName: 'Sophia', lastName: 'Williams', phone: '312-555-0142', email: 'sophia.w@quantum.net', organization: 'Quantum Solutions', category: '3', address: '789 Logic Lane', city: 'Star City', state: 'CA', notes: 'Partner for the upcoming Q3 initiative.', dateAdded: '2023-03-10T14:00:00.000Z' },
        { id: 1672532400004, firstName: 'Liam', lastName: "O'Connor", phone: '415-555-0133', email: 'liam.o@synergy.io', organization: 'Synergy Corp', category: '4', address: '101 Future Drive', city: 'San Francisco', state: 'CA', notes: 'Met at the tech conference. Interested in our services.', dateAdded: '2023-04-20T09:00:00.000Z' },
        { id: 1672532400005, firstName: 'Aisha', lastName: 'Khan', phone: '312-555-0155', email: 'aisha.k@quantum.net', organization: 'Quantum Solutions', category: '1', address: '789 Logic Lane', city: 'Star City', state: 'CA', notes: 'Handles the day-to-day operations for the Q3 initiative.', dateAdded: '2023-05-05T16:45:00.000Z' },
        { id: 1672532400006, firstName: 'Ben', lastName: 'Carter', phone: '713-555-0112', email: 'ben.carter@atlas.com', organization: 'Atlas Manufacturing', category: '2', address: '234 Factory Blvd', city: 'Houston', state: 'TX', notes: 'Provides specialized components. Good pricing.', dateAdded: '2023-06-11T13:20:00.000Z' },
        { id: 1672532400007, firstName: 'Olivia', lastName: 'Garcia', phone: '305-555-0178', email: 'olivia.g@vista.co', organization: 'Vista Innovations', category: '3', address: '567 Ocean View', city: 'Miami', state: 'FL', notes: 'Potential partner for the new marketing campaign.', dateAdded: '2023-07-22T18:10:00.000Z' },
        { id: 1672532400008, firstName: 'David', lastName: 'Kim', phone: '206-555-0121', email: 'david.kim@summit.com', organization: 'Summit Enterprises', category: '4', address: '890 Peak St', city: 'Seattle', state: 'WA', notes: 'Interested in a bulk purchase. Follow up next week.', dateAdded: '2023-08-01T11:00:00.000Z' },
        { id: 1672532400009, firstName: 'Chloe', lastName: 'Taylor', phone: '617-555-0164', email: 'chloe.t@innovate.com', organization: 'Innovate Inc.', category: '1', address: '123 Tech Ave', city: 'Metropolis', state: 'NY', notes: 'Technical lead for Project Alpha.', dateAdded: '2023-09-14T10:30:00.000Z' }
    ],
    categories: [
        { id: 1, name: 'Client', description: 'Regular customers' },
        { id: 2, name: 'Supplier', description: 'Product/service suppliers' },
        { id: 3, name: 'Partner', description: 'Business partners' },
        { id: 4, name: 'Prospect', description: 'Potential clients' }
    ],
    activities: []
};

// --- SVG ICONS ---
const svgIcon = (path: string, viewBox = '0 0 24 24') => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const icons = {
    edit: svgIcon(`<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>`),
    trash: svgIcon(`<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>`),
    plus: svgIcon(`<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>`),
    phone: svgIcon(`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>`),
    mail: svgIcon(`<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>`),
    location: svgIcon(`<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>`),
    usersGroup: svgIcon(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`),
    tag: svgIcon(`<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.586-6.586a2.426 2.426 0 0 0 0-3.432z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>`),
    export: svgIcon(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>`),
    chart: svgIcon(`<path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20V16"></path>`),
    backup: svgIcon(`<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>`),
    import: svgIcon(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>`),
    activityLog: svgIcon(`<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>`),
};


// --- AUTHENTICATION ---
function showAuthForm(formName: 'login' | 'register') {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById(formName + 'Form')!.classList.add('active');
}

function handleRegister(event: Event) {
    event.preventDefault();
    const username = (document.getElementById('registerUsername') as HTMLInputElement).value.trim();
    const password = (document.getElementById('registerPassword') as HTMLInputElement).value;

    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }

    const appData = getMasterData();
    if (appData.users.find((u: { username: string; }) => u.username === username)) {
        alert('Username already exists. Please choose another.');
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        password // Note: In a real app, hash and salt the password!
    };
    appData.users.push(newUser);
    appData.userData[newUser.id] = JSON.parse(JSON.stringify(defaultData)); // Deep copy default data

    localStorage.setItem('CISB_DATA', JSON.stringify(appData));
    
    alert('Registration successful! Welcome.');
    (document.getElementById('registerForm') as HTMLFormElement).reset();
    loginUser(newUser.id);
}

function handleLogin(event: Event) {
    event.preventDefault();
    const username = (document.getElementById('loginUsername') as HTMLInputElement).value.trim();
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

    const appData = getMasterData();
    const user = appData.users.find((u: { username: string; password: any; }) => u.username === username && u.password === password);

    if (user) {
        loginUser(user.id);
    } else {
        alert('Invalid username or password.');
    }
}

function loginUser(userId: number) {
    sessionStorage.setItem('CISB_USER_ID', String(userId));
    initializeAppForUser(userId);
}

function handleLogout() {
    sessionStorage.removeItem('CISB_USER_ID');
    currentUserId = null;
    contacts = [];
    categories = [];
    activities = [];

    const dashboardTitle = document.getElementById('dashboardTitle') as HTMLElement;
    if (dashboardTitle) {
        dashboardTitle.textContent = 'Dashboard';
    }

    document.getElementById('auth-container')!.style.display = 'block';
    (document.querySelector('.container') as HTMLElement)!.style.display = 'none';
    showAuthForm('login');
}

// --- DATA MANAGEMENT ---
function getMasterData() {
    const data = localStorage.getItem('CISB_DATA');
    if (data) {
        return JSON.parse(data);
    }
    const initialData = { users: [], userData: {} };
    localStorage.setItem('CISB_DATA', JSON.stringify(initialData));
    return initialData;
}

function saveToLocalStorage() {
    if (!currentUserId) return;
    const appData = getMasterData();
    appData.userData[currentUserId] = { contacts, categories, activities };
    localStorage.setItem('CISB_DATA', JSON.stringify(appData));
}

function loadFromLocalStorage() {
    if (!currentUserId) return;
    const appData = getMasterData();
    const userData = appData.userData[currentUserId];

    if (userData) {
        contacts = userData.contacts || [];
        categories = userData.categories || [];
        activities = userData.activities || [];
    } else {
        contacts = [];
        categories = [];
        activities = [];
    }
}

// --- INITIALIZATION & UI ---
function init() {
    const userId = sessionStorage.getItem('CISB_USER_ID');
    if (userId) {
        initializeAppForUser(parseInt(userId, 10));
    } else {
        document.getElementById('auth-container')!.style.display = 'block';
        (document.querySelector('.container') as HTMLElement)!.style.display = 'none';
    }

    const savedTheme = localStorage.getItem('smeTheme');
    (document.getElementById('darkModeToggle') as HTMLInputElement).checked = savedTheme === 'dark';

    // Mobile menu setup
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    hamburgerMenu?.addEventListener('click', toggleMobileMenu);

    const sidebar = document.querySelector('.sidebar');
    sidebar?.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.nav-btn')) {
            closeMobileMenu();
        }
    });
}

function initializeAppForUser(userId: number) {
    currentUserId = userId;

    const appData = getMasterData();
    const user = appData.users.find((u: { id: number; }) => u.id === userId);
    const dashboardTitle = document.getElementById('dashboardTitle') as HTMLElement;
    if (user && dashboardTitle) {
        dashboardTitle.textContent = `Welcome, ${user.username}!`;
    }

    document.getElementById('auth-container')!.style.display = 'none';
    (document.querySelector('.container') as HTMLElement)!.style.display = 'flex';

    loadFromLocalStorage();
    populateCategoryDropdowns();
    renderContacts();
    renderCategories();
    updateStats();
    updateDashboard();
    showView('dashboard');
}

function toggleMobileMenu() {
    document.body.classList.toggle('sidebar-open');
}

function closeMobileMenu() {
    document.body.classList.remove('sidebar-open');
}

function showView(viewId: string) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(viewId)!.classList.add('active');
    const navBtn = document.querySelector(`.nav-btn[data-view='${viewId}']`);
    if (navBtn) {
        navBtn.classList.add('active');
    }
}

function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark');
    const isDarkMode = root.classList.contains('dark');
    localStorage.setItem('smeTheme', isDarkMode ? 'dark' : 'light');
}

function viewContactsByCategory(categoryId: number) {
    (document.getElementById('categoryFilter') as HTMLSelectElement).value = String(categoryId);
    showView('contacts');
    filterContacts();
}

// Contact functions
function openAddContactModal() {
    currentEditId = null;
    document.getElementById('modalTitle')!.textContent = 'Add New Contact';
    (document.getElementById('contactForm') as HTMLFormElement).reset();
    (document.getElementById('contactId') as HTMLInputElement).value = '';
    document.getElementById('contactModal')!.classList.add('active');
}

function closeContactModal() {
    document.getElementById('contactModal')!.classList.remove('active');
}

function editContact(id: number) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    currentEditId = id;
    document.getElementById('modalTitle')!.textContent = 'Edit Contact';
    (document.getElementById('contactId') as HTMLInputElement).value = String(contact.id);
    (document.getElementById('firstName') as HTMLInputElement).value = contact.firstName;
    (document.getElementById('lastName') as HTMLInputElement).value = contact.lastName;
    (document.getElementById('phone') as HTMLInputElement).value = contact.phone;
    (document.getElementById('email') as HTMLInputElement).value = contact.email || '';
    (document.getElementById('organization') as HTMLInputElement).value = contact.organization || '';
    (document.getElementById('category') as HTMLSelectElement).value = contact.category;
    (document.getElementById('address') as HTMLInputElement).value = contact.address || '';
    (document.getElementById('city') as HTMLInputElement).value = contact.city || '';
    (document.getElementById('state') as HTMLInputElement).value = contact.state || '';
    (document.getElementById('notes') as HTMLTextAreaElement).value = contact.notes || '';
    
    document.getElementById('contactModal')!.classList.add('active');
}

function saveContact() {
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value.trim();
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    const category = (document.getElementById('category') as HTMLSelectElement).value;

    if (!firstName || !lastName || !phone || !category) {
        alert('Please fill in all required fields');
        return;
    }

    const contact: Contact = {
        id: currentEditId || Date.now(),
        firstName,
        lastName,
        phone,
        email: (document.getElementById('email') as HTMLInputElement).value.trim(),
        organization: (document.getElementById('organization') as HTMLInputElement).value.trim(),
        category,
        address: (document.getElementById('address') as HTMLInputElement).value.trim(),
        city: (document.getElementById('city') as HTMLInputElement).value.trim(),
        state: (document.getElementById('state') as HTMLInputElement).value.trim(),
        notes: (document.getElementById('notes') as HTMLTextAreaElement).value.trim(),
        dateAdded: currentEditId ? contacts.find(c => c.id === currentEditId)!.dateAdded : new Date().toISOString()
    };

    if (currentEditId) {
        const index = contacts.findIndex(c => c.id === currentEditId);
        contacts[index] = contact;
        addActivity(`Updated contact: ${firstName} ${lastName}`, icons.edit);
    } else {
        contacts.push(contact);
        addActivity(`Added new contact: ${firstName} ${lastName}`, icons.plus);
    }

    saveToLocalStorage();
    renderContacts();
    updateStats();
    updateDashboard();
    closeContactModal();
}

function deleteContact(id: number) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    if (confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
        contacts = contacts.filter(c => c.id !== id);
        addActivity(`Deleted contact: ${contact.firstName} ${contact.lastName}`, icons.trash);
        saveToLocalStorage();
        renderContacts();
        updateStats();
        updateDashboard();
    }
}

function renderContacts() {
    const grid = document.getElementById('contactsGrid')!;
    const emptyState = document.getElementById('emptyState')!;
    
    let filteredContacts = [...contacts];
    
    const searchTerm = (document.getElementById('searchInput') as HTMLInputElement)?.value.toLowerCase() || '';
    const categoryFilter = (document.getElementById('categoryFilter') as HTMLSelectElement)?.value || '';
    const sortFilter = (document.getElementById('sortFilter') as HTMLSelectElement)?.value || 'name';

    if (searchTerm) {
        filteredContacts = filteredContacts.filter(c => 
            c.firstName.toLowerCase().includes(searchTerm) ||
            c.lastName.toLowerCase().includes(searchTerm) ||
            c.phone.includes(searchTerm) ||
            (c.email && c.email.toLowerCase().includes(searchTerm)) ||
            (c.organization && c.organization.toLowerCase().includes(searchTerm))
        );
    }

    if (categoryFilter) {
        filteredContacts = filteredContacts.filter(c => c.category == categoryFilter);
    }

    if (sortFilter === 'name') {
        filteredContacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (sortFilter === 'recent') {
        filteredContacts.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (sortFilter === 'organization') {
        filteredContacts.sort((a, b) => (a.organization || '').localeCompare(b.organization || ''));
    }

    if (filteredContacts.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
    }

    grid.innerHTML = filteredContacts.map(contact => {
        let initials = (contact.firstName?.[0] || '' + contact.lastName?.[0] || '').toUpperCase() || '??';
        const categoryName = categories.find(cat => cat.id == Number(contact.category))?.name || 'Uncategorized';
        
        return `
            <div class="contact-card">
                <div class="contact-header">
                    <div style="display: flex; align-items: center;">
                        <div class="contact-avatar">${initials}</div>
                        <div class="contact-info">
                            <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
                            ${contact.organization ? `<div class="contact-org">${contact.organization}</div>` : ''}
                        </div>
                    </div>
                    <div class="contact-actions">
                        <button class="icon-btn" onclick="editContact(${contact.id})" title="Edit">${icons.edit}</button>
                        <button class="icon-btn" onclick="deleteContact(${contact.id})" title="Delete">${icons.trash}</button>
                    </div>
                </div>
                <div class="contact-details">
                    <div class="detail-row"><span class="icon">${icons.phone}</span><a href="tel:${contact.phone}">${contact.phone}</a></div>
                    ${contact.email ? `<div class="detail-row"><span class="icon">${icons.mail}</span><a href="mailto:${contact.email}">${contact.email}</a></div>` : ''}
                    ${contact.address ? `<div class="detail-row"><span class="icon">${icons.location}</span><span>${contact.address}${contact.city ? ', ' + contact.city : ''}${contact.state ? ', ' + contact.state : ''}</span></div>` : ''}
                    <span class="category-badge">${categoryName}</span>
                </div>
            </div>
        `;
    }).join('');
}

function filterContacts() { renderContacts(); }

// Category functions
function openAddCategoryModal() {
    (document.getElementById('categoryName') as HTMLInputElement).value = '';
    (document.getElementById('categoryDesc') as HTMLTextAreaElement).value = '';
    document.getElementById('categoryModal')!.classList.add('active');
}

function closeCategoryModal() { document.getElementById('categoryModal')!.classList.remove('active'); }

function saveCategory() {
    const name = (document.getElementById('categoryName') as HTMLInputElement).value.trim();
    const description = (document.getElementById('categoryDesc') as HTMLTextAreaElement).value.trim();

    if (!name) {
        alert('Please enter a category name');
        return;
    }

    const category: Category = { id: Date.now(), name, description };

    categories.push(category);
    addActivity(`Added new category: ${name}`, icons.tag);
    saveToLocalStorage();
    populateCategoryDropdowns();
    renderCategories();
    updateStats();
    closeCategoryModal();
}

function deleteCategory(id: number) {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const contactsInCategory = contacts.filter(c => c.category == String(id)).length;
    
    if (contactsInCategory > 0) {
        alert(`Cannot delete this category. ${contactsInCategory} contact(s) are using it.`);
        return;
    }

    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
        categories = categories.filter(c => c.id !== id);
        addActivity(`Deleted category: ${category.name}`, icons.trash);
        saveToLocalStorage();
        populateCategoryDropdowns();
        renderCategories();
        updateStats();
    }
}

function populateCategoryDropdowns() {
    const categorySelect = document.getElementById('category')!;
    const categoryFilter = document.getElementById('categoryFilter')!;
    
    const options = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');

    if (categorySelect) categorySelect.innerHTML = '<option value="">Select Category</option>' + options;
    if (categoryFilter) categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid')!;
    grid.innerHTML = categories.map(category => {
        const contactCount = contacts.filter(c => c.category == String(category.id)).length;
        return `
            <div class="contact-card" onclick="viewContactsByCategory(${category.id})">
                <div class="contact-header">
                    <div style="display: flex; align-items: center;">
                        <div class="contact-avatar">${icons.tag}</div>
                        <div class="contact-info">
                            <div class="contact-name">${category.name}</div>
                            ${category.description ? `<div class="contact-org">${category.description}</div>` : ''}
                        </div>
                    </div>
                    <div class="contact-actions">
                        <button class="icon-btn" onclick="deleteCategory(${category.id}); event.stopPropagation();" title="Delete">${icons.trash}</button>
                    </div>
                </div>
                <div class="contact-details">
                    <div class="detail-row"><span class="icon">${icons.usersGroup}</span><span>${contactCount} contact${contactCount !== 1 ? 's' : ''}</span></div>
                </div>
            </div>
        `;
    }).join('');
}

// Stats and Dashboard
function updateStats() {
    const total = contacts.length;
    const orgs = [...new Set(contacts.map(c => c.organization).filter(o => o))].length;
    const cats = categories.length;

    document.getElementById('totalContacts')!.textContent = String(total);
    document.getElementById('totalOrgs')!.textContent = String(orgs);
    document.getElementById('totalCategories')!.textContent = String(cats);
}

function updateDashboard() {
    const total = contacts.length;
    
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = contacts.filter(c => new Date(c.dateAdded) >= firstOfMonth).length;
    
    const clients = contacts.filter(c => categories.find(cat => cat.id == Number(c.category))?.name.toLowerCase() === 'client').length;
    const suppliers = contacts.filter(c => categories.find(cat => cat.id == Number(c.category))?.name.toLowerCase() === 'supplier').length;
    const partners = contacts.filter(c => categories.find(cat => cat.id == Number(c.category))?.name.toLowerCase() === 'partner').length;

    document.getElementById('dashTotalContacts')!.textContent = String(total);
    document.getElementById('dashNewThisMonth')!.textContent = String(newThisMonth);
    document.getElementById('dashActiveClients')!.textContent = String(clients);
    document.getElementById('dashSuppliers')!.textContent = String(suppliers);
    document.getElementById('reportTotalContacts')!.textContent = String(total);
    document.getElementById('reportClients')!.textContent = String(clients);
    document.getElementById('reportSuppliers')!.textContent = String(suppliers);
    document.getElementById('reportPartners')!.textContent = String(partners);

    renderActivity();
}

// Activity tracking
function addActivity(text: string, icon: string) {
    activities.unshift({ text, icon, time: new Date().toLocaleString() });
    if (activities.length > 10) activities = activities.slice(0, 10);
    saveToLocalStorage();
    renderActivity();
}

function renderActivity() {
    const activityList = document.getElementById('activityList')!;
    if (!activities || activities.length === 0) {
        activityList.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-3);"><div style="font-size: 48px; margin-bottom: 10px;">${icons.activityLog}</div><div>No recent activity</div></div>`;
        return;
    }
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Export functions
function exportContacts() {
    if (contacts.length === 0) {
        alert('No contacts to export');
        return;
    }
    const csv = convertToCSV(contacts);
    downloadCSV(csv, 'contacts_export.csv');
    addActivity(`Exported ${contacts.length} contacts`, icons.export);
}

function convertToCSV(data: Contact[]) {
    const headers = ['First Name', 'Last Name', 'Phone', 'Email', 'Organization', 'Category', 'Address', 'City', 'State', 'Notes'];
    const rows = data.map(contact => {
        const categoryName = categories.find(cat => cat.id == Number(contact.category))?.name || '';
        return [contact.firstName, contact.lastName, contact.phone, contact.email || '', contact.organization || '', categoryName, contact.address || '', contact.city || '', contact.state || '', (contact.notes || '').replace(/"/g, '""')];
    });
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => { csvContent += row.map(field => `"${field}"`).join(',') + '\n'; });
    return csvContent;
}

function downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateReport() {
    const reportData: any = {
        totalContacts: contacts.length,
        byCategory: {},
        byState: {},
        recentlyAdded: contacts.filter(c => new Date(c.dateAdded) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
    };
    contacts.forEach(contact => {
        const categoryName = categories.find(cat => cat.id == Number(contact.category))?.name || 'Uncategorized';
        reportData.byCategory[categoryName] = (reportData.byCategory[categoryName] || 0) + 1;
        if (contact.state) reportData.byState[contact.state] = (reportData.byState[contact.state] || 0) + 1;
    });

    let report = `COMPUTERIZED INFORMATION SYSTEM FOR BUSINESS - FULL REPORT\nGenerated: ${new Date().toLocaleString()}\n\nSUMMARY\nTotal Contacts: ${reportData.totalContacts}\nAdded in Last 7 Days: ${reportData.recentlyAdded}\n\nBY CATEGORY\n`;
    Object.entries(reportData.byCategory).forEach(([cat, count]) => { report += `${cat}: ${count}\n`; });
    if (Object.keys(reportData.byState).length > 0) {
        report += `\nBY STATE\n`;
        Object.entries(reportData.byState).forEach(([state, count]) => { report += `${state}: ${count}\n`; });
    }
    downloadCSV(report, 'directory_report.txt');
    addActivity('Generated full report', icons.chart);
}

// Settings functions
function backupData() {
    const backup = { contacts, categories, exportDate: new Date().toISOString() };
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `directory_backup_${Date.now()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addActivity('Created data backup', icons.backup);
    alert('Backup created successfully!');
}

function importContacts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files![0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target!.result as string);
                if (data.contacts && Array.isArray(data.contacts)) {
                    const importedContacts = data.contacts.map((c: Contact) => ({...c, id: c.id + Date.now()}));
                    contacts = [...contacts, ...importedContacts];
                    if (data.categories) {
                        data.categories.forEach((importedCat: Category) => {
                            if (!categories.some(c => c.name === importedCat.name)) {
                                categories.push({...importedCat, id: importedCat.id + Date.now()});
                            }
                        });
                    }
                    saveToLocalStorage();
                    renderContacts(); populateCategoryDropdowns(); renderCategories(); updateStats(); updateDashboard();
                    addActivity(`Imported ${data.contacts.length} contacts`, icons.import);
                    alert('Import successful!');
                } else { alert('Invalid JSON file format.'); }
            } catch (error) { alert('Error importing file: ' + (error as Error).message); }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearAllData() {
    if (confirm('Are you ABSOLUTELY sure you want to delete ALL your contacts and categories? This cannot be undone!')) {
        if (confirm('This is your final warning. All your data will be permanently deleted. Continue?')) {
            const confirmationText = prompt('To confirm, please type "DELETE" in the box below.');
            if (confirmationText === 'DELETE') {
                const defaultCats = JSON.parse(JSON.stringify(defaultData.categories));
                contacts = [];
                categories = defaultCats;
                activities = [];
                saveToLocalStorage();
                initializeAppForUser(currentUserId!);
                alert('All your data has been cleared.');
            } else {
                alert('Deletion cancelled. You did not type "DELETE" correctly.');
            }
        }
    }
}

Object.assign(window, {
    handleLogin, handleRegister, showAuthForm, handleLogout,
    showView, toggleTheme,
    openAddContactModal, closeContactModal, saveContact, editContact, deleteContact, filterContacts,
    openAddCategoryModal, closeCategoryModal, saveCategory, deleteCategory, viewContactsByCategory,
    exportContacts, generateReport,
    backupData, importContacts, clearAllData,
});

window.onload = init;