import { useState, useEffect } from 'react';
import { PrinterIcon, EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import type { Employee, SalarySheet } from '../../types';

export default function SalaryGeneration() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [generatedSheets, setGeneratedSheets] = useState<SalarySheet[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [viewingSheet, setViewingSheet] = useState<SalarySheet | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error('Failed to load employees');
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp._id));
    }
  };

  const handleSelectEmployee = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleGenerate = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }

    setLoading(true);
    try {
      const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
      await api.post('/salary/generate', {
        month: monthStr,
        employeeIds: selectedEmployees,
      });
      
      // Fetch the generated salary sheets
      const sheets = await Promise.all(
        selectedEmployees.map(empId => 
          api.get(`/salary/${empId}/${monthStr}`)
            .then(res => res.data)
            .catch(() => null)
        )
      );
      
      const validSheets = sheets.filter(sheet => sheet !== null);
      setGeneratedSheets(validSheets);
      setShowResults(true);
      
      toast.success(`Salary generated for ${selectedEmployees.length} employee(s)`);
      setSelectedEmployees([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate salary');
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-900">
            Generate Salary
          </h1>
          <p className="text-primary-600 mt-1">
            Process monthly salary for selected employees
          </p>
        </div>

        <div className="card">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="input-field"
              >
                {months.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="input-field"
                min="2020"
                max="2030"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold">
                Select Employees
              </h3>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-accent-600 hover:text-accent-700 text-sm font-medium"
              >
                {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <div
                  key={employee._id}
                  onClick={() => handleSelectEmployee(employee._id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedEmployees.includes(employee._id)
                      ? 'border-accent-500 bg-accent-50'
                      : 'border-primary-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee._id)}
                      onChange={() => handleSelectEmployee(employee._id)}
                      className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-primary-300 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-primary-900">
                        {employee.personalInfo.name}
                      </p>
                      <p className="text-xs text-primary-500">
                        {employee.jobInfo.employeeCode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-primary-200">
            <p className="text-sm text-primary-600">
              {selectedEmployees.length} employee(s) selected
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading || selectedEmployees.length === 0}
              className="btn-primary"
            >
              {loading ? 'Generating...' : 'Generate Salary'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Salary Sheets Results */}
      {showResults && generatedSheets.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold">
              Generated Salary Sheets
            </h3>
            <button
              onClick={() => setShowResults(false)}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              Close
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Gross Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {generatedSheets.map((sheet) => {
                  const employee = typeof sheet.employeeId === 'object' 
                    ? sheet.employeeId 
                    : employees.find(e => e._id === sheet.employeeId);
                  
                  return (
                    <tr key={sheet._id} className="table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary-900">
                          {employee?.personalInfo?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-primary-500">
                          {employee?.jobInfo?.employeeCode || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                        {sheet.month}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewSheet(
                              typeof sheet.employeeId === 'string' ? sheet.employeeId : sheet.employeeId._id,
                              sheet.month
                            )}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(
                              typeof sheet.employeeId === 'string' ? sheet.employeeId : sheet.employeeId._id,
                              sheet.month
                            )}
                            disabled={downloading === `${sheet.employeeId}-${sheet.month}`}
                            className="text-green-600 hover:text-green-900 flex items-center disabled:opacity-50"
                            title="Download PDF"
                          >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    {/* Salary Sheet View Modal */}
    {viewingSheet && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
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

          {/* Salary Sheet Content */}
          <div className="p-6 print:p-8" id="salary-sheet-print">
            {/* Header */}
            <div className="text-center mb-6 print:mb-8">
              <h1 className="text-2xl font-bold text-primary-900 print:text-3xl">
                SALARY SLIP
              </h1>
              <p className="text-primary-600 mt-1">
                For the month of {viewingSheet.month}
              </p>
            </div>

            {/* Employee Details */}
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

            {/* Attendance Summary */}
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

            {/* Earnings and Deductions */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Earnings */}
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

              {/* Deductions */}
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

            {/* Net Salary */}
            <div className="bg-accent-50 p-4 rounded-lg print:bg-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary-900">Net Payable Salary</span>
                <span className="text-2xl font-bold text-accent-600">
                  {formatCurrency(viewingSheet.breakdown.netSalary)}
                </span>
              </div>
            </div>

            {/* Footer */}
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
