'use client';

import React, { useState } from 'react';
import {
  History,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Archive,
  Clock,
  Sparkles,
} from 'lucide-react';
import BaselineDetailModal from './BaselineDetailModal';

export default function BaselineHistorySection({
  history,
  isDemoMode = true,
}) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const hasHistory = Boolean(history && history.length > 0);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Baseline History & Calibration Archive
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Audit Trail
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserved historical reference standards. Establishing a new baseline never overwrites or destroys previous reference periods.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {history?.length || 0} Archived Epochs
        </div>
      </div>

      {/* History List or Empty State */}
      {hasHistory ? (
        <div className="space-y-4">
          {history.map((record) => {
            const isActive = record.status === 'Active';

            return (
              <div
                key={record.id}
                className={`p-5 rounded-xl border transition-all ${
                  isActive
                    ? 'border-cyan-200/90 bg-cyan-50/20 hover:bg-cyan-50/40 shadow-xs'
                    : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isActive
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isActive ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Archive className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        {record.status} Baseline
                      </span>

                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {record.label}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {record.dateRange}
                      </span>
                      <span>•</span>
                      <span>{record.measurementsCount} telemetry measurements</span>
                      <span>•</span>
                      <span>{record.cognitiveSessionsCount} cognitive batteries</span>
                    </div>

                    {/* Sources snippet */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 mr-1">Sources:</span>
                      {record.sources.map((src, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleOpenDetails(record)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-cyan-300 hover:text-cyan-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      View Full Snapshot
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">
            No baseline history archived
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            As you establish subsequent reference periods, previous baselines are automatically archived here.
          </p>
        </div>
      )}

      {/* Modal */}
      <BaselineDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}

