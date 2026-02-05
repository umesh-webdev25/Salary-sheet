export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  employeeId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other';
    photo?: string;
  };
  jobInfo: {
    employeeCode: string;
    department: string;
    designation: string;
    joinDate: string;
    employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
    reportingManager?: string;
  };
  salaryInfo: {
    basic: number;
    hra: number;
    allowances: {
      transport: number;
      medical: number;
      special: number;
    };
    deductions: {
      professionalTax: number;
      other: number;
    };
    pfPercent: number;
    taxPercent: number;
    overtimeRate: number;
  };
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    branch?: string;
  };
  status: 'Active' | 'Inactive' | 'Terminated';
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  employeeId: string | Employee;
  date: string;
  status: 'present' | 'absent' | 'leave' | 'half-day' | 'holiday';
  checkIn?: string;
  checkOut?: string;
  workingHours: number;
  overtimeHours: number;
  lateByMinutes: number;
  leaveType?: 'casual' | 'sick' | 'annual' | 'unpaid';
  remarks?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalarySheet {
  _id: string;
  employeeId: string | Employee;
  month: string;
  year: number;
  monthNumber: number;
  attendanceSummary: {
    totalWorkingDays: number;
    daysPresent: number;
    daysAbsent: number;
    leaves: number;
    halfDays: number;
    overtimeHours: number;
  };
  breakdown: {
    basic: number;
    hra: number;
    transportAllowance: number;
    medicalAllowance: number;
    specialAllowance: number;
    overtimePay: number;
    bonus: number;
    pfAmount: number;
    taxAmount: number;
    professionalTax: number;
    lateDeduction: number;
    absentDeduction: number;
    otherDeductions: number;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
  };
  pdfUrl?: string;
  status: 'draft' | 'generated' | 'approved' | 'paid';
  paymentDate?: string;
  paymentMode?: 'bank-transfer' | 'cash' | 'cheque';
  transactionRef?: string;
  generatedBy?: string;
  approvedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  employee?: Employee;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalEmployees: number;
  departmentStats: Array<{ _id: string; count: number }>;
  employmentTypeStats: Array<{ _id: string; count: number }>;
  growthRate: number;
  newEmployeesThisMonth: number;
}

export interface SalaryStats {
  currentMonth: string;
  monthlyStats: {
    totalGross: number;
    totalDeductions: number;
    totalNet: number;
    count: number;
  };
  statusStats: Array<{ _id: string; count: number }>;
}
