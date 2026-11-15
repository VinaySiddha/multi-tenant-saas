"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Building2, 
  HelpCircle, 
  ArrowRight, 
  ChefHat, 
  QrCode, 
  Package, 
  Users2, 
  BarChart3, 
  Headphones,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { MorphButton } from "@/components/spectrumui/morph-button";
import FloatingNavbar from "@/components/FloatingNavbar";

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  features: string[];
  highlight: string;
  buttonLabel: string;
}

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Core POS and billing for single-outlet independent restaurants.",
    monthlyPrice: 999,
    annualPrice: 799,
    highlight: "Essential for 1 restaurant outlet",
    buttonLabel: "Start 14-Day Free Trial",
    features: [
      "Core POS and billing",
      "Menu and category management",
      "Basic sales and tax reports",
      "1 Restaurant outlet included",
      "Digital receipt dispatch",
      "Standard email support"
    ]
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Full-featured operational suite with KDS, QR ordering, and advanced analytics.",
    monthlyPrice: 1999,
    annualPrice: 1599,
    popular: true,
    highlight: "Suggested for full-service dining",
    buttonLabel: "Start 14-Day Free Trial",
    features: [
      "Everything in Starter",
      "Kitchen Display System (KDS)",
      "QR ordering & table floorplan",
      "Staff roles & granular permissions",
      "Advanced telemetry & revenue reports",
      "Audio chime KDS notifications",
      "Priority email & chat support"
    ]
  },
  {
    id: "multi_outlet",
    name: "Multi-Outlet",
    tagline: "Centralized multi-branch management for growing chains and franchises.",
    monthlyPrice: 3999,
    annualPrice: 3199,
    highlight: "Multi-branch chains & brands",
    buttonLabel: "Start 14-Day Free Trial",
    features: [
      "Everything in Growth",
      "Multi-branch centralized management",
      "Centralized menu & branch overrides",
      "Consolidated cross-branch reporting",
      "Branch-level permissions & roles",
      "Advanced administration & audit trail",
      "Webhook & API integration access"
    ]
  }
];

const faqs = [
  {
    q: "Do I need special hardware to run Sapru?",
    a: "No special proprietary hardware is required. Sapru is 100% web-native and runs smoothly on standard iPads, Android tablets, touch monitors, laptops, and smartphones."
  },
  {
    q: "How does contactless QR ordering work for dining guests?",
    a: "Every table has a unique cryptographic QR token. Guests simply scan the code with their smartphone camera to browse the menu, customize items, and place orders directly to your kitchen without installing any app."
  },
  {
    q: "Can I manage multiple outlets from a single dashboard?",
    a: "Yes. Our Enterprise and Growth plans support multi-branch management. You can switch between branches seamlessly and manage staff, menus, and inventory per outlet."
  },
  {
    q: "Is there any long-term contract or setup fee?",
    a: "No setup fees and no long-term contracts. You can subscribe month-to-month or choose annual billing to save 20%. You can upgrade, downgrade, or cancel at any time."
  },
  {
    q: "How are kitchen order alerts delivered?",
    a: "The Kitchen Display Screen (KDS) connects over WebSockets. As soon as an order is placed from a table, it renders instantly on the kitchen board with a Web Audio chime."
  },
  {
    q: "What level of support do you provide during live dining service?",
    a: "Our customer success and technical teams operate 24/7 with under 15-minute response times for active restaurant shift inquiries."
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0B0B0B] font-sans antialiased selection:bg-[#FF6A3D] selection:text-white">
      
      {/* 1. Unified Floating Capsule Navigation Bar */}
      <FloatingNavbar
        links={[
          { label: "Home", href: "/" },
          { label: "Capabilities", href: "/#capabilities" },
          { label: "Pricing", href: "/pricing" },
          { label: "Docs", href: "/docs" },
          { label: "Support", href: "/support" },
          { label: "Dashboard", href: "/dashboard" },
        ]}
        email="hello@sapru.io"
        activePath="/pricing"
      />

      {/* 2. Hero Header */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 text-center px-4 sm:px-6 max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D2E]/10 border border-[#0F3D2E]/20 text-[#0F3D2E] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6A3D]" />
          <span>Transparent &amp; Predictable SaaS Pricing</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
          Simple, honest plans for modern food &amp; dining teams.
        </h1>
        
        <p className="text-sm sm:text-base text-[#0B0B0B]/70 max-w-2xl mx-auto leading-relaxed">
          No hidden implementation fees. Zero per-device charges. Start with a 14-day full-feature trial.
        </p>

        {/* Monthly vs Annual Billing Toggle */}
        <div className="pt-6 flex items-center justify-center">
          <div className="bg-white border border-[#E5E7EB] p-1 rounded-full shadow-xs flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full transition ${
                !isAnnual
                  ? "bg-[#0F3D2E] text-white shadow-xs font-bold"
                  : "text-[#0B0B0B]/70 hover:text-[#0F3D2E]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-[#0F3D2E] text-white shadow-xs font-bold"
                  : "text-[#0B0B0B]/70 hover:text-[#0F3D2E]"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FF6A3D] text-white text-[10px] font-black uppercase tracking-wider">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Pricing Cards Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  plan.popular
                    ? "bg-white border-2 border-[#FF6A3D] shadow-xl shadow-[#FF6A3D]/10 ring-4 ring-[#FF6A3D]/10 lg:-translate-y-2"
                    : "bg-white border border-[#E5E7EB] shadow-xs hover:border-[#0F3D2E]/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF6A3D] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0F3D2E] font-poppins">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/70 mt-1 min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-[#6B7280] font-bold">₹</span>
                      <span className="text-4xl font-extrabold text-[#0B0B0B] font-poppins tracking-tight">
                        {price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-[#6B7280] font-medium">/ month</span>
                    </div>
                    <span className="text-[11px] text-[#0F3D2E] font-medium block mt-1">
                      {isAnnual ? "Billed annually • 2 months free" : "Billed monthly • cancel anytime"}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
                    <span className="text-xs font-bold text-[#0F3D2E] uppercase tracking-wider block">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#0B0B0B]">
                          <div className="w-4 h-4 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-8">
                  <Link
                    href="/login"
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      plan.popular
                        ? "bg-[#FF6A3D] hover:bg-[#FF5522] text-white shadow-md shadow-[#FF6A3D]/25"
                        : "bg-[#0F3D2E] hover:bg-[#165742] text-white"
                    }`}
                  >
                    <span>{plan.buttonLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-center text-[#6B7280] mt-2 font-medium">
                    14 days free • No credit card required
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Complete Feature Comparison Table */}
      <section className="bg-white border-y border-[#E5E7EB] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E] font-poppins">
              Detailed Feature Comparison
            </h2>
            <p className="text-xs sm:text-sm text-[#0B0B0B]/70">
              Transparent side-by-side feature matrix across all tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-[#0F3D2E] border-b border-[#E5E7EB] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 text-sm font-extrabold font-poppins">Feature</th>
                  <th className="py-4 px-4 text-center">Starter (₹999)</th>
                  <th className="py-4 px-4 text-center text-[#FF6A3D]">Growth (₹1,999)</th>
                  <th className="py-4 px-4 text-center">Multi-Outlet (₹3,999)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#0B0B0B]">
                {[
                  { name: "Tables & Floorplan", starter: "Up to 15", pro: "Unlimited", ent: "Unlimited Multi-Section" },
                  { name: "QR Standees & Mobile Ordering", starter: "Yes", pro: "Yes", ent: "White-Label & Custom Branding" },
                  { name: "Kitchen Display Screens (KDS)", starter: "1 Station", pro: "Unlimited Stations", ent: "Multi-Kitchen Routing" },
                  { name: "Live Audio Chime Synthesizer", starter: "Yes", pro: "Yes", ent: "Custom Tone & Routing" },
                  { name: "Inventory Stock Tracking", starter: "Basic", pro: "Automated Recipe Depletion", ent: "Cross-Outlet Depletion" },
                  { name: "Low-Stock Automatic Warnings", starter: "No", pro: "Yes", ent: "Automated Vendor Alerts" },
                  { name: "Staff Logins & Roster", starter: "5 Members", pro: "Unlimited", ent: "Unlimited + Shifts" },
                  { name: "Multi-Branch Support", starter: "No", pro: "Add-on Available", ent: "Included Central Console" },
                  { name: "Daily Revenue Briefings", starter: "Standard", pro: "Advanced Heatmaps", ent: "Executive BI & Export" },
                  { name: "Support Level", starter: "Email & Knowledge Base", pro: "24/7 Priority Support", ent: "Dedicated Account Director" },
                  { name: "Uptime SLA", starter: "99.5%", pro: "99.9%", ent: "99.99% Guaranteed" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFAF8]/60 transition">
                    <td className="py-3.5 px-6 font-semibold text-[#0F3D2E]">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#6B7280]">
                      {row.starter}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#FF6A3D] bg-[#FF6A3D]/5">
                      {row.pro}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#0F3D2E]">
                      {row.ent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF6A3D]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E] font-poppins">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#0B0B0B]/70">
            Everything you need to know about setting up and scaling with Sapru.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0F3D2E] hover:text-[#FF6A3D] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#FF6A3D]" : "text-[#6B7280]"}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#0B0B0B]/70 leading-relaxed border-t border-[#FAFAF8]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Bottom Banner CTA */}
      <section className="bg-[#0F3D2E] text-white py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-[#FF6A3D]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-poppins tracking-tight">
            Ready to upgrade your restaurant floor today?
          </h2>
          <p className="text-sm sm:text-base text-[#E5E7EB]/80 max-w-xl mx-auto">
            Join modern food operators streamlining kitchen queues, table turnaround, and revenue with Sapru.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-sm transition shadow-lg shadow-[#FF6A3D]/30"
            >
              Start 14-Day Free Trial
            </Link>
            <Link
              href="/support"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition"
            >
              Speak to a Restaurant Specialist
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F3D2E] font-poppins">Sapru Restaurant OS</span>
            <span>— Enterprise cloud platform.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-[#0F3D2E] transition">Home</Link>
            <Link href="/pricing" className="text-[#FF6A3D] font-bold">Pricing</Link>
            <Link href="/docs" className="hover:text-[#0F3D2E] transition">Docs</Link>
            <Link href="/support" className="hover:text-[#0F3D2E] transition">Support</Link>
            <Link href="/login" className="hover:text-[#0F3D2E] transition">Sign In</Link>
          </div>
          <span>© 2026 Sapru Platform Inc. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
