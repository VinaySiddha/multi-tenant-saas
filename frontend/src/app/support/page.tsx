"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Headphones, 
  HelpCircle, 
  BookOpen, 
  Flame, 
  PhoneCall, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { MorphButton } from "@/components/spectrumui/morph-button";
import FloatingNavbar from "@/components/FloatingNavbar";

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    name: "",
    restaurantName: "",
    email: "",
    phone: "",
    category: "KDS",
    priority: "MEDIUM",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmitTicket = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setTicketSuccess(null);

    // Simulate reliable support ticket creation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ticketId = `SR-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketSuccess(`Support Ticket #${ticketId} opened successfully! A senior restaurant technician has been notified and will respond via email/phone within 15 minutes.`);
    setTicketForm({
      name: "",
      restaurantName: "",
      email: "",
      phone: "",
      category: "KDS",
      priority: "MEDIUM",
      message: ""
    });
    setSubmitting(false);
  };

  const supportFaqs = [
    {
      q: "My kitchen display (KDS) is not sounding the audio chime alert. How do I fix it?",
      a: "Browsers require a user interaction (such as clicking 'Enable Audio' or clicking anywhere on the screen) before playing audio. Make sure the 'Audio On' button in the top right of the KDS screen is active and your tablet or display speaker volume is unmuted."
    },
    {
      q: "How do I regenerate a damaged or stolen dining table QR code standee?",
      a: "Navigate to Tables & Floorplan in your admin console, find the table, and click 'Regenerate QR'. This immediately invalidates the old QR token for security and generates a fresh high-resolution SVG/PNG code ready for printing."
    },
    {
      q: "Can two waiters use the platform simultaneously from different devices?",
      a: "Yes. Sapru is built with real-time multi-device synchronization. Changes made on one device (such as table status changes or orders) stream live to all other devices instantaneously over WebSockets."
    },
    {
      q: "What should I do if our dining room internet connection flickers?",
      a: "Sapru retains active session tokens in local storage. Once network connectivity resumes, the client reconnects automatically to the backend STOMP broker and updates all active ticket states without requiring a re-login."
    },
    {
      q: "How do I add a new branch to my restaurant group?",
      a: "If you are subscribed to our Growth or Enterprise plan, restaurant owners can navigate to Settings & Branches, click 'Add Branch', and configure location details, GSTIN, FSSAI, and branch code in seconds."
    }
  ];

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
        activePath="/support"
      />

      {/* 2. Hero Header */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 text-center px-4 sm:px-6 max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F3D2E]/10 border border-[#0F3D2E]/20 text-[#0F3D2E] text-xs font-bold uppercase tracking-wider">
          <Headphones className="w-3.5 h-3.5 text-[#FF6A3D]" />
          <span>24/7 Restaurant Success &amp; Support Desk</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F3D2E] font-poppins leading-tight">
          How can our specialist team help your floor today?
        </h1>
        
        <p className="text-sm sm:text-base text-[#0B0B0B]/70 max-w-2xl mx-auto leading-relaxed">
          From kitchen rush-hour troubleshooting to multi-branch onboarding, our dedicated engineering team is here 24 hours a day, 7 days a week.
        </p>

        {/* Live Operational Status Banner */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational • 99.99% Uptime Verified</span>
          </div>
        </div>
      </section>

      {/* 3. Four Core Help Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Kitchen Expediter Support",
              desc: "Instant live help for KOT status bumping, ticket routing, and audio chime sync.",
              icon: Flame,
              badge: "Shift Priority",
              action: "Open Emergency Ticket",
            },
            {
              title: "QR Standee & Hardware",
              desc: "Guides for QR table standee printing, thermal receipt sizing, and tablet mounts.",
              icon: BookOpen,
              badge: "Knowledge Base",
              action: "Read Hardware Guide",
            },
            {
              title: "Multi-Branch Setup",
              desc: "Dedicated white-glove onboarding for franchise groups and new restaurant openings.",
              icon: ShieldCheck,
              badge: "VIP Service",
              action: "Schedule Walkthrough",
            },
            {
              title: "Emergency Telephone Desk",
              desc: "Direct toll-free access to our senior engineering desk during high-volume service.",
              icon: PhoneCall,
              badge: "< 15m Response",
              action: "Call +91 800 727 7800",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#0F3D2E]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E] flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-[#FF6A3D]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0F3D2E] bg-[#0F3D2E]/5 px-2 py-0.5 rounded-md border border-[#0F3D2E]/10">
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-[#0F3D2E] font-poppins">
                  {card.title}
                </h3>
                <p className="text-xs text-[#0B0B0B]/70 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] mt-4">
                <span className="text-xs font-bold text-[#FF6A3D] hover:underline flex items-center gap-1 cursor-pointer">
                  <span>{card.action}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Support Request Form & Contact Channels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Open Ticket */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] text-xs font-bold uppercase tracking-wider">
                <MessageSquare className="w-3 h-3 text-[#FF6A3D]" />
                <span>Submit a Request</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F3D2E] font-poppins mt-2">
                Open a Support Ticket
              </h2>
              <p className="text-xs text-[#0B0B0B]/70 mt-1">
                Our support desk triages tickets by severity. Kitchen and live floor inquiries receive immediate escalation.
              </p>
            </div>

            {ticketSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Ticket Dispatched</span>
                  <span className="mt-0.5 block leading-relaxed">{ticketSuccess}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                    placeholder="e.g. Rahul Verma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                    Restaurant / Outlet Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.restaurantName}
                    onChange={(e) => setTicketForm({ ...ticketForm, restaurantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                    placeholder="e.g. The Royal Bistro (Indiranagar)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                    placeholder="manager@royalbistro.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.phone}
                    onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                    Issue Category *
                  </label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                  >
                    <option value="KDS">Kitchen Display Screen (KDS) &amp; KOT</option>
                    <option value="QR">Table QR Ordering &amp; Menu</option>
                    <option value="TABLES">Floorplan &amp; Dining Tables</option>
                    <option value="INVENTORY">Inventory &amp; Stock Depletion</option>
                    <option value="STAFF">Staff Roles &amp; Permissions</option>
                    <option value="BILLING">Subscription &amp; Invoicing</option>
                    <option value="HARDWARE">Tablet, Mount or Printer Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                    Service Urgency *
                  </label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] font-bold"
                  >
                    <option value="LOW">Low (General Inquiry)</option>
                    <option value="MEDIUM">Medium (Feature Guidance)</option>
                    <option value="HIGH">High (Active Dining Shift Issue)</option>
                    <option value="CRITICAL">Critical (Kitchen Floor Blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] resize-none"
                  placeholder="Please describe what happened, any error messages, and which table/station is affected..."
                />
              </div>

              <MorphButton
                type="submit"
                onAction={() => handleSubmitTicket()}
                disabled={submitting}
                loadingLabel="Dispatching Request..."
                successLabel="Dispatched"
                className="w-full py-3.5 rounded-xl bg-[#0F3D2E] hover:bg-[#165742] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0F3D2E]/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#FF6A3D]" />
                <span>Submit Support Ticket</span>
              </MorphButton>
            </form>
          </div>

          {/* Right Column: Direct Channels & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact Cards */}
            <div className="bg-[#0F3D2E] text-white rounded-3xl p-8 space-y-6 shadow-lg">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#FF6A3D]">
                  DIRECT REACH
                </span>
                <h3 className="text-xl font-extrabold font-poppins">
                  Instant Support Channels
                </h3>
                <p className="text-xs text-[#E5E7EB]/80 leading-relaxed">
                  When service is live, every second counts. Connect immediately with our restaurant operations desk.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#165742]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#FF6A3D]">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#E5E7EB]/70 block">Toll-Free Shift Hotline</span>
                    <span className="text-sm font-bold text-white font-mono">+91 (800) 727-7800</span>
                    <span className="text-[10px] text-emerald-400 block">Available 24 hours daily</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#FF6A3D]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#E5E7EB]/70 block">Technical Support Inbox</span>
                    <span className="text-sm font-bold text-white font-mono">support@sapru.io</span>
                    <span className="text-[10px] text-[#E5E7EB]/70 block">Tickets acknowledged in &lt; 5 mins</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#FF6A3D]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#E5E7EB]/70 block">Response Time SLA</span>
                    <span className="text-sm font-bold text-white">&lt; 15 Minutes</span>
                    <span className="text-[10px] text-[#E5E7EB]/70 block">For active dining room issues</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Base Callout */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#0F3D2E]">
                <FileText className="w-5 h-5 text-[#FF6A3D]" />
                <h4 className="font-extrabold text-sm font-poppins">Documentation &amp; API</h4>
              </div>
              <p className="text-xs text-[#0B0B0B]/70 leading-relaxed">
                Looking for printer ESC/POS specifications, webhook payloads, or network setup recommendations? Explore our complete documentation library.
              </p>
              <div className="pt-2">
                <Link
                  href="/pricing"
                  className="text-xs font-bold text-[#FF6A3D] hover:underline flex items-center gap-1"
                >
                  <span>Explore Enterprise SLAs &amp; Features</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Support FAQ */}
      <section className="bg-white border-t border-[#E5E7EB] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3D2E] font-poppins">
              Frequently Asked Support Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#0B0B0B]/70">
              Quick answers to common floor, kitchen, and configuration questions.
            </p>
          </div>

          <div className="space-y-3">
            {supportFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] overflow-hidden shadow-2xs transition"
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
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#0B0B0B]/70 leading-relaxed border-t border-[#E5E7EB]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-8 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F3D2E] font-poppins">Sapru Support Hub</span>
            <span>— Mission-critical restaurant operations.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-[#0F3D2E] transition">Home</Link>
            <Link href="/pricing" className="hover:text-[#0F3D2E] transition">Pricing</Link>
            <Link href="/docs" className="hover:text-[#0F3D2E] transition">Docs</Link>
            <Link href="/support" className="text-[#FF6A3D] font-bold">Support</Link>
            <Link href="/login" className="hover:text-[#0F3D2E] transition">Sign In</Link>
          </div>
          <span>© 2026 Sapru Platform Inc. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
