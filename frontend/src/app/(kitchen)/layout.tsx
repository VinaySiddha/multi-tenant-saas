"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/store/useAuthStore";
import { canAccessRoute } from "@/lib/rbac";
import { UserRole } from "@/types";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!storedToken && !token) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router, token]);

  if (!isMounted || !authChecked || (!token && typeof window !== "undefined" && !localStorage.getItem("token"))) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAF8] dark:bg-[#0B0B0B] text-[#0F3D2E] p-4">
        <div className="w-10 h-10 border-4 border-[#0F3D2E]/20 border-t-[#FF6A3D] rounded-full animate-spin mb-3.5" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-white font-poppins">
          Verifying Kitchen Access...
        </span>
      </div>
    );
  }

  const userRole = (user?.primaryRole || user?.role || "CHEF") as UserRole;
  const isAllowed = canAccessRoute(userRole, "/kds");

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
                Kitchen Expediter
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0A291F] border border-[#165742] text-[#E5E7EB] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time Ticket Stream</span>
          </div>
          <span className="text-[#E5E7EB]/80 text-xs font-medium hidden md:inline">
            Active: {user?.fullName || "Kitchen Lead"}
          </span>
          <ThemeToggle />
          <NotificationBell />
        </div>
      </header>

      {/* KDS Body */}
      <main className="flex-1 p-6 overflow-x-auto">
        {!isAllowed ? (
          <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742] text-center space-y-3 shadow-lg">
            <h3 className="text-base font-bold text-[#0F3D2E] dark:text-white">Access Restricted</h3>
            <p className="text-xs text-[#6B7280]">Your current role ({userRole}) does not have kitchen expediter privileges.</p>
            <Link href="/dashboard" className="inline-block px-4 py-2 rounded-xl bg-[#0F3D2E] text-white text-xs font-bold">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
