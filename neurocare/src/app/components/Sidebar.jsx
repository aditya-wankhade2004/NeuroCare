'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Brain,
  Cpu,
  Watch,
  FileText,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Radio,
  ShieldCheck,
} from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Health Baseline', href: '/baseline', icon: Activity },
  { name: 'Cognitive Assessments', href: '/assessments', icon: Brain },
  { name: 'NeuroTwin', href: '/neurotwin', icon: Cpu },
  { name: 'Device Connections', href: '/devices', icon: Watch },
  { name: 'Health Reports', href: '/reports', icon: FileText },
  { name: 'SOS Emergency', href: '/sos', icon: ShieldAlert, highlight: 'danger' },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();

  const isLinkActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0A1128] text-slate-200 border-r border-slate-800/80 transition-all duration-300 ease-in-out
          ${/* Mobile drawer positioning */ ''}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${/* Desktop width collapse */ ''}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-72 shadow-2xl lg:shadow-none
        `}
      >
        {/* Brand / Logo Section */}
        <div className="flex items-center justify-between h-18 px-4 border-b border-slate-800/80 bg-[#070D1F]/50">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group overflow-hidden"
          >
            {/* High-tech pulsing logo icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white shadow-lg shadow-cyan-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
              </span>
            </div>

            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    NeuroSense
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    2.0
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  Cognitive Wellness
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar navigation"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const active = isLinkActive(item.href);
            const Icon = item.icon;
            const isDanger = item.highlight === 'danger';

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all group
                  ${
                    active
                      ? isDanger
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                      : isDanger
                      ? 'text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                {/* Active left indicator bar */}
                {active && !isCollapsed && (
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                      isDanger ? 'bg-rose-500' : 'bg-cyan-400'
                    }`}
                  />
                )}

                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    active
                      ? isDanger
                        ? 'text-rose-400'
                        : 'text-cyan-400'
                      : isDanger
                      ? 'text-rose-400'
                      : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />

                {(!isCollapsed || mobileOpen) && (
                  <span className="truncate flex-1">{item.name}</span>
                )}

                {/* Subtle ping indicator on SOS */}
                {isDanger && (!isCollapsed || mobileOpen) && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Safety & Device Status Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070D1F]/60">
          {(!isCollapsed || mobileOpen) ? (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
                  <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  Telemetry Link
                </span>
                <span className="text-[10px] text-teal-400 font-mono bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/50">
                  Online
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Continuous cognitive and physiological stream active.
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  RLS Encrypted
                </span>
                <span className="text-slate-400 font-mono">v2.4.0</span>
              </div>
            </div>
          ) : (
            <div
              className="flex justify-center p-2 rounded-lg text-teal-400 hover:bg-slate-800/60"
              title="Telemetry Link Online • Encrypted"
            >
              <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
