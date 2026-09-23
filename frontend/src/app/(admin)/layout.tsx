"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  UtensilsCrossed, 
  GitBranch, 
  Users, 
  Package, 
  LogOut,
  Receipt,
  ChefHat,
  QrCode,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CircleDot
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationBell from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, tenant, branch, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navSections = [
    {
      title: "Operations",
      items: [
        { label: "Dashboard", href: "/dashboard", alias: "/admin/dashboard", icon: LayoutDashboard },
        { label: "POS Terminal", href: "/terminal", icon: Receipt, badge: "POS", badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
        { label: "Kitchen Display", href: "/kds", icon: ChefHat, badge: "Live", badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
        { label: "Orders & Invoices", href: "/orders", alias: "/admin/orders", icon: ShoppingBag },
      ]
    },
    {
      title: "Management",
      items: [
        { label: "Menu & Pricing", href: "/menu", alias: "/admin/menu", icon: UtensilsCrossed },
        { label: "Tables & QR Floor", href: "/tables", alias: "/admin/tables", icon: QrCode },
        { label: "Inventory & Stock", href: "/inventory", alias: "/admin/inventory", icon: Package },
        { label: "Staff & Team Access", href: "/staff", alias: "/admin/staff", icon: Users },
      ]
    }
  ];

  const getBreadcrumbTitle = () => {
    const cleanPath = pathname?.replace(/^\/admin/, "") || "/dashboard";
    if (cleanPath === "/dashboard" || cleanPath === "" || cleanPath === "/") return "Executive Dashboard";
    if (cleanPath === "/orders") return "Orders & Invoices Ledger";
    if (cleanPath === "/menu") return "Menu Catalog & Pricing";
    if (cleanPath === "/tables") return "Dining Tables & Floorplan";
    if (cleanPath === "/inventory") return "Inventory & Stock Control";
    if (cleanPath === "/staff") return "Staff & Access Governance";
    return "Operations Hub";
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-900/90 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-4 border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-[#FF6A3D]/20 border border-slate-700/80 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/app-icon-dark.png"
                  alt="Sapru"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight">Sapru</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#FF6A3D]/20 text-[#FF6A3D] border border-[#FF6A3D]/30">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Restaurant Suite</span>
              </div>
            </Link>
          </div>

          {/* Active Tenant / Branch Card */}
          <div className="p-3 bg-slate-950/60 m-3 rounded-xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200 truncate">
                {tenant?.name || "The Royal Bistro"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-0.5">
              <GitBranch className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">{branch?.name || "Indiranagar Flagship"}</span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="px-3 py-2 space-y-5">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = 
                    pathname === item.href || 
                    pathname === item.alias || 
                    (item.href === "/dashboard" && (pathname === "/" || pathname === "/admin" || pathname === "/dashboard" || pathname === "/admin/dashboard"));

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-bold"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                          isActive ? "bg-white/20 text-white border-white/30" : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* User profile & Quick Links */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-xs font-bold text-white truncate">
                {user?.fullName || "Alex Mercer"}
              </span>
              <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-wide truncate">
                {user?.role?.replace("_", " ") || "Restaurant Owner"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-2 text-[10px] text-slate-400">
            <Link href="/" className="hover:text-slate-300 transition">
              &larr; Public Home
            </Link>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CircleDot className="w-2.5 h-2.5" /> Live
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-200 transition">
              Sapru
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold">{getBreadcrumbTitle()}</span>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex items-center gap-3">
            <Link
              href="/terminal"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch POS Terminal</span>
            </Link>

            <Link
              href="/kds"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
            >
              <ChefHat className="w-3.5 h-3.5 text-rose-400" />
              <span>Kitchen Screen</span>
            </Link>

            <Link
              href="/menu/5da85f64-5717-4562-b3fc-2c963f66afb5"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>QR Menu Demo</span>
              <ArrowUpRight className="w-3 h-3 text-slate-500" />
            </Link>
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
