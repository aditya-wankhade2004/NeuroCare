'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export default function NeuroTwinTimeline({
  timeline,
  selectedCategory,
  onSelectTimelineEntry,
  isDemoMode = true,
}) {
  const [filterRange, setFilterRange] = useState('30d'); // '7d' | '30d' | '90d'

  const hasTimeline = Boolean(timeline && timeline.length > 0);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Historical Health Timeline
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Audit Trail
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological log of assessment completions, wearable telemetry syncs, and baseline recalibrations.
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setFilterRange(range)}
              className={`px-3 py-1 rounded-lg uppercase transition-all ${
                filterRange === range
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Entries List */}
      {hasTimeline ? (
        <div className="relative pl-6 space-y-5 border-l-2 border-slate-200">
          {timeline.map((entry) => {
            const isEntrySelected = selectedCategory === entry.category;

            return (
              <div
                key={entry.id}
                onClick={() => onSelectTimelineEntry(entry.category)}
                className={`relative group cursor-pointer p-4 rounded-xl border transition-all ${
                  isEntrySelected
                    ? 'bg-cyan-50/40 border-cyan-300 shadow-xs ring-1 ring-cyan-200'
                    : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Timeline node dot on vertical border line */}
                <div
                  className={`absolute -left-[31px] top-5 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125 ${
                    isEntrySelected
                      ? 'bg-cyan-500 border-white ring-4 ring-cyan-100'
                      : 'bg-white border-cyan-600'
                  }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {entry.date}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-[11px] font-medium text-slate-500">{entry.source}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 group-hover:text-cyan-700 transition-colors">
                      {entry.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-0.5">
                      {entry.summary}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-cyan-600 group-hover:text-cyan-700 inline-flex items-center gap-1 self-start sm:self-center">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No timeline checkpoints recorded</h4>
          <p className="text-xs text-slate-400 mt-1">
            Complete a self-assessment or establish your baseline to generate historical timeline markers.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Timeline entries linked to local audit logs</span>
        <Link href="/reports" className="text-cyan-700 font-semibold hover:underline">
          View Compiled Health Reports →
        </Link>
      </div>
    </div>
  );
}

