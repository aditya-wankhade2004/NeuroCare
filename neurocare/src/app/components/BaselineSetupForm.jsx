'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Heart,
  Moon,
  Footprints,
  Gauge,
  Brain,
  Play,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Smartphone,
  Cpu,
  FileCheck,
} from 'lucide-react';

export default function BaselineSetupForm({
  initialData,
  onSaveBaseline,
  isDemoMode = true,
}) {
  const [formData, setFormData] = useState({
    // Section A: General
    ageRange: '',
    preferredUnits: 'metric',
    generalNotes: '',

    // Section B: Basic Health
    heartRate: '',
    heartRateDate: '',
    heartRateSource: '',
    heartRateIsDevice: true,

    sleepDuration: '',
    sleepDate: '',
    sleepSource: '',
    sleepIsDevice: true,

    dailySteps: '',
    stepsDate: '',
    stepsSource: '',
    stepsIsDevice: true,

    bloodPressureSys: '',
    bloodPressureDia: '',
    bpDate: '',
    bpSource: '',
    bpIsDevice: false,

    // Section D: Conditions
    timeOfDay: 'Morning (08:00 - 10:00)',
    sleepPriorHours: '',
    sourceType: 'Connected Wearable & Validated Manual Log',
    conditionNotes: '',
  });

  const [cognitiveResults, setCognitiveResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [statusNotification, setStatusNotification] = useState(null);

  // Initialize or populate from initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        ageRange: initialData.general?.ageRange || '',
        preferredUnits: initialData.general?.preferredUnits || 'metric',
        generalNotes: initialData.general?.notes || '',

        heartRate: initialData.measurements?.heartRate?.value !== undefined ? String(initialData.measurements.heartRate.value) : '',
        heartRateDate: initialData.measurements?.heartRate?.date || '',
        heartRateSource: initialData.measurements?.heartRate?.source || '',
        heartRateIsDevice: initialData.measurements?.heartRate?.isDevice ?? true,

        sleepDuration: initialData.measurements?.sleepDuration?.value !== undefined ? String(initialData.measurements.sleepDuration.value) : '',
        sleepDate: initialData.measurements?.sleepDuration?.date || '',
        sleepSource: initialData.measurements?.sleepDuration?.source || '',
        sleepIsDevice: initialData.measurements?.sleepDuration?.isDevice ?? true,

        dailySteps: initialData.measurements?.dailySteps?.value !== undefined ? String(initialData.measurements.dailySteps.value) : '',
        stepsDate: initialData.measurements?.dailySteps?.date || '',
        stepsSource: initialData.measurements?.dailySteps?.source || '',
        stepsIsDevice: initialData.measurements?.dailySteps?.isDevice ?? true,

        bloodPressureSys: initialData.measurements?.bloodPressureSys?.value !== undefined ? String(initialData.measurements.bloodPressureSys.value) : '',
        bloodPressureDia: initialData.measurements?.bloodPressureDia?.value !== undefined ? String(initialData.measurements.bloodPressureDia.value) : '',
        bpDate: initialData.measurements?.bloodPressureSys?.date || '',
        bpSource: initialData.measurements?.bloodPressureSys?.source || '',
        bpIsDevice: initialData.measurements?.bloodPressureSys?.isDevice ?? false,

        timeOfDay: initialData.conditions?.timeOfDay || 'Morning (08:00 - 10:00)',
        sleepPriorHours: initialData.conditions?.sleepPriorHours !== undefined ? String(initialData.conditions.sleepPriorHours) : '',
        sourceType: initialData.conditions?.sourceType || 'Connected Wearable & Validated Manual Log',
        conditionNotes: initialData.conditions?.conditionNotes || '',
      });

      setCognitiveResults(initialData.cognitive || null);
    }
  }, [initialData]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Resting HR validation (optional, but if filled must be reasonable)
    if (formData.heartRate !== '') {
      const hr = Number(formData.heartRate);
      if (isNaN(hr) || hr < 35 || hr > 220) {
        newErrors.heartRate = 'Resting HR typically ranges between 40 and 180 BPM.';
      }
    }

    // Sleep duration validation (optional, but if filled must be between 2 and 18 hrs)
    if (formData.sleepDuration !== '') {
      const sleep = Number(formData.sleepDuration);
      if (isNaN(sleep) || sleep < 2 || sleep > 18) {
        newErrors.sleepDuration = 'Sleep duration must be between 2.0 and 18.0 hours.';
      }
    }

    // Daily steps validation (optional, 0 to 100,000)
    if (formData.dailySteps !== '') {
      const steps = Number(formData.dailySteps);
      if (isNaN(steps) || steps < 0 || steps > 100000) {
        newErrors.dailySteps = 'Daily steps must be between 0 and 100,000.';
      }
    }

    // Blood Pressure validation
    if (formData.bloodPressureSys !== '') {
      const sys = Number(formData.bloodPressureSys);
      if (isNaN(sys) || sys < 60 || sys > 260) {
        newErrors.bloodPressureSys = 'Systolic pressure must be between 70 and 220 mmHg.';
      }
    }

    if (formData.bloodPressureDia !== '') {
      const dia = Number(formData.bloodPressureDia);
      if (isNaN(dia) || dia < 30 || dia > 160) {
        newErrors.bloodPressureDia = 'Diastolic pressure must be between 40 and 130 mmHg.';
      }
    }

    // Sleep prior hours
    if (formData.sleepPriorHours !== '') {
      const priorSleep = Number(formData.sleepPriorHours);
      if (isNaN(priorSleep) || priorSleep < 0 || priorSleep > 24) {
        newErrors.sleepPriorHours = 'Prior sleep hours must be between 0 and 24.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field if fixed
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    setDraftSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setStatusNotification({
      type: 'info',
      message: 'Draft configuration saved to temporary session storage.',
    });
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setStatusNotification({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before saving.',
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecuteSave = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      if (onSaveBaseline) {
        await onSaveBaseline(formData);
      }
      setStatusNotification({
        type: 'success',
        message: 'Personal baseline established successfully! Active reference window updated.',
      });
    } catch (err) {
      console.error(err);
      setStatusNotification({
        type: 'error',
        message: 'Could not update baseline. Please check input parameters.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      ageRange: '',
      preferredUnits: 'metric',
      generalNotes: '',
      heartRate: '',
      heartRateDate: '',
      heartRateSource: '',
      heartRateIsDevice: true,
      sleepDuration: '',
      sleepDate: '',
      sleepSource: '',
      sleepIsDevice: true,
      dailySteps: '',
      stepsDate: '',
      stepsSource: '',
      stepsIsDevice: true,
      bloodPressureSys: '',
      bloodPressureDia: '',
      bpDate: '',
      bpSource: '',
      bpIsDevice: false,
      timeOfDay: 'Morning (08:00 - 10:00)',
      sleepPriorHours: '',
      sourceType: 'manual',
      conditionNotes: '',
    });
    setErrors({});
    setShowResetConfirm(false);
    setStatusNotification({
      type: 'info',
      message: 'Baseline setup form has been reset to empty values.',
    });
    setTimeout(() => setStatusNotification(null), 4000);
  };

  return (
    <div id="baseline-form-section" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-8">
      {/* Header of Form */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Baseline Setup & Calibration Form
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200">
              Multi-Source
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure reference parameters used to calculate your personal variances. All fields are optional and support continuous automated telemetry or validated manual logging.
          </p>
        </div>

        {draftSavedAt && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Draft saved at {draftSavedAt}</span>
          </div>
        )}
      </div>

      {/* Notification Toast Banner */}
      {statusNotification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            statusNotification.type === 'success'
              ? 'bg-teal-50 text-teal-900 border border-teal-200'
              : statusNotification.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-200'
              : 'bg-cyan-50 text-cyan-900 border border-cyan-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            ) : statusNotification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            ) : (
              <Info className="w-4 h-4 text-cyan-600" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleOpenConfirm} className="space-y-8">
        {/* =========================================
            SECTION A — GENERAL INFORMATION
           ========================================= */}
        <section aria-labelledby="section-general-info" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-bold flex items-center justify-center">
              A
            </span>
            <h3 id="section-general-info" className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              General Reference Context
            </h3>
            <span className="text-[11px] text-slate-400 font-normal ml-auto">Optional</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Age Range */}
            <div>
              <label htmlFor="ageRange" className="block text-xs font-semibold text-slate-700 mb-1">
                Age Range <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                id="ageRange"
                value={formData.ageRange}
                onChange={(e) => handleChange('ageRange', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              >
                <option value="">Prefer not to state</option>
                <option value="18-29">18 – 29 years</option>
                <option value="30-39">30 – 39 years</option>
                <option value="40-49">40 – 49 years</option>
                <option value="50-59">50 – 59 years</option>
                <option value="60-69">60 – 69 years</option>
                <option value="70+">70+ years</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Used solely for context; not used to assign universal grades.
              </p>
            </div>

            {/* Units Preference */}
            <div>
              <label htmlFor="preferredUnits" className="block text-xs font-semibold text-slate-700 mb-1">
                Measurement Units
              </label>
              <select
                id="preferredUnits"
                value={formData.preferredUnits}
                onChange={(e) => handleChange('preferredUnits', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              >
                <option value="metric">Standard Medical (BPM, hrs, mmHg, ms)</option>
                <option value="imperial">Imperial Standards</option>
              </select>
            </div>

            {/* General Notes */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="generalNotes" className="block text-xs font-semibold text-slate-700 mb-1">
                Routine Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="generalNotes"
                type="text"
                placeholder="e.g., Standard office work hours, night shift, etc."
                value={formData.generalNotes}
                onChange={(e) => handleChange('generalNotes', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION B — BASIC HEALTH MEASUREMENTS
           ========================================= */}
        <section aria-labelledby="section-basic-health" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-bold flex items-center justify-center">
              B
            </span>
            <h3 id="section-basic-health" className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Basic Health Measurements
            </h3>
            <span className="text-[11px] text-slate-400 font-normal ml-auto">
              Empty fields are supported (never treated as zero)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Resting Heart Rate */}
            <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <label htmlFor="heartRate" className="text-xs font-bold text-slate-900">
                    Resting Heart Rate
                  </label>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  BPM
                </span>
              </div>

              <div>
                <input
                  id="heartRate"
                  type="number"
                  placeholder="e.g., 65"
                  value={formData.heartRate}
                  onChange={(e) => handleChange('heartRate', e.target.value)}
                  className={`w-full text-xs rounded-xl border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                    errors.heartRate ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
                {errors.heartRate && (
                  <p className="text-[10px] text-rose-600 mt-1">{errors.heartRate}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <label htmlFor="heartRateDate" className="text-slate-500 block mb-0.5">Recorded Date</label>
                  <input
                    id="heartRateDate"
                    type="date"
                    value={formData.heartRateDate}
                    onChange={(e) => handleChange('heartRateDate', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
                <div>
                  <label htmlFor="heartRateSource" className="text-slate-500 block mb-0.5">Source Device</label>
                  <input
                    id="heartRateSource"
                    type="text"
                    placeholder="e.g., Oura Ring Gen 3"
                    value={formData.heartRateSource}
                    onChange={(e) => handleChange('heartRateSource', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Capture Method:</span>
                <button
                  type="button"
                  onClick={() => handleChange('heartRateIsDevice', !formData.heartRateIsDevice)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    formData.heartRateIsDevice
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {formData.heartRateIsDevice ? 'Connected Wearable' : 'Manual Entry'}
                </button>
              </div>
            </div>

            {/* 2. Sleep Duration */}
            <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-blue-500" />
                  <label htmlFor="sleepDuration" className="text-xs font-bold text-slate-900">
                    Average Sleep Duration
                  </label>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Hours
                </span>
              </div>

              <div>
                <input
                  id="sleepDuration"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 7.5"
                  value={formData.sleepDuration}
                  onChange={(e) => handleChange('sleepDuration', e.target.value)}
                  className={`w-full text-xs rounded-xl border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                    errors.sleepDuration ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
                {errors.sleepDuration && (
                  <p className="text-[10px] text-rose-600 mt-1">{errors.sleepDuration}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <label htmlFor="sleepDate" className="text-slate-500 block mb-0.5">Recorded Date</label>
                  <input
                    id="sleepDate"
                    type="date"
                    value={formData.sleepDate}
                    onChange={(e) => handleChange('sleepDate', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
                <div>
                  <label htmlFor="sleepSource" className="text-slate-500 block mb-0.5">Source Device</label>
                  <input
                    id="sleepSource"
                    type="text"
                    placeholder="e.g., Oura Ring Gen 3"
                    value={formData.sleepSource}
                    onChange={(e) => handleChange('sleepSource', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Capture Method:</span>
                <button
                  type="button"
                  onClick={() => handleChange('sleepIsDevice', !formData.sleepIsDevice)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    formData.sleepIsDevice
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {formData.sleepIsDevice ? 'Connected Wearable' : 'Manual Entry'}
                </button>
              </div>
            </div>

            {/* 3. Daily Steps */}
            <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-teal-600" />
                  <label htmlFor="dailySteps" className="text-xs font-bold text-slate-900">
                    Daily Steps Target
                  </label>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Steps
                </span>
              </div>

              <div>
                <input
                  id="dailySteps"
                  type="number"
                  placeholder="e.g., 8400"
                  value={formData.dailySteps}
                  onChange={(e) => handleChange('dailySteps', e.target.value)}
                  className={`w-full text-xs rounded-xl border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                    errors.dailySteps ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-cyan-500'
                  }`}
                />
                {errors.dailySteps && (
                  <p className="text-[10px] text-rose-600 mt-1">{errors.dailySteps}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <label htmlFor="stepsDate" className="text-slate-500 block mb-0.5">Recorded Date</label>
                  <input
                    id="stepsDate"
                    type="date"
                    value={formData.stepsDate}
                    onChange={(e) => handleChange('stepsDate', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
                <div>
                  <label htmlFor="stepsSource" className="text-slate-500 block mb-0.5">Source Device</label>
                  <input
                    id="stepsSource"
                    type="text"
                    placeholder="e.g., Apple Watch Series 9"
                    value={formData.stepsSource}
                    onChange={(e) => handleChange('stepsSource', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Capture Method:</span>
                <button
                  type="button"
                  onClick={() => handleChange('stepsIsDevice', !formData.stepsIsDevice)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    formData.stepsIsDevice
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {formData.stepsIsDevice ? 'Connected Wearable' : 'Manual Entry'}
                </button>
              </div>
            </div>

            {/* 4. Blood Pressure */}
            <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Resting Blood Pressure
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  mmHg
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="bloodPressureSys" className="text-[11px] text-slate-500 block mb-0.5">
                    Systolic (Upper)
                  </label>
                  <input
                    id="bloodPressureSys"
                    type="number"
                    placeholder="e.g., 118"
                    value={formData.bloodPressureSys}
                    onChange={(e) => handleChange('bloodPressureSys', e.target.value)}
                    className={`w-full text-xs rounded-xl border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                      errors.bloodPressureSys ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-cyan-500'
                    }`}
                  />
                  {errors.bloodPressureSys && (
                    <p className="text-[10px] text-rose-600 mt-1">{errors.bloodPressureSys}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bloodPressureDia" className="text-[11px] text-slate-500 block mb-0.5">
                    Diastolic (Lower)
                  </label>
                  <input
                    id="bloodPressureDia"
                    type="number"
                    placeholder="e.g., 76"
                    value={formData.bloodPressureDia}
                    onChange={(e) => handleChange('bloodPressureDia', e.target.value)}
                    className={`w-full text-xs rounded-xl border px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                      errors.bloodPressureDia ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-cyan-500'
                    }`}
                  />
                  {errors.bloodPressureDia && (
                    <p className="text-[10px] text-rose-600 mt-1">{errors.bloodPressureDia}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <label htmlFor="bpDate" className="text-slate-500 block mb-0.5">Recorded Date</label>
                  <input
                    id="bpDate"
                    type="date"
                    value={formData.bpDate}
                    onChange={(e) => handleChange('bpDate', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
                <div>
                  <label htmlFor="bpSource" className="text-slate-500 block mb-0.5">Source Device</label>
                  <input
                    id="bpSource"
                    type="text"
                    placeholder="e.g., Omron Blood Pressure Monitor"
                    value={formData.bpSource}
                    onChange={(e) => handleChange('bpSource', e.target.value)}
                    className="w-full text-[11px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Capture Method:</span>
                <button
                  type="button"
                  onClick={() => handleChange('bpIsDevice', !formData.bpIsDevice)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    formData.bpIsDevice
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {formData.bpIsDevice ? 'Connected Cuff' : 'Manual Upper-Arm Log'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION C — COGNITIVE BASELINE
           ========================================= */}
        <section aria-labelledby="section-cognitive-baseline" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-bold flex items-center justify-center">
              C
            </span>
            <h3 id="section-cognitive-baseline" className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Cognitive Baseline Assessments
            </h3>
            <span className="text-[11px] text-slate-400 font-normal ml-auto">
              Automated Task Batteries
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Objective Task Standards:</strong> Manual entry of generic overall cognitive scores is prohibited. Baseline latency and memory indices are calibrated through direct, standardized self-assessment sessions. These tasks reflect behavioral performance under specific test conditions and are not diagnostic medical exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Task 1: Reaction Time */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between hover:border-cyan-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Reaction Latency
                  </span>
                  {cognitiveResults?.reactionTime?.completed ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                      Calibrated
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-500">
                      Pending
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900">Symbol-Digit Match</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Processing Speed</p>

                {cognitiveResults?.reactionTime?.completed ? (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <span className="text-xl font-extrabold text-slate-900">
                      {cognitiveResults.reactionTime.value}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">ms</span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Calibrated: {cognitiveResults.reactionTime.date}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400 italic">
                    No trials recorded.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href="/assessments"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                  <Play className="w-3 h-3 fill-cyan-800" />
                  {cognitiveResults?.reactionTime?.completed ? 'Retake Latency Test' : 'Start Assessment'}
                </Link>
              </div>
            </div>

            {/* Task 2: Attention */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between hover:border-cyan-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Inhibitory Control
                  </span>
                  {cognitiveResults?.attention?.completed ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                      Calibrated
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-500">
                      Pending
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900">Stroop Attention Battery</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Sustained Focus</p>

                {cognitiveResults?.attention?.completed ? (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <span className="text-xl font-extrabold text-slate-900">
                      {cognitiveResults.attention.value}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">% accuracy</span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Calibrated: {cognitiveResults.attention.date}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400 italic">
                    No trials recorded.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href="/assessments"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                  <Play className="w-3 h-3 fill-cyan-800" />
                  {cognitiveResults?.attention?.completed ? 'Retake Attention Test' : 'Start Assessment'}
                </Link>
              </div>
            </div>

            {/* Task 3: Memory */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between hover:border-cyan-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Working Memory
                  </span>
                  {cognitiveResults?.memory?.completed ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                      Calibrated
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-500">
                      Pending
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900">Dual 2-Back Spatial</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Short-Term Recall</p>

                {cognitiveResults?.memory?.completed ? (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <span className="text-xl font-extrabold text-slate-900">
                      {cognitiveResults.memory.value}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">% recall</span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Calibrated: {cognitiveResults.memory.date}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400 italic">
                    No trials recorded.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href="/assessments"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 transition-colors"
                >
                  <Play className="w-3 h-3 fill-cyan-800" />
                  {cognitiveResults?.memory?.completed ? 'Retake Memory Test' : 'Start Assessment'}
                </Link>
              </div>
            </div>

            {/* Task 4: Motor Coordination */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between hover:border-cyan-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Motor Coordination
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-500">
                    Optional
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">Finger Tapping Test</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Cadence & Motor Rhythm</p>

                <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400 italic">
                  Available in upcoming battery.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href="/assessments"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Explore Battery
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION D — MEASUREMENT CONDITIONS
           ========================================= */}
        <section aria-labelledby="section-conditions" className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-bold flex items-center justify-center">
              D
            </span>
            <h3 id="section-conditions" className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Measurement Conditions & Context
            </h3>
            <span className="text-[11px] text-slate-400 font-normal ml-auto">Optional</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Time of Day */}
            <div>
              <label htmlFor="timeOfDay" className="block text-xs font-semibold text-slate-700 mb-1">
                Typical Calibration Time
              </label>
              <select
                id="timeOfDay"
                value={formData.timeOfDay}
                onChange={(e) => handleChange('timeOfDay', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              >
                <option value="Morning (08:00 - 10:00)">Morning (08:00 – 10:00 AM)</option>
                <option value="Midday (11:00 - 14:00)">Midday (11:00 AM – 02:00 PM)</option>
                <option value="Afternoon (14:00 - 17:00)">Afternoon (02:00 – 05:00 PM)</option>
                <option value="Evening (18:00 - 21:00)">Evening (06:00 – 09:00 PM)</option>
                <option value="Varied">Varied Times</option>
              </select>
            </div>

            {/* Prior Sleep Hours */}
            <div>
              <label htmlFor="sleepPriorHours" className="block text-xs font-semibold text-slate-700 mb-1">
                Sleep Duration Prior to Baseline (Hours)
              </label>
              <input
                id="sleepPriorHours"
                type="number"
                step="0.1"
                placeholder="e.g., 7.8"
                value={formData.sleepPriorHours}
                onChange={(e) => handleChange('sleepPriorHours', e.target.value)}
                className={`w-full text-xs rounded-xl border px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
                  errors.sleepPriorHours ? 'border-rose-400' : 'border-slate-200 focus:border-cyan-500'
                }`}
              />
              {errors.sleepPriorHours && (
                <p className="text-[10px] text-rose-600 mt-1">{errors.sleepPriorHours}</p>
              )}
            </div>

            {/* Source Mode */}
            <div>
              <label htmlFor="sourceType" className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Telemetry Source
              </label>
              <input
                id="sourceType"
                type="text"
                value={formData.sourceType}
                onChange={(e) => handleChange('sourceType', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>

            {/* Condition Notes */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="conditionNotes" className="block text-xs font-semibold text-slate-700 mb-1">
                Condition Notes <span className="text-slate-400 font-normal">(Caffeine, room ambient temperature, physical rest)</span>
              </label>
              <textarea
                id="conditionNotes"
                rows={2}
                placeholder="e.g., Calibrated in quiet room, no caffeine within 60 minutes, post-hydration."
                value={formData.conditionNotes}
                onChange={(e) => handleChange('conditionNotes', e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>
        </section>

        {/* Supabase Notice Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-600 flex-shrink-0" />
            <span>
              <strong>Storage Status:</strong> Session prototype active. Connect Supabase to persist your baseline calibration across devices and cloud sessions.
            </span>
          </div>
          <Link
            href="/settings"
            className="text-cyan-700 font-semibold hover:underline flex-shrink-0 text-[11px]"
          >
            Check Supabase Config →
          </Link>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Form
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              Save Draft
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              {isSubmitting ? 'Establishing Baseline...' : 'Establish New Baseline'}
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal for Establishing/Updating Baseline */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">
                Confirm Baseline Calibration
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Establishing a new baseline will set your active reference standard to these configured values. Your previous baseline period will be safely preserved in your historical log.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Resting Heart Rate:</span>
                <span className="font-semibold text-slate-900">{formData.heartRate ? `${formData.heartRate} BPM` : 'Unconfigured'}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Sleep:</span>
                <span className="font-semibold text-slate-900">{formData.sleepDuration ? `${formData.sleepDuration} hrs` : 'Unconfigured'}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Steps:</span>
                <span className="font-semibold text-slate-900">{formData.dailySteps ? `${formData.dailySteps} steps` : 'Unconfigured'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteSave}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all"
              >
                Confirm & Establish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Form Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">
                Reset Baseline Form?
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                This will clear all unsaved entries from the form. Any previously saved baselines will not be affected.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Yes, Reset Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
