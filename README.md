# Salary Sheet Management System

A comprehensive, enterprise-grade **Salary Management System** built with **React**, **Node.js**, **Express**, **MongoDB**, and **TypeScript**. This application provides full CRUD operations for employee management, attendance tracking, automated salary generation, PDF salary slips, role-based authentication, and professional dashboards.

---

## 🌟 Features

### ✨ **Core Functionality**
- **Employee Management**: Add, edit, delete, and view employee profiles with detailed information
- **Attendance Tracking**: Mark daily attendance, manage leaves, overtime, and absences
- **Automated Salary Calculation**: Generate monthly salary sheets based on attendance, allowances, deductions, taxes, and overtime
- **PDF Salary Slips**: Download individual salary slips or batch reports as PDF
- **Role-Based Access Control**: Admin, HR, and Employee roles with different permissions
- **Professional Dashboards**: Separate dashboards for Admin/HR and Employees

### 🎨 **UI/UX Design**
- **Modern & Clean Interface**: Enterprise-grade design with custom color palette
- **Custom Font Pairing**:
  - **Headings**: Poppins / Montserrat Alternates (bold, modern)
  - **Body**: Inter (clean, readable)
- **Color Scheme**:
  - Primary: `#0f172a` (dark navy)
  - Accent: `#06b6d4` (cyan/teal)
  - Muted: `#64748b`
  - Background: `#f8fafc`
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Tailwind CSS + transitions

### 🔒 **Security**
- JWT Authentication (Access + Refresh Tokens)
- Password hashing with bcrypt
- Role-based route protection
- Secure API endpoints

### 📊 **Salary Features**
- Basic Pay, HRA, Transport/Medical/Special Allowances
- PF, Tax, Professional Tax, Other Deductions
- Overtime calculation
- Leave and absence deductions
- Gross Salary, Total Deductions, Net Salary breakdown

---

## 📁 Project Structure

```
salary-sheet-management-system/
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── config/               # Database configuration
│   │   ├── models/               # Mongoose models (User, Employee, Attendance, SalarySheet)
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Auth, error handling, validation
│   │   ├── utils/                # JWT, PDF generator, salary calculator
│   │   └── server.js             # Express server entry point
│   ├── package.json
│   └── .env.example
├── frontend/                     # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── layouts/              # Auth & Dashboard layouts
│   │   ├── pages/                # All application pages
│   │   ├── lib/                  # API client
│   │   ├── store/                # Zustand state management
│   │   ├── types/                # TypeScript definitions
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # Entry point
│   │   └── index.css             # Tailwind + custom styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
├── package.json                  # Root package.json
└── README.md
```

---

## 🚀 Tech Stack

### **Frontend**
- **React 18** with **TypeScript**
- **Vite** (fast build tool)
- **Tailwind CSS** (utility-first CSS)
- **React Router** (routing)
- **Zustand** (state management)
- **Axios** (HTTP client)
- **React Hot Toast** (notifications)
- **Chart.js** (data visualization)
- **date-fns** (date formatting)
- **Heroicons** (icons)

### **Backend**
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (authentication)
- **bcryptjs** (password hashing)
- **PDFKit** (PDF generation)
- **Express Validator** (input validation)
- **CORS** (cross-origin requests)

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd salary-sheet-management-system
```

### **2. Install Dependencies**

**Install all packages (root, frontend, backend):**
```bash
npm run install:all
```

**Or install individually:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### **3. Configure Environment Variables**

**Backend (`backend/.env`):**
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/salary_management
JWT_ACCESS_SECRET=your_super_secret_access_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
ADMIN_EMAIL=admin@salaryapp.com
ADMIN_PASSWORD=Admin@123
```

**Frontend (`frontend/.env`):**
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### **4. Start MongoDB**

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
Update `MONGODB_URI` in `backend/.env` with your Atlas connection string.

### **5. Run the Application**

**Development mode (both frontend & backend):**
```bash
# From root directory
npm run dev
```

**Or run separately:**

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## 👤 Default Credentials

After starting the backend, create an admin user manually or use the seed script (optional).

**Admin Login:**
- Email: `admin@salaryapp.com`
- Password: `Admin@123`

*(Create this user via API or MongoDB directly)*

---

## 📖 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout user | Private |
| GET | `/auth/me` | Get current user | Private |

### **Employee Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/employees` | Create employee | Admin, HR |
| GET | `/employees` | Get all employees | Admin, HR |
| GET | `/employees/:id` | Get employee by ID | Admin, HR, Employee (own) |
| PUT | `/employees/:id` | Update employee | Admin, HR |
| DELETE | `/employees/:id` | Delete employee | Admin |
| GET | `/employees/stats/overview` | Get statistics | Admin, HR |

### **Attendance Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/attendance` | Mark attendance | Admin, HR |
| PUT | `/attendance/:id` | Update attendance | Admin, HR |
| GET | `/attendance/employee/:employeeId` | Get employee attendance | Admin, HR, Employee (own) |
| GET | `/attendance/monthly/:month` | Get monthly attendance | Admin, HR |
| POST | `/attendance/bulk` | Bulk upload | Admin, HR |
| DELETE | `/attendance/:id` | Delete record | Admin |

### **Salary Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/salary/generate` | Generate monthly salary | Admin, HR |
| GET | `/salary/employee/:employeeId` | Get employee salaries | Admin, HR, Employee (own) |
| GET | `/salary/:employeeId/:month` | Get specific month | Admin, HR, Employee (own) |
| GET | `/salary/download/:employeeId/:month` | Download PDF | Admin, HR, Employee (own) |
| GET | `/salary/report/:month` | Monthly report | Admin, HR |
| PUT | `/salary/:id/approve` | Approve salary | Admin |
| PUT | `/salary/:id/pay` | Mark as paid | Admin, HR |
| GET | `/salary/stats/dashboard` | Dashboard stats | Admin, HR |

---

## 🎯 User Roles & Permissions

### **Admin**
- Full access to all features
- Manage employees, attendance, salary
- Approve salary sheets
- View all reports

### **HR**
- Manage employees
- Mark attendance
- Generate and process salaries
- View reports

### **Employee**
- View own dashboard
- View own salary sheets
- Download salary slips
- View profile

---

## 🖼️ Screenshots & Pages

### **1. Login Page**
- Clean authentication form
- Demo credentials displayed
- Modern gradient background

### **2. Admin Dashboard**
- Total employees, monthly payroll, attendance rate
- Department statistics
- Recent employees table
- Quick action cards

### **3. Employee Management**
- List all employees with search/filter
- Add new employee form
- Edit employee details
- Delete (terminate) employee

### **4. Attendance Management**
- Mark daily attendance
- View monthly attendance
- Bulk upload via Excel
- Track overtime, leaves, absences

### **5. Salary Generation**
- Select month to generate
- Auto-calculate based on attendance
- Generate for all or specific employees
- View generation summary

### **6. Salary Sheets**
- View all generated salary sheets
- Filter by month, department, status
- Download individual salary slips (PDF)
- Download batch reports

### **7. Employee Dashboard**
- Personal information
- Salary history
- Download salary slips
- View attendance summary

### **8. Profile Page**
- Update personal details
- Change password
- View account information

---

## 🛠️ Development

### **Run Tests** (if implemented)
```bash
npm test
```

### **Build for Production**

**Frontend:**
```bash
cd frontend
npm run build
# Creates dist/ folder
```

**Backend:**
```bash
cd backend
npm start
```

---

## 🚢 Deployment

### **Option 1: Vercel (Frontend) + Railway/Render (Backend)**

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=<your-backend-url>`

**Backend (Railway):**
1. Connect GitHub repo
2. Set root directory to `backend`
3. Add environment variables from `.env`
4. Deploy

### **Option 2: Docker**

Create `Dockerfile` for backend and frontend, use `docker-compose` to orchestrate.

### **Option 3: Traditional VPS**
- Use **PM2** for process management
- **Nginx** as reverse proxy
- **MongoDB** on same server or Atlas

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## ✅ Features Checklist

- [x] User Authentication (JWT)
- [x] Role-based Access Control
- [x] Employee CRUD Operations
- [x] Attendance Management
- [x] Automated Salary Calculation
- [x] PDF Salary Slip Generation
- [x] Admin Dashboard
- [x] Employee Dashboard
- [x] Responsive Design
- [x] Modern UI with Tailwind CSS
- [x] MongoDB Integration
- [x] API Validation
- [x] Error Handling
- [x] Secure Password Storage
- [x] Refresh Token Mechanism

---

## 🎓 Academic/Project Presentation Ready

This system is **production-ready** and suitable for:
- Final year projects
- Portfolio showcase
- Academic presentations
- Real-world deployment

**Key Highlights:**
- Enterprise-grade architecture
- Clean code with comments
- Comprehensive documentation
- Scalable and maintainable
- Professional UI/UX
- Complete feature set

---

**Built with ❤️ for modern salary management**
