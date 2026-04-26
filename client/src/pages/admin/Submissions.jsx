import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { CheckCircle2, XCircle, ExternalLink, User, Target, Clock, Loader2, ShieldAlert } from 'lucide-react';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get('/submissions/org');
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      await api.post(`/submissions/${id}/${action}`);
      fetchSubmissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  const pending = submissions.filter(s => s.status === 'pending');
  const processed = submissions.filter(s => s.status !== 'pending');

  return (
    <div className="space-y-8">
      <header className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Review Submissions</h1>
        <p className="text-slate-500 font-medium">Verify proofs of work and award points to your ambassadors.</p>
      </header>

      {/* Pending Submissions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 px-4 flex items-center gap-2">
          Pending Review <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">{pending.length}</span>
        </h2>
        
        {pending.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-slate-500 font-medium">All caught up! No pending submissions.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pending.map((sub) => (
              <SubmissionCard 
                key={sub._id} 
                sub={sub} 
                onApprove={() => handleAction(sub._id, 'approve')}
                onReject={() => handleAction(sub._id, 'reject')}
                loading={actionLoading === sub._id}
              />
            ))}
          </div>
        )}
      </section>

      {/* History */}
      {processed.length > 0 && (
        <section className="space-y-4 opacity-70 hover:opacity-100 transition-opacity">
          <h2 className="text-xl font-bold text-slate-900 px-4">Processed History</h2>
          <div className="grid gap-4">
            {processed.map((sub) => (
              <SubmissionCard key={sub._id} sub={sub} readonly />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const SubmissionCard = ({ sub, onApprove, onReject, loading, readonly }) => (
  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <User size={20} className="text-slate-500" />
        </div>
        <div>
          <div className="font-bold text-slate-900">{sub.userId?.name}</div>
          <div className="text-xs text-slate-400 font-medium">{sub.userId?.college}</div>
        </div>
        <div className="mx-2 w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
        <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
          <Target size={16} /> {sub.taskId?.title}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed border border-slate-100 italic">
        "{sub.content?.text || 'No additional notes provided.'}"
      </div>

      <div className="flex flex-wrap gap-3">
        {sub.content?.link && (
          <a href={sub.content.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <ExternalLink size={14} /> Submission Link
          </a>
        )}
        {sub.content?.fileUrl && (
          <a href={sub.content.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-all">
            <ExternalLink size={14} /> View File on Drive
          </a>
        )}
      </div>
    </div>

    {!readonly ? (
      <div className="flex gap-3 w-full md:w-auto">
        <button 
          onClick={onReject}
          disabled={loading}
          className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
        >
          <XCircle size={18} /> Reject
        </button>
        <button 
          onClick={onApprove}
          disabled={loading}
          className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={18} /> Approve</>}
        </button>
      </div>
    ) : (
      <div className={`px-4 py-2 rounded-xl font-bold text-sm border ${sub.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
        {sub.status.toUpperCase()}
      </div>
    )}
  </div>
);

export default Submissions;
