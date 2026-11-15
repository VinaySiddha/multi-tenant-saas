"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[65px] animate-pulse bg-slate-100 dark:bg-slate-800/50" />
  ),
});

interface MonthlyEarningsProps {
  amount?: number;
  growthPercentage?: number;
  sparklineData?: number[];
}

export default function MonthlyEarnings({
  amount = 0,
  growthPercentage = 0,
  sparklineData,
}: MonthlyEarningsProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dynamicSparkline = sparklineData && sparklineData.length > 0
    ? sparklineData
    : [0, 0, 0, 0, 0, 0, 0, 0];

  const isDark = resolvedTheme === "dark";

  const chartOptions: any = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      foreColor: "#71717A",
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: "sparklines",
      background: "transparent",
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#FF6A3D"],
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
            color: "#FF6A3D",
            opacity: 0.4,
          },
          {
            offset: 100,
            color: "#FF6A3D",
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
        formatter: (val: number) => formatCurrency(val),
      },
    },
  };

  const series = [
    {
      name: "Daily Revenue Trend",
      data: dynamicSparkline,
    },
  ];

  return (
    <DashboardCard
      title="Monthly Run-Rate"
      subtitle="Net projected restaurant receipts"
      action={
        <div className="w-8 h-8 rounded-lg bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-[#FF6A3D]" />
        </div>
      }
      footer={
        <div className="-mx-5 sm:-mx-6 -my-3 h-[60px] overflow-hidden">
          {mounted ? (
            <Chart
              options={chartOptions}
              series={series}
              type="area"
              height={60}
              width="100%"
            />
          ) : (
            <div className="w-full h-[60px] animate-pulse bg-slate-100 dark:bg-[#165742]" />
          )}
        </div>
      }
    >
      <div className="space-y-1">
        <h4 className="text-xl font-bold tracking-tight text-[#0F3D2E] dark:text-[#FAFAF8] font-mono">
          {formatCurrency(amount)}
        </h4>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#FF6A3D]/10 text-[#FF6A3D] text-xs font-semibold border border-[#FF6A3D]/20">
            <ArrowUpRight className="w-3 h-3" />
          </span>
          <span className="text-xs font-semibold text-[#FF6A3D]">
            +{growthPercentage}%
          </span>
          <span className="text-[11px] text-[#6B7280]">
            vs prior month
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}
