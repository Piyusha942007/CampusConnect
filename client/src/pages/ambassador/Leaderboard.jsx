import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Trophy, Medal, Crown, Star, Flame, ArrowUp, ArrowRight, Loader2, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/leaderboard');
        setLeaders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  const podium = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="space-y-12 pb-20">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 shadow-sm"
        >
          <Crown size={14} /> Organization Hall of Fame
        </motion.div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">The Best of {user?.orgId?.name || 'Campus'}</h1>
        <p className="text-slate-500 font-medium text-lg">Real-time rankings of top performing ambassadors.</p>
      </header>

      {/* Podium Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
        {/* 2nd Place */}
        <PodiumCard 
          rank={2} 
          user={podium[1]} 
          color="bg-slate-200" 
          height="h-64"
          delay={0.2}
          icon={<Medal className="text-slate-500" />}
        />
        
        {/* 1st Place */}
        <PodiumCard 
          rank={1} 
          user={podium[0]} 
          color="bg-amber-400" 
          height="h-80"
          delay={0}
          icon={<Crown className="text-amber-900" size={32} />}
          isCenter
        />

        {/* 3rd Place */}
        <PodiumCard 
          rank={3} 
          user={podium[2]} 
          color="bg-orange-300" 
          height="h-56"
          delay={0.4}
          icon={<Award className="text-orange-800" />}
        />
      </section>

      {/* List Section */}
      <section className="max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
            <Star size={16} className="text-amber-400 fill-amber-400" /> Top Rankers
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {others.length > 0 ? (
            others.map((amb, idx) => (
              <motion.div 
                key={amb._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-6 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-6">
                  <span className="text-sm font-black text-slate-300 w-6">#{idx + 4}</span>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                    {amb.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{amb.name}</div>
                    <div className="text-xs text-slate-400 font-medium">{amb.college}</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 flex items-center gap-1">
                      {amb.points.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold uppercase">XP</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {amb.badges?.slice(0, 3).map((b, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-xs shadow-sm">
                        ≡ƒÄñ
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="p-20 text-center text-slate-400 font-medium">No other participants yet.</div>
          )}
        </div>
      </section>
    </div>
  );
};

const PodiumCard = ({ rank, user, color, height, delay, icon, isCenter }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, type: "spring" }}
    className="flex flex-col items-center"
  >
    <div className="mb-6 text-center">
      <div className={`w-20 h-20 rounded-[2rem] ${isCenter ? 'bg-amber-100' : 'bg-slate-100'} flex items-center justify-center mb-3 relative mx-auto group`}>
        <div className="absolute -top-2 -right-2 bg-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center font-black text-xs">#{rank}</div>
        {user ? (
          <span className={`text-2xl font-black ${isCenter ? 'text-amber-600' : 'text-slate-600'}`}>{user.name.charAt(0)}</span>
        ) : (
          <Star size={24} className="text-slate-300" />
        )}
      </div>
      <div className="font-black text-slate-900 truncate max-w-[150px]">{user?.name || 'TBA'}</div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.points?.toLocaleString() || 0} XP</div>
    </div>
    <div className={`w-full ${height} ${color} rounded-t-[3rem] relative shadow-2xl flex flex-col items-center pt-8 border-x border-t border-white/20`}>
      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm mb-4">
        {icon}
      </div>
      <div className="text-white/40 font-black text-6xl select-none">{rank}</div>
      {isCenter && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-10"
        >
          <Flame className="text-orange-500" size={40} fill="currentColor" />
        </motion.div>
      )}
    </div>
  </motion.div>
);

export default Leaderboard;
