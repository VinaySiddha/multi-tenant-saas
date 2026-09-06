"use client";

import React, { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Utensils, 
  CheckCircle2, 
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminDashboardPage() {
  const { tenant, branch } = useAuthStore();
  const [summary, setSummary] = useState<any>({
    todayRevenue: 48250,
    todayOrdersCount: 128,
    occupiedTablesCount: 14,
    totalTablesCount: 20,
    tableOccupancyRate: 70.0,
    avgPrepTimeMinutes: 14.5
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/analytics/summary");
      if (res.data?.data) {
        setSummary(res.data.data);
      }
    } catch {
      // Keep demo values
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: "Today's Revenue", 
      value: formatCurrency(Number(summary.todayRevenue || 0)), 
      change: "+14.2% vs y'day", 
      icon: DollarSign, 
      color: "text-emerald-500" 
    },
    { 
      title: "Orders Placed", 
      value: String(summary.todayOrdersCount || 0), 
      change: "Active: " + (summary.activeOrdersCount || 3), 
      icon: ShoppingBag, 
      color: "text-indigo-500" 
    },
    { 
      title: "Table Occupancy", 
      value: `${summary.occupiedTablesCount || 0} / ${summary.totalTablesCount || 4}`, 
      change: `${summary.tableOccupancyRate || 0}% Occ.`, 
      icon: Utensils, 
      color: "text-amber-500" 
    },
    { 
      title: "Avg. Prep Time", 
      value: `${summary.avgPrepTimeMinutes || 14.5} mins`, 
      change: "Kitchen Target: 15m", 
      icon: Clock, 
      color: "text-blue-500" 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Restaurant Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {tenant?.name || "The Royal Bistro"} • {branch?.name || "Indiranagar Flagship"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Live Engine Active
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Live Quick Actions
            </h3>
            <span className="text-xs text-indigo-600 font-semibold">POS & Kitchen Link</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="/pos/terminal"
              className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 transition block text-left"
            >
              <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300">Open POS Terminal</h4>
              <p className="text-[11px] text-slate-500 mt-1">Take dine-in & takeaway orders with split bills</p>
            </a>
            <a
              href="/kitchen/kds"
              className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:border-rose-500 transition block text-left"
            >
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300">Kitchen Display (KDS)</h4>
              <p className="text-[11px] text-slate-500 mt-1">Manage food preparation and live KOT timers</p>
            </a>
            <a
              href="/qr/menu/5da85f64-5717-4562-b3fc-2c963f66afb5"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 transition block text-left"
            >
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300">QR Self-Order Demo</h4>
              <p className="text-[11px] text-slate-500 mt-1">Simulate customer phone menu scan & ordering</p>
            </a>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
              Multi-Tenancy Guard
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every query and transaction is isolated by <code className="text-indigo-600 font-mono">tenant_id</code> and <code className="text-indigo-600 font-mono">branch_id</code>.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p>Tenant: <span className="font-semibold text-slate-700 dark:text-slate-300">{tenant?.id || "3fa85f64-5717-4562-b3fc-2c963f66afa6"}</span></p>
            <p>Branch: <span className="font-semibold text-slate-700 dark:text-slate-300">{branch?.code || "IND-01"}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
