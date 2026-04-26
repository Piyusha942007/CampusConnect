import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Target, Trophy, Code, User } from 'lucide-react';
import Dashboard from '../pages/ambassador/Dashboard';
import Tasks from '../pages/ambassador/Tasks';
import Leaderboard from '../pages/ambassador/Leaderboard';
import Profile from '../pages/ambassador/Profile';
import GitHubAnalyzer from '../pages/ambassador/GitHubAnalyzer';

const AmbassadorLayout = () => {
  const links = [
    { to: '/ambassador', icon: <LayoutDashboard size={20} />, label: 'Home', end: true },
    { to: '/ambassador/tasks', icon: <Target size={20} />, label: 'My Tasks' },
    { to: '/ambassador/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
    { to: '/ambassador/github', icon: <Code size={20} />, label: 'GitHub Analyzer' },
    { to: '/ambassador/profile', icon: <User size={20} />, label: 'My Profile' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto px-6">
      {/* Sidebar */}
      <aside className="md:w-72 flex-shrink-0">
        <div className="bg-white/50 backdrop-blur-md rounded-[3rem] border border-white/20 p-6 shadow-2xl shadow-indigo-100/50 sticky top-32">
          <div className="px-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Navigation</h3>
          </div>
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all group
                  ${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm'}
                `}
              >
                <div className={`transition-transform group-hover:scale-110`}>
                  {link.icon}
                </div>
                <span className="text-sm tracking-tight">{link.label}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="mt-12 p-6 bg-indigo-600 rounded-[2rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Status</div>
              <div className="text-sm font-bold">Elite Member</div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black bg-white/20 w-fit px-3 py-1.5 rounded-full">
                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                 ACTIVE NOW
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="github" element={<GitHubAnalyzer />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default AmbassadorLayout;
