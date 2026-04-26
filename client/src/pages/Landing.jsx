import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Shield, Zap, Target, ArrowRight, Code, Globe, Sparkles, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-600">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-[100] bg-white/70 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl shadow-indigo-100/50">
        <div className="px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Rocket size={20} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">CampusConnect</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#ai" className="hover:text-indigo-600 transition-colors">AI Insights</a>
            <a href="#gamification" className="hover:text-indigo-600 transition-colors">Gamification</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Login</Link>
            <Link to="/register" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 -mr-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20 -ml-32"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-indigo-100"
          >
            <Sparkles size={14} /> The Future of Campus Ambassador Programs
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8"
          >
            Scale your <span className="text-indigo-600">Ambassador</span> <br className="hidden md:block" /> impact with AI.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-12"
          >
            The all-in-one platform for organizations to manage tasks, automate proof of work, and reward top student talent through gamified experiences.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="w-full md:w-auto bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-2">
              Launch your Program <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full md:w-auto bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
              Explore Demo
            </Link>
          </motion.div>

          {/* Stats Preview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-16 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">500+</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Ambassadors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">10k+</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">AI</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Driven Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">Drive</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Proof Automated</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Everything you need to grow.</h2>
            <p className="text-slate-500 font-medium">Built for organizers, loved by ambassadors.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Target className="text-indigo-600" />}
              title="Automated Proof of Work"
              desc="Files uploaded by ambassadors are automatically stored in your organization's Google Drive."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="Gamified Rankings"
              desc="Real-time leaderboards, streaks, and badges to keep your ambassadors motivated and engaged."
            />
            <FeatureCard 
              icon={<Shield className="text-emerald-500" />}
              title="AI Profile Analysis"
              desc="Verify ambassador quality using our AI-driven GitHub analyzer to find the best talent."
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to revolutionize your <br /> campus impact?</h2>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl">
              Get Started for Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">CC</div>
            <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">CampusConnect © 2026</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all group">
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
