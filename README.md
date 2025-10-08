# Book Sales Management System

A modern, responsive, and offline-first system for small businesses to manage book inventory, sales, and genres. This application is built with vanilla TypeScript, HTML, and CSS, and it runs entirely in the browser using `localStorage` for data persistence.

## ✨ Features

-   **User Authentication:** Secure registration and login system for multiple users. Each user has their own private data.
-   **Sales Dashboard:** At-a-glance overview of key metrics like total books, total revenue, units sold, and inventory value.
-   **Book Management:** Full CRUD (Create, Read, Update, Delete) functionality for your book inventory.
-   **Genre Management:** Organize books into customizable genres.
-   **Sales Tracking:** Easily log sales for any book in your inventory, which automatically updates stock levels.
-   **Powerful Search & Filtering:** Quickly find books with a real-time search (by title, author, or ISBN) and filter by genre.
-   **Sorting Options:** Sort your book list by title, author, or date added.
-   **Reporting & Analytics:** View key sales metrics, visualize sales with dynamic charts, and generate a full sales report in CSV format.
-   **Data Export:** Export your entire book list to a CSV file.
-   **Data Management:**
    -   **Backup:** Create a full JSON backup of all your data (books, genres, sales).
    -   **Import:** Restore your data from a JSON backup file.
    -   **Data Wipe:** Securely clear all application data for a fresh start.
-   **Dark/Light Mode:** Switch between a light and dark theme for comfortable viewing.
-   **Responsive Design:** A seamless experience on desktop, tablet, and mobile devices.
-   **Offline First:** All data is stored in your browser's `localStorage`, so the app works without an internet connection.

## 🚀 Getting Started

This is a pure client-side application. No build process or server is needed.

1.  Clone this repository or download the source code.
2.  Open the `index.html` file in your favorite web browser.

That's it! You can register a new user and start managing your book sales right away.

## 🛠️ Tech Stack

-   **HTML5**
-   **CSS3** (with CSS variables for theming)
-   **TypeScript** (in `index.tsx` for all application logic)
-   **Browser `localStorage`** for data persistence.

## 📂 File Structure

The project has been structured to separate concerns, with HTML/CSS in `index.html` and all application logic in `index.tsx`.

```
.
├── index.html       # Main application file (HTML structure and CSS)
├── index.tsx        # Main application logic (TypeScript)
└── metadata.json    # Application metadata
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source. Feel free to use and modify it.
