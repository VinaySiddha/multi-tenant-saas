"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import DashboardCard from "./DashboardCard";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
  ),
});

interface SalesOverviewProps {
  categories?: string[];
  salesData?: number[];
  expenseData?: number[];
  currencySymbol?: string;
}

export default function SalesOverview({
  categories,
  salesData,
  expenseData,
  currencySymbol = "₹",
}: SalesOverviewProps) {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState("THIS_WEEK");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dynamicCategories = categories && categories.length > 0
    ? categories
    : Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit" });
      });

  const dynamicSalesData = salesData && salesData.length > 0
    ? salesData
    : new Array(dynamicCategories.length).fill(0);

  const dynamicExpenseData = expenseData && expenseData.length > 0
    ? expenseData
    : new Array(dynamicCategories.length).fill(0);

  const isDark = resolvedTheme === "dark";

  // Modernize brand palette colors
  const primaryColor = "#5D87FF"; // Modernize primary blue
  const secondaryColor = "#49BEFF"; // Modernize sky blue

  const options: any = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      foreColor: "#71717A",
      toolbar: {
        show: false,
      },
      height: 350,
      background: "transparent",
    },
    colors: ["#FF6A3D", "#0F3D2E"],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "38%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    stroke: {
      show: true,
      width: 3,
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
        colors: isDark ? "#E5E7EB" : "#0B0B0B",
      },
      markers: {
        radius: 2,
      },
    },
    grid: {
      borderColor: isDark ? "#165742" : "#E5E7EB",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val: number) => `${currencySymbol}${val.toLocaleString()}`,
        style: {
          colors: isDark ? "#E5E7EB" : "#6B7280",
          fontSize: "11px",
        },
      },
    },
    xaxis: {
      categories: dynamicCategories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: isDark ? "#E5E7EB" : "#6B7280",
          fontSize: "11px",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: (val: number) => `${currencySymbol}${val.toLocaleString()}`,
      },
    },
  };

  const series = [
    {
      name: "Gross Sales",
      data: dynamicSalesData,
    },
    {
      name: "Operating Costs",
      data: dynamicExpenseData,
    },
  ];

  return (
    <DashboardCard
      title="Revenue & Sales Trajectory"
      subtitle="Daily gross receipts vs operational fulfillment cost"
      action={
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742] text-[#0B0B0B] dark:text-[#FAFAF8] focus:outline-none focus:border-[#FF6A3D] transition"
        >
          <option value="THIS_WEEK">Past 7 Days</option>
          <option value="THIS_MONTH">Current Month</option>
          <option value="LAST_MONTH">Last Quarter</option>
        </select>
      }
    >
      <div className="w-full h-[320px]">
        {mounted ? (
          <Chart options={options} series={series} type="bar" height={320} width="100%" />
        ) : (
          <div className="w-full h-[320px] animate-pulse bg-[#18181B] rounded-lg" />
        )}
      </div>
    </DashboardCard>
  );
}
