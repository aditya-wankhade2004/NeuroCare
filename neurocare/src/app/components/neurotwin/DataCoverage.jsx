'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  XCircle,
  Calendar,
  Cpu,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function DataCoverage({
  coverage,
  isDemoMode = true,
}) {
  const hasCoverage = Boolean(coverage && coverage.length > 0);

  const recordedCount = coverage ? coverage.filter((c) => c.hasData).length : 0;
  const totalCount = coverage ? coverage.length : 8;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Data Coverage & Metric Reliability
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              {recordedCount} of {totalCount} Active
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown of calibrated sensor feeds, capture methods, and baseline comparability.
          </p>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:block">
          Audit Integrity: High
        </span>
      </div>

      {/* Coverage Table */}
      {hasCoverage ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold rounded-l-xl">Category</th>
                <th scope="col" className="px-4 py-3 font-semibold">Calibration Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Last Recorded</th>
                <th scope="col" className="px-4 py-3 font-semibold">Data Source</th>
                <th scope="col" className="px-4 py-3 font-semibold">Baseline Comparison</th>
                <th scope="col" className="px-4 py-3 font-semibold rounded-r-xl text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coverage.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {row.category}
                  </td>

                  <td className="px-4 py-3.5">
                    {row.hasData ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-teal-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        {row.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-slate-400">
                        <XCircle className="w-3.5 h-3.5 text-slate-300" />
                        Uncalibrated
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {row.lastRecorded}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600">
                    <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {row.sourceType}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    {row.comparisonPossible ? (
                      <span className="text-teal-700 font-medium">Valid Comparison</span>
                    ) : (
                      <span className="text-slate-400">Needs Baseline</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right font-semibold text-slate-800">
                    {row.confidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No coverage data loaded</h4>
          <p className="text-xs text-slate-400 mt-1">
            Data coverage will populate once personal categories have been synced.
          </p>
        </div>
      )}

      {/* Medical Safety Notice */}
      <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Scientific Measurement Principle:</strong> NeuroSense deliberately avoids combining reaction time, sleep, activity, and vitals into a single arbitrary &ldquo;brain score&rdquo;. Each biomarker maintains its independent clinical and behavioral validity.
        </p>
      </div>
    </div>
  );
}

