'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
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
  Brain,
  Zap,
  Target,
  Layers,
  Activity,
  Moon,
  Footprints,
  HeartPulse,
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  Clock,
  ArrowRight,
  Info,
  ShieldCheck,
} from 'lucide-react';

const CATEGORY_ICONS = {
  cognitive: Brain,
  reaction: Zap,
  attention: Target,
  memory: Layers,
  motor: Activity,
  sleep: Moon,
  activity: Footprints,
  physiology: HeartPulse,
};

function CustomDetailsTooltip({ active, payload, label, unit, baselineValue }) {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const diff = baselineValue ? (val - baselineValue).toFixed(1) : null;

    return (
      <div className="p-3 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
        <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-cyan-300">{val}</span>
          <span className="text-slate-400 font-medium">{unit}</span>
        </div>
        {baselineValue && (
          <div className="mt-1 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-4">
            <span>Reference Baseline:</span>
            <span className="font-medium text-slate-200">{baselineValue} {unit}</span>
          </div>
        )}
        {diff !== null && (
          <div className="text-[11px] text-slate-400 flex items-center justify-between gap-4 mt-0.5">
            <span>Variance:</span>
            <span className={`font-semibold ${Number(diff) === 0 ? 'text-slate-300' : Number(diff) < 0 ? 'text-teal-400' : 'text-amber-400'}`}>
              {Number(diff) > 0 ? `+${diff}` : diff} {unit}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function CategoryDetailsPanel({
  categoryData,
  isDemoMode = true,
}) {
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d' | '90d'

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!categoryData) return null;

  const IconComponent = CATEGORY_ICONS[categoryData.id] || Brain;
  const hasData = categoryData.hasData;

  // Selected time range dataset
  let chartPoints = [];
  if (timeRange === '7d') chartPoints = categoryData.trend7d || [];
  else if (timeRange === '30d') chartPoints = categoryData.trend30d || [];
  else if (timeRange === '90d') chartPoints = categoryData.trend90d || [];

  const baselineRef = categoryData.baselineValue ? parseFloat(String(categoryData.baselineValue).replace(/[^0-9.]/g, '')) : null;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {categoryData.categoryGroup}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {categoryData.name}
              </h3>
            </div>
          </div>

          <Link
            href={categoryData.actionLink || '/assessments'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors"
          >
            <span>{categoryData.actionText || 'Explore'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {categoryData.description}
        </p>

        {/* Current Value & Baseline Comparison */}
        {hasData ? (
          <div className="grid grid-cols-2 gap-3 mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                Latest Observation
              </span>
              <p className="text-xl font-extrabold text-slate-900">
                {categoryData.latestValue}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[140px]" title={categoryData.date}>
                  {categoryData.date}
                </span>
              </div>
            </div>

            <div className="border-l border-slate-200 pl-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                Baseline Reference
              </span>
              <p className="text-xl font-extrabold text-slate-700">
                {categoryData.baselineValue || 'None'}
              </p>
              {categoryData.differenceFormatted && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 mt-1">
                  {categoryData.differenceDirection === 'faster' || categoryData.differenceDirection === 'lower' ? (
                    <TrendingDown className="w-3.5 h-3.5 text-cyan-600" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  )}
                  <span>{categoryData.differenceFormatted}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
            <p className="text-sm font-semibold text-slate-700">No data recorded yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Sync a wearable device or complete a self-assessment to populate this category.
            </p>
            <Link
              href={categoryData.actionLink || '/assessments'}
              className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              {categoryData.actionText}
            </Link>
          </div>
        )}
      </div>

      {/* Historical Trend Graph for Selected Category */}
      {hasData && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Historical Progression ({categoryData.unit})
            </span>

            {/* Time range switcher */}
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-600">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-0.5 rounded uppercase transition-all ${
                    timeRange === range
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {range === '7d' ? '7D' : range === '30d' ? '30D' : '90D'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-44 w-full">
            {!isMounted ? (
              <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse" />
            ) : chartPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartPoints}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#CBD5E1' }} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#CBD5E1' }} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip content={<CustomDetailsTooltip unit={categoryData.unit} baselineValue={baselineRef} />} />
                  {baselineRef && (
                    <ReferenceLine y={baselineRef} stroke="#94A3B8" strokeDasharray="3 3" strokeWidth={1.5} />
                  )}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0891b2"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#detailGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl text-xs text-slate-400">
                Insufficient datapoints for this time range.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata & Source Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate max-w-[220px]" title={categoryData.source}>
          Source: <strong className="text-slate-600 font-medium">{categoryData.source}</strong>
        </span>
        <span className="font-mono text-[10px]">Normalized Standard</span>
      </div>
    </div>
  );
}

