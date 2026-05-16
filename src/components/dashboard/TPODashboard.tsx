/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Building2, UserCheck, TrendingUp, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';

export const TPODashboard: React.FC = () => {
  const { users, jobs, applications, setActiveTab } = useApp();
  
  const totalStudents = users.filter(u => u.role === 'STUDENT').length;
  const placedStudents = users.filter(u => u.role === 'STUDENT' && applications.some(a => a.studentId === u.id && a.status === 'OFFERED')).length;
  const totalCompanies = [...new Set(jobs.map(j => j.companyId))].length;

  const handleDownloadReport = () => {
    // Generate data for the report
    const reportData = users.filter(u => u.role === 'STUDENT').map(student => {
      const studentApps = applications.filter(a => a.studentId === student.id);
      const isPlaced = studentApps.some(a => a.status === 'OFFERED');
      const placedCompany = studentApps.find(a => a.status === 'OFFERED')?.companyName || 'N/A';
      
      return {
        'Student Name': student.name,
        'Email': student.email,
        'Department': student.department || 'N/A',
        'CGPA': student.cgpa || 0,
        'Status': isPlaced ? 'PLACED' : 'PENDING',
        'Placed Company': placedCompany,
        'Total Applications': studentApps.length
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Placement Report');
    XLSX.writeFile(workbook, `Placement_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const data = [
    { name: 'CSE', placed: 45, total: 60 },
    { name: 'IT', placed: 38, total: 55 },
    { name: 'ECE', placed: 25, total: 50 },
    { name: 'ME', placed: 15, total: 45 },
  ];

  const pieData = totalStudents > 0 ? [
    { name: 'Placed', value: placedStudents }, 
    { name: 'Remaining', value: totalStudents - placedStudents },
  ] : [
    { name: 'Placed', value: 0 },
    { name: 'Remaining', value: 1 }, // Show empty gray circle if no students
  ];
  const COLORS = ['#6366f1', '#f1f5f9'];

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Registered Students', value: totalStudents, icon: <Users />, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Active Companies', value: totalCompanies, icon: <Building2 />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Offers Released', value: applications.filter(a => a.status === 'OFFERED').length, icon: <UserCheck />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Placement Rate', value: `${Math.round((placedStudents/totalStudents) * 100) || 0}%`, icon: <TrendingUp />, color: 'bg-amber-50 text-amber-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placement Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Placement by Department</h3>
            <button 
              onClick={handleDownloadReport}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Download Report
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="placed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overview & Quick Actions */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-12">
              <div className="h-40 w-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                       {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                     </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-2xl font-bold font-mono">
                    {totalStudents > 0 ? placedStudents : 0}/{totalStudents}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Placed</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Overall Progress</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Current placement cycle is 40% ahead of last year. 3 new premium companies scheduled for next week.
                </p>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <TrendingUp size={14} /> +12%
                  </div>
                  <span className="text-xs text-slate-400">vs last month</span>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-100 flex flex-col items-center justify-center gap-3">
                <Plus size={24} />
                <span className="font-bold text-sm text-center">Use Side Menu to Manage Companies</span>
              </div>
              <button 
                onClick={() => setActiveTab('companies')}
                className="bg-white text-slate-900 border border-slate-200 p-6 rounded-2xl hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-3"
              >
                <Building2 size={24} className="text-indigo-600" />
                <span className="font-bold text-sm">Manage Companies</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
