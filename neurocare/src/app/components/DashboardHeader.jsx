'use client';

import React, { useState } from 'react';
import { Menu, Bell, Calendar, Sparkles, ChevronDown } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

export default function DashboardHeader({
  pageTitle = "Dashboard",
  onOpenMobileSidebar,
  user,
  notifications,
  onMarkAllRead,
  isDemoMode,
  onToggleDemoMode,
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Formatted date string
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              {pageTitle}
            </h1>
            {isDemoMode && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                <Sparkles className="w-3 h-3 text-cyan-600" />
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Intelligent personal health & cognitive wellness tracking
          </p>
        </div>
      </div>

      {/* Right: Date, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-cyan-600" />
          <span>{todayFormatted}</span>
        </div>

        {/* Demo Mode Toggle Button for quick user test */}
        <button
          onClick={onToggleDemoMode}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          title="Toggle between populated Demo Data and clean Empty States"
        >
          <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-teal-500' : 'bg-slate-300'}`} />
          <span className="text-[11px]">{isDemoMode ? 'Data: Sample' : 'Data: Empty'}</span>
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            aria-label="View notifications"
            aria-expanded={isNotifOpen}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            notifications={notifications || []}
            onMarkAllRead={onMarkAllRead}
          />
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            aria-label="User account menu"
            aria-expanded={isProfileOpen}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-700 to-teal-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
              {user?.initials || 'AM'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'Alex Morgan'}
              </span>
              <span className="block text-[10px] text-slate-500 leading-tight">
                {user?.tier || 'Personal'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          <ProfileDropdown
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            user={user}
            isDemoMode={isDemoMode}
            onToggleDemoMode={onToggleDemoMode}
          />
        </div>
      </div>
    </header>
  );
}
