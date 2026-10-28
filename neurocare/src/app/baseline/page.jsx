'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, ShieldCheck, CheckCircle2, RefreshCw, Calendar } from 'lucide-react';

export default function BaselinePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
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
            Health Baseline Calibration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Establish and manage your rolling 14-day individualized reference standards.
          </p>
        </div>

        <button
          onClick={() => alert("Baseline calibration re-calculation started. This will integrate your latest 14 days of telemetry.")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Recalibrate Baseline
        </button>
      </div>

      {/* Baseline Status Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Current Reference Window</h2>
              <p className="text-xs text-slate-500">Oct 14, 2026 – Oct 27, 2026 (14 Days Complete)</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Active & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500">Reaction Time Baseline</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">226 ms</p>
            <p className="text-[11px] text-teal-600 mt-1 font-medium">Standard deviation ±14 ms</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500">Resting Heart Rate</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">65 BPM</p>
            <p className="text-[11px] text-teal-600 mt-1 font-medium">Interquartile range 62–68 BPM</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-500">Sleep Duration Target</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">7.5 Hours</p>
            <p className="text-[11px] text-teal-600 mt-1 font-medium">Average sleep efficiency 87%</p>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 text-xs text-cyan-900">
          <p className="font-semibold mb-1">Baseline Principle</p>
          <p className="text-slate-600 leading-relaxed">
            NeuroSense evaluates cognitive variances strictly relative to your own physiological normal. It avoids universal comparisons or normative disease thresholds.
          </p>
        </div>
      </div>
    </div>
  );
}
