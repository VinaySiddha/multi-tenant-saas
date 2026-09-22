"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Receipt, 
  ChefHat, 
  QrCode, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Boxes, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Lock, 
  LayoutGrid, 
  Clock, 
  CircleDot, 
  Store, 
  DollarSign, 
  BarChart3, 
  CreditCard, 
  SmartphoneNfc, 
  ExternalLink, 
  ChevronRight, 
  ShoppingBag,
  Flame,
  Globe
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"pos" | "kds" | "qr" | "analytics">("pos");

  const productTabs = [
    { id: "pos" as const, label: "POS & Billing", icon: Receipt, badge: "Front Desk" },
    { id: "kds" as const, label: "Kitchen Display (KDS)", icon: ChefHat, badge: "Kitchen Line" },
    { id: "qr" as const, label: "Online & QR Orders", icon: QrCode, badge: "Guest Self-Order" },
    { id: "analytics" as const, label: "Inventory & Insights", icon: BarChart3, badge: "Management" },
  ];

  const productDetails = {
    pos: {
      tag: "FRONT OF HOUSE",
      title: "Lightning-Fast POS & Table Billing",
      subtitle: "Speed up table turns and eliminate billing bottlenecks.",
      description: "Take orders in seconds, manage visual floorplans, apply instant customizations, and process split checks seamlessly on any touch device.",
      actionLabel: "Launch Live POS Terminal",
      actionHref: "/terminal",
      imageSrc: "/mockup-pos.png",
      stats: [
        { label: "Order Entry Speed", value: "< 2.5s" },
        { label: "Billing Accuracy", value: "99.9%" },
        { label: "Table Turnover", value: "+35%" },
      ],
      features: [
        "Visual floorplans with real-time table status",
        "Instant KOT ticket dispatch to kitchen stations",
        "Split checks by seat, item, or custom ratio",
        "Integrated UPI, card, and cash settlement",
      ],
    },
    kds: {
      tag: "BACK OF HOUSE",
      title: "Real-Time Kitchen Display System",
      subtitle: "Digitize kitchen ticket flow with live prep timers.",
      description: "Replace noisy paper printers with responsive kitchen screens. Group items by station, monitor elapsed prep times, and notify waitstaff when food is plated.",
      actionLabel: "Open Kitchen Display Screen",
      actionHref: "/kds",
      imageSrc: "/mockup-dashboard.png",
      stats: [
        { label: "Lost Tickets", value: "0" },
        { label: "Prep Time Reduction", value: "22%" },
        { label: "Station Sync", value: "Instant" },
      ],
      features: [
        "Color-coded preparation pacing & timer warnings",
        "Station routing for hot line, grill, salad, and bar",
        "Dietary tags and custom chef preparation notes",
        "One-tap bump bar to mark orders ready",
      ],
    },
    qr: {
      tag: "GUEST EXPERIENCE",
      title: "Contactless QR Menu & Ordering",
      subtitle: "Empower guests to browse, order, and pay from their phones.",
      description: "Provide a friction-free dining experience. Guests scan their table's unique QR code to view appetizing digital menus and place orders without waiting.",
      actionLabel: "Experience Guest QR Menu",
      actionHref: "/menu/5da85f64-5717-4562-b3fc-2c963f66afb5",
      imageSrc: "/mockup-mobile.png",
      stats: [
        { label: "Average Check Size", value: "+18%" },
        { label: "Labor Efficiency", value: "+28%" },
        { label: "Guest Satisfaction", value: "4.9/5" },
      ],
      features: [
        "Zero app download or registration required",
        "Instant live 86'd out-of-stock menu sync",
        "Item variations, add-ons, and allergen filters",
        "Seamless digital receipts & feedback loop",
      ],
    },
    analytics: {
      tag: "EXECUTIVE INTELLIGENCE",
      title: "Real-Time Revenue & Inventory Control",
      subtitle: "Complete operational visibility across all restaurant branches.",
      description: "Transform daily transactions into actionable intelligence. Monitor gross sales, peak trading hours, top-performing dishes, and automated ingredient depletion.",
      actionLabel: "Explore Executive Dashboard",
      actionHref: "/dashboard",
      imageSrc: "/mockup-dashboard.png",
      stats: [
        { label: "Food Wastage", value: "-40%" },
        { label: "Multi-Branch Sync", value: "Live" },
        { label: "Stock Accuracy", value: "100%" },
      ],
      features: [
        "Automated stock deductions on every order",
        "Low-inventory warning thresholds",
        "Consolidated multi-unit sales reporting",
        "Staff productivity and shift auditing",
      ],
    },
  };

  const featurePillars = [
    {
      icon: Receipt,
      title: "Cloud POS & Rapid Billing",
      description: "Fast touch terminal with visual table maps, split checks, and sub-second receipt printing.",
      tag: "Front of House",
    },
    {
      icon: ChefHat,
      title: "Synchronized Kitchen (KDS)",
      description: "Digital ticket dispatch with real-time prep timers, station routing, and zero paper chits.",
      tag: "Kitchen Line",
    },
    {
      icon: QrCode,
      title: "Contactless QR Ordering",
      description: "Guests scan, browse, and place table-side orders directly from their smartphone browsers.",
      tag: "Guest Experience",
    },
    {
      icon: LayoutGrid,
      title: "Floor & Table Management",
      description: "Design floorplans, track occupancy states (Available, Occupied, Reserved), and assign tables.",
      tag: "Floor Operations",
    },
    {
      icon: Boxes,
      title: "Automated Stock Depletion",
      description: "Ingredient-level inventory tracking that automatically deducts stock upon every sale.",
      tag: "Supply Chain",
    },
    {
      icon: BarChart3,
      title: "Executive Revenue Analytics",
      description: "Live sales telemetry, average check size, peak trading hours, and multi-branch reports.",
      tag: "Business Intelligence",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E14] text-slate-100 selection:bg-[#FF6A3D] selection:text-white font-sans antialiased">
      
      {/* Top Brand Notification */}
      <div className="border-b border-slate-800/80 bg-[#070A0F] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A3D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A3D]"></span>
            </span>
            <span className="font-semibold text-white">Sapru Platform</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Same Passion. A Smarter Way.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">People. Plates. Progress.</span>
            <Link href="/login" className="text-[#FF6A3D] hover:text-[#ff825c] font-semibold transition flex items-center gap-1">
              <span>Staff Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#0A0E14]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Official Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-[#FF6A3D]/20 border border-slate-700/80 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/app-icon-dark.png"
                alt="Sapru"
                width={36}
                height={36}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-slate-100 transition flex items-center">
                Sapru<span className="text-[10px] text-[#FF6A3D] ml-0.5 -mt-3">™</span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase -mt-1">
                Built For A Better Tomorrow
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#solutions" className="hover:text-white transition">Solutions</a>
            <a href="#showcase" className="hover:text-white transition">Product Tour</a>
            <a href="#impact" className="hover:text-white transition">Why Sapru</a>
            <Link href="/menu/5da85f64-5717-4562-b3fc-2c963f66afb5" className="hover:text-white transition">
              QR Menu
            </Link>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/terminal"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition hover:border-[#FF6A3D]/50 hover:text-[#FF6A3D]"
            >
              <Receipt className="w-3.5 h-3.5 text-[#FF6A3D]" />
              <span>Live POS</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6A3D] hover:bg-[#ff5522] text-white text-xs font-bold transition shadow-md shadow-[#FF6A3D]/25"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[#FF6A3D]/10 via-[#0F3D2E]/20 to-[#FF6A3D]/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-bold tracking-wider text-slate-300 uppercase mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6A3D]" />
            <span>Restaurant Management Software</span>
          </div>

          {/* Headline Matching Official Brand */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Run your restaurant,{" "}
            <span className="text-[#FF6A3D]">
              the smarter way.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            All-in-one platform for POS, orders, inventory, staff, and analytics — built for modern restaurants.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/terminal"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#FF6A3D] hover:bg-[#ff5522] text-white font-bold text-sm transition shadow-xl shadow-[#FF6A3D]/30 hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 transition hover:-translate-y-0.5"
            >
              <span>Book a Demo</span>
            </Link>
          </div>

          {/* 4 Brand Quick Pill Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link
              href="/terminal"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-[#FF6A3D]/50 transition flex flex-col items-center gap-2 group"
            >
              <div className="p-2.5 rounded-xl bg-slate-800 text-[#FF6A3D] group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">POS &amp; Billing</span>
            </Link>

            <Link
              href="/menu/5da85f64-5717-4562-b3fc-2c963f66afb5"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-[#FF6A3D]/50 transition flex flex-col items-center gap-2 group"
            >
              <div className="p-2.5 rounded-xl bg-slate-800 text-[#FF6A3D] group-hover:scale-110 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Online &amp; QR Orders</span>
            </Link>

            <Link
              href="/inventory"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-[#FF6A3D]/50 transition flex flex-col items-center gap-2 group"
            >
              <div className="p-2.5 rounded-xl bg-slate-800 text-[#FF6A3D] group-hover:scale-110 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Inventory Control</span>
            </Link>

            <Link
              href="/dashboard"
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-[#FF6A3D]/50 transition flex flex-col items-center gap-2 group"
            >
              <div className="p-2.5 rounded-xl bg-slate-800 text-[#FF6A3D] group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-200">Revenue Insights</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Interactive Showcase & Mockups */}
      <section id="showcase" className="py-20 bg-[#070A0F] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D] mb-2">
              Product Tour
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Designed for Speed. Built for Scale.
            </h3>
            <p className="text-base text-slate-400">
              Explore how Sapru connects the dining room, kitchen line, and business office in one cohesive system.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex justify-center mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-3xl w-full">
              {productTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? "bg-[#FF6A3D] text-white shadow-md shadow-[#FF6A3D]/30 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Display */}
          {(() => {
            const current = productDetails[activeTab];
            return (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 lg:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Left Column: Details */}
                  <div className="lg:col-span-6 space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/20 text-[11px] font-bold tracking-wider">
                      {current.tag}
                    </span>
                    
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {current.title}
                    </h4>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {current.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {current.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-[#FF6A3D] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Link
                        href={current.actionHref}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6A3D] hover:bg-[#ff5522] text-white font-bold text-xs transition shadow-md shadow-[#FF6A3D]/20"
                      >
                        <span>{current.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Visual Product Image Frame */}
                  <div className="lg:col-span-6">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
                      <Image
                        src={current.imageSrc}
                        alt={current.title}
                        width={600}
                        height={450}
                        className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* Solutions & Feature Pillars */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#FF6A3D] mb-2">
              Core Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Everything Needed to Power Modern Hospitality
            </h3>
            <p className="text-base text-slate-400">
              Each module in Sapru connects directly into a synchronized operational pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featurePillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-8 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-md hover:border-slate-700 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3 bg-[#FF6A3D]/10 text-[#FF6A3D] rounded-xl border border-[#FF6A3D]/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {p.tag}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{p.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Enterprise Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#070A0F] via-slate-900 to-[#070A0F] border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/20 text-xs font-bold uppercase">
            <span>Enterprise Ready</span>
          </div>

          <h3 className="text-3xl sm:text-5xl font-black text-white">
            Ready to upgrade your restaurant operations?
          </h3>
          
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            Experience how Sapru transforms order speed, kitchen communication, and financial visibility with our unified cloud platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/terminal"
              className="px-8 py-4 rounded-xl bg-[#FF6A3D] hover:bg-[#ff5522] text-white font-bold text-xs transition shadow-lg shadow-[#FF6A3D]/30"
            >
              Launch Live POS Terminal
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs transition border border-slate-800"
            >
              Access Staff Console
            </Link>
          </div>
        </div>
      </section>

      {/* Minimalist Corporate Footer */}
      <footer className="border-t border-slate-800 bg-[#070A0F] py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-700">
                  <Image
                    src="/app-icon-dark.png"
                    alt="Sapru"
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
                <span className="text-lg font-extrabold text-white">Sapru<span className="text-[10px] text-[#FF6A3D] ml-0.5">™</span></span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                The unified hospitality intelligence platform for point-of-sale billing, digital kitchen orchestration, contactless guest ordering, and multi-unit analytics.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Products</h5>
              <ul className="space-y-2">
                <li><Link href="/terminal" className="hover:text-white transition">Point of Sale (POS)</Link></li>
                <li><Link href="/kds" className="hover:text-white transition">Kitchen Display (KDS)</Link></li>
                <li><Link href="/menu/5da85f64-5717-4562-b3fc-2c963f66afb5" className="hover:text-white transition">Contactless QR Menu</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Executive Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Management</h5>
              <ul className="space-y-2">
                <li><Link href="/tables" className="hover:text-white transition">Table Floorplans</Link></li>
                <li><Link href="/inventory" className="hover:text-white transition">Inventory Control</Link></li>
                <li><Link href="/orders" className="hover:text-white transition">Orders &amp; Invoices</Link></li>
                <li><Link href="/staff" className="hover:text-white transition">Staff Governance</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3">Company</h5>
              <ul className="space-y-2">
                <li><a href="#showcase" className="hover:text-white transition">Product Tour</a></li>
                <li><a href="#solutions" className="hover:text-white transition">Core Solutions</a></li>
                <li><Link href="/login" className="hover:text-white transition">Staff Sign In</Link></li>
                <li><span className="text-slate-500">Enterprise SLA</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>© 2026 Sapru Technologies Inc. All rights reserved. People. Plates. Progress.</p>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational Status: Normal
              </span>
              <span>Enterprise Hospitality Suite</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

