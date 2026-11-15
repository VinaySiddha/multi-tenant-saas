"use client";

import React, { useState, useEffect } from "react";
import { useSubscriptionStore, Plan } from "@/store/useSubscriptionStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Building2,
  Receipt,
  Download,
  AlertTriangle,
  ArrowRight,
  Database,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function BillingPage() {
  const { user, tenant } = useAuthStore();
  const {
    subscription,
    plans,
    invoices,
    loading,
    error,
    fetchSubscription,
    fetchPlans,
    fetchInvoices,
    upgradePlan,
  } = useSubscriptionStore();

  const [billingInterval, setBillingInterval] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");
  const [upgradingCode, setUpgradingCode] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
    fetchInvoices();
  }, [fetchSubscription, fetchPlans, fetchInvoices]);

  const handleUpgrade = async (code: string) => {
    setUpgradingCode(code);
    setActionSuccess(null);
    const success = await upgradePlan(code, billingInterval, "RAZORPAY");
    if (success) {
      setActionSuccess(`Successfully upgraded to ${code.toUpperCase()} plan!`);
      setTimeout(() => setActionSuccess(null), 5000);
    }
    setUpgradingCode(null);
  };

  const isTrial = subscription?.status === "TRIALING";
  const isActive = subscription?.status === "ACTIVE";
  const isExpired = subscription?.status === "TRIAL_EXPIRED" || (!isTrial && !isActive);
  const daysLeft = subscription?.daysRemainingInTrial ?? 0;

  // Milestone helper
  const milestones = [
    { day: "Day 0", label: "Trial Starts", desc: "Welcome & setup checklist", active: daysLeft <= 14 },
    { day: "Day 3", label: "Activation Assistance", desc: "Menu & billing configuration", active: daysLeft <= 11 },
    { day: "Day 7", label: "Mid-Trial Reminder", desc: "Plan selection & feature review", active: daysLeft <= 7 },
    { day: "Day 12", label: "Trial Ending Soon", desc: "Lock in subscription pricing", active: daysLeft <= 2 },
    { day: "Day 14", label: "Trial Expires", desc: "Reactivate or restrict live ops", active: daysLeft === 0 || isExpired },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF6A3D]">
            <CreditCard className="w-4 h-4" />
            <span>Sapru Billing Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F3D2E] dark:text-[#FAFAF8] mt-1">
            Subscription & Invoicing
          </h1>
          <p className="text-xs sm:text-sm text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 mt-1">
            Manage your restaurant tier, 14-day free trial status, billing cycle, and official tax invoices.
          </p>
        </div>

        <button
          onClick={() => {
            fetchSubscription();
            fetchInvoices();
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold transition shadow-xs self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Current Status Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Plan Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Subscription
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                    : isTrial
                    ? "bg-[#FF6A3D]/15 text-[#FF6A3D] border border-[#FF6A3D]/30"
                    : "bg-red-500/15 text-red-600 border border-red-500/30"
                }`}
              >
                {isActive ? "Active Subscription" : isTrial ? "14-Day Free Trial" : "Trial Expired"}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-foreground">
                  {subscription?.planName || "Growth"} Tier
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tenant: <span className="font-semibold text-foreground">{tenant?.name || "Active Restaurant"}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-muted-foreground block">Billing Interval</span>
                <span className="text-sm font-bold capitalize text-foreground">
                  {subscription?.billingInterval?.toLowerCase() || "Monthly"}
                </span>
              </div>
            </div>

            {/* Trial Countdown or Cycle Dates */}
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] text-muted-foreground block">Status & Access</span>
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      subscription?.canPerformOperations ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {subscription?.canPerformOperations ? "Full Live Operations" : "Restricted Live Ops"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Trial Days Remaining</span>
                <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF6A3D]" />
                  <span>{isTrial ? `${daysLeft} Days Left` : isActive ? "Paid Active" : "0 Days (Expired)"}</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Next Renewal / Expiry</span>
                <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>
                    {subscription?.trialEndAt
                      ? new Date(subscription.trialEndAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Reassurance banner */}
          <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Tenant data preservation policy: Menus, tables, past orders, and tax invoices are always retained.
            </span>
          </div>
        </div>

        {/* 14-Day Milestone Stepper */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#FF6A3D]" />
              <span>14-Day Free Trial Journey</span>
            </span>

            <div className="mt-4 space-y-3">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${
                      m.active
                        ? "bg-[#FF6A3D] text-white"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">{m.day}: {m.label}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A3D]" />
            <span>Option A: ₹0 Upfront, no credit card required</span>
          </div>
        </div>
      </div>

      {/* 3. Choose / Upgrade Plans Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Available Subscription Plans</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select the right operational tier for your single or multi-outlet restaurant.
            </p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center p-1 bg-muted rounded-xl text-xs font-medium border border-border self-start">
            <button
              onClick={() => setBillingInterval("MONTHLY")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                billingInterval === "MONTHLY"
                  ? "bg-card shadow-sm text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("ANNUAL")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                billingInterval === "ANNUAL"
                  ? "bg-card shadow-sm text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#FF6A3D] text-white rounded font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-border/80 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Starter</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-muted rounded text-muted-foreground">
                  1 Outlet
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Core POS and billing for independent outlets.</p>

              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">
                    ₹{billingInterval === "ANNUAL" ? "832" : "999"}
                  </span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {billingInterval === "ANNUAL" ? "₹9,990 billed annually" : "Billed monthly, excl. taxes"}
                </span>
              </div>

              <div className="mt-6 space-y-2.5 text-xs">
                <div className="font-semibold text-foreground">Included Features:</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Core POS & Fast Table Billing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Menu Catalog & Modifiers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Basic Sales & GST Reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Single Restaurant Branch</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade("starter")}
              disabled={upgradingCode !== null}
              className="mt-6 w-full py-2.5 px-4 rounded-xl border border-border hover:bg-muted font-bold text-xs transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>{upgradingCode === "starter" ? "Activating..." : "Select Starter (₹999)"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Growth Plan - Suggested */}
          <div className="rounded-2xl border-2 border-[#FF6A3D] bg-card p-6 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 px-3 py-0.5 bg-[#FF6A3D] text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
              Recommended for Restaurants
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">Growth</h3>
                  <Sparkles className="w-4 h-4 text-[#FF6A3D]" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-[#FF6A3D]/10 text-[#FF6A3D] rounded">
                  All-in-One
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Complete operational restaurant suite with KDS and QR ordering.
              </p>

              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#FF6A3D]">
                    ₹{billingInterval === "ANNUAL" ? "1,665" : "1,999"}
                  </span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {billingInterval === "ANNUAL" ? "₹19,990 billed annually" : "Billed monthly, excl. taxes"}
                </span>
              </div>

              <div className="mt-6 space-y-2.5 text-xs">
                <div className="font-semibold text-foreground">Everything in Starter, plus:</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span className="font-medium text-foreground">Kitchen Display System (KDS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>QR Ordering & Interactive Floorplan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Staff Roles & Granular Permissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Advanced Telemetry & Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Priority Support Response</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade("growth")}
              disabled={upgradingCode !== null}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#FF6A3D] hover:bg-[#FF6A3D]/90 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>{upgradingCode === "growth" ? "Activating..." : "Upgrade to Growth (₹1,999)"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Multi-Outlet Plan */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-border/80 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-500" />
                  <h3 className="text-lg font-bold text-foreground">Multi-Outlet</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-purple-500/10 text-purple-600 rounded">
                  Chain Suite
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Multi-branch chain centralized management.</p>

              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-foreground">
                    ₹{billingInterval === "ANNUAL" ? "3,332" : "3,999"}
                  </span>
                  <span className="text-xs text-muted-foreground"> / month</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {billingInterval === "ANNUAL" ? "₹39,990 billed annually" : "Includes up to 5 branch outlets"}
                </span>
              </div>

              <div className="mt-6 space-y-2.5 text-xs">
                <div className="font-semibold text-foreground">Everything in Growth, plus:</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span className="font-medium text-foreground">Multi-Branch Centralized Administration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Global Menu Sync & Branch Overrides</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Cross-Branch Reporting & Consolidation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Branch-Scoped RBAC Governance</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleUpgrade("multi_outlet")}
              disabled={upgradingCode !== null}
              className="mt-6 w-full py-2.5 px-4 rounded-xl border border-border hover:bg-muted font-bold text-xs transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>{upgradingCode === "multi_outlet" ? "Activating..." : "Select Multi-Outlet (₹3,999)"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Invoices & Billing History */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#FF6A3D]" />
            <h3 className="text-base font-bold text-foreground">Billing Invoices & Receipts</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {invoices.length} {invoices.length === 1 ? "Invoice" : "Invoices"} on record
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
            <Receipt className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="font-medium text-foreground">No invoices generated yet</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Invoices will automatically appear here once you activate a paid plan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-2.5 px-3">Invoice Number</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Base Amount</th>
                  <th className="py-2.5 px-3">GST (18%)</th>
                  <th className="py-2.5 px-3">Total Paid</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/40 transition">
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3 font-medium">₹{inv.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 text-muted-foreground">
                      ₹{inv.taxAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3 font-bold text-foreground">
                      ₹{inv.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert(`Receipt ${inv.invoiceNumber} verified on Razorpay`)}
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition"
                        title="Download Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
