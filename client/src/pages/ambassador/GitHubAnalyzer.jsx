import React, { useState } from 'react';
import api from '../../lib/api';
import { Search, Code, ShieldCheck, AlertCircle, CheckCircle2, Loader2, Sparkles, TrendingUp, Info } from 'lucide-react';

const GitHubAnalyzer = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const { data } = await api.get(`/github/analyze?username=${username}`);
      setAnalysis(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not analyze profile. Check username or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-900 text-white mb-6 shadow-xl">
          <Code size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">GitHub Profile Analyzer</h1>
        <p className="text-slate-500 font-medium">Get your recruiter-readiness score powered by AI.</p>
      </header>

      {/* Input Section */}
      <form onSubmit={handleAnalyze} className="relative max-w-lg mx-auto">
        <input 
          type="text" 
          placeholder="Enter GitHub username..." 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full pl-14 pr-32 py-5 rounded-[2rem] bg-white border-none shadow-2xl shadow-indigo-100 focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-lg"
          required
        />
        <Code className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 flex items-center gap-4 max-w-lg mx-auto">
          <AlertCircle size={24} />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-indigo-600" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * analysis.score) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">{analysis.score}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                </div>
              </div>
              <div className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Grade {analysis.grade}
              </div>
            </div>

            {/* Impresion Card */}
            <div className="md:col-span-2 bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <Sparkles className="absolute top-6 right-6 text-indigo-400 opacity-50" size={40} />
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck size={24} /> Recruiter's First Impression
              </h3>
              <p className="text-indigo-50 leading-relaxed font-medium">
                "{analysis.firstImpression}"
              </p>
              <div className="mt-6 flex gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                  A-Grade Readability
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10">
                  Modern Tech Stack
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Highlights */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 px-2 flex items-center gap-2">
                <TrendingUp size={24} className="text-emerald-500" /> Top Highlights
              </h3>
              <div className="space-y-4">
                {analysis.highlights.map((h, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-500">
                    <h4 className="font-bold text-slate-900 mb-1">{h.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{h.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Items */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 px-2 flex items-center gap-2">
                <CheckCircle2 size={24} className="text-indigo-600" /> Action Items
              </h3>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                {analysis.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                    </div>
                    <p className="text-slate-700 font-medium text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-start gap-4">
            <Info className="text-amber-600 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">How is this calculated?</h4>
              <p className="text-sm text-amber-700 font-medium">Our AI analyzes your repository descriptions, README quality, language distribution, and commit consistency to simulate a recruiter's evaluation process.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubAnalyzer;
