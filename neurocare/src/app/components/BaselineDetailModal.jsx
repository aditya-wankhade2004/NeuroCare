'use client';

import React, { useEffect } from 'react';
import {
  X,
  Calendar,
  ShieldCheck,
  Activity,
  Layers,
  Clock,
  Cpu,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function BaselineDetailModal({
  isOpen,
  onClose,
  record,
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-headline" className="text-base font-bold text-slate-900">
                {record.label}
              </h3>
              <p className="text-xs text-slate-500">{record.dateRange}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-0.5">Status</span>
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                record.status === 'Active' ? 'text-teal-700' : 'text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {record.status} Baseline
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-0.5">Measurements</span>
            <span className="font-bold text-slate-900">
              {record.measurementsCount} Recorded Points
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-0.5">Cognitive Sessions</span>
            <span className="font-bold text-slate-900">
              {record.cognitiveSessionsCount} Completed
            </span>
          </div>
        </div>

        {/* Calibrated Metric Reference Values */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Reference Values Established
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {record.metricsSummary?.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                <span className="text-[10px] text-slate-400 block">{m.label}</span>
                <span className="text-sm font-bold text-slate-800">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources Involved */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Telemetry Sources
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {record.sources?.map((s, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Recording Conditions & Audit Notes */}
        <div className="space-y-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
              Protocol Conditions:
            </span>
            <p className="text-slate-600 leading-relaxed">{record.conditions}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
              Audit Notes:
            </span>
            <p className="text-slate-600 leading-relaxed">{record.notes}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Historical Snapshot ID: {record.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
