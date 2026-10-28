'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Info,
  ShieldCheck,
} from 'lucide-react';

const TOTAL_TRIALS = 5;

// States: 'IDLE' | 'WAITING' | 'PREMATURE' | 'STIMULUS' | 'TRIAL_FEEDBACK' | 'FINISHED'

export default function ReactionTest({ onComplete, onCancel }) {
  const [testState, setTestState] = useState('IDLE');
  const [currentTrial, setCurrentTrial] = useState(1);
  const [validTrials, setValidTrials] = useState([]);
  const [prematureCount, setPrematureCount] = useState(0);
  const [lastTrialLatency, setLastTrialLatency] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // References to preserve precise high-resolution timing without React re-render lag
  const stimulusTimestampRef = useRef(null);
  const delayTimerRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  // Clean up timers on unmount to prevent memory leaks or state updates after unmount
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // Start the entire test session
  const handleStartSession = () => {
    setValidTrials([]);
    setPrematureCount(0);
    setCurrentTrial(1);
    setSessionStartTime(performance.now());
    startTrialDelay(1);
  };

  // Begin a single trial's randomized waiting period
  const startTrialDelay = (trialNum) => {
    setTestState('WAITING');
    stimulusTimestampRef.current = null;

    // Randomized delay between 1.5s and 3.8s
    const randomDelay = Math.floor(Math.random() * 2300) + 1500;

    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);

    delayTimerRef.current = setTimeout(() => {
      // Trigger Stimulus
      stimulusTimestampRef.current = performance.now();
      setTestState('STIMULUS');
    }, randomDelay);
  };

  // User click / tap handler
  const handleStimulusInteraction = () => {
    if (testState === 'WAITING') {
      // Premature click before stimulus appeared!
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      setPrematureCount((prev) => prev + 1);
      setTestState('PREMATURE');

      // Reset trial delay after brief warning pause
      feedbackTimerRef.current = setTimeout(() => {
        startTrialDelay(currentTrial);
      }, 1600);
      return;
    }

    if (testState === 'STIMULUS') {
      // High-precision timing calculation
      const responseTime = performance.now();
      const latency = Math.round(responseTime - (stimulusTimestampRef.current || responseTime));

      setLastTrialLatency(latency);
      const updatedTrials = [...validTrials, latency];
      setValidTrials(updatedTrials);

      setTestState('TRIAL_FEEDBACK');

      if (updatedTrials.length >= TOTAL_TRIALS) {
        // All trials completed!
        const totalDurationSec = Math.round((performance.now() - sessionStartTime) / 1000);

        feedbackTimerRef.current = setTimeout(() => {
          setTestState('FINISHED');
          calculateAndDeliverResults(updatedTrials, prematureCount, totalDurationSec);
        }, 1200);
      } else {
        // Proceed to next trial after 1.2s feedback
        feedbackTimerRef.current = setTimeout(() => {
          setCurrentTrial((prev) => prev + 1);
          startTrialDelay(currentTrial + 1);
        }, 1200);
      }
    }
  };

  const calculateAndDeliverResults = (trials, premature, durationSec) => {
    if (trials.length === 0) return;

    // Calculate median
    const sorted = [...trials].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

    // Calculate mean
    const mean = Math.round(trials.reduce((sum, val) => sum + val, 0) / trials.length);
    const fastest = sorted[0];
    const slowest = sorted[sorted.length - 1];

    const resultPayload = {
      type: 'NeuroReaction',
      typeKey: 'reaction',
      median,
      mean,
      fastest,
      slowest,
      validTrialsCount: trials.length,
      prematureCount: premature,
      duration: `${durationSec} seconds`,
      trials,
      completedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onComplete(resultPayload);
  };

  const handleRestart = () => {
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setTestState('IDLE');
    setValidTrials([]);
    setPrematureCount(0);
    setCurrentTrial(1);
    setLastTrialLatency(null);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
      {/* Test Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              NeuroReaction Test
            </h2>
            <p className="text-xs text-slate-500">
              Visual Stimulus Latency & Motor Response Standard
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

      {/* Trial Counter & Progress */}
      {testState !== 'IDLE' && testState !== 'FINISHED' && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <span className="font-semibold text-slate-700">
            Trial {Math.min(currentTrial, TOTAL_TRIALS)} of {TOTAL_TRIALS}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Premature Clicks:</span>
            <span className={`font-bold ${prematureCount > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
              {prematureCount}
            </span>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="flex flex-col items-center justify-center">
        {testState === 'IDLE' && (
          <div className="w-full text-center space-y-6 py-6">
            <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 text-xs text-slate-600 max-w-lg mx-auto text-left space-y-2">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-600" />
                How the test works:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600 leading-relaxed text-[11px]">
                <li>Press <strong>Begin Test</strong> to initialize the first trial.</li>
                <li>Wait patiently while the stimulus box displays a waiting prompt.</li>
                <li>When the stimulus turns <strong>bright cyan and signals &ldquo;CLICK NOW!&rdquo;</strong>, click or tap anywhere inside the target box as quickly as possible.</li>
                <li>Clicking before the stimulus appears counts as a premature trial and will not be recorded as a valid response time.</li>
                <li>The test consists of 5 consecutive trials.</li>
              </ol>
            </div>

            <button
              onClick={handleStartSession}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Begin Test
            </button>
          </div>
        )}

        {(testState === 'WAITING' || testState === 'PREMATURE' || testState === 'STIMULUS' || testState === 'TRIAL_FEEDBACK') && (
          <div
            onClick={handleStimulusInteraction}
            className={`w-full h-72 sm:h-80 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-150 p-6 text-center border-2 ${
              testState === 'WAITING'
                ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                : testState === 'PREMATURE'
                ? 'bg-amber-900/90 border-amber-600 text-amber-100 animate-shake'
                : testState === 'STIMULUS'
                ? 'bg-gradient-to-br from-cyan-500 to-teal-400 border-white text-slate-950 shadow-2xl scale-[1.02]'
                : 'bg-teal-900/90 border-teal-500 text-white'
            }`}
          >
            {testState === 'WAITING' && (
              <div className="space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-full border-4 border-slate-600 border-t-cyan-400 animate-spin mx-auto" />
                <p className="text-lg font-bold tracking-tight">Wait for the stimulus...</p>
                <p className="text-xs text-slate-400">Do not click until the stimulus turns bright cyan.</p>
              </div>
            )}

            {testState === 'PREMATURE' && (
              <div className="space-y-2 pointer-events-none">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                <p className="text-xl font-bold">Too Early!</p>
                <p className="text-xs text-amber-200">
                  Clicked before stimulus appeared. This trial does not count. Resetting trial...
                </p>
              </div>
            )}

            {testState === 'STIMULUS' && (
              <div className="space-y-2 pointer-events-none">
                <Zap className="w-16 h-16 text-slate-950 mx-auto fill-slate-950 animate-pulse" />
                <p className="text-3xl font-extrabold tracking-tight">CLICK NOW!</p>
                <p className="text-xs font-semibold text-slate-900 uppercase">Tap or click immediately!</p>
              </div>
            )}

            {testState === 'TRIAL_FEEDBACK' && (
              <div className="space-y-2 pointer-events-none">
                <CheckCircle2 className="w-12 h-12 text-teal-300 mx-auto" />
                <p className="text-2xl font-black">{lastTrialLatency} ms</p>
                <p className="text-xs text-teal-200">
                  Trial {validTrials.length} recorded. Preparing next trial...
                </p>
              </div>
            )}
          </div>
        )}

        {testState === 'FINISHED' && (
          <div className="w-full text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Session Complete!</h3>
            <p className="text-xs text-slate-500">Compiling your median latency and trial variance...</p>
          </div>
        )}
      </div>

      {/* Footer controls & info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          Hardware precision: performance.now()
        </span>

        {testState !== 'IDLE' && (
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Session
          </button>
        )}
      </div>
    </div>
  );
}
