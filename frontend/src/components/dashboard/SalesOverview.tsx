"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import DashboardCard from "./DashboardCard";

// Dynamic import for ApexCharts to disable SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SalesOverviewProps {
  categories?: string[];
  salesData?: number[];
  expenseData?: number[];
  currencySymbol?: string;
}

export default function SalesOverview({
  categories = ["16/09", "17/09", "18/09", "19/09", "20/09", "21/09", "22/09", "23/09"],
  salesData = [14200, 18500, 13800, 22400, 28900, 34500, 31200, 29800],
  expenseData = [8500, 9200, 7800, 11000, 14500, 16800, 15200, 14100],
  currencySymbol = "₹",
}: SalesOverviewProps) {
  const [period, setPeriod] = useState("THIS_WEEK");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Modernize brand palette colors
  const primaryColor = "#5D87FF"; // Modernize primary blue
  const secondaryColor = "#49BEFF"; // Modernize sky blue

  const options: any = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      foreColor: isDark ? "#94a3b8" : "#64748b",
      toolbar: {
        show: false,
      },
      height: 350,
      background: "transparent",
    },
    colors: [primaryColor, secondaryColor],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: isDark ? "#cbd5e1" : "#475569",
      },
    },
    grid: {
      borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val: number) => `${currencySymbol}${val.toLocaleString()}`,
        style: {
          colors: isDark ? "#94a3b8" : "#64748b",
        },
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: isDark ? "#94a3b8" : "#64748b",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `${currencySymbol}${val.toLocaleString()}`,
      },
    },
  };

  const series = [
    {
      name: "Gross Sales Revenue",
      data: salesData,
    },
    {
      name: "Net Operating Margin",
      data: expenseData,
    },
  ];

  return (
    <DashboardCard
      title="Sales & Revenue Overview"
      subtitle="Comparative trajectory of daily dining and digital takeouts"
      action={
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5D87FF]"
        >
          <option value="THIS_WEEK">Past 7 Days</option>
          <option value="THIS_MONTH">Current Month</option>
          <option value="LAST_MONTH">Last Quarter</option>
        </select>
      }
    >
      <div className="w-full h-[350px]">
        {typeof window !== "undefined" && (
          <Chart options={options} series={series} type="bar" height={350} width="100%" />
        )}
      </div>
    </DashboardCard>
  );
}
