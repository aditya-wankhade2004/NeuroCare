'use client';

import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  ArrowLeft,
  Save,
  Zap,
  Target,
  Layers,
  Activity,
  Info,
} from 'lucide-react';

export default function AssessmentResultsModal({
  isOpen,
  results,
  baselineOverview,
  onRetake,
  onSaveResult,
  onClose,
}) {
  if (!isOpen || !results) return null;

  const isReaction = results.typeKey === 'reaction';
  const isAttention = results.typeKey === 'attention';
  const isMemory = results.typeKey === 'memory';
  const isMotion = results.typeKey === 'motion';

  // Compare with baseline if baseline is available
  let baselineDiffText = null;
  if (isReaction && baselineOverview?.cards?.reaction?.baselineMedianMs) {
    const base = baselineOverview.cards.reaction.baselineMedianMs;
    const diff = results.median - base;
    baselineDiffText =
      diff < 0
        ? `${Math.abs(diff)} ms faster than your established baseline (${base} ms).`
        : diff > 0
        ? `${diff} ms slower than your established baseline (${base} ms).`
        : `Identical to your established baseline (${base} ms).`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Session Complete
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {results.type} Results
              </h3>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p className="flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5" />
              {results.duration}
            </p>
            <p className="text-[10px]">{results.completedDate}</p>
          </div>
        </div>

        {/* Primary Metric Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Primary Measured Result
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-extrabold text-cyan-400 font-sans tracking-tight">
              {isReaction && `${results.median} ms`}
              {isAttention && `${results.accuracy}%`}
              {isMemory && `${results.longestSequence} tiles`}
              {isMotion && `${results.tapsPerSec} taps/s`}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {isReaction && 'Median Latency'}
              {isAttention && 'Detection Accuracy'}
              {isMemory && 'Maximum Sequence Span'}
              {isMotion && 'Average Cadence'}
            </span>
          </div>

          {/* Baseline comparison statement */}
          {baselineDiffText && (
            <div className="mt-3 pt-3 border-t border-slate-700/80 text-xs text-cyan-200/90 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <p>{baselineDiffText}</p>
            </div>
          )}
        </div>

        {/* Secondary Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          {isReaction && (
            <>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mean Latency</span>
                <span className="text-sm font-bold text-slate-900">{results.mean} ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fastest Trial</span>
                <span className="text-sm font-bold text-teal-700">{results.fastest} ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Slowest Trial</span>
                <span className="text-sm font-bold text-slate-700">{results.slowest} ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Valid Trials</span>
                <span className="text-sm font-bold text-slate-900">{results.validTrialsCount} of 5</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Premature Clicks</span>
                <span className="text-sm font-bold text-slate-700">{results.prematureCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Data Quality</span>
                <span className="text-sm font-bold text-teal-700">High Precision</span>
              </div>
            </>
          )}

          {isAttention && (
            <>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Hits</span>
                <span className="text-sm font-bold text-teal-700">{results.hits} hits</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Missed Targets</span>
                <span className="text-sm font-bold text-rose-600">{results.misses} misses</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">False Alarms</span>
                <span className="text-sm font-bold text-amber-600">{results.falseAlarms}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Hit Speed</span>
                <span className="text-sm font-bold text-slate-900">{results.avgHitRt ? `${results.avgHitRt} ms` : 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Trials</span>
                <span className="text-sm font-bold text-slate-900">{results.totalTrials} stimuli scored</span>
              </div>
            </>
          )}

          {isMemory && (
            <>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Max Span</span>
                <span className="text-sm font-bold text-cyan-700">{results.longestSequence} items</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Accuracy</span>
                <span className="text-sm font-bold text-teal-700">{results.accuracy}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attempts</span>
                <span className="text-sm font-bold text-slate-900">{results.totalAttempts} total</span>
              </div>
            </>
          )}

          {isMotion && (
            <>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Taps</span>
                <span className="text-sm font-bold text-slate-900">{results.totalTaps} taps</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Average Interval</span>
                <span className="text-sm font-bold text-teal-700">{results.avgIntervalMs} ms</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                <span className="text-sm font-bold text-slate-900">{results.duration}</span>
              </div>
            </>
          )}
        </div>

        {/* Non-diagnostic Safety Policy */}
        <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-100 flex items-start gap-2.5 text-[11px] text-cyan-950">
          <Info className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Behavioral Standard:</strong> This task evaluates reaction speed and behavioral execution under controlled web browser conditions. It does not replace professional medical advice or provide a diagnosis of neurological conditions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onRetake}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Test
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
            >
              Back to Assessments
            </button>
            <button
              onClick={onSaveResult}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save to History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

