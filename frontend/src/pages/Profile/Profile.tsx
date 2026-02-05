import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CreditCard,
  Building,
  IndianRupee,
  Edit3,
  Save,
  X,
  ShieldCheck,
  Building2,
  Hash,
  MapPinned,
  Languages,
  BadgeCheck
} from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

type TabType = 'personal' | 'professional' | 'financial';

export default function Profile() {
  const { user, employee } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      dateOfBirth: '',
      gender: ''
    },
    bankDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      branch: ''
    }
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        personalInfo: {
          name: employee.personalInfo?.name || '',
          email: employee.personalInfo?.email || '',
          phone: employee.personalInfo?.phone || '',
          address: {
            street: employee.personalInfo?.address?.street || '',
            city: employee.personalInfo?.address?.city || '',
            state: employee.personalInfo?.address?.state || '',
            zipCode: employee.personalInfo?.address?.zipCode || '',
            country: employee.personalInfo?.address?.country || 'India'
          },
          dateOfBirth: employee.personalInfo?.dateOfBirth ?
            new Date(employee.personalInfo.dateOfBirth).toISOString().split('T')[0] : '',
          gender: employee.personalInfo?.gender || ''
        },
        bankDetails: {
          accountNumber: employee.bankDetails?.accountNumber || '',
          bankName: employee.bankDetails?.bankName || '',
          ifscCode: employee.bankDetails?.ifscCode || '',
          branch: employee.bankDetails?.branch || ''
        }
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setLoading(true);
    try {
      await api.put(`/employees/${employee._id}`, formData);
      setEditing(false);
      toast.success('Profile updated successfully');
      // Note: In a real app, you'd want to refresh the global state here
      // but we'll assume the back-end update is successful
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-primary-100 p-4 rounded-full mb-4 inline-block">
            <UserIcon className="w-12 h-12 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-primary-900">Access Denied</h2>
          <p className="text-primary-600 mt-2">Please login to view your profile.</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };


  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === id
        ? 'bg-accent-500 text-white shadow-lg shadow-accent-200 scale-105'
        : 'bg-white text-primary-600 hover:bg-primary-50'
        }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'text-primary-400'}`} />
      <span className="font-semibold">{label}</span>
    </button>
  );

  const DetailItem = ({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) => (
    <div className="flex items-start space-x-4 p-4 rounded-xl bg-primary-50/50 border border-primary-100 hover:border-accent-200 transition-colors">
      <div className="bg-white p-2.5 rounded-lg shadow-sm border border-primary-100">
        <Icon className="w-5 h-5 text-accent-600" />
      </div>
      <div>
        <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-base font-semibold text-primary-900">{value || '---'}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      {/* Profile Header Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-accent-500 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary-400 opacity-5 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-inner">
              <span className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-primary-900 w-8 h-8 rounded-full shadow-lg" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{user.name}</h1>
                <span className="px-3 py-1 rounded-full bg-accent-500/20 backdrop-blur-md border border-accent-500/30 text-accent-300 text-sm font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {user.role}
                </span>
              </div>
              <p className="text-primary-200 text-lg flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-5 h-5 opacity-60" />
                {user.email}
              </p>
            </div>

            {employee && (
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent-400" />
                  <div>
                    <p className="text-[10px] text-primary-400 font-bold uppercase">Department</p>
                    <p className="text-sm font-medium">{employee.jobInfo.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                  <Hash className="w-5 h-5 text-accent-400" />
                  <div>
                    <p className="text-[10px] text-primary-400 font-bold uppercase">Employee ID</p>
                    <p className="text-sm font-medium">{employee.jobInfo.employeeCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                  <BadgeCheck className="w-5 h-5 text-accent-400" />
                  <div>
                    <p className="text-[10px] text-primary-400 font-bold uppercase">Designation</p>
                    <p className="text-sm font-medium">{employee.jobInfo.designation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto self-center md:self-start">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-bold"
            >
              {editing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              {editing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
        <TabButton id="personal" label="Personal Info" icon={UserIcon} />
        <TabButton id="professional" label="Job Details" icon={Briefcase} />
        <TabButton id="financial" label="Financial & Bank" icon={IndianRupee} />
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (editing ? '-editing' : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="card overflow-hidden border-0 shadow-2xl shadow-primary-200/50"
        >
          {editing ? (
            <form onSubmit={handleSubmit} className="p-2 space-y-8">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-primary-100 pb-4">
                    <h3 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                      <UserIcon className="text-accent-600" />
                      Edit Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.personalInfo.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, name: e.target.value }
                        })}
                        className="input-field ring-offset-2 focus:ring-accent-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, phone: e.target.value }
                        })}
                        className="input-field shadow-sm"
                        placeholder="+91 00000 00000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value }
                        })}
                        className="input-field shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">Gender</label>
                      <select
                        value={formData.personalInfo.gender}
                        onChange={(e) => setFormData({
                          ...formData,
                          personalInfo: { ...formData.personalInfo, gender: e.target.value }
                        })}
                        className="input-field shadow-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-bold text-primary-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-primary-600 ml-1">Street</label>
                        <input
                          type="text"
                          value={formData.personalInfo.address.street}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo,
                              address: { ...formData.personalInfo.address, street: e.target.value }
                            }
                          })}
                          className="input-field shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary-600 ml-1">City</label>
                        <input
                          type="text"
                          value={formData.personalInfo.address.city}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo,
                              address: { ...formData.personalInfo.address, city: e.target.value }
                            }
                          })}
                          className="input-field shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-primary-600 ml-1">State</label>
                        <input
                          type="text"
                          value={formData.personalInfo.address.state}
                          onChange={(e) => setFormData({
                            ...formData,
                            personalInfo: {
                              ...formData.personalInfo,
                              address: { ...formData.personalInfo.address, state: e.target.value }
                            }
                          })}
                          className="input-field shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-primary-100 pb-4">
                    <h3 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                      <Building2 className="text-accent-600" />
                      Bank Account Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">Account Number</label>
                      <input
                        type="text"
                        value={formData.bankDetails.accountNumber}
                        onChange={(e) => setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                        })}
                        className="input-field"
                        placeholder="XXXX XXXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">Bank Name</label>
                      <input
                        type="text"
                        value={formData.bankDetails.bankName}
                        onChange={(e) => setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                        })}
                        className="input-field"
                        placeholder="Bank Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">IFSC Code</label>
                      <input
                        type="text"
                        value={formData.bankDetails.ifscCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, ifscCode: e.target.value }
                        })}
                        className="input-field"
                        placeholder="AAAA0123456"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-600 ml-1">Branch</label>
                      <input
                        type="text"
                        value={formData.bankDetails.branch}
                        onChange={(e) => setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, branch: e.target.value }
                        })}
                        className="input-field"
                        placeholder="Branch Name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-primary-400">
                  <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                  <p className="max-w-xs font-medium">Job information can only be updated by the HR Department.</p>
                </div>
              )}

              <div className="flex justify-end pt-8 border-t border-primary-100 gap-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-8 py-3 rounded-2xl bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all font-bold"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-10 py-3 rounded-2xl bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-200 transition-all font-bold disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-2">
              {activeTab === 'personal' && employee && (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DetailItem label="Full Name" value={employee.personalInfo?.name || ''} icon={UserIcon} />
                      <DetailItem label="Phone Number" value={employee.personalInfo?.phone || ''} icon={Phone} />
                      <DetailItem label="Email Address" value={employee.personalInfo?.email || ''} icon={Mail} />
                      <DetailItem
                        label="Date of Birth"
                        value={employee.personalInfo?.dateOfBirth ? new Date(employee.personalInfo.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not provided'}
                        icon={Calendar}
                      />
                      <DetailItem label="Gender" value={employee.personalInfo?.gender || ''} icon={Languages} />
                    </div>
                  </section>

                  <section className="pt-6 border-t border-primary-50">
                    <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <MapPinned className="w-4 h-4" />
                      Living Address
                    </h3>
                    {employee.personalInfo.address ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8">
                          <DetailItem
                            label="Residential Address"
                            value={`${employee.personalInfo.address.street}, ${employee.personalInfo.address.city}, ${employee.personalInfo.address.state} - ${employee.personalInfo.address.zipCode}`}
                            icon={MapPin}
                          />
                        </div>
                        <div className="md:col-span-4">
                          <DetailItem label="Country" value={employee.personalInfo?.address?.country || ''} icon={Building} />
                        </div>
                      </div>
                    ) : (
                      <p className="text-primary-400 italic">Address information not available.</p>
                    )}
                  </section>
                </div>
              )}

              {activeTab === 'professional' && employee && (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DetailItem label="Department" value={employee.jobInfo.department} icon={Building2} />
                      <DetailItem label="Designation" value={employee.jobInfo.designation} icon={BadgeCheck} />
                      <DetailItem label="Employee Code" value={employee.jobInfo.employeeCode} icon={Hash} />
                      <DetailItem
                        label="Joining Date"
                        value={new Date(employee.jobInfo.joinDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        icon={Calendar}
                      />
                      <DetailItem label="Employment Type" value={employee.jobInfo.employmentType} icon={Briefcase} />
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'financial' && employee && (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Salary Structure
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <DetailItem label="Basic Salary" value={`₹${employee.salaryInfo.basic.toLocaleString()}`} icon={CreditCard} />
                      <DetailItem label="House Rent" value={`₹${employee.salaryInfo.hra.toLocaleString()}`} icon={MapPin} />
                      <DetailItem label="Allowance" value={`₹${employee.salaryInfo.allowances.transport.toLocaleString()}`} icon={Briefcase} />
                      <DetailItem label="PF Share" value={`${employee.salaryInfo.pfPercent}%`} icon={Hash} />
                    </div>
                  </section>

                  <section className="pt-6 border-t border-primary-50">
                    <h3 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Banking Information
                    </h3>
                    {employee.bankDetails ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DetailItem label="Account No" value={employee.bankDetails?.accountNumber || ''} icon={Hash} />
                        <DetailItem label="Bank Name" value={employee.bankDetails?.bankName || ''} icon={Building2} />
                        <DetailItem label="IFSC Code" value={employee.bankDetails?.ifscCode || ''} icon={CreditCard} />
                        <DetailItem label="Branch" value={employee.bankDetails?.branch || ''} icon={MapPin} />
                      </div>
                    ) : (
                      <p className="text-primary-400 italic">Banking information not available.</p>
                    )}
                  </section>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
