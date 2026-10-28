'use client';

import React from 'react';
import Link from 'next/link';
import { User, Settings, ShieldCheck, ToggleLeft, ToggleRight, LogOut, Sparkles } from 'lucide-react';

export default function ProfileDropdown({
  user,
  isOpen,
  onClose,
  isDemoMode,
  onToggleDemoMode,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover */}
      <div
        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        role="dialog"
        aria-label="User profile menu"
      >
        {/* Header Profile Info */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-700 text-white font-semibold flex items-center justify-center text-sm shadow-sm ring-2 ring-cyan-500/20">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">ID: {user.memberId}</p>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-100/70 text-cyan-800">
                <Sparkles className="w-3 h-3 text-cyan-600" />
                {user.tier}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Mode Switcher */}
        <div className="p-3 border-b border-slate-100 bg-cyan-50/30">
          <button
            onClick={onToggleDemoMode}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white text-left transition-colors border border-cyan-100/50"
            title="Toggle between populated Demo Data and clean Empty States"
          >
            <div>
              <p className="text-xs font-semibold text-slate-800">Demo Data Mode</p>
              <p className="text-[11px] text-slate-500">
                {isDemoMode ? 'Previewing sample metrics' : 'Showing empty states'}
              </p>
            </div>
            {isDemoMode ? (
              <ToggleRight className="w-6 h-6 text-cyan-600" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>

        {/* Nav Links */}
        <div className="py-1">
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-cyan-700 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            Account Settings
          </Link>
          <Link
            href="/baseline"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-cyan-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Baseline Calibration
          </Link>
        </div>

        {/* Logout / Neutral Reset */}
        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              onClose();
              alert("Neutral session reset: Simulated logout. Supabase authentication can be connected in next phase.");
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out / Reset Session
          </button>
        </div>
      </div>
    </>
  );
}
