"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Grid2X2,
  CalendarCheck,
  UtensilsCrossed,
  Users2,
  ShieldCheck,
  Package,
  BarChart3,
  CreditCard,
  ChefHat,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Circle,
  Building2,
  Search,
  Command,
  SlidersHorizontal,
  ExternalLink
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import SapruLogo from "./SapruLogo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, tenant, branch, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navMain = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "Orders", url: "/orders", icon: Receipt, badge: "Live" },
    { title: "Tables", url: "/tables", icon: Grid2X2 },
    { title: "Reservations", url: "/tables", icon: CalendarCheck },
    { title: "Menu", url: "/menu", icon: UtensilsCrossed },
  ];

  const navOperations = [
    { title: "POS Terminal", url: "/terminal", icon: CreditCard, shortcut: "⌥P" },
    { title: "Kitchen Display (KDS)", url: "/kds", icon: ChefHat, shortcut: "⌥K" },
  ];

  const navManagement = [
    { title: "Customers", url: "/orders", icon: Users2 },
    { title: "Staff", url: "/staff", icon: ShieldCheck },
    { title: "Inventory", url: "/inventory", icon: Package },
    { title: "Analytics", url: "/dashboard", icon: BarChart3 },
    { title: "Payments", url: "/orders", icon: CreditCard },
  ];

  const navSecondary = [
    { title: "Settings", url: "/dashboard", icon: Settings },
    { title: "Help & Support", url: "/dashboard", icon: HelpCircle },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-[#165742]/40 bg-[#0F3D2E]" {...props}>
      {/* 1. Header: Brand Logo & Workspace Switcher */}
      <SidebarHeader className="border-b border-[#165742]/40 p-3.5 space-y-3 bg-[#0F3D2E]">
        <div className="px-1.5 pt-1">
          <Link href="/dashboard" className="flex items-center gap-2">
            <SapruLogo size={26} />
          </Link>
        </div>

        {/* Restaurant / Workspace Switcher */}
        <button
          type="button"
          className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0A291F] border border-[#165742] hover:border-[#FF6A3D]/40 hover:bg-[#165742]/40 transition text-left group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#0F3D2E] border border-[#165742] flex items-center justify-center text-[#FAFAF8] shrink-0 text-[10px] font-bold">
              RB
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#FAFAF8] truncate">
                {tenant?.name || "The Royal Bistro"}
              </span>
              <span className="text-[10px] text-[#E5E7EB]/70 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
                {branch?.name || "Indiranagar Flagship"}
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#E5E7EB]/60 group-hover:text-white transition shrink-0 ml-1" />
        </button>
      </SidebarHeader>

      {/* 2. Sidebar Navigation Content */}
      <SidebarContent className="bg-[#0F3D2E] px-2 py-2 space-y-4">
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E5E7EB]/60 px-2 mb-1">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navMain.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url === "/dashboard" &&
                    (pathname === "/" ||
                      pathname === "/admin" ||
                      pathname === "/dashboard" ||
                      pathname === "/admin/dashboard"));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#FF6A3D] text-white font-semibold shadow-xs"
                          : "text-[#E5E7EB]/85 hover:text-white hover:bg-[#165742]"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#E5E7EB]/70"}`} />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${isActive ? "bg-white/20 text-white" : "bg-[#FF6A3D]/20 text-[#FF6A3D] border border-[#FF6A3D]/30"}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Live Service Portals */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E5E7EB]/60 px-2 mb-1">
            Live Service
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navOperations.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#FF6A3D] text-white font-semibold shadow-xs"
                          : "text-[#E5E7EB]/85 hover:text-white hover:bg-[#165742]"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#E5E7EB]/70"}`} />
                          <span>{item.title}</span>
                        </div>
                        {item.shortcut && (
                          <kbd className="text-[9px] font-mono text-[#E5E7EB]/50">{item.shortcut}</kbd>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management & Intelligence */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E5E7EB]/60 px-2 mb-1">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navManagement.map((item) => {
                const isActive = pathname === item.url && item.title !== "Overview";
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#FF6A3D] text-white font-semibold shadow-xs"
                          : "text-[#E5E7EB]/85 hover:text-white hover:bg-[#165742]"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-2.5">
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#E5E7EB]/70"}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Footer: User Profile & System Meta */}
      <SidebarFooter className="border-t border-[#165742]/40 p-3 space-y-2 bg-[#0F3D2E]">
        {/* Settings & Help links */}
        <div className="px-1 space-y-0.5">
          {navSecondary.map((sec) => (
            <Link
              key={sec.title}
              href={sec.url}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-[#E5E7EB]/70 hover:text-white hover:bg-[#165742] transition font-medium"
            >
              <sec.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{sec.title}</span>
            </Link>
          ))}
        </div>

        <div className="pt-1.5 border-t border-[#165742]/60 flex items-center justify-between p-2 rounded-lg bg-[#0A291F] border border-[#165742]">
          <div className="flex items-center gap-2 min-w-0 pr-1">
            <div className="w-7 h-7 rounded-full bg-[#165742] border border-[#E5E7EB]/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.fullName?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#FAFAF8] truncate">
                {user?.fullName || "Alex Mercer"}
              </span>
              <span className="text-[10px] text-[#E5E7EB]/60 truncate">
                {user?.role?.replace("_", " ") || "Owner"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-[#E5E7EB]/70 hover:text-[#FF6A3D] hover:bg-[#165742] rounded-md transition shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
