import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, User, Mail, GraduationCap, Code, Award, MoreHorizontal, Download } from 'lucide-react';

const Ambassadors = () => {
  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        const { data } = await api.get(`/org/${user.orgId}/ambassadors`);
        setAmbassadors(data);
      } catch (err) {
        console.error('Error fetching ambassadors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAmbassadors();
  }, [user.orgId]);

  return (
    <div className="space-y-8">
      <header className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black mb-2">Ambassador Directory</h1>
          <p className="text-indigo-100 font-medium text-sm">Manage and track your growing campus network.</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 text-center min-w-[200px]">
          <div className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-1">Invite Code</div>
          <div className="text-3xl font-black tracking-[0.2em]">{user?.orgId?.inviteCode || 'CAMPUS'}</div>
          <p className="text-[10px] text-indigo-200 mt-2 font-bold">Share this with students to join</p>
        </div>
      </header>

      {/* Table Section */}
      <section className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, or college..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Ambassador</th>
                <th className="px-8 py-5">College</th>
                <th className="px-8 py-5 text-right">Points</th>
                <th className="px-8 py-5 text-right">Badges</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-6 h-20 bg-slate-50/50"></td>
                  </tr>
                ))
              ) : (
                ambassadors.map((amb) => (
                  <tr key={amb._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                          {amb.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{amb.name}</div>
                          <div className="text-xs text-slate-400 font-medium">{amb.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <GraduationCap size={16} className="text-slate-400" />
                        {amb.college}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="font-black text-slate-900">{amb.points.toLocaleString()}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1">
                        {amb.badges?.slice(0, 3).map((b, i) => (
                          <span key={i} className="text-xs">≡ƒÄñ</span>
                        ))}
                        {amb.badges?.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{amb.badges.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white transition-all">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Ambassadors;
