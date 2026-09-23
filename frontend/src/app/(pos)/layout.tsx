import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Wifi, Building2 } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

export default function PosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* POS Top Navbar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
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
              <span className="font-black text-sm text-white tracking-tight">Sapru POS</span>
              <span className="text-[10px] uppercase font-bold bg-[#FF6A3D]/20 text-[#FF6A3D] px-2 py-0.5 rounded border border-[#FF6A3D]/30">
                Register #01
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Dispatch Active</span>
          </div>
          <span className="text-slate-400 text-xs font-medium hidden md:inline">The Royal Bistro • Flagship</span>
          <NotificationBell />
        </div>
      </header>

      {/* POS Content Body */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
