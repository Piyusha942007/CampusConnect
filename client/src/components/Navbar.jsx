import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-[100] bg-white/70 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl shadow-indigo-100/50">
      <div className="px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">CampusConnect</span>
        </Link>

        <div className="flex items-center gap-8">
          {user ? (
            <div className="flex items-center gap-6">
              <Link 
                to={user.role === 'admin' ? '/admin' : '/ambassador'} 
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                Dashboard
              </Link>
              <div className="h-8 w-px bg-slate-100"></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
