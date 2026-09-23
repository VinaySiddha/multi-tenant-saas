"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface YearlyBreakupProps {
  totalAmount?: number;
  growthPercentage?: number;
  breakdown?: { label: string; value: number; color: string }[];
}

export default function YearlyBreakup({
  totalAmount = 436358,
  growthPercentage = 14.8,
  breakdown = [
    { label: "Dine-In Orders", value: 55, color: "#5D87FF" },
    { label: "QR Self-Orders", value: 30, color: "#13DEB9" },
    { label: "Takeaways", value: 15, color: "#FFAE1F" },
  ],
}: YearlyBreakupProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartOptions: any = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      foreColor: isDark ? "#94a3b8" : "#64748b",
      toolbar: { show: false },
      height: 155,
      background: "transparent",
    },
    colors: breakdown.map((b) => b.color),
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "72%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
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
    <DashboardCard title="Annual Revenue Breakup" subtitle="Channel distribution">
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-7 space-y-3">
          <div>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalAmount)}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-emerald-500">
                +{growthPercentage}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                vs last term
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {item.label}
                </span>
                <span className="ml-auto font-bold text-slate-900 dark:text-slate-200">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 flex justify-center">
          {typeof window !== "undefined" && (
            <Chart
              options={chartOptions}
              series={series}
              type="donut"
              height={150}
              width="100%"
            />
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
