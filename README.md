# 🏙️ CivicFix — Smart City Complaint & Issue Tracking Platform

> **Tagline:** *Report It. Track It. Improve Your City.*  
> **Project Type:** Full-Stack Web Application (MERN Stack)  
> **Core Team & Contributors:** Ramya Sri (Lead), Phani, Radhika ([CONTRIBUTORS.md](CONTRIBUTORS.md))  
> **Theme:** Green Smart-City Municipal Theme (Eco-friendly emerald & mint accents)

---

## 🌟 Executive Summary

**CivicFix** is a comprehensive, production-ready civic issue reporting and municipal governance platform. It empowers citizens to document and report local problems (such as road damage, garbage overflow, water leakage, broken streetlights, and hazardous fallen trees) with photographic evidence and interactive map coordinates. Municipal administrators can verify, prioritize, and route complaints to designated departments, while field officers log timestamped work progress and upload resolution evidence for citizen approval.

---

## 🚀 Key Features

1. **Citizen Portal (`/` & `/report` & `/dashboard`)**
   - Quick 60-second issue reporting with AI Category Suggestion.
   - Geotagging with interactive OpenStreetMap (Leaflet) pin drop & GPS auto-detection.
   - File upload preview & preset sample test images.
   - Offline draft auto-saving to local storage.
   - Personal Citizen Dashboard with live status counters and history.
   - Reopen action for sub-standard repairs.
   - 5-Star citizen satisfaction rating & feedback submission.

2. **Public Transparency & GIS Map (`/issues` & `/issues/map`)**
   - Interactive OpenStreetMap with color-coded pins (Resolved, Active, Critical).
   - Split-screen view: browse complaints list side-by-side with map markers.
   - Filters by municipal category, priority, and resolution status.
   - **Privacy-First (OWASP compliant):** Citizen contact details (phone, email) are automatically anonymized in public views.

3. **Public Complaint Tracker (`/track`)**
   - Direct lookup by unique Tracking Ticket ID (e.g. `CF-2026-1011`).
   - 5-step visual milestone progress bar.
   - Before and after photographic evidence side-by-side comparison.
   - Chronological audit timeline with official work notes.

4. **Municipal Admin Command Center (`/admin`)**
   - KPI metrics: Total intake, Pending review, Active field tasks, Resolved issues, and Resolution SLA %.
   - Complaint Triage Queue: Transition statuses (`SUBMITTED` ➔ `VERIFIED` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED`).
   - Work order assignment to designated field staff with target deadlines.
   - Category and priority distribution breakdown.

5. **Field Staff Taskforce Portal (`/staff`)**
   - Real-time work order queue for assigned field personnel.
   - On-ground status update logging (`IN_PROGRESS`, `RESOLVED`).
   - Resolution proof photo upload before marking complete.

6. **Bilingual UI (Telugu + English)**
   - 1-Click language toggle (`EN` / `తెలుగు`) in navbar with comprehensive civic terminology.

---

## 👥 Demo Personas & 1-Click Credentials

The platform features built-in **1-Click Demo Login** buttons on the Login page and a **Demo Persona Switcher** in the top navbar:

| Persona | Demo Email | Demo Password | Role Capabilities |
| :--- | :--- | :--- | :--- |
| **Active Citizen** | `citizen@civicfix.org` | `citizen123` | Report issues, track own tickets, reopen resolved issues, submit ratings |
| **Municipal Staff** | `staff@civicfix.org` | `staff123` | View assigned work orders, update progress, upload repair evidence |
| **City Administrator** | `admin@civicfix.org` | `admin123` | Citywide analytics, complaint triage, staff assignment, role management |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Leaflet Maps, Canvas Confetti.
- **Backend:** Node.js, Express.js, Mongoose, JWT Authentication, Helmet, CORS, Rate Limiting.
- **Database:** MongoDB (Local `127.0.0.1:27017` or MongoDB Atlas Cloud URI).
- **Architecture:** Zero-downtime architecture — Frontend features an automated fallback to persistent mock data when the server or database is starting up.

---

## 💻 Localhost Setup Guide (Windows / PowerShell)

### Step 1: Install Dependencies

#### 1. Backend Server
```powershell
cd "c:\Users\RAMYA SRI\Downloads\road\server"
npm install
```

#### 2. Frontend Client
```powershell
cd "c:\Users\RAMYA SRI\Downloads\road\client"
npm install
```

---

### Step 2: Configure Environment Variables

The server includes pre-configured defaults in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/civicfix
JWT_SECRET=civicfix_secure_jwt_secret_token_2026_smart_city_platform
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string)*

---

### Step 3: Seed Database (Optional)
To load initial municipal departments, demo staff accounts, and realistic geo-located complaints:
```powershell
cd "c:\Users\RAMYA SRI\Downloads\road\server"
npm run seed
```

---

### Step 4: Run the Application

#### Terminal 1 — Start Backend Server:
```powershell
cd "c:\Users\RAMYA SRI\Downloads\road\server"
npm run dev
# Server will run on: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

#### Terminal 2 — Start Frontend Client:
```powershell
cd "c:\Users\RAMYA SRI\Downloads\road\client"
npm run dev
# Frontend will run on: http://localhost:5173
```

Open your browser and navigate to **`http://localhost:5173`**!

---

## 📁 Project Directory Structure

```text
road/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── LanguageContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── IssueCard.jsx
│       │   ├── MapPicker.jsx
│       │   ├── PublicMap.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── AICategorySuggester.jsx
│       ├── layouts/
│       │   └── PublicLayout.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── ReportIssue.jsx
│       │   ├── TrackIssue.jsx
│       │   ├── PublicIssues.jsx
│       │   ├── CitizenDashboard.jsx
│       │   ├── Notifications.jsx
│       │   ├── Profile.jsx
│       │   ├── About.jsx
│       │   ├── Help.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── NotFound.jsx
│       ├── admin/
│       │   └── AdminDashboard.jsx
│       └── staff/
│           └── StaffDashboard.jsx
├── server/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   ├── Department.js
│   │   ├── ComplaintUpdate.js
│   │   └── Notification.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── adminController.js
│   │   ├── staffController.js
│   │   └── notificationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── staffRoutes.js
│   │   └── notificationRoutes.js
│   └── services/
│       ├── seedData.js
│       ├── spatialInfrastructureRegistry.js
│       ├── municipalAuditLedgerRegistry.js
│       ├── iotRoadTelemetryEngine.js
│       └── grievanceTriageRulesEngine.js
├── tests/
│   ├── complaint.test.js
│   ├── workflow.test.js
│   └── gis.test.js
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 🧪 Automated Testing & Coverage

To run the full unit test suite with coverage thresholds:

```bash
npm run test
```

Tests validate:
- Grievance payload validation and category auto-routing
- 3-tier municipal workflow transitions (Citizen -> Leader -> Worker)
- GIS spatial boundary constraints and road degradation formulas

---

## 🐳 Docker Container Deployment

```bash
# Build and run containers
docker-compose up --build -d

# Verify services
docker-compose ps
```

---

## 📜 Resume / Portfolio Summary

> **CivicFix — Smart Civic Issue Reporting and Tracking Platform (MERN Stack)**  
> Engineered an enterprise full-stack smart city web application empowering citizens to report urban infrastructure failures (roads, sanitation, water, electrical) with Leaflet GIS mapping and photographic verification. Developed role-based portals for Citizens, Municipal Staff, and Administrators with strict workflow state transitions, AI category pattern suggestions, bilingual interface (Telugu & English), automated department routing, and privacy-first data sanitization.

