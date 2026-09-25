import axios, { AxiosError } from "axios";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  ApiResponse,
  Branch,
  Category,
  DashboardSummary,
  DiningTable,
  KitchenTicketView,
  MenuItem,
  OrderView,
  PaymentDto,
  RestaurantInfo,
  TableStatus,
} from "@/types";

/** Unwrap the platform's ApiResponse envelope or throw a readable error. */
export function unwrap<T>(payload: ApiResponse<T> | T): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const envelope = payload as ApiResponse<T>;
    if (envelope.success === false) {
      throw new Error(envelope.message || "Request failed");
    }
    return envelope.data;
  }
  return payload as T;
}

export function apiErrorMessage(err: unknown, fallback = "Request failed"): string {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<ApiResponse<unknown>>;
    if (e.response?.status === 401) return "Your session has expired. Please log in again.";
    if (e.response?.status === 403) return "You do not have permission to perform this action.";
    if (e.response?.status === 429) return "Too many requests — please slow down and try again shortly.";
    const body = e.response?.data as ApiResponse<unknown> | undefined;
    if (body && typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
    if (!e.response) return "Cannot reach the server. Check your network connection.";
    return fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/* ------------------------------- Admin APIs ------------------------------- */

export const adminApi = {
  /* Restaurant / branches */
  getCurrentRestaurant: async (): Promise<RestaurantInfo> =>
    unwrap((await apiClient.get("/restaurants/current")).data),

  getBranches: async (): Promise<Branch[]> =>
    unwrap((await apiClient.get("/restaurants/branches")).data),

  createBranch: async (payload: {
    name: string;
    code: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    gstNumber?: string;
    fssaiNumber?: string;
  }): Promise<Branch> =>
    unwrap((await apiClient.post("/restaurants/branches", payload)).data),

  /* Tables */
  getTables: async (): Promise<DiningTable[]> =>
    unwrap((await apiClient.get("/tables")).data),

  createTable: async (payload: {
    tableNumber: string;
    section?: string;
    capacity: number;
  }): Promise<DiningTable> =>
    unwrap((await apiClient.post("/tables", payload)).data),

  updateTableStatus: async (
    id: string,
    status: TableStatus
  ): Promise<DiningTable> =>
    unwrap(
      (await apiClient.patch(`/tables/${id}/status`, null, { params: { status } }))
        .data
    ),

  /* Menu */
  getCategories: async (): Promise<Category[]> =>
    unwrap((await apiClient.get("/menu/categories")).data),

  createCategory: async (payload: {
    name: string;
    description?: string;
    displayOrder?: number;
  }): Promise<Category> =>
    unwrap((await apiClient.post("/menu/categories", payload)).data),

  getMenuItems: async (categoryId?: string): Promise<MenuItem[]> =>
    unwrap(
      (await apiClient.get("/menu/items", { params: categoryId ? { categoryId } : {} }))
        .data
    ),

  createMenuItem: async (payload: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    taxRate: number;
    isVeg: boolean;
    imageUrl?: string;
  }): Promise<MenuItem> =>
    unwrap((await apiClient.post("/menu/items", payload)).data),

  /* Orders */
  getOrders: async (): Promise<OrderView[]> =>
    unwrap((await apiClient.get("/orders")).data),

  getOrderById: async (id: string): Promise<OrderView> =>
    unwrap((await apiClient.get(`/orders/${id}`)).data),

  cancelOrder: async (id: string, reason?: string): Promise<OrderView> =>
    unwrap(
      (await apiClient.post(`/orders/${id}/cancel`, null, { params: { reason } }))
        .data
    ),

  /* Kitchen */
  getKitchenTickets: async (): Promise<KitchenTicketView[]> =>
    unwrap((await apiClient.get("/kitchen/tickets")).data),

  updateTicketStatus: async (
    id: string,
    status: string
  ): Promise<KitchenTicketView> =>
    unwrap(
      (await apiClient.patch(`/kitchen/tickets/${id}/status`, { status })).data
    ),

  /* Analytics */
  getDashboardSummary: async (): Promise<DashboardSummary> =>
    unwrap((await apiClient.get("/analytics/summary")).data),

  /* Payments */
  settlePayment: async (payload: {
    orderId: string;
    amount: number;
    paymentMethod: string;
    transactionReference?: string;
    paymentGateway?: string;
  }): Promise<PaymentDto> =>
    unwrap((await apiClient.post("/payments/settle", payload)).data),

  /* Current user */
  me: async () => {
    const res = await apiClient.get("/auth/me");
    return unwrap(res.data);
  },
};

/** Convenience: pull tenant/branch context for headers already handled by interceptor. */
export function authHeadersSnapshot() {
  const { token, tenant, branch } = useAuthStore.getState();
  return { token, tenantId: tenant?.id, branchId: branch?.id };
}
