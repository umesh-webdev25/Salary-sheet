import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  BanknotesIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import type { DashboardStats, SalaryStats, Employee } from '../../types';

interface AttendanceStats {
  attendanceRate: number;
  currentMonth: string;
  totalWorkingDays: number;
  totalActiveEmployees: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salaryStats, setSalaryStats] = useState<SalaryStats | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [employeeStats, salaryData, attendanceData, employees] = await Promise.all([
        api.get('/employees/stats/overview'),
        api.get('/salary/stats/dashboard'),
        api.get('/attendance/stats/dashboard'),
        api.get('/employees?page=1&limit=5'),
      ]);

      setStats(employeeStats.data);
      setSalaryStats(salaryData.data);
      setAttendanceStats(attendanceData.data);
      setRecentEmployees(employees.data.employees);
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary-900">
          Dashboard
        </h1>
        <p className="text-primary-600 mt-1">
          Welcome back! Here's what's happening in your organization.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={UserGroupIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(salaryStats?.monthlyStats.totalNet || 0)}
          icon={BanknotesIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceStats?.attendanceRate || 0}%`}
          icon={CalendarIcon}
          color="bg-purple-500"
        />
        <StatCard
          title="Growth"
          value={`${stats?.growthRate && stats.growthRate >= 0 ? '+' : ''}${stats?.growthRate || 0}%`}
          icon={ArrowTrendingUpIcon}
          color="bg-orange-500"
        />
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold mb-4">
            Employees by Department
          </h3>
          <div className="space-y-3">
            {stats?.departmentStats.map((dept) => (
              <div key={dept._id} className="flex items-center justify-between">
                <span className="text-sm text-primary-700">{dept._id}</span>
                <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                  {dept.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold mb-4">
            Salary Status (Current Month)
          </h3>
          <div className="space-y-3">
            {salaryStats?.statusStats.map((status) => (
              <div key={status._id} className="flex items-center justify-between">
                <span className="text-sm text-primary-700 capitalize">{status._id}</span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {status.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Employees */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold">
            Recent Employees
          </h3>
          <Link to="/employees" className="text-accent-600 hover:text-accent-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-primary-200">
              {recentEmployees.map((employee) => (
                <tr key={employee._id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-900">
                      {employee.personalInfo.name}
                    </div>
                    <div className="text-sm text-primary-500">
                      {employee.jobInfo.employeeCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                    {employee.jobInfo.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                    {employee.jobInfo.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/employees/new" className="card hover:shadow-card-hover text-center group cursor-pointer">
          <UserGroupIcon className="h-10 w-10 mx-auto text-accent-500 group-hover:scale-110 transition-transform" />
          <h4 className="mt-3 font-heading font-semibold text-primary-900">Add Employee</h4>
          <p className="text-sm text-primary-600 mt-1">Create new employee profile</p>
        </Link>
        <Link to="/attendance" className="card hover:shadow-card-hover text-center group cursor-pointer">
          <CalendarIcon className="h-10 w-10 mx-auto text-accent-500 group-hover:scale-110 transition-transform" />
          <h4 className="mt-3 font-heading font-semibold text-primary-900">Mark Attendance</h4>
          <p className="text-sm text-primary-600 mt-1">Record daily attendance</p>
        </Link>
        <Link to="/salary/generate" className="card hover:shadow-card-hover text-center group cursor-pointer">
          <BanknotesIcon className="h-10 w-10 mx-auto text-accent-500 group-hover:scale-110 transition-transform" />
          <h4 className="mt-3 font-heading font-semibold text-primary-900">Generate Salary</h4>
          <p className="text-sm text-primary-600 mt-1">Process monthly payroll</p>
        </Link>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-primary-600">{title}</p>
          <p className="text-2xl font-heading font-bold text-primary-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
