'use client';

import React from 'react';
import Link from 'next/link';
import { Play, FileText, Sparkles, ShieldCheck } from 'lucide-react';

export default function WelcomeBanner({ userName = "Alex", isDemoMode = true }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A1128] via-[#0E1E38] to-[#132A4A] text-white p-6 sm:p-8 shadow-sm border border-slate-800/80">
      {/* Background subtle neural grid glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left text */}
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Cognitive Wellness Active
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo Data Active
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back!
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-300 font-normal">
            Your personal health and cognitive wellness overview.
          </p>

          <p className="mt-2 text-xs text-slate-400 max-w-xl">
            Baseline calibration is active. All continuous telemetry feeds are synchronized with your local health profile.
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
          <Link
            href="/assessments"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Assessment
          </Link>

          <Link
            href="/reports"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            View Health Report
          </Link>
        </div>
      </div>
    </div>
  );
}
