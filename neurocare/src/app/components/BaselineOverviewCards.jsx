'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Activity,
  Brain,
  Layers,
  ArrowUpRight,
  Info,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function BaselineOverviewCards({ overview, isDemoMode = true }) {
  if (!overview) return null;

  const isEstablished = overview.status === 'Established';
  const isInProgress = overview.status === 'In Progress';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Baseline Status */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Baseline Status
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isEstablished
                    ? 'bg-teal-50 text-teal-600'
                    : isInProgress
                    ? 'bg-cyan-50 text-cyan-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isEstablished
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : isInProgress
                    ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isEstablished
                      ? 'bg-teal-500'
                      : isInProgress
                      ? 'bg-cyan-500 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                {overview.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2.5">
              {isEstablished
                ? `14-day individualized reference standard established on ${overview.establishedDate}.`
                : isInProgress
                ? 'Collecting daily telemetry to finalize reference standard.'
                : 'No baseline established yet. Complete the setup form below.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {overview.lastUpdatedDate ? `Updated: ${overview.lastUpdatedDate}` : 'Not calibrated'}
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-200">
                Demo
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Recorded Measurements */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recorded Measurements
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {overview.recordedMeasurementsCount > 0 ? (
                <>
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                    {overview.recordedMeasurementsCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Saved Points
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-slate-400 italic">
                  No records yet
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-2">
              {overview.recordedMeasurementsCount > 0
                ? 'Telemetry entries aggregated across validated connected sensors.'
                : 'Missing values are tracked separately from zero readings.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Window: {overview.calibrationWindowDays > 0 ? `${overview.calibrationWindowDays} Days Rolling` : 'Uncalibrated'}
            </span>
            <span className="text-teal-600 font-medium">Valid Data</span>
          </div>
        </div>

        {/* Card 3: Cognitive Assessments */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cognitive Sessions
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {overview.cognitiveSessionsCount > 0 ? (
                <>
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                    {overview.cognitiveSessionsCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Completed
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-slate-400 italic">
                  0 sessions taken
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-2">
              Standardized reaction latency, visual attention, and spatial recall trials.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <Link
              href="/assessments"
              className="text-cyan-600 hover:text-cyan-700 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Take Assessment</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-400 font-mono text-[10px]">Active Tests</span>
          </div>
        </div>

        {/* Card 4: Data Completeness */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Data Completeness
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {overview.completenessPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-500">
                ({overview.completedFieldsCount} of {overview.totalOptionalFieldsCount} fields)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${overview.completenessPercentage}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Completeness measures reference metric coverage, not physical health.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate max-w-[200px]" title="Non-diagnostic completeness metric">
              Optional field depth
            </span>
            <span className="text-cyan-700 font-semibold">
              {overview.completedFieldsCount}/{overview.totalOptionalFieldsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Completeness Note Banner */}
      <div className="flex items-start gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
        <Info className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          {overview.completenessNote ||
            'Completeness indicates the breadth of configured reference metrics and does not represent a measure of physical health or medical diagnosis.'}
        </p>
      </div>
    </div>
  );
}
