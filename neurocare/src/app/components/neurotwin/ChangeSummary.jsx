'use client';

import React from 'react';
import {
  Lightbulb,
  TrendingDown,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function ChangeSummary({
  changes,
  isDemoMode = true,
}) {
  const hasChanges = Boolean(changes && changes.length > 0);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              What Changed?
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Evidence-Based
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective mathematical variance detection relative to your individual 14-day rolling baseline.
          </p>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:block">
          Rule-Based Synthesizer v2.0
        </span>
      </div>

      {/* Changes Grid */}
      {hasChanges ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {changes.map((change) => {
            return (
              <div
                key={change.id}
                className="flex flex-col justify-between p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-cyan-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {change.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      <TrendingUp className="w-3 h-3 text-teal-600" />
                      {change.differenceFormatted}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {change.metricName}
                  </h4>

                  {/* Baseline vs Recent */}
                  <div className="flex items-baseline justify-between text-xs mt-3 p-2.5 bg-white rounded-lg border border-slate-200/60">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Baseline:</span>
                      <strong className="text-slate-700">{change.baselineValue}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Recent:</span>
                      <strong className="text-slate-900">{change.recentValue}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {change.explanation}
                  </p>
                </div>

                {/* Metadata & Quality limitations */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date Window:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[170px]">{change.dateRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Observations:</span>
                    <span className="font-medium text-slate-700">{change.observationsCount} sessions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Data Fidelity:</span>
                    <span className="text-teal-700 font-semibold">{change.qualityRating}</span>
                  </div>

                  {change.contextNote && (
                    <div className="mt-2 pt-2 border-t border-slate-200/40 text-[10px] text-slate-500 italic">
                      {change.contextNote}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No variance summaries available</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Variances appear automatically as multiple sessions are compared against your personal reference period.
          </p>
        </div>
      )}

      {/* Medical Safety Disclaimer Strip */}
      <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Non-Diagnostic Advisory:</strong> Personal change summaries reflect statistical variance from your historical reference standards. They do not diagnose neurological disease, stroke, or cognitive impairment.
        </p>
      </div>
    </div>
  );
}

