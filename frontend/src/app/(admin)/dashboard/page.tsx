"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Utensils, 
  CheckCircle2, 
  ArrowUpRight,
  RefreshCw,
  Receipt,
  ChefHat,
  QrCode,
  Users,
  Activity,
  CalendarCheck,
  CreditCard,
  Building2,
  Bell
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { MorphButton } from "@/components/spectrumui/morph-button";
import { useAuthStore } from "@/store/useAuthStore";
import { DiningTable, InventoryItem, Order, MenuItem } from "@/types";

// Sapru Minimalist SaaS Components
import SalesOverview from "@/components/dashboard/SalesOverview";
import YearlyBreakup from "@/components/dashboard/YearlyBreakup";
import MonthlyEarnings from "@/components/dashboard/MonthlyEarnings";
import OrderVolumeChart from "@/components/dashboard/OrderVolumeChart";
import TableOccupancyMatrix, { TableItem } from "@/components/dashboard/TableOccupancyMatrix";
import OperationalAlerts, { AlertItem } from "@/components/dashboard/OperationalAlerts";
import RecentOrdersTable, { OrderTableRow } from "@/components/dashboard/RecentOrdersTable";
import ProductPerformance from "@/components/dashboard/ProductPerformance";
import RestaurantQuickPillars from "@/components/dashboard/RestaurantQuickPillars";

export default function AdminDashboardPage() {
  const { user, tenant, branch } = useAuthStore();
  const [greeting, setGreeting] = useState("Good day");
  const [summary, setSummary] = useState<any>({
    todayRevenue: 0,
    todayOrdersCount: 0,
    occupiedTablesCount: 0,
    totalTablesCount: 0,
    tableOccupancyRate: 0,
    avgOrderValue: 0,
    pendingReservationsCount: 0,
    avgPrepTimeMinutes: 0,
    activeOrdersCount: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Time-aware greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, ordRes, menuRes, tableRes, invRes] = await Promise.allSettled([
        apiClient.get("/analytics/summary"),
        apiClient.get("/orders"),
        apiClient.get("/menu/items"),
        apiClient.get("/tables"),
        apiClient.get("/inventory"),
      ]);

      if (sumRes.status === "fulfilled" && sumRes.value.data?.data) {
        setSummary((prev: any) => ({
          ...prev,
          ...sumRes.value.data.data,
        }));
      }
      if (ordRes.status === "fulfilled" && ordRes.value.data?.data) {
        setOrders(ordRes.value.data.data);
      } else if (ordRes.status === "rejected") {
        setOrders([]);
      }
      if (menuRes.status === "fulfilled" && menuRes.value.data?.data) {
        setMenuItems(menuRes.value.data.data);
      } else if (menuRes.status === "rejected") {
        setMenuItems([]);
      }
      if (tableRes.status === "fulfilled" && tableRes.value.data?.data) {
        setTables(tableRes.value.data.data);
      } else if (tableRes.status === "rejected") {
        setTables([]);
      }
      if (invRes.status === "fulfilled" && invRes.value.data?.data) {
        setInventoryItems(invRes.value.data.data);
      } else if (invRes.status === "rejected") {
        setInventoryItems([]);
      }
    } catch {
      // Clean baseline on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    const handleAnalyticsEvents = () => {
      fetchAnalytics();
    };

    window.addEventListener("sapru:order-created", handleAnalyticsEvents);
    window.addEventListener("sapru:order-ready", handleAnalyticsEvents);
    window.addEventListener("sapru:payment-completed", handleAnalyticsEvents);

    const interval = setInterval(fetchAnalytics, 15000);

    return () => {
      window.removeEventListener("sapru:order-created", handleAnalyticsEvents);
      window.removeEventListener("sapru:order-ready", handleAnalyticsEvents);
      window.removeEventListener("sapru:payment-completed", handleAnalyticsEvents);
      clearInterval(interval);
    };
  }, [fetchAnalytics]);

  // Derived real-time numbers from live database records
  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const computedTodayRevenue = summary.todayRevenue !== undefined && summary.todayRevenue > 0
    ? Number(summary.todayRevenue)
    : paidOrders.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);

  const computedTodayOrdersCount = summary.todayOrdersCount !== undefined && summary.todayOrdersCount > 0
    ? Number(summary.todayOrdersCount)
    : orders.length;

  const activeOrdersCount = orders.filter(
    (o) => o.status === "PLACED" || o.status === "IN_KITCHEN" || o.status === "READY"
  ).length;

  const occupiedTablesCount = tables.filter(
    (t) => t.status === "OCCUPIED" || t.status === "BILLING"
  ).length;

  const totalTablesCount = tables.length;
  const tableOccupancyRate = totalTablesCount > 0
    ? Math.round((occupiedTablesCount / totalTablesCount) * 100)
    : 0;

  const pendingReservationsCount = tables.filter((t) => t.status === "RESERVED").length;

  const computedAvgOrderValue = computedTodayOrdersCount > 0
    ? Math.round(computedTodayRevenue / computedTodayOrdersCount)
    : 0;

  // Executive KPI Strip with live values
  const kpis = [
    { 
      title: "Today's Revenue", 
      value: formatCurrency(computedTodayRevenue), 
      subtext: "Live gross billing receipts", 
      icon: DollarSign, 
      change: `${paidOrders.length} settled`,
      isPositive: true
    },
    { 
      title: "Orders Placed", 
      value: String(computedTodayOrdersCount), 
      subtext: `${activeOrdersCount} tickets in live prep`, 
      icon: ShoppingBag, 
      change: `${activeOrdersCount} active`,
      isPositive: true
    },
    { 
      title: "Average Order Value", 
      value: formatCurrency(computedAvgOrderValue), 
      subtext: "AOV per settled ticket", 
      icon: TrendingUp, 
      change: "Live metric",
      isPositive: true
    },
    { 
      title: "Active Dining Tables", 
      value: `${occupiedTablesCount} / ${totalTablesCount}`, 
      subtext: `${tableOccupancyRate}% floor capacity active`, 
      icon: Utensils, 
      change: `${tableOccupancyRate}%`,
      isPositive: true
    },
    { 
      title: "Pending Reservations", 
      value: String(pendingReservationsCount), 
      subtext: pendingReservationsCount > 0 ? "Reserved tables pending" : "No pending reservations", 
      icon: CalendarCheck, 
      change: `${pendingReservationsCount} booked`,
      isPositive: true
    },
  ];

  // Map real orders to RecentOrdersTable format
  const mappedOrders: OrderTableRow[] = orders.slice(0, 6).map((ord) => ({
    id: ord.id,
    orderNumber: ord.orderNumber || `#ORD-${ord.id.slice(-4)}`,
    tableName: ord.tableName ? `Table ${ord.tableName}` : ord.tableNumber ? `Table ${ord.tableNumber}` : ord.orderType === "QR_ORDER" ? "QR Table" : "Direct Order",
    orderType: (ord.orderType || "DINE_IN") as any,
    status: (ord.status || "PLACED") as any,
    paymentStatus: (ord.paymentStatus === "PAID" ? "PAID" : "PENDING") as any,
    itemsCount: ord.items?.length || 1,
    itemsSummary: ord.items?.map((i) => `${i.quantity}x ${i.menuItemName || "Item"}`).join(", ") || "Dining items",
    grandTotal: Number(ord.grandTotal || 0),
    timeAgo: ord.createdAt ? new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
  }));

  // Map real menu items to Top Product Performance format with real order counts
  const mappedProducts = menuItems.slice(0, 5).map((item, idx) => {
    let count = 0;
    let rev = 0;
    orders.forEach((o) => {
      o.items?.forEach((it) => {
        if (it.menuItemId === item.id || it.menuItemName === item.name) {
          count += Number(it.quantity || 1);
          rev += Number(it.totalPrice || (it.unitPrice * it.quantity) || 0);
        }
      });
    });

    return {
      id: item.id || String(idx + 1),
      name: item.name,
      category: item.categoryName || "Main Menu",
      ordersCount: count,
      revenue: rev,
      margin: (count > 10 ? "Top Seller" : count > 5 ? "High" : count > 0 ? "Trending" : "Medium") as any,
      isVeg: Boolean(item.isVeg),
      status: (item.isAvailable !== false ? "IN_STOCK" : "OUT_OF_STOCK") as any
    };
  });

  // Map real tables to TableOccupancyMatrix
  const mappedTables: TableItem[] = tables.map((t) => {
    const activeOrder = orders.find(
      (o) => (o.tableId === t.id || o.tableName === t.tableNumber || o.tableNumber === t.tableNumber) && 
             o.status !== "COMPLETED" && 
             o.status !== "CANCELLED" && 
             o.paymentStatus !== "PAID"
    );
    return {
      id: t.id,
      name: t.tableNumber ? `T-${t.tableNumber}` : `T-${t.id.slice(-2)}`,
      zone: t.section || "Ground Main",
      capacity: t.capacity || 4,
      status: (t.status || "AVAILABLE") as any,
      orderNumber: activeOrder ? (activeOrder.orderNumber || `#ORD-${activeOrder.id.slice(-4)}`) : undefined,
      covers: t.capacity,
      duration: activeOrder ? "In Service" : undefined,
      amount: activeOrder ? Number(activeOrder.grandTotal || 0) : undefined,
    };
  });

  // Map real inventory alerts
  const mappedAlerts: AlertItem[] = inventoryItems
    .filter((i) => Number(i.currentStock) <= Number(i.minThreshold))
    .slice(0, 5)
    .map((i) => ({
      id: i.id,
      type: "INVENTORY",
      severity: Number(i.currentStock) <= 0 ? "HIGH" : "MEDIUM",
      title: `Low Stock: ${i.name}`,
      description: `${i.currentStock} ${i.unit || "units"} remaining (minimum threshold is ${i.minThreshold} ${i.unit || "units"}).`,
      timestamp: "Live Alert",
      actionUrl: "/inventory",
      actionLabel: "Restock",
    }));

  // Dynamically calculate last 7 days sales and orders
  const dayLabels: string[] = [];
  const salesByDay: number[] = [];
  const expensesByDay: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayLabels.push(d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit" }));

    const dStr = d.toISOString().split("T")[0];
    const dayTotal = orders
      .filter((o) => o.createdAt && o.createdAt.startsWith(dStr) && o.paymentStatus === "PAID")
      .reduce((sum, o) => sum + Number(o.grandTotal || 0), 0);
    salesByDay.push(dayTotal);
    expensesByDay.push(Math.round(dayTotal * 0.4));
  }

  // Dynamic channel breakdown
  const dineInCount = orders.filter((o) => o.orderType === "DINE_IN").length;
  const qrCount = orders.filter((o) => o.orderType === "QR_ORDER").length;
  const takeawayCount = orders.filter((o) => o.orderType === "TAKEAWAY" || o.orderType === "DELIVERY").length;
  const totalOrders = dineInCount + qrCount + takeawayCount;

  const channelBreakdown = totalOrders > 0
    ? [
        { label: "Dine-In Orders", value: Math.round((dineInCount / totalOrders) * 100), color: "#0F3D2E" },
        { label: "QR Self-Orders", value: Math.round((qrCount / totalOrders) * 100), color: "#FF6A3D" },
        { label: "Takeaways", value: Math.round((takeawayCount / totalOrders) * 100), color: "#71717A" },
      ]
    : [
        { label: "Dine-In Orders", value: 0, color: "#0F3D2E" },
        { label: "QR Self-Orders", value: 0, color: "#FF6A3D" },
        { label: "Takeaways", value: 0, color: "#71717A" },
      ];

  // Dynamic hourly order distribution
  const hourlyCategories = ["11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM"];
  const hourDineIn = new Array(12).fill(0);
  const hourQr = new Array(12).fill(0);
  const hourTakeaway = new Array(12).fill(0);

  orders.forEach((o) => {
    if (o.createdAt) {
      const hour = new Date(o.createdAt).getHours();
      const index = hour - 11;
      if (index >= 0 && index < 12) {
        if (o.orderType === "DINE_IN") hourDineIn[index]++;
        else if (o.orderType === "QR_ORDER") hourQr[index]++;
        else hourTakeaway[index]++;
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* 1. Executive Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742]/40 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F3D2E] dark:text-[#FAFAF8] font-sans">
              {greeting} · {tenant?.name || "The Royal Bistro"}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/20">
              Overview
            </span>
          </div>
          <p className="text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70">
            Real-time restaurant intelligence, floor seating, KDS load &amp; financial velocity for{" "}
            <span className="text-[#0F3D2E] dark:text-white font-semibold">{branch?.name || "Indiranagar Flagship"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <MorphButton
            size="sm"
            onClick={fetchAnalytics}
            className="bg-[#FAFAF8] dark:bg-[#165742] border border-[#E5E7EB] dark:border-[#165742] text-xs font-semibold text-[#0F3D2E] dark:text-white hover:bg-white hover:border-[#FF6A3D]/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Telemetry</span>
          </MorphButton>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAFAF8] dark:bg-[#165742]/60 border border-[#E5E7EB] dark:border-[#165742] text-xs font-medium text-[#0F3D2E] dark:text-[#E5E7EB]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#0F3D2E] dark:text-white font-semibold">Service Live</span>
          </div>
        </div>
      </div>

      {/* 2. Executive Metric Cards Grid (5 Column Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A291F] border border-[#E5E7EB] dark:border-[#165742]/40 hover:border-[#FF6A3D]/40 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6B7280] dark:text-[#E5E7EB]/70">
                  {kpi.title}
                </span>
                <div className="w-7 h-7 rounded-md bg-[#FF6A3D]/10 border border-[#FF6A3D]/20 flex items-center justify-center text-[#FF6A3D]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F3D2E] dark:text-white mb-1 font-mono tracking-tight">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#6B7280] dark:text-[#E5E7EB]/60 truncate max-w-[120px]">
                    {kpi.subtext}
                  </span>
                  <span className="font-mono font-bold text-[#FF6A3D]">
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Primary Financial & Channel Trajectory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left 8 Cols: Sales Overview Bar Chart */}
        <div className="lg:col-span-8">
          <SalesOverview
            categories={dayLabels}
            salesData={salesByDay}
            expenseData={expensesByDay}
          />
        </div>

        {/* Right 4 Cols: Channel Breakdown & Monthly Run Rate */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <YearlyBreakup
            totalAmount={computedTodayRevenue}
            growthPercentage={0}
            breakdown={channelBreakdown}
          />
          <MonthlyEarnings
            amount={computedTodayRevenue * 30}
            growthPercentage={0}
            sparklineData={salesByDay}
          />
        </div>
      </div>

      {/* 4. Hourly Order Volume & Kitchen Pacing Chart */}
      <div>
        <OrderVolumeChart
          categories={hourlyCategories}
          dineInData={hourDineIn}
          takeawayData={hourTakeaway}
          qrSelfOrderData={hourQr}
        />
      </div>

      {/* 5. Floor Operations Matrix & Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left 8 Cols: Table Occupancy Floor Matrix */}
        <div className="lg:col-span-8">
          <TableOccupancyMatrix
            tables={mappedTables}
            totalOccupied={occupiedTablesCount}
            totalTables={totalTablesCount}
          />
        </div>

        {/* Right 4 Cols: Operational Alerts */}
        <div className="lg:col-span-4">
          <OperationalAlerts alerts={mappedAlerts} />
        </div>
      </div>

      {/* 6. Live Tickets & Menu Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left 7 Cols: Recent Orders Table */}
        <div className="lg:col-span-7">
          <RecentOrdersTable orders={mappedOrders} />
        </div>

        {/* Right 5 Cols: Top Menu Item Velocity */}
        <div className="lg:col-span-5">
          <ProductPerformance products={mappedProducts} />
        </div>
      </div>

      {/* 7. Core Operational Modules Navigation Hub */}
      <div className="pt-2">
        <RestaurantQuickPillars />
      </div>
    </div>
  );
}
