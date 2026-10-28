'use client';

import React, { useState } from 'react';
import {
  History,
  Calendar,
  Clock,
  Filter,
  Zap,
  Target,
  Layers,
  Activity,
  CheckCircle2,
  ChevronRight,
  Search,
} from 'lucide-react';

const TYPE_ICONS = {
  NeuroReaction: Zap,
  NeuroAttention: Target,
  NeuroMemory: Layers,
  NeuroMotion: Activity,
};

export default function AssessmentHistoryTable({
  history,
  isDemoMode = true,
  onSelectSession,
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = (history || []).filter((item) => {
    if (selectedFilter !== 'ALL' && item.type !== selectedFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchType = item.type.toLowerCase().includes(q);
      const matchResult = item.mainResult.toLowerCase().includes(q);
      const matchDate = item.date.toLowerCase().includes(q);
      if (!matchType && !matchResult && !matchDate) return false;
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Assessment Session History
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Audit Feed
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological audit log of all completed cognitive and motor test trials.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'NeuroReaction', 'NeuroAttention', 'NeuroMemory', 'NeuroMotion'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'ALL' ? 'All Tests' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* History Table / Responsive List */}
      {filteredHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/70 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold rounded-l-xl">Assessment</th>
                <th scope="col" className="px-4 py-3 font-semibold">Date & Time</th>
                <th scope="col" className="px-4 py-3 font-semibold">Measured Result</th>
                <th scope="col" className="px-4 py-3 font-semibold">Duration</th>
                <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                <th scope="col" className="px-4 py-3 font-semibold rounded-r-xl text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item) => {
                const IconComponent = TYPE_ICONS[item.type] || Zap;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onSelectSession && onSelectSession(item)}
                  >
                    {/* Assessment Type */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-cyan-700 transition-colors">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.validTrials}</span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                    </td>

                    {/* Result */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block font-mono">
                        {item.mainResult}
                      </span>
                      {item.subResult && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.subResult}
                        </span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.duration}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-4 py-3.5 text-slate-500">
                      <span className="text-[11px] truncate max-w-[140px] block" title={item.source}>
                        {item.source}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No assessment history matching filter</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Complete your first interactive test above to generate verified behavioral audit records.
          </p>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Session Data Protection: AES-GCM-256 local encrypted session store</span>
        <span className="font-mono">Audited: NeuroSense Cloud</span>
      </div>
    </div>
  );
}
