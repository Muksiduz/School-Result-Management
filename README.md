# School Result Management System

A locally hosted web application built for a school to manage and view student results. The system runs on a single master PC within the school's LAN network — no internet connection required.

---

## About

This system was built as a real-world freelance project for a school that needed a simple, offline-capable result management solution. Staff access the app from any device on the school's local network by entering the master PC's IP address in a browser.

---

## Tech Stack

- **Frontend:** React + Tailwind CSS + Zustand
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Process Manager:** PM2

---

## Features

- Role-based access (Admin, Teacher, Viewer)
- Manage classes, sections, subjects, students
- Academic session management
- Unit test creation per session
- Bulk marks entry — enter marks for all students in one subject at once
- Drill-down result viewing:
  - Select session → class → section → student → unit test → full result
- Whole class result view for a specific unit test
- Data persists across sessions — students don't need to be re-entered every year
- Admin can promote students to new classes each year

---

## User Roles

| Role    | Permissions                                      |
|---------|--------------------------------------------------|
| Admin   | Full access — create, edit, delete everything    |
| Teacher | Can create and enter data, cannot edit or delete |
| Viewer  | Read-only access — can only view results         |

---

## How It Works (LAN Setup)

```
Master PC (Server)
├── PostgreSQL running as Windows service
├── Node.js + Express served via PM2
└── React frontend served as static files from Express

Client PCs (Any device on LAN)
└── Open browser → http://<master-pc-ip>:5000
```

No installation needed on client devices — just a browser.

---

## Installation (Master PC)

### Prerequisites
- Node.js
- PostgreSQL
- PM2 (`npm install -g pm2`)

### Steps

1. Clone the repository
```bash
git clone <repo-url>
cd backend
npm install
```

2. Set up the database — create a PostgreSQL database named `school_result_db`

3. Configure `db/pool.js` with your PostgreSQL credentials

4. Build the frontend
```bash
cd frontend
npm install
npm run build
```

5. Copy the `dist` folder into the backend root

6. Start the server with PM2
```bash
pm2 start index.js --name school-app
```

---

## Auto-Start on Boot (Windows)

Since `pm2 startup` is not supported on Windows, auto-start is handled via a `.bat` file placed in the Windows startup folder.

Create `start-school.bat`:
```bat
node C:\path\to\pm2\bin\pm2 restart school-app || node C:\path\to\pm2\bin\pm2 start C:\path\to\backend\index.js --name school-app
```

Place this file in:
```
Win + R → shell:startup → paste the .bat file here
```

The server will start automatically every time the PC boots.

---

## Default Admin Credentials

On first run, a default admin account is seeded automatically:

```
Username: MasterAdmin
Password: Let-me-in-123
```

**Change the password after first login.**

---

## Project Structure

```
backend/
├── controllers/
├── db/
│   ├── pool.js
│   ├── initDB.js
│   └── seedAdmin.js
├── middleware/
│   └── auth.js
├── routes/
├── dist/              ← built React frontend
└── index.js

frontend/
├── src/
│   ├── api/
│   ├── store/
│   ├── pages/
│   └── components/
└── vite.config.js
```

---

## PM2 Useful Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs school-app

# Restart server
pm2 restart school-app

# Stop server
pm2 stop school-app
```

---

## Notes

- The system is designed for LAN use only — not exposed to the internet
- Assign a static IP to the master PC so the URL never changes for client devices
- Bookmark `http://<static-ip>:5000` on all client devices for easy access
- For schema changes in production, use `ALTER TABLE` in pgAdmin — do not drop tables
