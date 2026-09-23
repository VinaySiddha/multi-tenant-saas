"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Mail } from "lucide-react";

export interface NavLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FloatingNavbarProps {
  logoHref?: string;
  links?: NavLinkItem[];
  email?: string;
  emailHref?: string;
  className?: string;
  activePath?: string;
  variant?: "glass-green" | "glass-light" | "glass-dark";
  onNavigate?: (href: string) => void;
}

const defaultLinks: NavLinkItem[] = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Playground", href: "#playground" },
  { label: "Resource", href: "#resource" },
];

export function MinimalLogoIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Precision minimalist geometric software brand mark */}
      <path
        d="M12 4L19 8V16L12 20L5 16V8L12 4Z"
        stroke="#0B0B0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.5V15.5M8.5 10.5L15.5 13.5"
        stroke="#0F3D2E"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FloatingNavbar({
  logoHref = "/",
  links = defaultLinks,
  email = "hello@yourbrand.com",
  emailHref,
  className = "",
  activePath,
  variant = "glass-green",
  onNavigate,
}: FloatingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mailLink = emailHref || `mailto:${email}`;

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "glass-light":
        return {
          nav: "bg-[#FAFAF8]/80 text-[#0B0B0B] border-[#0F3D2E]/15 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.8)_inset,0_1px_2px_0_rgba(255,255,255,0.9)_inset]",
          logo: "bg-[#0F3D2E] text-[#FAFAF8] hover:bg-[#0A291F] border-[#0F3D2E]/30",
          logoIconStroke: "#FAFAF8",
          linkInactive: "text-[#0B0B0B]/70 hover:text-[#0B0B0B] hover:bg-[#0F3D2E]/5",
          linkActive: "text-[#0F3D2E] font-semibold bg-[#0F3D2E]/10 shadow-xs",
          emailBtn: "bg-[#0F3D2E] hover:bg-[#0A291F] text-[#FAFAF8] border-[#0F3D2E]/30 hover:border-[#FF6A3D]",
          mobileBtn: "bg-[#0F3D2E]/10 text-[#0B0B0B] hover:text-[#FF6A3D] border-[#0F3D2E]/20",
          dropdown: "bg-[#FAFAF8]/95 text-[#0B0B0B] border-[#0F3D2E]/15 shadow-2xl",
          dropdownItem: "text-[#0B0B0B]/80 hover:text-[#FF6A3D] hover:bg-[#0F3D2E]/5",
        };
      case "glass-dark":
        return {
          nav: "bg-[#0B0B0B]/85 text-[#FAFAF8] border-white/20 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_1px_0_rgba(255,255,255,0.2)_inset]",
          logo: "bg-[#FAFAF8] text-[#0B0B0B] hover:bg-white border-[#FAFAF8]/60",
          logoIconStroke: "#0B0B0B",
          linkInactive: "text-[#E5E7EB]/80 hover:text-white hover:bg-white/10",
          linkActive: "text-white font-semibold bg-white/15 shadow-xs",
          emailBtn: "bg-[#FAFAF8]/90 hover:bg-white text-[#0B0B0B] border-[#E5E7EB] hover:border-[#FF6A3D]",
          mobileBtn: "bg-white/10 text-white hover:text-[#FF6A3D] border-white/20",
          dropdown: "bg-[#0B0B0B]/95 text-[#FAFAF8] border-white/20 shadow-2xl",
          dropdownItem: "text-[#E5E7EB] hover:text-[#FF6A3D] hover:bg-white/10",
        };
      case "glass-green":
      default:
        return {
          nav: "bg-[#0F3D2E]/80 text-[#FAFAF8] border-[#FAFAF8]/20 shadow-[0_16px_36px_-6px_rgba(15,61,46,0.45),0_0_0_1px_rgba(250,250,248,0.12)_inset,0_1px_2px_0_rgba(255,255,255,0.25)_inset]",
          logo: "bg-[#FAFAF8]/95 hover:bg-white text-[#0B0B0B] border-[#FAFAF8]/60 shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(255,255,255,0.8)_inset]",
          logoIconStroke: "#0B0B0B",
          linkInactive: "text-[#E5E7EB]/90 hover:text-white hover:bg-white/10",
          linkActive: "text-white font-semibold bg-white/15 shadow-xs",
          emailBtn: "bg-[#FAFAF8]/90 hover:bg-white text-[#0B0B0B] border-[#E5E7EB]/80 hover:border-[#FF6A3D] shadow-[0_2px_8px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.9)_inset]",
          mobileBtn: "bg-[#0A291F]/70 text-[#FAFAF8] hover:text-[#FF6A3D] border-[#FAFAF8]/20 hover:bg-white/15",
          dropdown: "bg-[#0F3D2E]/90 text-[#FAFAF8] border-[#FAFAF8]/20 shadow-[0_20px_40px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.15)_inset]",
          dropdownItem: "text-[#FAFAF8]/90 hover:text-[#FF6A3D] hover:bg-white/10",
        };
    }
  };

  const vStyles = getVariantClasses();

  return (
    <header
      className={`fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ${
        scrolled ? "top-3 sm:top-4" : ""
      } ${className}`}
    >
      <div className="relative pointer-events-auto max-w-fit w-full">
        {/* Floating Capsule Bar with Glassmorphism Backdrop Blur & Specular Reflections */}
        <nav
          aria-label="Main Navigation"
          className={`backdrop-blur-xl backdrop-saturate-150 rounded-full p-1.5 sm:p-2 pl-2 sm:pl-2.5 pr-2 sm:pr-2.5 flex items-center justify-between gap-3 sm:gap-6 md:gap-8 border transition-all duration-300 ${vStyles.nav}`}
        >
          {/* 1. LEFT: Circular Logo Anchor */}
          <Link
            href={logoHref}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A3D] border ${vStyles.logo}`}
            title="Home"
          >
            <MinimalLogoIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </Link>

          {/* 2. CENTER: Understated Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-1 md:gap-2 px-1">
            {links.map((link) => {
              const isActive = activePath === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`text-xs sm:text-[13px] font-medium tracking-normal transition-all duration-200 select-none px-3 py-1.5 rounded-full relative ${
                    isActive ? vStyles.linkActive : vStyles.linkInactive
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF6A3D] shadow-[0_0_8px_#FF6A3D]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 3. RIGHT: Prominent Email / Contact Pill CTA */}
          <div className="flex items-center gap-1.5">
            <a
              href={mailLink}
              className={`text-xs sm:text-[13px] font-medium px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A3D] ${vStyles.emailBtn}`}
            >
              <span>{email}</span>
            </a>

            {/* Mobile Hamburger Trigger (visible on xs only) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`sm:hidden w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none border ${vStyles.mobileBtn}`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel with Glassmorphism */}
        {mobileMenuOpen && (
          <div
            className={`sm:hidden absolute top-full left-0 right-0 mt-2 p-3 backdrop-blur-2xl border rounded-2xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150 ${vStyles.dropdown}`}
          >
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${vStyles.dropdownItem}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
