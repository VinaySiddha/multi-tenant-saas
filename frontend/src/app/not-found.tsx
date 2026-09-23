import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] dark:bg-[#0B0B0B] text-slate-900 dark:text-slate-100 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] text-xs font-semibold mb-4 tracking-wider uppercase">
        404 — Page Not Found
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
        Page not found
      </h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0F3D2E] hover:bg-[#165640] text-white font-medium shadow-sm transition-all"
      >
        Return to Home
      </Link>
    </div>
  );
}
