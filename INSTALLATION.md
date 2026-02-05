# Installation Guide - Salary Sheet Management System

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **MongoDB** v4.4 or higher (local or Atlas account)
- **npm** v7+ or **yarn** v1.22+ (comes with Node.js)
- **Git** (for cloning repository)
- A code editor (**VS Code** recommended)

---

## 🔧 Step-by-Step Installation

### **Step 1: Clone or Download the Project**

```powershell
# Clone from repository
git clone <repository-url>
cd salary-sheet-management-system

# Or if downloaded as ZIP, extract and navigate to folder
cd d:\Ravi\Salary-sheet
```

### **Step 2: Install Dependencies**

**Option A: Install all at once (recommended)**
```powershell
npm run install:all
```

**Option B: Install individually**
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install

# Go back to root
cd ..
```

### **Step 3: Set Up MongoDB**

**Option A: Local MongoDB Installation**

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Free Tier)**

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user with password
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/`)

### **Step 4: Configure Backend Environment**

```powershell
cd backend
copy .env.example .env
```

**Edit `backend\.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/salary_management

# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salary_management

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=your-super-secret-key-min-32-chars-long-12345
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-long-67890
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@salaryapp.com
ADMIN_PASSWORD=Admin@123

# Defaults
DEFAULT_PF_PERCENT=12
DEFAULT_TAX_PERCENT=10
OVERTIME_RATE_MULTIPLIER=1.5
WORKING_DAYS_PER_MONTH=26
```

### **Step 5: Configure Frontend Environment**

```powershell
cd ..\frontend
copy .env.example .env
```

**Edit `frontend\.env` file:**

```env
VITE_API_URL=http://localhost:5000/api
```

### **Step 6: Start the Application**

**Option A: Run both servers simultaneously (from root)**

```powershell
# From project root
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

**Option B: Run servers separately**

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### **Step 7: Create Admin User**

**Option A: Using MongoDB Compass or Shell**

```javascript
// Connect to: mongodb://localhost:27017
// Database: salary_management
// Collection: users

// Insert this document:
{
  "name": "Admin User",
  "email": "admin@salaryapp.com",
  "password": "$2a$10$XvXQ7Z6yH8pHb5YcN.TQMeN0X9W5j3K8p5N7L9M2.Q4R6S8T0U2V3W", // This is hashed "Admin@123"
  "role": "admin",
  "isActive": true,
  "refreshTokens": [],
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

**Option B: Using Registration Endpoint (Postman/Thunder Client)**

```powershell
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@salaryapp.com",
  "password": "Admin@123",
  "role": "admin"
}
```

**Option C: Create a seed script**

Create `backend/src/scripts/createAdmin.js`:

```javascript
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: 'admin@salaryapp.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@salaryapp.com',
      password: 'Admin@123',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@salaryapp.com');
    console.log('Password: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run it:
```powershell
cd backend
node src/scripts/createAdmin.js
```

### **Step 8: Access the Application**

1. Open browser and go to: `http://localhost:3000`
2. Login with:
   - **Email:** `admin@salaryapp.com`
   - **Password:** `Admin@123`

---

## ✅ Verification Checklist

After installation, verify:

- [ ] MongoDB is running and accessible
- [ ] Backend server starts without errors (port 5000)
- [ ] Frontend server starts without errors (port 3000)
- [ ] Can access login page at `http://localhost:3000`
- [ ] Can login with admin credentials
- [ ] Dashboard loads successfully
- [ ] API health check works: `http://localhost:5000/api/health`

---

## 🐛 Troubleshooting

### **Issue: MongoDB Connection Error**

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. For Atlas, verify IP whitelist and credentials

### **Issue: Port Already in Use**

**Error:** `Port 5000 is already in use`

**Solution:**
```powershell
# Find and kill process using port
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# Or change port in backend/.env
PORT=5001
```

### **Issue: Module Not Found**

**Error:** `Cannot find module 'express'`

**Solution:**
```powershell
# Reinstall dependencies
cd backend
del package-lock.json
del -r node_modules
npm install
```

### **Issue: CORS Errors**

**Solution:**
Ensure `VITE_API_URL` in frontend `.env` matches backend URL

### **Issue: JWT Errors**

**Solution:**
Ensure JWT secrets in `.env` are at least 32 characters long

---

## 🔄 Fresh Installation (Clean Slate)

If you need to start over:

```powershell
# Stop all servers (Ctrl+C)

# Delete node_modules and package-lock
cd backend
del package-lock.json
rmdir /s /q node_modules

cd ..\frontend
del package-lock.json
rmdir /s /q node_modules

# Reinstall
cd ..
npm run install:all

# Drop database in MongoDB
# Using MongoDB Compass or shell:
use salary_management
db.dropDatabase()

# Restart servers
npm run dev
```

---

## 📦 Production Build

### **Build Frontend**
```powershell
cd frontend
npm run build
# Creates optimized build in dist/ folder
```

### **Preview Production Build**
```powershell
npm run preview
```

### **Production Backend**
```powershell
cd backend
set NODE_ENV=production
npm start
```

---

## 🚀 Next Steps

After successful installation:

1. **Create sample employees**
2. **Mark attendance for current month**
3. **Generate salary sheets**
4. **Download salary slips**
5. **Explore dashboards**

---

## 📚 Additional Resources

- **MongoDB Tutorial:** https://docs.mongodb.com/manual/tutorial/
- **Node.js Documentation:** https://nodejs.org/docs/
- **React Documentation:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 💡 Tips for Development

1. **Use MongoDB Compass** for database visualization
2. **Use Thunder Client or Postman** for API testing
3. **Check browser console** for frontend errors
4. **Check terminal logs** for backend errors
5. **Use React DevTools** browser extension

---

**Installation complete! 🎉**

For further assistance, refer to README.md or raise an issue.
