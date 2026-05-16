/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InterviewScheduler: React.FC = () => {
  const { applications, interviews, scheduleInterview, addNotification } = useApp();
  
  const interviewApplications = applications.filter(a => a.status === 'INTERVIEW');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleSchedule = async (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    // In a real app, this would show a time picker. 
    // Here we'll simulate picking a slot for 'Tomorrow at 10:00 AM'
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    await scheduleInterview({
      applicationId: appId,
      studentId: app.studentId,
      companyId: app.jobId, // Assuming job ID for now or lookup company
      companyName: app.companyName,
      scheduledAt: tomorrow.toISOString(),
      location: 'Main Conference Room (C-Block)',
      round: 1,
      status: 'SCHEDULED'
    });

    await addNotification(app.studentId, 'Interview Scheduled', `Your interview for ${app.jobTitle} at ${app.companyName} is scheduled.`, 'INTERVIEW');
    setSelectedApp(null);
    alert('Interview slot successfully scheduled for tomorrow at 10:00 AM!');
  };

  const isScheduled = (appId: string) => interviews.some(i => i.applicationId === appId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Interview Scheduling</h1>
          <p className="text-slate-500">Book your time slots for upcoming recruitment rounds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {interviewApplications.length > 0 ? (
            interviewApplications.map(app => (
              <motion.div 
                key={app.id}
                layout
                className={`bg-white p-6 rounded-3xl border transition-all ${
                  isScheduled(app.id) ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100 hover:border-indigo-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex gap-4">
                      <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                        {app.companyName.at(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{app.jobTitle}</h4>
                        <p className="text-sm text-slate-500">{app.companyName}</p>
                        <div className="flex items-center gap-4 mt-2">
                           <span className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                             <Clock size={12} /> Round 1: Technical
                           </span>
                        </div>
                      </div>
                   </div>

                   <div>
                      {isScheduled(app.id) ? (
                        <div className="flex items-center gap-3">
                           <div className="text-right">
                              <p className="text-sm font-bold text-emerald-600">Confirmed</p>
                              <p className="text-xs text-slate-500">Oct 24, 10:00 AM</p>
                           </div>
                           <CheckCircle2 className="text-emerald-500" size={24} />
                        </div>
                      ) : (
                        <button 
                          onClick={() => setSelectedApp(app.id)}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                          Book Slot
                          <ChevronRight size={18} />
                        </button>
                      )}
                   </div>
                </div>

                <AnimatePresence>
                  {selectedApp === app.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map(time => (
                          <button 
                            key={time}
                            onClick={() => handleSchedule(app.id)}
                            className="p-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Calendar size={32} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">No Pending Schedules</h4>
                <p className="text-slate-500 max-w-xs mx-auto">Once a company shortlists you, invitations will appear here.</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-3xl text-white">
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl mb-4 flex items-center justify-center text-white">
                <AlertCircle size={24} />
              </div>
              <h4 className="font-bold mb-2">Important Instructions</h4>
              <ul className="text-xs text-slate-400 space-y-3 leading-relaxed">
                 <li>• Report 15 minutes before your scheduled slot.</li>
                 <li>• Keep electronic copies of your resume ready.</li>
                 <li>• Formal attire is mandatory for all rounds.</li>
                 <li>• Technical interviews may extend up to 45 mins.</li>
              </ul>
           </div>
           
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4">Venue Details</h4>
              <div className="flex items-start gap-3">
                 <MapPin className="text-indigo-600 mt-1 shrink-0" size={18} />
                 <div>
                    <p className="text-sm font-bold text-slate-800">Placement Cell (Floor 3)</p>
                    <p className="text-xs text-slate-500">Innovation Center, North Campus, University Drive.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
