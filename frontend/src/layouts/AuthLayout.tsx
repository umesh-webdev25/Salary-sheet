import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center space-x-3 mb-6">
            <div className="bg-accent-500 p-2.5 rounded-2xl shadow-lg shadow-accent-500/20">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              PayScale <span className="text-accent-400 font-light text-2xl">Pro</span>
            </span>
          </div>
          <p className="text-primary-300 font-medium">
            Precision workforce management enterprise suite.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
