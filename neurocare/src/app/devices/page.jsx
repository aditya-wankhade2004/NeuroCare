'use client';

import React from 'react';
import Link from 'next/link';
import { Watch, ArrowLeft, Plus, RefreshCw, CheckCircle2, Bluetooth, Wifi, BatteryMedium } from 'lucide-react';
import { MOCK_DEVICES } from '@/lib/mockData';

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Device Connections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage wearable sensors, medical-grade telemetry feeds, and Bluetooth peripherals.
          </p>
        </div>

        <button
          onClick={() => alert("Searching for nearby Bluetooth Smart sensors and HealthKit integrations...")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Pair New Device
        </button>
      </div>

      {/* Devices List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MOCK_DEVICES.map((dev) => (
          <div
            key={dev.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <Watch className="w-5 h-5" />
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    dev.status === 'Connected'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {dev.status}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900">{dev.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{dev.category} • {dev.connectionType}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Synced:</span>
                  <span className="font-medium text-slate-700">{dev.lastSync}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Battery Level:</span>
                  <span className="font-semibold text-teal-700 flex items-center gap-1">
                    <BatteryMedium className="w-3.5 h-3.5" />
                    {dev.batteryLevel}%
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1">Active Sensor Feeds:</span>
                  <div className="flex flex-wrap gap-1">
                    {dev.sensors.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => alert(`Synchronizing telemetry feed for ${dev.name}...`)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync Telemetry
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
