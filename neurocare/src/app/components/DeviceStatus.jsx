'use client';

import React from 'react';
import Link from 'next/link';
import {
  Watch,
  CircleDot,
  BatteryCharging,
  BatteryMedium,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Bluetooth,
  Wifi,
} from 'lucide-react';

export default function DeviceStatus({ devices, isDemoMode = true }) {
  const hasDevices = Boolean(devices && devices.length > 0);

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Connected Devices
            </h3>
            {isDemoMode && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                Demo
              </span>
            )}
          </div>
          <Link
            href="/devices"
            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>Manage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Devices list */}
        {hasDevices ? (
          <div className="space-y-3">
            {devices.map((device) => {
              const isConnected = device.status === 'Connected';
              return (
                <div
                  key={device.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100/60 text-cyan-800 flex items-center justify-center">
                        <Watch className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {device.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {device.connectionType}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isConnected
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isConnected ? 'bg-teal-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        {device.status}
                      </span>
                    </div>
                  </div>

                  {/* Metadata: sync time and battery */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Sync: {device.lastSync}
                    </span>

                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <BatteryMedium className="w-3.5 h-3.5 text-teal-600" />
                      {device.batteryLevel}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500">
            <Bluetooth className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No devices connected</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Pair your smartwatch, smart ring, or EEG headband to begin continuous monitoring.
            </p>
          </div>
        )}
      </div>

      {/* Action to connect new device */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href="/devices"
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Connect Device
        </Link>
      </div>
    </div>
  );
}
