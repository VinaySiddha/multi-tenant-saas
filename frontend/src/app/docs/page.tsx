"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Terminal,
  Key,
  Shield,
  Layers,
  Search,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Server,
  Zap,
  Radio,
  FileCode,
  Table,
  UtensilsCrossed,
  Receipt,
  ChefHat,
  QrCode,
  CreditCard,
  Package,
  Users2,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import FloatingNavbar from "@/components/FloatingNavbar";
import { SapruIcon } from "@/components/SapruLogo";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface EndpointDoc {
  id: string;
  category: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  authRequired: boolean;
  requiredRole?: string;
  headers?: { name: string; required: boolean; desc: string }[];
  requestBody?: string;
  responseBody: string;
  curlExample: string;
}

const ENDPOINTS: EndpointDoc[] = [
  // --- AUTH ---
  {
    id: "auth-login",
    category: "Authentication",
    method: "POST",
    path: "/api/v1/auth/login",
    summary: "User Authentication",
    description: "Verifies credentials, checks tenant active status, and returns an access JWT with refresh credentials.",
    authRequired: false,
    requestBody: JSON.stringify(
      {
        email: "owner@royalbistro.com",
        password: "Password123!"
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          expiresInMs: 86400000,
          user: {
            id: "9ca85f64-5717-4562-b3fc-2c963f66afa9",
            email: "owner@royalbistro.com",
            fullName: "Alex Mercer",
            role: "RESTAURANT_OWNER",
            tenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            branchId: "7ca85f64-5717-4562-b3fc-2c963f66afa7"
          }
        },
        message: "Login successful",
        timestamp: "2026-11-15T14:30:00Z"
      },
      null,
      2
    ),
    curlExample: `curl -X POST https://sapru.io/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"owner@royalbistro.com","password":"Password123!"}'`
  },
  {
    id: "auth-register",
    category: "Authentication",
    method: "POST",
    path: "/api/v1/auth/register-restaurant",
    summary: "Register Restaurant & Start 14-Day Free Trial",
    description: "Onboards a new restaurant tenant, generates a default flagship branch, provisions the owner account, and initializes a 14-day free trial on the Growth plan.",
    authRequired: false,
    requestBody: JSON.stringify(
      {
        restaurantName: "The Copper Chimney",
        slug: "copper-chimney",
        ownerName: "Priya Sharma",
        email: "priya@copperchimney.com",
        password: "StrongPassword123!",
        phoneNumber: "+91 98765 11223",
        city: "Bengaluru",
        state: "Karnataka",
        plan: "GROWTH"
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          token: "eyJhbGciOiJIUzI1Ni...",
          refreshToken: "eyJhbGciOiJIUzI1Ni...",
          user: {
            id: "1a2b3c4d-...",
            email: "priya@copperchimney.com",
            role: "RESTAURANT_OWNER"
          }
        },
        message: "Restaurant onboarded successfully with 14-day trial",
        timestamp: "2026-11-15T14:30:00Z"
      },
      null,
      2
    ),
    curlExample: `curl -X POST https://sapru.io/api/v1/auth/register-restaurant \\
  -H "Content-Type: application/json" \\
  -d '{"restaurantName":"The Copper Chimney","slug":"copper-chimney","ownerName":"Priya Sharma","email":"priya@copperchimney.com","password":"StrongPassword123!","phoneNumber":"+91 98765 11223","city":"Bengaluru","state":"Karnataka","plan":"GROWTH"}'`
  },
  {
    id: "auth-me",
    category: "Authentication",
    method: "GET",
    path: "/api/v1/auth/me",
    summary: "Get Authenticated Profile",
    description: "Returns currently authenticated user profile, tenant information, and branch mappings.",
    authRequired: true,
    headers: [
      { name: "Authorization", required: true, desc: "Bearer <token>" },
      { name: "X-Tenant-ID", required: true, desc: "UUID of active tenant" }
    ],
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          id: "9ca85f64-5717-4562-b3fc-2c963f66afa9",
          email: "owner@royalbistro.com",
          fullName: "Alex Mercer",
          primaryRole: "RESTAURANT_OWNER",
          tenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          branchId: "7ca85f64-5717-4562-b3fc-2c963f66afa7"
        }
      },
      null,
      2
    ),
    curlExample: `curl -X GET https://sapru.io/api/v1/auth/me \\
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \\
  -H "X-Tenant-ID: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`
  },

  // --- BILLING & TRIALS ---
  {
    id: "billing-sub",
    category: "Subscriptions & Billing",
    method: "GET",
    path: "/api/v1/billing/subscription",
    summary: "Get Active Subscription & Trial Status",
    description: "Evaluates current subscription status, remaining trial days, operational access lock, and feature entitlements.",
    authRequired: true,
    headers: [
      { name: "Authorization", required: true, desc: "Bearer <token>" },
      { name: "X-Tenant-ID", required: true, desc: "UUID of active tenant" }
    ],
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          tenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          planCode: "growth",
          planName: "Growth",
          status: "TRIALING",
          trialStartAt: "2026-11-01T00:00:00Z",
          trialEndAt: "2026-11-15T00:00:00Z",
          daysRemainingInTrial: 6,
          isTrialActive: true,
          hasOperationalAccess: true,
          features: [
            { key: "core_pos", name: "Core POS & Billing", included: true },
            { key: "kds", name: "Kitchen Display System", included: true },
            { key: "qr_ordering", name: "QR Ordering & Floorplan", included: true },
            { key: "advanced_reports", name: "Advanced Analytics", included: true }
          ]
        }
      },
      null,
      2
    ),
    curlExample: `curl -X GET https://sapru.io/api/v1/billing/subscription \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "X-Tenant-ID: 3fa85f64-5717-4562-b3fc-2c963f66afa6"`
  },
  {
    id: "billing-plans",
    category: "Subscriptions & Billing",
    method: "GET",
    path: "/api/v1/billing/plans",
    summary: "List Active Commercial Plans",
    description: "Returns list of public commercial subscription plans (Starter ₹999, Growth ₹1,999, Multi-Outlet ₹3,999) with features.",
    authRequired: false,
    responseBody: JSON.stringify(
      {
        success: true,
        data: [
          {
            code: "starter",
            name: "Starter",
            monthlyPrice: 999.00,
            annualPrice: 9990.00,
            currency: "INR",
            maxOutlets: 1
          },
          {
            code: "growth",
            name: "Growth",
            monthlyPrice: 1999.00,
            annualPrice: 19990.00,
            currency: "INR",
            maxOutlets: 1,
            isPopular: true
          },
          {
            code: "multi_outlet",
            name: "Multi-Outlet",
            monthlyPrice: 3999.00,
            annualPrice: 39990.00,
            currency: "INR",
            maxOutlets: 5
          }
        ]
      },
      null,
      2
    ),
    curlExample: `curl -X GET https://sapru.io/api/v1/billing/plans`
  },
  {
    id: "billing-webhook",
    category: "Subscriptions & Billing",
    method: "POST",
    path: "/api/v1/billing/webhook/{provider}",
    summary: "Payment Webhook (HMAC Validated)",
    description: "Receives asynchronous payment and invoice capture webhooks from Razorpay or Stripe, verified via cryptographic HMAC-SHA256 signature.",
    authRequired: false,
    headers: [
      { name: "X-Razorpay-Signature", required: false, desc: "HMAC signature for Razorpay" },
      { name: "Stripe-Signature", required: false, desc: "Webhook signature for Stripe" }
    ],
    requestBody: JSON.stringify(
      {
        event: "payment.captured",
        payload: {
          payment: {
            entity: {
              id: "pay_O7d8f9g0h1j2",
              amount: 199900,
              currency: "INR",
              status: "captured"
            }
          }
        }
      },
      null,
      2
    ),
    responseBody: JSON.stringify({ status: "ok", processed: true }, null, 2),
    curlExample: `curl -X POST https://sapru.io/api/v1/billing/webhook/razorpay \\
  -H "Content-Type: application/json" \\
  -H "X-Razorpay-Signature: <HMAC_SHA256_HEX>" \\
  -d '{"event":"payment.captured"}'`
  },

  // --- TABLES & FLOORPLAN ---
  {
    id: "tables-list",
    category: "Tables & Floorplan",
    method: "GET",
    path: "/api/v1/tables",
    summary: "List Dining Tables & Occupancy",
    description: "Fetches all floorplan tables for active branch with real-time status and QR code tokens.",
    authRequired: true,
    headers: [
      { name: "Authorization", required: true, desc: "Bearer <token>" },
      { name: "X-Tenant-ID", required: true, desc: "UUID of tenant" },
      { name: "X-Branch-ID", required: true, desc: "UUID of branch" }
    ],
    responseBody: JSON.stringify(
      {
        success: true,
        data: [
          {
            id: "5da85f64-5717-4562-b3fc-2c963f66afb5",
            tableNumber: "T-01",
            section: "Main Dining",
            capacity: 4,
            status: "AVAILABLE",
            qrCodeToken: "QR_T01_9A8B7C"
          },
          {
            id: "6da85f64-5717-4562-b3fc-2c963f66afb6",
            tableNumber: "T-02",
            section: "Terrace",
            capacity: 2,
            status: "OCCUPIED",
            qrCodeToken: "QR_T02_1X2Y3Z"
          }
        ]
      },
      null,
      2
    ),
    curlExample: `curl -X GET https://sapru.io/api/v1/tables \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "X-Tenant-ID: <TENANT_ID>" \\
  -H "X-Branch-ID: <BRANCH_ID>"`
  },
  {
    id: "tables-status",
    category: "Tables & Floorplan",
    method: "PATCH",
    path: "/api/v1/tables/{id}/status",
    summary: "Update Table Status",
    description: "Updates occupancy status (AVAILABLE, OCCUPIED, RESERVED, DIRTY).",
    authRequired: true,
    requiredRole: "RESTAURANT_OWNER, BRANCH_MANAGER, CASHIER, WAITER",
    requestBody: JSON.stringify({ status: "AVAILABLE" }, null, 2),
    responseBody: JSON.stringify({ success: true, message: "Table status updated to AVAILABLE" }, null, 2),
    curlExample: `curl -X PATCH https://sapru.io/api/v1/tables/5da85f64-5717-4562-b3fc-2c963f66afb5/status \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"status":"AVAILABLE"}'`
  },

  // --- ORDERS & KDS ---
  {
    id: "orders-create",
    category: "Orders & Kitchen (KDS)",
    method: "POST",
    path: "/api/v1/orders",
    summary: "Create Order & Dispatch KOT",
    description: "Validates subscription operational status, locks table to OCCUPIED, reserves stock, creates kitchen order ticket, and broadcasts STOMP WebSocket notification.",
    authRequired: true,
    headers: [
      { name: "Authorization", required: true, desc: "Bearer <token>" },
      { name: "X-Tenant-ID", required: true, desc: "UUID of tenant" },
      { name: "X-Branch-ID", required: true, desc: "UUID of branch" }
    ],
    requestBody: JSON.stringify(
      {
        orderType: "DINE_IN",
        tableId: "5da85f64-5717-4562-b3fc-2c963f66afb5",
        customerName: "Rahul Sharma",
        notes: "No onions in butter masala",
        items: [
          {
            menuItemId: "8fa85f64-5717-4562-b3fc-2c963f66afb8",
            quantity: 2,
            notes: "Medium spicy"
          },
          {
            menuItemId: "9fa85f64-5717-4562-b3fc-2c963f66afb9",
            quantity: 4
          }
        ]
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          id: "7ea85f64-5717-4562-b3fc-2c963f66afb7",
          orderNumber: "ORD-2026-1049",
          status: "PLACED",
          subtotal: 680.00,
          taxAmount: 34.00,
          grandTotal: 714.00,
          kotId: "kot_554433",
          tableNumber: "T-01"
        },
        message: "Order placed and sent to kitchen"
      },
      null,
      2
    ),
    curlExample: `curl -X POST https://sapru.io/api/v1/orders \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "X-Tenant-ID: <TENANT_ID>" \\
  -H "X-Branch-ID: <BRANCH_ID>" \\
  -H "Content-Type: application/json" \\
  -d '{"orderType":"DINE_IN","tableId":"<TABLE_ID>","items":[{"menuItemId":"<ITEM_ID>","quantity":2}]}'`
  },
  {
    id: "kds-tickets",
    category: "Orders & Kitchen (KDS)",
    method: "GET",
    path: "/api/v1/kitchen/tickets",
    summary: "Get Real-Time Kitchen Tickets (KDS)",
    description: "Retrieves active kitchen tickets filtered by PENDING, IN_PROGRESS, READY for the KDS Kanban board.",
    authRequired: true,
    requiredRole: "CHEF, RESTAURANT_OWNER, BRANCH_MANAGER",
    responseBody: JSON.stringify(
      {
        success: true,
        data: [
          {
            id: "kot_554433",
            kotNumber: "KOT-1049",
            tableNumber: "T-01",
            status: "IN_PROGRESS",
            elapsedMinutes: 4,
            items: [
              { name: "Paneer Butter Masala", quantity: 2, notes: "Medium spicy" },
              { name: "Butter Naan", quantity: 4 }
            ]
          }
        ]
      },
      null,
      2
    ),
    curlExample: `curl -X GET https://sapru.io/api/v1/kitchen/tickets \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "X-Tenant-ID: <TENANT_ID>"`
  },
  {
    id: "kds-status",
    category: "Orders & Kitchen (KDS)",
    method: "PATCH",
    path: "/api/v1/kitchen/tickets/{id}/status",
    summary: "Transition KOT Status",
    description: "Moves ticket through PENDING ➔ IN_PROGRESS ➔ READY ➔ COMPLETED. Emits WebSocket event and plays dual-tone procedural audio chime on devices.",
    authRequired: true,
    requiredRole: "CHEF, RESTAURANT_OWNER",
    requestBody: JSON.stringify({ status: "READY" }, null, 2),
    responseBody: JSON.stringify({ success: true, message: "KOT marked as READY" }, null, 2),
    curlExample: `curl -X PATCH https://sapru.io/api/v1/kitchen/tickets/kot_554433/status \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"status":"READY"}'`
  },

  // --- CONTACTLESS QR ORDERING ---
  {
    id: "qr-menu",
    category: "Contactless QR Ordering",
    method: "GET",
    path: "/api/v1/qr/menu/{tableId}",
    summary: "Public Guest Table Menu",
    description: "Public endpoint loaded when a guest scans a table QR code. Returns restaurant info, table identifier, and categorized available menu.",
    authRequired: false,
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          restaurantName: "The Royal Bistro",
          tableNumber: "T-01",
          section: "Main Dining",
          categories: [
            {
              id: "cat_1",
              name: "Main Course",
              items: [
                {
                  id: "item_1",
                  name: "Dal Makhani",
                  price: 280.00,
                  isVeg: true,
                  isAvailable: true
                }
              ]
            }
          ]
        }
      },
      null,
      2
    ),
    curlExample: `curl -X GET https://sapru.io/api/v1/qr/menu/5da85f64-5717-4562-b3fc-2c963f66afb5`
  },
  {
    id: "qr-order",
    category: "Contactless QR Ordering",
    method: "POST",
    path: "/api/v1/qr/orders",
    summary: "Guest Self-Order Dispatch",
    description: "Public endpoint allowing dining guests to submit orders from their smartphones directly to the kitchen.",
    authRequired: false,
    requestBody: JSON.stringify(
      {
        tableId: "5da85f64-5717-4562-b3fc-2c963f66afb5",
        guestName: "Arjun Verma",
        items: [
          { menuItemId: "item_1", quantity: 2, notes: "Low spice" }
        ]
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          orderId: "ord_998877",
          status: "PLACED",
          message: "Your order has been received by the kitchen!"
        }
      },
      null,
      2
    ),
    curlExample: `curl -X POST https://sapru.io/api/v1/qr/orders \\
  -H "Content-Type: application/json" \\
  -d '{"tableId":"5da85f64-5717-4562-b3fc-2c963f66afb5","guestName":"Arjun Verma","items":[{"menuItemId":"item_1","quantity":2}]}'`
  },

  // --- PAYMENTS ---
  {
    id: "payments-settle",
    category: "Payments & Settlements",
    method: "POST",
    path: "/api/v1/payments/settle",
    summary: "Settle Bill & Release Table",
    description: "Settles bill via CASH, CARD, or UPI, marks order PAID, creates invoice record, and transitions dining table back to AVAILABLE.",
    authRequired: true,
    requiredRole: "CASHIER, RESTAURANT_OWNER, BRANCH_MANAGER",
    requestBody: JSON.stringify(
      {
        orderId: "7ea85f64-5717-4562-b3fc-2c963f66afb7",
        amount: 714.00,
        paymentMethod: "UPI",
        transactionReference: "UPI9823412349"
      },
      null,
      2
    ),
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          paymentId: "pay_112233",
          status: "PAID",
          invoiceNumber: "INV-2026-1049",
          tableReleased: true
        },
        message: "Payment recorded and table marked available"
      },
      null,
      2
    ),
    curlExample: `curl -X POST https://sapru.io/api/v1/payments/settle \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "X-Tenant-ID: <TENANT_ID>" \\
  -H "Content-Type: application/json" \\
  -d '{"orderId":"<ORDER_ID>","amount":714.00,"paymentMethod":"UPI","transactionReference":"UPI9823412349"}'`
  },

  // --- HEALTH & TELEMETRY ---
  {
    id: "health-check",
    category: "System Health & Probes",
    method: "GET",
    path: "/api/v1/health",
    summary: "System Liveness & Context Health",
    description: "Public health check probing PostgreSQL database connection, JVM memory, and active tenant context.",
    authRequired: false,
    responseBody: JSON.stringify(
      {
        success: true,
        data: {
          status: "UP",
          service: "restaurant-saas-platform",
          database: "CONNECTED",
          version: "1.2.0",
          timestamp: "2026-11-15T14:30:00Z"
        },
        message: "System is healthy"
      },
      null,
      2
    ),
    curlExample: `curl -X GET https://sapru.io/api/v1/health`
  }
];

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"api" | "architecture" | "websocket" | "deployment">("api");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(ENDPOINTS.map((e) => e.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredEndpoints = useMemo(() => {
    return ENDPOINTS.filter((ep) => {
      const matchesCategory = selectedCategory === "All" || ep.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.method.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadgeClass = (method: HttpMethod) => {
    switch (method) {
      case "GET":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "POST":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "PUT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "PATCH":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="min-w-0 bg-[#FAFAF8] dark:bg-[#080808] text-neutral-900 dark:text-neutral-100 min-h-screen selection:bg-[#FF6A3D] selection:text-white">
      {/* Floating Header */}
      <FloatingNavbar
        links={[
          { label: "Home", href: "/" },
          { label: "Capabilities", href: "/#capabilities" },
          { label: "Pricing", href: "/pricing" },
          { label: "Docs", href: "/docs" },
          { label: "Support", href: "/support" },
          { label: "Dashboard", href: "/dashboard" },
        ]}
        email="support@sapru.io"
        activePath="/docs"
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-[#0c0c0c]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/20 mb-3">
                <SapruIcon size={14} />
                <span>Sapru Platform API v1.2.0</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif text-neutral-900 dark:text-white">
                Developer Documentation & API Hub
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-2xl text-sm sm:text-base">
                Interactive API reference, multi-tenant authentication protocols, WebSocket telemetry streams, and production deployment standards.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/api/v1/swagger-ui.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#0F3D2E] text-white hover:bg-[#165742] transition shadow-sm"
              >
                <span>Interactive Swagger UI</span>
                <ExternalLink size={14} />
              </a>
              <a
                href="/api/v1/v3/api-docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <FileCode size={14} />
                <span>OpenAPI JSON</span>
              </a>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 text-sm">
            <button
              onClick={() => setActiveTab("api")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "api"
                  ? "bg-[#0F3D2E] text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Code2 size={16} />
              <span>REST API Reference</span>
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "architecture"
                  ? "bg-[#0F3D2E] text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Layers size={16} />
              <span>Multi-Tenancy & Headers</span>
            </button>
            <button
              onClick={() => setActiveTab("websocket")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "websocket"
                  ? "bg-[#0F3D2E] text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Radio size={16} />
              <span>WebSocket & STOMP</span>
            </button>
            <button
              onClick={() => setActiveTab("deployment")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === "deployment"
                  ? "bg-[#0F3D2E] text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Server size={16} />
              <span>Deployment & Ops</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Documentation Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* --- TAB 1: REST API EXPLORER --- */}
        {activeTab === "api" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 text-neutral-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                />
              </div>

              {/* Categories */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 px-2">
                  API Modules
                </h3>
                <nav className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition ${
                        selectedCategory === cat
                          ? "bg-[#0F3D2E] text-white"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] opacity-70">
                        {cat === "All"
                          ? ENDPOINTS.length
                          : ENDPOINTS.filter((e) => e.category === cat).length}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Info Box */}
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  <Shield size={14} />
                  <span>Envelope Guarantee</span>
                </div>
                All responses adhere to the unified <code className="text-emerald-700 dark:text-emerald-300">ApiResponse&lt;T&gt;</code> envelope with standard HTTP status mappings.
              </div>
            </div>

            {/* Endpoints Feed */}
            <div className="lg:col-span-3 space-y-6">
              {filteredEndpoints.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800">
                  <Search size={32} className="mx-auto text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-500 font-medium">No endpoints matched your search criteria.</p>
                </div>
              ) : (
                filteredEndpoints.map((ep) => (
                  <div
                    key={ep.id}
                    className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition"
                  >
                    {/* Header */}
                    <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-950/50">
                      <div className="flex items-center gap-3 font-mono text-sm">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getMethodBadgeClass(
                            ep.method
                          )}`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {ep.path}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ep.authRequired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Key size={10} />
                            <span>JWT Required</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span>Public</span>
                          </span>
                        )}
                        {ep.requiredRole && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <Shield size={10} />
                            <span>{ep.requiredRole.split(",")[0]}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary & Description */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h4 className="font-bold text-base text-neutral-900 dark:text-white mb-1">
                          {ep.summary}
                        </h4>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                          {ep.description}
                        </p>
                      </div>

                      {/* Required Headers if any */}
                      {ep.headers && ep.headers.length > 0 && (
                        <div className="pt-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                            Required Request Headers
                          </span>
                          <div className="mt-2 space-y-1.5">
                            {ep.headers.map((h) => (
                              <div
                                key={h.name}
                                className="flex items-center gap-3 text-xs bg-neutral-100/60 dark:bg-neutral-800/60 px-3 py-1.5 rounded-lg"
                              >
                                <code className="font-mono text-[#0F3D2E] dark:text-emerald-400 font-semibold">
                                  {h.name}
                                </code>
                                <span className="text-neutral-500">— {h.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Code Carousel (curl / request / response) */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                            Payload & Example
                          </span>
                          <button
                            onClick={() => copyToClipboard(ep.curlExample, ep.id)}
                            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-[#0F3D2E] transition"
                          >
                            {copiedId === ep.id ? (
                              <>
                                <Check size={12} className="text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy cURL</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ep.requestBody && (
                            <div>
                              <div className="text-[11px] font-semibold text-neutral-500 mb-1">
                                Request Body (JSON)
                              </div>
                              <pre className="p-3 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto max-h-48">
                                <code>{ep.requestBody}</code>
                              </pre>
                            </div>
                          )}

                          <div className={ep.requestBody ? "" : "md:col-span-2"}>
                            <div className="text-[11px] font-semibold text-neutral-500 mb-1">
                              Response Envelope (200 OK)
                            </div>
                            <pre className="p-3 rounded-xl bg-neutral-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-48">
                              <code>{ep.responseBody}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: MULTI-TENANCY & HEADERS --- */}
        {activeTab === "architecture" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F3D2E]/10 flex items-center justify-center text-[#0F3D2E]">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-neutral-900 dark:text-white">
                    ThreadLocal Multi-Tenant Isolation
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500">
                    How requests are securely routed and scoped across restaurant databases.
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The Sapru backend enforces row-level database tenancy via a high-precedence Spring filter (<code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">TenantFilter</code>). Every request automatically binds the tenant context to a Java <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">ThreadLocal&lt;TenantContext&gt;</code> that is wiped upon request termination in a <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">finally</code> block.
              </p>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                <div className="bg-neutral-50 dark:bg-neutral-950 p-4 font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                  Global Request Headers
                </div>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs sm:text-sm">
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="font-mono font-bold text-[#0F3D2E] dark:text-emerald-400">
                      Authorization
                    </span>
                    <span className="text-neutral-500">Bearer &lt;JWT&gt;</span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Standard Bearer token generated by <code className="text-xs">/auth/login</code>.
                    </span>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="font-mono font-bold text-[#0F3D2E] dark:text-emerald-400">
                      X-Tenant-ID
                    </span>
                    <span className="text-neutral-500">UUID</span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Required for all tenant data mutations and operational queries.
                    </span>
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="font-mono font-bold text-[#0F3D2E] dark:text-emerald-400">
                      X-Branch-ID
                    </span>
                    <span className="text-neutral-500">UUID (Optional)</span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Scopes requests to specific physical restaurant outlets.
                    </span>
                  </div>
                </div>
              </div>

              {/* RBAC Table */}
              <div className="pt-4">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-3">
                  6-Tier Role-Based Access Control (RBAC)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { role: "PLATFORM_ADMIN", desc: "Superuser: full cross-tenant diagnostics & system configuration" },
                    { role: "RESTAURANT_OWNER", desc: "Tenant Owner: billing, menu, reports, and staff management" },
                    { role: "BRANCH_MANAGER", desc: "Branch Manager: daily operations, shifts, stock adjustments" },
                    { role: "CASHIER", desc: "POS Operator: table orders, billing settlement, and splits" },
                    { role: "CHEF", desc: "Kitchen Head: KDS screen, KOT ticket progression, 86 items" },
                    { role: "WAITER", desc: "Floor Captain: mobile table ordering, guest requests, KOT dispatch" },
                  ].map((r) => (
                    <div
                      key={r.role}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50"
                    >
                      <div className="font-mono font-bold text-xs text-[#0F3D2E] dark:text-emerald-400 mb-1">
                        {r.role}
                      </div>
                      <div className="text-xs text-neutral-500 leading-relaxed">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: WEBSOCKET & STOMP --- */}
        {activeTab === "websocket" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Radio size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-neutral-900 dark:text-white">
                    Real-Time WebSocket & STOMP Broker
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500">
                    Sub-second live synchronization for kitchen displays, order statuses, and bill settlements.
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The platform runs a STOMP message broker inside Spring Boot proxied through Nginx at <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">/api/v1/ws</code> (with SockJS fallback) and <code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">/api/v1/ws-direct</code>.
              </p>

              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-500">
                  Subscribable Destination Channels
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      topic: "/topic/tenant/{tenantId}/branch/{branchId}/orders",
                      desc: "Broadcasts ORDER_CREATED, ORDER_CANCELLED events to dashboard and cashiers"
                    },
                    {
                      topic: "/topic/tenant/{tenantId}/branch/{branchId}/kot",
                      desc: "Sends real-time ticket bumps and status changes to Kitchen Display screens"
                    },
                    {
                      topic: "/topic/tenant/{tenantId}/branch/{branchId}/payments",
                      desc: "Emits bill settlement confirmations and invoice updates"
                    },
                    {
                      topic: "/topic/tenant/{tenantId}/notifications",
                      desc: "Tenant-wide broadcast alerts, trial milestones, and operational notices"
                    }
                  ].map((ch) => (
                    <div
                      key={ch.topic}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="text-purple-600 dark:text-purple-400 font-bold">{ch.topic}</span>
                      <span className="text-neutral-500 font-sans text-xs">{ch.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* JS STOMP Client Code Sample */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-500 mb-2">
                  JavaScript / TypeScript Client Connection Example
                </h3>
                <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto">
                  <code>{`import { Client } from "@stomp/stompjs";

const stompClient = new Client({
  brokerURL: "ws://localhost/api/v1/ws-direct",
  connectHeaders: {
    Authorization: "Bearer " + token,
    "X-Tenant-ID": tenantId,
    "X-Branch-ID": branchId,
  },
  onConnect: () => {
    console.log("Connected to Sapru STOMP gateway!");
    stompClient.subscribe(
      \`/topic/tenant/\${tenantId}/branch/\${branchId}/kot\`,
      (message) => {
        const kotEvent = JSON.parse(message.body);
        console.log("New Kitchen Ticket Event:", kotEvent);
      }
    );
  },
});

stompClient.activate();`}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: DEPLOYMENT & OPS --- */}
        {activeTab === "deployment" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Server size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-neutral-900 dark:text-white">
                    Production Architecture & Deployment
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500">
                    Container orchestration, Nginx reverse proxying, and SSL configuration.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                <p>
                  The platform deploys with 4 isolated Docker containers: PostgreSQL 16 (internal), Spring Boot 3 (API), Next.js 16 (Standalone runner), and Nginx (Port 80/443 Gateway).
                </p>

                <h3 className="font-bold text-neutral-900 dark:text-white text-sm">
                  1-Click Deployment Command
                </h3>
                <pre className="p-3.5 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs">
                  <code>{`# Clone repo & deploy
git clone https://github.com/VinaySiddha/NewFolder.git sapru-platform
cd sapru-platform
cp .env.example .env
chmod +x deploy.sh
./deploy.sh`}</code>
                </pre>

                <h3 className="font-bold text-neutral-900 dark:text-white text-sm pt-2">
                  Database Backups & Restores
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs block mb-1">
                      Backup Database
                    </span>
                    <code className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 block overflow-x-auto">
                      docker compose exec -t postgres pg_dump -U postgres restaurant_saas_db &gt; backup.sql
                    </code>
                  </div>

                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs block mb-1">
                      Restore Database
                    </span>
                    <code className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 block overflow-x-auto">
                      cat backup.sql | docker compose exec -T postgres psql -U postgres -d restaurant_saas_db
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 font-mono">
            <SapruIcon size={16} />
            <span>Sapru Restaurant Platform © 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-neutral-900 dark:hover:text-white transition">
              Pricing
            </Link>
            <Link href="/support" className="hover:text-neutral-900 dark:hover:text-white transition">
              Support
            </Link>
            <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-white transition">
              Dashboard
            </Link>
            <a
              href="/api/v1/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="text-[#FF6A3D] font-semibold hover:underline"
            >
              Swagger UI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
