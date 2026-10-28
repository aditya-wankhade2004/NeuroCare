'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  RefreshCw,
} from 'lucide-react';

const METRIC_CONFIG = {
  reactionTime: {
    label: 'Cognitive Reaction Speed',
    unit: 'ms',
    dataKey: 'value',
    description: 'Average latency measured during symbol-matching assessment trials.',
    baselineLabel: '14-Day Baseline (226 ms)',
    yDomain: [180, 260],
    color: '#06b6d4', // cyan-500
    gradientId: 'colorReaction',
    invertImprovement: true, // lower latency is faster
  },
  heartRate: {
    label: 'Resting Heart Rate',
    unit: 'BPM',
    dataKey: 'value',
    description: 'Overnight continuous resting pulse recorded by consumer wearable.',
    baselineLabel: '14-Day Baseline (65 BPM)',
    yDomain: [50, 80],
    color: '#0d9488', // teal-600
    gradientId: 'colorHeart',
    invertImprovement: false,
  },
  sleepHours: {
    label: 'Sleep Duration',
    unit: 'hours',
    dataKey: 'value',
    description: 'Total recorded night sleep duration from validated ring telemetry.',
    baselineLabel: 'Target Baseline (7.5h)',
    yDomain: [5, 10],
    color: '#3b82f6', // blue-500
    gradientId: 'colorSleep',
    invertImprovement: false,
  },
};

// Custom tooltip with medical SaaS aesthetics
function CustomChartTooltip({ active, payload, label, unit, baselineValue }) {
  if (active && payload && payload.length) {
    const currentValue = payload[0].value;
    const diff = baselineValue ? (currentValue - baselineValue).toFixed(1) : null;

    return (
      <div className="p-3 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700/80 text-xs backdrop-blur-md">
        <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          {label}
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
            <span>Observed Variance:</span>
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

export default function HealthTrendChart({
  trendData,
  isDemoMode = true,
  onResetDemo,
}) {
  const [selectedMetric, setSelectedMetric] = useState('reactionTime');
  const [selectedRange, setSelectedRange] = useState('7d'); // '7d' | '30d' | '90d'

  // Hydration-safe client detection without triggering cascading effect renders
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const config = METRIC_CONFIG[selectedMetric] || METRIC_CONFIG.reactionTime;
  const currentMetricData = trendData ? trendData[selectedMetric] : null;

  let chartPoints = [];
  let baselineRef = null;

  if (currentMetricData) {
    baselineRef = currentMetricData.baselineValue;
    if (selectedRange === '7d') chartPoints = currentMetricData.data7d || [];
    else if (selectedRange === '30d') chartPoints = currentMetricData.data30d || [];
    else if (selectedRange === '90d') chartPoints = currentMetricData.data90d || [];
  }

  const hasData = chartPoints && chartPoints.length > 0;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
      {/* Header with Title and Range Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Personal Health Trends
            </h3>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo Series
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {config.description}
          </p>
        </div>

        {/* Metric Tabs & Time Range Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Buttons */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setSelectedMetric('reactionTime')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'reactionTime'
                  ? 'bg-white text-cyan-700 shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Reaction Speed (ms)
            </button>
            <button
              onClick={() => setSelectedMetric('heartRate')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'heartRate'
                  ? 'bg-white text-teal-700 shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Heart Rate (BPM)
            </button>
            <button
              onClick={() => setSelectedMetric('sleepHours')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'sleepHours'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              Sleep (Hours)
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-2.5 py-1.5 rounded-lg uppercase transition-all ${
                  selectedRange === range
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric details strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-3 py-2 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">
            {config.label} ({config.unit})
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">
            Reference Line: <strong className="text-slate-700">{baselineRef} {config.unit}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            Observed Value
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 border-b-2 border-dashed border-slate-400" />
            Personal Baseline
          </span>
        </div>
      </div>

      {/* Chart Canvas or Empty State */}
      <div className="w-full h-72 sm:h-80">
        {!isMounted ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
            <span className="text-xs text-slate-400 font-medium">Loading visualization...</span>
          </div>
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartPoints}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={config.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                dy={6}
              />

              <YAxis
                domain={config.yDomain}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                dx={-4}
              />

              <Tooltip
                content={
                  <CustomChartTooltip
                    unit={config.unit}
                    baselineValue={baselineRef}
                  />
                }
              />

              {/* Baseline Reference Line */}
              {baselineRef && (
                <ReferenceLine
                  y={baselineRef}
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
              )}

              {/* Primary Trend Area */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${config.gradientId})`}
                activeDot={{
                  r: 6,
                  fill: config.color,
                  stroke: '#FFFFFF',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700">
              No trend measurements recorded yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Historical trend graphs populate automatically once at least 3 daily measurements or cognitive assessments have been logged.
            </p>
            {onResetDemo && (
              <button
                onClick={onResetDemo}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Enable Demo Data to Preview Chart
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 text-right">
        <span className="text-[11px] text-slate-400">
          Scale normalized for {config.label} • Personal Reference Standard
        </span>
      </div>
    </div>
  );
}
