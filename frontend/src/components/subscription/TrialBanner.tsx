"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSubscriptionStore } from "@/store/useSubscriptionStore";
import { Clock, Sparkles, AlertTriangle, ArrowRight, X, ShieldCheck } from "lucide-react";

export function TrialBanner() {
  const { subscription, setUpgradeModalOpen } = useSubscriptionStore();
  const [dismissed, setDismissed] = useState(false);

  if (!subscription) return null;

  // Don't show if active paid subscription
  if (subscription.status === "ACTIVE") return null;

  const isExpired = subscription.status === "TRIAL_EXPIRED" || !subscription.canPerformOperations;
  const daysLeft = subscription.daysRemainingInTrial ?? 0;
  const milestone = subscription.trialMilestone;

  // Milestone messaging per Sapru spec Section 3
  const getMilestoneInfo = () => {
    if (isExpired) {
      return {
        title: "Trial Period Ended",
        desc: "Live ordering and KDS are restricted. Your restaurant data, menus, and reports are safely preserved.",
        badge: "Action Required",
        color: "bg-red-500/10 border-red-500/30 text-red-500",
        btnColor: "bg-red-600 hover:bg-red-700 text-white",
      };
    }

    if (daysLeft <= 1) {
      return {
        title: `Trial Ending Soon: ${daysLeft === 1 ? "1 day left" : "Final hours"}`,
        desc: "Keep your kitchen orders, POS billing, and staff active without interruption.",
        badge: "Urgent",
        color: "bg-amber-500/10 border-amber-500/30 text-amber-500",
        btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
      };
    }

    if (daysLeft <= 3) {
      return {
        title: `${daysLeft} Days Remaining in Free Trial`,
        desc: "Day 12 Milestone: Review your restaurant setup and choose a plan before the trial elapses.",
        badge: "Ending Soon",
        color: "bg-amber-500/10 border-amber-500/30 text-amber-500",
        btnColor: "bg-[#FF6A3D] hover:bg-[#FF6A3D]/90 text-white",
      };
    }

    if (daysLeft <= 7) {
      return {
        title: `Mid-Trial Reminder: ${daysLeft} Days Remaining`,
        desc: "Day 7 Milestone: Enjoying Sapru? Compare our monthly and annual plans to lock in your pricing.",
        badge: "Trial Active",
        color: "bg-blue-500/10 border-blue-500/30 text-blue-500",
        btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
      };
    }

    if (daysLeft <= 11) {
      return {
        title: `Trial Active: ${daysLeft} Days Left`,
        desc: "Day 3 Milestone: Need assistance adding menu items or configuring billing printers? We are here to help.",
        badge: "Day 3 Setup",
        color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
        btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
      };
    }

    return {
      title: "Welcome to Sapru · 14-Day Free Trial",
      desc: "Full operational access to the Growth plan at ₹0. No credit card required.",
      badge: "14 Days Free",
      color: "bg-[#FF6A3D]/10 border-[#FF6A3D]/30 text-[#FF6A3D]",
      btnColor: "bg-[#FF6A3D] hover:bg-[#FF6A3D]/90 text-white",
    };
  };

  const info = getMilestoneInfo();

  if (dismissed && !isExpired && daysLeft > 3) {
    return null;
  }

  return (
    <div className={`relative px-4 py-2.5 border-b backdrop-blur-md transition-all ${info.color}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-current/10 shrink-0 font-bold">
            {isExpired ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight">{info.title}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-current/15">
                {info.badge}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">
              {info.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/billing"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${info.btnColor}`}
          >
            <span>{isExpired ? "Reactivate Plan" : "Choose Plan"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {!isExpired && daysLeft > 3 && (
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              title="Dismiss for now"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
