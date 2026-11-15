import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 30000,
});

// Mutex flag for token refresh concurrency
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Multi-Tenant & Security Headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token, tenant, branch } = useAuthStore.getState();

    // Attach JWT Bearer Token
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    // Attach Multi-Tenant Scoping Headers
    if (tenant?.id) {
      config.headers.set("X-Tenant-ID", tenant.id);
    }

    if (branch?.id) {
      config.headers.set("X-Branch-ID", branch.id);
    }

    // Security & Telemetry Correlation
    config.headers.set("X-Request-Time", new Date().toISOString());

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: 401 Token Refresh & Error Handling
apiClient.interceptors.response.use(
  (response) => {
    // Capture any dynamic branch or tenant headers from response
    const updatedTenantId = response.headers["x-tenant-id"];
    const updatedBranchId = response.headers["x-branch-id"];
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const { refreshToken, logout, setAuth, user, tenant, branch, branches } = useAuthStore.getState();

      // If no refresh token, or if the failed request was the login/refresh endpoint itself
      if (!refreshToken || originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          logout();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          const newRefreshToken = refreshResponse.data.data.refreshToken || refreshToken;

          if (user) {
            setAuth(newAccessToken, newRefreshToken, user, tenant || undefined, branch || undefined, branches);
          }

          processQueue(null, newAccessToken);
          originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
          return apiClient(originalRequest);
        } else {
          throw new Error("Token refresh response invalid");
        }
      } catch (refreshErr) {
        processQueue(refreshErr as Error, null);
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          logout();
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
