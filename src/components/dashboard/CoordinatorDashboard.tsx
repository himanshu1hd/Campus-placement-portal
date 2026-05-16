import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, FileSpreadsheet, MessageSquare, Clock, MapPin, Plus, Send, X } from 'lucide-react';
import { StudentManagement } from './StudentManagement';
import * as XLSX from 'xlsx';

export const CoordinatorDashboard: React.FC = () => {
  const { users, currentUser, addNotification, queries, resolveQuery, refreshData } = useApp();
  const [showDriveForm, setShowDriveForm] = useState(false);
  const [newDrive, setNewDrive] = useState({ title: '', date: '', company: '' });
  
  const deptStudents = users.filter(u => u.role === 'STUDENT' && u.department === currentUser?.department);
  const deptQueries = queries.filter(q => q.department === currentUser?.department && q.status === 'PENDING');

  const handleDownloadReport = () => {
    const data = deptStudents.map(student => ({
      'Name': student.name,
      'Email': student.email,
      'CGPA': student.cgpa || 0,
      'Branch': student.branch || 'N/A',
      'Verified': student.isVerified ? 'YES' : 'NO',
      'Blocked': student.isBlocked ? 'YES' : 'NO'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dept Students');
    XLSX.writeFile(workbook, `${currentUser?.department}_Placement_Report.xlsx`);
  };

  const handleResolveQuery = async (id: string, name: string) => {
    const response = prompt(`Respond to ${name}'s query:`);
    if (response) {
      await resolveQuery(id, response);
      await addNotification(deptQueries.find(q => q.id === id)?.studentId || '', 'Query Resolved', `Coordinator: ${response}`, 'ANNOUNCEMENT');
      alert('Response sent!');
    }
  };

  const handleAddDrive = async () => {
    if (newDrive.title) {
      await addNotification(currentUser?.id || 'all', 'New Dept Drive', `Dept-specific drive scheduled for ${newDrive.company} on ${newDrive.date}`, 'ANNOUNCEMENT');
      for (const s of deptStudents) {
        await addNotification(s.id, 'Dept. Recruitment Drive', `${newDrive.company} is visiting specifically for ${currentUser?.department} students.`, 'JOB');
      }
      alert('Department drive scheduled and students notified!');
      setNewDrive({ title: '', date: '', company: '' });
      setShowDriveForm(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{currentUser?.department} Coordinator Panel</h1>
            <p className="text-slate-500">Managing {deptStudents.length} candidates and {deptQueries.length} pending queries.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadReport}
            className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 border border-slate-200"
          >
            <FileSpreadsheet size={18} />
            Dept Report
          </button>
          <button 
            onClick={async () => {
              for (const s of deptStudents) {
                await addNotification(s.id, 'Department Announcement', 'Verification cycle for upcoming drives is now active.', 'ANNOUNCEMENT');
              }
              alert('Announcement sent to all department students!');
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <MessageSquare size={18} />
            Bulk Broadcase
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <StudentManagement />

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Department Recruitment Drives</h3>
                <button onClick={() => setShowDriveForm(true)} className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                  <Plus size={20} /> Schedule Drive
                </button>
             </div>

             {showDriveForm && (
               <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                     <input 
                       type="text" 
                       placeholder="Drive Title" 
                       className="px-4 py-2 border border-slate-200 rounded-xl"
                       value={newDrive.title}
                       onChange={e => setNewDrive({...newDrive, title: e.target.value})}
                     />
                     <input 
                       type="text" 
                       placeholder="Company" 
                       className="px-4 py-2 border border-slate-200 rounded-xl"
                       value={newDrive.company}
                       onChange={e => setNewDrive({...newDrive, company: e.target.value})}
                     />
                     <input 
                       type="date" 
                       className="px-4 py-2 border border-slate-200 rounded-xl"
                       value={newDrive.date}
                       onChange={e => setNewDrive({...newDrive, date: e.target.value})}
                     />
                  </div>
                  <div className="flex justify-end gap-2">
                     <button onClick={() => setShowDriveForm(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
                     <button onClick={handleAddDrive} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Post Drive</button>
                  </div>
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { company: 'Techture', date: 'May 20, 2026', role: 'Software Intern' },
                  { company: 'Innovate Solutions', date: 'May 25, 2026', role: 'SDE-1' }
                ].map((drive, i) => (
                  <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-100 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                          {drive.company.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{drive.company}</p>
                          <p className="text-xs text-slate-500">{drive.role} • {drive.date}</p>
                        </div>
                     </div>
                     <MapPin size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-4">Department ROI</h3>
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-indigo-200">
                      <span>Placement Accuracy</span>
                      <span>{Math.round((deptStudents.filter(s => s.isVerified).length / (deptStudents.length || 1)) * 100)}%</span>
                   </div>
                   <div className="h-2 bg-indigo-500/50 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-500" style={{ width: `${Math.round((deptStudents.filter(s => s.isVerified).length / (deptStudents.length || 1)) * 100)}%` }}></div>
                   </div>
                 </div>
                 <div className="pt-4 border-t border-indigo-500/50">
                    <div className="flex items-center justify-between font-bold">
                       <span className="text-sm text-indigo-100">Eligible Students</span>
                       <span className="text-lg">{deptStudents.filter(s => s.cgpa && s.cgpa >= 6.5).length}</span>
                    </div>
                 </div>
               </div>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10">
               <ShieldCheck size={120} />
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
                Student Queries
                {deptQueries.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{deptQueries.length} New</span>}
             </h3>
             <div className="space-y-4">
                {deptQueries.length > 0 ? deptQueries.map((query) => (
                  <div key={query.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-xs text-indigo-600 uppercase tracking-tighter">{query.studentName}</p>
                        <span className="text-[10px] text-slate-400">{new Date(query.createdAt).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-slate-700 leading-snug mb-3">{query.message}</p>
                     <button 
                       onClick={() => handleResolveQuery(query.id, query.studentName)}
                       className="w-full py-2 bg-white border border-slate-200 text-indigo-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                     >
                       <Plus size={14} /> Respond & Resolve
                     </button>
                  </div>
                )) : (
                  <div className="text-center py-6">
                     <p className="text-xs text-slate-400 font-medium italic">All queries resolved!</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
