# Project Structure - Salary Management System

## 📁 Complete Directory Tree

```
salary-sheet-management-system/
│
├── backend/                                 # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js                 # MongoDB connection setup
│   │   │
│   │   ├── models/
│   │   │   ├── User.js                     # User model (Auth)
│   │   │   ├── Employee.js                 # Employee details
│   │   │   ├── Attendance.js               # Attendance records
│   │   │   └── SalarySheet.js              # Salary calculations
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js              # Auth endpoints
│   │   │   ├── employee.routes.js          # Employee CRUD
│   │   │   ├── attendance.routes.js        # Attendance management
│   │   │   └── salary.routes.js            # Salary operations
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js                     # JWT authentication
│   │   │   ├── errorHandler.js             # Global error handler
│   │   │   └── validators.js               # Input validation
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js                      # JWT token generation
│   │   │   ├── salaryCalculator.js         # Salary calculation logic
│   │   │   └── pdfGenerator.js             # PDF salary slip generation
│   │   │
│   │   ├── scripts/
│   │   │   └── seed.js                     # Database seeding script
│   │   │
│   │   └── server.js                       # Express app entry point
│   │
│   ├── package.json                        # Backend dependencies
│   ├── .env.example                        # Environment template
│   └── .env                                # Environment variables (not in git)
│
├── frontend/                                # React + Vite Frontend
│   ├── src/
│   │   ├── components/                     # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx              # Login page layout
│   │   │   └── DashboardLayout.tsx         # Main app layout with sidebar
│   │   │
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   └── Login.tsx               # Login page
│   │   │   │
│   │   │   ├── Dashboard/
│   │   │   │   ├── AdminDashboard.tsx      # Admin/HR dashboard
│   │   │   │   └── EmployeeDashboard.tsx   # Employee dashboard
│   │   │   │
│   │   │   ├── Employees/
│   │   │   │   ├── EmployeeList.tsx        # List all employees
│   │   │   │   └── EmployeeForm.tsx        # Add/Edit employee
│   │   │   │
│   │   │   ├── Attendance/
│   │   │   │   └── AttendanceManagement.tsx # Attendance tracking
│   │   │   │
│   │   │   ├── Salary/
│   │   │   │   ├── SalaryGeneration.tsx    # Generate salary sheets
│   │   │   │   └── SalarySheets.tsx        # View salary sheets
│   │   │   │
│   │   │   └── Profile/
│   │   │       └── Profile.tsx             # User profile
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts                      # Axios API client with interceptors
│   │   │
│   │   ├── store/
│   │   │   └── authStore.ts                # Zustand authentication state
│   │   │
│   │   ├── types/
│   │   │   └── index.ts                    # TypeScript type definitions
│   │   │
│   │   ├── App.tsx                         # Main app with routing
│   │   ├── main.tsx                        # React entry point
│   │   ├── index.css                       # Tailwind CSS + custom styles
│   │   └── vite-env.d.ts                   # Vite environment types
│   │
│   ├── public/
│   │   └── vite.svg                        # App icon
│   │
│   ├── index.html                          # HTML entry point
│   ├── package.json                        # Frontend dependencies
│   ├── vite.config.ts                      # Vite configuration
│   ├── tailwind.config.js                  # Tailwind CSS config
│   ├── tsconfig.json                       # TypeScript config
│   ├── tsconfig.node.json                  # Node TypeScript config
│   ├── .env.example                        # Environment template
│   └── .env                                # Environment variables (not in git)
│
├── node_modules/                            # Dependencies (auto-generated)
│
├── .gitignore                              # Git ignore file
├── package.json                            # Root package.json (scripts)
├── README.md                               # Main documentation
├── INSTALLATION.md                         # Installation guide
├── DEPLOYMENT.md                           # Deployment guide
├── API_TESTING.md                          # API testing guide
└── QUICKSTART.md                           # Quick start guide
```

## 📄 File Descriptions

### Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Express server initialization, middleware setup, route mounting |
| `database.js` | MongoDB connection with Mongoose |
| `User.js` | User authentication model (admin, hr, employee roles) |
| `Employee.js` | Employee personal, job, and salary information |
| `Attendance.js` | Daily attendance tracking with overtime |
| `SalarySheet.js` | Monthly salary calculations and breakdowns |
| `auth.routes.js` | Login, register, logout, token refresh endpoints |
| `employee.routes.js` | CRUD operations for employee management |
| `attendance.routes.js` | Attendance marking and retrieval |
| `salary.routes.js` | Salary generation, approval, and PDF download |
| `auth.js` | JWT verification middleware |
| `validators.js` | Express-validator rules |
| `salaryCalculator.js` | Complex salary calculation logic |
| `pdfGenerator.js` | PDFKit salary slip generation |
| `seed.js` | Populate database with sample data |

### Frontend Files

| File | Purpose |
|------|---------|
| `App.tsx` | Main app component with React Router setup |
| `main.tsx` | React DOM rendering entry point |
| `AuthLayout.tsx` | Layout for login page (gradient background) |
| `DashboardLayout.tsx` | Main app layout with sidebar navigation |
| `Login.tsx` | Login form with credentials |
| `AdminDashboard.tsx` | Statistics, charts, recent employees |
| `EmployeeDashboard.tsx` | Employee personal view with salary history |
| `EmployeeList.tsx` | Employee table with search/filter |
| `EmployeeForm.tsx` | Add/edit employee form |
| `AttendanceManagement.tsx` | Mark and view attendance |
| `SalaryGeneration.tsx` | Generate monthly salaries |
| `SalarySheets.tsx` | View and download salary PDFs |
| `api.ts` | Axios client with auth interceptors |
| `authStore.ts` | Zustand global state for user/token |
| `index.ts` (types) | TypeScript interfaces for all data models |
| `index.css` | Tailwind directives + custom CSS classes |

## 🎨 Design System

### Color Palette
```
Primary Dark: #0f172a (Navy)
Accent: #06b6d4 (Cyan/Teal)
Muted: #64748b (Slate Gray)
Background: #f8fafc (Light Gray)
```

### Typography
```
Headings: Poppins / Montserrat Alternates (bold)
Body: Inter (clean, readable)
```

### Component Classes
```css
.btn-primary      /* Main action buttons */
.btn-secondary    /* Secondary buttons */
.btn-outline      /* Outline buttons */
.input-field      /* Form inputs */
.card             /* Content cards */
.table            /* Data tables */
```

## 🔑 Key Features by File

### Authentication (`auth.routes.js` + `Login.tsx`)
- JWT-based login/logout
- Access + refresh token mechanism
- Role-based access (admin, hr, employee)

### Employee Management (`employee.routes.js` + `EmployeeList/Form.tsx`)
- Complete CRUD operations
- Department/designation filtering
- Search by name/email/code

### Attendance (`attendance.routes.js` + `AttendanceManagement.tsx`)
- Daily check-in/out
- Overtime tracking
- Leave management
- Bulk upload

### Salary (`salary.routes.js` + `SalaryGeneration/Sheets.tsx`)
- Automated calculation based on:
  - Basic pay, HRA, allowances
  - PF, tax deductions
  - Attendance (present/absent days)
  - Overtime hours
- PDF generation with PDFKit
- Monthly reports

## 🛠️ Technology Stack Summary

### Backend
```json
{
  "runtime": "Node.js v16+",
  "framework": "Express.js",
  "database": "MongoDB (Mongoose ODM)",
  "auth": "JWT (jsonwebtoken + bcryptjs)",
  "validation": "express-validator",
  "pdf": "pdfkit"
}
```

### Frontend
```json
{
  "library": "React 18",
  "language": "TypeScript",
  "bundler": "Vite",
  "styling": "Tailwind CSS",
  "routing": "React Router v6",
  "state": "Zustand",
  "http": "Axios",
  "icons": "Heroicons"
}
```

## 📊 Data Flow

```
Frontend (React)
    ↓ API Request (Axios)
    ↓ JWT Token in Header
    ↓
Middleware (auth.js)
    ↓ Verify Token
    ↓ Check Role
    ↓
Route Handler (routes/*.js)
    ↓ Validate Input
    ↓ Business Logic
    ↓
Database (MongoDB)
    ↓ Mongoose Models
    ↓ CRUD Operations
    ↓
Response (JSON)
    ↓
Frontend (Update State)
    ↓
UI (Re-render)
```

## 🔄 Request Lifecycle

1. User interacts with UI (clicks button)
2. React component calls API function (`api.post()`)
3. Axios interceptor adds JWT token to headers
4. Request reaches Express server
5. Middleware authenticates & authorizes
6. Route handler processes request
7. Database operation via Mongoose
8. Response sent back to frontend
9. Zustand state updated (if needed)
10. Component re-renders with new data

---

**This structure is designed for scalability, maintainability, and production readiness.**
