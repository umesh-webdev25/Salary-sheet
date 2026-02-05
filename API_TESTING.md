# API Testing Collection - Salary Management System

Use this collection with Postman, Thunder Client, or any API testing tool.

## Base URL
```
http://localhost:5000/api
```

---

## 1. Authentication

### 1.1 Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "hr"
}
```

### 1.2 Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@salaryapp.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@salaryapp.com",
    "role": "admin"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 1.3 Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

### 1.4 Get Current User
```http
GET /auth/me
Authorization: Bearer <accessToken>
```

### 1.5 Logout
```http
POST /auth/logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

---

## 2. Employees

### 2.1 Create Employee
```http
POST /employees
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "personalInfo": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+91-9876543210",
    "gender": "Female",
    "dateOfBirth": "1990-05-15",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    }
  },
  "jobInfo": {
    "department": "IT",
    "designation": "Software Engineer",
    "joinDate": "2024-01-15",
    "employmentType": "Full-Time"
  },
  "salaryInfo": {
    "basic": 50000,
    "hra": 15000,
    "allowances": {
      "transport": 3000,
      "medical": 2000,
      "special": 5000
    },
    "deductions": {
      "professionalTax": 200,
      "other": 0
    },
    "pfPercent": 12,
    "taxPercent": 10,
    "overtimeRate": 500
  },
  "bankDetails": {
    "accountNumber": "1234567890",
    "bankName": "HDFC Bank",
    "ifscCode": "HDFC0001234",
    "branch": "Mumbai Branch"
  }
}
```

### 2.2 Get All Employees
```http
GET /employees?page=1&limit=10&department=IT&search=jane
Authorization: Bearer <accessToken>
```

### 2.3 Get Employee by ID
```http
GET /employees/<employeeId>
Authorization: Bearer <accessToken>
```

### 2.4 Update Employee
```http
PUT /employees/<employeeId>
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "personalInfo": {
    "name": "Jane Smith Updated"
  },
  "salaryInfo": {
    "basic": 55000
  }
}
```

### 2.5 Delete Employee
```http
DELETE /employees/<employeeId>
Authorization: Bearer <accessToken>
```

### 2.6 Get Employee Statistics
```http
GET /employees/stats/overview
Authorization: Bearer <accessToken>
```

---

## 3. Attendance

### 3.1 Mark Attendance
```http
POST /attendance
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "employeeId": "65f1234567890abcdef12345",
  "date": "2024-11-20",
  "status": "present",
  "checkIn": "2024-11-20T09:00:00Z",
  "checkOut": "2024-11-20T18:00:00Z",
  "overtimeHours": 1,
  "lateByMinutes": 0,
  "remarks": "On time"
}
```

### 3.2 Update Attendance
```http
PUT /attendance/<attendanceId>
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "half-day",
  "remarks": "Left early"
}
```

### 3.3 Get Employee Attendance
```http
GET /attendance/employee/<employeeId>?startDate=2024-11-01&endDate=2024-11-30
Authorization: Bearer <accessToken>
```

### 3.4 Get Monthly Attendance (All Employees)
```http
GET /attendance/monthly/2024-11
Authorization: Bearer <accessToken>
```

### 3.5 Bulk Upload Attendance
```http
POST /attendance/bulk
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "records": [
    {
      "employeeCode": "EMP00001",
      "date": "2024-11-20",
      "status": "present",
      "checkIn": "2024-11-20T09:00:00Z",
      "checkOut": "2024-11-20T18:00:00Z"
    },
    {
      "employeeCode": "EMP00002",
      "date": "2024-11-20",
      "status": "absent"
    }
  ]
}
```

### 3.6 Delete Attendance
```http
DELETE /attendance/<attendanceId>
Authorization: Bearer <accessToken>
```

---

## 4. Salary Management

### 4.1 Generate Monthly Salary
```http
POST /salary/generate
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "month": "2024-11",
  "employeeIds": []
}
```

**Note:** Leave `employeeIds` empty to generate for all active employees.

### 4.2 Get Employee Salary Sheets
```http
GET /salary/employee/<employeeId>?page=1&limit=12
Authorization: Bearer <accessToken>
```

### 4.3 Get Specific Month Salary
```http
GET /salary/<employeeId>/2024-11
Authorization: Bearer <accessToken>
```

### 4.4 Download Salary Slip (PDF)
```http
GET /salary/download/<employeeId>/2024-11
Authorization: Bearer <accessToken>
```

**Note:** This returns a PDF file.

### 4.5 Get Monthly Salary Report
```http
GET /salary/report/2024-11?department=IT&status=generated
Authorization: Bearer <accessToken>
```

### 4.6 Approve Salary Sheet
```http
PUT /salary/<salarySheetId>/approve
Authorization: Bearer <accessToken>
```

### 4.7 Mark Salary as Paid
```http
PUT /salary/<salarySheetId>/pay
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "paymentMode": "bank-transfer",
  "transactionRef": "TXN123456789",
  "remarks": "Salary paid successfully"
}
```

### 4.8 Get Dashboard Statistics
```http
GET /salary/stats/dashboard
Authorization: Bearer <accessToken>
```

---

## 5. Testing Workflow

### Step 1: Authentication
1. Login as admin
2. Copy `accessToken` from response
3. Use token in `Authorization: Bearer <token>` header for all subsequent requests

### Step 2: Create Employees
1. Create 3-5 employees using POST /employees
2. Note their IDs

### Step 3: Mark Attendance
1. Mark attendance for current month using POST /attendance
2. Create multiple entries for different dates

### Step 4: Generate Salary
1. Use POST /salary/generate with current month (YYYY-MM format)
2. Check response for generation results

### Step 5: View & Download
1. GET /salary/report/:month to see all generated salaries
2. GET /salary/download/:employeeId/:month to download PDF

---

## Example Complete Flow

```bash
# 1. Login
POST /auth/login
{
  "email": "admin@salaryapp.com",
  "password": "Admin@123"
}
# Save accessToken

# 2. Create Employee
POST /employees
Authorization: Bearer <token>
{
  "personalInfo": { "name": "Test Employee", "email": "test@example.com", "phone": "1234567890" },
  "jobInfo": { "department": "IT", "designation": "Developer", "joinDate": "2024-01-01" },
  "salaryInfo": { "basic": 50000, "hra": 10000, "pfPercent": 12, "taxPercent": 10 }
}
# Save employee ID

# 3. Mark Attendance (for 20 days)
POST /attendance
{
  "employeeId": "<employee-id>",
  "date": "2024-11-01",
  "status": "present",
  "checkIn": "2024-11-01T09:00:00Z",
  "checkOut": "2024-11-01T18:00:00Z"
}
# Repeat for multiple dates

# 4. Generate Salary
POST /salary/generate
{
  "month": "2024-11"
}

# 5. Download Salary Slip
GET /salary/download/<employee-id>/2024-11
```

---

## Environment Variables Needed

Ensure these are set in backend/.env:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/salary_management
JWT_ACCESS_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-secret>
```

---

## Common Response Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Server Error

---

**Happy Testing! 🚀**

For issues, check backend logs with `npm run dev` in backend folder.
