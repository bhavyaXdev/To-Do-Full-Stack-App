# ✨ Antigravity Task Manager

A premium, state-of-the-art Multi-User To-Do application built with a modern **MERN** stack and a focus on **Visual Excellence**. This application isn't just a list; it's a sleek, glassmorphic productivity dashboard designed for precision and security.

---

## 🎨 Premium UI & UX

Our project prioritizes high-end aesthetics and fluid user interactions.

- **Glassmorphism Design**: Experience a translucent, frosted-glass interface with vibrant backdrops and dynamic radial glows.
- **Micro-Animations**: Features smooth entry transitions (`fade-in`), shaking error feedback, and pulsing background elements that make the app feel alive.
- **Precision Dashboard**: A clean, focused view showing exactly 3 tasks on large screens to keep you concentrated, while retaining a smooth internal scroll for longer lists.
- **Mobile-Responsive**: Fully optimized for all devices, ensuring the premium feel remains consistent from a 4K monitor down to a small smartphone screen.
- **Modern Typography**: Uses the 'Inter' font family for a sleek, contemporary, and highly legible interface.

---

## 🚀 Key Features

- **Secure Authentication**: Robust Sign-in and Registration system powered by **JWT (JSON Web Tokens)** and **BcryptJS** for secure password hashing.
- **Data Isolation**: Using a **Single-Collection Architecture**, all user tasks are stored as subdocuments within their own record, ensuring that your data is private and never accessible to others.
- **Show/Hide Password**: Integrated visibility toggles on both login and signup screens to ensure you always enter your credentials with confidence.
- **Real-time Password Validation**: A visual `ShieldCheck` indicator provides instant feedback as you type, ensuring your password meets the 6-character security minimum.
- **Interactive Task Management**:
    - **Create**: Instantly add new tasks with a keyboard-friendly input.
    - **Read**: Quick glance at "Missing" and "Done" status counts.
    - **Update**: Edit existing tasks inline or toggle completion with a single click.
    - **Delete**: Remove tasks with smooth transition feedback.
- **Premium Checkboxes**: Upgraded circular toggles that feature a sleek fill-animation and glow when completed, moving away from generic browser defaults.

---

## 🛠 Tech Stack

### Frontend
- **React.js**: For a dynamic, high-performance user interface.
- **Tailwind CSS**: For custom, precision glass-effect styling.
- **Lucide React**: For beautiful, modern iconography.
- **React Router**: For seamless navigation and protected routes.

### Backend
- **Node.js & Express**: A fast and scalable server architecture.
- **MongoDB & Mongoose**: Flexible, subdocument-based data modeling for high-performance retrieval.
- **JWT**: Industry-standard secure user sessions.
- **Environment Driven**: Fully configured for security with `.env` variable support.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v16.x or higher)
- MongoDB (Local or Atlas)

### 2. Backend Setup
1. `cd Backend`
2. `npm install`
3. Create a `.env` file with `MONGODB_URI` and `JWT_SECRET`.
4. `npm run dev`

### 3. Frontend Setup
1. `cd Frontend`
2. `npm install`
3. `npm run dev`

---

## 🔒 Security
Your data is our priority. We use:
1. **Password Hashing**: We never store plain-text passwords.
2. **JWT Tokens**: All API requests are protected and require a valid session token.
3. **Subdocument Scoping**: All database operations are restricted to the authenticated user's own document.

---

*Built with passion for productivity and aesthetics by Antigravity.*
