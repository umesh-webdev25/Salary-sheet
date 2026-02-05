import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Wallet,
  Calendar,
  BarChart3,
  ShieldCheck,
  Zap,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Globe
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Workforce Central',
      description: 'Centralized employee hub with intuitive profiles and dynamic record management.',
      color: 'bg-blue-500'
    },
    {
      icon: Calendar,
      title: 'Smart Attendance',
      description: 'Precision tracking for shifts, leaves, and overtime with automated daily insights.',
      color: 'bg-purple-500'
    },
    {
      icon: Wallet,
      title: 'Automated Payroll',
      description: 'Error-free salary calculations incorporating complex deductions and allowances instantly.',
      color: 'bg-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Visual workforce metrics and financial forecasting to drive better business decisions.',
      color: 'bg-orange-500'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security',
      description: 'Military-grade encryption and granular role-based access for total data sovereignty.',
      color: 'bg-cyan-500'
    },
    {
      icon: Zap,
      title: 'Real-time Pulse',
      description: 'Instant synchronization across todos, updates, and payroll approvals.',
      color: 'bg-rose-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-accent-500 selection:text-white overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="bg-gradient-to-tr from-accent-600 to-accent-400 p-2 rounded-xl shadow-lg shadow-accent-500/20 group-hover:rotate-12 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              PayScale <span className="text-accent-400 font-light">Pro</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-primary-200">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <Link to="/login" className="text-sm font-semibold hover:text-accent-400 transition-colors">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-44 pb-24 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="w-3 h-3" />
            <span>The Future of Payroll is Here</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
          >
            Manage Your Team <br />
            <span className="bg-gradient-to-r from-accent-400 via-primary-400 to-accent-600 bg-clip-text text-transparent">
              With Precision.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-primary-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the most fluid, automated payroll system designed for high-growth companies.
            Onboard, track, and pay your workforce in one seamless interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              to="/signup"
              className="group flex items-center space-x-2 bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-accent-500 hover:text-white transition-all shadow-2xl hover:shadow-accent-500/40 transform hover:-translate-y-1"
            >
              <span>Launch Your Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center space-x-2 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white font-bold px-10 py-5 rounded-2xl border border-white/10 transition-all"
            >
              <span>Request a Demo</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
          >
            <div className="flex items-center justify-center space-x-2 font-black text-2xl uppercase tracking-tighter italic"> <Globe className="w-6 h-6" /> Global Inc </div>
            <div className="flex items-center justify-center space-x-2 font-black text-2xl uppercase tracking-tighter italic font-serif"> <Layers className="w-6 h-6" /> TechSoft </div>
            <div className="flex items-center justify-center space-x-2 font-black text-2xl uppercase tracking-tighter italic"> <Zap className="w-6 h-6" /> FastFlow </div>
            <div className="flex items-center justify-center space-x-2 font-black text-2xl uppercase tracking-tighter italic"> <ShieldCheck className="w-6 h-6" /> SecureNet </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-gradient-to-b from-[#020617] to-[#0f172a]">
        <div className="container mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-sm font-bold text-accent-400 uppercase tracking-[0.2em]">Our Ecosystem</h2>
            <h3 className="text-4xl md:text-6xl font-black">All You Need in One Place</h3>
            <p className="text-lg text-primary-400 max-w-xl mx-auto font-medium">
              We've consolidated every aspect of workforce management into a single, lightning-fast platform.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-accent-500/30 transition-all duration-500 hover:bg-white/[0.08]"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} bg-opacity-10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 ${feature.color.replace('bg-', 'text-')}`} />
                </div>
                <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                <p className="text-primary-300 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <h3 className="text-4xl md:text-5xl font-black leading-tight">Trusted by Industry Leaders Worldwide</h3>
              <p className="text-lg text-primary-300 leading-relaxed">
                Join over 1,000+ companies that have already transformed their HR operations with PayScale Pro. Our platform handles over $2B in monthly payroll transactions with zero errors.
              </p>
              <ul className="space-y-4">
                {['Bank-level 256-bit encryption', 'Real-time compliance monitoring', 'Direct bank integrations', '24/7 dedicated support'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-primary-200 font-bold">
                    <CheckCircle2 className="w-6 h-6 text-accent-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Uptime', value: '99.9%' },
                { label: 'Happy Users', value: '1M+' },
                { label: 'Security', value: 'ISO 27001' },
                { label: 'Support Rate', value: '98%' },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col justify-center items-center text-center">
                  <div className="text-4xl font-black text-accent-400 mb-2">{stat.value}</div>
                  <div className="text-sm font-bold text-primary-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transformation CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-tr from-accent-600 to-primary-700 p-12 md:p-24 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-white">Ready to Transform Your Workflow?</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
                Set up your workspace in under 10 minutes and experience the future of human resource management.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-black hover:text-white transition-all shadow-2xl"
                >
                  Start Your Free Trial
                </Link>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-white font-black group"
                >
                  <span>See How it Works</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 opacity-60">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-accent-500 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">PayScale Pro</span>
              </div>
              <p className="text-primary-300 max-w-xs leading-relaxed font-medium">
                Building the infrastructure for the global modern workforce. Efficiency at the speed of thought.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6">Product</p>
              <p className="hover:text-accent-400 cursor-pointer transition-colors font-medium">Infrastructure</p>
              <p className="hover:text-accent-400 cursor-pointer transition-colors font-medium">Security</p>
              <p className="hover:text-accent-400 cursor-pointer transition-colors font-medium">Compliance</p>
            </div>
            <div className="space-y-4">
              <p className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6">Company</p>
              <p className="hover:text-accent-400 cursor-pointer transition-colors font-medium">Careers</p>
              <p className="hover:text-accent-400 cursor-pointer transition-colors font-medium">Legal</p>
              <p className="hover:text-accent-400 cursor-pointer transition-colors font-medium">Contact</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-primary-400 font-medium text-sm">
            <p>&copy; 2026 PayScale Pro. Engineered for Excellence.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
              <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
