"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Trash2, CheckCircle2, Receipt, Utensils, Clock, Flame } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import Link from "next/link";

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/80"
        title="Live Order & Kitchen Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-slate-900 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white">Live System Alerts</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Read All
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-[11px] text-slate-500 hover:text-rose-400 p-1 rounded"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-40" />
                <span>No live alerts yet. New orders and kitchen updates will appear here in real time.</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 hover:bg-slate-800/60 transition cursor-pointer flex items-start gap-3 ${
                    !notif.read ? "bg-slate-850/70" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      notif.type === "ORDER_READY"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : notif.type === "PAYMENT_COMPLETED"
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {notif.type === "ORDER_READY" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : notif.type === "PAYMENT_COMPLETED" ? (
                      <Receipt className="w-4 h-4" />
                    ) : (
                      <Utensils className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-white truncate">
                        {notif.title}
                      </h5>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.type === "ORDER_READY" && (
                      <div className="mt-2">
                        <Link
                          href="/orders"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 underline"
                        >
                          Settle Bill &amp; Print &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
