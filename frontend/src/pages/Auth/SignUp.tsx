import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passcodes do not match. Verification failed.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Security key must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Onboarding complete. You may now authenticate.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Onboarding failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-2xl relative">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight transition-all">
          Join the Fleet
        </h2>
        <p className="text-primary-400 font-medium text-sm">
          Initialize your corporate profile to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-primary-300 uppercase tracking-widest ml-1">
            Professional Identity
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500 group-focus-within:text-accent-400">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary-300 uppercase tracking-widest ml-1">
            Corporate Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500 group-focus-within:text-accent-400">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary-300 uppercase tracking-widest ml-1">
              Security Key
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500 group-focus-within:text-accent-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium"
                value={formData.password}
                onChange={handleChange}
                placeholder="Key"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-primary-300 uppercase tracking-widest ml-1">
              Confirm Key
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500 group-focus-within:text-accent-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retry Key"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full group bg-accent-500 hover:bg-accent-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl hover:shadow-accent-500/40 relative overflow-hidden flex items-center justify-center space-x-2"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Onboarding...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <span>Complete Onboarding</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-6">
        <div className="text-center">
          <p className="text-sm text-primary-400 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-accent-400 hover:text-accent-300 font-bold transition-colors underline decoration-accent-500/30 underline-offset-4">
              Return to Login
            </Link>
          </p>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-primary-500 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
