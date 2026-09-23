"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";

interface ProductRow {
  id: string;
  name: string;
  category: string;
  ordersCount: number;
  revenue: number;
  margin: "High" | "Medium" | "Top Seller" | "Trending";
  isVeg: boolean;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

interface ProductPerformanceProps {
  products?: ProductRow[];
}

export default function ProductPerformance({
  products = [
    {
      id: "1",
      name: "Truffle Mushroom Risotto",
      category: "Main Course",
      ordersCount: 142,
      revenue: 68160,
      margin: "Top Seller",
      isVeg: true,
      status: "IN_STOCK",
    },
    {
      id: "2",
      name: "Woodfired Margherita Pizza",
      category: "Pizza & Oven",
      ordersCount: 128,
      revenue: 44800,
      margin: "High",
      isVeg: true,
      status: "IN_STOCK",
    },
    {
      id: "3",
      name: "Smoked Chicken Quesadilla",
      category: "Appetizers",
      ordersCount: 96,
      revenue: 33600,
      margin: "Medium",
      isVeg: false,
      status: "IN_STOCK",
    },
    {
      id: "4",
      name: "Belgian Chocolate Lava Cake",
      category: "Desserts & Bakery",
      ordersCount: 84,
      revenue: 23520,
      margin: "Trending",
      isVeg: true,
      status: "LOW_STOCK",
    },
  ],
}: ProductPerformanceProps) {
  const getBadgeStyle = (margin: ProductRow["margin"]) => {
    switch (margin) {
      case "Top Seller":
        return "bg-[#5D87FF]/10 text-[#5D87FF] border-[#5D87FF]/30";
      case "High":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "Trending":
        return "bg-[#FA896B]/10 text-[#FA896B] border-[#FA896B]/30";
      case "Medium":
      default:
        return "bg-[#FFAE1F]/10 text-[#FFAE1F] border-[#FFAE1F]/30";
    }
  };

  return (
    <DashboardCard
      title="Top Menu Performance"
      subtitle="Highest revenue generating dishes and margin metrics"
      action={
        <Link
          href="/menu"
          className="text-xs font-semibold text-[#5D87FF] hover:underline flex items-center gap-1"
        >
          <span>Manage Menu</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      }
    >
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-4 py-3">Dish &amp; Description</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Sales Tag</th>
              <th className="px-6 py-3 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
            {products.map((p, idx) => (
              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition">
                <td className="px-6 py-3.5 font-bold font-mono text-slate-400">
                  {idx + 1}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        p.isVeg ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      title={p.isVeg ? "Veg" : "Non-Veg"}
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {p.ordersCount} orders fulfilled
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                  {p.category}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                      p.margin
                    )}`}
                  >
                    {p.margin}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(p.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
