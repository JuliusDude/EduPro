<p align="center">
  <h1 align="center">🎓 EduPro</h1>
  <p align="center">
    <strong>A Comprehensive Classroom Automation System</strong>
  </p>
  <p align="center">
    Streamline educational operations with intelligent attendance tracking, assignment management, and course administration
  </p>
</p>

<p align="center">
  <a href="#-features"><strong>Features</strong></a> •
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> •
  <a href="#-getting-started"><strong>Getting Started</strong></a> •
  <a href="#-project-structure"><strong>Structure</strong></a> •
  <a href="#-api-documentation"><strong>API Docs</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
</p>

---

## 📋 Overview

**EduPro** is a full-stack classroom automation web application designed to digitize and streamline educational administrative tasks. It provides role-based interfaces for **Students**, **Lecturers**, and **Administrators**, enabling efficient management of attendance, assignments, notes, timetables, and course administration.

### 🎯 Key Objectives

- **Automate Attendance Tracking**: Real-time attendance management with visual analytics and prediction capabilities
- **Simplify Assignment Workflow**: End-to-end assignment creation, submission, and grading system
- **Centralize Course Materials**: Organized notes and resources accessible to all stakeholders
- **Enable Data-Driven Decisions**: Comprehensive reports and analytics for administrators

---

## ✨ Features

### 👨‍🎓 Student Portal

| Feature | Description |
|---------|-------------|
| **Dashboard** | Personalized overview with course progress, upcoming deadlines, and announcements |
| **Attendance Tracker** | View attendance percentage with color-coded status (🔴 <75%, 🟡 75-85%, 🟢 >85%) |
| **Assignment Hub** | Submit assignments, track deadlines, and view grades with feedback |
| **Notes Manager** | Access course materials and personal notes organized in folders |
| **Timetable** | Interactive weekly schedule with class timings and room information |
| **Course Info** | Detailed syllabus, subject information, and lecturer details |

### 👩‍🏫 Lecturer Portal

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of assigned subjects, pending tasks, and student statistics |
| **Attendance Management** | Mark and edit attendance for enrolled students with bulk operations |
| **Assignment Creator** | Create, publish, and manage assignments with file attachments |
| **Student Overview** | Monitor student performance and progress across subjects |
| **Course Management** | View and manage assigned courses with detailed analytics |
| **Announcements** | Post announcements with priority levels targeting specific audiences |

### 👨‍💼 Admin Portal

| Feature | Description |
|---------|-------------|
| **Dashboard** | Institution-wide statistics and key performance indicators |
| **User Management** | CRUD operations for students, lecturers, and admins |
| **Course Management** | Create and configure courses with subject assignments |
| **Department Management** | Organize academic departments and assign heads |
| **Calendar & Events** | Manage academic calendar with exams, holidays, and events |
| **Reports & Analytics** | Generate comprehensive reports on attendance, performance, and more |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **Recharts** - Composable charting library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe development
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database (via Supabase)
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Infrastructure
- **Supabase** - Backend-as-a-Service for PostgreSQL
- **Google Gemini AI** - AI-powered features (optional)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **PostgreSQL** database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JuliusDude/EduPro.git
   cd EduPro
   ```

2. **Set up the Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL="postgresql://user:password@host:5432/database"
   SUPABASE_URL="your-supabase-url"
   SUPABASE_ANON_KEY="your-anon-key"

   # JWT Configuration
   JWT_SECRET="your-secure-jwt-secret"
   JWT_EXPIRES_IN="7d"

   # Client URL
   CLIENT_URL="http://localhost:5173"
   ```

4. **Initialize the Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the Backend Server**
   ```bash
   npm run dev
   ```

6. **Set up the Frontend** (new terminal)
   ```bash
   cd client
   npm install
   ```

7. **Configure Frontend Environment**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

8. **Start the Frontend**
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Prisma Studio**: `npx prisma studio` (Database GUI)

---

## 📁 Project Structure

```
EduPro/
├── 📂 client/                    # Frontend React Application
│   ├── 📂 src/
│   │   ├── 📂 components/        # Reusable UI components
│   │   │   ├── 📂 admin/         # Admin-specific components
│   │   │   └── ...
│   │   ├── 📂 context/           # React Context providers
│   │   ├── 📂 pages/             # Page components
│   │   │   ├── 📂 admin/         # Admin portal pages
│   │   │   ├── 📂 lecturer/      # Lecturer portal pages
│   │   │   ├── Dashboard.tsx     # Student dashboard
│   │   │   ├── Attendance.tsx    # Student attendance view
│   │   │   ├── Assignments.tsx   # Student assignments
│   │   │   ├── Notes.tsx         # Notes management
│   │   │   ├── Timetable.tsx     # Weekly timetable
│   │   │   └── Login.tsx         # Authentication
│   │   ├── 📂 services/          # API service layer
│   │   ├── App.tsx               # Main application component
│   │   └── main.tsx              # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── 📂 server/                    # Backend Node.js Application
│   ├── 📂 prisma/
│   │   └── schema.prisma         # Database schema
│   ├── 📂 src/
│   │   ├── 📂 middleware/        # Express middleware
│   │   ├── 📂 routes/            # API route handlers
│   │   │   ├── 📂 admin/         # Admin routes
│   │   │   ├── 📂 lecturer/      # Lecturer routes
│   │   │   ├── 📂 student/       # Student routes
│   │   │   └── auth.ts           # Authentication routes
│   │   ├── 📂 services/          # Business logic services
│   │   ├── 📂 utils/             # Utility functions
│   │   └── server.ts             # Express server entry point
│   ├── 📂 uploads/               # File upload directory
│   ├── .env.example              # Environment template
│   └── package.json
│
├── 📂 resources/                 # Static resources & sample data
├── LICENSE                       # MIT License
└── README.md                     # Project documentation
```

---

## 🗄️ Database Schema

### Core Entities

| Entity | Description |
|--------|-------------|
| **User** | Base user with role (Student/Lecturer/Admin) |
| **Student** | Extended student profile with enrollment info |
| **Lecturer** | Extended lecturer profile with department |
| **Department** | Academic departments |
| **Course** | Educational programs |
| **Subject** | Individual subjects within courses |
| **Enrollment** | Student-subject relationships |
| **Attendance** | Daily attendance records |
| **Assignment** | Assignment definitions |
| **Submission** | Student assignment submissions |
| **Note** | Course materials and personal notes |
| **Folder** | Note organization structure |
| **TimetableSlot** | Weekly schedule slots |
| **Announcement** | Broadcast messages |
| **Notification** | User notifications |
| **Event** | Calendar events |

---

## 📡 API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/profile` | GET | Get current user profile |

### Student Routes (`/api/student/...`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dashboard` | GET | Get dashboard data |
| `/attendance` | GET | Get attendance records |
| `/assignments` | GET | Get assignments |
| `/notes` | GET | Get accessible notes |
| `/timetable` | GET | Get weekly timetable |

### Lecturer Routes (`/api/lecturer/...`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subjects` | GET | Get assigned subjects |
| `/attendance` | POST | Mark attendance |
| `/assignments` | POST | Create assignment |
| `/students` | GET | Get enrolled students |

### Admin Routes (`/api/admin/...`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users` | CRUD | User management |
| `/courses` | CRUD | Course management |
| `/departments` | CRUD | Department management |
| `/events` | CRUD | Event management |
| `/reports` | GET | Generate reports |

---

## 🔐 Authentication & Authorization

EduPro uses **JWT (JSON Web Tokens)** for authentication with role-based access control:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Student    │     │   Lecturer   │     │    Admin     │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────┐
│                    JWT Middleware                         │
│        (Validates token & extracts user role)            │
└──────────────────────────────────────────────────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Student APIs │     │ Lecturer APIs│     │  Admin APIs  │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 📊 Screenshots

> *Screenshots will be added in future updates*

---

## 🛣️ Roadmap

- [x] Core authentication system
- [x] Student portal with attendance & assignments
- [x] Lecturer portal with course management
- [x] Admin portal with user & department management
- [ ] AI-powered notes chatbot (RAG with Gemini)
- [ ] Real-time notifications with WebSockets
- [ ] Mobile-responsive PWA
- [ ] Email notifications integration
- [ ] Bulk data import/export
- [ ] Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Julius**

- GitHub: [@JuliusDude](https://github.com/JuliusDude)

---

<p align="center">
  Made with ❤️ for Education
</p>