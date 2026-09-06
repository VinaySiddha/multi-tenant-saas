import Link from "next/link";
import { 
  Building2, 
  UtensilsCrossed, 
  ChefHat, 
  QrCode, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Receipt
} from "lucide-react";

export default function HomePage() {
  const modules = [
    {
      title: "Authentication & Portal",
      href: "/login",
      icon: ShieldCheck,
      description: "Secure JWT login with Multi-Tenant & Multi-Branch switching",
      badge: "Module 3",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Restaurant & Branch Admin",
      href: "/admin/dashboard",
      icon: Building2,
      description: "Enterprise Onboarding, Staff, Subscriptions & Branch config",
      badge: "Module 4",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "POS Cloud Terminal",
      href: "/pos/terminal",
      icon: Receipt,
      description: "Fast touch-friendly POS billing, Table management & split checks",
      badge: "Module 5",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Kitchen Display System (KDS)",
      href: "/kitchen/kds",
      icon: ChefHat,
      description: "Real-time WebSocket KOT processing with timer warnings & ticket routing",
      badge: "Module 6",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Self-Service QR Ordering",
      href: "/qr/menu/demo-table-1",
      icon: QrCode,
      description: "Customer-facing interactive digital menu with instant cart & UPI prepay",
      badge: "Module 7",
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Reports & Analytics",
      href: "/admin/dashboard",
      icon: TrendingUp,
      description: "Sales summaries, item performance, revenue trends, and audit trails",
      badge: "Module 9",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                RestoSaaS
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Enterprise
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="http://localhost:8080/api/v1/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Swagger API Docs
            </a>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 mb-6 border border-slate-200 dark:border-slate-700">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Module 1: Foundation & Project Architecture Ready
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
            Multi-Tenant Restaurant SaaS Platform
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Enterprise cloud restaurant ecosystem engineered with Spring Boot 3 (Java 21),
            Next.js 15 App Router, PostgreSQL multi-tenancy, and real-time WebSockets.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="group relative flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${mod.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-2">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1">
                  {mod.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Explore Module <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 RestoSaaS Inc. Built for Enterprise Restaurant Operations.</p>
          <div className="flex items-center gap-6">
            <span>Spring Boot 3 + Java 21</span>
            <span>Next.js 15 App Router</span>
            <span>PostgreSQL Multi-Tenancy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
