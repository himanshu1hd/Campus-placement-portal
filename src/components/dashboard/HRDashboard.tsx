/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { FileText, Plus, UserPlus, Send, Mail, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';

export const HRDashboard: React.FC = () => {
  const { applications, currentUser, jobs, updateApplicationStatus, addNotification, nextRound, postJob } = useApp();
  const [activeSubTab, setActiveSubTab] = React.useState<'applications' | 'jobs' | 'interviews'>('applications');
  const [showPostJob, setShowPostJob] = React.useState(false);
  const [newJob, setNewJob] = React.useState({
    title: '',
    description: '',
    requirements: '',
    minCgpa: 7.0,
    salary: '',
    deadline: '',
    branches: [] as string[]
  });
  
  const myCompanyName = currentUser?.department || ''; // HR's company is stored in department field
  const myJobs = jobs.filter(j => j.companyName === myCompanyName);
  const myApplications = applications.filter(a => a.companyName === myCompanyName);

  const handlePostJob = async () => {
    if (!newJob.title || !newJob.deadline || !newJob.salary) {
      alert('Please fill all mandatory fields');
      return;
    }
    await postJob({
      ...newJob,
      companyId: currentUser?.id || 'c1',
      companyName: myCompanyName,
      status: 'OPEN'
    });
    alert('Job posted successfully!');
    setShowPostJob(false);
    setNewJob({ title: '', description: '', requirements: '', minCgpa: 7.0, salary: '', deadline: '', branches: [] });
  };

  const handleAction = async (appId: string, studentId: string, status: Application['status'], message: string) => {
    await updateApplicationStatus(appId, status);
    await addNotification(studentId, 'Application Update', `Status updated for ${myCompanyName}: ${message}`, 'JOB');
    alert(`Status updated to ${status}`);
  };

  const handleGenerateOfferLetter = (candidateName: string, jobTitle: string) => {
    const content = `
OFFER LETTER
--------------------------------------------------
Dear ${candidateName},

We are pleased to offer you the position of ${jobTitle} at ${myCompanyName}.

Joining Date: June 1st, 2026
Location: North Campus Office
Salary Details: Performance-based increments as per company policy.

Please accept this offer through the portal within 48 hours.

Congratulations on joining our mission!

Regards,
Hiring Team, ${myCompanyName}
--------------------------------------------------
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Offer_Letter_${candidateName.replace(' ', '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadApplicants = () => {
    const data = myApplications.map(a => ({
      'Candidate': a.studentName,
      'Job Title': a.jobTitle,
      'Status': a.status,
      'Applied Date': new Date(a.appliedAt).toLocaleDateString()
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');
    XLSX.writeFile(workbook, `${myCompanyName}_Applicants.xlsx`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-sans text-slate-900">{myCompanyName} Hiring Console</h1>
          <p className="text-slate-500">Recruitment cycle tracking and candidate management.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadApplicants}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <FileText size={18} />
            Export Candidates
          </button>
          <button 
            onClick={() => setShowPostJob(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
            Post New Job
          </button>
        </div>
      </div>

      {showPostJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                 <h2 className="text-xl font-bold text-slate-900">Post New Job Opening</h2>
                 <p className="text-sm text-slate-500">Target candidates across campus.</p>
               </div>
               <button onClick={() => setShowPostJob(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><XCircle /></button>
            </div>
            
            <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Job Title</label>
                    <input 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      placeholder="Software Engineer..."
                      value={newJob.title}
                      onChange={e => setNewJob({...newJob, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Salary Package</label>
                    <input 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      placeholder="12 LPA"
                      value={newJob.salary}
                      onChange={e => setNewJob({...newJob, salary: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                 <textarea 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
                   placeholder="Describe the role and responsibilities..."
                   value={newJob.description}
                   onChange={e => setNewJob({...newJob, description: e.target.value})}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Min CGPA</label>
                    <input 
                      type="number" step="0.1"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      value={newJob.minCgpa}
                      onChange={e => {
                        const val = e.target.value;
                        setNewJob({...newJob, minCgpa: val === '' ? 0 : parseFloat(val) || 0});
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Deadline</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      value={newJob.deadline}
                      onChange={e => setNewJob({...newJob, deadline: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Target Branches</label>
                  <div className="flex flex-wrap gap-2">
                    {['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'MBA'].map(branch => (
                      <button
                        key={branch}
                        onClick={() => {
                          const branches = newJob.branches.includes(branch) 
                            ? newJob.branches.filter(b => b !== branch)
                            : [...newJob.branches, branch];
                          setNewJob({...newJob, branches});
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          newJob.branches.includes(branch) 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {branch}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-3">
               <button 
                 onClick={() => setShowPostJob(false)}
                 className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
               >
                 Cancel
               </button>
               <button 
                 onClick={handlePostJob}
                 className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
               >
                 <Send size={18} />
                 Publish Job
               </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
         {['applications', 'jobs', 'interviews'].map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveSubTab(tab as any)}
             className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
               activeSubTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
             }`}
           >
             {tab}
             {activeSubTab === tab && <motion.div layoutId="activeHRTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
           {activeSubTab === 'applications' && (
             <div className="space-y-4">
               {myApplications.length > 0 ? myApplications.map(app => (
                 <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                        {app.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{app.studentName}</h4>
                        <p className="text-sm text-slate-500 font-medium">Position: {app.jobTitle}</p>
                        <div className="flex items-center gap-3 mt-2">
                           <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                             app.status === 'OFFERED' ? 'bg-emerald-100 text-emerald-700' : 
                             app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                           }`}>
                             {app.status}
                           </span>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      {app.status === 'OFFERED' && (
                        <button 
                          onClick={() => handleGenerateOfferLetter(app.studentName, app.jobTitle)}
                          className="px-4 py-2 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2"
                        >
                          <FileText size={14} /> Download Letter
                        </button>
                      )}
                      {app.status === 'APPLIED' && (
                        <button 
                          onClick={() => handleAction(app.id, app.studentId, 'INTERVIEW', 'Invitation for technical round')}
                          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                          <UserPlus size={16} /> Shortlist
                        </button>
                      )}
                      {(app.status === 'INTERVIEW' || app.status === 'SCREENING') && (
                        <button 
                          onClick={() => handleAction(app.id, app.studentId, 'OFFERED', 'Congratulations! You have an offer.')}
                          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center gap-2"
                        >
                          <Send size={16} /> Release Offer
                        </button>
                      )}
                      <button 
                        onClick={() => handleAction(app.id, app.studentId, 'REJECTED', 'Thank you for your interest.')}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <XCircle size={20} />
                      </button>
                   </div>
                 </div>
               )) : (
                 <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-medium font-mono">No active candidates found.</p>
                 </div>
               )}
             </div>
           )}

           {activeSubTab === 'interviews' && (
             <div className="space-y-4">
               {myApplications.filter(a => a.status === 'INTERVIEW').map(app => (
                 <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                        {app.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{app.studentName}</h4>
                        <p className="text-sm text-slate-500 font-medium">Round {app.currentRound || 1}: Technical Discussion</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={async () => await nextRound(app.id)}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center gap-2"
                      >
                        Next Round
                      </button>
                      <button 
                        onClick={() => handleAction(app.id, app.studentId, 'OFFERED', 'Final Selection: Releasing Offer')}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center gap-2"
                      >
                        Select & Release Offer
                      </button>
                   </div>
                 </div>
               ))}
               {myApplications.filter(a => a.status === 'INTERVIEW').length === 0 && (
                 <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-medium font-mono">No candidates currently being interviewed.</p>
                 </div>
               )}
             </div>
           )}

           {activeSubTab === 'jobs' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {myJobs.map(job => (
                 <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                       <h4 className="font-bold text-slate-900">{job.title}</h4>
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs text-slate-500 font-semibold">
                          <span>Salary: {job.salary}</span>
                          <span>Applicants: {applications.filter(a => a.jobId === job.id).length}</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-[65%]" />
                       </div>
                    </div>
                    <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                       View Detailed Stats
                    </button>
                 </div>
               ))}
             </div>
           )}
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-6">Talent Pipeline</h4>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Total Applicants</span>
                      <span className="text-xl font-bold font-mono">{myApplications.length}</span>
                   </div>
                   <div className="flex items-center justify-between text-indigo-400">
                      <span className="text-sm">In Interview</span>
                      <span className="text-xl font-bold font-mono">{myApplications.filter(a => a.status === 'INTERVIEW').length}</span>
                   </div>
                   <div className="flex items-center justify-between text-emerald-400">
                      <span className="text-sm">Offers Made</span>
                      <span className="text-xl font-bold font-mono">{myApplications.filter(a => a.status === 'OFFERED' || a.status === 'ACCEPTED').length}</span>
                   </div>
                   <div className="flex items-center justify-between text-emerald-500">
                      <span className="text-sm">Accepted</span>
                      <span className="text-xl font-bold font-mono">{myApplications.filter(a => a.status === 'ACCEPTED').length}</span>
                   </div>
                   <div className="flex items-center justify-between text-red-400">
                      <span className="text-sm">Rejected/Declined</span>
                      <span className="text-xl font-bold font-mono">{myApplications.filter(a => a.status === 'REJECTED' || a.status === 'DECLINED').length}</span>
                   </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
           </div>

           <div className="bg-indigo-600 p-8 rounded-3xl text-white">
              <h4 className="font-bold mb-4">Urgent: Data Cleanup</h4>
              <p className="text-xs text-indigo-100 leading-relaxed mb-6">
                Your opening for "{myJobs[0]?.title || 'Software Lead'}" expires in 48 hours. Consider extending the deadline if applicant count is low.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                Extend Deadline
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
