'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Database,
  HeartPulse,
  Info,
  LockKeyhole,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Watch,
  X,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

const INTEGRATIONS = [
  {
    id: 'wearables',
    name: 'Smartwatches & fitness trackers',
    description: 'Activity, sleep, and supported heart-rate measurements from compatible wearables.',
    examples: 'Apple Watch, Fitbit, Garmin, and other compatible wearables',
    dataTypes: ['Activity and steps', 'Sleep summaries', 'Supported heart-rate measurements'],
    icon: Watch,
  },
  {
    id: 'mobile-health',
    name: 'Smartphone health data',
    description: 'Health records shared through a supported mobile health platform.',
    examples: 'Apple Health and Android Health Connect',
    dataTypes: ['Activity summaries', 'Sleep records', 'Supported physiological measurements'],
    icon: Smartphone,
  },
  {
    id: 'sensors',
    name: 'EEG & specialized sensors',
    description: 'Compatible research or wellness sensors, when a verified integration is available.',
    examples: 'Compatible EEG headbands and specialized sensors',
    dataTypes: ['Device-dependent sensor data'],
    icon: Brain,
  },
];

const MEASUREMENT_TYPES = {
  heart_rate: {
    label: 'Resting heart rate',
    unit: 'BPM',
    min: 20,
    max: 250,
    step: 1,
  },
  sleep: {
    label: 'Sleep duration',
    unit: 'hours',
    min: 0,
    max: 24,
    step: 0.1,
  },
  steps: {
    label: 'Daily steps',
    unit: 'steps',
    min: 0,
    max: 200000,
    step: 1,
  },
  blood_pressure: {
    label: 'Blood pressure',
    unit: 'mmHg',
    min: 50,
    max: 300,
    step: 1,
  },
};

function SummaryCard({ icon: Icon, label, value, detail, tone = 'cyan' }) {
  const iconTone = tone === 'amber'
    ? 'bg-amber-50 text-amber-700'
    : 'bg-cyan-50 text-cyan-700';

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconTone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{detail}</p>
    </article>
  );
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
      <Clock3 className="h-3 w-3" aria-hidden="true" />
      Integration coming soon
    </span>
  );
}

function IntegrationCard({ integration, onReview }) {
  const Icon = integration.icon;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <ComingSoonBadge />
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-900">{integration.name}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{integration.description}</p>
      <p className="mt-3 text-xs font-medium text-slate-700">{integration.examples}</p>
      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Potential data, subject to provider support</p>
        <ul className="mt-2 space-y-1.5">
          {integration.dataTypes.map((type) => (
            <li key={type} className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden="true" />
              {type}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => onReview(integration)}
        className="mt-auto inline-flex items-center justify-center gap-2 pt-5 text-xs font-semibold text-cyan-700 transition-colors hover:text-cyan-900"
      >
        Review details
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </article>
  );
}

function ManualMeasurementForm({ onAdd }) {
  const [error, setError] = useState('');
  const [measurementType, setMeasurementType] = useState('heart_rate');

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const type = String(data.get('measurementType') || '');
    const definition = MEASUREMENT_TYPES[type];
    const value = Number(data.get('value'));
    const measuredAt = String(data.get('measuredAt') || '');
    const source = String(data.get('source') || '').trim();
    const notes = String(data.get('notes') || '').trim();

    if (!definition || !Number.isFinite(value) || value < definition.min || value > definition.max) {
      setError('Enter a valid measurement value within the supported range.');
      return;
    }

    let diastolic;
    if (type === 'blood_pressure') {
      diastolic = Number(data.get('diastolic'));
      if (!Number.isFinite(diastolic) || diastolic < 30 || diastolic > 200 || diastolic >= value) {
        setError('Enter a valid diastolic pressure between 30 and 200 mmHg that is lower than systolic pressure.');
        return;
      }
    }

    const timestamp = new Date(measuredAt);
    if (!measuredAt || Number.isNaN(timestamp.getTime()) || timestamp > new Date()) {
      setError('Choose a valid measurement date and time that is not in the future.');
      return;
    }
    if (!source) {
      setError('Enter the source of this manually recorded measurement.');
      return;
    }

    const added = onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      label: definition.label,
      value,
      unit: definition.unit,
      diastolic: type === 'blood_pressure' ? diastolic : null,
      measuredAt: timestamp.toLocaleString(),
      source,
      notes,
      origin: 'Manual entry',
    }, form);
    if (!added) return;
    setMeasurementType('heart_rate');
    setError('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-slate-700">
          Measurement type
          <select
            name="measurementType"
            value={measurementType}
            onChange={(event) => {
              setMeasurementType(event.target.value);
              setError('');
            }}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          >
            {Object.entries(MEASUREMENT_TYPES).map(([type, definition]) => (
              <option key={type} value={type}>{definition.label}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-slate-700">
            {measurementType === 'blood_pressure' ? 'Systolic' : 'Value'}
            <input
              name="value"
              type="number"
              required
              min={MEASUREMENT_TYPES[measurementType].min}
              max={MEASUREMENT_TYPES[measurementType].max}
              step={MEASUREMENT_TYPES[measurementType].step}
              inputMode="decimal"
              placeholder={measurementType === 'blood_pressure' ? 'e.g. 120' : 'Enter value'}
              className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </label>
          {measurementType === 'blood_pressure' ? (
            <label className="text-xs font-semibold text-slate-700">
              Diastolic (mmHg)
              <input
                name="diastolic"
                type="number"
                required
                min="30"
                max="200"
                step="1"
                inputMode="numeric"
                placeholder="e.g. 80"
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
          ) : (
            <div className="flex flex-col justify-end">
              <span className="mb-2 text-xs font-semibold text-slate-700">Unit</span>
              <span className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                {MEASUREMENT_TYPES[measurementType].unit}
              </span>
            </div>
          )}
        </div>

        <label className="text-xs font-semibold text-slate-700">
          Measurement date and time
          <input
            name="measuredAt"
            type="datetime-local"
            required
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
        <label className="text-xs font-semibold text-slate-700">
          Source
          <input
            name="source"
            type="text"
            required
            maxLength="80"
            placeholder="e.g. Home blood pressure monitor"
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </label>
      </div>
      <label className="block text-xs font-semibold text-slate-700">
        Notes <span className="font-normal text-slate-400">(optional)</span>
        <textarea
          name="notes"
          rows="2"
          maxLength="300"
          placeholder="Add context if useful"
          className="mt-1.5 block w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </label>
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-relaxed text-slate-500">
          Entries are labeled as manual and kept in this page only; they are not uploaded or saved between visits.
        </p>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:from-cyan-500 hover:to-teal-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add measurement
        </button>
      </div>
    </form>
  );
}

export default function DevicesPage() {
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [message, setMessage] = useState('');
  const [lastCheckedAt, setLastCheckedAt] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLastCheckedAt(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function addMeasurement(measurement, form) {
    const duplicate = measurements.some((record) => (
      record.type === measurement.type
      && record.value === measurement.value
      && record.diastolic === measurement.diastolic
      && record.measuredAt === measurement.measuredAt
    ));

    if (duplicate) {
      setMessage('That measurement is already listed for this page visit.');
      return false;
    }

    setMeasurements((current) => [measurement, ...current]);
    setMessage(`${measurement.label} added as a manual entry for this page visit.`);
    form.reset();
    return true;
  }

  const formattedCheckTime = lastCheckedAt
    ? lastCheckedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : 'Checking…';

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
                No live integrations configured
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                Status checked {formattedCheckTime}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Device Connections</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Connect supported devices and manage the sources of your personal health and cognitive wellness data.
            </p>
          </div>
          <a
            href="#integrations"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:from-cyan-500 hover:to-teal-500"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Browse integrations
          </a>
        </div>
      </section>

      <section aria-label="Connection overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Watch}
          label="Connected devices"
          value="0"
          detail="No provider has confirmed a connection."
        />
        <SummaryCard
          icon={Database}
          label="Available integrations"
          value="0 ready"
          detail="Provider authorization and sync are not implemented."
        />
        <SummaryCard
          icon={Clock3}
          label="Last successful sync"
          value="None yet"
          detail="No sync has been attempted or reported."
        />
        <SummaryCard
          icon={AlertCircle}
          label="Sources requiring attention"
          value="0"
          detail="There are no connected sources to review."
          tone="amber"
        />
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Your data, your control</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              No device permissions have been requested and no device data is connected. Future integrations should request only the data you approve. Manual entries below stay in page memory for this visit and are not persisted.
            </p>
            <Link href="/settings" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-800 hover:text-cyan-950">
              Review privacy and backend settings
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="integrations" className="scroll-mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Supported device categories</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            These provider connections are not available yet. No account credentials or access tokens are collected here.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {INTEGRATIONS.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onReview={setSelectedIntegration}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Add a manual measurement</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Record a value yourself. It will be identified as manual, not as a device reading.
            </p>
          </div>
        </div>
        <ManualMeasurementForm onAdd={addMeasurement} />
        {message && (
          <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs text-teal-800">
            {message}
          </p>
        )}
        {measurements.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Manual entries for this visit</h3>
            <ul className="space-y-2">
              {measurements.map((measurement) => (
                <li key={measurement.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {measurement.label}: {measurement.value}{measurement.diastolic !== null ? `/${measurement.diastolic}` : ''} {measurement.unit}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {measurement.measuredAt} · Source: {measurement.source}
                    </p>
                    {measurement.notes && <p className="mt-1 text-xs text-slate-500">{measurement.notes}</p>}
                  </div>
                  <span className="inline-flex w-fit items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    <Plus className="h-3 w-3" aria-hidden="true" />
                    {measurement.origin}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Synchronization Activity</h2>
            <p className="mt-1 text-xs text-slate-500">No live device sync is configured for this project.</p>
          </div>
          <span className="text-[11px] text-slate-400">Status checked {formattedCheckTime}</span>
        </div>
        <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
          <RefreshCw className="h-7 w-7 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-slate-700">No synchronization activity</p>
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-slate-500">
            There are no connected sources, sync attempts, timestamps, or imported record counts to display.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900">Privacy & permissions</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Connected sources: none. Granted device permissions: none. This page does not store provider tokens or send manual entries to a server.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Backend status: {isSupabaseConfigured
                ? 'Supabase is configured, but device-connection storage and provider sync are not implemented.'
                : 'Supabase is not configured. Persistent records require backend setup, an authenticated user, and an ownership-protected schema.'}
            </p>
            <Link href="/settings" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-900">
              Open privacy settings
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {selectedIntegration && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedIntegration(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="integration-dialog-title"
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700">Integration details</p>
                <h2 id="integration-dialog-title" className="mt-1 text-lg font-bold text-slate-900">{selectedIntegration.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIntegration(null)}
                aria-label="Close integration details"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{selectedIntegration.description}</p>
            <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50/70 p-4">
              <p className="text-xs font-bold text-slate-800">Permissions and availability</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                No permissions are requested because this provider connection is not implemented. If added, you would review each requested data category before provider authorization. NeuroSense will not ask you to enter a provider password or token here.
              </p>
              <ul className="mt-3 space-y-1.5">
                {selectedIntegration.dataTypes.map((type) => (
                  <li key={type} className="text-xs text-slate-600">• {type}</li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              A compatible EEG device, supported integration, and your consent would be required for EEG data. Sensor readings are not a diagnosis.
            </p>
            <button
              type="button"
              onClick={() => setSelectedIntegration(null)}
              className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
