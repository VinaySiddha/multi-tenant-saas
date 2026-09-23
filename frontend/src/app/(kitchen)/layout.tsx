import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, RefreshCw } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/theme-toggle";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] dark:bg-[#0B0B0B] text-[#0B0B0B] dark:text-[#FAFAF8] select-none font-sans">
      {/* KDS Header in Deep Green */}
      <header className="h-14 bg-[#0F3D2E] text-white border-b border-[#165742] px-6 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-[#E5E7EB] hover:text-white bg-[#0A291F] hover:bg-[#165742] px-3 py-1.5 rounded-xl transition border border-[#165742] font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Hub</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-[#165742]">
              <Image
                src="/app-icon-dark.png"
                alt="Sapru"
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">Sapru KDS</span>
              <span className="text-[10px] uppercase font-bold bg-[#FF6A3D]/20 text-[#FF6A3D] px-2 py-0.5 rounded border border-[#FF6A3D]/30">
                Kitchen Line #1
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0A291F] border border-[#165742] text-[#E5E7EB] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time Ticket Stream</span>
          </div>
          <span className="text-[#E5E7EB]/80 text-xs font-medium hidden md:inline">Head Chef: Sanjay</span>
          <ThemeToggle />
          <NotificationBell />
        </div>
      </header>

      {/* KDS Body */}
      <main className="flex-1 p-6 overflow-x-auto">{children}</main>
    </div>
  );
}
