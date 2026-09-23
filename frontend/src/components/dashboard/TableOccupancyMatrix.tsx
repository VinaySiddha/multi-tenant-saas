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

export default function TableOccupancyMatrix({
  tables = [],
  totalOccupied = 0,
  totalTables = 0,
}: TableOccupancyMatrixProps) {
  const [selectedZone, setSelectedZone] = useState<string>("ALL");

  const computedTotalOccupied = totalOccupied || tables.filter(t => t.status === "OCCUPIED" || t.status === "BILLING").length;
  const computedTotalTables = totalTables || tables.length;
  const occupancyPercent = computedTotalTables > 0 
    ? Math.round((computedTotalOccupied / computedTotalTables) * 100) 
    : 0;

  const dynamicZones = ["ALL", ...Array.from(new Set(tables.map(t => t.zone).filter(Boolean)))];
  const zones = dynamicZones.length > 1 ? dynamicZones : ["ALL", "Ground Main", "Patio Terrace", "Mezzanine VIP"];

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
      subtitle={`${computedTotalOccupied} of ${computedTotalTables} active tables occupied • ${occupancyPercent}% floor capacity`}
      action={
        <div className="flex items-center gap-2">
          {zones.length > 1 && tables.length > 0 && (
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
          )}
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
      {filteredTables.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-[#E5E7EB] dark:border-[#165742] rounded-xl flex flex-col items-center justify-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#FAFAF8] dark:bg-[#165742]/40 border border-[#E5E7EB] dark:border-[#165742] flex items-center justify-center text-[#6B7280]">
            <Grid2X2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-[#0B0B0B] dark:text-[#FAFAF8]">No dining tables configured</p>
          <p className="text-[11px] text-[#6B7280]">Add tables and floor sections in the Floorplan manager to monitor live occupancy.</p>
        </div>
      ) : (
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
      )}
    </DashboardCard>
  );
}
