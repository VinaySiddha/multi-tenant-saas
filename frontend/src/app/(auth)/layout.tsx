import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#FAFAF8] text-[#0B0B0B] font-sans antialiased">
      {children}
    </div>
  );
}
