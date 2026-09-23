"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Receipt, Clock, CheckCircle2, Flame, Utensils } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";

export interface OrderTableRow {
  id: string;
  orderNumber: string;
  tableName: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "QR_ORDER" | "DELIVERY";
  status: "PLACED" | "IN_KITCHEN" | "READY" | "SERVED" | "PAID" | "COMPLETED";
  paymentStatus: "PENDING" | "PAID";
  itemsCount: number;
  itemsSummary: string;
  grandTotal: number;
  timeAgo: string;
}

interface RecentOrdersTableProps {
  orders?: OrderTableRow[];
}

const defaultOrders: OrderTableRow[] = [
  {
    id: "1",
    orderNumber: "#ORD-1048",
    tableName: "Table T-01",
    orderType: "DINE_IN",
    status: "PAID",
    paymentStatus: "PAID",
    itemsCount: 4,
    itemsSummary: "Truffle Risotto, Woodfired Margherita, Classic Tiramisu",
    grandTotal: 2450,
    timeAgo: "2m ago",
  },
  {
    id: "2",
    orderNumber: "#ORD-1047",
    tableName: "Patio T-06",
    orderType: "QR_ORDER",
    status: "READY",
    paymentStatus: "PENDING",
    itemsCount: 3,
    itemsSummary: "Smoked Chicken Quesadilla, Citrus Lemonade x2",
    grandTotal: 1320,
    timeAgo: "8m ago",
  },
  {
    id: "3",
    orderNumber: "#ORD-1046",
    tableName: "Table T-03",
    orderType: "DINE_IN",
    status: "IN_KITCHEN",
    paymentStatus: "PENDING",
    itemsCount: 5,
    itemsSummary: "Herb Butter Garlic Prawns, Aglio Olio, Mocktail Trio",
    grandTotal: 3450,
    timeAgo: "14m ago",
  },
  {
    id: "4",
    orderNumber: "#ORD-1045",
    tableName: "Express Takeaway",
    orderType: "TAKEAWAY",
    status: "SERVED",
    paymentStatus: "PAID",
    itemsCount: 2,
    itemsSummary: "Paneer Makhani Sourdough Roll, Cold Brew",
    grandTotal: 680,
    timeAgo: "26m ago",
  },
  {
    id: "5",
    orderNumber: "#ORD-1044",
    tableName: "Mezzanine VIP T-08",
    orderType: "DINE_IN",
    status: "IN_KITCHEN",
    paymentStatus: "PENDING",
    itemsCount: 8,
    itemsSummary: "Chef Tasting Platter x4, Lamb Chops, Saffron Risotto",
    grandTotal: 8900,
    timeAgo: "34m ago",
  },
];

export default function RecentOrdersTable({
  orders = defaultOrders,
}: RecentOrdersTableProps) {
  const getStatusBadge = (status: OrderTableRow["status"], paymentStatus: OrderTableRow["paymentStatus"]) => {
    if (paymentStatus === "PAID" || status === "PAID" || status === "COMPLETED") {
      return {
        label: "Settled / Paid",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        dot: "bg-emerald-500",
      };
    }
    if (status === "READY") {
      return {
        label: "Ready for Pickup",
        className: "bg-[#0F3D2E] text-white font-semibold border-[#165742]",
        dot: "bg-[#FF6A3D]",
      };
    }
    if (status === "IN_KITCHEN") {
      return {
        label: "Cooking in KDS",
        className: "bg-[#FF6A3D]/10 text-[#FF6A3D] border-[#FF6A3D]/30",
        dot: "bg-[#FF6A3D] animate-pulse",
      };
    }
    return {
      label: "Order Placed",
      className: "bg-slate-100 dark:bg-[#165742] text-[#6B7280] dark:text-[#E5E7EB] border-[#E5E7EB] dark:border-[#165742]",
      dot: "bg-zinc-400",
    };
  };

  const getChannelBadge = (type: OrderTableRow["orderType"]) => {
    switch (type) {
      case "QR_ORDER":
        return "QR Dine-In";
      case "TAKEAWAY":
        return "Takeaway";
      case "DELIVERY":
        return "Delivery";
      case "DINE_IN":
      default:
        return "Dine-In";
    }
  };

  return (
    <DashboardCard
      title="Recent Live Orders & Tickets"
      subtitle="Comprehensive view of active dining room, takeout and KOT tickets"
      action={
        <Link
          href="/orders"
          className="text-xs font-semibold text-[#0F3D2E] dark:text-[#E5E7EB] hover:text-[#FF6A3D] flex items-center gap-1 transition"
        >
          <span>All Orders</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      }
    >
      <div className="overflow-x-auto -mx-5 sm:-mx-6 -mb-5 sm:-mb-6">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF8] dark:bg-[#0A291F] text-[#0F3D2E] dark:text-[#FAFAF8] border-b border-[#E5E7EB] dark:border-[#165742] font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 sm:px-6 py-2.5 font-bold">Order #</th>
              <th className="px-4 py-2.5 font-bold">Table / Channel</th>
              <th className="px-4 py-2.5 font-bold">Items Summary</th>
              <th className="px-4 py-2.5 font-bold">Fulfillment Status</th>
              <th className="px-5 sm:px-6 py-2.5 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#165742]/40 text-[#0B0B0B] dark:text-[#E5E7EB]">
            {orders.map((ord) => {
              const status = getStatusBadge(ord.status, ord.paymentStatus);

              return (
                <tr key={ord.id} className="hover:bg-[#FAFAF8]/80 dark:hover:bg-[#165742]/30 transition-colors">
                  <td className="px-5 sm:px-6 py-3">
                    <Link
                      href="/orders"
                      className="font-mono font-bold text-[#0F3D2E] dark:text-white hover:text-[#FF6A3D] block"
                    >
                      {ord.orderNumber}
                    </Link>
                    <span className="text-[10px] text-[#6B7280] font-mono">
                      {ord.timeAgo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#0B0B0B] dark:text-white block">
                      {ord.tableName}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#E5E7EB]/60 font-mono">
                      {getChannelBadge(ord.orderType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <span className="text-[#0B0B0B] dark:text-white truncate block text-[11px] font-medium">
                      {ord.itemsSummary}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#E5E7EB]/60">
                      {ord.itemsCount} total line items
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] border font-mono font-medium ${status.className}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`} />
                      <span>{status.label}</span>
                    </div>
                  </td>
                  <td className="px-5 sm:px-6 py-3 text-right">
                    <span className="font-mono font-bold text-[#0F3D2E] dark:text-white block">
                      {formatCurrency(ord.grandTotal)}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${ord.paymentStatus === "PAID" ? "text-emerald-600 dark:text-emerald-400" : "text-[#6B7280]"}`}>
                      {ord.paymentStatus === "PAID" ? "Settled" : "Unpaid"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
