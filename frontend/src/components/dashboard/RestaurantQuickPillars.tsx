"use client";

import React from "react";
import Link from "next/link";
import { Receipt, ChefHat, QrCode, Package, ArrowUpRight, Sparkles } from "lucide-react";

interface PillarItem {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const pillars: PillarItem[] = [
  {
    id: "1",
    title: "Front-of-House POS Billing Terminal",
    category: "Cashier & Server",
    description: "Touch optimized billing interface with quick item search, table transfers, and instant GST invoice settlement.",
    href: "/terminal",
    badge: "Terminal Active",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    icon: Receipt,
    accentColor: "from-amber-500/20 to-orange-500/5",
  },
  {
    id: "2",
    title: "Kitchen Display Expediter System (KDS)",
    category: "Kitchen Line",
    description: "Live real-time KOT bump bar with preparation timers, course pacing, and automated server chime notifications.",
    href: "/kds",
    badge: "Live Audio Sync",
    badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    icon: ChefHat,
    accentColor: "from-rose-500/20 to-red-500/5",
  },
  {
    id: "3",
    title: "Contactless QR Dining & Self-Ordering",
    category: "Guest Experience",
    description: "Digital mobile ordering standees with live 86-ing menu sync, special requests, and zero app download required.",
    href: "/tables",
    badge: "Mobile Web Ready",
    badgeColor: "bg-[#5D87FF]/10 text-[#5D87FF] border-[#5D87FF]/30",
    icon: QrCode,
    accentColor: "from-[#5D87FF]/20 to-indigo-500/5",
  },
  {
    id: "4",
    title: "Ingredient Depletion & Stock Control",
    category: "Store & Inventory",
    description: "Automated consumption deduction on order placement, low stock alerts, and vendor restock management.",
    href: "/inventory",
    badge: "Real-Time Tracking",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    icon: Package,
    accentColor: "from-emerald-500/20 to-teal-500/5",
  },
];

export default function RestaurantQuickPillars() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Restaurant Operations Hub
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Integrated modules connecting front desk, kitchen station, and inventory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-[#5D87FF]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accentColor} border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#5D87FF] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#5D87FF]">
                <span>Launch Console</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
