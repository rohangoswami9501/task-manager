# 🚀 TaskFlow: Multi-Tenant SaaS Platform

![Live Deployment](https://img.shields.io/badge/Deployed_on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React_Vite-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

TaskFlow is a production-ready, full-stack multi-tenant task management application. Currently deployed and fully hosted on **Railway**, it provides secure, isolated workspaces for different organizations to manage their projects and tasks efficiently.

## 🌐 Live Production Features

This application is built with a true Software-as-a-Service (SaaS) architecture, running live in the cloud:

- **🏢 Multi-Tenant Workspaces:** Every organization has its own isolated bubble. Users from "Company A" will never see the projects, tasks, or members of "Company B", even though they share the same underlying database infrastructure.
- **⚡ Automated Admin Bootstrapping:** When a user registers a completely new "Organization Name", the system instantly provisions a new workspace and grants them **ADMIN** rights. No manual database configuration is required.
- **🔐 Dynamic RBAC (Role-Based Access Control):** 
  - **Admins:** Have full CRUD (Create, Read, Update, Delete) permissions over projects and tasks within their organization.
  - **Members:** Can view organization-wide projects but are restricted to updating the status of tasks specifically assigned to them.
- **📊 Real-time Dashboard:** A dynamic analytics dashboard tracking total tasks, pending items, completed work, and critical overdue warnings.
- **☁️ Cloud-Native Deployment:** Fully integrated with Railway. Automatic Prisma schema pushes run during the CI/CD build phase, ensuring the MySQL database is always perfectly synced with the backend models.

## 🛠️ Production Tech Stack

- **Cloud Infrastructure:** Railway (Hosting both the Node.js API and React Frontend)
- **Database:** Railway MySQL Plugin
- **Backend API:** Node.js, Express.js
- **ORM:** Prisma (Type-safe database operations and automated schema migrations)
- **Frontend:** React, Vite, Tailwind CSS
- **Security:** JWT (JSON Web Tokens) for stateless authentication & bcrypt for password hashing.

---

## 🚦 How to Use the Live App

Since the application is deployed, you don't need to run anything locally to test it.

1. **Create an Organization:** Go to the live Sign Up page. Enter a unique Organization Name. You will automatically become the **ADMIN**.
2. **Invite Your Team:** Tell your colleagues to sign up using your *exact* Organization Name. They will automatically be added as **MEMBERs** to your workspace.
3. **Manage Workflow:** As an admin, create Projects and start delegating Tasks to your team members. 

---

## 💻 Local Development Setup

If you wish to run this codebase locally for development:

```bash
git clone https://github.com/rohangoswami9501/task-manager.git
cd task-manager

# 1. Install Dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Setup Environment Variables
# Add a .env in /backend with PORT, DATABASE_URL, and JWT_SECRET
# Add a .env in /frontend with VITE_API_URL

# 3. Database Sync
cd backend
npx prisma generate
npx prisma db push

# 4. Start Servers
npm start # inside /backend
npm run dev # inside /frontend
```

---
*Architected for scale. Built for the cloud.*
