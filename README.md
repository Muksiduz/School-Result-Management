# School Result Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)

**Offline-first result management for schools running entirely on your local network**

</div>

---

## Overview

A production-ready web application designed specifically for schools that need a **secure, offline-capable** solution for managing student academic results. Staff access the system from any device on the school's LAN — no internet required, no client installations needed.

> Built as a real-world freelance project for schools with limited IT infrastructure.

---

## Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Role-Based Security** | Three-tier access: Admin, Teacher, and Viewer |
| 📊 **Bulk Marks Entry** | Enter marks for all students in one subject simultaneously |
| 🎯 **Drill-Down Results** | Session → Class → Section → Student → Unit Test → Full Result |
| 🔄 **Student Promotion** | Promote students to new classes each academic year |
| 💾 **Persistent Data** | Students remain in the system across academic sessions |
| 🖥️ **Zero Client Setup** | Access via browser using the master PC's IP address |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SCHOOL LAN NETWORK                        │
│                                                             │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   MASTER PC (Server) │      │   Client Devices     │    │
│  │                      │      │  (Any device with    │    │
│  │  ┌────────────────┐  │      │   a web browser)     │    │
│  │  │  PostgreSQL    │  │      │                      │    │
│  │  │  (Database)    │  │◄────►│  • Teacher Laptops   │    │
│  │  └────────────────┘  │      │  • Admin Desktops    │    │
│  │                      │      │  • Tablets/Mobile      │    │
│  │  ┌────────────────┐  │      │                      │    │
│  │  │  Node.js +     │  │      │  Access via:         │    │
│  │  │  Express API   │  │      │  http://192.168.x.x  │    │
│  │  └────────────────┘  │      │        :5000         │    │
│  │                      │      │                      │    │
│  │  ┌────────────────┐  │      └──────────────────────┘    │
│  │  │  React Frontend│  │                                  │
│  │  │  (Static Files)│  │      No installation required    │
│  │  └────────────────┘  │      on client devices           │
│  │                      │                                     │
│  │  Managed by PM2      │                                     │
│  └──────────────────────┘                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Tailwind CSS + Zustand |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL |
| **Process Manager** | PM2 |

</div>

---

## User Roles & Permissions

| Role | Create | Edit | Delete | View |
|------|--------|------|--------|------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Teacher** | ✅ | ❌ | ❌ | ✅ |
| **Viewer** | ❌ | ❌ | ❌ | ✅ |

---

## Installation Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/download/windows/) (Windows)
- PM2: `npm install -g pm2`

### Step-by-Step Setup

#### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd school-result-management

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Database Configuration

```bash
# Create database in PostgreSQL
createdb school_result_db

# Update credentials in backend/db/pool.js
# Example:
#   user: 'postgres',
#   password: 'your_password',
#   host: 'localhost',
#   database: 'school_result_db',
#   port: 5432
```

#### 3. Build & Deploy Frontend

```bash
cd frontend
npm run build

# Copy build output to backend
cp -r dist ../backend/
```

#### 4. Launch Application

```bash
cd ../backend
pm2 start index.js --name school-app
```

---

## Auto-Start on Windows Boot

Since `pm2 startup` is not supported on Windows, use a batch file in the Startup folder.

**Create `start-school.bat`:**
```batch
@echo off
node C:\path\to\pm2\bin\pm2 restart school-app || node C:\path\to\pm2\bin\pm2 start C:\path\to\backend\index.js --name school-app
```

**Add to Startup:**
1. Press `Win + R`
2. Type `shell:startup` and press Enter
3. Copy `start-school.bat` into the folder

---

## Default Access

> ⚠️ **Change immediately after first login**

```
Username: MasterAdmin
Password: Let-me-in-123
```

---

## PM2 Command Reference

```bash
pm2 status              # View running processes
pm2 logs school-app     # View application logs
pm2 restart school-app  # Restart the server
pm2 stop school-app     # Stop the server
pm2 delete school-app   # Remove from PM2
```

---

## Project Structure

```
school-result-management/
├── backend/
│   ├── controllers/         # API route handlers
│   ├── db/
│   │   ├── pool.js          # Database connection
│   │   ├── initDB.js        # Schema initialization
│   │   └── seedAdmin.js     # Default admin account
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── routes/              # API endpoint definitions
│   ├── dist/                # Built React frontend
│   └── index.js             # Server entry point
│
└── frontend/
    ├── src/
    │   ├── api/             # API service functions
    │   ├── store/           # Zustand state management
    │   ├── pages/           # Route components
    │   └── components/      # Reusable UI components
    └── vite.config.js
```

---

## Important Notes

> 🛡️ **Security:** This system is designed for LAN use only. Do not expose to the internet.

> 🌐 **Static IP:** Assign a static IP to the master PC to ensure the access URL never changes.

> 🔖 **Bookmark:** Save `http://<static-ip>:5000` on all client devices for quick access.

> 🗄️ **Database Migrations:** For production schema changes, use `ALTER TABLE` statements via pgAdmin. **Never drop existing tables** to prevent data loss.

---

## Support

For issues or feature requests, please contact the system administrator or create an issue in the repository.

---

<div align="center">

**Built for schools, by someone who understands them.**

</div>

---

Would you like me to save this redesigned README to a file for download, or make any adjustments to the styling or content?
