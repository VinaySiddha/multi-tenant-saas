"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ChefHat,
  UtensilsCrossed,
  Table as TableIcon,
  BookOpen,
  ShoppingBag,
  LogOut,
  Building2,
  GitBranch,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { ToastProvider } from "@/components/toast";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "POS Terminal", href: "/pos/terminal", icon: Receipt },
  { label: "Kitchen Display", href: "/kitchen/kds", icon: ChefHat },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Tables", href: "/tables", icon: TableIcon },
  { label: "Menu", href: "/menu", icon: BookMenu },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, tenant, branch, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const role = (user as unknown as { primaryRole?: string; role?: string })
    ?.primaryRole ?? (user as unknown as { role?: string })?.role;

  const initials = (user?.fullName ?? "User")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl text-white">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              RestoSaaS
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Enterprise Suite</p>
          </div>
        </Link>
        <button
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tenant / branch context */}
      <div className="p-4 mx-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            {tenant?.name ?? "No tenant selected"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <GitBranch className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{branch?.name ?? "Default branch"}</span>
          {branch?.code && (
            <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70">
              {branch.code}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-3 space-y-1 flex-1 overflow-y-auto" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition",
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600"
              )}
            >
              <Icon
                className={cn("w-4 h-4", active ? "text-indigo-500" : "text-slate-400")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
            {initials || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.fullName ?? "Signed out"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{role ?? user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {tenant?.name ?? "RestoSaaS"}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>

        <footer className="px-6 py-3 border-t border-slate-200/70 dark:border-slate-800/70 text-[11px] text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} RestoSaaS Platform</span>
          <span className="font-mono">
            {branch?.code ?? "—"} · {tenant?.subscriptionPlan ?? "PLAN"}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
