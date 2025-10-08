# Computerized Information System for Business

A modern, responsive, and offline-first computerized information system for businesses to manage contacts, categories, and generate reports. This application is built with vanilla JavaScript, HTML, and CSS, and it runs entirely in the browser using `localStorage` for data persistence.

![Computerized Information System for Business Screenshot](https://storage.googleapis.com/proudcity/mebanenc/uploads/2020/12/Directory-Management.png)

## ✨ Features

-   **User Authentication:** Secure registration and login system for multiple users. Each user has their own private data.
-   **Dashboard:** At-a-glance overview of key metrics like total contacts, new contacts this month, and counts for specific categories.
-   **Contact Management:** Full CRUD (Create, Read, Update, Delete) functionality for contacts.
-   **Category Management:** Organize contacts into customizable categories.
-   **Powerful Search & Filtering:** Quickly find contacts with a real-time search and filter by category.
-   **Sorting Options:** Sort contacts by name, date added, or organization.
-   **Reporting & Analytics:** Generate simple text-based reports on your contact data.
-   **Data Export:** Export your entire contact list to a CSV file.
-   **Data Management:**
    -   **Backup:** Create a JSON backup of all your data.
    -   **Import:** Import contacts from a JSON backup file.
    -   **Data Wipe:** Securely clear all application data.
-   **Dark/Light Mode:** Switch between a light and dark theme for comfortable viewing.
-   **Responsive Design:** A seamless experience on desktop, tablet, and mobile devices.
-   **Offline First:** All data is stored in your browser's `localStorage`, so the app works without an internet connection.

## 🚀 Getting Started

This is a pure client-side application. No build process or server is needed.

1.  Clone this repository or download the source code.
2.  Open the `index.html` file in your favorite web browser.

That's it! You can start managing your contacts right away.

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

## 🔮 Future Improvements

This project serves as a strong foundation. Here are some potential areas for enhancement:

-   **Framework Migration:** Refactor the application using a modern frontend framework like React, Vue, or Svelte for better state management, component reusability, and maintainability.
-   **Advanced Storage:** Migrate from `localStorage` to IndexedDB to handle larger datasets more efficiently and overcome `localStorage` size limitations.
-   **Backend Integration:** Add an optional backend service (e.g., using Node.js, Firebase, or Supabase) to enable data synchronization across multiple devices and user collaboration.
-   **Enhanced Reporting:** Integrate charting libraries (e.g., Chart.js or D3.js) to visualize data and create more insightful reports.
-   **Improved Import/Export:** Add support for importing from CSV files and exporting to other formats like PDF.
-   **Testing:** Introduce a testing suite with unit tests (e.g., using Jest or Vitest) and end-to-end tests (e.g., using Cypress or Playwright) to ensure application stability.
-   **PWA Conversion:** Turn the application into a Progressive Web App (PWA) for a more native-like experience, including offline capabilities and home screen installation.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is open source. Feel free to use and modify it.