import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Users, ClipboardList, CheckSquare, TrendingUp, ArrowRight, Plus, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ ambassadors: 0, activeTasks: 0, pendingSubs: 0 });
  const [recentSubs, setRecentSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, subsRes, ambRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/submissions/org'),
          api.get('/users/ambassadors') // Assuming this endpoint exists to list org ambassadors
        ]);
        
        setStats({
          ambassadors: ambRes.data.length, 
          activeTasks: tasksRes.data.length,
          pendingSubs: subsRes.data.filter(s => s.status === 'pending').length
        });
        setRecentSubs(subsRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Command Center</h1>
          <p className="text-slate-500 font-medium">Manage your campus network and track real-time impact.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/admin/tasks')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-100"
          >
            <Plus size={20} /> Create Task
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="text-indigo-600" />} 
          label="Ambassadors" 
          value={stats.ambassadors} 
          color="bg-indigo-50"
        />
        <StatCard 
          icon={<ClipboardList className="text-amber-500" />} 
          label="Active Tasks" 
          value={stats.activeTasks} 
          color="bg-amber-50"
        />
        <StatCard 
          icon={<CheckSquare className="text-emerald-500" />} 
          label="Pending Review" 
          value={stats.pendingSubs} 
          color="bg-emerald-50"
          alert={stats.pendingSubs > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-bold text-slate-900">Recent Submissions</h3>
            <button 
              onClick={() => navigate('/admin/submissions')}
              className="text-indigo-600 font-bold text-sm hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {recentSubs.length > 0 ? recentSubs.map((sub) => (
                <div key={sub._id} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-all">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users size={18} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm">{sub.userId?.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{sub.taskId?.title}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    sub.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                    sub.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {sub.status}
                  </div>
                  <button 
                    onClick={() => navigate('/admin/submissions')}
                    className="text-slate-300 hover:text-indigo-600"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              )) : (
                <div className="p-12 text-center text-slate-400 font-medium">No submissions yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 px-4">Quick Actions</h3>
          <div className="space-y-4">
            <ActionCard 
              icon={<UserPlus size={20} />} 
              title="Add Ambassadors" 
              desc="Share your org invite code"
              onClick={() => navigate('/admin/ambassadors')}
            />
            <ActionCard 
              icon={<TrendingUp size={20} />} 
              title="View Insights" 
              desc="Check engagement metrics"
              onClick={() => navigate('/admin/analytics')}
              color="text-emerald-600"
            />
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate('/admin/tasks')}>
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-1">Scale Up!</h4>
                <p className="text-indigo-100 text-sm mb-6">Create a high-impact task and notify everyone.</p>
                <div className="flex items-center gap-2 font-bold text-sm">
                  Launch Task <ArrowRight size={16} />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, alert }) => (
  <div className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white`}>
    {alert && <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>}
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className="text-4xl font-black text-slate-900">{value}</div>
  </div>
);

const ActionCard = ({ icon, title, desc, onClick, color = "text-indigo-600" }) => (
  <button 
    onClick={onClick}
    className="w-full p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-indigo-100 transition-all text-left"
  >
    <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <div className="font-bold text-slate-900">{title}</div>
      <div className="text-xs text-slate-500 font-medium">{desc}</div>
    </div>
  </button>
);

export default Dashboard;
