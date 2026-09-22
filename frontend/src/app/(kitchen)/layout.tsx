import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 select-none font-sans">
      {/* KDS Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition border border-slate-700 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Hub</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-700">
              <Image
                src="/app-icon-dark.png"
                alt="Sapru"
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white tracking-tight">Sapru KDS</span>
              <span className="text-[10px] uppercase font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30">
                Kitchen Line #1
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time Ticket Stream</span>
          </div>
          <span className="text-slate-400 text-xs font-medium">Head Chef: Sanjay</span>
        </div>
      </header>

      {/* KDS Body */}
      <main className="flex-1 p-6 overflow-x-auto">{children}</main>
    </div>
  );
}
