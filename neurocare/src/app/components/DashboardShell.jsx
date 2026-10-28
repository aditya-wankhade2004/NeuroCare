'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { MOCK_USER_PROFILE, MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

const DashboardContext = createContext(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardShell');
  }
  return context;
}

export default function DashboardShell({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [user, setUser] = useState(MOCK_USER_PROFILE);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const contextValue = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isDemoMode,
    setIsDemoMode,
    handleToggleDemoMode,
    user,
    notifications,
    handleMarkAllRead,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-cyan-500 selection:text-white">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={isMobileSidebarOpen}
          setMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Content Wrapper */}
        <div
          className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Header */}
          <DashboardHeader
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            user={user}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            isDemoMode={isDemoMode}
            onToggleDemoMode={handleToggleDemoMode}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>

          {/* Medical Disclaimer & Security Footer */}
          <footer className="border-t border-slate-200 bg-white/70 py-4 px-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Medical Disclaimer:</strong> NeuroSense 2.0 is a personal wellness monitoring and cognitive self-assessment platform. It is not an FDA-cleared medical device and does not diagnose neurological conditions, strokes, or cognitive disorders. Consult a licensed physician for medical advice.
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-teal-600" />
                  RLS Encrypted
                </span>
                <span>•</span>
                <span>HIPAA & GDPR Ready</span>
                <span>•</span>
                <span className="font-mono text-slate-400">Build 2.0.4</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
