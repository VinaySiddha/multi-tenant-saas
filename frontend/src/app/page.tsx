"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingNavbar from "@/components/FloatingNavbar";
import {
  ArrowRight,
  Play,
  TrendingUp,
  Activity,
  Layers,
  BarChart3,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Shield,
  Zap,
  Clock,
  Compass,
  LineChart,
  Cpu,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  // Section 2: One Connected Workspace Active View Tab
  const [workspaceTab, setWorkspaceTab] = useState<
    "overview" | "performance" | "activity" | "insights" | "operations"
  >("overview");

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0B0B0B] font-sans selection:bg-[#FF6A3D] selection:text-white antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. FLOATING CAPSULE NAVIGATION BAR (LOCKED / UNTOUCHED)                     */}
      {/* ========================================================================= */}
      <FloatingNavbar
        links={[
          { label: "Product", href: "#product-os" },
          { label: "Solutions", href: "#stories" },
          { label: "Intelligence", href: "#intelligence" },
          { label: "Resources", href: "#integrations" },
          { label: "Pricing", href: "#pricing" },
        ]}
        email="hello@sapru.io"
      />

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (LOCKED / UNTOUCHED)                                      */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#FF6A3D]/10 via-[#0F3D2E]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow & Hero Copy */}
          <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[11px] font-bold tracking-widest text-[#0F3D2E] uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF6A3D] animate-pulse" />
              <span>THE RESTAURANT OPERATING SYSTEM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-[1.08]">
              Your restaurant.
              <br />
              <span className="text-[#FF6A3D]">One intelligent system.</span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-lg sm:text-xl text-[#0B0B0B]/75 max-w-2xl mx-auto font-normal leading-relaxed">
              From the first order to the final report, Sapru brings your restaurant’s
              operations together.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/terminal"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-sm transition-all shadow-lg shadow-[#FF6A3D]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#workspace"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-[#FAFAF8] text-[#0F3D2E] font-semibold text-sm border border-[#E5E7EB] transition hover:-translate-y-0.5 shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#0F3D2E]/10 flex items-center justify-center text-[#0F3D2E]">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>See Sapru in action</span>
              </a>
            </div>
          </div>

          {/* Visual Layer: Premium Restaurant Environment + Floating Dashboard Interface */}
          <div className="relative max-w-5xl mx-auto">
            {/* Restaurant Environmental Container */}
            <div className="relative rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-2xl bg-[#0A291F]">
              {/* Background Restaurant Photography */}
              <div className="relative h-[480px] sm:h-[580px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop"
                  alt="Fine dining restaurant environment"
                  fill
                  priority
                  className="object-cover opacity-35 filter brightness-75 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A291F] via-[#0F3D2E]/60 to-transparent" />
              </div>

              {/* Floating Sapru Dashboard Interface Overlay */}
              <div className="absolute inset-x-4 sm:inset-x-8 top-8 bottom-8 flex flex-col justify-between">
                {/* Top Telemetry Floating Card */}
                <div className="bg-[#0F3D2E]/90 backdrop-blur-xl border border-[#FAFAF8]/20 rounded-2xl p-4 sm:p-6 text-white shadow-2xl max-w-2xl mx-auto w-full">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] text-[#0F3D2E] flex items-center justify-center font-bold text-sm">
                        S
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-poppins">
                          The Grand Pavilion • Live Operations
                        </h4>
                        <p className="text-[11px] text-[#E5E7EB]/70">
                          Main Dining Room &amp; 4 Online Channels Synchronized
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6A3D]/20 text-[#FF6A3D] text-[11px] font-bold border border-[#FF6A3D]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D] animate-ping" />
                      <span>LIVE TELEMETRY</span>
                    </div>
                  </div>

                  {/* 4 Core Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div>
                      <span className="text-[11px] text-[#E5E7EB]/70 block font-medium">
                        Today’s Revenue
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 block font-poppins">
                        ₹48,320
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold inline-flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> +18.4% vs yesterday
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#E5E7EB]/70 block font-medium">
                        Total Orders
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 block font-poppins">
                        124
                      </span>
                      <span className="text-[10px] text-[#E5E7EB]/60">32 Dine-In • 92 Web</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#E5E7EB]/70 block font-medium">
                        Avg. Ticket Prep
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 block font-poppins">
                        11m 40s
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        3m faster than SLA
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#E5E7EB]/70 block font-medium">
                        Top Selling Dish
                      </span>
                      <span className="text-sm font-bold text-white mt-1 block truncate">
                        Dum Biryani (48)
                      </span>
                      <span className="text-[10px] text-[#FF6A3D] font-bold">
                        ₹18,240 gross
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Live Activity Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Pill: Table 4 Live Ticket */}
                  <div className="bg-[#FAFAF8]/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl p-3.5 shadow-xl text-[#0B0B0B] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center font-bold text-xs">
                        T-04
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0F3D2E]">Table 4 (4 Guests)</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF6A3D]/15 text-[#FF6A3D]">
                            Preparing • 4m
                          </span>
                        </div>
                        <p className="text-[11px] text-[#0B0B0B]/70 truncate max-w-[200px] sm:max-w-xs">
                          2x Hyderabadi Biryani, 1x Butter Naan, 2x Fresh Lime
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0F3D2E]">₹1,480</span>
                  </div>

                  {/* Right Pill: Swiggy / Online Delivery Sync */}
                  <div className="bg-[#FAFAF8]/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl p-3.5 shadow-xl text-[#0B0B0B] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FF6A3D]/15 text-[#FF6A3D] flex items-center justify-center font-bold text-xs">
                        WEB
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0F3D2E]">
                            Order #1049 • Direct Web
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700">
                            Ready for Pickup
                          </span>
                        </div>
                        <p className="text-[11px] text-[#0B0B0B]/70">
                          1x Paneer Tikka, 1x Dal Makhani, 4x Roti (UPI Paid)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0F3D2E]">₹890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1 — WHAT SAPRU PROVIDES                                           */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 lg:py-36 bg-[#FAFAF8] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-20 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
              Everything you need to run your restaurant.
            </h2>
            <p className="text-base sm:text-lg text-[#0B0B0B]/70 font-normal leading-relaxed">
              Sapru brings the essential parts of your restaurant operation together in one clear workspace.
            </p>
          </div>

          {/* 5 Broad Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10 pt-6">
            {[
              {
                index: "01",
                title: "RUN",
                description: "Manage the everyday operation.",
              },
              {
                index: "02",
                title: "UNDERSTAND",
                description: "See what is happening across your business.",
              },
              {
                index: "03",
                title: "CONTROL",
                description: "Keep everything organized and connected.",
              },
              {
                index: "04",
                title: "IMPROVE",
                description: "Make clearer decisions from your business information.",
              },
              {
                index: "05",
                title: "GROW",
                description: "Build a stronger foundation for the future.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group pt-6 border-t border-[#E5E7EB] hover:border-[#FF6A3D] transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-semibold text-[#6B7280] block mb-4 group-hover:text-[#FF6A3D] transition-colors">
                    {item.index}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F3D2E] font-poppins mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#0B0B0B]/70 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — ONE CONNECTED WORKSPACE                                       */}
      {/* ========================================================================= */}
      <section id="workspace" className="py-24 sm:py-32 lg:py-36 bg-[#0F3D2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              THE WORKSPACE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-poppins leading-tight">
              One place for your entire operation.
            </h2>
            <p className="text-base sm:text-lg text-[#E5E7EB]/80 font-normal leading-relaxed">
              Sapru brings your restaurant’s everyday operations and business information together in one clean workspace.
            </p>

            {/* Navigation Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {[
                { key: "overview", label: "Overview" },
                { key: "performance", label: "Performance" },
                { key: "activity", label: "Activity" },
                { key: "insights", label: "Insights" },
                { key: "operations", label: "Operations" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setWorkspaceTab(tab.key as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    workspaceTab === tab.key
                      ? "bg-white text-[#0F3D2E] shadow-sm"
                      : "text-[#E5E7EB]/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Large Realistic Product Interface Showcase */}
          <div className="max-w-5xl mx-auto rounded-3xl border border-[#165742] bg-[#0A291F] p-6 sm:p-10 shadow-2xl">
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-[#165742]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#FF6A3D] text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">
                    Sapru Operating System
                  </span>
                  <span className="text-[11px] text-[#E5E7EB]/60 font-mono">
                    Workspace synchronized • Status: Healthy
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#E5E7EB]/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Real-time telemetry</span>
              </div>
            </div>

            {/* Dynamic View Content Based on Tab */}
            {workspaceTab === "overview" && (
              <div className="space-y-6 pt-6">
                {/* 3 Overview Metric Strips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742]">
                    <span className="text-xs font-mono text-[#E5E7EB]/70 block mb-1">
                      Gross Operational Flow
                    </span>
                    <span className="text-2xl font-bold font-mono text-white block">
                      ₹48,320
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
                      +18.4% vs baseline
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742]">
                    <span className="text-xs font-mono text-[#E5E7EB]/70 block mb-1">
                      Active Floor &amp; Remote Load
                    </span>
                    <span className="text-2xl font-bold font-mono text-white block">
                      124 Units
                    </span>
                    <span className="text-[11px] text-[#E5E7EB]/60 font-medium mt-1 inline-block">
                      100% fulfill rate
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742]">
                    <span className="text-xs font-mono text-[#E5E7EB]/70 block mb-1">
                      Pacing Efficiency
                    </span>
                    <span className="text-2xl font-bold font-mono text-white block">
                      11m 40s
                    </span>
                    <span className="text-[11px] text-[#FF6A3D] font-medium mt-1 inline-block">
                      Optimal cycle time
                    </span>
                  </div>
                </div>

                {/* Main Abstract Graph & Flow Preview */}
                <div className="p-6 rounded-2xl bg-[#0F3D2E]/40 border border-[#165742] space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Business Trajectory &amp; Service Velocity</span>
                    <span className="font-mono text-[#E5E7EB]/60">Past 24 Hours</span>
                  </div>

                  {/* Abstract Clean SVG Graph */}
                  <div className="h-44 w-full flex items-end gap-2 pt-4">
                    {[35, 48, 62, 44, 78, 92, 84, 96, 70, 88, 105, 95, 110, 82, 98, 115].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-[#165742] to-[#FF6A3D] group-hover:to-white transition-all opacity-85 group-hover:opacity-100"
                          style={{ height: `${val}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {workspaceTab === "performance" && (
              <div className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742] space-y-3">
                    <span className="text-xs font-mono text-[#E5E7EB]/70 block">
                      Channel Balance
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#E5E7EB]">Dine-In Operations</span>
                        <span className="font-mono text-white font-bold">58%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#165742] rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-[58%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#E5E7EB]">Digital Self-Orders</span>
                        <span className="font-mono text-white font-bold">28%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#165742] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF6A3D] rounded-full w-[28%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#E5E7EB]">Takeaway &amp; Delivery</span>
                        <span className="font-mono text-white font-bold">14%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#165742] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6B7280] rounded-full w-[14%]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono text-[#E5E7EB]/70 block mb-2">
                        Margin Trajectory
                      </span>
                      <p className="text-sm text-[#E5E7EB]/90 leading-relaxed font-normal">
                        Fulfillment efficiency is tracking at optimal capacity. Pacing metrics indicate balanced kitchen loading during peak service periods.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#165742] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#E5E7EB]/60">Operational Health Index</span>
                      <span className="text-emerald-400 font-bold">98.2 / 100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {workspaceTab === "activity" && (
              <div className="space-y-3 pt-6">
                {[
                  { time: "Just now", event: "Settlement verified and register audited", status: "Completed" },
                  { time: "4 mins ago", event: "Station pacing benchmark reached across all channels", status: "Optimal" },
                  { time: "18 mins ago", event: "Multi-point ordering dispatch synchronized", status: "Active" },
                  { time: "32 mins ago", event: "Floor occupancy rebalanced across service zones", status: "Recorded" },
                ].map((act, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#0F3D2E]/60 border border-[#165742] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" />
                      <span className="text-white font-medium">{act.event}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[#E5E7EB]/60">
                      <span className="text-emerald-400">{act.status}</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {workspaceTab === "insights" && (
              <div className="space-y-4 pt-6">
                <div className="p-5 rounded-2xl bg-[#0F3D2E]/80 border border-[#FF6A3D]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6A3D]">
                      STRUCTURED INTELLIGENCE BRIEF
                    </span>
                    <span className="text-[11px] font-mono text-[#E5E7EB]/60">Live Signal</span>
                  </div>
                  <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                    “Dinner operational velocity increased 18% this term. Resource utilization remained balanced throughout peak rush periods.”
                  </p>
                  <p className="text-xs text-[#E5E7EB]/70">
                    Calculated autonomously from consolidated business telemetry.
                  </p>
                </div>
              </div>
            )}

            {workspaceTab === "operations" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
                {[
                  { name: "Terminal Console", role: "Point of Sale", state: "Live" },
                  { name: "Kitchen Display", role: "Pacing Stream", state: "Connected" },
                  { name: "Digital Floorplan", role: "Seating Matrix", state: "Active" },
                  { name: "Stock Intelligence", role: "Depletion Log", state: "Audited" },
                ].map((mod, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#0F3D2E]/60 border border-[#165742] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{mod.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] text-[#E5E7EB]/60 block">{mod.role}</span>
                    <span className="text-[10px] font-mono text-[#FF6A3D] font-semibold">{mod.state}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — SIMPLE BY DESIGN                                              */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 lg:py-36 bg-[#FAFAF8] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-20 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              DESIGN PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
              Less complexity. More clarity.
            </h2>
            <p className="text-base sm:text-lg text-[#0B0B0B]/70 font-normal leading-relaxed">
              Everything you need, without everything getting in the way.
            </p>
          </div>

          {/* 3 Simple Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "EVERYTHING TOGETHER",
                desc: "One connected workspace for your operation.",
              },
              {
                title: "CLEAR BY DESIGN",
                desc: "Information that is easy to understand.",
              },
              {
                title: "BUILT FOR OWNERS",
                desc: "Spend less time managing systems and more time running the business.",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-2 h-2 rounded-full bg-[#FF6A3D]" />
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F3D2E] font-poppins tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#0B0B0B]/70 font-normal leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — HOW SAPRU HELPS                                               */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 lg:py-36 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              OPERATIONAL PROGRESSION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
              How Sapru helps.
            </h2>
            <p className="text-base sm:text-lg text-[#0B0B0B]/70 font-normal leading-relaxed">
              Sapru connects the everyday work of your restaurant with the information you need to make better decisions.
            </p>
          </div>

          {/* Visual Progression: OPERATE → UNDERSTAND → DECIDE → GROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "OPERATE",
                desc: "Coordinate everyday service across every station with clarity.",
              },
              {
                step: "UNDERSTAND",
                desc: "See exact operational patterns and performance as they happen.",
              },
              {
                step: "DECIDE",
                desc: "Act on clean, consolidated business information with confidence.",
              },
              {
                step: "GROW",
                desc: "Build a solid, repeatable foundation for sustainable scale.",
              },
            ].map((phase, idx) => (
              <div
                key={phase.step}
                className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] space-y-4 relative group hover:border-[#FF6A3D] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#FF6A3D]">
                    STEP 0{idx + 1}
                  </span>
                  {idx < 3 && (
                    <ChevronRight className="w-4 h-4 text-[#6B7280] hidden md:block" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0F3D2E] font-poppins tracking-tight">
                  {phase.step}
                </h3>
                <p className="text-xs sm:text-sm text-[#0B0B0B]/70 font-normal leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — PRODUCT PREVIEW                                               */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 lg:py-36 bg-[#0A291F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              PRODUCT PREVIEW
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-poppins leading-tight">
              Designed to keep your business clear.
            </h2>
            <p className="text-base sm:text-lg text-[#E5E7EB]/80 font-normal leading-relaxed">
              Consolidated business telemetry, activity streams, and structured intelligence in one cohesive view.
            </p>
          </div>

          {/* Floating Interface Fragments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Fragment 1: Left 7 Cols - Business Velocity & Activity Fragment */}
            <div className="md:col-span-7 space-y-6">
              {/* Top Dashboard Fragment */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F3D2E] border border-[#165742] space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#165742]">
                  <span className="text-xs font-mono font-bold uppercase text-[#E5E7EB]/70">
                    Live Operational Velocity
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    Optimal Capacity
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-[#E5E7EB]/60 block font-mono">Service Throughput</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">98.8%</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#E5E7EB]/60 block font-mono">Operational Variance</span>
                    <span className="text-2xl font-bold font-mono text-[#FF6A3D] mt-1 block">±0.2%</span>
                  </div>
                </div>
              </div>

              {/* Real-time Activity Stream Fragment */}
              <div className="p-6 rounded-3xl bg-[#0F3D2E]/60 border border-[#165742] space-y-3 shadow-lg">
                <span className="text-xs font-mono font-bold uppercase text-[#E5E7EB]/70 block mb-2">
                  Unified System Log
                </span>
                {[
                  { tag: "FLOOR", msg: "All dining room stations balanced and operational", time: "1m ago" },
                  { tag: "TELEMETRY", msg: "Consolidated register audit synchronized", time: "9m ago" },
                  { tag: "INSIGHT", msg: "Daily service brief prepared for review", time: "24m ago" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-2 border-b border-[#165742]/50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-white">
                        {item.tag}
                      </span>
                      <span className="text-[#E5E7EB]/90">{item.msg}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#E5E7EB]/50">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fragment 2: Right 5 Cols - Intelligence Card & Summary */}
            <div className="md:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#0F3D2E] border border-[#165742] shadow-xl space-y-6">
              <div className="space-y-4">
                <div className="w-8 h-8 rounded-xl bg-[#FF6A3D]/20 text-[#FF6A3D] flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-white font-poppins">
                  Structured Business Insights
                </h3>
                <p className="text-sm text-[#E5E7EB]/80 leading-relaxed font-normal">
                  Sapru continuously evaluates your business data to surface clear operational patterns, helping you make informed decisions effortlessly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A291F] border border-[#165742] space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#FF6A3D] uppercase">
                  Automated Digest
                </span>
                <p className="text-xs text-[#E5E7EB] font-mono">
                  Everything connected. Nothing missed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — FINAL CTA                                                     */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 lg:py-36 bg-[#FAFAF8] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
            A simpler way to run your restaurant.
          </h2>

          <p className="text-lg sm:text-xl text-[#0B0B0B]/70 max-w-xl mx-auto font-normal leading-relaxed">
            Bring your restaurant’s operations together with Sapru.
          </p>

          <div>
            <Link
              href="/terminal"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-sm transition-all shadow-lg shadow-[#FF6A3D]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#6B7280]">
              <span className="w-2 h-2 rounded-full bg-[#0F3D2E]" />
              <span>SAPRU OPERATING SYSTEM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[#0F3D2E] text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <span className="text-sm font-bold text-[#0F3D2E] font-poppins">Sapru</span>
            <span className="text-xs text-[#6B7280]">
              — Restaurant intelligence, built beautifully.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#0B0B0B]/70 font-medium">
            <a href="#workspace" className="hover:text-[#FF6A3D] transition">Workspace</a>
            <Link href="/login" className="hover:text-[#FF6A3D] transition">Sign In</Link>
            <Link href="/terminal" className="hover:text-[#FF6A3D] transition">Terminal</Link>
          </div>

          <div className="text-xs text-[#6B7280] font-mono">
            © 2026 Sapru. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
