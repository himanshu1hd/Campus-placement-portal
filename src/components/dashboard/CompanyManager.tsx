/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Building2, Briefcase, ChevronRight, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CompanyManager: React.FC = () => {
  const { companies, jobs, addCompany, postJob } = useApp();
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddJob, setShowAddJob] = useState<string | null>(null);

  const [newCompany, setNewCompany] = useState({ name: '', description: '' });
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    minCgpa: 7.0,
    salary: '',
    deadline: '',
    branches: ['CSE', 'IT'] as string[]
  });

  const handleAddCompany = async () => {
    if (!newCompany.name) return;
    await addCompany(newCompany);
    setNewCompany({ name: '', description: '' });
    setShowAddCompany(false);
  };

  const handlePostJob = async (companyId: string, companyName: string) => {
    if (!newJob.title) return;
    await postJob({
      ...newJob,
      companyId,
      companyName,
      status: 'OPEN',
      deadline: newJob.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setNewJob({
      title: '',
      description: '',
      requirements: '',
      minCgpa: 7.0,
      salary: '',
      deadline: '',
      branches: ['CSE', 'IT']
    });
    setShowAddJob(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Manage Companies & Jobs</h2>
        <button 
          onClick={() => setShowAddCompany(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          <Building2 size={20} />
          Register New Company
        </button>
      </div>

      <AnimatePresence>
        {showAddCompany && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Company Registration</h3>
              <button onClick={() => setShowAddCompany(false)} className="text-slate-400 p-2"><X /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-500">Company Name</label>
                 <input 
                   type="text" 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                   value={newCompany.name}
                   onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-500">Description</label>
                 <input 
                   type="text" 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                   value={newCompany.description}
                   onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                 />
               </div>
            </div>
            <button onClick={handleAddCompany} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
              <Save size={20} /> Confirm Registration
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {companies.map(company => (
          <div key={company.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-80 bg-slate-50 p-8 border-r border-slate-100 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                 <Building2 size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">{company.name}</h3>
               <p className="text-sm text-slate-500 mb-6">{company.description}</p>
               <button 
                 onClick={() => setShowAddJob(company.id)}
                 className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-white px-4 py-2 rounded-lg transition-colors"
               >
                 <Plus size={18} /> Add Requirement
               </button>
            </div>
            
            <div className="flex-1 p-8">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Current Openings</h4>
               <div className="space-y-4">
                  {jobs.filter(j => j.companyId === company.id).map(job => (
                    <div key={job.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.salary} • {job.branches.join(', ')}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  ))}

                  {showAddJob === company.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-200 mt-4 space-y-4"
                    >
                      <div className="flex justify-between">
                        <h5 className="font-bold text-indigo-900">New Job Requirement</h5>
                        <button onClick={() => setShowAddJob(null)} className="text-indigo-400"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Job Title (e.g. SDE-1)" 
                          className="px-4 py-2 bg-white border border-indigo-100 rounded-xl outline-none"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        />
                        <input 
                          type="text" 
                          placeholder="Salary (e.g. 15 LPA)" 
                          className="px-4 py-2 bg-white border border-indigo-100 rounded-xl outline-none"
                          value={newJob.salary}
                          onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        />
                        <input 
                          type="number" 
                          placeholder="Min CGPA"
                          className="px-4 py-2 bg-white border border-indigo-100 rounded-xl outline-none"
                          value={newJob.minCgpa}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewJob({ ...newJob, minCgpa: val === '' ? 0 : parseFloat(val) || 0 });
                          }}
                        />
                        <input 
                          type="date" 
                          className="px-4 py-2 bg-white border border-indigo-100 rounded-xl outline-none"
                          value={newJob.deadline}
                          onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                        />
                      </div>
                      <textarea 
                        placeholder="Requirements & Description"
                        className="w-full px-4 py-3 bg-white border border-indigo-100 rounded-xl outline-none"
                        rows={3}
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value, requirements: e.target.value })}
                      />
                      <button 
                        onClick={() => handlePostJob(company.id, company.name)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        <Plus size={18} /> Post Job Requirement
                      </button>
                    </motion.div>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
