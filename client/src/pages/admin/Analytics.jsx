import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Target, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Mocking analytics data based on existing models
        const [usersRes, tasksRes, subsRes] = await Promise.all([
          api.get('/auth/me'), // Just to check auth
          api.get('/tasks'),
          api.get('/submissions/org')
        ]);
        
        // Process data for charts
        const taskStats = [
          { name: 'Active', value: tasksRes.data.length },
          { name: 'Completed', value: subsRes.data.filter(s => s.status === 'approved').length },
          { name: 'Pending', value: subsRes.data.filter(s => s.status === 'pending').length }
        ];

        setData({ taskStats });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 pb-20">
      <header className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Program Analytics</h1>
        <p className="text-slate-500 font-medium">Track your campus connect program's ROI and growth.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-indigo-600" />} label="Total Ambassadors" value="12" change="+15%" />
        <StatCard icon={<Target className="text-amber-500" />} label="Active Tasks" value="8" change="+2" />
        <StatCard icon={<CheckCircle2 className="text-emerald-500" />} label="Submissions" value="45" change="+12" />
        <StatCard icon={<TrendingUp className="text-rose-500" />} label="Engagement Rate" value="84%" change="+4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Performance */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Task Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.taskStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.taskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {data.taskStats.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm font-bold text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Chart (Mock) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Submission Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', count: 12 },
                { name: 'Tue', count: 18 },
                { name: 'Wed', count: 15 },
                { name: 'Thu', count: 25 },
                { name: 'Fri', count: 20 },
                { name: 'Sat', count: 30 },
                { name: 'Sun', count: 28 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, change }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
      {icon}
    </div>
    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{label}</div>
    <div className="flex items-end gap-3">
      <div className="text-3xl font-black text-slate-900">{value}</div>
      <div className={`text-xs font-bold mb-1 ${change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
        {change}
      </div>
    </div>
  </div>
);

export default Analytics;
