'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  History,
  TrendingUp,
  Award,
  Zap,
  Target,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useDashboard } from '../components/DashboardShell';
import AssessmentCard from '../components/assessments/AssessmentCard';
import ReactionTest from '../components/assessments/ReactionTest';
import AttentionTest from '../components/assessments/AttentionTest';
import MemoryTest from '../components/assessments/MemoryTest';
import MotionTest from '../components/assessments/MotionTest';
import AssessmentResultsModal from '../components/assessments/AssessmentResultsModal';
import AssessmentHistoryTable from '../components/assessments/AssessmentHistoryTable';
import AssessmentTrendChart from '../components/assessments/AssessmentTrendChart';
import {
  fetchAssessmentOverview,
  fetchAssessmentHistory,
  fetchAssessmentTrends,
  saveAssessmentResult,
} from '@/lib/healthDataService';

export default function AssessmentsPage() {
  const { isDemoMode, setIsDemoMode, user } = useDashboard();

  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [trends, setTrends] = useState(null);
  const [activeTestId, setActiveTestId] = useState(null); // null | 'neuro-reaction' | 'neuro-attention' | 'neuro-memory' | 'neuro-motion'
  const [completedResults, setCompletedResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data based on isDemoMode
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const [ov, hist, tr] = await Promise.all([
          fetchAssessmentOverview(isDemoMode),
          fetchAssessmentHistory(isDemoMode),
          fetchAssessmentTrends(isDemoMode),
        ]);

        if (!isCancelled) {
          setOverview(ov);
          setHistory(hist || []);
          setTrends(tr);
        }
      } catch (err) {
        console.error('Error fetching assessment data:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [isDemoMode]);

  const handleStartTest = (testId) => {
    setActiveTestId(testId);
    setShowResultsModal(false);
    // Smooth scroll down to test arena
    setTimeout(() => {
      const el = document.getElementById('test-arena-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTestComplete = (results) => {
    setCompletedResults(results);
    setShowResultsModal(true);
    setActiveTestId(null);
  };

  const handleSaveResult = async () => {
    if (!completedResults) return;

    await saveAssessmentResult(completedResults);

    // Update in-memory prototype session history
    const newHistoryEntry = {
      id: `sess-${Date.now()}`,
      type: completedResults.type,
      typeKey: completedResults.typeKey,
      date: 'Just now',
      timestamp: new Date().toISOString(),
      mainResult:
        completedResults.typeKey === 'reaction'
          ? `${completedResults.median} ms (Median)`
          : completedResults.typeKey === 'attention'
          ? `${completedResults.accuracy}% Accuracy`
          : completedResults.typeKey === 'memory'
          ? `Span: ${completedResults.longestSequence} Tiles`
          : `${completedResults.tapsPerSec} taps/s`,
      subResult:
        completedResults.typeKey === 'reaction'
          ? `Mean: ${completedResults.mean} ms • ${completedResults.validTrialsCount} trials`
          : completedResults.typeKey === 'attention'
          ? `${completedResults.hits} hits • ${completedResults.misses} misses`
          : completedResults.typeKey === 'memory'
          ? `${completedResults.accuracy}% accuracy`
          : `${completedResults.totalTaps} taps in 10s`,
      duration: completedResults.duration,
      validTrials: `${completedResults.validTrialsCount || completedResults.totalTrials || 1} trials`,
      prematureCount: completedResults.prematureCount || 0,
      source: 'Web Application • Prototype Session',
      status: 'Verified Session',
      baselineComparison: 'Recorded in active session',
    };

    setHistory((prev) => [newHistoryEntry, ...prev]);

    // Update overview count
    setOverview((prev) => ({
      ...prev,
      totalCompletedSessions: (prev?.totalCompletedSessions || 0) + 1,
      mostRecentDate: 'Just now',
      cards: {
        ...prev?.cards,
        [completedResults.typeKey]: {
          ...prev?.cards?.[completedResults.typeKey],
          lastCompletedDate: 'Just now',
          completedSessionsCount: (prev?.cards?.[completedResults.typeKey]?.completedSessionsCount || 0) + 1,
          latestMedianMs: completedResults.median || prev?.cards?.[completedResults.typeKey]?.latestMedianMs,
          latestAccuracy: completedResults.accuracy || prev?.cards?.[completedResults.typeKey]?.latestAccuracy,
          longestSequence: completedResults.longestSequence || prev?.cards?.[completedResults.typeKey]?.longestSequence,
          latestTapsPerSec: completedResults.tapsPerSec || prev?.cards?.[completedResults.typeKey]?.latestTapsPerSec,
        },
      },
    }));

    setShowResultsModal(false);
  };

  const handleRetake = () => {
    if (completedResults?.typeKey) {
      const idMap = {
        reaction: 'neuro-reaction',
        attention: 'neuro-attention',
        memory: 'neuro-memory',
        motion: 'neuro-motion',
      };
      setShowResultsModal(false);
      handleStartTest(idMap[completedResults.typeKey]);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          href="/"
          className="hover:text-cyan-700 transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-semibold" aria-current="page">
          Cognitive Assessments
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
              <Brain className="w-3.5 h-3.5 text-cyan-600" />
              Standardized Self-Assessments
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Demo Prototype Data
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cognitive Assessments
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed font-normal">
            Explore your reaction time, attention, memory and motor-task performance over time.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              Total Sessions: <strong className="text-slate-800 font-semibold">{overview?.totalCompletedSessions || 0}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              Recent: <strong className="text-slate-800 font-semibold">{overview?.mostRecentDate || 'Pending'}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Baseline: <span className="text-teal-700 font-semibold">{overview?.baselineAvailable ? 'Calibrated (14-Day)' : 'Uncalibrated'}</span>
            </span>
          </div>
        </div>

        {/* Quick scroll actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => scrollToSection('trends-section')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
            View Trends
          </button>
          <button
            onClick={() => scrollToSection('history-section')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 transition-colors inline-flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-cyan-600" />
            Session History
          </button>
        </div>
      </div>

      {/* Medical & Privacy Safety Advisory Notice */}
      <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex items-start gap-3 text-xs text-cyan-950">
        <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Self-Assessment Notice:</strong> NeuroSense provides personal health tracking and self-assessment tools. Recorded measurements and cognitive tasks are not a substitute for professional medical advice or diagnosis. These tasks evaluate specific behavioral performance under controlled web browser conditions and do not diagnose cognitive disorders, concussions, or neurological conditions.
        </p>
      </div>

      {/* Active Interactive Test Arena (Shown when a test is launched) */}
      {activeTestId && (
        <section id="test-arena-section" aria-label="Interactive Test Arena" className="animate-in fade-in duration-200">
          {activeTestId === 'neuro-reaction' && (
            <ReactionTest
              onComplete={handleTestComplete}
              onCancel={() => setActiveTestId(null)}
            />
          )}

          {activeTestId === 'neuro-attention' && (
            <AttentionTest
              onComplete={handleTestComplete}
              onCancel={() => setActiveTestId(null)}
            />
          )}

          {activeTestId === 'neuro-memory' && (
            <MemoryTest
              onComplete={handleTestComplete}
              onCancel={() => setActiveTestId(null)}
            />
          )}

          {activeTestId === 'neuro-motion' && (
            <MotionTest
              onComplete={handleTestComplete}
              onCancel={() => setActiveTestId(null)}
            />
          )}
        </section>
      )}

      {/* Assessment Overview Cards (4 Grid) */}
      <section aria-label="Assessment Batteries">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Available Assessment Batteries
          </h2>
          <span className="text-xs text-slate-400">4 Validated Behavioral Protocols</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <AssessmentCard
            card={overview?.cards?.reaction}
            onStartTest={handleStartTest}
            isDemoMode={isDemoMode}
          />

          <AssessmentCard
            card={overview?.cards?.attention}
            onStartTest={handleStartTest}
            isDemoMode={isDemoMode}
          />

          <AssessmentCard
            card={overview?.cards?.memory}
            onStartTest={handleStartTest}
            isDemoMode={isDemoMode}
          />

          <AssessmentCard
            card={overview?.cards?.motion}
            onStartTest={handleStartTest}
            isDemoMode={isDemoMode}
          />
        </div>
      </section>

      {/* Progress Visualization (Recharts Trend Chart) */}
      <section id="trends-section" aria-label="Longitudinal Assessment Trends">
        <AssessmentTrendChart
          trends={trends}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* Assessment Session History Table */}
      <section id="history-section" aria-label="Assessment Session History">
        <AssessmentHistoryTable
          history={history}
          isDemoMode={isDemoMode}
          onSelectSession={(session) => {
            setSelectedHistoryItem(session);
          }}
        />
      </section>

      {/* Completed Results Modal */}
      <AssessmentResultsModal
        isOpen={showResultsModal}
        results={completedResults}
        baselineOverview={overview}
        onRetake={handleRetake}
        onSaveResult={handleSaveResult}
        onClose={() => setShowResultsModal(false)}
      />
    </div>
  );
}
