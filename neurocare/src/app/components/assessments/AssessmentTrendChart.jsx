'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Clock,
  Zap,
  Target,
  Activity,
} from 'lucide-react';

function CustomAssessmentTooltip({ active, payload, label, unit, baselineValue }) {
  if (active && payload && payload.length) {
    const currentValue = payload[0].value;
    const diff = baselineValue ? (currentValue - baselineValue).toFixed(1) : null;

    return (
      <div className="p-3 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-md">
        <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          {payload[0].payload.session} ({payload[0].payload.date})
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-cyan-300">
            {currentValue}
          </span>
          <span className="text-slate-400 font-medium">{unit}</span>
        </div>

        {baselineValue && (
          <div className="mt-1 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-4">
            <span>Reference Baseline:</span>
            <span className="font-medium text-slate-300">
              {baselineValue} {unit}
            </span>
          </div>
        )}

        {diff !== null && (
          <div className="text-[11px] text-slate-400 flex items-center justify-between gap-4 mt-0.5">
            <span>Baseline Variance:</span>
            <span
              className={`font-semibold ${
                Number(diff) === 0
                  ? 'text-slate-300'
                  : Number(diff) < 0
                  ? 'text-teal-400'
                  : 'text-amber-400'
              }`}
            >
              {Number(diff) > 0 ? `+${diff}` : diff} {unit}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function AssessmentTrendChart({
  trends,
  isDemoMode = true,
}) {
  const [selectedMetric, setSelectedMetric] = useState('reaction'); // 'reaction' | 'attention' | 'memory' | 'motion'

  // Hydration-safe detection
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentTrendConfig = trends ? trends[selectedMetric] : null;
  const chartPoints = currentTrendConfig?.data || [];
  const baselineValue = currentTrendConfig?.baselineValue || null;
  const hasData = chartPoints.length > 1;

  const metricColor =
    selectedMetric === 'reaction'
      ? '#06b6d4' // cyan-500
      : selectedMetric === 'attention'
      ? '#0d9488' // teal-600
      : selectedMetric === 'memory'
      ? '#3b82f6' // blue-500
      : '#8b5cf6'; // purple-500

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Assessment Performance Trends
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Longitudinal
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentTrendConfig?.description || 'Track your behavioral metrics across consecutive test sessions.'}
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600 flex-wrap">
          <button
            onClick={() => setSelectedMetric('reaction')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedMetric === 'reaction'
                ? 'bg-white text-cyan-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Reaction Speed (ms)
          </button>
          <button
            onClick={() => setSelectedMetric('attention')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedMetric === 'attention'
                ? 'bg-white text-teal-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Attention Accuracy (%)
          </button>
          <button
            onClick={() => setSelectedMetric('memory')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedMetric === 'memory'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Memory Span (Items)
          </button>
          <button
            onClick={() => setSelectedMetric('motion')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedMetric === 'motion'
                ? 'bg-white text-purple-700 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Motor Cadence (taps/s)
          </button>
        </div>
      </div>

      {/* Metric Detail Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">
            {currentTrendConfig?.metricName}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">
            Reference Standard: <strong>{baselineValue} {currentTrendConfig?.unit}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metricColor }} />
            Session Measurement
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 border-b-2 border-dashed border-slate-400" />
            Baseline Line
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        {!isMounted ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
            <span className="text-xs text-slate-400 font-medium">Loading trend visualization...</span>
          </div>
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartPoints}
              margin={{ top: 15, right: 15, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                dy={6}
              />
              <YAxis
                domain={currentTrendConfig?.yDomain || ['auto', 'auto']}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                dx={-4}
              />
              <Tooltip
                content={
                  <CustomAssessmentTooltip
                    unit={currentTrendConfig?.unit}
                    baselineValue={baselineValue}
                  />
                }
              />

              {baselineValue && (
                <ReferenceLine
                  y={baselineValue}
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke={metricColor}
                strokeWidth={2.5}
                dot={{ r: 4.5, fill: metricColor, stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 6.5, fill: metricColor, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700">
              Insufficient sessions for longitudinal trend
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              At least two completed sessions of this assessment type are required to display a progress curve.
            </p>
          </div>
        )}
      </div>

      {/* Safety Policy Note */}
      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Variations reflect routine lifestyle influences such as time of day, sleep, and physical rest.</span>
        <span className="font-mono">Axis: Dedicated Normalized</span>
      </div>
    </div>
  );
}
