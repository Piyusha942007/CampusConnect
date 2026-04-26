import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Zap, Trophy, Target, Award, ArrowRight, Star, Clock, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, tasksRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/tasks')
        ]);
        setStats(meRes.data);
        setTasks(tasksRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateLevel = (points) => {
    const level = Math.floor(Math.sqrt(points / 50)) + 1;
    const currentLevelPoints = (level - 1) ** 2 * 50;
    const nextLevelPoints = level ** 2 * 50;
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return { level, progress, nextLevel: nextLevelPoints };
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  const { level, progress, nextLevel } = calculateLevel(stats.points);

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-black mb-2">Welcome back, {stats.name}!</h1>
            <p className="text-indigo-100 font-medium text-lg">Level {level} Ambassador</p>
            
            <div className="mt-8 space-y-2">
               <div className="flex justify-between text-sm font-bold">
                 <span>Level {level}</span>
                 <span>{stats.points} / {nextLevel} XP</span>
               </div>
               <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 md:justify-end">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-amber-900">
                <Trophy size={24} fill="currentColor" />
              </div>
              <div>
                <div className="text-2xl font-black">{stats.points}</div>
                <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">XP Points</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-orange-400 flex items-center justify-center text-orange-900">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <div className="text-2xl font-black">{stats.streak} Days</div>
                <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Streak</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Badges */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">My Badges</h3>
              <Award className="text-indigo-600" />
            </div>
            
            {stats.badges?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {stats.badges.map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:scale-105 transition-all">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                      <Star size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs font-black text-slate-700">{badge}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-4">No badges earned yet. Complete tasks to unlock!</p>
            )}
            
            <button 
              onClick={() => navigate('/ambassador/leaderboard')}
              className="w-full mt-8 py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              View Leaderboard <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles size={80} />
             </div>
             <h4 className="text-lg font-bold mb-2">AI Profile Check</h4>
             <p className="text-slate-400 text-sm mb-6">Analyze your GitHub profile and get recruiter-ready tips.</p>
             <button 
              onClick={() => navigate('/ambassador/github')}
              className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all"
             >
               Try Now
             </button>
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-bold text-slate-900">Priority Missions</h3>
            <button 
              onClick={() => navigate('/ambassador/tasks')}
              className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Target size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star size={10} fill="currentColor" /> {task.points} pts
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <Clock size={10} /> {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/ambassador/tasks')}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
