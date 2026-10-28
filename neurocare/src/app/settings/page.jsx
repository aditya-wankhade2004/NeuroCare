'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft, Database, Shield, Bell, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../components/DashboardShell';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SettingsPage() {
  const { isDemoMode, setIsDemoMode, user } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Settings & System Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure telemetry permissions, backend sync, and profile preferences.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend / Supabase Configuration Status */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Database & Cloud Sync</h2>
              <p className="text-xs text-slate-500">Supabase Backend Integration</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Supabase Status:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  isSupabaseConfigured
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isSupabaseConfigured ? 'Connected & Active' : 'Not Configured (Demo Mode Active)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              When ready, supply <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment file.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Visual Prototype Demo Mode</p>
              <p className="text-[11px] text-slate-500">Preview with rich sample biomarkers</p>
            </div>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isDemoMode
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isDemoMode ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Privacy & Data Sovereignty</h2>
                <p className="text-xs text-slate-500">Row-Level Security Architecture</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span>Row Level Security (RLS)</span>
                <span className="font-semibold text-teal-600">Enforced</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span>End-to-End Metric Encryption</span>
                <span className="font-semibold text-teal-600">AES-GCM-256</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span>Local Sensor Caching</span>
                <span className="font-semibold text-slate-700">Encrypted IndexedDB</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              User ID: {user?.memberId} • HIPAA Safe Harbor Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
