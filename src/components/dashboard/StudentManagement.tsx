/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle, Clock, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export const StudentManagement: React.FC = () => {
  const { users, currentUser, verifyStudent, blockStudent, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStudents = users.filter(u => 
    u.role === 'STUDENT' && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (currentUser?.role === 'COORDINATOR' ? u.department === currentUser.department : true)
  );

  const handleVerify = async (id: string, name: string) => {
    await verifyStudent(id, true);
    await addNotification(id, 'Profile Verified', 'Your profile has been verified successfully.', 'ANNOUNCEMENT');
  };

  const handleToggleBlock = async (id: string, name: string, isBlocked?: boolean) => {
    await blockStudent(id, !isBlocked);
    await addNotification(id, isBlocked ? 'Account Unblocked' : 'Account Blocked', `Account status updated by ${currentUser?.role}.`, 'ANNOUNCEMENT');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h2 className="text-xl font-bold text-slate-900">Student Profiles</h2>
        <div className="flex flex-1 max-w-md gap-2">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search students..."
               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Academic</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Verification</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student, index) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700">{student.branch}</p>
                    <p className="text-xs text-slate-400">CGPA: {student.cgpa}</p>
                  </td>
                  <td className="px-6 py-4">
                    {student.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12} /> VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full">
                        <Clock size={12} /> PENDING
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {student.isBlocked ? (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                        <AlertCircle size={12} /> BLOCKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full">
                        <ShieldCheck size={12} /> ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {!student.isVerified && (
                         <button 
                           onClick={() => handleVerify(student.id, student.name)}
                           className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                           title="Verify Profile"
                         >
                           <CheckCircle2 size={18} />
                         </button>
                       )}
                       <button 
                         onClick={() => handleToggleBlock(student.id, student.name, student.isBlocked)}
                         className={`p-2 rounded-lg transition-colors ${student.isBlocked ? 'text-blue-600 hover:bg-blue-50' : 'text-red-600 hover:bg-red-50'}`}
                         title={student.isBlocked ? 'Unblock' : 'Block'}
                       >
                         {student.isBlocked ? <ShieldCheck size={18} /> : <XCircle size={18} />}
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
