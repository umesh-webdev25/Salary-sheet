import { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import type { Employee, Attendance } from '../../types';

export default function AttendanceManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [attendance, setAttendance] = useState<Partial<Attendance>>({
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkIn: '',
    checkOut: '',
    overtimeHours: 0,
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    setLoading(true);
    try {
      await api.post('/attendance', {
        ...attendance,
        employeeId: selectedEmployee,
      });
      toast.success('Attendance marked successfully');
      setAttendance({
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkIn: '',
        checkOut: '',
        overtimeHours: 0,
      });
      setSelectedEmployee('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary-900">
          Mark Attendance
        </h1>
        <p className="text-primary-600 mt-1">
          Record daily attendance for employees
        </p>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Choose an employee...</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.personalInfo.name} ({emp.jobInfo.employeeCode})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={attendance.date}
                onChange={(e) => setAttendance({ ...attendance, date: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Status
              </label>
              <select
                value={attendance.status}
                onChange={(e) => setAttendance({ ...attendance, status: e.target.value as any })}
                className="input-field"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>
          </div>

          {attendance.status === 'present' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Check In
                </label>
                <input
                  type="time"
                  value={attendance.checkIn}
                  onChange={(e) => setAttendance({ ...attendance, checkIn: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Check Out
                </label>
                <input
                  type="time"
                  value={attendance.checkOut}
                  onChange={(e) => setAttendance({ ...attendance, checkOut: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Overtime Hours
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={attendance.overtimeHours}
                  onChange={(e) => setAttendance({ ...attendance, overtimeHours: parseFloat(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Marking Attendance...' : 'Mark Attendance'}
          </button>
        </form>
      </div>
    </div>
  );
}
