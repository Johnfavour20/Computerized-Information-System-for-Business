// --- TYPE DEFINITIONS ---
interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publisher?: string;
    publicationYear?: number;
    genre: string; // genre id
    price: number;
    quantityInStock: number;
    dateAdded: string;
}

interface Genre {
    id: number;
    name: string;
    description: string;
}

interface Sale {
    id: number;
    bookId: number;
    bookTitle: string;
    quantity: number;
    pricePerItem: number;
    totalAmount: number;
    date: string;
}

interface Activity {
    text: string;
    icon: string;
    time: string;
}

// In-memory data for the current user
let books: Book[] = [];
let genres: Genre[] = [];
let sales: Sale[] = [];
let activities: Activity[] = [];

let currentEditId: number | null = null;
let currentSaleBookId: number | null = null;
let currentUserId: number | null = null;

const defaultData = {
    books: [
        { id: 1, title: 'The Midnight Library', author: 'Matt Haig', isbn: '9780525559474', publisher: 'Viking', publicationYear: 2020, genre: '1', price: 15.99, quantityInStock: 25, dateAdded: '2023-01-10T10:00:00.000Z' },
        { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', isbn: '9780593135204', publisher: 'Ballantine Books', publicationYear: 2021, genre: '2', price: 18.50, quantityInStock: 15, dateAdded: '2023-02-15T11:30:00.000Z' },
        { id: 3, title: 'Klara and the Sun', author: 'Kazuo Ishiguro', isbn: '9780593318171', publisher: 'Knopf', publicationYear: 2021, genre: '2', price: 17.00, quantityInStock: 20, dateAdded: '2023-03-20T14:00:00.000Z' },
        { id: 4, title: 'The Vanishing Half', author: 'Brit Bennett', isbn: '9780525536291', publisher: 'Riverhead Books', publicationYear: 2020, genre: '3', price: 16.20, quantityInStock: 30, dateAdded: '2023-04-05T09:00:00.000Z' },
        { id: 5, title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', publisher: 'Ace Books', publicationYear: 1965, genre: '2', price: 10.99, quantityInStock: 50, dateAdded: '2023-05-11T16:45:00.000Z' },
        { id: 6, title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', publisher: 'Avery', publicationYear: 2018, genre: '4', price: 14.99, quantityInStock: 40, dateAdded: '2023-06-01T13:20:00.000Z' },
    ],
    genres: [
        { id: 1, name: 'Contemporary Fiction', description: 'Fiction set in the modern world.' },
        { id: 2, name: 'Science Fiction', description: 'Imaginative concepts such as futuristic science and technology.' },
        { id: 3, name: 'Historical Fiction', description: 'Stories set in the past.' },
        { id: 4, name: 'Self-Help', description: 'Books written with the intention to instruct its readers.' }
    ],
    sales: [],
    activities: []
};

// --- SVG ICONS ---
const svgIcon = (path: string, viewBox = '0 0 24 24') => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const icons = {
    edit: svgIcon(`<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>`),
    trash: svgIcon(`<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>`),
    plus: svgIcon(`<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>`),
    dollar: svgIcon(`<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>`),
    book: svgIcon(`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>`),
    hash: svgIcon(`<line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>`),
    users: svgIcon(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`),
    tag: svgIcon(`<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.586-6.586a2.426 2.426 0 0 0 0-3.432z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle>`),
    export: svgIcon(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>`),
    chart: svgIcon(`<path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20V16"></path>`),
    backup: svgIcon(`<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>`),
    import: svgIcon(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>`),
    activityLog: svgIcon(`<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>`),
    inventory: svgIcon(`<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>`),
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

    const newUser = { id: Date.now(), username, password };
    appData.users.push(newUser);
    appData.userData[newUser.id] = JSON.parse(JSON.stringify(defaultData)); // Deep copy default data

    localStorage.setItem('BSMS_DATA', JSON.stringify(appData));
    
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
    sessionStorage.setItem('BSMS_USER_ID', String(userId));
    initializeAppForUser(userId);
}

function handleLogout() {
    sessionStorage.removeItem('BSMS_USER_ID');
    currentUserId = null;
    books = []; genres = []; sales = []; activities = [];

    const dashboardTitle = document.getElementById('dashboardTitle') as HTMLElement;
    if (dashboardTitle) dashboardTitle.textContent = 'Dashboard';

    document.getElementById('auth-container')!.style.display = 'block';
    (document.querySelector('.container') as HTMLElement)!.style.display = 'none';
    showAuthForm('login');
}

// --- DATA MANAGEMENT ---
function getMasterData() {
    const data = localStorage.getItem('BSMS_DATA');
    if (data) return JSON.parse(data);
    
    const initialData = { users: [], userData: {} };
    localStorage.setItem('BSMS_DATA', JSON.stringify(initialData));
    return initialData;
}

function saveToLocalStorage() {
    if (!currentUserId) return;
    const appData = getMasterData();
    appData.userData[currentUserId] = { books, genres, sales, activities };
    localStorage.setItem('BSMS_DATA', JSON.stringify(appData));
}

function loadFromLocalStorage() {
    if (!currentUserId) return;
    const appData = getMasterData();
    const userData = appData.userData[currentUserId];

    if (userData) {
        books = userData.books || [];
        genres = userData.genres || [];
        sales = userData.sales || [];
        activities = userData.activities || [];
    } else {
        // This case should ideally not happen after registration
        const deepCopy = JSON.parse(JSON.stringify(defaultData));
        books = deepCopy.books;
        genres = deepCopy.genres;
        sales = deepCopy.sales;
        activities = deepCopy.activities;
    }
}

// --- INITIALIZATION & UI ---
function init() {
    const userId = sessionStorage.getItem('BSMS_USER_ID');
    if (userId) {
        initializeAppForUser(parseInt(userId, 10));
    } else {
        document.getElementById('auth-container')!.style.display = 'block';
        (document.querySelector('.container') as HTMLElement)!.style.display = 'none';
    }

    const savedTheme = localStorage.getItem('smeTheme');
    (document.getElementById('darkModeToggle') as HTMLInputElement).checked = savedTheme === 'dark';

    const hamburgerMenu = document.getElementById('hamburgerMenu');
    hamburgerMenu?.addEventListener('click', toggleMobileMenu);

    const sidebar = document.querySelector('.sidebar');
    sidebar?.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.nav-btn')) closeMobileMenu();
    });
}

function initializeAppForUser(userId: number) {
    currentUserId = userId;

    const appData = getMasterData();
    const user = appData.users.find((u: { id: number; }) => u.id === userId);
    const dashboardTitle = document.getElementById('dashboardTitle') as HTMLElement;
    if (user && dashboardTitle) dashboardTitle.textContent = `Welcome, ${user.username}!`;

    document.getElementById('auth-container')!.style.display = 'none';
    (document.querySelector('.container') as HTMLElement)!.style.display = 'flex';

    loadFromLocalStorage();
    populateGenreDropdowns();
    renderBooks();
    renderGenres();
    updateStats();
    updateDashboard();
    showView('dashboard');
}

function toggleMobileMenu() { document.body.classList.toggle('sidebar-open'); }
function closeMobileMenu() { document.body.classList.remove('sidebar-open'); }

function showView(viewId: string) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(viewId)!.classList.add('active');
    document.querySelector(`.nav-btn[data-view='${viewId}']`)?.classList.add('active');
}

function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark');
    const isDarkMode = root.classList.contains('dark');
    localStorage.setItem('smeTheme', isDarkMode ? 'dark' : 'light');
}

function viewBooksByGenre(genreId: number) {
    (document.getElementById('genreFilter') as HTMLSelectElement).value = String(genreId);
    showView('books');
    filterBooks();
}

// Book functions
function openAddBookModal() {
    currentEditId = null;
    document.getElementById('modalTitle')!.textContent = 'Add New Book';
    (document.getElementById('bookForm') as HTMLFormElement).reset();
    (document.getElementById('bookId') as HTMLInputElement).value = '';
    document.getElementById('bookModal')!.classList.add('active');
}

function closeBookModal() { document.getElementById('bookModal')!.classList.remove('active'); }

function editBook(id: number) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    currentEditId = id;
    document.getElementById('modalTitle')!.textContent = 'Edit Book';
    (document.getElementById('bookId') as HTMLInputElement).value = String(book.id);
    (document.getElementById('title') as HTMLInputElement).value = book.title;
    (document.getElementById('author') as HTMLInputElement).value = book.author;
    (document.getElementById('isbn') as HTMLInputElement).value = book.isbn || '';
    (document.getElementById('publisher') as HTMLInputElement).value = book.publisher || '';
    (document.getElementById('publicationYear') as HTMLInputElement).value = String(book.publicationYear || '');
    (document.getElementById('genre') as HTMLSelectElement).value = book.genre;
    (document.getElementById('price') as HTMLInputElement).value = String(book.price);
    (document.getElementById('quantityInStock') as HTMLInputElement).value = String(book.quantityInStock);
    
    document.getElementById('bookModal')!.classList.add('active');
}

function saveBook() {
    const title = (document.getElementById('title') as HTMLInputElement).value.trim();
    const author = (document.getElementById('author') as HTMLInputElement).value.trim();
    const genre = (document.getElementById('genre') as HTMLSelectElement).value;
    const price = (document.getElementById('price') as HTMLInputElement).value;
    const quantity = (document.getElementById('quantityInStock') as HTMLInputElement).value;

    if (!title || !author || !genre || price === '' || quantity === '') {
        alert('Please fill in all required fields');
        return;
    }

    const book: Book = {
        id: currentEditId || Date.now(),
        title,
        author,
        isbn: (document.getElementById('isbn') as HTMLInputElement).value.trim(),
        publisher: (document.getElementById('publisher') as HTMLInputElement).value.trim(),
        publicationYear: Number((document.getElementById('publicationYear') as HTMLInputElement).value),
        genre,
        price: parseFloat(price),
        quantityInStock: parseInt(quantity, 10),
        dateAdded: currentEditId ? books.find(b => b.id === currentEditId)!.dateAdded : new Date().toISOString()
    };

    if (currentEditId) {
        const index = books.findIndex(b => b.id === currentEditId);
        books[index] = book;
        addActivity(`Updated book: ${title}`, icons.edit);
    } else {
        books.push(book);
        addActivity(`Added new book: ${title}`, icons.plus);
    }

    saveToLocalStorage();
    renderBooks(); updateStats(); updateDashboard();
    closeBookModal();
}

function deleteBook(id: number) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
        books = books.filter(b => b.id !== id);
        addActivity(`Deleted book: ${book.title}`, icons.trash);
        saveToLocalStorage();
        renderBooks(); updateStats(); updateDashboard();
    }
}

function renderBooks() {
    const grid = document.getElementById('booksGrid')!;
    const emptyState = document.getElementById('emptyState')!;
    
    let filteredBooks = [...books];
    const searchTerm = (document.getElementById('searchInput') as HTMLInputElement)?.value.toLowerCase() || '';
    const genreFilter = (document.getElementById('genreFilter') as HTMLSelectElement)?.value || '';
    const sortFilter = (document.getElementById('sortFilter') as HTMLSelectElement)?.value || 'title';

    if (searchTerm) {
        filteredBooks = filteredBooks.filter(b => 
            b.title.toLowerCase().includes(searchTerm) ||
            b.author.toLowerCase().includes(searchTerm) ||
            b.isbn.includes(searchTerm)
        );
    }

    if (genreFilter) filteredBooks = filteredBooks.filter(b => b.genre == genreFilter);
    
    if (sortFilter === 'title') filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortFilter === 'author') filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
    else if (sortFilter === 'recent') filteredBooks.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

    grid.style.display = filteredBooks.length > 0 ? 'grid' : 'none';
    emptyState.style.display = filteredBooks.length === 0 ? 'block' : 'none';

    grid.innerHTML = filteredBooks.map(book => {
        const genreName = genres.find(g => g.id == Number(book.genre))?.name || 'Uncategorized';
        const stockClass = book.quantityInStock === 0 ? 'color: var(--danger);' : book.quantityInStock < 10 ? 'color: var(--warning);' : '';
        return `
            <div class="card">
                <div class="card-header">
                    <div style="display: flex; align-items: center;">
                        <div class="card-avatar">${icons.book}</div>
                        <div class="card-info">
                            <div class="card-title">${book.title}</div>
                            <div class="card-subtitle">${book.author}</div>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="icon-btn" onclick="editBook(${book.id})" title="Edit">${icons.edit}</button>
                        <button class="icon-btn" onclick="deleteBook(${book.id})" title="Delete">${icons.trash}</button>
                    </div>
                </div>
                <div class="card-details">
                    ${book.isbn ? `<div class="detail-row"><span class="icon">${icons.hash}</span><span>ISBN: ${book.isbn}</span></div>` : ''}
                    <div class="detail-row"><span class="icon">${icons.dollar}</span><span>Price: $${book.price.toFixed(2)}</span></div>
                    <div class="detail-row" style="${stockClass}"><span class="icon">${icons.inventory}</span><span>In Stock: ${book.quantityInStock}</span></div>
                    <span class="badge">${genreName}</span>
                </div>
                <div class="card-footer">
                    <button class="btn btn-secondary" style="width: 100%;" onclick="openLogSaleModal(${book.id})" ${book.quantityInStock === 0 ? 'disabled' : ''}>Log Sale</button>
                </div>
            </div>
        `;
    }).join('');
}

function filterBooks() { renderBooks(); }

// Genre functions
function openAddGenreModal() {
    (document.getElementById('genreForm') as HTMLFormElement).reset();
    document.getElementById('genreModal')!.classList.add('active');
}

function closeGenreModal() { document.getElementById('genreModal')!.classList.remove('active'); }

function saveGenre() {
    const name = (document.getElementById('genreName') as HTMLInputElement).value.trim();
    if (!name) { alert('Please enter a genre name'); return; }

    const genre: Genre = { 
        id: Date.now(), 
        name, 
        description: (document.getElementById('genreDesc') as HTMLTextAreaElement).value.trim() 
    };

    genres.push(genre);
    addActivity(`Added new genre: ${name}`, icons.tag);
    saveToLocalStorage();
    populateGenreDropdowns(); renderGenres(); updateStats();
    closeGenreModal();
}

function deleteGenre(id: number) {
    const genre = genres.find(g => g.id === id);
    if (!genre) return;

    if (books.some(b => b.genre == String(id))) {
        alert(`Cannot delete this genre. ${books.filter(b => b.genre == String(id)).length} book(s) are using it.`);
        return;
    }

    if (confirm(`Are you sure you want to delete the genre "${genre.name}"?`)) {
        genres = genres.filter(g => g.id !== id);
        addActivity(`Deleted genre: ${genre.name}`, icons.trash);
        saveToLocalStorage();
        populateGenreDropdowns(); renderGenres(); updateStats();
    }
}

function populateGenreDropdowns() {
    const genreSelect = document.getElementById('genre')!;
    const genreFilter = document.getElementById('genreFilter')!;
    const options = genres.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    genreSelect.innerHTML = '<option value="">Select Genre</option>' + options;
    genreFilter.innerHTML = '<option value="">All Genres</option>' + options;
}

function renderGenres() {
    const grid = document.getElementById('genresGrid')!;
    grid.innerHTML = genres.map(genre => {
        const bookCount = books.filter(b => b.genre == String(genre.id)).length;
        return `
            <div class="card" onclick="viewBooksByGenre(${genre.id})">
                <div class="card-header">
                    <div style="display: flex; align-items: center;">
                        <div class="card-avatar">${icons.tag}</div>
                        <div class="card-info">
                            <div class="card-title">${genre.name}</div>
                            ${genre.description ? `<div class="card-subtitle">${genre.description}</div>` : ''}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="icon-btn" onclick="deleteGenre(${genre.id}); event.stopPropagation();" title="Delete">${icons.trash}</button>
                    </div>
                </div>
                <div class="card-details">
                    <div class="detail-row"><span class="icon">${icons.book}</span><span>${bookCount} book${bookCount !== 1 ? 's' : ''}</span></div>
                </div>
            </div>
        `;
    }).join('');
}

// Sale functions
function openLogSaleModal(bookId: number) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    currentSaleBookId = bookId;
    document.getElementById('logSaleModalTitle')!.textContent = `Log Sale`;
    document.getElementById('logSaleBookTitle')!.textContent = `"${book.title}"`;
    const quantityInput = document.getElementById('saleQuantity') as HTMLInputElement;
    quantityInput.value = '1';
    quantityInput.max = String(book.quantityInStock);
    
    const updateTotal = () => {
        const quantity = parseInt(quantityInput.value, 10) || 0;
        const total = quantity * book.price;
        document.getElementById('logSaleTotal')!.textContent = `$${total.toFixed(2)}`;
    };
    
    quantityInput.oninput = updateTotal;
    updateTotal();
    
    document.getElementById('logSaleModal')!.classList.add('active');
}

function closeLogSaleModal() {
    document.getElementById('logSaleModal')!.classList.remove('active');
    currentSaleBookId = null;
}

function saveSale() {
    if (!currentSaleBookId) return;
    const book = books.find(b => b.id === currentSaleBookId);
    if (!book) return;

    const quantityInput = document.getElementById('saleQuantity') as HTMLInputElement;
    const quantity = parseInt(quantityInput.value, 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }
    if (quantity > book.quantityInStock) {
        alert(`Cannot sell ${quantity} copies. Only ${book.quantityInStock} in stock.`);
        return;
    }

    const sale: Sale = {
        id: Date.now(),
        bookId: book.id,
        bookTitle: book.title,
        quantity,
        pricePerItem: book.price,
        totalAmount: quantity * book.price,
        date: new Date().toISOString()
    };

    sales.push(sale);
    book.quantityInStock -= quantity;
    
    addActivity(`Sold ${quantity} of "${book.title}"`, icons.dollar);
    saveToLocalStorage();
    renderBooks(); updateStats(); updateDashboard();
    closeLogSaleModal();
}

// Stats and Dashboard
function updateStats() {
    document.getElementById('totalBooks')!.textContent = String(books.length);
    document.getElementById('totalAuthors')!.textContent = String([...new Set(books.map(b => b.author))].length);
    document.getElementById('totalGenres')!.textContent = String(genres.length);
}

function updateDashboard() {
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const unitsSold = sales.reduce((sum, s) => sum + s.quantity, 0);
    const inventoryValue = books.reduce((sum, b) => sum + (b.price * b.quantityInStock), 0);
    
    document.getElementById('dashTotalBooks')!.textContent = String(books.length);
    document.getElementById('dashTotalRevenue')!.textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('dashUnitsSold')!.textContent = String(unitsSold);
    document.getElementById('dashInventoryValue')!.textContent = `$${inventoryValue.toFixed(2)}`;
    
    // Reports page stats
    document.getElementById('reportTotalBooks')!.textContent = String(books.length);
    document.getElementById('reportTotalRevenue')!.textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('reportUnitsSold')!.textContent = String(unitsSold);
    
    const salesByGenre: {[key: string]: number} = {};
    sales.forEach(sale => {
        const book = books.find(b => b.id === sale.bookId);
        if (book) {
            const genreName = genres.find(g => g.id == Number(book.genre))?.name || 'Uncategorized';
            salesByGenre[genreName] = (salesByGenre[genreName] || 0) + sale.quantity;
        }
    });
    const topGenre = Object.keys(salesByGenre).length > 0 
        ? Object.entries(salesByGenre).sort((a, b) => b[1] - a[1])[0][0] 
        : '-';
    document.getElementById('reportTopGenre')!.textContent = topGenre;

    renderActivity();
}

// Activity tracking
function addActivity(text: string, icon: string) {
    activities.unshift({ text, icon, time: new Date().toLocaleString() });
    if (activities.length > 10) activities.pop();
    saveToLocalStorage();
    renderActivity();
}

function renderActivity() {
    const list = document.getElementById('activityList')!;
    if (!activities || activities.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-3);"><div style="font-size: 48px; margin-bottom: 10px;">${icons.activityLog}</div><div>No recent activity</div></div>`;
        return;
    }
    list.innerHTML = activities.map(act => `
        <div class="activity-item">
            <div class="activity-icon">${act.icon}</div>
            <div class="activity-content">
                <div class="activity-text">${act.text}</div>
                <div class="activity-time">${act.time}</div>
            </div>
        </div>
    `).join('');
}

// Export, Import, Settings functions
function exportBooks() {
    if (books.length === 0) { alert('No books to export'); return; }
    const headers = ['Title', 'Author', 'ISBN', 'Publisher', 'Publication Year', 'Genre', 'Price', 'Quantity in Stock'];
    const rows = books.map(book => {
        const genreName = genres.find(g => g.id == Number(book.genre))?.name || '';
        return [book.title, book.author, book.isbn, book.publisher, book.publicationYear, genreName, book.price, book.quantityInStock];
    });
    let csvContent = headers.join(',') + '\n' + rows.map(r => r.map(f => `"${String(f || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    downloadFile(csvContent, 'books_export.csv', 'text/csv;charset=utf-8;');
    addActivity(`Exported ${books.length} books`, icons.export);
}

function generateReport() {
    if (sales.length === 0) { alert('No sales to report'); return; }
    const headers = ['Sale ID', 'Date', 'Book Title', 'Quantity', 'Price Per Item', 'Total Amount'];
    const rows = sales.map(s => [s.id, new Date(s.date).toLocaleString(), s.bookTitle, s.quantity, s.pricePerItem, s.totalAmount]);
    let csvContent = headers.join(',') + '\n' + rows.map(r => r.map(f => `"${f}"`).join(',')).join('\n');
    downloadFile(csvContent, 'sales_report.csv', 'text/csv;charset=utf-8;');
    addActivity('Generated sales report', icons.chart);
}

function backupData() {
    const backup = { books, genres, sales, exportDate: new Date().toISOString() };
    const dataStr = JSON.stringify(backup, null, 2);
    downloadFile(dataStr, `bsms_backup_${Date.now()}.json`, 'application/json');
    addActivity('Created data backup', icons.backup);
    alert('Backup created successfully!');
}

function downloadFile(content: string, filename: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target!.result as string);
                if (confirm('This will overwrite existing data. Are you sure you want to import?')) {
                    books = data.books || [];
                    genres = data.genres || [];
                    sales = data.sales || [];
                    saveToLocalStorage();
                    initializeAppForUser(currentUserId!);
                    addActivity(`Imported data from backup`, icons.import);
                    alert('Import successful!');
                }
            } catch (error) { alert('Error importing file: ' + (error as Error).message); }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearAllData() {
    if (confirm('ARE YOU SURE you want to delete ALL data? This cannot be undone.')) {
        const confirmation = prompt('To confirm, please type "DELETE" below.');
        if (confirmation === 'DELETE') {
            const defaultCopy = JSON.parse(JSON.stringify(defaultData));
            books = defaultCopy.books;
            genres = defaultCopy.genres;
            sales = defaultCopy.sales;
            activities = [];
            saveToLocalStorage();
            initializeAppForUser(currentUserId!);
            alert('All your data has been cleared.');
        } else {
            alert('Deletion cancelled.');
        }
    }
}

Object.assign(window, {
    handleLogin, handleRegister, showAuthForm, handleLogout,
    showView, toggleTheme,
    openAddBookModal, closeBookModal, saveBook, editBook, deleteBook, filterBooks,
    openAddGenreModal, closeGenreModal, saveGenre, deleteGenre, viewBooksByGenre,
    openLogSaleModal, closeLogSaleModal, saveSale,
    exportBooks, generateReport,
    backupData, importData, clearAllData,
});

window.onload = init;