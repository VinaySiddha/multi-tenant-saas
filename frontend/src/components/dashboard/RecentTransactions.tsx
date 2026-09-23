"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Flame, CreditCard, ShoppingBag, ArrowRight } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { formatCurrency } from "@/lib/utils";

interface TransactionEvent {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  orderNumber?: string;
  amount?: number;
  type: "PAYMENT" | "KOT_READY" | "ORDER_PLACED" | "COOKING" | "ALERT";
}

interface RecentTransactionsProps {
  transactions?: TransactionEvent[];
}

export default function RecentTransactions({
  transactions = [
    {
      id: "1",
      time: "Just now",
      title: "Bill Settled via UPI",
      subtitle: "Table T-04 (Ground Floor)",
      orderNumber: "#ORD-1048",
      amount: 1450,
      type: "PAYMENT",
    },
    {
      id: "2",
      time: "4 mins ago",
      title: "Kitchen Marked KOT Ready",
      subtitle: "Order #ORD-1047 (Direct Takeaway)",
      type: "KOT_READY",
    },
    {
      id: "3",
      time: "12 mins ago",
      title: "Chef Started Cooking",
      subtitle: "KOT-09 • 2x Woodfired Pizza, 1x Pasta",
      type: "COOKING",
    },
    {
      id: "4",
      time: "18 mins ago",
      title: "New QR Guest Order Placed",
      subtitle: "Table T-02 (Garden Patio)",
      orderNumber: "#ORD-1046",
      amount: 890,
      type: "ORDER_PLACED",
    },
    {
      id: "5",
      time: "32 mins ago",
      title: "Cash Bill Settled & Table Released",
      subtitle: "Table T-01 • Cashier Counter",
      orderNumber: "#ORD-1045",
      amount: 2320,
      type: "PAYMENT",
    },
  ],
}: RecentTransactionsProps) {
  const getDotStyle = (type: TransactionEvent["type"]) => {
    switch (type) {
      case "PAYMENT":
        return {
          border: "border-emerald-500",
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          icon: CreditCard,
        };
      case "KOT_READY":
        return {
          border: "border-blue-500",
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          icon: CheckCircle2,
        };
      case "COOKING":
        return {
          border: "border-amber-500",
          bg: "bg-amber-500/10",
          text: "text-amber-500",
          icon: Flame,
        };
      case "ORDER_PLACED":
        return {
          border: "border-indigo-500",
          bg: "bg-indigo-500/10",
          text: "text-indigo-500",
          icon: ShoppingBag,
        };
      default:
        return {
          border: "border-slate-500",
          bg: "bg-slate-500/10",
          text: "text-slate-500",
          icon: Clock,
        };
    }
  };

  return (
    <DashboardCard
      title="Recent Live Activity"
      subtitle="Real-time timeline of restaurant floor events"
      action={
        <Link
          href="/orders"
          className="text-xs font-semibold text-[#5D87FF] hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      }
    >
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
        {transactions.map((tx) => {
          const style = getDotStyle(tx.type);
          const Icon = style.icon;

          return (
            <div key={tx.id} className="relative group">
              {/* Timeline Dot Indicator */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${style.border} ${style.text} shadow-sm group-hover:scale-110 transition-transform`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${style.border.replace('border-', 'bg-')}`} />
              </div>

              {/* Event Content */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {tx.title}
                    </span>
                    {tx.orderNumber && (
                      <Link
                        href="/orders"
                        className="text-[11px] font-mono font-bold text-[#5D87FF] hover:underline"
                      >
                        {tx.orderNumber}
                      </Link>
                    )}
                  </div>
                  {tx.subtitle && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {tx.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                  {tx.amount && (
                    <span className="font-bold font-mono text-slate-900 dark:text-emerald-400">
                      {formatCurrency(tx.amount)}
                    </span>
                  )}
                  <span>• {tx.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
