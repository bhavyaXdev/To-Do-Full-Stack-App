# Task Manager - CRUD

A sleek, responsive, and fully functional Task Management (To-Do) application built with React, Vite, and Tailwind CSS. This application demonstrates core CRUD (Create, Read, Update, Delete) operations with seamless local data persistence.

## 🚀 Features

- **Create:** Add new tasks easily with a clean input form.
- **Read:** View your existing tasks in a beautifully structured, dynamically scrollable list.
- **Update:** Inline editing capability to modify existing tasks on the fly.
- **Delete:** Remove tasks cleanly when they are no longer needed.
- **Data Persistence:** Tasks are automatically saved in your browser's `localStorage` so they persist across page reloads.
- **Intelligent Responsive Design:** 
  - Carefully crafted layout bounds (`h-[60vh] min-h-[400px] max-h-[600px]`) that scale elegantly across mobile phones, tablets, and large desktop monitors.
  - Dynamically collapsing Action buttons and spacing to keep the form flawless on ultra-small mobile screens.
  - Custom elegant scrollbar styling for the task list.
  - Informative empty states and smooth interactive hover effects.

## 💻 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation

1. Clone or download the repository to your local machine.
2. Navigate into the project's root folder:
   ```bash
   cd "Learning Basic Crud"
   ```
3. Install the project dependencies:
   ```bash
   npm install
   ```

### Running the Application

To fire up the local development server, run:

```bash
npm run dev
```

Depending on your Vite configuration, the browser will likely open automatically (usually at `http://localhost:5173`) where you can view and test the application.

## 📁 Key Files

- [src/App.jsx](file:///d:/PRACTICE/Learning%20Basic%20Crud/src/App.jsx): The heart of the application. Contains all state management, LocalStorage syncing, and the JSX markup for the interface.
- [src/index.css](file:///d:/PRACTICE/Learning%20Basic%20Crud/src/index.css): Global baseline styles and Tailwind directives.

## 🎨 Design Highlights
The app showcases a stunning, highly polished "dark mode" aesthetic. By utilizing Tailwind's powerful utility classes (`bg-neutral-900`, `border-blue-200/30`, etc.), it projects a premium feel with subtle "glassmorphic" shadowing, rounded edges, and crisp, lightweight SVG icons imported from Lucide.



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
