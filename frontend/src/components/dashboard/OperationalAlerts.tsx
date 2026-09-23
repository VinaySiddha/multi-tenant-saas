"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Package, Clock, CalendarCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import DashboardCard from "./DashboardCard";

export interface AlertItem {
  id: string;
  type: "INVENTORY" | "KITCHEN" | "RESERVATION";
  severity: "HIGH" | "MEDIUM" | "INFO";
  title: string;
  description: string;
  timestamp: string;
  actionUrl: string;
  actionLabel: string;
}

interface OperationalAlertsProps {
  alerts?: AlertItem[];
}

export default function OperationalAlerts({
  alerts = [],
}: OperationalAlertsProps) {
  const getSeverityStyle = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "HIGH":
        return {
          badge: "bg-[#FF6A3D]/10 text-[#FF6A3D] border-[#FF6A3D]/30",
          dot: "bg-[#FF6A3D]",
        };
      case "MEDIUM":
        return {
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          dot: "bg-amber-500",
        };
      case "INFO":
      default:
        return {
          badge: "bg-[#0F3D2E]/10 text-[#0F3D2E] dark:text-emerald-400 border-[#0F3D2E]/20 dark:border-emerald-500/30",
          dot: "bg-[#0F3D2E] dark:bg-emerald-400",
        };
    }
  };

  const getAlertIcon = (type: AlertItem["type"]) => {
    switch (type) {
      case "INVENTORY":
        return Package;
      case "KITCHEN":
        return Clock;
      case "RESERVATION":
        return CalendarCheck;
      default:
        return AlertCircle;
    }
  };

  return (
    <DashboardCard
      title="Operational Alerts"
      subtitle="Real-time kitchen pacing, inventory thresholds & floor notices"
      action={
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742] text-[11px] font-mono text-[#0B0B0B]/80 dark:text-[#E5E7EB]">
          <span className={`w-1.5 h-1.5 rounded-full ${alerts.length > 0 ? "bg-[#FF6A3D] animate-pulse" : "bg-emerald-500"}`} />
          <span>{alerts.length} Active Signals</span>
        </div>
      }
    >
      {alerts.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-[#E5E7EB] dark:border-[#165742] rounded-xl flex flex-col items-center justify-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-[#0F3D2E] dark:text-[#FAFAF8]">All Systems Operational</p>
          <p className="text-[11px] text-[#6B7280] max-w-xs">No active inventory deficits, kitchen pacing warnings, or urgent table notices.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            const Icon = getAlertIcon(alert.type);

            return (
              <div
                key={alert.id}
                className="p-3.5 rounded-lg bg-[#FAFAF8] dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742] hover:border-[#FF6A3D]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-white dark:bg-[#165742] border border-[#E5E7EB] dark:border-[#165742] flex items-center justify-center text-[#FF6A3D] shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#0F3D2E] dark:text-[#FAFAF8]">
                        {alert.title}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold border ${style.badge}`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-[#6B7280] font-mono">
                        • {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex sm:justify-end">
                  <Link
                    href={alert.actionUrl}
                    className="px-2.5 py-1 rounded bg-white dark:bg-[#165742] hover:bg-[#FAFAF8] text-[#0F3D2E] dark:text-white border border-[#E5E7EB] dark:border-[#165742] hover:border-[#FF6A3D] text-[11px] font-medium flex items-center gap-1 transition shadow-xs"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 text-[#FF6A3D] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
