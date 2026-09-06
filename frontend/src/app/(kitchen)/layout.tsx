import React from "react";
import Link from "next/link";
import { ChefHat, ArrowLeft, RefreshCw } from "lucide-react";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* KDS Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit KDS
          </Link>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-rose-500" />
            <h1 className="font-bold text-sm tracking-wide">Live Kitchen Display System (KDS)</h1>
            <span className="text-[10px] uppercase font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">
              Kitchen Station #1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WebSocket Live Stream Active</span>
          </div>
        </div>
      </header>

      {/* KDS Body */}
      <main className="flex-1 p-6 overflow-x-auto">{children}</main>
    </div>
  );
}
