"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("owner@royalbistro.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      if (response.data?.success) {
        const { accessToken, refreshToken, user, restaurant, branch } = response.data.data;
        setAuth(accessToken, refreshToken, user, restaurant, branch);
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(response.data?.message || "Login failed");
      }
    } catch (err: any) {
      // Fallback for standalone demo mode if backend is not started locally
      const isNetworkError = !err.response;
      if (isNetworkError) {
        setAuth(
          "demo-jwt-token",
          "demo-refresh-token",
          {
            id: "9ca85f64-5717-4562-b3fc-2c963f66afa9",
            email: email,
            fullName: "Alex Mercer (Demo)",
            role: "RESTAURANT_OWNER",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            name: "The Royal Bistro",
            slug: "royal-bistro",
            email: "owner@royalbistro.com",
            subscriptionPlan: "ENTERPRISE",
            subscriptionStatus: "ACTIVE",
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: "7ca85f64-5717-4562-b3fc-2c963f66afa7",
            tenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            name: "Indiranagar Flagship",
            code: "IND-01",
            currency: "INR",
            isActive: true,
            createdAt: new Date().toISOString(),
          }
        );
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(err.response?.data?.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to your restaurant
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Multi-tenant POS, Kitchen Display & Management console
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

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
          {loading ? "Authenticating..." : "Continue to Dashboard"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-500">
          Demo accounts: <code className="text-indigo-600">owner@royalbistro.com</code> (Password: <code className="text-indigo-600">Admin@123</code>)
        </p>
      </div>
    </div>
  );
}
