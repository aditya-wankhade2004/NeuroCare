'use client';

import React from 'react';
import { Bell, Check, Clock, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export default function NotificationDropdown({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover */}
      <div
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        role="dialog"
        aria-label="Notifications menu"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-800 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Check className="w-3 h-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm">All caught up! No notifications.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 hover:bg-slate-50/80 transition-colors ${
                  !item.read ? 'bg-cyan-50/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    ) : item.type === 'action' ? (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
          <span className="text-[11px] text-slate-500">
            Encrypted Health Feed • NeuroSense Cloud
          </span>
        </div>
      </div>
    </>
  );
}
