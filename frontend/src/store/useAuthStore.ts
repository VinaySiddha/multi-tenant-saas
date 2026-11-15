import { create } from "zustand";
import { User, Tenant, Branch } from "@/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  tenant: Tenant | null;
  branch: Branch | null;
  branches: Branch[];
  isAuthenticated: boolean;

  setAuth: (
    token: string,
    refreshToken: string,
    user: User,
    tenant?: Tenant,
    branch?: Branch,
    branches?: Branch[]
  ) => void;
  setTenant: (tenant: Tenant | null) => void;
  setBranch: (branch: Branch | null) => void;
  setBranches: (branches: Branch[]) => void;
  switchBranch: (branch: Branch) => void;
  logout: () => void;
}

const safeParse = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null" || item.trim() === "") return null;
    return JSON.parse(item) as T;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  user: safeParse<User>("user"),
  tenant: safeParse<Tenant>("tenant"),
  branch: safeParse<Branch>("branch"),
  branches: safeParse<Branch[]>("branches") || [],
  isAuthenticated: typeof window !== "undefined" ? Boolean(localStorage.getItem("token")) : false,

  setAuth: (token, refreshToken, user, tenant, branch, branches) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        if (tenant) localStorage.setItem("tenant", JSON.stringify(tenant));
        if (branch) localStorage.setItem("branch", JSON.stringify(branch));
        if (branches) localStorage.setItem("branches", JSON.stringify(branches));
      } catch {
        // ignore storage errors
      }
    }
    set({
      token,
      refreshToken,
      user,
      tenant: tenant || null,
      branch: branch || null,
      branches: branches || (branch ? [branch] : []),
      isAuthenticated: true,
    });
  },

  setTenant: (tenant) => {
    if (typeof window !== "undefined") {
      try {
        if (tenant) {
          localStorage.setItem("tenant", JSON.stringify(tenant));
        } else {
          localStorage.removeItem("tenant");
        }
      } catch {
        // ignore
      }
    }
    set({ tenant });
  },

  setBranch: (branch) => {
    if (typeof window !== "undefined") {
      try {
        if (branch) {
          localStorage.setItem("branch", JSON.stringify(branch));
        } else {
          localStorage.removeItem("branch");
        }
      } catch {
        // ignore
      }
    }
    set({ branch });
  },

  setBranches: (branches) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("branches", JSON.stringify(branches));
      } catch {
        // ignore
      }
    }
    set({ branches });
  },

  switchBranch: (branch) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("branch", JSON.stringify(branch));
        window.dispatchEvent(new CustomEvent("sapru:branch-switched", { detail: branch }));
      } catch {
        // ignore
      }
    }
    set({ branch });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("tenant");
        localStorage.removeItem("branch");
        localStorage.removeItem("branches");
      } catch {
        // ignore
      }
    }
    set({
      token: null,
      refreshToken: null,
      user: null,
      tenant: null,
      branch: null,
      branches: [],
      isAuthenticated: false,
    });
  },
}));
