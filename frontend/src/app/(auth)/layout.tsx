import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#0A0E14] text-slate-100 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex flex-col items-center gap-2 mb-6 group">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-[#FF6A3D]/25 border border-slate-700/80 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/app-icon-dark.png"
              alt="Sapru"
              width={48}
              height={48}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black tracking-tight text-white flex items-center">
              Sapru<span className="text-xs text-[#FF6A3D] ml-0.5 -mt-3">™</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Built For A Better Tomorrow
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-800">
          {children}
        </div>
      </div>
    </div>
  );
}
