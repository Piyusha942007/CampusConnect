import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { User, Mail, GraduationCap, Code, Award, Zap, Calendar, Trophy, Target, Flame, Megaphone, Star, Rocket, Shield, Loader2 } from 'lucide-react';

const BADGES = [
  { key: 'first_blood', icon: <Target size={28} />, label: 'First Blood', desc: 'Complete your first task', color: 'text-rose-500 bg-rose-50 border-rose-100' },
  { key: 'on_fire', icon: <Flame size={28} />, label: 'On Fire', desc: '3-day activity streak', color: 'text-orange-500 bg-orange-50 border-orange-100' },
  { key: 'rocketeer', icon: <Rocket size={28} />, label: 'Rocketeer', desc: 'Earn 500+ points', color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
  { key: 'megaphone', icon: <Megaphone size={28} />, label: 'Megaphone', desc: 'Complete 5 social tasks', color: 'text-blue-500 bg-blue-50 border-blue-100' },
  { key: 'connector', icon: <Shield size={28} />, label: 'Connector', desc: 'Refer 10+ people', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
  { key: 'star', icon: <Star size={28} />, label: 'Star', desc: 'Top 3 on leaderboard', color: 'text-amber-500 bg-amber-50 border-amber-100' },
];

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const [stats, setStats] = useState({ submissions: 0, rank: '-' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [meRes, subsRes, leaderRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/submissions/my'),
        api.get('/leaderboard').catch(() => ({ data: [] })),
      ]);
      setUser(meRes.data);
      const rank = leaderRes.data.findIndex(u => u._id === meRes.data._id) + 1;
      setStats({
        submissions: subsRes.data.length,
        rank: rank > 0 ? `#${rank}` : '-',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  const hasBadge = (key) => user.badges?.includes(key);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <header className="relative overflow-hidden bg-white rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600"></div>
        <div className="relative px-10 pt-20 pb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 rounded-[2rem] bg-white border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 text-4xl font-black -mt-6">
              {user.name?.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-slate-900 mb-1">{user.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-5 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2"><Mail size={16} /> {user.email}</div>
                {user.college && <div className="flex items-center gap-2"><GraduationCap size={16} /> {user.college}</div>}
                {user.githubUsername && <div className="flex items-center gap-2"><Code size={16} /> @{user.githubUsername}</div>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-100">
                Ambassador
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Zap size={22} />} label="Total Points" value={user.points || 0} color="bg-indigo-600 text-white" />
        <StatCard icon={<Flame size={22} />} label="Current Streak" value={`${user.streak || 0} Days`} color="bg-orange-500 text-white" />
        <StatCard icon={<Trophy size={22} />} label="Global Rank" value={stats.rank} color="bg-amber-500 text-white" />
        <StatCard icon={<Target size={22} />} label="Tasks Done" value={stats.submissions} color="bg-emerald-500 text-white" />
      </div>

      {/* Achievements */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Award size={22} />
          </div>
          Achievements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {BADGES.map((badge) => {
            const active = hasBadge(badge.key);
            return (
              <div key={badge.key} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${active ? badge.color + ' shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}>
                <div className="flex-shrink-0">{badge.icon}</div>
                <div>
                  <div className="font-black text-sm text-slate-900">{badge.label}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{badge.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Member Info */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <div className="font-black text-slate-900">Member Since</div>
            <div className="text-sm text-slate-500 font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          Active
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`p-6 rounded-[2rem] ${color} shadow-lg`}>
    <div className="flex items-center gap-2 opacity-80 mb-2">{icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span></div>
    <div className="text-3xl font-black">{value}</div>
  </div>
);

export default Profile;
