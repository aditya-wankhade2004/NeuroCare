'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Diamond,
  Circle,
  Square,
  Triangle,
} from 'lucide-react';

const SHAPES = [
  { id: 'diamond', name: 'Diamond', icon: Diamond, isTarget: true, color: 'text-cyan-500' },
  { id: 'circle', name: 'Circle', icon: Circle, isTarget: false, color: 'text-slate-400' },
  { id: 'square', name: 'Square', icon: Square, isTarget: false, color: 'text-slate-400' },
  { id: 'triangle', name: 'Triangle', icon: Triangle, isTarget: false, color: 'text-slate-400' },
];

const TOTAL_STIMULI = 15; // 15 rapid presentations
const DISPLAY_DURATION_MS = 1000;
const ISI_MS = 400; // Inter-stimulus interval

export default function AttentionTest({ onComplete, onCancel }) {
  const [testState, setTestState] = useState('IDLE'); // 'IDLE' | 'RUNNING' | 'FINISHED'
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0);
  const [currentShape, setCurrentShape] = useState(null);
  const [userClickedCurrent, setUserClickedCurrent] = useState(false);
  const [scoreHits, setScoreHits] = useState(0);
  const [scoreMisses, setScoreMisses] = useState(0);
  const [scoreFalseAlarms, setScoreFalseAlarms] = useState(0);
  const [scoreCorrectRejections, setScoreCorrectRejections] = useState(0);
  const [hitReactionTimes, setHitReactionTimes] = useState([]);

  const sessionStartTimeRef = useRef(null);
  const stimulusOnsetRef = useRef(null);
  const sequenceTimerRef = useRef(null);
  const isiTimerRef = useRef(null);
  const currentShapeRef = useRef(null);
  const userClickedRef = useRef(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
      if (isiTimerRef.current) clearTimeout(isiTimerRef.current);
    };
  }, []);

  const handleStartSession = () => {
    setScoreHits(0);
    setScoreMisses(0);
    setScoreFalseAlarms(0);
    setScoreCorrectRejections(0);
    setHitReactionTimes([]);
    setCurrentStimulusIndex(0);
    sessionStartTimeRef.current = performance.now();
    setTestState('RUNNING');

    runTrial(0, 0, 0, 0, 0, []);
  };

  const runTrial = (index, hits, misses, falseAlarms, correctRejections, rts) => {
    if (index >= TOTAL_STIMULI) {
      // Completed!
      const totalDurationSec = Math.round((performance.now() - sessionStartTimeRef.current) / 1000);
      const totalTrials = TOTAL_STIMULI;
      const correctDecisions = hits + correctRejections;
      const accuracy = Math.round((correctDecisions / totalTrials) * 100);
      const avgHitRt = rts.length > 0 ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : null;

      setTestState('FINISHED');

      onComplete({
        type: 'NeuroAttention',
        typeKey: 'attention',
        accuracy,
        hits,
        misses,
        falseAlarms,
        correctRejections,
        avgHitRt,
        totalTrials,
        duration: `${totalDurationSec} seconds`,
        completedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      return;
    }

    setCurrentStimulusIndex(index + 1);

    // 40% probability of Target (Diamond), 60% probability of Distractor
    const isTarget = Math.random() < 0.4;
    const selectedShape = isTarget
      ? SHAPES[0] // Diamond
      : SHAPES[Math.floor(Math.random() * (SHAPES.length - 1)) + 1];

    currentShapeRef.current = selectedShape;
    userClickedRef.current = false;
    setCurrentShape(selectedShape);
    setUserClickedCurrent(false);
    stimulusOnsetRef.current = performance.now();

    // Stimulus display timer (1000ms)
    sequenceTimerRef.current = setTimeout(() => {
      // Evaluate trial outcome if user didn't click
      let updatedHits = hits;
      let updatedMisses = misses;
      let updatedFalseAlarms = falseAlarms;
      let updatedCorrectRejections = correctRejections;

      if (!userClickedRef.current) {
        if (selectedShape.isTarget) {
          updatedMisses += 1;
          setScoreMisses(updatedMisses);
        } else {
          updatedCorrectRejections += 1;
          setScoreCorrectRejections(updatedCorrectRejections);
        }
      }

      // Hide stimulus for ISI interval
      setCurrentShape(null);

      isiTimerRef.current = setTimeout(() => {
        runTrial(index + 1, updatedHits, updatedMisses, updatedFalseAlarms, updatedCorrectRejections, rts);
      }, ISI_MS);
    }, DISPLAY_DURATION_MS);
  };

  const handleTargetClick = () => {
    if (userClickedRef.current || !currentShapeRef.current) return;
    userClickedRef.current = true;
    setUserClickedCurrent(true);

    const clickLatency = Math.round(performance.now() - stimulusOnsetRef.current);

    if (currentShapeRef.current.isTarget) {
      // Valid Hit!
      setScoreHits((prev) => prev + 1);
      setHitReactionTimes((prev) => [...prev, clickLatency]);
    } else {
      // False Alarm!
      setScoreFalseAlarms((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              NeuroAttention Test
            </h2>
            <p className="text-xs text-slate-500">
              Rapid Target Detection & Continuous Performance Standard
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
          <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 text-xs text-slate-600 max-w-lg mx-auto text-left space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-600" />
              Target Instructions:
            </p>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-cyan-200">
              <Diamond className="w-8 h-8 text-cyan-600 fill-cyan-100 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">Your Target is the CYAN DIAMOND</p>
                <p className="text-[11px] text-slate-500">
                  Tap <strong>Target Detected</strong> only when the Cyan Diamond appears. Ignore all circles, squares, and triangles.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Shapes will appear rapidly for 1 second each. 15 trials total.
            </p>
          </div>

          <button
            onClick={handleStartSession}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            Begin Assessment
          </button>
        </div>
      )}

      {testState === 'RUNNING' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
            <span>Item {currentStimulusIndex} of {TOTAL_STIMULI}</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-teal-700">Hits: {scoreHits}</span>
              <span className="text-rose-600">Misses: {scoreMisses}</span>
              <span className="text-amber-600">False Alarms: {scoreFalseAlarms}</span>
            </div>
          </div>

          {/* Stimulus Stage */}
          <div className="h-64 sm:h-72 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-6 text-center">
            {currentShape ? (
              <div className="space-y-3 animate-in zoom-in-95 duration-100">
                <currentShape.icon
                  className={`w-28 h-28 mx-auto ${
                    currentShape.isTarget ? 'text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-slate-500'
                  }`}
                />
                <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                  {currentShape.isTarget ? 'Target Object' : 'Distractor'}
                </p>
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-700" />
            )}
          </div>

          {/* User Response Button */}
          <button
            onClick={handleTargetClick}
            disabled={!currentShape || userClickedCurrent}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all ${
              userClickedCurrent
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white transform active:scale-98'
            }`}
          >
            {userClickedCurrent ? '✓ Response Recorded' : 'Target Detected! (Click Here)'}
          </button>
        </div>
      )}

      {testState === 'FINISHED' && (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Attention Task Completed</h3>
          <p className="text-xs text-slate-500">Compiling detection accuracy and false alarm metrics...</p>
        </div>
      )}
    </div>
  );
}
