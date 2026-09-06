export type UserRole =
  | "PLATFORM_ADMIN"
  | "RESTAURANT_OWNER"
  | "BRANCH_MANAGER"
  | "CASHIER"
  | "WAITER"
  | "CHEF";

export interface User {
  id: string;
  tenantId?: string;
  branchId?: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  subscriptionPlan: "FREE_TRIAL" | "BASIC" | "PRO" | "ENTERPRISE";
  subscriptionStatus: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
  isActive: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
  fssaiNumber?: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface DiningTable {
  id: string;
  tenantId: string;
  branchId: string;
  tableNumber: string;
  section?: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "BILLING" | "CLEANING";
  qrCodeUrl?: string;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  branchId?: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  taxRate: number;
  isVeg: boolean;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface OrderItem {
  id?: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  totalPrice: number;
  notes?: string;
  status: "PENDING" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
}

export interface Order {
  id: string;
  tenantId: string;
  branchId: string;
  orderNumber: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY" | "QR_ORDER";
  tableId?: string;
  tableName?: string;
  status: "PLACED" | "CONFIRMED" | "IN_KITCHEN" | "READY" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED";
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface KitchenTicket {
  id: string;
  kotNumber: string;
  tenantId: string;
  branchId: string;
  orderId: string;
  tableNumber?: string;
  orderType: string;
  status: "PENDING" | "IN_PROGRESS" | "READY" | "SERVED" | "CANCELLED";
  items: OrderItem[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}
