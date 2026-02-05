import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ChevronLeft,
  Info
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { user, employee, accessToken, refreshToken } = response.data;

      setAuth(user, employee, accessToken, refreshToken);
      toast.success('Access Granted. Welcome back.');
      // Keep navigate to dashboard as per logic change in App.tsx
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-2xl relative">
      <div className="absolute top-0 right-0 p-6 opacity-20 group cursor-help">
        <Info className="w-5 h-5 text-accent-400" />
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
          Secure Login
        </h2>
        <p className="text-primary-400 font-medium text-sm">
          Authenticated access to enterprise dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-primary-300 uppercase tracking-widest ml-1">
            Corporate Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-accent-400 text-primary-500">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary-300 uppercase tracking-widest ml-1 flex justify-between">
            <span>Security Key</span>
            <span className="text-[10px] text-accent-500 hover:underline cursor-pointer">Forgot?</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-accent-400 text-primary-500">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

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
                <span>Authenticating...</span>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <span>Authorize Access</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </form>

      <div className="mt-10 space-y-8">
        <div className="text-center">
          <p className="text-sm text-primary-400 font-medium">
            New to the platform?{' '}
            <Link to="/signup" className="text-accent-400 hover:text-accent-300 font-bold transition-colors underline decoration-accent-500/30 underline-offset-4">
              Begin Onboarding
            </Link>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-accent-500/5 border border-accent-500/10 space-y-3">
          <div className="flex items-center space-x-2 text-accent-400 mb-1">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pilot Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-primary-500 font-bold uppercase mb-0.5 tracking-tighter">Identity</p>
              <p className="text-xs text-primary-300 font-medium">admin@salaryapp.com</p>
            </div>
            <div>
              <p className="text-[10px] text-primary-500 font-bold uppercase mb-0.5 tracking-tighter">Access Key</p>
              <p className="text-xs text-primary-300 font-medium italic">Admin@123</p>
            </div>
          </div>
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
