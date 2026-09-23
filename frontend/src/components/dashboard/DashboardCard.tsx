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
        "rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 overflow-hidden flex flex-col justify-between",
        className
      )}
    >
      <div className={cn("p-6 flex-1", bodyClassName)}>
        {(title || action) && (
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              {title && (
                <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
        <div className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 px-6 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}
