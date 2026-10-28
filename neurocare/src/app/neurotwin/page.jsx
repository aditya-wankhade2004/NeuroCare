'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Activity,
  Zap,
  Target,
  Layers,
  Moon,
  HeartPulse,
  Footprints,
  Info,
} from 'lucide-react';
import { useDashboard } from '../components/DashboardShell';
import NeuroTwinVisualization from '../components/neurotwin/NeuroTwinVisualization';
import CategoryDetailsPanel from '../components/neurotwin/CategoryDetailsPanel';
import NeuroTwinMetricCard from '../components/neurotwin/NeuroTwinMetricCard';
import NeuroTwinTimeline from '../components/neurotwin/NeuroTwinTimeline';
import ChangeSummary from '../components/neurotwin/ChangeSummary';
import DataCoverage from '../components/neurotwin/DataCoverage';
import {
  fetchNeuroTwinOverview,
  fetchNeuroTwinCategories,
  fetchNeuroTwinTimeline,
  fetchNeuroTwinChangeSummaries,
  fetchNeuroTwinCoverage,
} from '@/lib/healthDataService';

export default function NeuroTwinPage() {
  const { isDemoMode, setIsDemoMode, user } = useDashboard();

  const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [changes, setChanges] = useState([]);
  const [coverage, setCoverage] = useState([]);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('cognitive');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d'); // '7d' | '30d' | '90d'
  const [isLoading, setIsLoading] = useState(true);

  // Load data based on isDemoMode
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const [ov, cats, tl, ch, cov] = await Promise.all([
          fetchNeuroTwinOverview(isDemoMode),
          fetchNeuroTwinCategories(isDemoMode),
          fetchNeuroTwinTimeline(isDemoMode),
          fetchNeuroTwinChangeSummaries(isDemoMode),
          fetchNeuroTwinCoverage(isDemoMode),
        ]);

        if (!isCancelled) {
          setOverview(ov);
          setCategories(cats);
          setTimeline(tl || []);
          setChanges(ch || []);
          setCoverage(cov || []);
        }
      } catch (err) {
        console.error('Error fetching NeuroTwin data:', err);
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

  const selectedCategoryData = categories ? categories[selectedCategoryKey] : null;

  const handleSelectCategory = (catKey) => {
    setSelectedCategoryKey(catKey);
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
          NeuroTwin
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
              <Cpu className="w-3.5 h-3.5 text-cyan-600" />
              Personal Data Topology
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Demo Prototype Data
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            NeuroTwin
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed font-normal">
            Explore your personal health measurements, cognitive performance and changes over time.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Data Coverage: <strong className="text-teal-700 font-semibold">{overview?.coveragePercent || 0}% ({overview?.calibratedCategoriesCount || 0}/8 Categories)</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              Last Updated: <strong className="text-slate-800 font-semibold">{overview?.lastUpdated || 'Pending'}</strong>
            </span>
            <span>•</span>
            <span className="font-mono text-slate-400">Baseline: 14-Day Rolling</span>
          </div>
        </div>

        {/* Date-Range Selector & Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600 self-start sm:self-auto">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                  selectedTimeRange === range
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          <Link
            href="/reports"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all transform active:scale-95"
          >
            <FileText className="w-4 h-4" />
            View Reports
          </Link>
        </div>
      </div>

      {/* Medical Safety Advisory Notice */}
      <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex items-start gap-3 text-xs text-cyan-950">
        <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Scientific Principle:</strong> NeuroTwin visualizes your recorded measurements and assessment history. It does not reproduce your actual brain or diagnose medical conditions.
        </p>
      </div>

      {/* 1. Main NeuroTwin Visualization & Details Panel (Side-by-Side Grid) */}
      <section aria-label="Interactive Topology" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeuroTwinVisualization
          categories={categories}
          selectedCategory={selectedCategoryKey}
          onSelectCategory={handleSelectCategory}
          isDemoMode={isDemoMode}
        />

        <CategoryDetailsPanel
          categoryData={selectedCategoryData}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* 2. Personal Data Summary Cards (6 Cards Grid) */}
      <section aria-label="Personal Health Telemetry Summary">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Personal Health & Cognitive Summary
          </h2>
          <span className="text-xs text-slate-400">Validated Telemetry Feeds</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Cognitive Assessments */}
          <NeuroTwinMetricCard
            type="cognitive"
            title="Cognitive Sessions"
            value="18 Sessions"
            unit="Completed"
            date="Yesterday, 16:30"
            source="Symbol & Stroop Batteries"
            diff="+3 points vs baseline"
            linkUrl="/assessments"
            linkText="Take Test"
            hasData={Boolean(categories?.cognitive?.hasData)}
            isDemoMode={isDemoMode}
          />

          {/* Card 2: Reaction Time */}
          <NeuroTwinMetricCard
            type="reaction"
            title="Reaction Latency"
            value={categories?.reaction?.latestValue?.split(' ')[0]}
            unit="ms"
            date={categories?.reaction?.date}
            source={categories?.reaction?.source}
            diff={categories?.reaction?.differenceFormatted}
            linkUrl="/assessments"
            linkText="View Test"
            hasData={Boolean(categories?.reaction?.hasData)}
            isDemoMode={isDemoMode}
          />

          {/* Card 3: Memory Task */}
          <NeuroTwinMetricCard
            type="memory"
            title="Working Memory"
            value={categories?.memory?.latestValue?.split(' ')[0]}
            unit="tiles"
            date={categories?.memory?.date}
            source={categories?.memory?.source}
            diff={categories?.memory?.differenceFormatted}
            linkUrl="/assessments"
            linkText="View Test"
            hasData={Boolean(categories?.memory?.hasData)}
            isDemoMode={isDemoMode}
          />

          {/* Card 4: Motor Performance */}
          <NeuroTwinMetricCard
            type="motor"
            title="Motor Cadence"
            value={categories?.motor?.latestValue?.split(' ')[0]}
            unit="taps/s"
            date={categories?.motor?.date}
            source={categories?.motor?.source}
            diff={categories?.motor?.differenceFormatted}
            linkUrl="/assessments"
            linkText="View Test"
            hasData={Boolean(categories?.motor?.hasData)}
            isDemoMode={isDemoMode}
          />

          {/* Card 5: Sleep Data */}
          <NeuroTwinMetricCard
            type="sleep"
            title="Recorded Sleep"
            value={categories?.sleep?.latestValue?.split(' ')[0]}
            unit="hours"
            date={categories?.sleep?.date}
            source={categories?.sleep?.source}
            diff={categories?.sleep?.differenceFormatted}
            linkUrl="/devices"
            linkText="Devices"
            hasData={Boolean(categories?.sleep?.hasData)}
            isDemoMode={isDemoMode}
          />

          {/* Card 6: Physiological Telemetry */}
          <NeuroTwinMetricCard
            type="physiology"
            title="Resting Vitals"
            value={categories?.physiology?.latestValue}
            unit=""
            date={categories?.physiology?.date}
            source={categories?.physiology?.source}
            diff={categories?.physiology?.differenceFormatted}
            linkUrl="/baseline"
            linkText="Baseline"
            hasData={Boolean(categories?.physiology?.hasData)}
            isDemoMode={isDemoMode}
          />
        </div>
      </section>

      {/* 3. Timeline and Historical Navigation */}
      <section aria-label="Historical Health Timeline">
        <NeuroTwinTimeline
          timeline={timeline}
          selectedCategory={selectedCategoryKey}
          onSelectTimelineEntry={handleSelectCategory}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* 4. What Changed? Personal Change Summary */}
      <section aria-label="Personal Change Summary">
        <ChangeSummary
          changes={changes}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* 5. Data Coverage and Reliability */}
      <section aria-label="Data Coverage & Reliability">
        <DataCoverage
          coverage={coverage}
          isDemoMode={isDemoMode}
        />
      </section>
    </div>
  );
}
