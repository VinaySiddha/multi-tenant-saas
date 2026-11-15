import React from "react";

export default function QrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex justify-center text-[#0B0B0B]">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl border-x border-[#E5E7EB] flex flex-col">
        {children}
      </div>
    </div>
  );
}

