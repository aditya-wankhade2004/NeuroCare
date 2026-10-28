'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Info,
  Hand,
  Footprints,
} from 'lucide-react';

const TEST_DURATION_SECONDS = 10;

export default function MotionTest({ onComplete, onCancel }) {
  const [testState, setTestState] = useState('IDLE'); // 'IDLE' | 'RUNNING' | 'FINISHED'
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [tapCount, setTapCount] = useState(0);

  const sessionStartTimeRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const tapTimestampsRef = useRef([]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const handleStartSession = () => {
    setTapCount(0);
    setTimeLeft(TEST_DURATION_SECONDS);
    tapTimestampsRef.current = [];
    sessionStartTimeRef.current = performance.now();
    setTestState('RUNNING');

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          concludeSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTap = () => {
    if (testState !== 'RUNNING') return;
    const now = performance.now();
    tapTimestampsRef.current.push(now);
    setTapCount((prev) => prev + 1);
  };

  const concludeSession = () => {
    setTestState('FINISHED');
    const totalTaps = tapTimestampsRef.current.length;
    const tapsPerSec = Number((totalTaps / TEST_DURATION_SECONDS).toFixed(1));

    // Calculate cadence variance (intervals between consecutive taps)
    const intervals = [];
    for (let i = 1; i < tapTimestampsRef.current.length; i++) {
      intervals.push(tapTimestampsRef.current[i] - tapTimestampsRef.current[i - 1]);
    }
    const avgIntervalMs = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;

    onComplete({
      type: 'NeuroMotion',
      typeKey: 'motion',
      tapsPerSec,
      totalTaps,
      avgIntervalMs,
      duration: `${TEST_DURATION_SECONDS} seconds`,
      completedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  const handleRestart = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setTestState('IDLE');
    setTapCount(0);
    setTimeLeft(TEST_DURATION_SECONDS);
    tapTimestampsRef.current = [];
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              NeuroMotion Test
            </h2>
            <p className="text-xs text-slate-500">
              Finger-Tapping Motor Cadence & Rhythm Consistency Standard
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Exit Test
        </button>
      </div>

      {testState === 'IDLE' && (
        <div className="text-center space-y-6 py-6">
          <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 text-xs text-slate-600 max-w-md mx-auto text-left space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-600" />
              Task Instructions:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>Use your dominant index finger (or mouse click).</li>
              <li>Tap the target circle repeatedly as fast and consistently as possible for 10 seconds.</li>
              <li>Maintain your natural rhythm without straining.</li>
              <li>Hardware, mouse switch latency, and touchscreen differences may influence taps per second.</li>
            </ol>
          </div>

          <button
            onClick={handleStartSession}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            Begin 10-Second Test
          </button>
        </div>
      )}

      {testState === 'RUNNING' && (
        <div className="space-y-6 text-center">
          {/* Timer and Count Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Time Remaining</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{timeLeft}s</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total Taps</span>
              <span className="text-2xl font-black text-cyan-700 font-mono">{tapCount}</span>
            </div>
          </div>

          {/* Large Tap Button */}
          <div className="py-4">
            <button
              onClick={handleTap}
              className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-500 to-cyan-400 text-white font-extrabold text-xl shadow-2xl flex flex-col items-center justify-center gap-2 mx-auto transform active:scale-90 transition-transform select-none ring-8 ring-cyan-100"
            >
              <Hand className="w-10 h-10 animate-bounce" />
              <span>TAP HERE!</span>
              <span className="text-xs font-normal text-cyan-100 font-mono">
                {(tapCount / (TEST_DURATION_SECONDS - timeLeft || 1)).toFixed(1)} taps/sec
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Keep tapping continuously until the countdown ends!
          </p>
        </div>
      )}

      {testState === 'FINISHED' && (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Task Completed!</h3>
          <p className="text-xs text-slate-500">Calculating motor cadence and tapping rhythm consistency...</p>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] text-slate-400">
          Non-diagnostic motor rhythm task
        </span>
        {testState === 'RUNNING' && (
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
