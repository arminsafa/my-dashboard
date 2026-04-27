# Sales Supervisor Dashboard

A full-stack dashboard for Sales Call Team Supervisors to manage leads and monitor team performance.

## 🚀 Features
- **User Authentication**: Secure signup and login for Supervisors (using bcryptjs).
- **Lead Management**: Full CRUD (Create, Read, Update, Delete) operations for sales leads.
- **Dynamic Dashboard**: Real-time performance widgets and lead tracking.
- **Modern UI**: Clean, responsive dark-mode interface built with CSS Grid and Flexbox.

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (Native Fetch API).
- **Backend**: Node.js, Express.js.
- **ORM**: Prisma (connected to PostgreSQL).
- **Database**: PostgreSQL.

## 📋 Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

## ⚙️ Setup Instructions

### 1. Database Setup
Ensure you have a PostgreSQL database created.

### 2. Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `DATABASE_URL` in `.env` with your credentials:
   `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
5. Sync the database schema:
   ```bash
   npx prisma db push
   ```

### 3. Running the Project
1. Start the backend server:
   ```bash
   npm run dev
   ```
2. Open `frontend/login.html` in your browser (or use a Live Server extension).

## 🔒 Security
- Passwords are never stored in plain text (hashed with bcrypt).
- Environment variables are used for database credentials.
- Error handling prevents raw database details from being exposed to the client.
