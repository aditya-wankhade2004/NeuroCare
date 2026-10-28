'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowLeft, ShieldAlert, Sparkles, Activity, Layers, Info } from 'lucide-react';

export default function NeuroTwinPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              NeuroTwin Cognitive Model
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Preview Simulation
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mathematical approximation of cognitive and autonomic homeostasis based on your historical telemetry.
          </p>
        </div>
      </div>

      {/* Safety & Scope Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Computational Simulation Disclaimer:</strong>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            The NeuroTwin simulation is an exploratory digital computational twin designed for personal lifestyle insights. Ordinary consumer wearables and simulated digital twins cannot diagnose clinical neurological conditions, strokes, or degenerative diseases.
          </p>
        </div>
      </div>

      {/* Simulation Overview Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Twin Model State
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">Synchronized</p>
              <p className="text-xs text-slate-500 mt-1">
                Refreshed with 14-day rolling telemetry.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-teal-600 font-semibold">
              98.4% Baseline Convergence
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Circadian Rhythm Alignment
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">Phase Concordant</p>
              <p className="text-xs text-slate-500 mt-1">
                Optimal morning cognitive alert window: 09:30 – 12:45.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-cyan-600 font-semibold">
              Peak Focus Phase Active
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Autonomic Balance Index
              </span>
              <p className="text-xl font-bold text-slate-900 mt-1">Balanced (Parasympathetic)</p>
              <p className="text-xs text-slate-500 mt-1">
                Night-time HRV baseline indicates adequate recovery reserves.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-teal-600 font-semibold">
              Recovery Index: Optimal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
