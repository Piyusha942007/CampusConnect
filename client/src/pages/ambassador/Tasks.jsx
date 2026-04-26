import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Target, Clock, Trophy, Upload, CheckCircle2, AlertCircle, Loader2, ExternalLink, FileText, Link as LinkIcon, ArrowRight } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofData, setProofData] = useState({ text: '', link: '', file: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, subsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/submissions/my')
      ]);
      setTasks(tasksRes.data);
      setSubmissions(subsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitted = (taskId) => submissions.some(s => s.taskId?._id === taskId || s.taskId === taskId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const formData = new FormData();
    formData.append('taskId', selectedTask._id);
    formData.append('textProof', proofData.text);
    formData.append('linkProof', proofData.link);
    if (proofData.file) formData.append('file', proofData.file);

    try {
      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedTask(null);
      setProofData({ text: '', link: '', file: null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Active Missions</h1>
          <p className="text-slate-500 font-medium">Complete tasks to earn points and climb the leaderboard.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="text-2xl font-black text-indigo-600">{tasks.length}</div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Available</div>
          </div>
          <div className="text-center px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="text-2xl font-black text-emerald-600">{submissions.length}</div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Completed</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Target size={28} />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm font-bold border border-amber-100">
                <Trophy size={16} fill="currentColor" />
                {task.points} pts
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3">{task.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{task.description}</p>

            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Clock size={16} />
                {new Date(task.deadline).toLocaleDateString()}
              </div>
              <div className="ml-auto">
                {isSubmitted(task._id) ? (
                  <span className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={18} /> Done
                  </span>
                ) : (
                  <button 
                    onClick={() => setSelectedTask(task)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    Submit Proof <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 relative shadow-2xl">
            <header className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Submit Proof</h2>
              <p className="text-slate-500 font-medium">{selectedTask.title}</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Write your notes (Optional)</label>
                <textarea 
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
                  placeholder="Tell us about how you completed this task..."
                  value={proofData.text}
                  onChange={(e) => setProofData({...proofData, text: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Submission Link (URL)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="url" 
                    placeholder="https://..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    value={proofData.link}
                    onChange={(e) => setProofData({...proofData, link: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Upload Screenshots / Files</label>
                <div className="relative">
                  <input 
                    type="file" 
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => setProofData({...proofData, file: e.target.files[0]})}
                  />
                  <label 
                    htmlFor="file-upload"
                    className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group"
                  >
                    {proofData.file ? (
                      <div className="flex items-center gap-3 text-indigo-600 font-bold">
                        <FileText size={32} />
                        <span className="text-sm">{proofData.file.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="text-slate-400 group-hover:text-indigo-500 mb-2" />
                        <span className="text-sm font-bold text-slate-500">Click to upload or drag and drop</span>
                        <span className="text-xs text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 px-8 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="flex-[2] bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitLoading ? <Loader2 className="animate-spin" /> : <>Submit Task <ArrowRight size={20} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
