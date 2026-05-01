# TaskFlow

A full-stack task management application I built to handle project tracking and task delegation. It uses a React frontend with a Node.js/Express backend, backed by MySQL.

## Features

- **RBAC (Role-Based Access Control):** Admins can manage projects, users, and all tasks. Members can only update the statuses of tasks assigned to them.
- **Project Tracking:** Quick progress bars showing completion rates for individual projects.
- **Task Filtering:** Easily sort tasks by assignee, project, status, or check for overdue items.
- **Dashboard:** A clean overview of metrics (total tasks, pending, completed, overdue).

## Tech Stack

- **Client:** React, Vite, React Router, Tailwind CSS
- **Server:** Node.js, Express
- **Database:** Prisma ORM, MySQL
- **Auth:** JWT and bcrypt

---

## Running Locally

To get this running on your local machine, you'll need Node.js and a MySQL database (I usually use a free Railway or local instance for testing).

### 1. Clone & Install
```bash
git clone https://github.com/rohangoswami9501/task-manager.git
cd task-manager

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="mysql://root:password@localhost:3306/taskflow"
JWT_SECRET="dev_secret_key_change_in_prod"
FRONTEND_URL="http://localhost:5173"
```

Create a `.env` in the `frontend` directory:
```env
VITE_API_URL="http://localhost:5000"
```

### 3. Database Setup

Make sure your MySQL database is running and accessible, then sync the Prisma schema:
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Start the Dev Servers

Run the backend:
```bash
cd backend
npm start
```

Run the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The app should now be running on `http://localhost:5173`. 

---
*Note: To test admin features locally, you can create a user normally through the UI signup flow, then manually change their `role` to `ADMIN` in your MySQL GUI (like TablePlus or DBeaver).*
