"use client";

import React from "react";
import Link from "next/link";
import { 
  Building2, 
  LayoutDashboard, 
  UtensilsCrossed, 
  GitBranch, 
  Users, 
  Package, 
  BarChart3, 
  LogOut,
  Receipt,
  ChefHat
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, tenant, branch, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "POS Terminal", href: "/pos/terminal", icon: Receipt },
    { label: "Kitchen Display (KDS)", href: "/kitchen/kds", icon: ChefHat },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
        <div>
          {/* Logo & Tenant badge */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100">RestoSaaS</h1>
                <p className="text-[11px] text-slate-500 font-medium">Enterprise Suite</p>
              </div>
            </Link>
          </div>

          {/* Active Tenant / Branch Indicator */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 m-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {tenant?.name || "The Royal Bistro"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <GitBranch className="w-3.5 h-3.5" />
              <span>{branch?.name || "Downtown Branch"}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.fullName || "Restaurant Manager"}
              </span>
              <span className="text-[10px] text-slate-500">
                {user?.role || "RESTAURANT_OWNER"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
