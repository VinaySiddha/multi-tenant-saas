"use client";

import React, { useState, useEffect } from "react";
import { 
  Receipt, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Printer, 
  X, 
  DollarSign, 
  ShoppingBag,
  CreditCard,
  Building2,
  Calendar
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types";

const DEMO_ORDERS: Order[] = [
  {
    id: "ord-101",
    tenantId: "demo",
    branchId: "b1",
    orderNumber: "ORD-9401",
    orderType: "DINE_IN",
    tableName: "T-01",
    status: "COMPLETED",
    paymentStatus: "PAID",
    subtotal: 825.0,
    taxAmount: 41.25,
    discountAmount: 0.0,
    grandTotal: 866.25,
    items: [
      { menuItemId: "m1", menuItemName: "Paneer Butter Masala", quantity: 1, unitPrice: 340, taxAmount: 17, totalPrice: 340, status: "SERVED" },
      { menuItemId: "m3", menuItemName: "Butter Garlic Naan", quantity: 3, unitPrice: 65, taxAmount: 9.75, totalPrice: 195, status: "SERVED" },
      { menuItemId: "m5", menuItemName: "Crispy Corn Pepper Salt", quantity: 1, unitPrice: 260, taxAmount: 13, totalPrice: 260, status: "SERVED" },
      { menuItemId: "m6", menuItemName: "Mango Lassi", quantity: 1, unitPrice: 120, taxAmount: 6, totalPrice: 120, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-102",
    tenantId: "demo",
    branchId: "b1",
    orderNumber: "ORD-9402",
    orderType: "QR_ORDER",
    tableName: "T-02",
    status: "IN_KITCHEN",
    paymentStatus: "PAID",
    subtotal: 800.0,
    taxAmount: 40.0,
    discountAmount: 0.0,
    grandTotal: 840.0,
    items: [
      { menuItemId: "m2", menuItemName: "Butter Chicken Masala", quantity: 1, unitPrice: 420, taxAmount: 21, totalPrice: 420, status: "PREPARING" },
      { menuItemId: "m4", menuItemName: "Chicken Dum Biryani", quantity: 1, unitPrice: 380, taxAmount: 19, totalPrice: 380, status: "PREPARING" },
    ],
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-103",
    tenantId: "demo",
    branchId: "b1",
    orderNumber: "ORD-9403",
    orderType: "TAKEAWAY",
    status: "PLACED",
    paymentStatus: "UNPAID",
    subtotal: 380.0,
    taxAmount: 19.0,
    discountAmount: 0.0,
    grandTotal: 399.0,
    items: [
      { menuItemId: "m4", menuItemName: "Chicken Dum Biryani", quantity: 1, unitPrice: 380, taxAmount: 19, totalPrice: 380, status: "PENDING" },
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
];

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/orders");
      if (res.data?.data && res.data.data.length > 0) {
        setOrders(res.data.data);
      }
    } catch {
      // Keep demo fallback
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ord.tableName && ord.tableName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "ALL" || ord.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalSales = orders.reduce((sum, o) => o.paymentStatus === "PAID" ? sum + o.grandTotal : sum, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-indigo-600" />
            Orders & Tax Invoices Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review all live POS and QR customer orders, itemized tax breakdowns, and generate customer bill receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Orders Placed</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{orders.length}</span>
            <span className="text-xs font-semibold text-indigo-600">All Channels</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Collected Gross Revenue</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalSales)}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Paid Invoices</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Active Kitchen Orders</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {orders.filter(o => o.status === "IN_KITCHEN" || o.status === "PLACED").length}
            </span>
            <span className="text-xs font-semibold text-amber-600">Live Prep</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Average Order Value (AOV)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(orders.length > 0 ? totalSales / orders.length : 0)}
            </span>
            <span className="text-xs font-semibold text-slate-500">Per Ticket</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order #, table (e.g. ORD-9401)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["ALL", "COMPLETED", "IN_KITCHEN", "PLACED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {status === "ALL" ? "All Orders" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Channel / Table</th>
                <th className="px-4 py-3.5">Items Summary</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {order.orderNumber}
                    <div className="text-[10px] font-normal text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      {order.orderType === "QR_ORDER" ? "📱 QR Mobile" : order.orderType === "TAKEAWAY" ? "🛍️ Takeaway" : "🍽️ Dine-In"}
                      {order.tableName && ` (${order.tableName})`}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 max-w-xs truncate">
                    {order.items?.map(i => `${i.quantity}x ${i.menuItemName}`).join(", ") || "No items"}
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(order.grandTotal)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowInvoiceModal(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold rounded-lg text-[11px] inline-flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill / Tax Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tax Invoice & Bill</span>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedOrder(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Preview */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl font-mono text-xs space-y-4 border border-slate-200 dark:border-slate-700">
              <div className="text-center space-y-1">
                <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">THE ROYAL BISTRO</h2>
                <p className="text-[11px] text-slate-500">100 Feet Road, Indiranagar, Bengaluru</p>
                <p className="text-[10px] text-slate-400">GSTIN: 29AAAAA0000A1Z5 • FSSAI: 11223344556677</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-600 py-2 flex justify-between text-[11px]">
                <div>
                  <p><span className="text-slate-500">Bill #:</span> {selectedOrder.orderNumber}</p>
                  <p><span className="text-slate-500">Table:</span> {selectedOrder.tableName || "Takeaway"}</p>
                </div>
                <div className="text-right">
                  <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[11px] text-slate-600 dark:text-slate-400 pb-1">
                  <span>Item</span>
                  <span>Qty × Rate</span>
                  <span>Total</span>
                </div>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-slate-800 dark:text-slate-200">
                    <span className="truncate max-w-[180px]">{item.menuItemName}</span>
                    <span>{item.quantity} × {item.unitPrice}</span>
                    <span className="font-semibold">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Bill Totals */}
              <div className="border-t border-dashed border-slate-300 dark:border-slate-600 pt-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">CGST (2.5%) + SGST (2.5%):</span>
                  <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-indigo-600 dark:text-indigo-400 border-t pt-1">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.grandTotal)}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400">
                <p>Thank you for dining with us!</p>
                <p>Payment Status: <strong className="text-emerald-600">{selectedOrder.paymentStatus}</strong></p>
              </div>
            </div>

            {/* Print Action */}
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Printer className="w-4 h-4" /> Print Thermal Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
