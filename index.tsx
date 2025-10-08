
import { GoogleGenAI } from "@google/genai";

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
        { id: 1672532400003, firstName: 'Sophia', lastName: 'Williams', phone: '312-555-0142', email: 'sophia.w@quantum.net', organization: 'Quantum Solutions', category: '3', address: '789 Logic Lane', city: 'Star City', state: 'CA', notes: 'Partner for the upcoming Q3 initiative.', dateAdded: '2023-03-10T14:00:00.000Z' }
    ],
    categories: [
        { id: 1, name: 'Client', description: 'Regular customers' },
        { id: 2, name: 'Supplier', description: 'Product/service suppliers' },
        { id: 3, name: 'Partner', description: 'Business partners' },
        { id: 4, name: 'Prospect', description: 'Potential clients' }
    ],
    activities: []
};

// --- GEMINI API SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


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
    
    // Redirect to login form instead of auto-logging in
    alert('Registration successful! Please sign in.');
    (document.getElementById('registerForm') as HTMLFormElement).reset();
    showAuthForm('login');
    (document.getElementById('loginUsername') as HTMLInputElement).value = username;
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

    // Reset dashboard title
    const dashboardTitle = document.getElementById('dashboardTitle') as HTMLElement;
    if (dashboardTitle) {
        dashboardTitle.textContent = 'Dashboard';
    }

    document.getElementById('auth-container')!.style.display = 'block';
    // FIX: Cast querySelector result to HTMLElement to access style property
    (document.querySelector('.container') as HTMLElement)!.style.display = 'none';
    showAuthForm('login');
}

// --- DATA MANAGEMENT ---
function getMasterData() {
    const data = localStorage.getItem('CISB_DATA');
    if (data) {
        return JSON.parse(data);
    }
    // Initialize if it doesn't exist, making storage the single source of truth.
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
        // This case handles a corrupted data scenario
        contacts = [];
        categories = [];
        activities = [];
    }
}

// --- INITIALIZATION ---
function init() {
    const userId = sessionStorage.getItem('CISB_USER_ID');
    if (userId) {
        initializeAppForUser(parseInt(userId, 10));
    } else {
        document.getElementById('auth-container')!.style.display = 'block';
        // FIX: Cast querySelector result to HTMLElement to access style property
        (document.querySelector('.container') as HTMLElement)!.style.display = 'none';
    }

    const savedTheme = localStorage.getItem('smeTheme');
    (document.getElementById('darkModeToggle') as HTMLInputElement).checked = savedTheme === 'dark';
}

function initializeAppForUser(userId: number) {
    currentUserId = userId;

    // Personalize Dashboard Title
    const appData = getMasterData();
    const user = appData.users.find((u: { id: number; }) => u.id === userId);
    const dashboardTitle = document.getElementById('dashboardTitle') as HTMLElement;
    if (user && dashboardTitle) {
        dashboardTitle.textContent = `Welcome, ${user.username}!`;
    }

    document.getElementById('auth-container')!.style.display = 'none';
    // FIX: Cast querySelector result to HTMLElement to access style property
    (document.querySelector('.container') as HTMLElement)!.style.display = 'block';

    loadFromLocalStorage();
    populateCategoryDropdowns();
    renderContacts();
    renderCategories();
    updateStats();
    updateDashboard();
    showView('dashboard');
}

// Navigation
function showView(viewId: string) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(viewId)!.classList.add('active');
    const navBtn = document.querySelector(`.nav-btn[data-view='${viewId}']`);
    if (navBtn) {
        navBtn.classList.add('active');
    }
}

// Theme toggle function
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
        addActivity(`Updated contact: ${firstName} ${lastName}`, '✏️');
    } else {
        contacts.push(contact);
        addActivity(`Added new contact: ${firstName} ${lastName}`, '➕');
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
        addActivity(`Deleted contact: ${contact.firstName} ${contact.lastName}`, '🗑️');
        saveToLocalStorage();
        renderContacts();
        updateStats();
        updateDashboard();
    }
}

function renderContacts() {
    const grid = document.getElementById('contactsGrid')!;
    const emptyState = document.getElementById('emptyState')!;
    
    if (contacts.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
    }

    let filteredContacts = [...contacts];
    
    // Apply filters
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

    // Apply sorting
    if (sortFilter === 'name') {
        filteredContacts.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (sortFilter === 'recent') {
        filteredContacts.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (sortFilter === 'organization') {
        filteredContacts.sort((a, b) => (a.organization || '').localeCompare(b.organization || ''));
    }

    grid.innerHTML = filteredContacts.map(contact => {
        let initials = '👤';
        if (contact.firstName && contact.lastName) {
            initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();
        } else if (contact.firstName) {
            initials = contact.firstName[0].toUpperCase();
        } else if (contact.lastName) {
            initials = contact.lastName[0].toUpperCase();
        }
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
                        <button class="icon-btn" onclick="editContact(${contact.id})" title="Edit">✏️</button>
                        <button class="icon-btn" onclick="deleteContact(${contact.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="contact-details">
                    <div class="detail-row">
                        <span class="icon">📞</span>
                        <a href="tel:${contact.phone}">${contact.phone}</a>
                    </div>
                    ${contact.email ? `
                    <div class="detail-row">
                        <span class="icon">✉️</span>
                        <a href="mailto:${contact.email}">${contact.email}</a>
                    </div>
                    ` : ''}
                    ${contact.address ? `
                    <div class="detail-row">
                        <span class="icon">📍</span>
                        <span>${contact.address}${contact.city ? ', ' + contact.city : ''}${contact.state ? ', ' + contact.state : ''}</span>
                    </div>
                    ` : ''}
                    <span class="category-badge">${categoryName}</span>
                </div>
            </div>
        `;
    }).join('');
}

function filterContacts() {
    renderContacts();
}

// Category functions
function openAddCategoryModal() {
    (document.getElementById('categoryName') as HTMLInputElement).value = '';
    (document.getElementById('categoryDesc') as HTMLTextAreaElement).value = '';
    document.getElementById('categoryModal')!.classList.add('active');
}

function closeCategoryModal() {
    document.getElementById('categoryModal')!.classList.remove('active');
}

function saveCategory() {
    const name = (document.getElementById('categoryName') as HTMLInputElement).value.trim();
    const description = (document.getElementById('categoryDesc') as HTMLTextAreaElement).value.trim();

    if (!name) {
        alert('Please enter a category name');
        return;
    }

    const category: Category = {
        id: Date.now(),
        name,
        description
    };

    categories.push(category);
    addActivity(`Added new category: ${name}`, '🏷️');
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
        addActivity(`Deleted category: ${category.name}`, '🗑️');
        saveToLocalStorage();
        populateCategoryDropdowns();
        renderCategories();
        updateStats();
    }
}

function populateCategoryDropdowns() {
    const categorySelect = document.getElementById('category')!;
    const categoryFilter = document.getElementById('categoryFilter')!;
    
    const options = categories.map(cat => 
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');

    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Select Category</option>' + options;
    }

    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
    }
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid')!;
    
    grid.innerHTML = categories.map(category => {
        const contactCount = contacts.filter(c => c.category == String(category.id)).length;
        
        return `
            <div class="contact-card" onclick="viewContactsByCategory(${category.id})">
                <div class="contact-header">
                    <div style="display: flex; align-items: center;">
                        <div class="contact-avatar">🏷️</div>
                        <div class="contact-info">
                            <div class="contact-name">${category.name}</div>
                            ${category.description ? `<div class="contact-org">${category.description}</div>` : ''}
                        </div>
                    </div>
                    <div class="contact-actions">
                        <button class="icon-btn" onclick="deleteCategory(${category.id}); event.stopPropagation();" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="contact-details">
                    <div class="detail-row">
                        <span class="icon">👥</span>
                        <span>${contactCount} contact${contactCount !== 1 ? 's' : ''}</span>
                    </div>
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
    
    const clients = contacts.filter(c => {
        const cat = categories.find(cat => cat.id == Number(c.category));
        return cat && cat.name.toLowerCase() === 'client';
    }).length;
    
    const suppliers = contacts.filter(c => {
        const cat = categories.find(cat => cat.id == Number(c.category));
        return cat && cat.name.toLowerCase() === 'supplier';
    }).length;

    const partners = contacts.filter(c => {
        const cat = categories.find(cat => cat.id == Number(c.category));
        return cat && cat.name.toLowerCase() === 'partner';
    }).length;

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
    activities.unshift({
        text,
        icon,
        time: new Date().toLocaleString()
    });
    
    if (activities.length > 10) {
        activities = activities.slice(0, 10);
    }
    
    saveToLocalStorage(); // Save activities
    renderActivity();
}

function renderActivity() {
    const activityList = document.getElementById('activityList')!;
    
    if (!activities || activities.length === 0) {
        activityList.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-light);"><div style="font-size: 48px; margin-bottom: 10px;">📊</div><div>No recent activity</div></div>`;
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
    addActivity(`Exported ${contacts.length} contacts`, '📤');
}

function convertToCSV(data: Contact[]) {
    const headers = ['First Name', 'Last Name', 'Phone', 'Email', 'Organization', 'Category', 'Address', 'City', 'State', 'Notes'];
    const rows = data.map(contact => {
        const categoryName = categories.find(cat => cat.id == Number(contact.category))?.name || '';
        return [
            contact.firstName,
            contact.lastName,
            contact.phone,
            contact.email || '',
            contact.organization || '',
            categoryName,
            contact.address || '',
            contact.city || '',
            contact.state || '',
            (contact.notes || '').replace(/"/g, '""')
        ];
    });

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

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
        recentlyAdded: contacts.filter(c => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(c.dateAdded) >= weekAgo;
        }).length
    };

    contacts.forEach(contact => {
        const categoryName = categories.find(cat => cat.id == Number(contact.category))?.name || 'Uncategorized';
        reportData.byCategory[categoryName] = (reportData.byCategory[categoryName] || 0) + 1;
    });

    contacts.forEach(contact => {
        if (contact.state) {
            reportData.byState[contact.state] = (reportData.byState[contact.state] || 0) + 1;
        }
    });

    let report = `COMPUTERIZED INFORMATION SYSTEM FOR BUSINESS - FULL REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;
    report += `SUMMARY\n`;
    report += `Total Contacts: ${reportData.totalContacts}\n`;
    report += `Added in Last 7 Days: ${reportData.recentlyAdded}\n\n`;
    
    report += `BY CATEGORY\n`;
    Object.entries(reportData.byCategory).forEach(([cat, count]) => { report += `${cat}: ${count}\n`; });
    
    if (Object.keys(reportData.byState).length > 0) {
        report += `\nBY STATE\n`;
        Object.entries(reportData.byState).forEach(([state, count]) => { report += `${state}: ${count}\n`; });
    }

    downloadCSV(report, 'directory_report.txt');
    addActivity('Generated full report', '📊');
}

// Settings functions
function backupData() {
    const backup = {
        contacts,
        categories,
        exportDate: new Date().toISOString()
    };

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

    addActivity('Created data backup', '💾');
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
                    // A simple merge. More complex logic could be added for duplicates.
                    const importedContacts = data.contacts.map((c: Contact) => ({...c, id: c.id + Date.now()})); // basic unique ID
                    contacts = [...contacts, ...importedContacts];
                    
                    if (data.categories) {
                        // Merge categories without duplicates
                        data.categories.forEach((importedCat: Category) => {
                            if (!categories.some(c => c.name === importedCat.name)) {
                                categories.push({...importedCat, id: importedCat.id + Date.now()});
                            }
                        });
                    }
                    saveToLocalStorage();
                    renderContacts();
                    populateCategoryDropdowns();
                    renderCategories();
                    updateStats();
                    updateDashboard();
                    addActivity(`Imported ${data.contacts.length} contacts`, '📥');
                    alert('Import successful!');
                } else {
                     alert('Invalid JSON file format.');
                }
            } catch (error) {
                alert('Error importing file: ' + (error as Error).message);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function clearAllData() {
    if (confirm('Are you ABSOLUTELY sure you want to delete ALL your contacts and categories? This cannot be undone!')) {
        if (confirm('This is your final warning. All your data will be permanently deleted. Continue?')) {
            const defaultCats = JSON.parse(JSON.stringify(defaultData.categories));
            contacts = [];
            categories = defaultCats;
            activities = [];
            saveToLocalStorage();
            initializeAppForUser(currentUserId!);
            alert('All your data has been cleared.');
        }
    }
}

async function generateLiteratureReview() {
    const topicInput = document.getElementById('literatureTopic') as HTMLInputElement;
    const topic = topicInput.value.trim();
    const generateBtn = document.getElementById('generateReviewBtn') as HTMLButtonElement;
    const resultContainer = document.getElementById('literatureResultContainer')!;
    const resultEl = document.getElementById('literatureResult')!;

    if (!topic) {
        alert('Please enter a topic.');
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span>⏳</span> Generating...';
    resultContainer.style.display = 'block';
    resultEl.innerHTML = '';
    
    let fullText = '';
    const blinkingCursor = '<span class="blinking-cursor">▋</span>';
    resultEl.innerHTML = blinkingCursor;

    try {
        const prompt = `Generate a comprehensive literature review on the topic of "${topic}". The review should be well-structured, starting with an introduction, followed by a body that discusses key themes, major theories, and important studies. Conclude with a summary of the findings and identify potential gaps in the current research. Please use markdown for formatting, including headings, bold text for key terms, and bullet points for lists.`;

        const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        for await (const chunk of stream) {
            const text = chunk.text;
            fullText += text;
            resultEl.innerHTML = fullText + blinkingCursor;
        }
        resultEl.innerHTML = fullText; // remove cursor when done
        addActivity(`Generated literature review for: ${topic}`, '📜');

    } catch (error) {
        console.error('Error generating literature review:', error);
        resultEl.innerHTML = `An error occurred while generating the review. Please check the console for details.`;
        alert('An error occurred while generating the review.');
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span>✨</span> Generate Review';
    }
}

// Expose functions to global scope for onclick handlers
Object.assign(window, {
    handleLogin, handleRegister, showAuthForm, handleLogout,
    showView, toggleTheme,
    openAddContactModal, closeContactModal, saveContact, editContact, deleteContact, filterContacts,
    openAddCategoryModal, closeCategoryModal, saveCategory, deleteCategory, viewContactsByCategory,
    exportContacts, generateReport,
    backupData, importContacts, clearAllData,
    generateLiteratureReview,
});

// Initialize on page load
window.onload = init;
