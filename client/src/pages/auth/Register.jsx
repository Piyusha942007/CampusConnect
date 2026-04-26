import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { User, Mail, Lock, GraduationCap, Rocket, Loader2, ArrowRight, ShieldCheck, CheckCircle2, Key, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ambassador',
    college: '',
    inviteCode: '',
    orgName: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/request-otp', { email: formData.email, role: formData.role });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(data.role === 'admin' ? '/admin' : '/ambassador');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-100 rounded-full blur-[140px] opacity-40 -mr-80 -mt-80"></div>
      <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-amber-100 rounded-full blur-[110px] opacity-30 -ml-50 -mb-50"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[4rem] p-12 shadow-2xl shadow-indigo-100/50 border border-slate-100 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 mb-6">
            <Rocket size={36} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Create your account</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.25em]">Join the network</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 border border-red-100 text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 py-5 rounded-2xl border border-slate-100 hover:bg-slate-50 hover:shadow-md transition-all font-black text-sm text-slate-700 bg-white">
                  <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl transition-all font-black text-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>

              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Or enter details</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              <form onSubmit={handleRequestOTP} className="space-y-5">
                <div className="flex p-2 bg-slate-50 rounded-2xl mb-6">
                  <button type="button" onClick={() => setFormData({...formData, role: 'ambassador'})} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.role === 'ambassador' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}>Ambassador</button>
                  <button type="button" onClick={() => setFormData({...formData, role: 'admin'})} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.role === 'admin' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}>Organization</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input type="text" placeholder="Full Name" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all text-sm font-bold" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input type="email" placeholder="Email Address" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all text-sm font-bold" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input type="password" placeholder="Set Password" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all text-sm font-bold" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>

                {formData.role === 'ambassador' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                      <input type="text" placeholder="College Name" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all text-sm font-bold" required value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} />
                    </div>
                    <div className="relative group">
                      <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                      <input type="text" placeholder="Invite Code" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all text-sm font-black uppercase tracking-widest" required value={formData.inviteCode} onChange={(e) => setFormData({...formData, inviteCode: e.target.value})} />
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <Rocket className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input type="text" placeholder="Organization Name" className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white transition-all text-sm font-bold" required value={formData.orgName} onChange={(e) => setFormData({...formData, orgName: e.target.value})} />
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 group mt-4">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <>Continue to Verify <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Fingerprint size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-500 font-medium mb-12">We've sent a 6-digit code to <br /><span className="text-indigo-600 font-bold">{formData.email}</span></p>
              
              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <input type="text" placeholder="000000" className="w-full py-8 rounded-[2rem] bg-slate-50 border-dashed border-2 border-indigo-200 text-center font-black text-4xl tracking-[0.8em] focus:ring-0 focus:border-indigo-500 transition-all" required maxLength={6} value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})} />

                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <>Verify & Create Account <CheckCircle2 size={24} /></>}
                </button>
                
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-slate-600 transition-colors">
                   ← Wrong email? Go back
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center border-t border-slate-50 pt-8">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:underline ml-1">Log In here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
