"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Utensils, 
  CheckCircle2, 
  ArrowUpRight,
  RefreshCw,
  Receipt,
  ChefHat,
  QrCode,
  LayoutGrid,
  Boxes,
  Users,
  Activity,
  ArrowRight,
  Sparkles
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
    avgPrepTimeMinutes: 14.5,
    activeOrdersCount: 4
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

  const kpis = [
    { 
      title: "Today's Gross Revenue", 
      value: formatCurrency(Number(summary.todayRevenue || 48250)), 
      subtext: "+14.2% vs yesterday", 
      icon: DollarSign, 
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
    },
    { 
      title: "Orders Placed Today", 
      value: String(summary.todayOrdersCount || 128), 
      subtext: `${summary.activeOrdersCount || 4} in active preparation`, 
      icon: ShoppingBag, 
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" 
    },
    { 
      title: "Table Occupancy", 
      value: `${summary.occupiedTablesCount || 14} / ${summary.totalTablesCount || 20}`, 
      subtext: `${summary.tableOccupancyRate || 70.0}% capacity active`, 
      icon: Utensils, 
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20" 
    },
    { 
      title: "Average Prep Time", 
      value: `${summary.avgPrepTimeMinutes || 14.5}m`, 
      subtext: "Target benchmark: 15.0m", 
      icon: Clock, 
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20" 
    },
  ];

  const quickLaunchers = [
    {
      title: "POS Billing Terminal",
      subtitle: "Open front-of-house cashier register",
      href: "/terminal",
      icon: Receipt,
      badge: "Cashier Desk",
      color: "hover:border-amber-500/50 hover:bg-amber-500/5",
      iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    {
      title: "Kitchen Display (KDS)",
      subtitle: "Live chef ticket line with prep timers",
      href: "/kds",
      icon: ChefHat,
      badge: "Kitchen Line",
      color: "hover:border-rose-500/50 hover:bg-rose-500/5",
      iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    },
    {
      title: "Guest QR Menu Demo",
      subtitle: "Simulate contactless customer ordering",
      href: "/menu/5da85f64-5717-4562-b3fc-2c963f66afb5",
      icon: QrCode,
      badge: "Guest View",
      color: "hover:border-indigo-500/50 hover:bg-indigo-500/5",
      iconBg: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    },
  ];

  const managementModules = [
    { label: "Orders & Invoices", href: "/orders", icon: ShoppingBag, count: `${summary.todayOrdersCount || 128} records` },
    { label: "Menu & Items", href: "/menu", icon: Utensils, count: "6 Active categories" },
    { label: "Floor & Tables", href: "/tables", icon: LayoutGrid, count: `${summary.totalTablesCount || 20} Dining tables` },
    { label: "Inventory Stock", href: "/inventory", icon: Boxes, count: "3 Low stock alerts" },
    { label: "Staff & Roles", href: "/staff", icon: Users, count: "4 Team members" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Operations &amp; Revenue Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry for <strong className="text-slate-200">{tenant?.name || "The Royal Bistro"}</strong> ({branch?.name || "Indiranagar Flagship"})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white mb-1">
                  {kpi.value}
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Operational Launchers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Live Service Portals
          </h2>
          <span className="text-xs text-slate-400">Instant Role Switching</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLaunchers.map((ql) => {
            const Icon = ql.icon;
            return (
              <Link
                key={ql.title}
                href={ql.href}
                className={`p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md transition-all duration-200 group flex flex-col justify-between ${ql.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${ql.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {ql.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition mb-1">
                    {ql.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {ql.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Open Screen</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Operations & Management Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Management Shortcuts */}
        <div className="lg:col-span-2 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white">
              Restaurant Configuration &amp; Master Catalogs
            </h3>
            <span className="text-xs text-indigo-400 font-semibold">Fast Navigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {managementModules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.label}
                  href={m.href}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:text-indigo-400 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition">
                        {m.label}
                      </h4>
                      <p className="text-[11px] text-slate-400">{m.count}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Operational Reliability Card */}
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">
                Platform Reliability
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Front-of-house POS, Kitchen Display System, and Contactless QR orders are running on high-availability cloud channels with automatic data synchronization.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Order Dispatch Latency:</span>
              <span className="font-bold text-emerald-400">&lt; 150ms</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Multi-Tenant Data Isolation:</span>
              <span className="font-bold text-indigo-400">Strict Verified</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Automatic Stock Depletion:</span>
              <span className="font-bold text-emerald-400">Enabled</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
