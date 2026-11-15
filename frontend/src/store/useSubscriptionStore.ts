import { create } from "zustand";
import { apiClient } from "@/lib/api-client";

export interface PlanFeature {
  id: string;
  featureKey: string;
  featureName: string;
  isIncluded: boolean;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  maxOutlets: number;
  isPopular: boolean;
  isActive: boolean;
  features: PlanFeature[];
}

export type SubscriptionStatusType =
  | "TRIALING"
  | "ACTIVE"
  | "PAYMENT_PENDING"
  | "PAST_DUE"
  | "TRIAL_EXPIRED"
  | "CANCELED"
  | "SUSPENDED"
  | "EXPIRED";

export interface SubscriptionDetails {
  id: string;
  tenantId: string;
  planCode: string;
  planName: string;
  billingInterval: "MONTHLY" | "ANNUAL";
  status: SubscriptionStatusType;
  trialStartAt: string | null;
  trialEndAt: string | null;
  daysRemainingInTrial: number;
  trialMilestone: "DAY_0" | "DAY_3" | "DAY_7" | "DAY_12" | "DAY_14" | "ACTIVE" | "EXPIRED" | string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canPerformOperations: boolean;
  isTrialActive: boolean;
  provider: string | null;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  invoicePdfUrl: string | null;
  createdAt: string;
}

interface SubscriptionState {
  subscription: SubscriptionDetails | null;
  plans: Plan[];
  invoices: BillingInvoice[];
  loading: boolean;
  error: string | null;
  upgradeModalOpen: boolean;

  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  upgradePlan: (planCode: string, interval: "MONTHLY" | "ANNUAL", provider?: string) => Promise<boolean>;
  setUpgradeModalOpen: (open: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  plans: [],
  invoices: [],
  loading: false,
  error: null,
  upgradeModalOpen: false,

  fetchSubscription: async () => {
    try {
      set({ loading: true, error: null });
      const res = await apiClient.get<{ success: boolean; data: SubscriptionDetails }>("/billing/subscription");
      if (res.data?.data) {
        set({ subscription: res.data.data, loading: false });
      }
    } catch (err: any) {
      // If error or unauthenticated, maintain state gracefully
      set({ loading: false });
    }
  },

  fetchPlans: async () => {
    try {
      const res = await apiClient.get<{ success: boolean; data: Plan[] }>("/billing/plans");
      if (res.data?.data) {
        set({ plans: res.data.data });
      }
    } catch {
      // Fallback fallback plans if server is offline
      set({
        plans: [
          {
            id: "1",
            code: "starter",
            name: "Starter",
            description: "Essential POS and billing for single-outlet independent restaurants.",
            monthlyPrice: 999,
            annualPrice: 9990,
            currency: "INR",
            maxOutlets: 1,
            isPopular: false,
            isActive: true,
            features: [
              { id: "101", featureKey: "core_pos", featureName: "Core POS & Billing", isIncluded: true },
              { id: "102", featureKey: "menu_mgmt", featureName: "Menu & Categories", isIncluded: true },
              { id: "103", featureKey: "basic_reports", featureName: "Basic Sales Reports", isIncluded: true },
              { id: "104", featureKey: "one_outlet", featureName: "1 Restaurant Outlet", isIncluded: true },
              { id: "105", featureKey: "kds", featureName: "Kitchen Display System (KDS)", isIncluded: false },
              { id: "106", featureKey: "qr_ordering", featureName: "QR Ordering & Table Mgmt", isIncluded: false },
            ],
          },
          {
            id: "2",
            code: "growth",
            name: "Growth",
            description: "Full-featured operational suite including KDS, QR ordering, and advanced analytics.",
            monthlyPrice: 1999,
            annualPrice: 19990,
            currency: "INR",
            maxOutlets: 1,
            isPopular: true,
            isActive: true,
            features: [
              { id: "201", featureKey: "core_pos", featureName: "Core POS & Billing", isIncluded: true },
              { id: "202", featureKey: "menu_mgmt", featureName: "Menu & Categories", isIncluded: true },
              { id: "203", featureKey: "kds", featureName: "Kitchen Display System (KDS)", isIncluded: true },
              { id: "204", featureKey: "qr_ordering", featureName: "QR Ordering & Table Management", isIncluded: true },
              { id: "205", featureKey: "staff_roles", featureName: "Staff Roles & Permissions", isIncluded: true },
              { id: "206", featureKey: "advanced_reports", featureName: "Advanced Analytics & Exports", isIncluded: true },
              { id: "207", featureKey: "priority_support", featureName: "Priority Email & Chat Support", isIncluded: true },
            ],
          },
          {
            id: "3",
            code: "multi_outlet",
            name: "Multi-Outlet",
            description: "Enterprise multi-branch management with centralized menus, reporting, and administration.",
            monthlyPrice: 3999,
            annualPrice: 39990,
            currency: "INR",
            maxOutlets: 5,
            isPopular: false,
            isActive: true,
            features: [
              { id: "301", featureKey: "everything_growth", featureName: "Everything in Growth", isIncluded: true },
              { id: "302", featureKey: "multi_branch", featureName: "Multi-Branch Management", isIncluded: true },
              { id: "303", featureKey: "centralized_menu", featureName: "Centralized Menu & Global Pricing", isIncluded: true },
              { id: "304", featureKey: "branch_permissions", featureName: "Branch-Level Scoped Permissions", isIncluded: true },
              { id: "305", featureKey: "advanced_admin", featureName: "Advanced Administration & Audit Trail", isIncluded: true },
            ],
          },
        ],
      });
    }
  },

  fetchInvoices: async () => {
    try {
      const res = await apiClient.get<{ success: boolean; data: BillingInvoice[] }>("/billing/invoices");
      if (res.data?.data) {
        set({ invoices: res.data.data });
      }
    } catch {
      // ignore
    }
  },

  upgradePlan: async (planCode, interval, provider = "RAZORPAY") => {
    try {
      set({ loading: true, error: null });
      const res = await apiClient.post<{ success: boolean; data: SubscriptionDetails }>("/billing/upgrade", {
        planCode,
        billingInterval: interval,
        provider,
      });

      if (res.data?.data) {
        set({ subscription: res.data.data, loading: false, upgradeModalOpen: false });
        get().fetchInvoices();
        return true;
      }
      return false;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to upgrade subscription. Please try again.",
      });
      return false;
    }
  },

  setUpgradeModalOpen: (open: boolean) => set({ upgradeModalOpen: open }),
}));
