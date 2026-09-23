"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Package, Clock, CalendarCheck, ShieldAlert } from "lucide-react";
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

const defaultAlerts: AlertItem[] = [
  {
    id: "1",
    type: "INVENTORY",
    severity: "HIGH",
    title: "Low Stock: White Truffle Oil",
    description: "2 units remaining (below 5 units safety buffer). 4 items impacted.",
    timestamp: "8m ago",
    actionUrl: "/inventory",
    actionLabel: "Reorder Stock",
  },
  {
    id: "2",
    type: "KITCHEN",
    severity: "MEDIUM",
    title: "Kitchen Pacing Alert: Table T-03",
    description: "Course 2 preparation duration exceeded 22m benchmark.",
    timestamp: "14m ago",
    actionUrl: "/kds",
    actionLabel: "View KDS",
  },
  {
    id: "3",
    type: "RESERVATION",
    severity: "INFO",
    title: "VIP Party of 8 Arriving in 20m",
    description: "Table T-08 (Mezzanine VIP) prepped with complimentary appetizer set.",
    timestamp: "22m ago",
    actionUrl: "/tables",
    actionLabel: "View Seating",
  },
];

export default function OperationalAlerts({
  alerts = defaultAlerts,
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
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{alerts.length} Active Signals</span>
        </div>
      }
    >
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
    </DashboardCard>
  );
}
