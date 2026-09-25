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

/* ------------------------- Additional API-aligned types ------------------------- */

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "BILLING" | "CLEANING";
export type KotStatus = "PENDING" | "IN_PROGRESS" | "READY" | "SERVED" | "CANCELLED";
export type PaymentMethodType = "CASH" | "CARD" | "UPI" | "WALLET" | "ONLINE";
export type SubscriptionPlan = "FREE_TRIAL" | "BASIC" | "PRO" | "ENTERPRISE";
export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  logoUrl?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndsAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  todayRevenue: number;
  todayOrdersCount: number;
  activeOrdersCount: number;
  occupiedTablesCount: number;
  totalTablesCount: number;
  tableOccupancyRate: number;
  avgPrepTimeMinutes: number;
  topSellingItems: Array<Record<string, unknown>>;
  recentOrders: Array<Record<string, unknown>>;
}

export interface KitchenTicketItemView {
  menuItemName?: string;
  itemName?: string;
  quantity?: number;
  status?: string;
}

export interface KitchenTicketView {
  id: string;
  tenantId: string;
  branchId: string;
  orderId: string;
  kotNumber: string;
  tableNumber?: string;
  orderType: string;
  status: KotStatus;
  itemsSummary?: string;
  specialInstructions?: string;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  elapsedMinutes: number;
}

export interface PaymentDto {
  id: string;
  tenantId: string;
  branchId: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  transactionReference?: string;
  paymentGateway?: string;
  paidAt?: string;
}

export interface OrderItemView {
  id?: string;
  menuItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  notes?: string;
  status: string;
}

export interface OrderView {
  id: string;
  tenantId: string;
  branchId: string;
  orderNumber: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY" | "QR_ORDER";
  tableId?: string;
  tableNumber?: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemView[];
}
