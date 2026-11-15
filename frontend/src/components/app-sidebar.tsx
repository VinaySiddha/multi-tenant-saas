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
  Check,
  Plus,
  MapPin,
  Sparkles,
  BookOpen
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
import { canAccessRoute, ROLE_CONFIGS } from "@/lib/rbac";
import apiClient from "@/lib/api-client";
import SapruLogo from "./SapruLogo";
import { UserRole, Branch } from "@/types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, tenant, branch, branches, setBranches, switchBranch, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [branchDropdownOpen, setBranchDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userRole = (user?.primaryRole || user?.role || "RESTAURANT_OWNER") as UserRole;
  const roleConfig = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.RESTAURANT_OWNER;

  // Fetch branches on mount for the tenant
  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await apiClient.get("/restaurants/branches");
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setBranches(res.data.data);
          if (!branch && res.data.data[0]) {
            switchBranch(res.data.data[0]);
          }
        }
      } catch {
        // Keep existing cached branches
      }
    };

    fetchBranches();
  }, [setBranches, switchBranch, branch]);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBranchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navMain = [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "Orders", url: "/orders", icon: Receipt, badge: "Live" },
    { title: "Tables", url: "/tables", icon: Grid2X2 },
    { title: "Reservations", url: "/tables", icon: CalendarCheck },
    { title: "Menu", url: "/menu", icon: UtensilsCrossed },
  ].filter((item) => canAccessRoute(userRole, item.url));

  const navOperations = [
    { title: "Kitchen Display (KDS)", url: "/kds", icon: ChefHat, shortcut: "⌥K" },
  ].filter((item) => canAccessRoute(userRole, item.url));

  const navManagement = [
    { title: "Customers", url: "/orders", icon: Users2 },
    { title: "Staff", url: "/staff", icon: ShieldCheck },
    { title: "Inventory", url: "/inventory", icon: Package },
    { title: "Analytics", url: "/dashboard", icon: BarChart3 },
    { title: "Billing & Plans", url: "/billing", icon: CreditCard },
  ].filter((item) => canAccessRoute(userRole, item.url));

  const navSecondary = [
    { title: "API Documentation", url: "/docs", icon: BookOpen },
    { title: "Pricing & Plans", url: "/pricing", icon: Sparkles },
    { title: "Help & Support", url: "/support", icon: HelpCircle },
  ];

  const tenantInitials = tenant?.name
    ? tenant.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "RB";

  return (
    <Sidebar collapsible="icon" className="border-r border-[#165742]/40 bg-[#0F3D2E]" {...props}>
      {/* 1. Header: Brand Logo & Interactive Multi-Branch Switcher */}
      <SidebarHeader className="border-b border-[#165742]/40 p-3.5 space-y-3 bg-[#0F3D2E]">
        <div className="px-1.5 pt-1">
          <Link href="/dashboard" className="flex items-center gap-2">
            <SapruLogo size={26} />
          </Link>
        </div>

        {/* Multi-Tenant Restaurant / Branch Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0A291F] border border-[#165742] hover:border-[#FF6A3D]/40 hover:bg-[#165742]/40 transition text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#0F3D2E] border border-[#165742] flex items-center justify-center text-[#FAFAF8] shrink-0 text-[10px] font-bold">
                {tenantInitials}
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
            <ChevronDown className={`w-3.5 h-3.5 text-[#E5E7EB]/60 group-hover:text-white transition shrink-0 ml-1 ${branchDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Branch Selection Dropdown */}
          {branchDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[#0A291F] border border-[#165742] shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E5E7EB]/50 flex items-center justify-between">
                <span>Multi-Branch Outlets</span>
                <span className="font-mono text-emerald-400">{branches.length || 1} Active</span>
              </div>

              {/* List of Branches */}
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {(branches.length > 0 ? branches : (branch ? [branch] : [])).map((b) => {
                  const isCurrent = (branch?.id === b?.id) || (branch?.name === b?.name);
                  return (
                    <button
                      key={b?.id || b?.code}
                      type="button"
                      onClick={() => {
                        if (b) switchBranch(b);
                        setBranchDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition ${
                        isCurrent
                          ? "bg-[#165742] text-white font-semibold"
                          : "text-[#E5E7EB]/80 hover:text-white hover:bg-[#165742]/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3 h-3 text-[#FF6A3D] shrink-0" />
                        <span className="truncate">{b?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span className="text-[9px] font-mono opacity-60 uppercase">{b?.code}</span>
                        {isCurrent && <Check className="w-3 h-3 text-emerald-400 ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add New Branch Option for Owners */}
              {(userRole === "RESTAURANT_OWNER" || userRole === "PLATFORM_ADMIN") && (
                <Link
                  href="/dashboard"
                  onClick={() => setBranchDropdownOpen(false)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-[#FF6A3D] hover:bg-[#165742]/40 transition border-t border-[#165742]/60 mt-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Provision New Branch</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* 2. Sidebar Navigation Content */}
      <SidebarContent className="bg-[#0F3D2E] px-2 py-2 space-y-4">
        {/* Main Section */}
        {navMain.length > 0 && (
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
        )}

        {/* Live Service Portals */}
        {navOperations.length > 0 && (
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
        )}

        {/* Management & Intelligence */}
        {navManagement.length > 0 && (
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
        )}
      </SidebarContent>

      {/* 3. Footer: User Profile, RBAC Role Badge & Signout */}
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
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${roleConfig.badgeBg} ${roleConfig.badgeText} border ${roleConfig.badgeBorder}`}>
                  {roleConfig.badgeLabel}
                </span>
              </div>
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
