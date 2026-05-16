/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, CheckCircle2, Clock, XCircle, ChevronRight, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, applications, jobs, notifications, updateApplicationStatus, addNotification, queries, addQuery, setActiveTab, applyToJob, activeTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'queries'>(activeTab === 'queries' ? 'queries' : 'applications');

  useEffect(() => {
    if (activeTab === 'queries') {
      setActiveSubTab('queries');
    }
  }, [activeTab]);
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [queryMessage, setQueryMessage] = useState('');
  
  const myApplications = applications.filter(a => a.studentId === currentUser?.id);
  const myQueries = queries.filter(q => q.studentId === currentUser?.id);

  const statusCounts = {
    total: myApplications.length,
    interview: myApplications.filter(a => a.status === 'INTERVIEW').length,
    offered: myApplications.filter(a => a.status === 'OFFERED').length,
    pending: myApplications.filter(a => a.status === 'APPLIED' || a.status === 'SCREENING').length,
  };

  const handlePostQuery = async () => {
    if (queryMessage) {
      await addQuery(queryMessage);
      setQueryMessage('');
      setShowQueryForm(false);
      alert('Query sent to department coordinator!');
    }
  };

  const recommendedJobs = jobs.filter(j => 
    j.status === 'OPEN' && 
    (currentUser?.cgpa || 0) >= j.minCgpa && 
    (j.branches.includes(currentUser?.branch || '') || j.branches.includes('ALL'))
  ).slice(0, 3);

  const handleQuickApply = async (job: any) => {
    if (applications.some(a => a.jobId === job.id && a.studentId === currentUser?.id)) {
      alert('You have already applied for this role.');
      return;
    }
    await applyToJob(job);
    alert(`Successfully applied for ${job.title} at ${job.companyName}!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">Student Dashboard</h1>
          <p className="text-slate-500 font-medium">Tracking your journey to success.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setActiveSubTab('queries');
              setShowQueryForm(true);
            }}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <MessageSquare size={18} />
            Ask Coordinator
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <CheckCircle2 size={20} />
            Update Profile
          </button>
        </div>
      </div>

      {showQueryForm && (
        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="font-bold text-indigo-900">Query for Department Coordinator</h3>
              <button onClick={() => setShowQueryForm(false)} className="text-indigo-400 hover:text-indigo-600"><XCircle size={20} /></button>
           </div>
           <textarea 
             className="w-full p-4 rounded-2xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
             placeholder="Explain your query clearly..."
             rows={3}
             value={queryMessage}
             onChange={e => setQueryMessage(e.target.value)}
           />
           <button 
             onClick={handlePostQuery}
             className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
           >
             <Send size={16} /> Send Query
           </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Applied', value: statusCounts.total, icon: <Briefcase />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Interviews', value: statusCounts.interview, icon: <Clock />, color: 'bg-amber-50 text-amber-600' },
          { label: 'Offers', value: statusCounts.offered, icon: <CheckCircle2 />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending', value: statusCounts.pending, icon: <Clock />, color: 'bg-slate-50 text-slate-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveSubTab('applications')}
                className={`pb-2 text-sm font-bold transition-all relative ${
                  activeSubTab === 'applications' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Active Applications
                {activeSubTab === 'applications' && <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
              </button>
              <button 
                onClick={() => setActiveSubTab('queries')}
                className={`pb-2 text-sm font-bold transition-all relative ${
                  activeSubTab === 'queries' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                My Queries
                {activeSubTab === 'queries' && <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
              </button>
            </div>
            {activeSubTab === 'queries' && (
              <button 
                onClick={() => setShowQueryForm(true)}
                className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                New Query
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {activeSubTab === 'applications' ? (
              myApplications.length > 0 ? myApplications.map(app => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {app.companyName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{app.jobTitle}</h4>
                      <p className="text-sm text-slate-500">{app.companyName} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'OFFERED' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      app.status === 'INTERVIEW' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {app.status}
                    </span>
                    {app.status === 'OFFERED' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={async () => {
                            await updateApplicationStatus(app.id, 'ACCEPTED');
                            await addNotification(app.studentId, 'Offer Accepted', `You have accepted the offer from ${app.companyName}!`, 'ANNOUNCEMENT');
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={async () => {
                            await updateApplicationStatus(app.id, 'DECLINED');
                            await addNotification(app.studentId, 'Offer Declined', `You have declined the offer from ${app.companyName}.`, 'ANNOUNCEMENT');
                          }}
                          className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <ChevronRight size={18} className="text-slate-300" />
                    )}
                  </div>
                </div>
              )) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <p className="text-slate-500">You haven't applied to any jobs yet.</p>
                </div>
              )
            ) : (
              myQueries.length > 0 ? myQueries.map(query => (
                <div key={query.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-slate-900 font-medium">{query.message}</p>
                      <p className="text-xs text-slate-400">Asked on {new Date(query.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      query.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {query.status}
                    </span>
                  </div>
                  {query.response && (
                    <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-500">
                      <p className="text-xs font-bold text-slate-500 mb-1 uppercase">Coordinator Response</p>
                      <p className="text-sm text-slate-700 italic">"{query.response}"</p>
                    </div>
                  )}
                </div>
              )) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <p className="text-slate-500">You haven't rasied any queries yet.</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar content */}
        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-bold mb-2">Recommended for You</h4>
            <p className="text-indigo-100 text-sm mb-6">Based on your {currentUser?.cgpa} CGPA and {currentUser?.branch} branch.</p>
            <div className="space-y-4">
              {recommendedJobs.map(job => (
                <div key={job.id} className="bg-indigo-500/30 p-4 rounded-xl border border-indigo-400/30">
                  <p className="font-bold text-sm">{job.title}</p>
                  <p className="text-xs text-indigo-100 mb-3">{job.companyName} • {job.salary}</p>
                  <button 
                    onClick={() => handleQuickApply(job)}
                    className="w-full bg-white text-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Quick Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Recent Notifications</h4>
            <div className="space-y-4">
              {notifications.filter(n => n.userId === currentUser?.id).slice(0, 3).map(n => (
                <div key={n.id} className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
