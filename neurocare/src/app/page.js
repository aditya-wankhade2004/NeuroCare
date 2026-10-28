'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from './components/DashboardShell';
import WelcomeBanner from './components/WelcomeBanner';
import MetricCard from './components/MetricCard';
import HealthTrendChart from './components/HealthTrendChart';
import BaselineComparison from './components/BaselineComparison';
import ChangeInsight from './components/ChangeInsight';
import RecentActivity from './components/RecentActivity';
import DeviceStatus from './components/DeviceStatus';
import {
  fetchSummaryMetrics,
  fetchTrendData,
  fetchBaselineData,
  fetchChangeInsights,
  fetchRecentActivities,
  fetchConnectedDevices,
} from '@/lib/healthDataService';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const { isDemoMode, setIsDemoMode, user } = useDashboard();

  const [metrics, setMetrics] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [baselineData, setBaselineData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [activities, setActivities] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [m, t, b, ins, act, dev] = await Promise.all([
          fetchSummaryMetrics(isDemoMode),
          fetchTrendData(null, isDemoMode),
          fetchBaselineData(isDemoMode),
          fetchChangeInsights(isDemoMode),
          fetchRecentActivities(isDemoMode),
          fetchConnectedDevices(isDemoMode),
        ]);

        if (!isCancelled) {
          setMetrics(m);
          setTrendData(t);
          setBaselineData(b);
          setInsights(ins || []);
          setActivities(act || []);
          setDevices(dev || []);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isCancelled = true;
    };
  }, [isDemoMode]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome Section */}
      <WelcomeBanner userName={user?.name} isDemoMode={isDemoMode} />

      {/* 2. Health Summary Cards (4-Column Grid) */}
      <section aria-label="Health Summary Cards">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Vital Biomarkers & Cognitive Summary
          </h2>
          {isDemoMode && (
            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Demo Telemetry
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Resting Heart Rate */}
          <MetricCard
            type="heart"
            label="Resting Heart Rate"
            value={metrics?.heartRate?.value}
            unit={metrics?.heartRate?.unit}
            timestamp={metrics?.heartRate?.timestamp}
            source={metrics?.heartRate?.source}
            trend={metrics?.heartRate?.trend}
            status={metrics?.heartRate?.status}
            statusType={metrics?.heartRate?.statusType}
            isDemoMode={isDemoMode}
            emptyStateAction="Connect Heart Rate Monitor"
            emptyStateHref="/devices"
          />

          {/* 2. Sleep Duration */}
          <MetricCard
            type="moon"
            label="Sleep Duration"
            value={metrics?.sleep?.value}
            unit={metrics?.sleep?.unit}
            timestamp={metrics?.sleep?.timestamp}
            source={metrics?.sleep?.source}
            trend={metrics?.sleep?.trend}
            status={metrics?.sleep?.status}
            statusType={metrics?.sleep?.statusType}
            isDemoMode={isDemoMode}
            emptyStateAction="Sync Sleep Tracker"
            emptyStateHref="/devices"
          />

          {/* 3. Cognitive Performance */}
          <MetricCard
            type="brain"
            label="Cognitive Performance"
            value={metrics?.cognitive?.value}
            unit={metrics?.cognitive?.unit}
            subtext={metrics?.cognitive?.subtext}
            timestamp={metrics?.cognitive?.timestamp}
            source={metrics?.cognitive?.source}
            trend={metrics?.cognitive?.trend}
            status={metrics?.cognitive?.status}
            statusType={metrics?.cognitive?.statusType}
            linkUrl={metrics?.cognitive?.linkUrl || '/assessments'}
            linkText="Start Test"
            isDemoMode={isDemoMode}
            emptyStateAction="Take Assessment"
            emptyStateHref="/assessments"
          />

          {/* 4. Activity */}
          <MetricCard
            type="activity"
            label="Daily Activity"
            value={metrics?.activity?.value}
            unit={metrics?.activity?.unit}
            subtext={metrics?.activity?.subtext}
            timestamp={metrics?.activity?.timestamp}
            source={metrics?.activity?.source}
            trend={metrics?.activity?.trend}
            status={metrics?.activity?.status}
            statusType={metrics?.activity?.statusType}
            isDemoMode={isDemoMode}
            emptyStateAction="Connect Pedometer"
            emptyStateHref="/devices"
          />
        </div>
      </section>

      {/* 3. Personal Health Trends Recharts Visualization */}
      <section aria-label="Personal Health Trends">
        <HealthTrendChart
          trendData={trendData}
          isDemoMode={isDemoMode}
          onResetDemo={() => setIsDemoMode(true)}
        />
      </section>

      {/* 4. Personal Baseline Comparison */}
      <section aria-label="Personal Baseline Comparison">
        <BaselineComparison
          baselineData={baselineData}
          isDemoMode={isDemoMode}
        />
      </section>

      {/* 5. "What Changed?" Insights */}
      <section aria-label="Variance Insights">
        <ChangeInsight insights={insights} isDemoMode={isDemoMode} />
      </section>

      {/* 6. Recent Activity & Connected Devices Grid */}
      <section
        aria-label="Activity and Device Connections"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <RecentActivity activities={activities} isDemoMode={isDemoMode} />
        <DeviceStatus devices={devices} isDemoMode={isDemoMode} />
      </section>
    </div>
  );
}
