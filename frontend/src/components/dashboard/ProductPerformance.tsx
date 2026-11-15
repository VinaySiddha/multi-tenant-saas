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
  products = [],
}: ProductPerformanceProps) {
  const getBadgeStyle = (margin: ProductRow["margin"]) => {
    switch (margin) {
      case "Top Seller":
        return "bg-[#FF6A3D] text-white font-bold shadow-xs";
      case "High":
        return "bg-[#0F3D2E] text-white border-[#165742]";
      case "Trending":
        return "bg-[#FF6A3D]/10 text-[#FF6A3D] border-[#FF6A3D]/30 font-semibold";
      case "Medium":
      default:
        return "bg-slate-100 dark:bg-[#165742] text-[#6B7280] dark:text-[#E5E7EB] border-[#E5E7EB] dark:border-[#165742]";
    }
  };

  return (
    <DashboardCard
      title="Top Menu Performance"
      subtitle="Revenue-generating dishes, velocity & profit margin"
      action={
        <Link
          href="/menu"
          className="text-xs font-semibold text-[#0F3D2E] dark:text-[#E5E7EB] hover:text-[#FF6A3D] flex items-center gap-1 transition"
        >
          <span>Catalog</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      }
    >
      <div className="overflow-x-auto -mx-5 sm:-mx-6 -mb-5 sm:-mb-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF8] dark:bg-[#0A291F] text-[#0F3D2E] dark:text-[#FAFAF8] border-b border-[#E5E7EB] dark:border-[#165742] font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 sm:px-6 py-2.5 font-bold">#</th>
              <th className="px-4 py-2.5 font-bold">Item &amp; Category</th>
              <th className="px-4 py-2.5 font-bold">Category</th>
              <th className="px-4 py-2.5 font-bold">Classification</th>
              <th className="px-5 sm:px-6 py-2.5 font-bold text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#165742]/40 text-[#0B0B0B] dark:text-[#E5E7EB]">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#6B7280] dark:text-[#E5E7EB]/60">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-[#FAFAF8] dark:bg-[#165742]/40 border border-[#E5E7EB] dark:border-[#165742] flex items-center justify-center text-[#6B7280]">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-[#0B0B0B] dark:text-[#FAFAF8]">No menu items recorded yet</p>
                    <p className="text-[11px] text-[#6B7280]">Add items in the Menu Catalog to track sales performance.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p, idx) => (
                <tr key={p.id} className="hover:bg-[#FAFAF8]/80 dark:hover:bg-[#165742]/30 transition-colors">
                  <td className="px-5 sm:px-6 py-3 font-mono text-[#6B7280]">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          p.isVeg ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                        title={p.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                      />
                      <div>
                        <span className="font-semibold text-[#0B0B0B] dark:text-white block">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-[#6B7280] dark:text-[#E5E7EB]/60">
                          {p.ordersCount} orders fulfilled
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] dark:text-[#E5E7EB]/80 font-medium">
                    {p.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] border font-mono ${getBadgeStyle(
                        p.margin
                      )}`}
                    >
                      {p.margin}
                    </span>
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right font-mono font-bold text-[#0F3D2E] dark:text-white">
                    {formatCurrency(p.revenue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
