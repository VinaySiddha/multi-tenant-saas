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
  transactions = [],
}: RecentTransactionsProps) {
  const getDotStyle = (type: TransactionEvent["type"]) => {
    switch (type) {
      case "PAYMENT":
        return {
          border: "border-[#0F3D2E]/40",
          bg: "bg-[#0F3D2E]/10",
          dot: "bg-[#0F3D2E]",
          icon: CreditCard,
        };
      case "KOT_READY":
        return {
          border: "border-[#FF6A3D]/40",
          bg: "bg-[#FF6A3D]/10",
          dot: "bg-[#FF6A3D]",
          icon: CheckCircle2,
        };
      case "COOKING":
        return {
          border: "border-amber-500/40",
          bg: "bg-amber-500/10",
          dot: "bg-amber-500",
          icon: Flame,
        };
      case "ORDER_PLACED":
        return {
          border: "border-[#E5E7EB]",
          bg: "bg-[#FAFAF8]",
          dot: "bg-[#0F3D2E]",
          icon: ShoppingBag,
        };
      default:
        return {
          border: "border-[#E5E7EB]",
          bg: "bg-[#FAFAF8]",
          dot: "bg-[#0B0B0B]/40",
          icon: Clock,
        };
    }
  };

  return (
    <DashboardCard
      title="Live Floor Stream"
      subtitle="Real-time timeline of kitchen, floor & billing events"
      action={
        <Link
          href="/orders"
          className="text-xs font-medium text-[#FF6A3D] hover:underline flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      }
    >
      {transactions.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-[#E5E7EB] dark:border-[#165742] rounded-xl flex flex-col items-center justify-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#FAFAF8] dark:bg-[#165742]/40 border border-[#E5E7EB] dark:border-[#165742] flex items-center justify-center text-[#6B7280]">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-[#0B0B0B] dark:text-[#FAFAF8]">No floor events recorded</p>
          <p className="text-[11px] text-[#6B7280]">Real-time kitchen, order and payment actions will stream here.</p>
        </div>
      ) : (
        <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#E5E7EB]">
          {transactions.map((tx) => {
            const style = getDotStyle(tx.type);

            return (
              <div key={tx.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-5 top-0.5 w-4 h-4 rounded-full border ${style.border} bg-white flex items-center justify-center`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                </div>

                {/* Event Content */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0B0B0B]">
                        {tx.title}
                      </span>
                      {tx.orderNumber && (
                        <Link
                          href="/orders"
                          className="text-[11px] font-mono font-medium text-[#0F3D2E] hover:underline transition"
                        >
                          {tx.orderNumber}
                        </Link>
                      )}
                    </div>
                    {tx.subtitle && (
                      <p className="text-[11px] text-[#0B0B0B]/60 mt-0.5">
                        {tx.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#0B0B0B]/50 shrink-0 font-mono">
                    {tx.amount && (
                      <span className="font-semibold text-[#0F3D2E]">
                        {formatCurrency(tx.amount)}
                      </span>
                    )}
                    <span>{tx.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
