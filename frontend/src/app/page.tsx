"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingNavbar from "@/components/FloatingNavbar";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Receipt,
  ChefHat,
  QrCode,
  BarChart3,
  Boxes,
  Users,
  Clock,
  CircleDot,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Play,
  Check,
  Layers,
  ShoppingBag,
  Store,
  DollarSign,
  Coffee,
  Wine,
  UtensilsCrossed,
  Cpu,
  Building,
  Activity,
  Calendar,
  CreditCard,
  Smartphone,
  Printer,
  FileSpreadsheet,
  MessageSquare,
  XCircle,
  CheckCircle,
  TrendingDown,
  Percent,
} from "lucide-react";

export default function HomePage() {
  // Section 3: Everything in One Place Tab Switcher
  const [activeOsTab, setActiveOsTab] = useState<
    "orders" | "menu" | "inventory" | "staff" | "customers" | "insights"
  >("orders");

  // Section 4: A Day With Sapru Timeline State
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(2);

  // Section 6: Product Showcase Tab
  const [showcaseTab, setShowcaseTab] = useState<
    "dashboard" | "pos" | "kds" | "inventory" | "analytics"
  >("dashboard");

  // Section 5: AI Insight Modal / Drawer State
  const [insightModalOpen, setInsightModalOpen] = useState(false);

  // Pricing Toggle (Monthly vs Annual)
  const [annualBilling, setAnnualBilling] = useState(false);

  // Section 4 Timeline data
  const timelineEvents = [
    {
      time: "8:00 AM",
      title: "Inventory checked",
      subtitle: "Automated morning reconciliation",
      desc: "Sapru analyzes previous evening depletion, auto-reconciles stock levels, and generates draft purchase orders for low-stock ingredients (Paneer, Dairy, Spices).",
      tag: "Supply Chain",
      metric: "3 Purchase Orders Drafted",
    },
    {
      time: "10:30 AM",
      title: "Staff clock in",
      subtitle: "Shift roster & register opening",
      desc: "Waitstaff and line cooks log in via PIN/RFID. POS terminals initialize starting cash drawers with dual-manager verification.",
      tag: "Floor Operations",
      metric: "8 Staff Clocked In",
    },
    {
      time: "12:15 PM",
      title: "Lunch rush begins",
      subtitle: "Contactless ordering acceleration",
      desc: "Table QR scans surge. Orders dispatch simultaneously to hot line, cold station, and bar with automated station routing.",
      tag: "Front of House",
      metric: "42 Concurrent Tables",
    },
    {
      time: "2:40 PM",
      title: "Orders peak",
      subtitle: "Zero lost tickets & synchronized billing",
      desc: "92 orders processed in 45 minutes. Kitchen pacing display keeps average ticket prep under 11 minutes with zero misplaced paper chits.",
      tag: "Kitchen Line",
      metric: "92 Tickets • 100% SLA",
    },
    {
      time: "5:30 PM",
      title: "Stock alert",
      subtitle: "Real-time 86-ing & reorder triggers",
      desc: "Fresh Cream stock dips below 3L safety threshold. Head Chef receives instant mobile alert; dish automatically marked 'Low Stock' on QR menus.",
      tag: "Inventory Warning",
      metric: "Automatic Recipe Deduct",
    },
    {
      time: "9:45 PM",
      title: "Day closed",
      subtitle: "Instant multi-terminal audit",
      desc: "Shift end settlement reconciles Cash, UPI, and Card transactions against POS telemetry. Zero cash discrepancies recorded.",
      tag: "Finance & POS",
      metric: "₹48,320 Balanced (₹0 diff)",
    },
    {
      time: "11:00 PM",
      title: "Daily insights generated",
      subtitle: "Autonomous executive briefing",
      desc: "Sapru Intelligence dispatches daily revenue summary, top margin contributors, and tomorrow's prep recommendations to the owner's WhatsApp.",
      tag: "Sapru Intelligence",
      metric: "18% Revenue Surge vs Prior Week",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0B0B0B] font-sans selection:bg-[#FF6A3D] selection:text-white antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. FLOATING CAPSULE NAVIGATION BAR (Glassmorphism Deep Green Capsule)      */}
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
      {/* 2. HERO SECTION (Atmospheric Restaurant Visual + Floating UI Overlay)     */}
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
                href="#product-os"
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
      {/* 3. EVERYTHING IN ONE PLACE (Interactive OS Product Showcase)               */}
      {/* ========================================================================= */}
      <section id="product-os" className="py-24 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D]">
              UNIFIED ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins">
              Everything your restaurant needs.
              <br />
              <span className="text-[#0B0B0B]">Nothing it doesn’t.</span>
            </h2>
            <p className="text-base text-[#0B0B0B]/70 max-w-xl mx-auto">
              A cohesive operating platform engineered for high-throughput hospitality. Switch
              between modules with zero friction.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <div className="inline-flex p-1.5 rounded-full bg-[#FAFAF8] border border-[#E5E7EB] gap-1 shadow-xs">
              {(
                [
                  { id: "orders", label: "Orders", icon: Receipt },
                  { id: "menu", label: "Menu", icon: UtensilsCrossed },
                  { id: "inventory", label: "Inventory", icon: Boxes },
                  { id: "staff", label: "Staff", icon: Users },
                  { id: "customers", label: "Customers", icon: Sparkles },
                  { id: "insights", label: "Insights", icon: BarChart3 },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeOsTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOsTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#0F3D2E] text-white shadow-md"
                        : "text-[#0B0B0B]/70 hover:text-[#0B0B0B] hover:bg-black/5"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-[#FF6A3D]" : "text-[#0B0B0B]/60"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Central UI Preview Frame */}
          <div className="bg-[#FAFAF8] rounded-3xl border border-[#E5E7EB] p-6 lg:p-10 shadow-xl max-w-5xl mx-auto transition-all">
            {activeOsTab === "orders" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                      Live Kitchen &amp; Front-of-House Dispatch
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/60">
                      Real-time order synchronization between QR guest phones, POS, and Line KDS.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] font-bold">
                      14 Active Tickets
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-bold">
                      0 Lost Orders
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Ticket 1: Preparing */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F3D2E]">Table 02 • Dine-in</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700">
                        PREPARING (6m)
                      </span>
                    </div>
                    <ul className="text-xs space-y-1 text-[#0B0B0B]/80 font-medium">
                      <li>• 2x Paneer Butter Masala</li>
                      <li>• 4x Garlic Naan</li>
                      <li>• 1x Jeera Rice</li>
                    </ul>
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#0B0B0B]/60">Station: Hot Line</span>
                      <span className="font-bold text-[#0F3D2E]">₹1,120</span>
                    </div>
                  </div>

                  {/* Ticket 2: Ready */}
                  <div className="p-4 rounded-2xl bg-white border border-emerald-500/30 ring-1 ring-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F3D2E]">Table 07 • Dine-in</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 font-semibold">
                        READY FOR RUNNER
                      </span>
                    </div>
                    <ul className="text-xs space-y-1 text-[#0B0B0B]/80 font-medium">
                      <li>• 1x Chicken Biryani</li>
                      <li>• 1x Mirchi Ka Salan</li>
                      <li>• 2x Gulab Jamun</li>
                    </ul>
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#0B0B0B]/60">Waitstaff: Rajesh K.</span>
                      <span className="font-bold text-[#0F3D2E]">₹860</span>
                    </div>
                  </div>

                  {/* Ticket 3: Online Completed */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F3D2E]">Web Delivery #1048</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700">
                        DISPATCHED
                      </span>
                    </div>
                    <ul className="text-xs space-y-1 text-[#0B0B0B]/80 font-medium">
                      <li>• 2x Veg Thali Combo</li>
                      <li>• 1x Lassi Sweet</li>
                    </ul>
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-emerald-600 font-semibold">Paid via UPI</span>
                      <span className="font-bold text-[#0F3D2E]">₹640</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeOsTab === "menu" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                      Instant Menu Engineering &amp; 86-ing
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/60">
                      Toggle dish availability, adjust prices, and configure modifiers live across all QR menus and POS terminals.
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-full bg-[#FF6A3D] text-white font-bold text-xs">
                    + Add New Dish
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#0F3D2E]">Hyderabadi Biryani</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-[#0B0B0B]/60">Main Course • 68% Margin</p>
                      <span className="text-base font-extrabold text-[#0F3D2E] mt-2 block">
                        ₹380
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#E5E7EB] mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-[#0B0B0B]/60">Stock: 48 portions left</span>
                      <button className="text-[11px] font-bold text-[#FF6A3D]">Edit Price</button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#0F3D2E]">Paneer Tikka Platter</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-[#0B0B0B]/60">Starters • Chef’s Special</p>
                      <span className="text-base font-extrabold text-[#0F3D2E] mt-2 block">
                        ₹290
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#E5E7EB] mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-[#0B0B0B]/60">Auto-depletes dairy</span>
                      <button className="text-[11px] font-bold text-[#FF6A3D]">Edit Modifiers</button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-red-500/30 bg-red-50/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#0F3D2E]">Avocado Kebab</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-700">
                          86’d (Out of Stock)
                        </span>
                      </div>
                      <p className="text-xs text-[#0B0B0B]/60">Appetizers • 0 Available</p>
                      <span className="text-base font-extrabold text-[#0F3D2E] mt-2 block">
                        ₹340
                      </span>
                    </div>
                    <div className="pt-3 border-t border-[#E5E7EB] mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-red-600 font-medium">Hidden from QR menu</span>
                      <button className="text-[11px] font-bold text-emerald-700">Restock Now</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeOsTab === "inventory" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                      Automated Ingredient Depletion &amp; Purchase Orders
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/60">
                      Ingredients automatically deduct upon order placement. Never run out of crucial kitchen stock.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#0F3D2E] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full">
                    Total Inventory Value: ₹1,42,800
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0F3D2E]">Basmati Aged Rice</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700">
                        Optimal
                      </span>
                    </div>
                    <p className="text-2xl font-black text-[#0F3D2E]">42.5 kg</p>
                    <p className="text-[11px] text-[#0B0B0B]/60 mt-1">Est. 4.2 days remaining at current burn rate</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-amber-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0F3D2E]">Fresh Cooking Cream</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 font-bold">
                        Low Stock Alert
                      </span>
                    </div>
                    <p className="text-2xl font-black text-[#FF6A3D]">2.4 L</p>
                    <p className="text-[11px] text-[#0B0B0B]/60 mt-1">Below safety threshold (5L). Reorder sent to supplier.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0F3D2E]">Dairy Fresh Paneer</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700">
                        Optimal
                      </span>
                    </div>
                    <p className="text-2xl font-black text-[#0F3D2E]">18.0 kg</p>
                    <p className="text-[11px] text-[#0B0B0B]/60 mt-1">Automated batch consumption tracking enabled</p>
                  </div>
                </div>
              </div>
            )}

            {activeOsTab === "staff" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                      Role-Based Permissions &amp; Shift Auditing
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/60">
                      Manage managers, chefs, and waitstaff with granular action controls and live table assignments.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    8 Staff Currently On Duty
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#FF6A3D] uppercase">Floor Manager</span>
                    <h4 className="font-bold text-[#0F3D2E] text-sm mt-0.5">Vikram Sen</h4>
                    <p className="text-[#0B0B0B]/60 mt-1">Clocked in: 10:28 AM • Register #1</p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-[#0F3D2E]/10 text-[#0F3D2E] rounded font-semibold text-[10px]">
                      Full POS &amp; Void Rights
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#0F3D2E] uppercase">Head Chef</span>
                    <h4 className="font-bold text-[#0F3D2E] text-sm mt-0.5">Chef Ananya Rao</h4>
                    <p className="text-[#0B0B0B]/60 mt-1">Clocked in: 10:15 AM • Kitchen Line</p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-[#0F3D2E]/10 text-[#0F3D2E] rounded font-semibold text-[10px]">
                      KDS Bump &amp; 86 Authority
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#0B0B0B]/70 uppercase">Lead Steward</span>
                    <h4 className="font-bold text-[#0F3D2E] text-sm mt-0.5">Rahul Verma</h4>
                    <p className="text-[#0B0B0B]/60 mt-1">Clocked in: 11:00 AM • Section A</p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-[#0F3D2E]/10 text-[#0F3D2E] rounded font-semibold text-[10px]">
                      Tables 1–12 Assigned
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeOsTab === "customers" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                      Customer Profiles &amp; Loyalty Engine
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/60">
                      Understand dining frequency, favorite orders, and lifetime guest value automatically.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#0F3D2E]">2,480 Registered Diners</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#0F3D2E]">Aditi Sharma</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 font-bold text-[10px]">
                        VIP Regular
                      </span>
                    </div>
                    <p className="text-[#0B0B0B]/60 mt-2">Visits: 14 • Total Spend: ₹22,400</p>
                    <p className="text-[#FF6A3D] font-semibold mt-1">Favorite: Mutton Biryani &amp; Kulfi</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#0F3D2E]">Sameer Khan</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-bold text-[10px]">
                        Frequent Lunch
                      </span>
                    </div>
                    <p className="text-[#0B0B0B]/60 mt-2">Visits: 8 • Total Spend: ₹9,800</p>
                    <p className="text-[#0F3D2E] font-semibold mt-1">Prefers: Contactless QR Pay</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#0F3D2E]">Pooja Hegde</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 font-bold text-[10px]">
                        New Guest
                      </span>
                    </div>
                    <p className="text-[#0B0B0B]/60 mt-2">Visits: 1 • First visit today</p>
                    <p className="text-[#0B0B0B]/70 mt-1">Feedback: 5/5 stars on Table 04</p>
                  </div>
                </div>
              </div>
            )}

            {activeOsTab === "insights" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                      Executive Analytics &amp; Revenue Telemetry
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/60">
                      Real-time profit margins, hour-by-hour demand heatmaps, and dish velocity trends.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    Gross Margin: 69.4%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#0F3D2E] uppercase">Peak Trading Hour</span>
                    <p className="text-2xl font-black text-[#0F3D2E] mt-1">8:00 – 9:30 PM</p>
                    <p className="text-[11px] text-[#0B0B0B]/60 mt-1">42% of daily revenue concentrated in evening dinner rush</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#FF6A3D] uppercase">High Contribution Dish</span>
                    <p className="text-2xl font-black text-[#0F3D2E] mt-1">Paneer Tikka</p>
                    <p className="text-[11px] text-[#0B0B0B]/60 mt-1">74% Gross Margin • 36 units sold today</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#0F3D2E] uppercase">Table Turnaround Velocity</span>
                    <p className="text-2xl font-black text-[#0F3D2E] mt-1">34 mins</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">14m faster with Contactless QR pay</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. A DAY WITH SAPRU (Interactive Scroll Timeline)                         */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D]">
              CONTINUOUS HARMONY
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins">
              One day.
              <br />
              Thousands of decisions.
              <br />
              <span className="text-[#FF6A3D]">Sapru keeps them connected.</span>
            </h2>
            <p className="text-base text-[#0B0B0B]/70 max-w-xl mx-auto">
              Follow how a single day unfolds across kitchen stations, billing registers, and management consoles.
            </p>
          </div>

          {/* Interactive Timeline Layout */}
          <div className="space-y-4">
            {timelineEvents.map((evt, idx) => {
              const isSelected = activeTimelineIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTimelineIdx(idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isSelected
                      ? "bg-white border-[#0F3D2E] shadow-xl ring-2 ring-[#0F3D2E]/10"
                      : "bg-white/60 hover:bg-white border-[#E5E7EB] hover:border-[#0F3D2E]/40"
                  }`}
                >
                  <div className="flex items-start md:items-center gap-4">
                    {/* Timestamp Badge */}
                    <div
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 font-poppins transition-colors ${
                        isSelected
                          ? "bg-[#FF6A3D] text-white shadow-sm shadow-[#FF6A3D]/30"
                          : "bg-[#0F3D2E]/10 text-[#0F3D2E]"
                      }`}
                    >
                      {evt.time}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base sm:text-lg font-bold text-[#0F3D2E] font-poppins">
                          {evt.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAFAF8] text-[#0B0B0B]/60 border border-[#E5E7EB]">
                          {evt.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#0B0B0B]/70 mt-1 leading-relaxed max-w-2xl">
                        {evt.desc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E7EB]">
                    <span className="text-xs font-bold text-[#0F3D2E] block font-poppins">
                      {evt.metric}
                    </span>
                    <span className="text-[10px] text-[#0B0B0B]/50 block">Live Telemetry</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SAPRU INTELLIGENCE (Full-Width Deep-Green Section)                      */}
      {/* ========================================================================= */}
      <section id="intelligence" className="py-24 bg-[#0F3D2E] text-[#FAFAF8] relative overflow-hidden">
        {/* Glowing Background Refractions */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6A3D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#165742]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Heading */}
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF6A3D]/20 text-[#FF6A3D] border border-[#FF6A3D]/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTONOMOUS OPERATIONAL INTELLIGENCE</span>
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-poppins leading-tight">
              Don’t just see your numbers.
              <br />
              <span className="text-[#FF6A3D]">Understand them.</span>
            </h2>
            <p className="text-base text-[#E5E7EB]/80 leading-relaxed max-w-2xl font-normal">
              Sapru Intelligence observes table velocity, ingredient burn rates, and margin erosion
              to generate proactive decision recommendations before service begins.
            </p>
          </div>

          {/* AI Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Primary Hero Insight Card */}
            <div className="lg:col-span-7 bg-[#0A291F] border border-[#FAFAF8]/20 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#FF6A3D]/20 text-[#FF6A3D] border border-[#FF6A3D]/30">
                    SAPRU INSIGHT
                  </span>
                  <span className="text-xs text-[#E5E7EB]/60">Generated Today at 4:30 PM</span>
                </div>

                <div className="space-y-4 text-white">
                  <p className="text-xl sm:text-2xl font-semibold leading-snug font-poppins">
                    “Your dinner revenue increased <span className="text-[#FF6A3D]">18%</span> this
                    week.
                  </p>
                  <p className="text-lg sm:text-xl text-[#E5E7EB]/90 leading-relaxed font-poppins">
                    Biryanis generated <span className="text-white font-bold">32%</span> of dinner
                    sales.
                  </p>
                  <p className="text-base sm:text-lg text-[#E5E7EB]/80 font-poppins">
                    Consider increasing preparation capacity between 7:00–9:00 PM.”
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setInsightModalOpen(true)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6A3D] hover:text-white transition group-hover:translate-x-1"
                >
                  <span>View insight details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Confidence Prediction
                </span>
              </div>
            </div>

            {/* Right Column: Secondary Actionable Insight Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              {/* Card 1: Perishable Waste Prevention */}
              <div className="bg-[#0A291F] border border-[#FAFAF8]/15 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A3D]">
                    WASTE REDUCTION
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">-24% spoilage</span>
                </div>
                <h4 className="text-base font-bold text-white font-poppins">
                  Dynamic Dairy Batching
                </h4>
                <p className="text-xs text-[#E5E7EB]/70 leading-relaxed">
                  Cream and milk spoilage reduced after Sapru automated evening prep thresholds
                  based on real-time table reservation pacing.
                </p>
              </div>

              {/* Card 2: Dynamic Margin Engineering */}
              <div className="bg-[#0A291F] border border-[#FAFAF8]/15 rounded-3xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6A3D]">
                    MENU ENGINEERING
                  </span>
                  <span className="text-[11px] text-[#FF6A3D] font-bold">68% Margin</span>
                </div>
                <h4 className="text-base font-bold text-white font-poppins">
                  High-Margin Dish Placement
                </h4>
                <p className="text-xs text-[#E5E7EB]/70 leading-relaxed">
                  Paneer Tikka yields ₹198 gross profit per plate. Recommended promoting to the top
                  featured carousel on table-side QR menus.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Insight Detail Modal Preview */}
        {insightModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0A291F] border border-[#FAFAF8]/20 rounded-3xl p-8 max-w-lg w-full text-[#FAFAF8] shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FF6A3D] uppercase tracking-wider">
                  Deep Intelligence Telemetry
                </span>
                <button
                  onClick={() => setInsightModalOpen(false)}
                  className="text-white/60 hover:text-white text-xs px-2 py-1 rounded-lg bg-white/10"
                >
                  Close ✕
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white font-poppins">
                  Dinner Biryani Capacity Pacing
                </h3>
                <p className="text-xs text-[#E5E7EB]/80 leading-relaxed">
                  Based on 4 consecutive weeks of dining telemetry, order volume spikes 2.8x between
                  7:30 PM and 8:45 PM. Pre-portioning 24 additional Dum Biryani handis at 6:30 PM will
                  reduce ticket delay by 6.5 minutes and prevent walkouts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F3D2E] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]/70">Projected Revenue Lift:</span>
                  <span className="font-bold text-emerald-400">+₹8,400 / night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E5E7EB]/70">Kitchen SLA Compliance:</span>
                  <span className="font-bold text-white">99.4%</span>
                </div>
              </div>

              <button
                onClick={() => setInsightModalOpen(false)}
                className="w-full py-3 rounded-full bg-[#FF6A3D] text-white font-bold text-xs shadow-lg hover:bg-[#FF5522] transition"
              >
                Apply Recommendation to Prep Schedule →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. PRODUCT SHOWCASE (Realistic Indian Restaurant Dashboard)               */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D]">
              ENTERPRISE PLATFORM
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins">
              Everything your restaurant runs on.
            </h2>
            <p className="text-base text-[#0B0B0B]/70 max-w-xl mx-auto">
              A zero-lag command center engineered for rapid decision-making across single outlets
              and multi-chain groups.
            </p>
          </div>

          {/* Large Realistic Sapru Dashboard Frame */}
          <div className="bg-[#FAFAF8] rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden max-w-6xl mx-auto">
            {/* Top Workspace Header Bar */}
            <div className="bg-[#0F3D2E] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] text-[#0F3D2E] flex items-center justify-center font-bold text-sm">
                  S
                </div>
                <div>
                  <h4 className="text-sm font-bold font-poppins text-white">
                    Sapru Command Center • Main Kitchen &amp; Registers
                  </h4>
                  <p className="text-[11px] text-[#E5E7EB]/70">
                    Live Indian Restaurant Telemetry • INR (₹)
                  </p>
                </div>
              </div>

              {/* Showcase Navigation Switcher */}
              <div className="flex items-center gap-1.5 bg-[#0A291F] p-1 rounded-xl border border-white/10 text-xs">
                {(["dashboard", "pos", "kds", "inventory", "analytics"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setShowcaseTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                      showcaseTab === tab
                        ? "bg-[#FF6A3D] text-white"
                        : "text-[#E5E7EB]/70 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Content Area */}
            <div className="p-6 lg:p-8 space-y-8">
              {/* Realistic KPI Stat Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#0B0B0B]/60 block">
                    Today’s Gross Revenue
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#0F3D2E] mt-1 block font-poppins">
                    ₹48,320
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% vs last Tuesday
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#0B0B0B]/60 block">
                    Total Order Volume
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#0F3D2E] mt-1 block font-poppins">
                    124 Orders
                  </span>
                  <span className="text-[11px] text-[#0B0B0B]/70 block mt-1">
                    32 Dine-in • 92 Online Delivery
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#0B0B0B]/60 block">
                    Average Order Value (AOV)
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#0F3D2E] mt-1 block font-poppins">
                    ₹389.60
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                    +₹42 with QR modifiers
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#0B0B0B]/60 block">
                    Kitchen Prep Speed
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#0F3D2E] mt-1 block font-poppins">
                    11m 40s
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                    99.8% On-Time SLA
                  </span>
                </div>
              </div>

              {/* Realistic Orders & Inventory Live Table */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <h4 className="text-sm font-bold text-[#0F3D2E] font-poppins">
                    Live Service Pipeline
                  </h4>
                  <span className="text-xs text-[#0B0B0B]/60">Showing latest orders in stream</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#0B0B0B]/60 border-b border-[#E5E7EB]">
                        <th className="py-2.5 font-bold">Order ID</th>
                        <th className="py-2.5 font-bold">Table / Channel</th>
                        <th className="py-2.5 font-bold">Dishes</th>
                        <th className="py-2.5 font-bold">Status</th>
                        <th className="py-2.5 font-bold">Payment</th>
                        <th className="py-2.5 font-bold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      <tr>
                        <td className="py-3 font-bold text-[#0F3D2E]">#1052</td>
                        <td className="py-3 font-semibold">Table 04 (4 Guests)</td>
                        <td className="py-3 text-[#0B0B0B]/80">2x Dum Biryani, 1x Paneer Tikka</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 font-bold text-[10px]">
                            PREPARING (4m)
                          </span>
                        </td>
                        <td className="py-3 text-[#0B0B0B]/60">Split Bill Open</td>
                        <td className="py-3 font-bold text-right text-[#0F3D2E]">₹1,480</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-[#0F3D2E]">#1051</td>
                        <td className="py-3 font-semibold">Table 08 (2 Guests)</td>
                        <td className="py-3 text-[#0B0B0B]/80">1x Dal Makhani, 4x Garlic Naan</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-bold text-[10px]">
                            READY FOR SERVING
                          </span>
                        </td>
                        <td className="py-3 text-emerald-600 font-bold">UPI Paid</td>
                        <td className="py-3 font-bold text-right text-[#0F3D2E]">₹680</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-[#0F3D2E]">#1050</td>
                        <td className="py-3 font-semibold">Web Delivery (Swiggy)</td>
                        <td className="py-3 text-[#0B0B0B]/80">3x Chicken Biryani Combo</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-700 font-bold text-[10px]">
                            DISPATCHED
                          </span>
                        </td>
                        <td className="py-3 text-emerald-600 font-bold">Prepaid Online</td>
                        <td className="py-3 font-bold text-right text-[#0F3D2E]">₹1,140</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BEFORE → SAPRU → AFTER (Transformation Visual)                         */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D]">
              THE UNIFICATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins">
              Replace operational chaos with one system.
            </h2>
            <p className="text-base text-[#0B0B0B]/70 max-w-xl mx-auto">
              Why modern restaurateurs are ditching fragmented point tools for Sapru’s unified real-time architecture.
            </p>
          </div>

          {/* Transformation Visual Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            {/* Left: BEFORE (Fragmented Tools & Stress) */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-[#E5E7EB]">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-red-700 font-poppins">
                  BEFORE: Fragmented Chaos
                </h3>
              </div>

              <ul className="space-y-4 text-xs font-medium text-[#0B0B0B]/80">
                <li className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <span className="font-semibold text-red-950">Orders</span>
                  <span className="text-[#0B0B0B]/60">Messy WhatsApp chats</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <span className="font-semibold text-red-950">Billing</span>
                  <span className="text-[#0B0B0B]/60">Standalone legacy POS</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <span className="font-semibold text-red-950">Inventory</span>
                  <span className="text-[#0B0B0B]/60">Outdated Excel sheets</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <span className="font-semibold text-red-950">Staff Logs</span>
                  <span className="text-[#0B0B0B]/60">Paper notebooks</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <span className="font-semibold text-red-950">Reports</span>
                  <span className="text-[#0B0B0B]/60">Manual end-of-month math</span>
                </li>
              </ul>
            </div>

            {/* Center: SAPRU Connection Badge */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#0F3D2E] text-white flex items-center justify-center shadow-xl shadow-[#0F3D2E]/30 ring-4 ring-[#FF6A3D]">
                <ArrowRight className="w-7 h-7 text-[#FF6A3D]" />
              </div>
              <span className="text-xs font-bold text-[#0F3D2E] font-poppins uppercase tracking-wider">
                SAPRU UNIFIES
              </span>
            </div>

            {/* Right: AFTER (Unified Clarity) */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-[#0F3D2E] text-[#FAFAF8] border border-[#FAFAF8]/20 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-poppins">
                  AFTER: Connected Precision
                </h3>
              </div>

              <ul className="space-y-4 text-xs font-medium text-white">
                <li className="flex items-center justify-between p-3 rounded-xl bg-[#0A291F] border border-white/10">
                  <span className="font-bold text-white">Orders &amp; Billing</span>
                  <span className="text-emerald-400 font-semibold">Instant split check POS</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-[#0A291F] border border-white/10">
                  <span className="font-bold text-white">Kitchen (KDS)</span>
                  <span className="text-emerald-400 font-semibold">Zero lost paper tickets</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-[#0A291F] border border-white/10">
                  <span className="font-bold text-white">Live Inventory</span>
                  <span className="text-emerald-400 font-semibold">Automated recipe depletion</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-[#0A291F] border border-white/10">
                  <span className="font-bold text-white">Staff Roster</span>
                  <span className="text-emerald-400 font-semibold">PIN shifts &amp; permissions</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-[#0A291F] border border-white/10">
                  <span className="font-bold text-white">Executive Intelligence</span>
                  <span className="text-emerald-400 font-semibold">Daily WhatsApp insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. RESTAURANT STORIES (Cards for Every Restaurant Format)                  */}
      {/* ========================================================================= */}
      <section id="stories" className="py-24 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D]">
              VERSATILE DEPLOYMENT
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins">
              Built for every kind of restaurant.
            </h2>
            <p className="text-base text-[#0B0B0B]/70 max-w-xl mx-auto">
              From artisanal specialty cafés to Michelin-grade dining and multi-city cloud kitchen networks.
            </p>
          </div>

          {/* 5 Rich Visual Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Café & Bakery */}
            <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8] shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
                  alt="Artisanal Cafe"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F3D2E]/90 text-white text-[11px] font-bold">
                  CAFÉ &amp; BAKERY
                </div>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#FF6A3D]">
                  2.1s average checkout time
                </span>
                <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                  Rapid Morning Rush Throttle
                </h3>
                <p className="text-xs text-[#0B0B0B]/70 leading-relaxed">
                  Sub-second barcode scanning and quick tap-and-pay for coffee, pastries, and takeaway orders.
                </p>
              </div>
            </div>

            {/* 2. Fine Dining */}
            <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8] shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop"
                  alt="Fine Dining"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F3D2E]/90 text-white text-[11px] font-bold">
                  FINE DINING
                </div>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#FF6A3D]">
                  +42% wine &amp; dessert pairing upsells
                </span>
                <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                  Course Pacing &amp; Sommelier Pairing
                </h3>
                <p className="text-xs text-[#0B0B0B]/70 leading-relaxed">
                  Fire starters, mains, and desserts with precision course timers and multi-waiter table synchronization.
                </p>
              </div>
            </div>

            {/* 3. Quick Service (QSR) */}
            <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8] shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop"
                  alt="Quick Service Restaurant"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F3D2E]/90 text-white text-[11px] font-bold">
                  QUICK SERVICE (QSR)
                </div>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#FF6A3D]">
                  1,200+ orders/day handled
                </span>
                <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                  Zero Counter Queue Congestion
                </h3>
                <p className="text-xs text-[#0B0B0B]/70 leading-relaxed">
                  High-speed token screens, bump bars, and integrated thermal ticket printing at blistering velocity.
                </p>
              </div>
            </div>

            {/* 4. Cloud Kitchen */}
            <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8] shadow-xs hover:shadow-xl transition group flex flex-col justify-between">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop"
                  alt="Cloud Kitchen"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F3D2E]/90 text-white text-[11px] font-bold">
                  CLOUD KITCHEN
                </div>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#FF6A3D]">
                  4 delivery brands on 1 screen
                </span>
                <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                  Multi-Brand Central Kitchen Routing
                </h3>
                <p className="text-xs text-[#0B0B0B]/70 leading-relaxed">
                  Unified Swiggy, Zomato, and Direct Web orders in a single consolidated kitchen prep screen.
                </p>
              </div>
            </div>

            {/* 5. Multi-Location Chain */}
            <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] bg-[#FAFAF8] shadow-xs hover:shadow-xl transition group flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop"
                  alt="Multi Location Restaurant Group"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F3D2E]/90 text-white text-[11px] font-bold">
                  MULTI-LOCATION CHAIN
                </div>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#FF6A3D]">
                  12 branches managed from 1 master console
                </span>
                <h3 className="text-lg font-bold text-[#0F3D2E] font-poppins">
                  Consolidated Enterprise Telemetry
                </h3>
                <p className="text-xs text-[#0B0B0B]/70 leading-relaxed">
                  Central recipe distribution, cross-branch inventory transfers, and real-time comparative unit EBITDA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. INTEGRATIONS (Hardware, Payments, Aggregators)                         */}
      {/* ========================================================================= */}
      <section id="integrations" className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D]">
              ECOSYSTEM CONNECTIVITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins">
              Sapru fits into the stack you already use.
            </h2>
            <p className="text-base text-[#0B0B0B]/70 max-w-xl mx-auto">
              Native hardware bridges, payment gateways, and accounting synchronizations built right in.
            </p>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {/* Payments */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center text-center gap-2 hover:border-[#FF6A3D]/50 transition shadow-xs">
              <CreditCard className="w-6 h-6 text-[#FF6A3D]" />
              <span className="text-xs font-bold text-[#0F3D2E]">UPI &amp; QR Pay</span>
              <span className="text-[10px] text-[#0B0B0B]/50">GPay, PhonePe, Paytm</span>
            </div>

            {/* Razorpay / PineLabs */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center text-center gap-2 hover:border-[#FF6A3D]/50 transition shadow-xs">
              <Smartphone className="w-6 h-6 text-[#0F3D2E]" />
              <span className="text-xs font-bold text-[#0F3D2E]">Card POS</span>
              <span className="text-[10px] text-[#0B0B0B]/50">PineLabs &amp; Razorpay</span>
            </div>

            {/* Delivery Aggregators */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center text-center gap-2 hover:border-[#FF6A3D]/50 transition shadow-xs">
              <ShoppingBag className="w-6 h-6 text-[#FF6A3D]" />
              <span className="text-xs font-bold text-[#0F3D2E]">Delivery Sync</span>
              <span className="text-[10px] text-[#0B0B0B]/50">Swiggy &amp; Zomato</span>
            </div>

            {/* Accounting */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center text-center gap-2 hover:border-[#FF6A3D]/50 transition shadow-xs">
              <FileSpreadsheet className="w-6 h-6 text-[#0F3D2E]" />
              <span className="text-xs font-bold text-[#0F3D2E]">Accounting</span>
              <span className="text-[10px] text-[#0B0B0B]/50">Tally &amp; Zoho Books</span>
            </div>

            {/* WhatsApp */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center text-center gap-2 hover:border-[#FF6A3D]/50 transition shadow-xs">
              <MessageSquare className="w-6 h-6 text-[#FF6A3D]" />
              <span className="text-xs font-bold text-[#0F3D2E]">WhatsApp Cloud</span>
              <span className="text-[10px] text-[#0B0B0B]/50">Receipts &amp; Alerts</span>
            </div>

            {/* Thermal Printers */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col items-center justify-center text-center gap-2 hover:border-[#FF6A3D]/50 transition shadow-xs">
              <Printer className="w-6 h-6 text-[#0F3D2E]" />
              <span className="text-xs font-bold text-[#0F3D2E]">ESC/POS Print</span>
              <span className="text-[10px] text-[#0B0B0B]/50">Epson, Sunmi, Star</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. PRICING (Clean, Transparent 3-Tier Cards)                             */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 bg-white border-t border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D]">
              TRANSPARENT VALUE
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F3D2E] font-poppins">
              Start small.
              <br />
              <span className="text-[#FF6A3D]">Scale without switching.</span>
            </h2>
            <p className="text-base text-[#0B0B0B]/70 max-w-xl mx-auto">
              Zero commission on orders. Zero hidden transaction levies. Cancel or upgrade anytime.
            </p>

            {/* Billing Cadence Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span
                className={`text-xs font-semibold ${
                  !annualBilling ? "text-[#0F3D2E]" : "text-[#0B0B0B]/50"
                }`}
              >
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setAnnualBilling(!annualBilling)}
                className="w-12 h-6 rounded-full bg-[#0F3D2E] p-0.5 transition-colors relative"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    annualBilling ? "translate-x-6 bg-[#FF6A3D]" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-semibold flex items-center gap-1.5 ${
                  annualBilling ? "text-[#0F3D2E]" : "text-[#0B0B0B]/50"
                }`}
              >
                <span>Annual</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF6A3D]/15 text-[#FF6A3D] text-[10px] font-bold">
                  20% OFF
                </span>
              </span>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* 1. STARTER */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#0F3D2E] uppercase tracking-wider">
                  STARTER
                </span>
                <h3 className="text-2xl font-bold text-[#0F3D2E] font-poppins">Single Outlet</h3>
                <p className="text-xs text-[#0B0B0B]/70">
                  Ideal for standalone cafés, food trucks, and neighborhood bistros.
                </p>

                <div className="pt-4">
                  <span className="text-4xl font-extrabold text-[#0F3D2E] font-poppins">
                    {annualBilling ? "₹1,599" : "₹1,999"}
                  </span>
                  <span className="text-xs text-[#0B0B0B]/60"> / month</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-[#E5E7EB] text-xs text-[#0B0B0B]/85">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1 Master POS Register</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contactless QR Menu Ordering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic Kitchen Display (KDS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inventory Low-Stock Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Daily EOD WhatsApp Reports</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/terminal"
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#0F3D2E] text-[#0F3D2E] hover:text-white border border-[#0F3D2E]/30 font-bold text-xs transition text-center shadow-xs"
              >
                Get Started →
              </Link>
            </div>

            {/* 2. GROWTH (Featured) */}
            <div className="p-8 rounded-3xl bg-[#0F3D2E] text-[#FAFAF8] border-2 border-[#FF6A3D] shadow-2xl flex flex-col justify-between space-y-8 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF6A3D] text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
                MOST POPULAR
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[#FF6A3D] uppercase tracking-wider">
                  GROWTH
                </span>
                <h3 className="text-2xl font-bold text-white font-poppins">High-Volume Restaurant</h3>
                <p className="text-xs text-[#E5E7EB]/75">
                  Full power for busy dine-in venues, multicourse restaurants, and bars.
                </p>

                <div className="pt-4">
                  <span className="text-4xl font-extrabold text-white font-poppins">
                    {annualBilling ? "₹3,199" : "₹3,999"}
                  </span>
                  <span className="text-xs text-[#E5E7EB]/70"> / month</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-white/10 text-xs text-white">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Unlimited POS Terminals &amp; Mobile Waiter Tabs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Full Multi-Station KDS Routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Recipe-Level Auto-Inventory Depletion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Customer CRM &amp; Loyalty Engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#FF6A3D] shrink-0" />
                    <span>Sapru Autonomous AI Intelligence</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/terminal"
                className="w-full py-3.5 rounded-full bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-xs transition text-center shadow-lg shadow-[#FF6A3D]/30"
              >
                Get Started →
              </Link>
            </div>

            {/* 3. ENTERPRISE */}
            <div className="p-8 rounded-3xl bg-[#FAFAF8] border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#0F3D2E] uppercase tracking-wider">
                  ENTERPRISE
                </span>
                <h3 className="text-2xl font-bold text-[#0F3D2E] font-poppins">Restaurant Groups</h3>
                <p className="text-xs text-[#0B0B0B]/70">
                  Customized for multi-unit franchise chains and central commissary kitchens.
                </p>

                <div className="pt-4">
                  <span className="text-4xl font-extrabold text-[#0F3D2E] font-poppins">
                    Custom
                  </span>
                  <span className="text-xs text-[#0B0B0B]/60"> / tailored rollout</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-[#E5E7EB] text-xs text-[#0B0B0B]/85">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-Branch Master Executive Console</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Central Kitchen &amp; Stock Transfer Matrix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom ERP, Tally &amp; Webhook APIs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated 24/7 Account Engineer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>99.99% Guaranteed SLA</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 rounded-full bg-white hover:bg-[#0F3D2E] text-[#0F3D2E] hover:text-white border border-[#0F3D2E]/30 font-bold text-xs transition text-center shadow-xs"
              >
                Contact Enterprise Sales →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FINAL CTA (Dramatic Deep-Green Full-Bleed Section)                     */}
      {/* ========================================================================= */}
      <section className="py-24 lg:py-32 bg-[#0F3D2E] text-[#FAFAF8] relative overflow-hidden">
        {/* Glowing Ambient Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF6A3D]/20 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FF6A3D] animate-ping" />
            <span>MODERNIZE YOUR HOSPITALITY INFRASTRUCTURE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-poppins leading-[1.1]">
            Your restaurant deserves
            <br />
            <span className="text-[#FF6A3D]">better software.</span>
          </h2>

          <p className="text-lg sm:text-xl text-[#E5E7EB]/90 max-w-xl mx-auto font-normal">
            Run smarter. Serve better. Grow faster.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/terminal"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-sm transition-all shadow-xl shadow-[#FF6A3D]/30 hover:scale-105 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-transparent hover:bg-white/10 text-white font-semibold text-sm border border-white/30 transition hover:scale-105 active:scale-95"
            >
              <span>Book a Live Demo</span>
            </Link>
          </div>

          {/* Centered Sapru Logo Emblem Beneath CTA */}
          <div className="pt-12 flex flex-col items-center gap-2 opacity-80">
            <div className="w-12 h-12 rounded-2xl bg-[#0A291F] border border-white/20 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
                <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fillOpacity="0.3" />
                <path
                  d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="12" cy="12" r="3" fill="#FF6A3D" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-widest text-white font-poppins">
              SAPRU RESTAURANT OS
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FOOTER (Minimal Premium Corporate Layout)                             */}
      {/* ========================================================================= */}
      <footer className="bg-[#0A291F] text-[#E5E7EB]/80 text-xs py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand Intro Column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FAFAF8] text-[#0F3D2E] flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <span className="text-lg font-bold text-white tracking-tight font-poppins">
                  SAPRU
                </span>
              </div>
              <p className="text-[#E5E7EB]/70 max-w-sm leading-relaxed text-xs">
                Restaurant intelligence, built beautifully. Cloud POS billing, kitchen flow
                synchronization, contactless guest ordering, and autonomous inventory control.
              </p>
            </div>

            {/* Column 1: Product */}
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-4 font-poppins text-[11px]">
                Product
              </h5>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/terminal" className="hover:text-[#FF6A3D] transition">
                    Point of Sale (POS)
                  </Link>
                </li>
                <li>
                  <Link href="/kds" className="hover:text-[#FF6A3D] transition">
                    Kitchen Display (KDS)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu/5da85f64-5717-4562-b3fc-2c963f66afb5"
                    className="hover:text-[#FF6A3D] transition"
                  >
                    Contactless QR Menu
                  </Link>
                </li>
                <li>
                  <Link href="/inventory" className="hover:text-[#FF6A3D] transition">
                    Recipe Inventory
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#FF6A3D] transition">
                    Executive Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-4 font-poppins text-[11px]">
                Solutions
              </h5>
              <ul className="space-y-2.5">
                <li>
                  <a href="#stories" className="hover:text-[#FF6A3D] transition">
                    Cafés &amp; Bakeries
                  </a>
                </li>
                <li>
                  <a href="#stories" className="hover:text-[#FF6A3D] transition">
                    Fine Dining
                  </a>
                </li>
                <li>
                  <a href="#stories" className="hover:text-[#FF6A3D] transition">
                    Quick Service (QSR)
                  </a>
                </li>
                <li>
                  <a href="#stories" className="hover:text-[#FF6A3D] transition">
                    Cloud Kitchens
                  </a>
                </li>
                <li>
                  <a href="#stories" className="hover:text-[#FF6A3D] transition">
                    Multi-Unit Chains
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources & Company */}
            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-4 font-poppins text-[11px]">
                Company
              </h5>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/login" className="hover:text-[#FF6A3D] transition">
                    Staff Portal
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#FF6A3D] transition">
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <Link href="/navbar-preview" className="hover:text-[#FF6A3D] transition">
                    Design Lab
                  </Link>
                </li>
                <li>
                  <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    All Systems Live
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Legal */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#E5E7EB]/60 text-[11px]">
            <p>© 2026 Sapru Technologies Inc. All rights reserved. People. Plates. Progress.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition">
                Security &amp; Compliance
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
