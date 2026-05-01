# TaskFlow - Project Management System

TaskFlow is a modern, SaaS-style full-stack application designed for managing projects and tasks seamlessly. It includes role-based access control (Admin/Member), detailed status tracking, filtering, dynamic progress bars, and a fully functional dashboard.

## Tech Stack
- **Frontend:** React, Vite, React Router v6, Tailwind CSS v4, Axios
- **Backend:** Node.js, Express.js, Prisma ORM, JSON Web Tokens (JWT)
- **Database:** MySQL

## Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MySQL database (Local or Hosted)

### 2. Environment Variables
Create a `.env` file inside the `backend` folder:
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_secure_random_string_here"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

Create a `.env` file inside the `frontend` folder:
```env
VITE_API_URL="http://localhost:5000"
```

### 3. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm start
```
*(The backend server will run on `http://localhost:5000`)*

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will run on `http://localhost:5173`)*

## Features
- **Authentication:** Secure login and signup with JWT session management.
- **Role-Based Access Control:** `ADMIN` accounts can create, edit, and delete projects/tasks. `MEMBER` accounts can only view projects and update the status of tasks directly assigned to them.
- **Interactive Dashboard:** Live counts of pending, in-progress, completed, and overdue tasks.
- **Projects Page:** View projects alongside their progress bar automatically calculated from task completion statuses.
- **Tasks Page:** Dynamic table with filtering (by Project, Status, Assignee, Overdue) and status updates.
