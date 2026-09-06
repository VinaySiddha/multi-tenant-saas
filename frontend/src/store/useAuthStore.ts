import { create } from "zustand";
import { User, Tenant, Branch } from "@/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  tenant: Tenant | null;
  branch: Branch | null;
  isAuthenticated: boolean;

  setAuth: (token: string, refreshToken: string, user: User, tenant?: Tenant, branch?: Branch) => void;
  setTenant: (tenant: Tenant | null) => void;
  setBranch: (branch: Branch | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  user: typeof window !== "undefined" && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  tenant: typeof window !== "undefined" && localStorage.getItem("tenant")
    ? JSON.parse(localStorage.getItem("tenant")!)
    : null,
  branch: typeof window !== "undefined" && localStorage.getItem("branch")
    ? JSON.parse(localStorage.getItem("branch")!)
    : null,
  isAuthenticated: typeof window !== "undefined" ? Boolean(localStorage.getItem("token")) : false,

  setAuth: (token, refreshToken, user, tenant, branch) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      if (tenant) localStorage.setItem("tenant", JSON.stringify(tenant));
      if (branch) localStorage.setItem("branch", JSON.stringify(branch));
    }
    set({
      token,
      refreshToken,
      user,
      tenant: tenant || null,
      branch: branch || null,
      isAuthenticated: true,
    });
  },

  setTenant: (tenant) => {
    if (typeof window !== "undefined") {
      if (tenant) {
        localStorage.setItem("tenant", JSON.stringify(tenant));
      } else {
        localStorage.removeItem("tenant");
      }
    }
    set({ tenant });
  },

  setBranch: (branch) => {
    if (typeof window !== "undefined") {
      if (branch) {
        localStorage.setItem("branch", JSON.stringify(branch));
      } else {
        localStorage.removeItem("branch");
      }
    }
    set({ branch });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tenant");
      localStorage.removeItem("branch");
    }
    set({
      token: null,
      refreshToken: null,
      user: null,
      tenant: null,
      branch: null,
      isAuthenticated: false,
    });
  },
}));
