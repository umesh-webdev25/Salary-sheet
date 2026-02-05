import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeForm from './pages/Employees/EmployeeForm';
import AttendanceManagement from './pages/Attendance/AttendanceManagement';
import SalaryGeneration from './pages/Salary/SalaryGeneration';
import SalarySheets from './pages/Salary/SalarySheets';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Home Route */}
        <Route path="/" element={<PublicHome />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            
            {/* Employee Management */}
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id/edit" element={<EmployeeForm />} />
            
            {/* Attendance */}
            <Route path="/attendance" element={<AttendanceManagement />} />
            
            {/* Salary */}
            <Route path="/salary/generate" element={<SalaryGeneration />} />
            <Route path="/salary/sheets" element={<SalarySheets />} />
            
            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Public Home Component
function PublicHome() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
}

// Protected Route Component
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Dashboard Redirect based on role
function DashboardRedirect() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'admin' || user.role === 'hr') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/employee/dashboard" replace />;
}

export default App;
