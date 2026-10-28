'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export default function BaselineComparison({
  baselineData,
  isDemoMode = true,
}) {
  const hasBaseline = Boolean(baselineData && baselineData.status);

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Your Baseline
            </h3>
            {hasBaseline && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                {baselineData.status}
              </span>
            )}
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Individualized reference standard established from your own physiological history.
          </p>
        </div>

        <div>
          <Link
            href="/baseline"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/60 transition-colors"
          >
            <span>{hasBaseline ? 'View Baseline Details' : 'Baseline Calibration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content: Populated or Empty State */}
      {hasBaseline ? (
        <div>
          {/* Metadata banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              <span>
                Baseline Established: <strong>{baselineData.establishedDate}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>
                Latest Assessment: <strong>{baselineData.latestAssessmentDate}</strong>
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Window: {baselineData.referenceWindow}
            </div>
          </div>

          {/* Metric comparison table / grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baselineData.metrics.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    {item.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.sentiment === 'positive'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {item.differenceText}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2 text-xs mb-2">
                  <div>
                    <span className="text-slate-400 text-[11px]">Current: </span>
                    <strong className="text-slate-900 font-semibold text-sm">
                      {item.currentValue}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Baseline: </span>
                    <span className="text-slate-600 font-medium">
                      {item.baselineValue}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Medical disclaimer strip */}
          <div className="mt-4 p-3 rounded-xl bg-cyan-50/40 border border-cyan-100 flex items-start gap-2.5 text-[11px] text-cyan-900">
            <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Personalized Baseline Protocol:</strong> NeuroSense compares you only to your own historical baseline, not arbitrary universal scores. Physiological variations reflect routine lifestyle factors such as rest and hydration.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Your personal baseline has not been established yet.
          </h4>
          <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
            A 7 to 14-day calibration period establishes your normal cognitive response time and physiological rest patterns without universal normative grading.
          </p>
          <Link
            href="/baseline"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create Baseline
          </Link>
        </div>
      )}
    </div>
  );
}
