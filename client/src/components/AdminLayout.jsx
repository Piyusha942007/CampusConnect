import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, BarChart3, Trophy, CheckSquare } from 'lucide-react';
import Dashboard from '../pages/admin/Dashboard';
import TaskManager from '../pages/admin/TaskManager';
import Ambassadors from '../pages/admin/Ambassadors';
import Analytics from '../pages/admin/Analytics';
import Leaderboard from '../pages/ambassador/Leaderboard';
import Submissions from '../pages/admin/Submissions';

const AdminLayout = () => {
  const links = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview', end: true },
    { to: '/admin/tasks', icon: <ClipboardList size={20} />, label: 'Tasks' },
    { to: '/admin/ambassadors', icon: <Users size={20} />, label: 'Ambassadors' },
    { to: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: '/admin/submissions', icon: <CheckSquare size={20} />, label: 'Review Submissions' },
    { to: '/admin/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto px-6">
      {/* Sidebar */}
      <aside className="md:w-72 flex-shrink-0">
        <div className="bg-white/50 backdrop-blur-md rounded-[3rem] border border-white/20 p-6 shadow-2xl shadow-indigo-100/50 sticky top-32">
          <div className="px-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Management</h3>
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
          
          <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Level</div>
              <div className="text-sm font-bold">Org Administrator</div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-black bg-white/10 w-fit px-3 py-1.5 rounded-full">
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                 ALL SYSTEMS GO
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<TaskManager />} />
          <Route path="ambassadors" element={<Ambassadors />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout;
