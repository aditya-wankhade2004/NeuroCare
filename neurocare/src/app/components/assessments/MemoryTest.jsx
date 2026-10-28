'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  getPreciseTimestamp,
  generateMemoryTileSequence,
  calculateMemoryStats,
} from '@/lib/assessmentEngine';

const GRID_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const INITIAL_SEQUENCE_LENGTH = 3;
const MAX_SEQUENCE_LENGTH = 7;

export default function MemoryTest({ onComplete, onCancel }) {
  const [testState, setTestState] = useState('IDLE'); // 'IDLE' | 'SHOWING' | 'RECALL' | 'TRIAL_SUCCESS' | 'TRIAL_FAIL' | 'FINISHED'
  const [sequenceLength, setSequenceLength] = useState(INITIAL_SEQUENCE_LENGTH);
  const [targetSequence, setTargetSequence] = useState([]);
  const [activeHighlightTile, setActiveHighlightTile] = useState(null);
  const [userInputs, setUserInputs] = useState([]);
  const [longestSequenceRecalled, setLongestSequenceRecalled] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);

  const sessionStartTimeRef = useRef(null);
  const sequenceTimerRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    };
  }, []);

  const handleStartSession = () => {
    sessionStartTimeRef.current = getPreciseTimestamp();
    setSequenceLength(INITIAL_SEQUENCE_LENGTH);
    setLongestSequenceRecalled(0);
    setAttemptsCount(0);
    setCorrectAttempts(0);
    startNewSequenceTrial(INITIAL_SEQUENCE_LENGTH, 0, 0, 0);
  };

  const startNewSequenceTrial = (len, currentAttempts, currentCorrect, currentLongest) => {
    const newSeq = generateMemoryTileSequence(len);
    setTargetSequence(newSeq);
    setUserInputs([]);
    setActiveHighlightTile(null);
    setTestState('SHOWING');

    // Playback sequence one tile at a time
    let step = 0;
    const playNext = () => {
      if (step < newSeq.length) {
        setActiveHighlightTile(newSeq[step]);

        sequenceTimerRef.current = setTimeout(() => {
          setActiveHighlightTile(null);
          step += 1;
          sequenceTimerRef.current = setTimeout(playNext, 300);
        }, 700);
      } else {
        setActiveHighlightTile(null);
        setTestState('RECALL');
      }
    };

    sequenceTimerRef.current = setTimeout(playNext, 600);
  };

  const handleTileClick = (tileNumber) => {
    if (testState !== 'RECALL') return;

    const nextInputs = [...userInputs, tileNumber];
    setUserInputs(nextInputs);

    const currentIndex = nextInputs.length - 1;

    // Check if clicked tile matches target sequence
    if (tileNumber !== targetSequence[currentIndex]) {
      setAttemptsCount((prev) => prev + 1);
      setTestState('TRIAL_FAIL');

      sequenceTimerRef.current = setTimeout(() => {
        finishSession(attemptsCount + 1, correctAttempts, longestSequenceRecalled);
      }, 1500);
      return;
    }

    // Whole sequence matched successfully
    if (nextInputs.length === targetSequence.length) {
      const newAttempts = attemptsCount + 1;
      const newCorrect = correctAttempts + 1;
      const newLongest = Math.max(longestSequenceRecalled, sequenceLength);

      setAttemptsCount(newAttempts);
      setCorrectAttempts(newCorrect);
      setLongestSequenceRecalled(newLongest);
      setTestState('TRIAL_SUCCESS');

      if (sequenceLength >= MAX_SEQUENCE_LENGTH) {
        sequenceTimerRef.current = setTimeout(() => {
          finishSession(newAttempts, newCorrect, newLongest);
        }, 1500);
      } else {
        const nextLen = sequenceLength + 1;
        setSequenceLength(nextLen);
        sequenceTimerRef.current = setTimeout(() => {
          startNewSequenceTrial(nextLen, newAttempts, newCorrect, newLongest);
        }, 1500);
      }
    }
  };

  const finishSession = (totalAttempts, correctCount, maxSeq) => {
    const totalDurationMs = getPreciseTimestamp() - (sessionStartTimeRef.current || getPreciseTimestamp());
    const stats = calculateMemoryStats(totalAttempts, correctCount, maxSeq, totalDurationMs);

    setTestState('FINISHED');

    onComplete({
      type: 'NeuroMemory',
      typeKey: 'memory',
      ...stats,
      completedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              NeuroMemory Test
            </h2>
            <p className="text-xs text-slate-500">
              Sequential Spatial Span & Pattern Recall Standard
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
              <li>The 3×3 grid will highlight tiles in a specific sequence.</li>
              <li>Observe the order carefully. Once the pattern stops, tap the tiles in the exact same order.</li>
              <li>Sequence length begins at 3 and increases with each correct reproduction.</li>
              <li>The task tests active working memory span under controlled conditions.</li>
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

      {(testState === 'SHOWING' || testState === 'RECALL' || testState === 'TRIAL_SUCCESS' || testState === 'TRIAL_FAIL') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
            <span>Level: {sequenceLength} Tiles</span>
            <span className="text-teal-700">
              {testState === 'SHOWING' && 'Memorize the pattern...'}
              {testState === 'RECALL' && `Tap ${targetSequence.length - userInputs.length} remaining tile(s)`}
              {testState === 'TRIAL_SUCCESS' && '✓ Correct! Level advancing...'}
              {testState === 'TRIAL_FAIL' && 'Incorrect sequence.'}
            </span>
          </div>

          {/* 3x3 Tile Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 rounded-2xl max-w-sm mx-auto shadow-inner">
            {GRID_TILES.map((tileNum) => {
              const isHighlighted = activeHighlightTile === tileNum;

              return (
                <button
                  key={tileNum}
                  onClick={() => handleTileClick(tileNum)}
                  disabled={testState !== 'RECALL'}
                  className={`h-24 rounded-xl flex items-center justify-center text-xl font-bold font-mono transition-all duration-150 ${
                    isHighlighted
                      ? 'bg-gradient-to-tr from-cyan-400 to-teal-300 text-slate-950 scale-105 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                      : testState === 'RECALL'
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95 border border-slate-700'
                      : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-800'
                  }`}
                >
                  {tileNum}
                </button>
              );
            })}
          </div>

          <p className="text-center text-[11px] text-slate-400 pt-1">
            {testState === 'SHOWING' ? 'Watch tiles illuminate...' : 'Tap tiles in order'}
          </p>
        </div>
      )}

      {testState === 'FINISHED' && (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Session Completed</h3>
          <p className="text-xs text-slate-500">Compiling your sequential recall span...</p>
        </div>
      )}
    </div>
  );
}
