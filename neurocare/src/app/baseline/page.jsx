'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  PlusCircle,
  FileText,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { useDashboard } from '../components/DashboardShell';
import BaselineOverviewCards from '../components/BaselineOverviewCards';
import BaselineSetupForm from '../components/BaselineSetupForm';
import BaselineComparisonSection from '../components/BaselineComparisonSection';
import BaselineHistorySection from '../components/BaselineHistorySection';
import {
  fetchBaselineOverview,
  fetchBaselineFormData,
  fetchBaselineDetailedComparison,
  fetchBaselineHistory,
  saveBaselineRecord,
} from '@/lib/healthDataService';

export default function BaselinePage() {
  const { isDemoMode, setIsDemoMode, user } = useDashboard();

  const [overview, setOverview] = useState(null);
  const [formData, setFormData] = useState(null);
  const [comparisons, setComparisons] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load baseline page data based on demo mode
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const [ov, form, comps, hist] = await Promise.all([
          fetchBaselineOverview(isDemoMode),
          fetchBaselineFormData(isDemoMode),
          fetchBaselineDetailedComparison(isDemoMode),
          fetchBaselineHistory(isDemoMode),
        ]);

        if (!isCancelled) {
          setOverview(ov);
          setFormData(form);
          setComparisons(comps || []);
          setHistory(hist || []);
        }
      } catch (err) {
        console.error('Error fetching baseline data:', err);
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

  // Handler for saving/establishing baseline from the setup form
  const handleSaveBaseline = async (submittedForm) => {
    // Call service layer
    await saveBaselineRecord(submittedForm);

    // Update in-memory prototype state so user immediately sees their updates
    setOverview((prev) => ({
      ...prev,
      status: 'Established',
      establishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUpdatedDate: 'Just now',
      recordedMeasurementsCount: (prev?.recordedMeasurementsCount || 0) + 1,
      completedFieldsCount: 6,
      completenessPercentage: 86,
    }));

    // Append to history so prior baselines are preserved
    setHistory((prev) => [
      {
        id: `bl-user-${Date.now()}`,
        label: 'Custom Calibrated Reference Period (Active)',
        dateRange: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – Present`,
        establishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastUpdatedDate: 'Just now',
        status: 'Active',
        measurementsCount: 1,
        cognitiveSessionsCount: 3,
        sources: [submittedForm.sourceType || 'Manual & Wearable Log'],
        metricsSummary: [
          { label: 'Resting HR', value: submittedForm.heartRate ? `${submittedForm.heartRate} BPM` : 'Unset' },
          { label: 'Sleep Avg', value: submittedForm.sleepDuration ? `${submittedForm.sleepDuration} hrs` : 'Unset' },
          { label: 'Daily Steps', value: submittedForm.dailySteps ? `${submittedForm.dailySteps} steps` : 'Unset' },
          { label: 'Blood Pressure', value: submittedForm.bloodPressureSys ? `${submittedForm.bloodPressureSys}/${submittedForm.bloodPressureDia} mmHg` : 'Unset' },
        ],
        conditions: submittedForm.conditionNotes || 'Configured via interactive calibration form.',
        notes: 'User-calibrated reference standard. Prior baseline periods preserved.',
      },
      ...prev.map((item) => ({ ...item, status: 'Archived' })),
    ]);
  };

  const scrollToForm = () => {
    const el = document.getElementById('baseline-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumbs & Navigation */}
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
          Health Baseline
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              {overview?.status || 'Baseline Active'}
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Demo Prototype Data
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Health Baseline
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed font-normal">
            Establish your personal reference values to understand changes over time.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              {overview?.establishedDate ? `Established: ${overview.establishedDate}` : 'No established date'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              {overview?.lastUpdatedDate ? `Last updated: ${overview.lastUpdatedDate}` : 'Pending setup'}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-400">Standard: 14-Day Rolling</span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            {overview?.status === 'Established' ? 'Update Baseline' : 'Create Baseline'}
          </button>
        </div>
      </div>

      {/* Medical Safety Advisory Banner */}
      <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 flex items-start gap-3 text-xs text-cyan-950">
        <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Medical Notice:</strong> NeuroSense provides personal health tracking and self-assessment tools. Recorded measurements and cognitive tasks are not a substitute for professional medical advice or diagnosis. NeuroSense compares you strictly to your own individual physiological reference standards.
        </p>
      </div>

      {/* 1. Baseline Overview Cards */}
      <section aria-label="Baseline Overview">
        <BaselineOverviewCards
          overview={overview}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* 2. Baseline Comparison Section (Baseline vs Latest) */}
      <section aria-label="Baseline vs Latest Comparison">
        <BaselineComparisonSection
          comparisons={comparisons}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* 3. Baseline Setup Form */}
      <section aria-label="Baseline Setup Form">
        <BaselineSetupForm
          key={isDemoMode ? 'demo-baseline-form' : 'empty-baseline-form'}
          initialData={formData}
          onSaveBaseline={handleSaveBaseline}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* 4. Baseline History Section */}
      <section aria-label="Baseline Calibration History">
        <BaselineHistorySection
          history={history}
          isDemoMode={isDemoMode}
        />
      </section>
    </div>
  );
}
