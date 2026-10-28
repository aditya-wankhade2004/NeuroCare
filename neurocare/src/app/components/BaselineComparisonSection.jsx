'use client';

import React, { useSyncExternalStore } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Activity,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
} from 'lucide-react';

// Custom Mini Sparkline Tooltip
function MiniSparklineTooltip({ active, payload, unit }) {
  if (active && payload && payload.length) {
    return (
      <div className="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-mono shadow-md">
        <span>{payload[0].value} {unit}</span>
      </div>
    );
  }
  return null;
}

export default function BaselineComparisonSection({
  comparisons,
  isDemoMode = true,
}) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const hasComparisons = Boolean(comparisons && comparisons.length > 0);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Baseline vs Latest
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
              Variance Analysis
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective mathematical comparison of current observations against your personal rolling reference standard.
          </p>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Non-diagnostic variance tracking
        </div>
      </div>

      {/* Comparisons Grid or Empty State */}
      {hasComparisons ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {comparisons.map((item) => {
            const hasSparkline = Boolean(item.sparklineData && item.sparklineData.length > 1);

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50/80 transition-all group"
              >
                <div>
                  {/* Category and Metric Name */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/70">
                      {item.category}
                    </span>

                    {/* Variance Tag */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs">
                      {item.differenceDirection === 'faster' || item.differenceDirection === 'lower' ? (
                        <TrendingDown className="w-3.5 h-3.5 text-cyan-600" />
                      ) : item.differenceDirection === 'higher' ? (
                        <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <Minus className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{item.differenceFormatted}</span>
                      {item.percentageDiff && (
                        <span className="text-[10px] text-slate-500">
                          ({item.percentageDiff})
                        </span>
                      )}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {item.metricName}
                  </h3>

                  {/* Baseline vs Latest Split */}
                  <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-white rounded-xl border border-slate-200/70">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Baseline Reference
                      </span>
                      <p className="text-base font-extrabold text-slate-700">
                        {item.baselineFormatted}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5" title={`${item.baselineSource} • ${item.baselineDate}`}>
                        {item.baselineDate}
                      </p>
                    </div>

                    <div className="border-l border-slate-100 pl-3">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Latest Measured
                      </span>
                      <p className="text-base font-extrabold text-slate-900">
                        {item.latestFormatted}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5" title={`${item.latestSource} • ${item.latestDate}`}>
                        {item.latestDate}
                      </p>
                    </div>
                  </div>

                  {/* Explanation text */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-3">
                    {item.explanation}
                  </p>
                </div>

                {/* Mini Recharts Trend / Sparkline */}
                {hasSparkline && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Window Trend</span>
                      <span>{item.sparklineData.length} checkpoints</span>
                    </div>

                    <div className="h-14 w-full">
                      {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={item.sparklineData}
                            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
                          >
                            <Tooltip
                              content={<MiniSparklineTooltip unit={item.unit} />}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#0891b2" // cyan-600
                              strokeWidth={2}
                              dot={{ r: 2.5, fill: '#0891b2' }}
                              activeDot={{ r: 4, fill: '#06b6d4' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full bg-slate-100 rounded animate-pulse" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">
            No comparison data available yet
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Baseline comparisons require both an established historical reference period and subsequent live telemetry or assessment results.
          </p>
        </div>
      )}

      {/* Medical Safety Disclaimer Strip */}
      <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
        <span>Variance represents individual physiological fluctuation, not a clinical diagnosis.</span>
        <span className="font-mono text-slate-400">Scale: Personal Normalized</span>
      </div>
    </div>
  );
}

