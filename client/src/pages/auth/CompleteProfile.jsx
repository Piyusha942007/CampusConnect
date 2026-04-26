import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Rocket, Shield, MapPin, CheckCircle2, Loader2, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const CompleteProfile = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [college, setCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleComplete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.put('/auth/complete-profile', { inviteCode, college });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/ambassador');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid invite code or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -mr-48 -mt-48"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl shadow-indigo-100 border border-slate-100 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-indigo-200">
            <Rocket size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Almost there!</h1>
          <p className="text-slate-500 font-medium">Link your account to an organization to unlock missions.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-2 border border-red-100">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleComplete} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Org Invite Code</label>
            <div className="relative">
              <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold uppercase tracking-widest"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your College/University</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="e.g. Stanford University" 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Unlock Dashboard <CheckCircle2 size={20} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          Don't have a code? Contact your organization administrator.
        </p>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
