/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Bell, 
  LogOut,
  BarChart3,
  MessageSquare,
  UserCircle,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, notifications, activeTab, setActiveTab } = useApp();
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.isRead).length;

  if (!currentUser) return <>{children}</>;
  const role = currentUser.role?.toUpperCase() || '';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['STUDENT', 'TPO', 'HR', 'COORDINATOR'] },
    { id: 'companies', label: 'Companies', icon: <Building2 size={20} />, roles: ['TPO'] },
    { id: 'jobs', label: 'Job Board', icon: <Briefcase size={20} />, roles: ['STUDENT', 'TPO', 'HR'] },
    { id: 'students', label: 'Students', icon: <Users size={20} />, roles: ['TPO', 'HR', 'COORDINATOR'] },
    { id: 'calendar', label: 'Schedule', icon: <Calendar size={20} />, roles: ['STUDENT', 'TPO', 'HR'] },
    { id: 'profile', label: 'My Profile', icon: <UserCircle size={20} />, roles: ['STUDENT'] },
    { id: 'analytics', label: 'Stats', icon: <BarChart3 size={20} />, roles: ['TPO', 'COORDINATOR'] },
    { id: 'queries', label: 'Queries', icon: <MessageSquare size={20} />, roles: ['COORDINATOR'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex">
        <Logo size="sm" className="mb-10 px-2" />
        
        <nav className="flex-1 space-y-2">
          {filteredMenu.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
