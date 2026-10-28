'use client';

import React from 'react';
import Link from 'next/link';
import {
  Brain,
  Activity,
  Watch,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react';

const ACTIVITY_ICONS = {
  assessment: Brain,
  baseline: Activity,
  device: Watch,
  report: FileText,
  measurement: Clock,
};

export default function RecentActivity({ activities, isDemoMode = true }) {
  const hasActivities = Boolean(activities && activities.length > 0);

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Activity
            </h3>
            {isDemoMode && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <Link
            href="/reports"
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* List of activity items */}
        {hasActivities ? (
          <div className="space-y-3.5">
            {activities.map((item) => {
              const Icon = ACTIVITY_ICONS[item.type] || Activity;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 flex-shrink-0">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-500">
            <ListOrdered className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-700">No activity recorded yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Actions will appear here as you log assessments or synchronize data.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400">
          Audit Log Protected • HIPAA & GDPR Architecture
        </span>
      </div>
    </div>
  );
}
