import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Plus, Calendar, Clock, Award, Filter, Search, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'social_post',
    points: 50,
    deadline: '',
    proofRequired: true,
    autoScore: false
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/tasks', formData);
      setTasks([data, ...tasks]);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        type: 'social_post',
        points: 50,
        deadline: '',
        proofRequired: true,
        autoScore: false
      });
    } catch (err) {
      alert('Failed to create task');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Manager</h1>
          <p className="text-slate-500">Create and manage ambassador challenges.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Create Task
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="bg-white px-4 py-3 rounded-2xl shadow-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 border border-transparent">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[2rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  task.type === 'referral' ? 'bg-blue-50 text-blue-600' :
                  task.type === 'social_post' ? 'bg-purple-50 text-purple-600' :
                  task.type === 'event' ? 'bg-orange-50 text-orange-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {task.type.replace('_', ' ')}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={18} /></button>
                  <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{task.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium">{task.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Award size={16} className="text-amber-500" />
                    <span>{task.points} pts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-slate-400" />
                    <span>{format(new Date(task.deadline), 'MMM d')}</span>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                      U{i}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                    +12
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Task Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="e.g. Share our latest launch on LinkedIn"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none"
                    placeholder="What should the ambassador do?"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Task Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none"
                  >
                    <option value="social_post">Social Post</option>
                    <option value="referral">Referral</option>
                    <option value="event">Event</option>
                    <option value="content">Content Creation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Points</label>
                  <input 
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Deadline</label>
                  <input 
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
