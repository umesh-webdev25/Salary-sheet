import { useEffect, useState } from 'react';
import { 
  BanknotesIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import type { SalarySheet } from '../../types';
import { format } from 'date-fns';

export default function EmployeeDashboard() {
  const { employee, user } = useAuthStore();
  const [salarySheets, setSalarySheets] = useState<SalarySheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingSheet, setViewingSheet] = useState<SalarySheet | null>(null);

  useEffect(() => {
    fetchSalarySheets();
  }, [employee, user]);

  const fetchSalarySheets = async () => {
    try {
      // Use employee ID from employee object or user object
      const employeeId = employee?._id || user?.employeeId;
      
      if (!employeeId) {
        console.error('No employee ID found');
        setLoading(false);
        return;
      }

      const response = await api.get(`/salary/employee/${employeeId}`);
      setSalarySheets(response.data.salarySheets);
    } catch (error) {
      console.error('Failed to load salary data:', error);
      toast.error('Failed to load salary data');
    } finally {
      setLoading(false);
    }
  };

  const downloadSalarySlip = async (month: string) => {
    try {
      const employeeId = employee?._id || user?.employeeId;
      if (!employeeId) {
        toast.error('Employee ID not found');
        return;
      }

      const response = await api.get(`/salary/download/${employeeId}/${month}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary-slip-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Salary slip downloaded');
    } catch (error) {
      toast.error('Failed to download salary slip');
    }
  };

  const handleViewSheet = async (month: string) => {
    try {
      const employeeId = employee?._id || user?.employeeId;
      if (!employeeId) {
        toast.error('Employee ID not found');
        return;
      }

      const response = await api.get(`/salary/${employeeId}/${month}`);
      setViewingSheet(response.data);
    } catch (error) {
      toast.error('Failed to load salary sheet');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  // Get display name from employee or user
  const displayName = employee?.personalInfo?.name || user?.name || 'User';
  const employeeCode = employee?.jobInfo?.employeeCode || 'N/A';
  const department = employee?.jobInfo?.department || 'N/A';
  const designation = employee?.jobInfo?.designation || 'N/A';
  const joinDate = employee?.jobInfo?.joinDate;

  // Calculate statistics from salary sheets
  const latestSalary = salarySheets[0];
  const totalEarned = salarySheets.reduce((sum, sheet) => sum + sheet.breakdown.netSalary, 0);
  const avgSalary = salarySheets.length > 0 ? totalEarned / salarySheets.length : 0;
  const paidCount = salarySheets.filter(s => s.status === 'paid').length;

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl p-6 text-white shadow-lg">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-accent-100">
            Here's your employment overview and salary information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-primary-600">Latest Salary</p>
                <p className="text-2xl font-bold text-primary-900">
                  {latestSalary ? formatCurrency(latestSalary.breakdown.netSalary) : '₹0'}
                </p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-primary-600">Average Salary</p>
                <p className="text-2xl font-bold text-primary-900">
                  {formatCurrency(avgSalary)}
                </p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DocumentTextIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-primary-600">Total Payslips</p>
                <p className="text-2xl font-bold text-primary-900">
                  {salarySheets.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <CalendarIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-primary-600">Paid Months</p>
                <p className="text-2xl font-bold text-primary-900">
                  {paidCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-primary-900">
              Employee Information
            </h2>
            <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600 mb-1">Employee Code</p>
              <p className="font-bold text-primary-900 text-lg">{employeeCode}</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600 mb-1">Department</p>
              <p className="font-bold text-primary-900 text-lg">{department}</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600 mb-1">Designation</p>
              <p className="font-bold text-primary-900 text-lg">{designation}</p>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-600 mb-1">Join Date</p>
              <p className="font-bold text-primary-900 text-lg">
                {joinDate ? format(new Date(joinDate), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Latest Salary Breakdown */}
        {latestSalary && (
          <div className="card">
            <h2 className="text-xl font-heading font-semibold mb-4 text-primary-900">
              Current Month Salary Breakdown ({latestSalary.month})
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <span className="bg-green-200 p-1 rounded mr-2">💰</span>
                  Earnings
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Basic Salary</span>
                    <span className="font-medium text-green-900">{formatCurrency(latestSalary.breakdown.basic)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">HRA</span>
                    <span className="font-medium text-green-900">{formatCurrency(latestSalary.breakdown.hra)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Transport Allowance</span>
                    <span className="font-medium text-green-900">{formatCurrency(latestSalary.breakdown.transportAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Medical Allowance</span>
                    <span className="font-medium text-green-900">{formatCurrency(latestSalary.breakdown.medicalAllowance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Special Allowance</span>
                    <span className="font-medium text-green-900">{formatCurrency(latestSalary.breakdown.specialAllowance)}</span>
                  </div>
                  {latestSalary.breakdown.overtimePay > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Overtime Pay</span>
                      <span className="font-medium text-green-900">{formatCurrency(latestSalary.breakdown.overtimePay)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-green-300 flex justify-between font-bold">
                    <span className="text-green-900">Gross Salary</span>
                    <span className="text-green-900">{formatCurrency(latestSalary.breakdown.grossSalary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                  <span className="bg-red-200 p-1 rounded mr-2">📉</span>
                  Deductions
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Provident Fund</span>
                    <span className="font-medium text-red-900">{formatCurrency(latestSalary.breakdown.pfAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Tax (TDS)</span>
                    <span className="font-medium text-red-900">{formatCurrency(latestSalary.breakdown.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Professional Tax</span>
                    <span className="font-medium text-red-900">{formatCurrency(latestSalary.breakdown.professionalTax)}</span>
                  </div>
                  {latestSalary.breakdown.absentDeduction > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-red-700">Absent Deduction</span>
                      <span className="font-medium text-red-900">{formatCurrency(latestSalary.breakdown.absentDeduction)}</span>
                    </div>
                  )}
                  {latestSalary.breakdown.otherDeductions > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-red-700">Other Deductions</span>
                      <span className="font-medium text-red-900">{formatCurrency(latestSalary.breakdown.otherDeductions)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-red-300 flex justify-between font-bold">
                    <span className="text-red-900">Total Deductions</span>
                    <span className="text-red-900">{formatCurrency(latestSalary.breakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="mt-4 bg-accent-50 rounded-lg p-4 border-2 border-accent-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-accent-900">Net Payable Salary</span>
                <span className="text-3xl font-bold text-accent-600">
                  {formatCurrency(latestSalary.breakdown.netSalary)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Salary History */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold mb-4 text-primary-900">
            Salary History
          </h2>
          {salarySheets.length === 0 ? (
            <div className="text-center py-12 bg-primary-50 rounded-lg">
              <DocumentTextIcon className="h-16 w-16 text-primary-300 mx-auto mb-3" />
              <p className="text-primary-600">No salary records found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {salarySheets.map((sheet) => (
                <div
                  key={sheet._id}
                  className="border border-primary-200 rounded-lg p-4 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CalendarIcon className="h-5 w-5 text-primary-500" />
                        <span className="font-bold text-lg text-primary-900">{sheet.month}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sheet.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : sheet.status === 'approved'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {sheet.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-primary-500">Gross</p>
                          <p className="font-semibold text-primary-800">{formatCurrency(sheet.breakdown.grossSalary)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-primary-500">Deductions</p>
                          <p className="font-semibold text-red-600">{formatCurrency(sheet.breakdown.totalDeductions)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-primary-500">Net Salary</p>
                          <p className="font-bold text-green-600 text-lg">{formatCurrency(sheet.breakdown.netSalary)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-primary-500">Working Days</p>
                          <p className="font-semibold text-primary-800">{sheet.attendanceSummary.daysPresent}/{sheet.attendanceSummary.totalWorkingDays}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewSheet(sheet.month)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => downloadSalarySlip(sheet.month)}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors text-sm font-medium"
                        title="Download PDF"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Salary Sheet View Modal */}
      {viewingSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-primary-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-heading font-bold text-primary-900">
                Salary Details - {viewingSheet.month}
              </h3>
              <button
                onClick={() => setViewingSheet(null)}
                className="text-primary-600 hover:text-primary-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Attendance Summary */}
              <div className="mb-6">
                <h4 className="font-semibold text-primary-900 mb-3">Attendance Summary</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-primary-600">Working Days</p>
                    <p className="font-bold text-xl text-primary-900">{viewingSheet.attendanceSummary.totalWorkingDays}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-primary-600">Present</p>
                    <p className="font-bold text-xl text-green-700">{viewingSheet.attendanceSummary.daysPresent}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-primary-600">Absent</p>
                    <p className="font-bold text-xl text-red-700">{viewingSheet.attendanceSummary.daysAbsent}</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-primary-600">Leaves</p>
                    <p className="font-bold text-xl text-yellow-700">{viewingSheet.attendanceSummary.leaves}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-primary-600">Half Days</p>
                    <p className="font-bold text-xl text-purple-700">{viewingSheet.attendanceSummary.halfDays}</p>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-primary-600">OT Hours</p>
                    <p className="font-bold text-xl text-indigo-700">{viewingSheet.attendanceSummary.overtimeHours}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary-900 mb-3 pb-2 border-b">Earnings</h4>
                  <div className="space-y-2">
                    {Object.entries({
                      'Basic Salary': viewingSheet.breakdown.basic,
                      'HRA': viewingSheet.breakdown.hra,
                      'Transport': viewingSheet.breakdown.transportAllowance,
                      'Medical': viewingSheet.breakdown.medicalAllowance,
                      'Special': viewingSheet.breakdown.specialAllowance,
                      ...(viewingSheet.breakdown.overtimePay > 0 && { 'Overtime': viewingSheet.breakdown.overtimePay }),
                      ...(viewingSheet.breakdown.bonus > 0 && { 'Bonus': viewingSheet.breakdown.bonus }),
                    }).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-primary-700">{key}</span>
                        <span className="font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t font-bold text-green-600">
                      <span>Gross Salary</span>
                      <span>{formatCurrency(viewingSheet.breakdown.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-900 mb-3 pb-2 border-b">Deductions</h4>
                  <div className="space-y-2">
                    {Object.entries({
                      'PF': viewingSheet.breakdown.pfAmount,
                      'Tax': viewingSheet.breakdown.taxAmount,
                      'Professional Tax': viewingSheet.breakdown.professionalTax,
                      ...(viewingSheet.breakdown.lateDeduction > 0 && { 'Late': viewingSheet.breakdown.lateDeduction }),
                      ...(viewingSheet.breakdown.absentDeduction > 0 && { 'Absent': viewingSheet.breakdown.absentDeduction }),
                      ...(viewingSheet.breakdown.otherDeductions > 0 && { 'Other': viewingSheet.breakdown.otherDeductions }),
                    }).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-primary-700">{key}</span>
                        <span className="font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t font-bold text-red-600">
                      <span>Total Deductions</span>
                      <span>{formatCurrency(viewingSheet.breakdown.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-accent-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-900">Net Payable</span>
                  <span className="text-2xl font-bold text-accent-600">
                    {formatCurrency(viewingSheet.breakdown.netSalary)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
