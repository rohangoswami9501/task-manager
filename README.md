# 🚀 TaskFlow: Multi-Tenant SaaS Task Management

A professional, full-stack multi-tenant task management application designed for organizations. Built to handle project tracking, task delegation, and role-based access across completely isolated organizational workspaces.

## ✨ Key Features

- **🏢 Multi-Tenant Architecture:** True SaaS design. Users create or join "Organizations". Data is strictly isolated—members of one organization can never access projects or tasks belonging to another.
- **🔐 Intelligent Role-Based Access Control (RBAC):** 
  - **Admins:** Can create projects, delegate tasks, delete content, and oversee all organization activity.
  - **Members:** Can view organization projects and update the status of tasks specifically assigned to them.
- **⚡ Bootstrap Admin Initialization:** The first user to register a new organization automatically becomes its Admin, eliminating the need for manual database manipulation to get started.
- **📊 Interactive Dashboard:** A comprehensive overview of organization metrics, including total tasks, in-progress work, completed items, and critical overdue warnings.
- **🎯 Advanced Task Management:** Filter tasks by project, assignee, or status. Visually track project completion rates with dynamic progress bars.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS (Responsive, modern UI)
- **Backend:** Node.js, Express.js (RESTful API architecture)
- **Database:** MySQL, Prisma ORM (Type-safe database operations)
- **Authentication:** JWT (JSON Web Tokens) & bcrypt (Secure password hashing)
- **Deployment Strategy:** Configured for seamless cloud deployment (e.g., Railway)

---

## 💻 Running Locally

To get this application running on your local machine, ensure you have **Node.js** installed and a **MySQL** database running.

### 1. Clone & Install Dependencies

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

### 2. Environment Configuration

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DATABASE_URL="mysql://username:password@localhost:3306/taskflow"
JWT_SECRET="your_super_secret_jwt_key_here"
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL="http://localhost:5000"
```

### 3. Database Setup

Ensure your MySQL database is running and the database specified in your `DATABASE_URL` exists. Then, push the schema to the database:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Start the Application

Start the backend server:
```bash
cd backend
npm start
```

Start the frontend development server (in a new terminal window):
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`. 

---

## 🚀 Getting Started (Testing Admin Features)

Testing the administrative features locally is seamless:
1. Open the application and navigate to **Sign Up**.
2. Enter a **new** Organization Name along with your user details.
3. Because you are the creator of this new organization, the system will automatically grant you **ADMIN** privileges.
4. You can now create projects, and when colleagues sign up using your exact Organization Name, they will join as **MEMBERs** whom you can assign tasks to!

---
*Built for efficient, secure, and scalable team collaboration.*
