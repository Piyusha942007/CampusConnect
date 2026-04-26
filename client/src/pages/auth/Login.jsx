import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Mail, Lock, LogIn, Globe, ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    // 1. If already logged in, redirect to dashboard
    const existingUser = localStorage.getItem('userInfo');
    if (existingUser) {
      const user = JSON.parse(existingUser);
      if (!user.orgId && user.role === 'ambassador') {
        navigate('/complete-profile');
      } else {
        navigate(user.role === 'admin' ? '/admin' : '/ambassador');
      }
      return;
    }

    // 2. Handle social login tokens from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      console.log('Token received from social login, fetching user...');
      localStorage.setItem('token', token);
      api.get('/auth/me')
        .then(({ data }) => {
          console.log('User fetched successfully:', data.name);
          localStorage.setItem('userInfo', JSON.stringify(data));
          if (!data.orgId && data.role === 'ambassador') {
            navigate('/complete-profile');
          } else {
            navigate(data.role === 'admin' ? '/admin' : '/ambassador');
          }
        })
        .catch(err => {
          console.error('Failed to fetch user with social token:', err);
          setError('Social login failed. Please try again.');
        });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      api.get('/auth/me').then(({ data }) => {
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (!data.orgId && data.role === 'ambassador') {
          navigate('/complete-profile');
        } else {
          navigate(data.role === 'admin' ? '/admin' : '/ambassador');
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-100">
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-200">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 font-medium mt-2">Enter your credentials to access your dashboard</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
            <ShieldCheck size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 mt-4 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Login'}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all font-bold text-slate-700 bg-white shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button 
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-900 bg-slate-900 hover:bg-slate-800 transition-all font-bold text-white shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <footer className="mt-10 text-center">
          <p className="text-slate-500 font-medium">
            Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register here</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
