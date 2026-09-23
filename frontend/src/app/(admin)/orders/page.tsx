"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Calendar,
  Flame,
  Plus,
  QrCode,
  Check,
  Utensils
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { Order, DiningTable, MenuItem } from "@/types";
import { useNotifications } from "@/context/NotificationContext";
import { MorphButton } from "@/components/spectrumui/morph-button";

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Settlement Modal state
  const [settlingOrder, setSettlingOrder] = useState<Order | null>(null);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "CARD" | "NET_BANKING">("CASH");
  const [isSettling, setIsSettling] = useState(false);
  const [settleSuccessMsg, setSettleSuccessMsg] = useState<string | null>(null);

  const { playNotificationSound } = useNotifications();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/orders");
      if (res.data?.data) {
        setOrders(res.data.data);
      } else {
        setOrders([]);
      }
    } catch {
      // Clean zero mock data
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Listen to real-time events from WebSocket
    const handleOrderEvents = () => {
      fetchOrders();
    };

    window.addEventListener("sapru:order-created", handleOrderEvents);
    window.addEventListener("sapru:order-ready", handleOrderEvents);
    window.addEventListener("sapru:payment-completed", handleOrderEvents);
    window.addEventListener("sapru:kot-updated", handleOrderEvents);

    const interval = setInterval(fetchOrders, 10000);

    return () => {
      window.removeEventListener("sapru:order-created", handleOrderEvents);
      window.removeEventListener("sapru:order-ready", handleOrderEvents);
      window.removeEventListener("sapru:payment-completed", handleOrderEvents);
      window.removeEventListener("sapru:kot-updated", handleOrderEvents);
      clearInterval(interval);
    };
  }, [fetchOrders]);

  // Execute Payment Settlement
  const handleProcessPayment = async () => {
    if (!settlingOrder) return;
    setIsSettling(true);
    try {
      await apiClient.post("/payments/settle", {
        orderId: settlingOrder.id,
        amount: settlingOrder.grandTotal,
        paymentMethod: paymentMethod,
        transactionReference: `TXN-${Date.now().toString().slice(-6)}`
      });

      setSettleSuccessMsg(`Payment of ${formatCurrency(settlingOrder.grandTotal)} received! Order #${settlingOrder.orderNumber} is marked PAID and table is freed.`);
      setShowSettleModal(false);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to process payment");
    } finally {
      setIsSettling(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ord.tableName && ord.tableName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (ord.customerName && ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === "ALL") return matchesSearch;
    if (filterStatus === "UNPAID") return matchesSearch && ord.paymentStatus === "UNPAID";
    if (filterStatus === "READY") return matchesSearch && ord.status === "READY";
    return matchesSearch && ord.status === filterStatus;
  });

  const totalSales = orders.reduce((sum, o) => o.paymentStatus === "PAID" ? sum + o.grandTotal : sum, 0);
  const readyOrdersCount = orders.filter(o => o.status === "READY" && o.paymentStatus === "UNPAID").length;
  const activeOrdersCount = orders.filter(o => o.status === "IN_KITCHEN" || o.status === "PLACED" || o.status === "READY").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F3D2E] flex items-center gap-2">
            <Receipt className="w-7 h-7 text-[#FF6A3D]" />
            Orders &amp; Billing Settlement Hub
          </h1>
          <p className="text-xs text-[#0B0B0B]/70 mt-1">
            Real-time POS and QR orders, live kitchen states, bill settlements, and official Tax Invoice printing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MorphButton
            size="sm"
            onClick={fetchOrders}
            className="bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0B0B0B] hover:bg-[#FAFAF8] shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </MorphButton>
        </div>
      </div>

      {settleSuccessMsg && (
        <div className="p-4 bg-[#0F3D2E]/10 border border-[#0F3D2E]/30 rounded-2xl text-xs text-[#0F3D2E] flex items-start justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0F3D2E] shrink-0" />
            <span className="font-semibold">{settleSuccessMsg}</span>
          </div>
          <button onClick={() => setSettleSuccessMsg(null)} className="text-[#0F3D2E] hover:text-[#0B0B0B]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-semibold text-[#0B0B0B]/70">Total Orders Placed</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-[#0B0B0B]">{orders.length}</span>
            <span className="text-xs font-semibold text-[#0F3D2E]">All Channels</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-semibold text-[#0B0B0B]/70">Collected Gross Revenue</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-[#0F3D2E]">
              {formatCurrency(totalSales)}
            </span>
            <span className="text-xs font-semibold text-[#0F3D2E]">Paid Invoices</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-semibold text-[#0B0B0B]/70">Ready for Serving &amp; Billing</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className={`text-2xl font-black ${readyOrdersCount > 0 ? "text-[#FF6A3D] animate-pulse" : "text-[#0B0B0B]"}`}>
              {readyOrdersCount}
            </span>
            <span className="text-xs font-semibold text-[#FF6A3D]">From Kitchen</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-semibold text-[#0B0B0B]/70">Active Kitchen Orders</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-amber-600">
              {activeOrdersCount}
            </span>
            <span className="text-xs font-semibold text-amber-600">Live Prep Line</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0B0B0B]/40" />
          <input
            type="text"
            placeholder="Search order #, table, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: `All Orders (${orders.length})` },
            { id: "READY", label: `🔔 Ready for Serving (${orders.filter(o => o.status === "READY").length})` },
            { id: "IN_KITCHEN", label: `🔥 In Kitchen (${orders.filter(o => o.status === "IN_KITCHEN").length})` },
            { id: "PLACED", label: `Placed (${orders.filter(o => o.status === "PLACED").length})` },
            { id: "UNPAID", label: `Unpaid Bills (${orders.filter(o => o.paymentStatus === "UNPAID").length})` },
            { id: "COMPLETED", label: `Completed (${orders.filter(o => o.status === "COMPLETED").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === tab.id
                  ? "bg-[#FF6A3D] text-white shadow-xs font-bold"
                  : "bg-[#FAFAF8] border border-[#E5E7EB] text-[#0B0B0B]/70 hover:bg-[#E5E7EB]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#0B0B0B]/70 border-b border-[#E5E7EB] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Channel / Table</th>
                <th className="px-4 py-3.5">Items Summary</th>
                <th className="px-4 py-3.5">Total Amount</th>
                <th className="px-4 py-3.5">Order Status</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#0B0B0B]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#0B0B0B]/50">
                    <Receipt className="w-10 h-10 mx-auto text-[#0F3D2E] opacity-30 mb-2" />
                    <span className="font-semibold block text-[#0B0B0B]">No orders found</span>
                    <span className="text-[11px] text-[#0B0B0B]/60">Place an order from POS terminal or scan Table QR to start the live flow.</span>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isReady = order.status === "READY";
                  const isPaid = order.paymentStatus === "PAID";
                  const isCooking = order.status === "IN_KITCHEN";

                  return (
                    <tr
                      key={order.id}
                      className={`transition ${
                        isReady
                          ? "bg-[#FF6A3D]/5 hover:bg-[#FF6A3D]/10"
                          : "hover:bg-[#FAFAF8]"
                      }`}
                    >
                      <td className="px-5 py-4 font-mono font-bold text-[#0F3D2E]">
                        {order.orderNumber}
                        <div className="text-[10px] font-normal text-[#0B0B0B]/60">
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 font-bold text-[#0B0B0B]">
                          {order.orderType === "QR_ORDER" ? "📱 QR Mobile" : order.orderType === "TAKEAWAY" ? "🛍️ Takeaway" : "🍽️ Dine-In"}
                          {order.tableName && ` (${order.tableName})`}
                        </span>
                        {order.customerName && (
                          <div className="text-[10px] text-[#0B0B0B]/60">{order.customerName}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-[#0B0B0B]/80 max-w-xs truncate font-mono text-[11px]">
                        {order.items?.map(i => `${i.quantity}x ${i.menuItemName || (i as any).itemName}`).join(", ") || "No items"}
                      </td>
                      <td className="px-4 py-4 font-bold text-[#0F3D2E] font-mono">
                        {formatCurrency(order.grandTotal)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border ${
                          isReady
                            ? "bg-[#FF6A3D]/15 text-[#FF6A3D] border-[#FF6A3D]/30 animate-pulse"
                            : isCooking
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : order.status === "COMPLETED"
                            ? "bg-[#FAFAF8] text-[#0B0B0B]/70 border-[#E5E7EB]"
                            : "bg-[#0F3D2E]/10 text-[#0F3D2E] border-[#0F3D2E]/20"
                        }`}>
                          {isReady && <CheckCircle2 className="w-3 h-3" />}
                          {isCooking && <Flame className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          isPaid
                            ? "bg-[#0F3D2E]/10 text-[#0F3D2E] border-[#0F3D2E]/25"
                            : "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPaid && (
                            <MorphButton
                              size="sm"
                              onClick={() => {
                                setSettlingOrder(order);
                                setShowSettleModal(true);
                              }}
                              className="bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-[11px] shadow-md shadow-[#FF6A3D]/25"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Settle Bill</span>
                            </MorphButton>
                          )}
                          <MorphButton
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowInvoiceModal(true);
                            }}
                            className="bg-[#FAFAF8] hover:bg-[#E5E7EB] text-[#0B0B0B] font-semibold text-[11px] border border-[#E5E7EB]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Bill</span>
                          </MorphButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Settlement Modal */}
      {showSettleModal && settlingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-[#E5E7EB]">
              <div>
                <h3 className="font-bold text-base text-[#0F3D2E]">
                  Settle Bill &amp; Complete Order
                </h3>
                <p className="text-xs text-[#0B0B0B]/60">
                  {settlingOrder.orderNumber} • {settlingOrder.tableName ? `Table ${settlingOrder.tableName}` : settlingOrder.orderType}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSettleModal(false);
                  setSettlingOrder(null);
                }}
                className="p-1 rounded-lg text-[#0B0B0B]/40 hover:text-[#0B0B0B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Items Breakdown */}
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] font-mono text-xs space-y-2">
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {settlingOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#0B0B0B] text-[11px]">
                    <span className="truncate max-w-[200px]">
                      {item.quantity}x {item.menuItemName || (item as any).itemName}
                    </span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] space-y-1 text-[#0B0B0B]/70 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(settlingOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST &amp; Taxes:</span>
                  <span>{formatCurrency(settlingOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#0F3D2E] pt-1 border-t border-[#E5E7EB]">
                  <span>Total Payable:</span>
                  <span>{formatCurrency(settlingOrder.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0B0B0B]">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CASH", label: "💵 Cash", desc: "Counter" },
                  { id: "UPI", label: "📱 UPI / QR", desc: "Digital" },
                  { id: "CARD", label: "💳 Card", desc: "Terminal" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                      paymentMethod === m.id
                        ? "bg-[#FF6A3D] text-white border-[#FF6A3D] shadow-xs font-bold"
                        : "bg-[#FAFAF8] border-[#E5E7EB] text-[#0B0B0B] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    <span className="text-xs">{m.label}</span>
                    <span className={`text-[10px] mt-0.5 ${paymentMethod === m.id ? "text-white/90" : "text-[#0B0B0B]/60"}`}>
                      {m.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === "UPI" && (
              <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] text-center space-y-2">
                <QrCode className="w-16 h-16 mx-auto text-[#0F3D2E]" />
                <p className="text-xs font-bold text-[#0F3D2E]">
                  Scan to Pay ₹{settlingOrder.grandTotal.toFixed(2)}
                </p>
                <p className="text-[10px] text-[#0B0B0B]/60 font-mono">UPI: royalbistro@icici</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSettleModal(false);
                  setSettlingOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#0B0B0B]/70 hover:bg-[#FAFAF8] transition"
              >
                Cancel
              </button>
              <MorphButton
                onAction={handleProcessPayment}
                disabled={isSettling}
                loadingLabel="Settling..."
                successLabel="Settled!"
                className="flex-1 bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs font-bold shadow-md shadow-[#FF6A3D]/25"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Settle</span>
              </MorphButton>
            </div>
          </div>
        </div>
      )}

      {/* Bill / Tax Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#E5E7EB]">
              <span className="text-xs font-bold text-[#0F3D2E] uppercase tracking-wider">Restaurant Tax Invoice</span>
              <button
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedOrder(null);
                }}
                className="p-1 rounded-lg text-[#0B0B0B]/40 hover:text-[#0B0B0B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thermal Receipt Preview */}
            <div className="p-5 bg-[#FAFAF8] text-[#0B0B0B] rounded-2xl font-mono text-xs space-y-4 border border-[#E5E7EB] shadow-inner">
              <div className="text-center space-y-1">
                <h2 className="font-extrabold text-base tracking-tight text-[#0F3D2E]">THE ROYAL BISTRO</h2>
                <p className="text-[11px] text-[#0B0B0B]/70">100 Feet Road, Indiranagar, Bengaluru</p>
                <p className="text-[10px] text-[#0B0B0B]/60">GSTIN: 29AAAAA0000A1Z5 • FSSAI: 11223344556677</p>
              </div>

              <div className="border-t border-b border-dashed border-[#E5E7EB] py-2 flex justify-between text-[11px]">
                <div>
                  <p><span className="text-[#0B0B0B]/60">Invoice #:</span> {selectedOrder.orderNumber}</p>
                  <p><span className="text-[#0B0B0B]/60">Table / Channel:</span> {selectedOrder.tableName || selectedOrder.orderType}</p>
                </div>
                <div className="text-right">
                  <p>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                  <p>{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-[11px] text-[#0B0B0B] pb-1 border-b border-[#E5E7EB]">
                  <span>Item</span>
                  <span>Qty × Rate</span>
                  <span>Total</span>
                </div>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-[#0B0B0B]">
                    <span className="truncate max-w-[170px]">{item.menuItemName || (item as any).itemName}</span>
                    <span>{item.quantity} × {item.unitPrice}</span>
                    <span className="font-semibold">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Bill Totals */}
              <div className="border-t border-dashed border-[#E5E7EB] pt-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#0B0B0B]/70">Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#0B0B0B]/70">CGST (2.5%) + SGST (2.5%):</span>
                  <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-[#0F3D2E] border-t border-[#E5E7EB] pt-1.5">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.grandTotal)}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-[#0B0B0B]/60 border-t border-dashed border-[#E5E7EB]">
                <p>Thank you for dining with us!</p>
                <p className="font-bold text-[#0F3D2E] mt-0.5">
                  Payment Status: {selectedOrder.paymentStatus}
                </p>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex items-center gap-2">
              <MorphButton
                onClick={() => window.print()}
                className="flex-1 bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-xs shadow-md shadow-[#FF6A3D]/25"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </MorphButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
