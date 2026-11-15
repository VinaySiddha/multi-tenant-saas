"use client";

import React from "react";

interface SapruLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export function SapruIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer rounded geometric container in Deep Green */}
      <rect width="32" height="32" rx="8" fill="#0F3D2E" stroke="#165742" strokeWidth="1" />
      
      {/* Precision Geometric S Emblem in Warm White */}
      <path
        d="M21.5 10.5H13.5C11.8431 10.5 10.5 11.8431 10.5 13.5C10.5 15.1569 11.8431 16.5 13.5 16.5H18.5C20.1569 16.5 21.5 17.8431 21.5 19.5C21.5 21.1569 20.1569 22.5 18.5 22.5H10.5"
        stroke="#FAFAF8"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Precision Culinary/Telemetry Accent dots in Sapru Orange */}
      <circle cx="21.5" cy="10.5" r="1.5" fill="#FF6A3D" />
      <circle cx="10.5" cy="22.5" r="1.5" fill="#FF6A3D" />
    </svg>
  );
}

export default function SapruLogo({
  className = "",
  size = 28,
  showWordmark = true,
}: SapruLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <SapruIcon size={size} />
      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-[0.18em] text-[#FAFAF8] dark:text-[#FAFAF8] uppercase font-mono">
            SAPRU
          </span>
          <span className="text-[9px] tracking-widest text-[#E5E7EB]/80 uppercase font-semibold">
            Restaurant Software
          </span>
        </div>
      )}
    </div>
  );
}
