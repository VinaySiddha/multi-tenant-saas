import { UserRole } from "@/types";

export interface RoleConfig {
  role: UserRole;
  label: string;
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
  allowedRoutes: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  PLATFORM_ADMIN: {
    role: "PLATFORM_ADMIN",
    label: "Platform Super Admin",
    badgeLabel: "Platform Admin",
    badgeBg: "bg-purple-500/15",
    badgeText: "text-purple-600 dark:text-purple-400",
    badgeBorder: "border-purple-500/30",
    description: "Full system-wide administrative control, multi-tenant diagnostics & platform access.",
    allowedRoutes: ["/dashboard", "/orders", "/tables", "/menu", "/inventory", "/staff", "/kds", "/billing"],
  },
  RESTAURANT_OWNER: {
    role: "RESTAURANT_OWNER",
    label: "Restaurant Owner",
    badgeLabel: "Owner",
    badgeBg: "bg-[#FF6A3D]/15",
    badgeText: "text-[#FF6A3D]",
    badgeBorder: "border-[#FF6A3D]/30",
    description: "Complete operational, financial, staff, catalog, table, and telemetry management.",
    allowedRoutes: ["/dashboard", "/orders", "/tables", "/menu", "/inventory", "/staff", "/kds", "/billing"],
  },
  BRANCH_MANAGER: {
    role: "BRANCH_MANAGER",
    label: "Branch Operations Manager",
    badgeLabel: "Manager",
    badgeBg: "bg-blue-500/15",
    badgeText: "text-blue-600 dark:text-blue-400",
    badgeBorder: "border-blue-500/30",
    description: "Floor oversight, shifts, inventory control, and operational reporting.",
    allowedRoutes: ["/dashboard", "/orders", "/tables", "/menu", "/inventory", "/staff", "/kds", "/billing"],
  },
  CASHIER: {
    role: "CASHIER",
    label: "Order & Cashier Staff",
    badgeLabel: "Cashier",
    badgeBg: "bg-amber-500/15",
    badgeText: "text-amber-600 dark:text-amber-400",
    badgeBorder: "border-amber-500/30",
    description: "Order entry, invoice receipts, and live table status.",
    allowedRoutes: ["/dashboard", "/orders", "/tables", "/menu"],
  },
  CHEF: {
    role: "CHEF",
    label: "Kitchen Display Expediter",
    badgeLabel: "Chef",
    badgeBg: "bg-emerald-500/15",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    description: "Kitchen order ticketing (KOT), prep pacing, recipe inventory, and item availability.",
    allowedRoutes: ["/dashboard", "/kds", "/inventory", "/menu"],
  },
  WAITER: {
    role: "WAITER",
    label: "Table Captain & Server",
    badgeLabel: "Captain / Waiter",
    badgeBg: "bg-cyan-500/15",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    badgeBorder: "border-cyan-500/30",
    description: "Table floorplan, taking guest dining orders, running KOTs, and table occupancy.",
    allowedRoutes: ["/dashboard", "/tables", "/orders", "/menu"],
  },
};

/**
 * Checks if a given role is authorized to access a specific path.
 */
export function canAccessRoute(role: UserRole | string | undefined, pathname: string): boolean {
  // Public documentation and utility routes are universally accessible
  if (
    pathname.startsWith("/docs") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/login")
  ) {
    return true;
  }

  if (!role) return false;
  const userRole = role as UserRole;
  const config = ROLE_CONFIGS[userRole];
  if (!config) return false;

  const cleanPath = pathname.replace(/^\/admin/, "") || "/dashboard";

  // Check if any allowed route matches the path
  return config.allowedRoutes.some((route) => {
    if (route === "/dashboard") {
      return cleanPath === "/" || cleanPath === "/dashboard" || cleanPath === "";
    }
    return cleanPath.startsWith(route);
  });
}

/**
 * Returns list of roles that have permission to view a given route.
 */
export function getRequiredRolesForRoute(pathname: string): UserRole[] {
  const cleanPath = pathname.replace(/^\/admin/, "") || "/dashboard";
  const required: UserRole[] = [];

  for (const [r, config] of Object.entries(ROLE_CONFIGS)) {
    const isAllowed = config.allowedRoutes.some((route) => {
      if (route === "/dashboard") return cleanPath === "/" || cleanPath === "/dashboard" || cleanPath === "";
      return cleanPath.startsWith(route);
    });
    if (isAllowed) {
      required.push(r as UserRole);
    }
  }

  return required;
}
