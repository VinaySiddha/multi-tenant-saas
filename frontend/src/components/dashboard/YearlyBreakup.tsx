"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[150px] animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-full" />
  ),
});

interface YearlyBreakupProps {
  totalAmount?: number;
  growthPercentage?: number;
  breakdown?: { label: string; value: number; color: string }[];
}

export default function YearlyBreakup({
  totalAmount = 436358,
  growthPercentage = 14.8,
  breakdown = [
    { label: "Dine-In Orders", value: 55, color: "#0F3D2E" },
    { label: "QR Self-Orders", value: 30, color: "#FF6A3D" },
    { label: "Takeaways", value: 15, color: "#71717A" },
  ],
}: YearlyBreakupProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const chartOptions: any = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      foreColor: "#71717A",
      toolbar: { show: false },
      height: 145,
      background: "transparent",
    },
    colors: breakdown.map((b) => b.color),
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "74%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: [isDark ? "#0A291F" : "#FFFFFF"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  const series = breakdown.map((b) => b.value);

  return (
    <DashboardCard title="Channel Breakdown" subtitle="Revenue split by fulfillment mode">
      <div className="grid grid-cols-12 gap-3 items-center">
        <div className="col-span-7 space-y-2.5">
          <div>
            <h4 className="text-xl font-bold tracking-tight text-[#0F3D2E] dark:text-[#FAFAF8] font-mono">
              {formatCurrency(totalAmount)}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#FF6A3D]/10 text-[#FF6A3D] text-xs font-semibold border border-[#FF6A3D]/20">
                <ArrowUpRight className="w-3 h-3" />
              </span>
              <span className="text-xs font-semibold text-[#FF6A3D]">
                +{growthPercentage}%
              </span>
              <span className="text-[11px] text-[#6B7280]">
                vs last term
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 text-[11px] truncate">
                  {item.label}
                </span>
                <span className="ml-auto font-mono text-[11px] font-semibold text-[#0B0B0B] dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 flex justify-center">
          {mounted ? (
            <Chart
              options={chartOptions}
              series={series}
              type="donut"
              height={145}
              width="100%"
            />
          ) : (
            <div className="w-[110px] h-[110px] rounded-full animate-pulse bg-slate-100 dark:bg-[#165742]" />
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
