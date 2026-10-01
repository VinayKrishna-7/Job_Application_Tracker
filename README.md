# EasyTrack 🚀

> **Track every application. Land your next opportunity.**

EasyTrack is a modern, full-stack Job Application Tracker designed to replace messy spreadsheets with an intuitive, unified workspace. It empowers job seekers to manage their entire career search lifecycle—from initial discovery to final offer letters.

---

## ✨ Features

- **📋 Visual Kanban Board:** Seamless drag-and-drop workflow tracking applications across every stage (Wishlist, Applied, Screening, Interview, Technical Round, Offer, Rejected, Withdrawn).
- **📊 Real-Time Analytics:** Interactive metrics and charts tracking application cadence, status distribution, and interview conversion rates.
- **📅 Multi-Round Interview Tracker:** Log coding tests, system design, and behavioral interviews with notes, dates, and interviewer contacts.
- **⏰ Smart Follow-up Reminders:** Automatically groups follow-ups into *Overdue*, *Due Today*, and *Upcoming* so you never ghost a recruiter.
- **📄 Resume & Document Attachment:** Attach tailored resumes and cover letters directly to each application.
- **🌓 Light & Dark Theme:** Polished SaaS interface with system-preference detection and instant theme toggling.
- **🔒 Enterprise-Grade Security:** HTTP-only authentication cookies, bcrypt password hashing, data validation with Zod, and strict tenant data isolation.

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
