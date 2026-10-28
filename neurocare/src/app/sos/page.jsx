'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, PhoneCall, AlertTriangle, HeartPulse, UserCheck, CheckCircle2 } from 'lucide-react';

export default function SOSPage() {
  return (
    <div className="space-y-6">
      {/* Urgent Warning Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white border border-rose-800/80 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Emergency Assistance & Acute Safety Protocol
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Experiencing an Acute Emergency?
            </h1>
            <p className="mt-2 text-sm text-rose-200 max-w-2xl leading-relaxed">
              If you or someone nearby is experiencing sudden numbness, weakness in the face or arms, difficulty speaking, severe chest pain, or sudden visual disturbances, immediately call emergency medical services.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="tel:911"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              Call Emergency Services (911 / 112)
            </a>
          </div>
        </div>
      </div>

      {/* Safety Protocol Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAST Stroke Warning Signs */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            FAST Protocol Signs
          </h2>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900">F — Face Drooping:</strong> Does one side of the face droop or is it numb? Ask person to smile.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900">A — Arm Weakness:</strong> Is one arm weak or numb? Ask person to raise both arms.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900">S — Speech Difficulty:</strong> Is speech slurred or difficult to understand?
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900">T — Time to Call 911:</strong> Check time and immediately seek clinical emergency intervention.
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <UserCheck className="w-5 h-5 text-cyan-600" />
              Designated Emergency Contacts
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Your registered emergency contacts who receive automatic notification when SOS is triggered.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Dr. Sarah Jenkins (Primary Physician)</p>
                  <p className="text-[11px] text-slate-500">+1 (555) 234-8901 • City Health Clinic</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700">
                  Verified
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Elena Morgan (Next of Kin / Spouse)</p>
                  <p className="text-[11px] text-slate-500">+1 (555) 789-4321 • Mobile</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => alert("Simulation: SOS dispatched to primary contact and physician.")}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              Simulate Emergency Alert Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
