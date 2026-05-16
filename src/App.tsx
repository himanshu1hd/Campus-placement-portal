/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './components/auth/Login';
import { Layout } from './components/common/Layout';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TPODashboard } from './components/dashboard/TPODashboard';
import { HRDashboard } from './components/dashboard/HRDashboard';
import { CoordinatorDashboard } from './components/dashboard/CoordinatorDashboard';
import { JobBoard } from './components/dashboard/JobBoard';
import { ProfileEditor } from './components/profile/ProfileEditor';
import { InterviewScheduler } from './components/interviews/InterviewScheduler';
import { StudentManagement } from './components/dashboard/StudentManagement';
import { CompanyManager } from './components/dashboard/CompanyManager';

const MainContent: React.FC = () => {
  const { currentUser, authLoading, activeTab, setActiveTab } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    const role = currentUser.role?.toUpperCase();
    switch (activeTab) {
      case 'dashboard':
        switch (role) {
          case 'STUDENT': return <StudentDashboard />;
          case 'TPO': return <TPODashboard />;
          case 'HR': return <HRDashboard />;
          case 'COORDINATOR': return <CoordinatorDashboard />;
          default: return <p>Dashboard coming soon...</p>;
        }
      case 'jobs':
        return <JobBoard />;
      case 'companies':
        return <CompanyManager />;
      case 'students':
        return <StudentManagement />;
      case 'profile':
        return <ProfileEditor />;
      case 'calendar':
        return <InterviewScheduler />;
      case 'analytics':
        return <TPODashboard />;
      case 'queries':
        return role === 'COORDINATOR' ? <CoordinatorDashboard /> : <StudentDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <h2 className="text-2xl font-bold">Work in Progress</h2>
            <p>This module is currently being optimized for #techforwardnow</p>
          </div>
        );
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
