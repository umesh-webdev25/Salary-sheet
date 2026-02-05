import { useState, useEffect } from 'react';
import { PrinterIcon, EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import type { SalarySheet } from '../../types';

export default function SalarySheets() {
  const { user } = useAuthStore();
  const [salarySheets, setSalarySheets] = useState<SalarySheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [viewingSheet, setViewingSheet] = useState<SalarySheet | null>(null);

  useEffect(() => {
    fetchSalarySheets();
  }, [user]);

  const fetchSalarySheets = async () => {
    try {
      // If admin/hr, fetch all salary sheets. If employee, fetch only their sheets
      if (user?.role === 'admin' || user?.role === 'hr') {
        const response = await api.get('/salary');
        setSalarySheets(response.data);
      } else if (user?.employeeId) {
        const response = await api.get(`/salary/employee/${user?.employeeId}`);
        setSalarySheets(response.data.salarySheets);
      }
    } catch (error) {
      toast.error('Failed to load salary sheets');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSheet = async (employeeId: string, month: string) => {
    try {
      const response = await api.get(`/salary/${employeeId}/${month}`);
      setViewingSheet(response.data);
    } catch (error) {
      toast.error('Failed to load salary sheet');
    }
  };

  const handleDownload = async (employeeId: string, month: string) => {
    setDownloading(`${employeeId}-${month}`);
    try {
      const response = await api.get(`/salary/download/${employeeId}/${month}`, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary-slip-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = () => {
    if (viewingSheet) {
      window.print();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-900">
            Salary Sheets
          </h1>
          <p className="text-primary-600 mt-1">
            {user?.role === 'admin' || user?.role === 'hr' 
              ? 'View and manage all employee salary sheets' 
              : 'View and download your salary slips'}
          </p>
        </div>

      {salarySheets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-primary-600">No salary sheets found.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  {(user?.role === 'admin' || user?.role === 'hr') && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Employee Code
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {salarySheets.map((sheet) => (
                  <tr key={sheet._id} className="table-row">
                    {(user?.role === 'admin' || user?.role === 'hr') && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                          {typeof sheet.employeeId === 'object' 
                            ? sheet.employeeId.personalInfo.name 
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                          {typeof sheet.employeeId === 'object' 
                            ? sheet.employeeId.jobInfo.employeeCode 
                            : 'N/A'}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                      {sheet.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatCurrency(sheet.breakdown.basic)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatCurrency(sheet.breakdown.grossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {formatCurrency(sheet.breakdown.totalDeductions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-accent-600">
                      {formatCurrency(sheet.breakdown.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sheet.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : sheet.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sheet.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewSheet(
                            typeof sheet.employeeId === 'object' ? sheet.employeeId._id : sheet.employeeId as string, 
                            sheet.month
                          )}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(
                            typeof sheet.employeeId === 'object' ? sheet.employeeId._id : sheet.employeeId as string, 
                            sheet.month
                          )}
                          disabled={downloading === `${typeof sheet.employeeId === 'object' ? sheet.employeeId._id : sheet.employeeId}-${sheet.month}`}
                          className="text-green-600 hover:text-green-900 flex items-center disabled:opacity-50"
                          title="Download PDF"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    {/* Salary Sheet View Modal - Same as SalaryGeneration */}
    {viewingSheet && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-primary-200 px-6 py-4 flex items-center justify-between print:hidden">
            <h3 className="text-xl font-heading font-bold text-primary-900">
              Salary Sheet Details
            </h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="btn-secondary flex items-center space-x-2"
              >
                <PrinterIcon className="h-5 w-5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setViewingSheet(null)}
                className="text-primary-600 hover:text-primary-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 print:p-8">
            <div className="text-center mb-6 print:mb-8">
              <h1 className="text-2xl font-bold text-primary-900 print:text-3xl">
                SALARY SLIP
              </h1>
              <p className="text-primary-600 mt-1">
                For the month of {viewingSheet.month}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-primary-50 rounded-lg print:bg-gray-100">
              <div>
                <p className="text-sm text-primary-600">Employee Name</p>
                <p className="font-medium text-primary-900">
                  {typeof viewingSheet.employeeId === 'object' 
                    ? viewingSheet.employeeId.personalInfo.name 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-600">Employee Code</p>
                <p className="font-medium text-primary-900">
                  {typeof viewingSheet.employeeId === 'object' 
                    ? viewingSheet.employeeId.jobInfo.employeeCode 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-600">Designation</p>
                <p className="font-medium text-primary-900">
                  {typeof viewingSheet.employeeId === 'object' 
                    ? viewingSheet.employeeId.jobInfo.designation 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary-600">Department</p>
                <p className="font-medium text-primary-900">
                  {typeof viewingSheet.employeeId === 'object' 
                    ? viewingSheet.employeeId.jobInfo.department 
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-primary-900 mb-3">Attendance Summary</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-xs text-primary-600">Working Days</p>
                  <p className="font-bold text-primary-900">{viewingSheet.attendanceSummary.totalWorkingDays}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="text-xs text-primary-600">Present</p>
                  <p className="font-bold text-primary-900">{viewingSheet.attendanceSummary.daysPresent}</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <p className="text-xs text-primary-600">Absent</p>
                  <p className="font-bold text-primary-900">{viewingSheet.attendanceSummary.daysAbsent}</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <p className="text-xs text-primary-600">Leaves</p>
                  <p className="font-bold text-primary-900">{viewingSheet.attendanceSummary.leaves}</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <p className="text-xs text-primary-600">Half Days</p>
                  <p className="font-bold text-primary-900">{viewingSheet.attendanceSummary.halfDays}</p>
                </div>
                <div className="text-center p-2 bg-indigo-50 rounded">
                  <p className="text-xs text-primary-600">OT Hours</p>
                  <p className="font-bold text-primary-900">{viewingSheet.attendanceSummary.overtimeHours}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-primary-900 mb-3 pb-2 border-b">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-primary-700">Basic Salary</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.basic)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">HRA</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.hra)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Transport Allowance</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.transportAllowance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Medical Allowance</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.medicalAllowance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Special Allowance</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.specialAllowance)}</span>
                  </div>
                  {viewingSheet.breakdown.overtimePay > 0 && (
                    <div className="flex justify-between">
                      <span className="text-primary-700">Overtime Pay</span>
                      <span className="font-medium">{formatCurrency(viewingSheet.breakdown.overtimePay)}</span>
                    </div>
                  )}
                  {viewingSheet.breakdown.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-primary-700">Bonus</span>
                      <span className="font-medium">{formatCurrency(viewingSheet.breakdown.bonus)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Gross Salary</span>
                    <span className="text-green-600">{formatCurrency(viewingSheet.breakdown.grossSalary)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-3 pb-2 border-b">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-primary-700">Provident Fund</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.pfAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Tax (TDS)</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Professional Tax</span>
                    <span className="font-medium">{formatCurrency(viewingSheet.breakdown.professionalTax)}</span>
                  </div>
                  {viewingSheet.breakdown.lateDeduction > 0 && (
                    <div className="flex justify-between">
                      <span className="text-primary-700">Late Deduction</span>
                      <span className="font-medium">{formatCurrency(viewingSheet.breakdown.lateDeduction)}</span>
                    </div>
                  )}
                  {viewingSheet.breakdown.absentDeduction > 0 && (
                    <div className="flex justify-between">
                      <span className="text-primary-700">Absent Deduction</span>
                      <span className="font-medium">{formatCurrency(viewingSheet.breakdown.absentDeduction)}</span>
                    </div>
                  )}
                  {viewingSheet.breakdown.otherDeductions > 0 && (
                    <div className="flex justify-between">
                      <span className="text-primary-700">Other Deductions</span>
                      <span className="font-medium">{formatCurrency(viewingSheet.breakdown.otherDeductions)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">{formatCurrency(viewingSheet.breakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-accent-50 p-4 rounded-lg print:bg-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary-900">Net Payable Salary</span>
                <span className="text-2xl font-bold text-accent-600">
                  {formatCurrency(viewingSheet.breakdown.netSalary)}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-primary-200 text-center text-sm text-primary-600 print:mt-12">
              <p>This is a system-generated salary slip.</p>
              <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
