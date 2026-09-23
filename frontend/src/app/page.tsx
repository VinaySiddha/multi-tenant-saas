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
  Receipt,
  ChefHat,
  QrCode,
  Package,
  Users,
  Check,
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
          { label: "Product", href: "#workspace" },
          { label: "Capabilities", href: "#capabilities" },
          { label: "Why Sapru", href: "#why-sapru" },
          { label: "How It Works", href: "#how-it-works" },
          { label: "Terminal", href: "/terminal" },
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
              <span>RESTAURANT MANAGEMENT SOFTWARE</span>
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
      <section id="capabilities" className="py-24 sm:py-32 lg:py-36 bg-[#FAFAF8] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-20 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              ALL-IN-ONE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
              Everything you need to run your restaurant.
            </h2>
            <p className="text-base sm:text-lg text-[#0B0B0B]/70 font-normal leading-relaxed">
              Sapru brings your daily billing, kitchen workflow, and business reports into one clear, easy-to-use software.
            </p>
          </div>

          {/* 5 Broad Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10 pt-6">
            {[
              {
                index: "01",
                title: "RUN",
                description: "Fast POS billing, quick order punching, and smooth floor service.",
              },
              {
                index: "02",
                title: "UNDERSTAND",
                description: "Live visibility into daily sales, peak hours, and order volumes.",
              },
              {
                index: "03",
                title: "CONTROL",
                description: "Keep your kitchen, table seating, and inventory organized.",
              },
              {
                index: "04",
                title: "IMPROVE",
                description: "Clear numbers and reports that help you make better daily decisions.",
              },
              {
                index: "05",
                title: "GROW",
                description: "Reliable software built to support your restaurant as you expand.",
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
              UNIFIED SOFTWARE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-poppins leading-tight">
              One place for your entire operation.
            </h2>
            <p className="text-base sm:text-lg text-[#E5E7EB]/80 font-normal leading-relaxed">
              No more jumping between separate billing machines and manual logs. Everything stays synchronized in real time.
            </p>

            {/* Navigation Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {[
                { key: "overview", label: "Overview" },
                { key: "performance", label: "Performance" },
                { key: "activity", label: "Live Activity" },
                { key: "insights", label: "Daily Insights" },
                { key: "operations", label: "Stations & Status" },
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
                    Sapru Restaurant Platform
                  </span>
                  <span className="text-[11px] text-[#E5E7EB]/60 font-mono">
                    All terminals active • System status: Live
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#E5E7EB]/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Real-time sync</span>
              </div>
            </div>

            {/* Dynamic View Content Based on Tab */}
            {workspaceTab === "overview" && (
              <div className="space-y-6 pt-6">
                {/* 3 Overview Metric Strips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742]">
                    <span className="text-xs font-mono text-[#E5E7EB]/70 block mb-1">
                      Today's Gross Sales
                    </span>
                    <span className="text-2xl font-bold font-mono text-white block">
                      ₹48,320
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
                      +18.4% vs yesterday
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742]">
                    <span className="text-xs font-mono text-[#E5E7EB]/70 block mb-1">
                      Orders Fulfilled
                    </span>
                    <span className="text-2xl font-bold font-mono text-white block">
                      124 Tickets
                    </span>
                    <span className="text-[11px] text-[#E5E7EB]/60 font-medium mt-1 inline-block">
                      100% order accuracy
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F3D2E]/60 border border-[#165742]">
                    <span className="text-xs font-mono text-[#E5E7EB]/70 block mb-1">
                      Average Kitchen Time
                    </span>
                    <span className="text-2xl font-bold font-mono text-white block">
                      11m 40s
                    </span>
                    <span className="text-[11px] text-[#FF6A3D] font-medium mt-1 inline-block">
                      Fast ticket turnaround
                    </span>
                  </div>
                </div>

                {/* Main Abstract Graph & Flow Preview */}
                <div className="p-6 rounded-2xl bg-[#0F3D2E]/40 border border-[#165742] space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Daily Sales &amp; Order Volume Flow</span>
                    <span className="font-mono text-[#E5E7EB]/60">Live Past 24 Hours</span>
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
                      Order Breakdown by Channel
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#E5E7EB]">Dine-In Orders</span>
                        <span className="font-mono text-white font-bold">58%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#165742] rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full w-[58%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#E5E7EB]">QR Self-Ordering</span>
                        <span className="font-mono text-white font-bold">28%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#165742] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF6A3D] rounded-full w-[28%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#E5E7EB]">Takeaway &amp; Pickup</span>
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
                        Kitchen Efficiency Summary
                      </span>
                      <p className="text-sm text-[#E5E7EB]/90 leading-relaxed font-normal">
                        Order fulfillment is tracking smoothly. Kitchen display timers indicate zero bottleneck during peak lunch and dinner hours.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#165742] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#E5E7EB]/60">Daily Service Score</span>
                      <span className="text-emerald-400 font-bold">98.5% on-time</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {workspaceTab === "activity" && (
              <div className="space-y-3 pt-6">
                {[
                  { time: "Just now", event: "Bill settled via UPI at Table 4 (₹1,480)", status: "Settled" },
                  { time: "3 mins ago", event: "Kitchen marked Order #1049 ready for takeaway", status: "Ready" },
                  { time: "12 mins ago", event: "New guest order placed via Table QR code", status: "In Kitchen" },
                  { time: "28 mins ago", event: "Cash drawer shift balanced with zero discrepancy", status: "Audited" },
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
                      DAILY EXECUTIVE SUMMARY
                    </span>
                    <span className="text-[11px] font-mono text-[#E5E7EB]/60">Today's Highlight</span>
                  </div>
                  <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                    “Dinner revenue grew 18% this week. Table turnover was 22 minutes faster on QR-enabled sections.”
                  </p>
                  <p className="text-xs text-[#E5E7EB]/70">
                    Generated automatically at the end of each shift for restaurant owners.
                  </p>
                </div>
              </div>
            )}

            {workspaceTab === "operations" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
                {[
                  { name: "POS Terminal", role: "Cashier Billing", state: "Live" },
                  { name: "Kitchen Display (KDS)", role: "Kitchen Pacing", state: "Connected" },
                  { name: "Table Floorplan", role: "Floor Seating", state: "Active" },
                  { name: "Inventory Alerts", role: "Stock Tracking", state: "Audited" },
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
      {/* SECTION 3 — SIMPLE BY DESIGN (Simpler & Benefit-Driven)                    */}
      {/* ========================================================================= */}
      <section id="why-sapru" className="py-24 sm:py-32 lg:py-36 bg-[#FAFAF8] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              WHY RESTAURANTS CHOOSE SAPRU
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
              Simplicity meets performance.
            </h2>
            <p className="text-base sm:text-lg text-[#0B0B0B]/70 font-normal leading-relaxed">
              Designed for speed, ease of use, and complete peace of mind during your busiest rush hours.
            </p>
          </div>

          {/* 3 Simple, High-Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: Zap,
                title: "Fast & Easy to Learn",
                headline: "Zero complicated training.",
                desc: "Your cashier, servers, and kitchen team can start taking orders and billing in minutes on any tablet, desktop, or mobile screen.",
                points: ["Quick touch interface", "Staff PIN logins", "Instant receipt printing"],
              },
              {
                icon: Layers,
                title: "Everything Connected",
                headline: "One single reliable software.",
                desc: "Orders from dining tables, takeaways, and QR scans flow directly to your kitchen and billing screens with zero manual delays or lost tickets.",
                points: ["Live kitchen display sync", "Table status indicators", "Multi-payment support"],
              },
              {
                icon: BarChart3,
                title: "Total Owner Visibility",
                headline: "Know your numbers anytime.",
                desc: "Track daily revenue, best-selling items, and stock depletion in real time. Spend less time managing software and more time delighting your guests.",
                points: ["Automatic daily reports", "Low-stock warning alerts", "Clear sales breakdowns"],
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="p-8 rounded-3xl bg-white border border-[#E5E7EB] hover:border-[#FF6A3D]/40 transition-all duration-300 shadow-sm flex flex-col justify-between space-y-8 group"
                >
                  <div className="space-y-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6A3D]/10 border border-[#FF6A3D]/20 flex items-center justify-center text-[#FF6A3D] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6A3D] block">
                        {card.title}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#0F3D2E] font-poppins tracking-tight">
                        {card.headline}
                      </h3>
                      <p className="text-sm text-[#0B0B0B]/70 font-normal leading-relaxed pt-1">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#E5E7EB] space-y-2.5">
                    {card.points.map((pt, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-[#0F3D2E] font-medium">
                        <Check className="w-3.5 h-3.5 text-[#FF6A3D] shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — HOW SAPRU HELPS (Simple Workflow)                              */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-24 sm:py-32 lg:py-36 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#FF6A3D] uppercase font-mono">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
              How Sapru powers your everyday service.
            </h2>
            <p className="text-base sm:text-lg text-[#0B0B0B]/70 font-normal leading-relaxed">
              A smooth, reliable workflow from the moment a guest orders to the end-of-day summary.
            </p>
          </div>

          {/* Visual Progression: 4-step workflow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Take Orders Faster",
                desc: "Punch dine-in, takeaway, or QR orders in seconds with lightning-fast search and item selection.",
              },
              {
                step: "02",
                title: "Kitchen Sync",
                desc: "Orders instantly route to your kitchen display with preparation timers and zero lost tickets.",
              },
              {
                step: "03",
                title: "Quick Settlement",
                desc: "Accept Cash, UPI, or Card payments in one tap with split billing and printed GST invoices.",
              },
              {
                step: "04",
                title: "Review & Grow",
                desc: "Automatic end-of-day reports showing total revenue, top-selling items, and inventory status.",
              },
            ].map((phase, idx) => (
              <div
                key={phase.step}
                className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] space-y-4 relative group hover:border-[#FF6A3D] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#FF6A3D]">
                    STEP {phase.step}
                  </span>
                  {idx < 3 && (
                    <ChevronRight className="w-4 h-4 text-[#6B7280] hidden md:block" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0F3D2E] font-poppins tracking-tight">
                  {phase.title}
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
              DESIGNED FOR CLARITY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-poppins leading-tight">
              Built to keep your business running smoothly.
            </h2>
            <p className="text-base sm:text-lg text-[#E5E7EB]/80 font-normal leading-relaxed">
              Consolidated reports, live activity tracking, and intelligent summaries in one clean interface.
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
                    Live Operational Performance
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    100% Service Uptime
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-[#E5E7EB]/60 block font-mono">Service Throughput</span>
                    <span className="text-2xl font-bold font-mono text-white mt-1 block">98.8%</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#E5E7EB]/60 block font-mono">Register Audit</span>
                    <span className="text-2xl font-bold font-mono text-[#FF6A3D] mt-1 block">₹0 Discrepancy</span>
                  </div>
                </div>
              </div>

              {/* Real-time Activity Stream Fragment */}
              <div className="p-6 rounded-3xl bg-[#0F3D2E]/60 border border-[#165742] space-y-3 shadow-lg">
                <span className="text-xs font-mono font-bold uppercase text-[#E5E7EB]/70 block mb-2">
                  Live Floor &amp; Station Log
                </span>
                {[
                  { tag: "POS", msg: "Table 4 settled via UPI with printed receipt", time: "1m ago" },
                  { tag: "KITCHEN", msg: "Order #1049 marked ready on kitchen display", time: "5m ago" },
                  { tag: "REPORTS", msg: "Daily revenue briefing generated for manager", time: "20m ago" },
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
                  Clear Daily Insights
                </h3>
                <p className="text-sm text-[#E5E7EB]/80 leading-relaxed font-normal">
                  Sapru automatically compiles your daily sales, peak rush hours, and stock depletion into clear summaries so you always know how your restaurant is doing.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A291F] border border-[#165742] space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#FF6A3D] uppercase">
                  Automated shift summary
                </span>
                <p className="text-xs text-[#E5E7EB] font-mono">
                  Everything connected. Clear &amp; simple.
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
            Start managing your billing, kitchen, and business effortlessly with Sapru.
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
              <span>SAPRU RESTAURANT PLATFORM</span>
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
              — Restaurant management software, built beautifully.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#0B0B0B]/70 font-medium">
            <a href="#workspace" className="hover:text-[#FF6A3D] transition">Platform</a>
            <a href="#capabilities" className="hover:text-[#FF6A3D] transition">Capabilities</a>
            <a href="#why-sapru" className="hover:text-[#FF6A3D] transition">Why Sapru</a>
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
