# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```powershell
cd d:\Ravi\Salary-sheet
npm run install:all
```

### Step 2: Setup Environment
```powershell
# Backend
cd backend
copy .env.example .env

# Frontend
cd ..\frontend
copy .env.example .env
cd ..
```

### Step 3: Edit Backend .env
Open `backend\.env` and update:
```env
MONGODB_URI=mongodb://localhost:27017/salary_management
JWT_ACCESS_SECRET=my-super-secret-key-at-least-32-chars-long-change-this
JWT_REFRESH_SECRET=my-refresh-secret-key-at-least-32-chars-long-change-this
```

### Step 4: Start MongoDB
```powershell
# Make sure MongoDB is running
mongod
```

### Step 5: Seed Database (Optional but Recommended)
```powershell
cd backend
npm run seed
```

This creates:
- Admin user: `admin@salaryapp.com` / `Admin@123`
- HR user: `hr@salaryapp.com` / `HR@123`
- 5 sample employees with attendance data

### Step 6: Start Application
```powershell
# From root directory
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Step 7: Login
1. Open browser: http://localhost:3000
2. Login with: `admin@salaryapp.com` / `Admin@123`

## 🎯 What's Next?

### Try These Features:

1. **View Dashboard** - See employee statistics and salary overview
2. **Add Employee** - Go to Employees → Add New
3. **Mark Attendance** - Go to Attendance → Mark attendance
4. **Generate Salary** - Go to Salary → Generate for current month
5. **Download Slip** - Go to Salary Sheets → Download PDF

## 📚 Documentation

- **[README.md](./README.md)** - Full project documentation
- **[INSTALLATION.md](./INSTALLATION.md)** - Detailed installation steps
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API_TESTING.md](./API_TESTING.md)** - API endpoints and testing

## ⚠️ Troubleshooting

**MongoDB not running:**
```powershell
mongod --dbpath "C:\data\db"
```

**Port already in use:**
```powershell
# Change PORT in backend\.env
PORT=5001
```

**Dependencies issue:**
```powershell
# Clean install
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install
```

## 🎓 Default Credentials

After seeding:

**Admin:**
- Email: `admin@salaryapp.com`
- Password: `Admin@123`

**HR:**
- Email: `hr@salaryapp.com`
- Password: `HR@123`

**Employees:**
- Email: `rajesh@example.com` (and others)
- Password: `Employee@123`

## ✅ Success Checklist

- [ ] MongoDB running
- [ ] Dependencies installed
- [ ] Environment files configured
- [ ] Database seeded
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login successfully
- [ ] Dashboard loads

**You're all set! 🎉**

For detailed documentation, see [README.md](./README.md)
