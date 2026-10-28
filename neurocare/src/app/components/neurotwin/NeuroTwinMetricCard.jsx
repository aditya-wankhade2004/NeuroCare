'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  Zap,
  Layers,
  Activity,
  Moon,
  HeartPulse,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Link2,
} from 'lucide-react';

const ICON_MAP = {
  cognitive: Brain,
  reaction: Zap,
  memory: Layers,
  motor: Activity,
  sleep: Moon,
  physiology: HeartPulse,
};

export default function NeuroTwinMetricCard({
  type = 'cognitive',
  title,
  value,
  unit,
  date,
  source,
  diff,
  diffDirection,
  linkUrl,
  linkText = 'Details',
  hasData = true,
  isDemoMode = true,
}) {
  const IconComponent = ICON_MAP[type] || Brain;

  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div>
        {/* Top: Icon & Title */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <IconComponent className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {title}
            </h4>
          </div>

          {diff && hasData && (
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {diff}
            </span>
          )}
        </div>

        {/* Value */}
        {hasData && value ? (
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                {value}
              </span>
              {unit && (
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  {unit}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[180px]" title={date}>{date}</span>
            </div>
          </div>
        ) : (
          <div className="py-3">
            <p className="text-sm font-semibold text-slate-400 italic">No data yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Measurement uncalibrated.</p>
          </div>
        )}
      </div>

      {/* Footer: Source & Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="truncate max-w-[140px] text-slate-500" title={source}>
          {hasData && source ? source : 'Awaiting input'}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isDemoMode && (
            <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-700 px-1 py-0.2 rounded border border-amber-200">
              Demo
            </span>
          )}
          {linkUrl && (
            <Link
              href={linkUrl}
              className="text-cyan-600 hover:text-cyan-700 font-semibold inline-flex items-center gap-0.5 transition-colors"
            >
              <span>{linkText}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
