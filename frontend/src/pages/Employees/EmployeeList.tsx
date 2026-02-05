import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import type { Employee } from '../../types';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [search, department]);

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (department) params.append('department', department);

      const response = await api.get(`/employees?${params}`);
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to terminate this employee?')) return;

    try {
      await api.delete(`/employees/${id}`);
      toast.success('Employee terminated');
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to terminate employee');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-900">Employees</h1>
          <p className="text-primary-600 mt-1">Manage your workforce</p>
        </div>
        <Link to="/employees/new" className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search by name, email, or code..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {employees.map((employee) => (
                  <tr key={employee._id} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-900">
                      {employee.jobInfo.employeeCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary-900">
                        {employee.personalInfo.name}
                      </div>
                      <div className="text-sm text-primary-500">{employee.personalInfo.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {employee.jobInfo.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                      {employee.jobInfo.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <Link
                        to={`/employees/${employee._id}/edit`}
                        className="text-accent-600 hover:text-accent-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {employees.length === 0 && (
              <div className="text-center py-12 text-primary-600">
                No employees found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
