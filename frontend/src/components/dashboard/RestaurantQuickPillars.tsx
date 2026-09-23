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
  icon: React.ComponentType<{ className?: string }>;
}

const pillars: PillarItem[] = [
  {
    id: "1",
    title: "Front-of-House POS Billing Terminal",
    category: "Cashier & Server",
    description: "Touch optimized billing interface with quick item search, table transfers, and instant GST invoice settlement.",
    href: "/terminal",
    badge: "Terminal Active",
    icon: Receipt,
  },
  {
    id: "2",
    title: "Kitchen Display Expediter System (KDS)",
    category: "Kitchen Line",
    description: "Live real-time KOT bump bar with preparation timers, course pacing, and automated server chime notifications.",
    href: "/kds",
    badge: "Live Audio Sync",
    icon: ChefHat,
  },
  {
    id: "3",
    title: "Contactless QR Dining & Self-Ordering",
    category: "Guest Experience",
    description: "Digital mobile ordering standees with live 86-ing menu sync, special requests, and zero app download required.",
    href: "/tables",
    badge: "Mobile Web Ready",
    icon: QrCode,
  },
  {
    id: "4",
    title: "Ingredient Depletion & Stock Control",
    category: "Store & Inventory",
    description: "Automated consumption deduction on order placement, low stock alerts, and vendor restock management.",
    href: "/inventory",
    badge: "Real-Time Tracking",
    icon: Package,
  },
];

export default function RestaurantQuickPillars() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold tracking-tight text-[#0F3D2E] dark:text-[#FAFAF8]">
            Core Operational Modules
          </h3>
          <p className="text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70">
            Direct consoles for point-of-sale cashiering, kitchen bump bar, floor QR &amp; inventory
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
              className="group rounded-xl border border-[#E5E7EB] dark:border-[#165742]/40 bg-white dark:bg-[#0A291F] p-5 hover:border-[#FF6A3D]/60 hover:shadow-md transition-all duration-150 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6A3D]/10 border border-[#FF6A3D]/20 flex items-center justify-center text-[#FF6A3D] group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border bg-[#FAFAF8] dark:bg-[#165742] text-[#0F3D2E] dark:text-[#FAFAF8] border-[#E5E7EB] dark:border-[#165742]">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] block mb-1 font-semibold">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#0F3D2E] dark:text-white group-hover:text-[#FF6A3D] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#E5E7EB] dark:border-[#165742]/40 flex items-center justify-between text-xs font-semibold text-[#0F3D2E] dark:text-[#E5E7EB] group-hover:text-[#FF6A3D] transition-colors">
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
