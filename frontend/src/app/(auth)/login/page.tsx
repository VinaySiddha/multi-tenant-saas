"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ChefHat, 
  Receipt, 
  Building2, 
  Server, 
  Flame, 
  Zap, 
  QrCode, 
  User, 
  Phone, 
  HelpCircle,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/api-client";
import { MorphButton } from "@/components/spectrumui/morph-button";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setBranches } = useAuthStore();
  
  // Auth Mode: "LOGIN" vs "REGISTER_TENANT"
  const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER_TENANT">("LOGIN");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    restaurantName: "",
    slug: "",
    ownerName: "",
    email: "",
    password: "",
    phoneNumber: "",
    branchName: "",
    branchCode: "",
  });

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await apiClient.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (response.data?.success && response.data?.data) {
        const { accessToken, refreshToken, user, restaurant, branch } = response.data.data;
        
        const mappedUser = {
          ...user,
          role: (user.primaryRole || user.role || "RESTAURANT_OWNER") as UserRole,
        };

        setAuth(accessToken, refreshToken, mappedUser, restaurant, branch);

        // Fetch all tenant branches for multi-branch switching
        try {
          const branchRes = await apiClient.get("/restaurants/branches", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Tenant-ID": restaurant?.id,
            },
          });
          if (branchRes.data?.data && Array.isArray(branchRes.data.data)) {
            setBranches(branchRes.data.data);
          }
        } catch {
          // ignore
        }
        
        if (mappedUser.role === "CHEF") {
          router.push("/kds");
        } else if (mappedUser.role === "CASHIER") {
          router.push("/orders");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMsg(response.data?.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err: any) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setErrorMsg(serverMsg);
      } else if (!err.response) {
        setErrorMsg("Unable to connect to platform API. Please ensure backend service is running.");
      } else {
        setErrorMsg("Authentication failed. Please verify email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterTenant = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const slug = regForm.slug || regForm.restaurantName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const response = await apiClient.post("/auth/register-restaurant", {
        restaurantName: regForm.restaurantName,
        slug: slug,
        ownerName: regForm.ownerName,
        email: regForm.email.trim().toLowerCase(),
        password: regForm.password,
        phoneNumber: regForm.phoneNumber,
        branchName: regForm.branchName,
        branchCode: regForm.branchCode,
        plan: "PRO"
      });

      if (response.data?.success && response.data?.data) {
        const { accessToken, refreshToken, user, restaurant, branch } = response.data.data;
        const mappedUser = {
          ...user,
          role: "RESTAURANT_OWNER" as UserRole,
        };
        setAuth(accessToken, refreshToken, mappedUser, restaurant, branch, branch ? [branch] : []);
        router.push("/dashboard");
      } else {
        setErrorMsg(response.data?.message || "Registration failed. Please check your form fields.");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Could not register restaurant tenant. Ensure email and restaurant slug are unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAFAF8] text-[#0B0B0B] font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Clean Production-Grade Login / Register                      */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[48%] xl:w-[44%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white border-r border-[#E5E7EB] shrink-0">
        
        {/* 1. Header: Logo & Auth Mode Toggle */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-[#E5E7EB] group-hover:scale-105 transition-transform">
              <Image
                src="/app-icon-dark.png"
                alt="Sapru Logo"
                width={36}
                height={36}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#0F3D2E] flex items-center font-poppins">
              Sapru<span className="text-[10px] text-[#FF6A3D] ml-0.5 font-bold">™</span>
            </span>
          </Link>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#FAFAF8] border border-[#E5E7EB] p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("LOGIN");
                setErrorMsg(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                authMode === "LOGIN"
                  ? "bg-[#0F3D2E] text-white shadow-xs font-bold"
                  : "text-[#0B0B0B]/70 hover:text-[#0F3D2E]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("REGISTER_TENANT");
                setErrorMsg(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                authMode === "REGISTER_TENANT"
                  ? "bg-[#0F3D2E] text-white shadow-xs font-bold"
                  : "text-[#0B0B0B]/70 hover:text-[#0F3D2E]"
              }`}
            >
              Register Tenant
            </button>
          </div>
        </div>

        {/* 2. Main Form Content */}
        <div className="my-auto py-8 max-w-md w-full mx-auto space-y-6">
          
          {authMode === "LOGIN" ? (
            <>
              {/* Title & Tag */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F3D2E]/10 text-[#0F3D2E] text-xs font-bold tracking-wide uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A3D]" />
                  <span>Restaurant Management Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F3D2E] font-poppins">
                  Welcome back
                </h1>
                <p className="text-xs sm:text-sm text-[#0B0B0B]/70">
                  Enter your credentials to access your restaurant workspace.
                </p>
              </div>

              {/* Error Message Alert */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0B0B] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg(null);
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] text-[#0B0B0B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] focus:border-[#FF6A3D] transition shadow-xs"
                      placeholder="owner@royalbistro.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#0B0B0B]">
                      Password
                    </label>
                    <Link
                      href="/support"
                      className="text-[11px] font-semibold text-[#FF6A3D] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] text-[#0B0B0B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] focus:border-[#FF6A3D] transition shadow-xs"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0B0B0B] transition p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0B0B0B]/80 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E5E7EB] text-[#0F3D2E] focus:ring-[#FF6A3D] w-4 h-4 cursor-pointer"
                    />
                    <span>Remember my session</span>
                  </label>
                  
                  <Link href="/pricing" className="text-xs text-[#0F3D2E] hover:underline font-semibold">
                    View Pricing Plans &rarr;
                  </Link>
                </div>

                <MorphButton
                  type="submit"
                  onAction={() => handleLogin()}
                  disabled={loading}
                  loadingLabel="Authenticating..."
                  successLabel="Access Granted"
                  className="w-full py-3 rounded-xl bg-[#0F3D2E] hover:bg-[#165742] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0F3D2E]/20 mt-2 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </MorphButton>
              </form>
            </>
          ) : (
            <>
              {/* Register Tenant Form */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] text-xs font-bold tracking-wide uppercase">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>New Tenant Onboarding</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F3D2E] font-poppins">
                  Register Your Restaurant
                </h1>
                <p className="text-xs sm:text-sm text-[#0B0B0B]/70">
                  Provision an isolated tenant database, flagship branch, and owner login.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterTenant} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.restaurantName}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
                        setRegForm({ ...regForm, restaurantName: name, slug: slug });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                      placeholder="e.g. Royal Bistro"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Tenant Slug (Subdomain)
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.slug}
                      onChange={(e) => setRegForm({ ...regForm, slug: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] font-mono text-[11px]"
                      placeholder="royal-bistro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Owner Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regForm.ownerName}
                        onChange={(e) => setRegForm({ ...regForm, ownerName: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                        placeholder="Alex Mercer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regForm.phoneNumber}
                        onChange={(e) => setRegForm({ ...regForm, phoneNumber: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Account Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                        placeholder="owner@restaurant.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Secure Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Flagship Outlet Name
                    </label>
                    <input
                      type="text"
                      value={regForm.branchName}
                      onChange={(e) => setRegForm({ ...regForm, branchName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
                      placeholder="Indiranagar Flagship"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0B0B] mb-1">
                      Branch Code
                    </label>
                    <input
                      type="text"
                      value={regForm.branchCode}
                      onChange={(e) => setRegForm({ ...regForm, branchCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] font-mono text-[11px]"
                      placeholder="IND-01"
                    />
                  </div>
                </div>

                <MorphButton
                  type="submit"
                  onAction={() => handleRegisterTenant()}
                  disabled={loading}
                  loadingLabel="Provisioning Tenant..."
                  successLabel="Workspace Ready!"
                  className="w-full py-3 rounded-xl bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF6A3D]/25 mt-2 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Restaurant Workspace</span>
                </MorphButton>
              </form>
            </>
          )}

        </div>

        {/* 3. Footer Links */}
        <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#0F3D2E] transition font-medium">Home</Link>
            <Link href="/pricing" className="hover:text-[#0F3D2E] transition font-medium">Pricing</Link>
            <Link href="/support" className="hover:text-[#0F3D2E] transition font-medium">Support</Link>
          </div>
          <span className="text-[11px] font-mono">© 2026 Sapru Platform Inc.</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Brand Hospitality Telemetry & Visual Preview                */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-10 xl:p-14 bg-[#0F3D2E] text-white relative overflow-hidden">
        
        {/* Ambient Culinary Graphic Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="580" cy="150" r="100" fill="#FF6A3D" opacity="0.3" />
            <circle cx="120" cy="550" r="140" fill="#165742" opacity="0.6" />
            <path d="M420 80 Q 520 200, 640 160 T 600 380" stroke="#FF6A3D" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
            <circle cx="350" cy="350" r="180" stroke="#165742" strokeWidth="1.5" opacity="0.5" />
            <circle cx="350" cy="350" r="260" stroke="#165742" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
          </svg>
        </div>

        {/* Top Telemetry Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold tracking-wider uppercase text-white">
            SAPRU RESTAURANT OS
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A291F] border border-[#165742] text-xs font-medium text-[#E5E7EB]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Operational • Multi-Branch Ready</span>
          </div>
        </div>

        {/* Hero Visual Card Matrix */}
        <div className="relative z-10 my-auto py-8 space-y-6 max-w-lg">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF6A3D]/20 border border-[#FF6A3D]/30 text-[#FF6A3D] text-xs font-mono font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              <span>HIGH-PERFORMANCE HOSPITALITY</span>
            </div>
            
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-poppins">
              One unified console for modern food &amp; dining operations.
            </h2>
            
            <p className="text-sm text-[#E5E7EB]/80 leading-relaxed">
              Table floorplans, KDS ticketing, stock depletion, and invoices—synchronized in real time.
            </p>
          </div>

          {/* 2 Floating Glass Telemetry Cards */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Live Orders Card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl hover:border-[#FF6A3D]/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6A3D]/20 border border-[#FF6A3D]/30 flex items-center justify-center text-[#FF6A3D]">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Live Orders</div>
                    <div className="text-[10px] text-[#E5E7EB]/70">Table &amp; QR Stream</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-[#E5E7EB]/80">
                  <span>Dining Capacity</span>
                  <span className="font-mono font-bold text-white">84%</span>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-[#FF6A3D] rounded-full w-[84%]" />
                </div>
              </div>
            </div>

            {/* KDS Line Card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl hover:border-[#FF6A3D]/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">KDS Kitchen</div>
                    <div className="text-[10px] text-[#E5E7EB]/70">Prep Line #1</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#FF6A3D] bg-[#FF6A3D]/10 px-1.5 py-0.5 rounded">
                  Sync
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#E5E7EB]/90">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#FF6A3D]" />
                  <span>Real-time Audio Alert</span>
                </span>
                <span className="font-mono text-emerald-400">0 Overdue</span>
              </div>
            </div>

          </div>

          {/* Stencil Badges Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#0A291F] border border-[#165742] text-[10px] font-mono text-[#E5E7EB]/90 flex items-center gap-1.5">
              <Server className="w-3 h-3 text-[#FF6A3D]" />
              PostgreSQL Multi-Tenant
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#0A291F] border border-[#165742] text-[10px] font-mono text-[#E5E7EB]/90 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              RBAC Dual Enforced
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#0A291F] border border-[#165742] text-[10px] font-mono text-[#E5E7EB]/90 flex items-center gap-1.5">
              <QrCode className="w-3 h-3 text-cyan-400" />
              Contactless Table QR
            </span>
          </div>
        </div>

        {/* Bottom Trust Stamp */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#E5E7EB]/70 border-t border-[#165742] pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Production Grade Multi-Tenant Architecture</span>
          </div>
          <Link href="/support" className="text-white hover:text-[#FF6A3D] font-semibold transition flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>24/7 Support Desk</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
