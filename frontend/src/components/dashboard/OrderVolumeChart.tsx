"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import DashboardCard from "./DashboardCard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] animate-pulse bg-slate-100 dark:bg-[#165742] rounded-lg" />
  ),
});

interface OrderVolumeChartProps {
  categories?: string[];
  dineInData?: number[];
  takeawayData?: number[];
  qrSelfOrderData?: number[];
}

export default function OrderVolumeChart({
  categories,
  dineInData,
  takeawayData,
  qrSelfOrderData,
}: OrderVolumeChartProps) {
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState("TODAY");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultCategories = ["11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM"];
  const dynamicCategories = categories && categories.length > 0 ? categories : defaultCategories;
  const dynamicDineInData = dineInData && dineInData.length > 0 ? dineInData : new Array(dynamicCategories.length).fill(0);
  const dynamicTakeawayData = takeawayData && takeawayData.length > 0 ? takeawayData : new Array(dynamicCategories.length).fill(0);
  const dynamicQrData = qrSelfOrderData && qrSelfOrderData.length > 0 ? qrSelfOrderData : new Array(dynamicCategories.length).fill(0);

  const isDark = resolvedTheme === "dark";

  const options: any = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      foreColor: "#71717A",
      toolbar: { show: false },
      height: 320,
      background: "transparent",
      stacked: true,
    },
    colors: ["#0F3D2E", "#FF6A3D", "#6B7280"],
    stroke: {
      curve: "smooth",
      width: 1.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0.05,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: isDark ? "#E5E7EB" : "#0B0B0B",
      },
      markers: {
        radius: 2,
      },
    },
    grid: {
      borderColor: isDark ? "#165742" : "#E5E7EB",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val: number) => `${Math.round(val)} orders`,
        style: {
          colors: isDark ? "#E5E7EB" : "#6B7280",
          fontSize: "11px",
        },
      },
    },
    xaxis: {
      categories: dynamicCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? "#E5E7EB" : "#6B7280",
          fontSize: "11px",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      style: { fontSize: "12px" },
      y: {
        formatter: (val: number) => `${val} tickets`,
      },
    },
  };

  const series = [
    {
      name: "Dine-In Orders",
      data: dynamicDineInData,
    },
    {
      name: "QR Self-Orders",
      data: dynamicQrData,
    },
    {
      name: "Takeaway & Delivery",
      data: dynamicTakeawayData,
    },
  ];

  return (
    <DashboardCard
      title="Hourly Order Volume Flow"
      subtitle="Kitchen load and ticket distribution across service hours"
      action={
        <div className="flex items-center gap-1 bg-white dark:bg-[#0A291F] p-1 rounded-lg border border-[#E5E7EB] dark:border-[#165742]">
          {["TODAY", "YESTERDAY", "WEEK_AVG"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                timeframe === t
                  ? "bg-[#FF6A3D] text-white font-semibold"
                  : "text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 hover:text-[#0B0B0B]"
              }`}
            >
              {t === "TODAY" ? "Today" : t === "YESTERDAY" ? "Yesterday" : "7D Avg"}
            </button>
          ))}
        </div>
      }
    >
      <div className="w-full h-[320px]">
        {mounted ? (
          <Chart options={options} series={series} type="area" height={320} width="100%" />
        ) : (
          <div className="w-full h-[320px] animate-pulse bg-slate-100 dark:bg-[#165742] rounded-lg" />
        )}
      </div>
    </DashboardCard>
  );
}
