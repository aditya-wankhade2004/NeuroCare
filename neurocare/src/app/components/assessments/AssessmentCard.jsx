'use client';

import React from 'react';
import {
  Brain,
  Zap,
  Target,
  Layers,
  Activity,
  Play,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const ICON_MAP = {
  'neuro-reaction': Zap,
  'neuro-attention': Target,
  'neuro-memory': Layers,
  'neuro-motion': Activity,
};

export default function AssessmentCard({
  card,
  onStartTest,
  isDemoMode = true,
}) {
  if (!card) return null;

  const IconComponent = ICON_MAP[card.id] || Brain;
  const hasAssessment = card.completedSessionsCount > 0;

  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div>
        {/* Top Tag & Icon */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-800 border border-cyan-200/70">
            {card.badge}
          </span>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
            <IconComponent className="w-5 h-5" />
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
          {card.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {card.description}
        </p>

        {/* Key Metrics Display */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          {hasAssessment ? (
            <div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Latest Metric
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                      {card.id === 'neuro-reaction'
                        ? card.latestMedianMs
                        : card.id === 'neuro-attention'
                        ? `${card.latestAccuracy}%`
                        : card.id === 'neuro-memory'
                        ? `${card.longestSequence} tiles`
                        : `${card.latestTapsPerSec}`}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {card.unit}
                    </span>
                  </div>
                </div>

                {card.differenceVsBaseline && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-teal-600" />
                    {card.differenceVsBaseline}
                  </span>
                )}
              </div>

              {/* Sub-metrics */}
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 truncate max-w-[160px]" title={card.lastCompletedDate}>
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {card.lastCompletedDate}
                </span>
                <span className="font-medium text-slate-700">
                  {card.completedSessionsCount} sessions
                </span>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-slate-400 italic">
              Not yet assessed. Complete your first session to establish a reference metric.
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={() => onStartTest(card.id)}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all transform active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          {hasAssessment ? 'Retake Test' : 'Start Test'}
        </button>
      </div>
    </div>
  );
}

