"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface DashboardCardProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function DashboardCard({
  title,
  subtitle,
  action,
  footer,
  children,
  className,
  bodyClassName,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E5E7EB] dark:border-[#165742]/40 bg-white dark:bg-[#0A291F] shadow-xs transition-all duration-150 overflow-hidden flex flex-col justify-between",
        className
      )}
    >
      <div className={cn("p-5 sm:p-6 flex-1", bodyClassName)}>
        {(title || action) && (
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {title && (
                <h3 className="text-sm sm:text-base font-bold tracking-tight text-[#0F3D2E] dark:text-[#FAFAF8]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 mt-0.5 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
      {footer && (
        <div className="border-t border-[#E5E7EB] dark:border-[#165742]/40 bg-[#FAFAF8] dark:bg-[#0A291F]/80 px-5 sm:px-6 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}
