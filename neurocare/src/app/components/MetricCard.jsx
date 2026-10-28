'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Moon,
  Brain,
  Footprints,
  TrendingDown,
  TrendingUp,
  Minus,
  ArrowUpRight,
  PlusCircle,
  Link2,
} from 'lucide-react';

const ICON_MAP = {
  heart: Heart,
  moon: Moon,
  brain: Brain,
  activity: Footprints,
};

export default function MetricCard({
  type = 'heart',
  label,
  value,
  unit,
  subtext,
  timestamp,
  source,
  trend,
  status,
  statusType = 'info', // 'success' | 'warning' | 'info'
  linkUrl,
  linkText,
  isDemoMode = true,
  emptyStateAction = 'Add measurement',
  emptyStateHref = '/devices',
}) {
  const IconComponent = ICON_MAP[type] || Heart;

  const hasData = Boolean(value);

  // Status badge styling
  const getStatusBadge = () => {
    if (!status) return null;
    if (statusType === 'success') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/80">
          {status}
        </span>
      );
    }
    if (statusType === 'warning') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
          {status}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200/80">
        {status}
      </span>
    );
  };

  // Trend indicator
  const renderTrend = () => {
    if (!trend) return null;

    const isPositive = trend.sentiment === 'positive';
    const isUp = trend.direction === 'up';
    const isDown = trend.direction === 'down';

    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 font-semibold ${
            isPositive ? 'text-teal-600' : 'text-slate-600'
          }`}
        >
          {isUp && <TrendingUp className="w-3.5 h-3.5" />}
          {isDown && <TrendingDown className="w-3.5 h-3.5" />}
          {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
          {trend.delta}
        </span>
        <span className="text-[11px] text-slate-500 truncate">
          {trend.comparisonText}
        </span>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Top row: Icon, Label, Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {label}
              </h3>
            </div>
          </div>
          {hasData && getStatusBadge()}
        </div>

        {/* Metric Value or Empty State */}
        {hasData ? (
          <div className="mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {value}
              </span>
              {unit && (
                <span className="text-sm font-semibold text-slate-500 uppercase">
                  {unit}
                </span>
              )}
            </div>
            {subtext && (
              <p className="text-xs text-slate-500 mt-0.5">{subtext}</p>
            )}

            {/* Historical trend (if sufficient data exists) */}
            <div className="mt-2.5 pt-2 border-t border-slate-100">
              {renderTrend()}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm font-medium text-slate-500">No data yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Sync a wearable device or start an assessment.
            </p>
            <Link
              href={emptyStateHref}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 transition-colors"
            >
              {emptyStateHref === '/devices' ? (
                <Link2 className="w-3.5 h-3.5" />
              ) : (
                <PlusCircle className="w-3.5 h-3.5" />
              )}
              {emptyStateAction}
            </Link>
          </div>
        )}
      </div>

      {/* Bottom metadata / Link */}
      {hasData && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="truncate max-w-[170px]" title={`${source} • ${timestamp}`}>
            <span className="font-medium text-slate-700">{source}</span>
            <span className="mx-1 text-slate-300">•</span>
            <span>{timestamp}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {isDemoMode && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
            {linkUrl && (
              <Link
                href={linkUrl}
                className="text-cyan-600 hover:text-cyan-700 font-semibold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                title="View details"
              >
                <span>{linkText || 'Details'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
