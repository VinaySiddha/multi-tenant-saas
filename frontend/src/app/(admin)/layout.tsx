"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarInset 
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Search,
  Command,
  ChevronRight, 
  ArrowUpRight,
  Receipt,
  ChefHat,
  QrCode,
  Circle
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, tenant, branch } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    const cleanPath = pathname?.replace(/^\/admin/, "") || "/dashboard";
    if (cleanPath === "/dashboard" || cleanPath === "" || cleanPath === "/") return "Overview";
    if (cleanPath === "/orders") return "Orders & Billing";
    if (cleanPath === "/menu") return "Menu Catalog";
    if (cleanPath === "/tables") return "Tables & Floorplan";
    if (cleanPath === "/inventory") return "Inventory Stock";
    if (cleanPath === "/staff") return "Staff & Access";
    return "Workspace";
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen min-w-0 bg-[#FAFAF8] dark:bg-[#0B0B0B] text-[#0B0B0B] dark:text-[#FAFAF8]">
        
        {/* Top Navbar in Deep Green */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[#165742]/40 bg-[#0F3D2E] text-white px-4 sm:px-6 shadow-xs">
          {/* Left: Sidebar Trigger & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <SidebarTrigger className="text-[#E5E7EB]/80 hover:text-white hover:bg-[#165742] -ml-1 rounded-md p-1.5 transition" />
            
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-[#E5E7EB]/70">Sapru</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#E5E7EB]/40" />
              <span className="text-white font-semibold tracking-tight truncate">
                {getBreadcrumbTitle()}
              </span>
            </div>
          </div>

          {/* Center/Right: Quick Search Command Palette Trigger */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#E5E7EB]/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, tables, catalog..."
                className="w-full pl-8 pr-12 py-1.5 bg-[#0A291F] border border-[#165742] hover:border-[#FF6A3D]/40 focus:border-[#FF6A3D] rounded-lg text-xs text-white placeholder-[#E5E7EB]/50 focus:outline-none transition"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-[#E5E7EB]/70 bg-[#165742] px-1.5 py-0.5 rounded border border-[#165742]">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Right: Service Status, Launchers, Notifications & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Restaurant Service Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A291F] border border-[#165742] text-[11px] font-medium text-[#E5E7EB]/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-semibold">Live Service</span>
              <span className="text-[#E5E7EB]/60">· Open</span>
            </div>

            {/* Direct Shortcuts */}
            <Link
              href="/terminal"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A291F] hover:bg-[#165742] border border-[#165742] hover:border-[#FF6A3D]/40 text-xs font-semibold text-[#E5E7EB] hover:text-white transition"
              title="Point of Sale Terminal"
            >
              <Receipt className="w-3.5 h-3.5 text-[#FF6A3D]" />
              <span>POS</span>
            </Link>

            <Link
              href="/kds"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A291F] hover:bg-[#165742] border border-[#165742] hover:border-[#FF6A3D]/40 text-xs font-semibold text-[#E5E7EB] hover:text-white transition"
              title="Kitchen Display Screen"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#FF6A3D]" />
              <span>KDS</span>
            </Link>

            <div className="h-4 w-[1px] bg-[#165742] hidden sm:block" />

            <ThemeToggle />
            <NotificationBell />

            {/* Compact User Indicator */}
            <div className="w-7 h-7 rounded-full bg-[#165742] border border-[#E5E7EB]/20 flex items-center justify-center text-xs font-bold text-white shrink-0 ml-1">
              {user?.fullName?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#FAFAF8] dark:bg-[#0B0B0B]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
