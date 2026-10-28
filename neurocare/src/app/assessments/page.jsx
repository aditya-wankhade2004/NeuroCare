'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft, Play, Clock, CheckCircle2, Award } from 'lucide-react';

export default function AssessmentsPage() {
  const tests = [
    {
      id: 'sym-1',
      title: 'Symbol-Digit Matching Latency',
      category: 'Processing Speed & Visual Scanning',
      duration: '3 minutes',
      lastTaken: 'Yesterday, 16:30',
      lastScore: '214 ms avg (96% accuracy)',
      status: 'Ready',
    },
    {
      id: 'stroop-1',
      title: 'Color-Word Stroop Test',
      category: 'Inhibitory Control & Executive Function',
      duration: '4 minutes',
      lastTaken: '3 days ago',
      lastScore: '92% attention retention',
      status: 'Ready',
    },
    {
      id: 'nback-1',
      title: 'Dual 2-Back Spatial Memory',
      category: 'Working Memory & Active Recall',
      duration: '5 minutes',
      lastTaken: '5 days ago',
      lastScore: '88% accuracy',
      status: 'Ready',
    },
  ];

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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cognitive Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Scientifically modeled neuro-cognitive self-assessment batteries.
          </p>
        </div>
      </div>

      {/* Test List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tests.map((test) => (
          <div
            key={test.id}
            className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Brain className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                {test.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{test.category}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Est. Time:
                  </span>
                  <span className="font-medium text-slate-700">{test.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Assessment:</span>
                  <span className="font-medium text-slate-700">{test.lastTaken}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Metric:</span>
                  <span className="font-semibold text-teal-700">{test.lastScore}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => alert(`Starting interactive self-assessment: ${test.title}`)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Start Assessment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
