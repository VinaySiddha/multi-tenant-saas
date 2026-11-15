"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSubscriptionStore, Plan } from "@/store/useSubscriptionStore";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Building2,
} from "lucide-react";

export function TrialPaywallModal() {
  const { subscription, plans, fetchPlans, upgradePlan, loading, error } = useSubscriptionStore();
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>("growth");
  const [billingInterval, setBillingInterval] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (plans.length === 0) {
      fetchPlans();
    }
  }, [plans.length, fetchPlans]);

  if (!subscription) return null;

  // Only show if operational access is restricted
  if (subscription.canPerformOperations && subscription.status !== "TRIAL_EXPIRED") {
    return null;
  }

  const handleUpgrade = async (code: string) => {
    const success = await upgradePlan(code, billingInterval, "RAZORPAY");
    if (success) {
      setSuccessMsg("Subscription activated! Operational access restored.");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-card border border-border/80 rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-card-foreground">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>14-Day Free Trial Expired</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Continue Using Sapru Restaurant Suite
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Your 14-day free trial has completed. Choose a subscription tier to reactivate POS, KDS, and table management.
          </p>

          {/* Data preservation reassurance */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 py-2 px-4 rounded-lg border border-emerald-500/20">
            <Database className="w-4 h-4 shrink-0" />
            <span>Zero Data Loss Guarantee: All your menus, tables, staff, and reports are safely preserved.</span>
          </div>
        </div>

        {/* Interval toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-medium border border-border">
            <button
              onClick={() => setBillingInterval("MONTHLY")}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                billingInterval === "MONTHLY"
                  ? "bg-card shadow-sm text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval("ANNUAL")}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                billingInterval === "ANNUAL"
                  ? "bg-card shadow-sm text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#FF6A3D] text-white rounded font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Starter */}
          <div
            onClick={() => setSelectedPlanCode("starter")}
            className={`cursor-pointer rounded-xl border p-5 transition-all relative flex flex-col justify-between ${
              selectedPlanCode === "starter"
                ? "border-[#FF6A3D] ring-2 ring-[#FF6A3D]/20 bg-[#FF6A3D]/5"
                : "border-border hover:border-border/80 bg-card"
            }`}
          >
            <div>
              <div className="text-sm font-bold">Starter</div>
              <p className="text-xs text-muted-foreground mt-1">Core POS for single outlet</p>
              <div className="mt-3">
                <span className="text-2xl font-black">
                  ₹{billingInterval === "ANNUAL" ? "832" : "999"}
                </span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Core POS & Billing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Menu & Category Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Basic Sales Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>1 Restaurant Outlet</span>
                </li>
              </ul>
            </div>

            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleUpgrade("starter");
              }}
              className="mt-6 w-full py-2 px-3 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors"
            >
              {loading && selectedPlanCode === "starter" ? "Processing..." : "Select Starter"}
            </button>
          </div>

          {/* Growth - Suggested */}
          <div
            onClick={() => setSelectedPlanCode("growth")}
            className={`cursor-pointer rounded-xl border p-5 transition-all relative flex flex-col justify-between ${
              selectedPlanCode === "growth"
                ? "border-[#FF6A3D] ring-2 ring-[#FF6A3D]/30 bg-[#FF6A3D]/5"
                : "border-border hover:border-border/80 bg-card"
            }`}
          >
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-[#FF6A3D] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Suggested
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <span>Growth</span>
                <Sparkles className="w-3.5 h-3.5 text-[#FF6A3D]" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Full operational restaurant suite</p>
              <div className="mt-3">
                <span className="text-2xl font-black text-[#FF6A3D]">
                  ₹{billingInterval === "ANNUAL" ? "1,665" : "1,999"}
                </span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A3D] shrink-0" />
                  <span className="font-medium text-foreground">Everything in Starter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A3D] shrink-0" />
                  <span>Kitchen Display System (KDS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A3D] shrink-0" />
                  <span>QR Ordering & Tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A3D] shrink-0" />
                  <span>Staff Roles & Advanced Reports</span>
                </li>
              </ul>
            </div>

            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleUpgrade("growth");
              }}
              className="mt-6 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#FF6A3D] hover:bg-[#FF6A3D]/90 text-white shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{loading && selectedPlanCode === "growth" ? "Processing..." : "Upgrade to Growth"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Multi-Outlet */}
          <div
            onClick={() => setSelectedPlanCode("multi_outlet")}
            className={`cursor-pointer rounded-xl border p-5 transition-all relative flex flex-col justify-between ${
              selectedPlanCode === "multi_outlet"
                ? "border-[#FF6A3D] ring-2 ring-[#FF6A3D]/20 bg-[#FF6A3D]/5"
                : "border-border hover:border-border/80 bg-card"
            }`}
          >
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-500" />
                <span>Multi-Outlet</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Multi-branch chain administration</p>
              <div className="mt-3">
                <span className="text-2xl font-black">
                  ₹{billingInterval === "ANNUAL" ? "3,332" : "3,999"}
                </span>
                <span className="text-xs text-muted-foreground"> / month</span>
              </div>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span className="font-medium text-foreground">Everything in Growth</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Centralized Menu & Global Pricing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Branch-level Role Scoping</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Advanced Audit Trail & API Access</span>
                </li>
              </ul>
            </div>

            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleUpgrade("multi_outlet");
              }}
              className="mt-6 w-full py-2 px-3 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors"
            >
              {loading && selectedPlanCode === "multi_outlet" ? "Processing..." : "Select Multi-Outlet"}
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure billing via UPI AutoPay, NetBanking & Cards (Razorpay)</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/billing" className="hover:text-foreground underline">
              View Billing History
            </Link>
            <Link href="/support" className="hover:text-foreground underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
