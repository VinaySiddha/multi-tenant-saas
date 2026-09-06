import React from "react";
import Link from "next/link";
import { UtensilsCrossed, ArrowLeft, Wifi } from "lucide-react";

export default function PosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* POS Top Navbar */}
      <header className="h-12 bg-slate-900 text-white px-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs">POS Cloud Terminal</span>
            <span className="text-[10px] bg-indigo-600/60 px-2 py-0.5 rounded text-indigo-200">
              Downtown Branch
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Online Sync Active</span>
          </div>
          <span className="text-slate-400 text-[11px]">Register #01 • Cashier: Alex</span>
        </div>
      </header>

      {/* POS Content Body */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
