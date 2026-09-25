"use client";

import React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Utensils,
  Clock,
  Receipt,
  ChefHat,
  RefreshCw,
  Flame,
  AlertCircle,
} from "lucide-react";

import { adminApi, apiErrorMessage } from "@/lib/admin-api";
import { useFetch, useAutoRefresh } from "@/hooks/useFetch";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { DashboardSummary, OrderView } from "@/types";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  SkeletonCard,
  ErrorState,
  EmptyState,
  Badge,
} from "@/components/ui";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/status-badges";

const REFRESH_INTERVAL_MS = 30_000;

interface TopItem {
  name: string;
  quantity?: number | string;
  revenue?: number | string;
}

function normalizeTopItems(items: Array<Record<string, unknown>> | undefined): TopItem[] {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 6).map((raw) => ({
    name: String(raw.name ?? raw.itemName ?? raw.menuItemName ?? "Item"),
    quantity: (raw.totalQuantity ?? raw.quantity) as number | string | undefined,
    revenue: (raw.totalRevenue ?? raw.revenue) as number | string | undefined,
  }));
}

export default function AdminDashboardPage() {
  const { tenant, branch } = useAuthStore();

  const summary = useFetch<DashboardSummary>(async () => {
    try {
      return await adminApi.getDashboardSummary();
    } catch (err) {
      throw new Error(apiErrorMessage(err, "Unable to load dashboard analytics."));
    }
  });

  const recentOrders = useFetch<OrderView[]>(async () => {
    try {
      return await adminApi.getOrders();
    } catch {
      // Orders list is supplementary — degrade gracefully.
      return [];
    }
  });

  const refreshAll = React.useCallback(() => {
    summary.refresh();
    recentOrders.refresh();
  }, [summary.refresh, recentOrders.refresh]);

  useAutoRefresh(refreshAll, REFRESH_INTERVAL_MS, !summary.loading);

  const data = summary.data;
  const stats = [
    {
      title: "Today's Revenue",
      value: formatCurrency(Number(data?.todayRevenue ?? 0)),
      hint: `${data?.todayOrdersCount ?? 0} orders today`,
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Active Orders",
      value: String(data?.activeOrdersCount ?? 0),
      hint: `${data?.todayOrdersCount ?? 0} placed today`,
      icon: ShoppingBag,
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
      title: "Table Occupancy",
      value: `${data?.occupiedTablesCount ?? 0}/${data?.totalTablesCount ?? 0}`,
      hint: `${Math.round(data?.tableOccupancyRate ?? 0)}% occupied`,
      icon: Utensils,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    },
    {
      title: "Avg. Prep Time",
      value: `${(data?.avgPrepTimeMinutes ?? 0).toFixed(1)} min`,
      hint: "Kitchen target: 15 min",
      icon: Clock,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
    },
  ];

  const topItems = normalizeTopItems(data?.topSellingItems);
  const orders = (recentOrders.data ?? [])
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 8);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {tenant?.name ?? "—"} • {branch?.name ?? "All branches"} • Auto-refreshes every{" "}
            {REFRESH_INTERVAL_MS / 1000}s
          </p>
        </div>
        <div className="flex items-center gap-3">
          {summary.error && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-amber-600">
              <AlertCircle className="w-3.5 h-3.5" /> Live feed degraded
            </span>
          )}
          <Button variant="outline" size="sm" onClick={refreshAll} loading={summary.loading}>
            {!summary.loading && <RefreshCw className="w-3.5 h-3.5" />} Refresh
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      {summary.loading && !summary.data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : summary.error ? (
        <ErrorState message={summary.error} onRetry={summary.refresh} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">{stat.hint}</p>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/pos/terminal"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition block"
        >
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Receipt className="w-4 h-4" />
            <h4 className="text-xs font-bold">Open POS Terminal</h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Take dine-in & takeaway orders with split bills
          </p>
        </Link>
        <Link
          href="/kitchen/kds"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 transition block"
        >
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ChefHat className="w-4 h-4" />
            <h4 className="text-xs font-bold">Kitchen Display (KDS)</h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Manage food preparation and live KOT timers
          </p>
        </Link>
        <Link
          href="/tables"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition block"
        >
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Utensils className="w-4 h-4" />
            <h4 className="text-xs font-bold">Manage Tables</h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Floor plan, table statuses & QR codes
          </p>
        </Link>
      </div>

      {/* Recent orders + top sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Orders"
            subtitle="Latest activity across all channels"
            action={
              <Link href="/orders" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all →
              </Link>
            }
          />
          <CardBody className="px-0 pb-0">
            {recentOrders.loading ? (
              <EmptyState title="Loading orders…" />
            ) : orders.length === 0 ? (
              <EmptyState
                title="No orders yet today"
                hint="Orders created from POS or QR menus will appear here in real time."
              />
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {order.orderNumber}
                        </p>
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {order.tableNumber ? `Table ${order.tableNumber} • ` : ""}
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                      {formatCurrency(Number(order.grandTotal ?? 0))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Top Sellers" subtitle="Based on current live data" />
          <CardBody>
            {topItems.length === 0 ? (
              <EmptyState
                title="No sales data yet"
                hint="Bestsellers will surface once orders start flowing in."
                icon={Flame}
              />
            ) : (
              <ol className="space-y-3">
                {topItems.map((item, idx) => (
                  <li key={`${item.name}-${idx}`} className="flex items-center gap-3">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </p>
                      {item.quantity !== undefined && (
                        <p className="text-[10px] text-slate-500">{String(item.quantity)} sold</p>
                      )}
                    </div>
                    {item.revenue !== undefined && (
                      <Badge tone="success">
                        {formatCurrency(Number(item.revenue || 0))}
                      </Badge>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
