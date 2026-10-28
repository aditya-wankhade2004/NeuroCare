'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Download, Calendar, ShieldCheck, Eye } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      id: 'rep-1',
      title: 'Weekly Cognitive Wellness Summary',
      period: 'Oct 21, 2026 – Oct 27, 2026',
      type: 'PDF Document',
      size: '1.4 MB',
      status: 'Ready',
    },
    {
      id: 'rep-2',
      title: '14-Day Baseline Calibration Assessment',
      period: 'Oct 14, 2026 – Oct 27, 2026',
      type: 'Clinical Audit Brief',
      size: '2.8 MB',
      status: 'Ready',
    },
    {
      id: 'rep-3',
      title: 'Monthly Autonomic Sleep & Heart Rate Report',
      period: 'Sep 28, 2026 – Oct 28, 2026',
      type: 'Longitudinal Telemetry CSV',
      size: '4.2 MB',
      status: 'Ready',
    },
  ];

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
            Health & Cognitive Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive wellness summaries compiled from longitudinal sensor feeds and self-assessments.
          </p>
        </div>

        <button
          onClick={() => alert("Compiling latest 7-day health metrics into a fresh PDF summary...")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          Generate New Report
        </button>
      </div>

      {/* Reports Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Available Health Summaries
          </span>
          <span className="text-xs text-slate-500">Encrypted Export Available</span>
        </div>

        <div className="divide-y divide-slate-100">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{rep.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {rep.period}
                    </span>
                    <span>•</span>
                    <span>{rep.type}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{rep.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => alert(`Opening preview of ${rep.title}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  Preview
                </button>
                <button
                  onClick={() => alert(`Simulated download for ${rep.title}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 transition-colors inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
