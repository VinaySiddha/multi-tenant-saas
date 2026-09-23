"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { ArrowUpRight, DollarSign, TrendingUp } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyEarningsProps {
  amount?: number;
  growthPercentage?: number;
  sparklineData?: number[];
}

export default function MonthlyEarnings({
  amount = 86820,
  growthPercentage = 12.4,
  sparklineData = [25, 66, 41, 78, 52, 88, 70, 95],
}: MonthlyEarningsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const secondaryColor = "#49BEFF";

  const chartOptions: any = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      foreColor: isDark ? "#94a3b8" : "#64748b",
      toolbar: { show: false },
      height: 65,
      sparkline: { enabled: true },
      group: "sparklines",
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
      colors: [secondaryColor],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: secondaryColor,
            opacity: 0.4,
          },
          {
            offset: 100,
            color: secondaryColor,
            opacity: 0.0,
          },
        ],
      },
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      x: { show: false },
      y: {
        formatter: (val: number) => `₹${val * 1000}`,
      },
    },
  };

  const series = [
    {
      name: "Daily Revenue Trend",
      data: sparklineData,
    },
  ];

  return (
    <DashboardCard
      title="Monthly Operating Earnings"
      subtitle="Net restaurant receipts"
      action={
        <div className="w-10 h-10 rounded-2xl bg-[#49BEFF]/15 text-[#49BEFF] flex items-center justify-center shadow-inner">
          <TrendingUp className="w-5 h-5" />
        </div>
      }
      footer={
        <div className="-mx-6 -my-3 h-[65px] overflow-hidden">
          {typeof window !== "undefined" && (
            <Chart
              options={chartOptions}
              series={series}
              type="area"
              height={65}
              width="100%"
            />
          )}
        </div>
      }
    >
      <div className="space-y-1">
        <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {formatCurrency(amount)}
        </h4>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
            <ArrowUpRight className="w-3 h-3" />
          </span>
          <span className="text-xs font-bold text-emerald-500">
            +{growthPercentage}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            vs prior month
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
