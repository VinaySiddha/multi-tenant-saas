"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("owner@royalbistro.com");
  const [password, setPassword] = useState("Admin@123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock direct login for foundation phase, real JWT endpoint connected in Module 3
    setTimeout(() => {
      setAuth(
        "mock-jwt-token-module-1",
        "mock-refresh-token",
        {
          id: "usr-001",
          email: email,
          fullName: "Alex Mercer",
          role: "RESTAURANT_OWNER",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "The Royal Bistro",
          slug: "royal-bistro",
          email: "contact@royalbistro.com",
          subscriptionPlan: "ENTERPRISE",
          subscriptionStatus: "ACTIVE",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "7ca85f64-5717-4562-b3fc-2c963f66afa7",
          tenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "Downtown Flagship",
          code: "DT-01",
          currency: "INR",
          isActive: true,
          createdAt: new Date().toISOString(),
        }
      );
      setLoading(false);
      router.push("/admin/dashboard");
    }, 600);
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to your restaurant
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access your POS, Kitchen and Management console
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="name@restaurant.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <a href="#" className="text-xs text-indigo-600 hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue to Dashboard"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-500">
          Demo quick credentials are pre-filled. Multi-tenant JWT auth arrives in Module 3.
        </p>
      </div>
    </div>
  );
}
