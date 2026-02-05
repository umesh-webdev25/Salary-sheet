import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      gender: 'Male',
    },
    jobInfo: {
      department: 'IT',
      designation: '',
      joinDate: '',
      employmentType: 'Full-Time',
    },
    salaryInfo: {
      basic: '',
      hra: '',
      allowances: { transport: '', medical: '', special: '' },
      deductions: { professionalTax: '', other: '' },
      pfPercent: '',
      taxPercent: '',
      overtimeRate: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/employees', formData);
      toast.success('Employee created successfully!');
      navigate('/employees');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-heading font-bold">Add New Employee</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.personalInfo.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, name: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                className="input-field"
                value={formData.personalInfo.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, email: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                required
                pattern="[0-9]+"
                className="input-field"
                value={formData.personalInfo.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, phone: value },
                  });
                }}
                placeholder="Enter phone number (digits only)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                className="input-field"
                value={formData.personalInfo.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, gender: e.target.value as any },
                  })
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold mb-4">Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Department *</label>
              <select
                className="input-field"
                required
                value={formData.jobInfo.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobInfo: { ...formData.jobInfo, department: e.target.value },
                  })
                }
              >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Designation *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.jobInfo.designation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobInfo: { ...formData.jobInfo, designation: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Join Date *</label>
              <input
                type="date"
                required
                className="input-field"
                value={formData.jobInfo.joinDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobInfo: { ...formData.jobInfo, joinDate: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Employment Type</label>
              <select
                className="input-field"
                value={formData.jobInfo.employmentType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobInfo: { ...formData.jobInfo, employmentType: e.target.value as any },
                  })
                }
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold mb-4">Salary Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Basic Salary *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.salaryInfo.basic}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryInfo: { ...formData.salaryInfo, basic: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">HRA</label>
              <input
                type="text"
                className="input-field"
                value={formData.salaryInfo.hra}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryInfo: { ...formData.salaryInfo, hra: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Transport Allowance</label>
              <input
                type="text"
                className="input-field"
                value={formData.salaryInfo.allowances.transport}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryInfo: {
                      ...formData.salaryInfo,
                      allowances: {
                        ...formData.salaryInfo.allowances,
                        transport: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
