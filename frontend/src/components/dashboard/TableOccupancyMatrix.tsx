"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Grid2X2, ArrowRight, Clock, Users, Utensils, CheckCircle2 } from "lucide-react";
import DashboardCard from "./DashboardCard";

export interface TableItem {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "BILLING" | "RESERVED";
  orderNumber?: string;
  covers?: number;
  duration?: string;
  amount?: number;
}

interface TableOccupancyMatrixProps {
  tables?: TableItem[];
  totalOccupied?: number;
  totalTables?: number;
}

const defaultTables: TableItem[] = [
  { id: "1", name: "T-01", zone: "Ground Main", capacity: 4, status: "OCCUPIED", orderNumber: "#ORD-1048", covers: 3, duration: "38m", amount: 2450 },
  { id: "2", name: "T-02", zone: "Ground Main", capacity: 2, status: "BILLING", orderNumber: "#ORD-1045", covers: 2, duration: "52m", amount: 1890 },
  { id: "3", name: "T-03", zone: "Ground Main", capacity: 6, status: "OCCUPIED", orderNumber: "#ORD-1046", covers: 5, duration: "24m", amount: 4320 },
  { id: "4", name: "T-04", zone: "Ground Main", capacity: 4, status: "AVAILABLE" },
  { id: "5", name: "T-05", zone: "Patio Terrace", capacity: 2, status: "RESERVED", duration: "Starts 8:00 PM" },
  { id: "6", name: "T-06", zone: "Patio Terrace", capacity: 4, status: "OCCUPIED", orderNumber: "#ORD-1047", covers: 4, duration: "16m", amount: 3100 },
  { id: "7", name: "T-07", zone: "Patio Terrace", capacity: 4, status: "AVAILABLE" },
  { id: "8", name: "T-08", zone: "Mezzanine VIP", capacity: 8, status: "OCCUPIED", orderNumber: "#ORD-1044", covers: 7, duration: "1h 10m", amount: 8900 },
];

export default function TableOccupancyMatrix({
  tables = defaultTables,
  totalOccupied = 4,
  totalTables = 8,
}: TableOccupancyMatrixProps) {
  const [selectedZone, setSelectedZone] = useState<string>("ALL");

  const zones = ["ALL", "Ground Main", "Patio Terrace", "Mezzanine VIP"];

  const filteredTables = selectedZone === "ALL" 
    ? tables 
    : tables.filter(t => t.zone === selectedZone);

  const getStatusBadge = (status: TableItem["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return {
          bg: "bg-white dark:bg-[#0A291F]",
          border: "border-[#E5E7EB] dark:border-[#165742]",
          text: "text-[#6B7280] dark:text-[#E5E7EB]/70",
          indicator: "bg-emerald-500",
          label: "Available",
        };
      case "OCCUPIED":
        return {
          bg: "bg-[#0F3D2E] text-white",
          border: "border-[#165742]",
          text: "text-white",
          indicator: "bg-[#FF6A3D]",
          label: "Occupied",
        };
      case "BILLING":
        return {
          bg: "bg-[#FF6A3D]/10 dark:bg-[#FF6A3D]/20",
          border: "border-[#FF6A3D]/30",
          text: "text-[#FF6A3D] font-bold",
          indicator: "bg-[#FF6A3D] animate-pulse",
          label: "Billing",
        };
      case "RESERVED":
        return {
          bg: "bg-[#FAFAF8] dark:bg-[#0A291F]/90",
          border: "border-[#E5E7EB] dark:border-[#165742]",
          text: "text-[#0F3D2E] dark:text-[#E5E7EB]",
          indicator: "bg-[#0F3D2E] dark:bg-emerald-400",
          label: "Reserved",
        };
    }
  };

  return (
    <DashboardCard
      title="Table Floor Matrix & Occupancy"
      subtitle={`${totalOccupied} of ${totalTables} active tables occupied • 75% floor capacity`}
      action={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FAFAF8] dark:bg-[#0A291F] p-1 rounded-lg border border-[#E5E7EB] dark:border-[#165742]">
            {zones.map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setSelectedZone(z)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                  selectedZone === z
                    ? "bg-[#FF6A3D] text-white font-semibold shadow-xs"
                    : "text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 hover:text-[#0B0B0B]"
                }`}
              >
                {z === "ALL" ? "All Zones" : z}
              </button>
            ))}
          </div>
          <Link
            href="/tables"
            className="text-xs font-semibold text-[#0F3D2E] dark:text-[#E5E7EB] hover:text-[#FF6A3D] flex items-center gap-1 transition ml-2"
          >
            <span>Floorplan</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredTables.map((table) => {
          const style = getStatusBadge(table.status);
          const isOccupiedTheme = table.status === "OCCUPIED";

          return (
            <div
              key={table.id}
              className={`p-3.5 rounded-lg border transition-all ${style.bg} ${style.border} flex flex-col justify-between group hover:border-[#FF6A3D]/40`}
            >
              {/* Header: Name & Status Dot */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0 inline-block">
                    <span className={`w-2 h-2 rounded-full block ${style.indicator}`} />
                  </span>
                  <span className={`font-mono font-bold text-xs ${isOccupiedTheme ? "text-white" : "text-[#0F3D2E] dark:text-[#FAFAF8]"}`}>
                    {table.name}
                  </span>
                </div>
                <span className={`text-[10px] font-mono flex items-center gap-0.5 ${isOccupiedTheme ? "text-white/80" : "text-[#6B7280] dark:text-[#E5E7EB]/60"}`}>
                  <Users className="w-3 h-3" />
                  <span>{table.capacity}p</span>
                </span>
              </div>

              {/* Body: Order Info or Empty */}
              <div className="space-y-1 my-1">
                {table.status === "AVAILABLE" ? (
                  <span className="text-[11px] text-[#6B7280] italic block">
                    Ready for seating
                  </span>
                ) : table.status === "RESERVED" ? (
                  <div>
                    <span className="text-[11px] font-medium text-[#0F3D2E] dark:text-[#FAFAF8] block">
                      {table.duration}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">Party of {table.capacity}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-mono font-medium ${isOccupiedTheme ? "text-white" : "text-[#0F3D2E] dark:text-[#FAFAF8]"}`}>{table.orderNumber}</span>
                      <span className={`text-[10px] font-mono flex items-center gap-0.5 ${isOccupiedTheme ? "text-white/80" : "text-[#6B7280]"}`}>
                        <Clock className="w-2.5 h-2.5" />
                        {table.duration}
                      </span>
                    </div>
                    {table.amount && (
                      <span className={`text-[10px] font-mono ${isOccupiedTheme ? "text-[#FAFAF8]/90" : "text-[#0B0B0B]/80 dark:text-[#E5E7EB]/80"}`}>
                        Running total: ₹{table.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer: Zone and Status Tag */}
              <div className={`pt-2 mt-2 border-t ${isOccupiedTheme ? "border-white/20" : "border-[#E5E7EB] dark:border-[#165742]/40"} flex items-center justify-between text-[10px]`}>
                <span className={`truncate max-w-[80px] ${isOccupiedTheme ? "text-white/70" : "text-[#6B7280] dark:text-[#E5E7EB]/60"}`}>
                  {table.zone}
                </span>
                <span className={`font-medium ${style.text}`}>
                  {style.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
