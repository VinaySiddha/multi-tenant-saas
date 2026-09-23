"use client";

import React, { useState } from "react";
import FloatingNavbar from "@/components/FloatingNavbar";
import { ArrowRight, Check, Copy, Sparkles, Sliders, Moon, Sun, Smartphone, Monitor } from "lucide-react";

export default function NavbarPreviewPage() {
  const [bgMode, setBgMode] = useState<"warm-white" | "deep-green" | "soft-gray">("warm-white");
  const [glassVariant, setGlassVariant] = useState<"glass-green" | "glass-light" | "glass-dark">("glass-green");
  const [emailText, setEmailText] = useState("hello@sapru.io");
  const [activeSection, setActiveSection] = useState("Work");
  const [copied, setCopied] = useState(false);

  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Playground", href: "#playground" },
    { label: "Resource", href: "#resource" },
  ];

  const getBackgroundClass = () => {
    switch (bgMode) {
      case "warm-white":
        return "bg-[#FAFAF8] text-[#0B0B0B]";
      case "soft-gray":
        return "bg-[#F3F4F6] text-[#0B0B0B]";
      case "deep-green":
      default:
        return "bg-[#0A291F] text-[#FAFAF8]";
    }
  };

  const copyCodeSnippet = () => {
    navigator.clipboard.writeText(`<FloatingNavbar 
  variant="${glassVariant}"
  links={[
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Playground", href: "#playground" },
    { label: "Resource", href: "#resource" },
  ]}
  email="${emailText}"
/>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans relative overflow-hidden ${getBackgroundClass()}`}>
      {/* Background Ambient Glows to test Glassmorphism Blur */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#FF6A3D]/25 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-28 right-1/4 w-96 h-96 bg-[#0F3D2E]/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. Floating Glassmorphism Capsule Navigation Bar */}
      <FloatingNavbar
        links={navLinks}
        email={emailText}
        variant={glassVariant}
        activePath={`#${activeSection.toLowerCase()}`}
        onNavigate={(href) => setActiveSection(href.replace("#", ""))}
      />

      {/* 2. Hero Presentation Canvas */}
      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24 space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-[#0F3D2E]/10 border border-[#0F3D2E]/20 text-[#0F3D2E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" />
            <span>Minimalist Floating Navigation Bar</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F3D2E]">
            Designed for Modern Hospitality
          </h1>

          <p className="text-base sm:text-lg opacity-75 max-w-xl mx-auto leading-relaxed">
            Floating Deep Green pill capsule, precision optical centering, circular brand anchor, and prominent off-white CTA.
          </p>
        </div>

        {/* Live Playground & Controls Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] space-y-8 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-lg font-bold text-[#0F3D2E]">Interactive Control Panel</h2>
              <p className="text-xs text-[#0B0B0B]/60 mt-0.5">Toggle background canvases, adjust email text, and inspect geometry</p>
            </div>

            <button
              onClick={copyCodeSnippet}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FF6A3D] hover:bg-[#FF5522] text-white transition flex items-center gap-1.5 shadow-md shadow-[#FF6A3D]/25"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied JSX!" : "Copy Component JSX"}</span>
            </button>
          </div>

          {/* Control Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Glassmorphism Style Switcher */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0B0B0B]/70 block">
                Glassmorphism Palette
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setGlassVariant("glass-green")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium border transition text-center ${
                    glassVariant === "glass-green"
                      ? "bg-[#0F3D2E] text-white border-[#FF6A3D] font-bold shadow-xs"
                      : "bg-[#FAFAF8] text-[#0B0B0B]/70 border-[#E5E7EB]"
                  }`}
                >
                  Deep Green
                </button>

                <button
                  type="button"
                  onClick={() => setGlassVariant("glass-light")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium border transition text-center ${
                    glassVariant === "glass-light"
                      ? "bg-white text-[#0F3D2E] border-[#FF6A3D] font-bold shadow-xs"
                      : "bg-[#FAFAF8] text-[#0B0B0B]/70 border-[#E5E7EB]"
                  }`}
                >
                  Warm White
                </button>

                <button
                  type="button"
                  onClick={() => setGlassVariant("glass-dark")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium border transition text-center ${
                    glassVariant === "glass-dark"
                      ? "bg-[#0B0B0B] text-white border-[#FF6A3D] font-bold shadow-xs"
                      : "bg-[#FAFAF8] text-[#0B0B0B]/70 border-[#E5E7EB]"
                  }`}
                >
                  Charcoal
                </button>
              </div>
            </div>

            {/* Background Theme Switcher */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0B0B0B]/70 block">
                Canvas Background
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setBgMode("warm-white")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium border transition flex items-center justify-center gap-1 ${
                    bgMode === "warm-white"
                      ? "bg-[#FAFAF8] text-[#0B0B0B] border-[#FF6A3D] font-bold shadow-xs"
                      : "bg-[#FAFAF8] text-[#0B0B0B]/70 border-[#E5E7EB]"
                  }`}
                >
                  <Sun className="w-3 h-3 text-[#FF6A3D]" />
                  <span>#FAFAF8</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBgMode("soft-gray")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium border transition flex items-center justify-center gap-1 ${
                    bgMode === "soft-gray"
                      ? "bg-[#F3F4F6] text-[#0B0B0B] border-[#FF6A3D] font-bold shadow-xs"
                      : "bg-[#FAFAF8] text-[#0B0B0B]/70 border-[#E5E7EB]"
                  }`}
                >
                  <span>#F3F4F6</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBgMode("deep-green")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium border transition flex items-center justify-center gap-1 ${
                    bgMode === "deep-green"
                      ? "bg-[#0F3D2E] text-white border-[#FF6A3D] font-bold shadow-xs"
                      : "bg-[#FAFAF8] text-[#0B0B0B]/70 border-[#E5E7EB]"
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>#0F3D2E</span>
                </button>
              </div>
            </div>

            {/* Email CTA Text Customizer */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0B0B0B]/70 block">
                Right CTA Email Address
              </label>
              <input
                type="text"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="hello@sapru.io"
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FAFAF8] border border-[#E5E7EB] text-[#0B0B0B] focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] transition"
              />
            </div>

          </div>

          {/* Design Specifications Blueprint */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E]">
              Geometry &amp; Design Language Specifications
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                <span className="text-[#0B0B0B]/50 block text-[10px] uppercase font-bold">Outer Silhouette</span>
                <span className="font-semibold text-sm mt-0.5 block text-[#0F3D2E]">Capsule Pill</span>
                <span className="text-[#0B0B0B]/60 text-[11px]">Radius: 36px / #0F3D2E</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                <span className="text-[#0B0B0B]/50 block text-[10px] uppercase font-bold">Left Brand Anchor</span>
                <span className="font-semibold text-sm mt-0.5 block text-[#0F3D2E]">Circular Badge</span>
                <span className="text-[#0B0B0B]/60 text-[11px]">Size: 36px / #FAFAF8</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                <span className="text-[#0B0B0B]/50 block text-[10px] uppercase font-bold">Navigation Links</span>
                <span className="font-semibold text-sm mt-0.5 block text-[#0F3D2E]">13px Medium</span>
                <span className="text-[#0B0B0B]/60 text-[11px]">Color: #E5E7EB</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                <span className="text-[#0B0B0B]/50 block text-[10px] uppercase font-bold">Right CTA Button</span>
                <span className="font-semibold text-sm mt-0.5 block text-[#0F3D2E]">Off-White Pill</span>
                <span className="text-[#0B0B0B]/60 text-[11px]">Text: #0B0B0B</span>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Showcase Sections to Test Scroll */}
        <div className="space-y-12">
          <section id="work" className="p-8 rounded-3xl bg-white border border-[#E5E7EB] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6A3D]">Section 01</span>
            <h3 className="text-2xl font-bold text-[#0F3D2E]">Featured Work &amp; Case Studies</h3>
            <p className="text-xs leading-relaxed text-[#0B0B0B]/70">
              Interactive portfolio pieces, modern digital systems, and enterprise design architecture.
            </p>
          </section>

          <section id="about" className="p-8 rounded-3xl bg-white border border-[#E5E7EB] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D2E]">Section 02</span>
            <h3 className="text-2xl font-bold text-[#0F3D2E]">About the Platform</h3>
            <p className="text-xs leading-relaxed text-[#0B0B0B]/70">
              Crafted with precision, minimal aesthetic principles, and seamless responsive geometry.
            </p>
          </section>

          <section id="playground" className="p-8 rounded-3xl bg-white border border-[#E5E7EB] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6A3D]">Section 03</span>
            <h3 className="text-2xl font-bold text-[#0F3D2E]">Interactive Playground</h3>
            <p className="text-xs leading-relaxed text-[#0B0B0B]/70">
              Experimental interfaces, micro-interactions, and component labs.
            </p>
          </section>

          <section id="resource" className="p-8 rounded-3xl bg-white border border-[#E5E7EB] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F3D2E]">Section 04</span>
            <h3 className="text-2xl font-bold text-[#0F3D2E]">Developer &amp; Design Resources</h3>
            <p className="text-xs leading-relaxed text-[#0B0B0B]/70">
              Component kits, design tokens, icons, and production guidelines.
            </p>
          </section>
        </div>

      </main>
    </div>
  );
}
