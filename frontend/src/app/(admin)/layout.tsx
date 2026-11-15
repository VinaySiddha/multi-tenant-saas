"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ChevronRight, 
  Receipt,
  ChefHat,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSubscriptionStore } from "@/store/useSubscriptionStore";
import { TrialBanner } from "@/components/subscription/TrialBanner";
import { TrialPaywallModal } from "@/components/subscription/TrialPaywallModal";
import { canAccessRoute, getRequiredRolesForRoute, ROLE_CONFIGS } from "@/lib/rbac";
import { UserRole } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, tenant, branch, isAuthenticated, token } = useAuthStore();
  const { fetchSubscription } = useSubscriptionStore();
  const [isMounted, setIsMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!storedToken && !token) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
      fetchSubscription();
    }
  }, [router, token, fetchSubscription]);

  // Prevent any flash of protected dashboard content before authentication is verified
  if (!isMounted || !authChecked || (!token && typeof window !== "undefined" && !localStorage.getItem("token"))) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAF8] dark:bg-[#0B0B0B] text-[#0F3D2E] p-4">
        <div className="w-10 h-10 border-4 border-[#0F3D2E]/20 border-t-[#FF6A3D] rounded-full animate-spin mb-3.5" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-white font-poppins">
          Verifying Authorized Access...
        </span>
        <span className="text-[11px] text-[#6B7280] mt-1">
          Redirecting to secure login console if unauthenticated
        </span>
      </div>
    );
  }

  const userRole = (user?.primaryRole || user?.role || "RESTAURANT_OWNER") as UserRole;
  const roleConfig = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.RESTAURANT_OWNER;

  // Check RBAC permission for the current route
  const isAllowed = isMounted ? canAccessRoute(userRole, pathname) : true;
  const requiredRoles = getRequiredRolesForRoute(pathname);

  const getBreadcrumbTitle = () => {
    const cleanPath = pathname?.replace(/^\/admin/, "") || "/dashboard";
    if (cleanPath === "/dashboard" || cleanPath === "" || cleanPath === "/") return "Overview";
    if (cleanPath === "/orders") return "Orders & Billing";
    if (cleanPath === "/menu") return "Menu Catalog";
    if (cleanPath === "/tables") return "Tables & Floorplan";
    if (cleanPath === "/inventory") return "Inventory Stock";
    if (cleanPath === "/staff") return "Staff & Access";
    if (cleanPath === "/billing") return "Billing & Subscriptions";
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

          {/* Right: RBAC Role Badge, Service Status, Launchers & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Live RBAC Role Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A291F] border border-[#165742] text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A3D]" />
              <span className="text-white font-semibold">{roleConfig.badgeLabel}</span>
            </div>

            {/* Direct Shortcuts */}
            {canAccessRoute(userRole, "/kds") && (
              <Link
                href="/kds"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0A291F] hover:bg-[#165742] border border-[#165742] hover:border-[#FF6A3D]/40 text-xs font-semibold text-[#E5E7EB] hover:text-white transition"
                title="Kitchen Display Screen"
              >
                <ChefHat className="w-3.5 h-3.5 text-[#FF6A3D]" />
                <span>KDS</span>
              </Link>
            )}

            <div className="h-4 w-[1px] bg-[#165742] hidden sm:block" />

            <ThemeToggle />
            <NotificationBell />

            {/* Compact User Indicator */}
            <div className="w-7 h-7 rounded-full bg-[#165742] border border-[#E5E7EB]/20 flex items-center justify-center text-xs font-bold text-white shrink-0 ml-1" title={`${user?.fullName || "User"} (${roleConfig.label})`}>
              {user?.fullName?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* 14-Day Free Trial Countdown Banner */}
        <TrialBanner />

        {/* Hard Paywall Modal if Trial Elapsed & Operations Blocked */}
        <TrialPaywallModal />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#FAFAF8] dark:bg-[#0B0B0B]">
          <div className="max-w-7xl mx-auto space-y-6">
            {isMounted && !isAllowed ? (
              /* RBAC Access Denied Boundary */
              <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742] shadow-sm text-center max-w-2xl mx-auto my-12 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    <span>RBAC Security Boundary</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0F3D2E] dark:text-[#FAFAF8]">
                    Restricted Access
                  </h2>
                  <p className="text-xs sm:text-sm text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 max-w-lg mx-auto">
                    Your current active role (<strong className="text-[#0F3D2E] dark:text-white">{roleConfig.label}</strong>) does not have authorization to access <code className="text-[#FF6A3D] font-mono">{pathname}</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAF8] dark:bg-[#0F3D2E]/60 border border-[#E5E7EB] dark:border-[#165742] text-left text-xs space-y-2">
                  <div className="font-semibold text-[#0F3D2E] dark:text-white flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#FF6A3D]" />
                    <span>Authorized Roles for this Module:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {requiredRoles.map((r) => {
                      const c = ROLE_CONFIGS[r];
                      return (
                        <span key={r} className="px-2 py-0.5 rounded-md bg-white dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742] text-[11px] font-medium text-[#0F3D2E] dark:text-white">
                          {c ? c.label : r}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F3D2E] hover:bg-[#165640] text-white text-xs font-bold transition shadow-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Overview</span>
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#165742] border border-[#E5E7EB] dark:border-[#165742] hover:border-[#FF6A3D] text-xs font-semibold text-[#0F3D2E] dark:text-white transition"
                  >
                    <span>Switch Role / Login</span>
                  </Link>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
