"use client";

import React from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  Utensils, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Today's Revenue", value: formatCurrency(48250), change: "+14.2%", icon: DollarSign, color: "text-emerald-500" },
    { title: "Orders Placed", value: "128", change: "+8.4%", icon: ShoppingBag, color: "text-indigo-500" },
    { title: "Active Tables", value: "14 / 20", change: "70% Occ.", icon: Utensils, color: "text-amber-500" },
    { title: "Avg. Prep Time", value: "14 mins", change: "-2.1 min", icon: Clock, color: "text-blue-500" },
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
            Real-time live multi-branch metrics & operational status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Live WebSocket Connected
          </span>
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
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Overview Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl text-white shadow-lg">
        <h2 className="text-lg font-bold mb-2">Module 1: Architecture & Foundations Active</h2>
        <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed mb-4">
          All multi-tenant thread safety, database abstraction, Spring Data JPA base entities,
          REST controllers, unified validation handlers, and Next.js 15 route groups are loaded.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>UUID Primary Keys</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>TenantContext Isolation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>WebSocket Broker Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
