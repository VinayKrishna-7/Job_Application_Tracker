# EasyTrack 🚀

An easy-to-use web application to track and organize your job applications, interview stages, notes, and offers in one place.

---

## ✨ Key Features

- **📋 Kanban Board:** Drag and drop applications across hiring stages (Applied, Interview, Offer, etc.).
- **📊 Analytics Dashboard:** Track application numbers, interview rates, and search progress with clean charts.
- **📅 Interview Tracking:** Log interview rounds, dates, interviewer details, and preparation notes.
- **⏰ Follow-up Reminders:** Keep track of upcoming and overdue follow-ups with recruiters.
- **📄 Resume Attachments:** Upload and manage resumes and cover letters directly with each application.
- **🌓 Dark & Light Mode:** Clean, responsive design with light and dark mode support.
- **🔒 Secure Authentication:** User accounts protected with JWT authentication and secure cookies.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **State & Data Fetching:** TanStack React Query
- **Routing:** React Router v6
- **Forms & Validation:** React Hook Form + Zod
- **Visuals & Charts:** Lucide React Icons + Recharts

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT stored in secure HTTP-only cookies
- **Security:** Helmet, CORS, Rate Limiting, bcryptjs
- **Storage:** Pluggable storage architecture (Local Disk & Cloudinary ready)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **MongoDB** (Local instance or MongoDB Atlas URI)

### 2. Installation
Install dependencies for both frontend and backend:

```bash
npm run install:all
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory (or copy from `server/.env.example`):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/easytrack
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
CLIENT_URL=http://localhost:5173
```

### 4. (Optional) Seed Demo Data
Populate the database with sample applications, interviews, and metrics:

```bash
npm run seed
```

### 5. Run the Application
Start both the Express backend and Vite frontend concurrently:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing

Run automated test suites across both server and client:

```bash
npm test
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
