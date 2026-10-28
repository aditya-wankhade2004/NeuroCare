'use client';

import React from 'react';
import {
  Lightbulb,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export default function ChangeInsight({ insights, isDemoMode = true }) {
  const hasInsights = Boolean(insights && insights.length > 0);

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              &ldquo;What Changed?&rdquo; Insights
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Preview
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective variance detection between current observations and your personal reference baseline.
          </p>
        </div>
      </div>

      {/* Content */}
      {hasInsights ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {insights.map((item) => {
            const isFavorable = item.direction === 'favorable';
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/50 hover:border-cyan-300 transition-all group"
              >
                <div>
                  {/* Category and Direction */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isFavorable
                          ? 'bg-teal-50 text-teal-700 border border-teal-200/70'
                          : 'bg-slate-100 text-slate-700 border border-slate-200/70'
                      }`}
                    >
                      {isFavorable ? (
                        <TrendingUp className="w-3 h-3 text-teal-600" />
                      ) : (
                        <Info className="w-3 h-3 text-slate-500" />
                      )}
                      {item.difference}
                    </span>
                  </div>

                  {/* Title & Measurement */}
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-cyan-800 font-medium mt-0.5">
                    {item.measurement}
                  </p>

                  {/* Explanation (Neutral, compliant language) */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                    {item.explanation}
                  </p>
                </div>

                {/* Metadata: Dates, Source, Confidence */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Timeline:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[170px]">
                      {item.dates}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sensor Source:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[170px]">
                      {item.source}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Confidence Quality:</span>
                    <span className="font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded text-[10px]">
                      {item.confidence}
                    </span>
                  </div>

                  {/* Actionable Behavioral Guidance */}
                  {item.guidance && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 italic">
                      {item.guidance}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500">
          <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            No variance insights available yet
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Complete periodic cognitive tests and synchronize wearable telemetry to allow difference detection.
          </p>
        </div>
      )}
    </div>
  );
}
