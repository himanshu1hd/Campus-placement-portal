/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, DollarSign, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const JobBoard: React.FC = () => {
  const { jobs, currentUser, applications, applyToJob } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [onlyEligible, setOnlyEligible] = React.useState(true);

  const isEligible = (job: typeof jobs[0]) => {
    if (!currentUser || currentUser.role !== 'STUDENT') return true;
    return (currentUser.cgpa || 0) >= job.minCgpa && job.branches.includes(currentUser.branch || '');
  };

  const filteredJobs = jobs.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!onlyEligible || isEligible(job))
  );

  const hasApplied = (jobId: string) => applications.some(a => a.jobId === jobId && a.studentId === currentUser?.id);

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by role, company or skills..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {currentUser?.role === 'STUDENT' && (
          <button 
            onClick={() => setOnlyEligible(!onlyEligible)}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              onlyEligible ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 border border-slate-100'
            }`}
          >
            {onlyEligible ? <CheckCircle2 size={18} /> : null}
            Eligible Only
          </button>
        )}

        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Filter
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredJobs.map((job, index) => (
          <motion.div 
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  {job.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <p className="text-slate-600 font-medium mb-4">{job.companyName}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={16} />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>Remote / Office</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                      <Calendar size={16} />
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                <div className="flex gap-2 mb-2">
                  {job.branches.map(branch => (
                    <span key={branch} className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider italic">
                      {branch}
                    </span>
                  ))}
                </div>
                
                {currentUser?.role !== 'STUDENT' ? (
                  <div className="w-full py-3 px-4 bg-slate-50 text-slate-400 rounded-xl text-xs font-medium text-center border border-slate-100 italic">
                    Students can apply for this role
                  </div>
                ) : hasApplied(job.id) ? (
                  <button disabled className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold border border-emerald-100 flex items-center justify-center gap-2">
                    <Search size={18} />
                    Applied
                  </button>
                ) : (
                  <button 
                    onClick={async () => {
                      if (currentUser.isBlocked) {
                        alert('Your account is restricted. Contact coordinator.');
                        return;
                      }
                      await applyToJob(job);
                      alert('Successfully applied!');
                    }}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    Apply Now
                    <ChevronRight size={18} />
                  </button>
                )}
                <p className="text-xs text-slate-400">Min CGPA required: {job.minCgpa}</p>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50">
               <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                 {job.description}
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
