"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Minus, 
  Trash2, 
  Receipt, 
  CreditCard, 
  Send, 
  Search,
  CheckCircle,
  Utensils,
  ChevronDown,
  RefreshCw,
  QrCode,
  DollarSign,
  Printer,
  X,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { Category, MenuItem, DiningTable, Order } from "@/types";
import { useNotifications } from "@/context/NotificationContext";
import { MorphButton } from "@/components/spectrumui/morph-button";

interface CartItem {
  menuItem: MenuItem;
  qty: number;
  notes?: string;
}

export default function PosTerminalPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("Walk-in Guest");
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKEAWAY" | "DELIVERY">("DINE_IN");

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "CARD">("CASH");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<any | null>(null);

  const { playNotificationSound } = useNotifications();

  const loadCatalogAndTables = useCallback(async () => {
    try {
      setCatalogLoading(true);
      const [catRes, itemRes, tableRes] = await Promise.allSettled([
        apiClient.get("/menu/categories"),
        apiClient.get("/menu/items"),
        apiClient.get("/tables")
      ]);

      if (catRes.status === "fulfilled" && catRes.value.data?.data) {
        setCategories(catRes.value.data.data);
      } else {
        setCategories([]);
      }

      if (itemRes.status === "fulfilled" && itemRes.value.data?.data) {
        setMenuItems(itemRes.value.data.data);
      } else {
        setMenuItems([]);
      }

      if (tableRes.status === "fulfilled" && tableRes.value.data?.data) {
        const tbls = tableRes.value.data.data;
        setTables(tbls);
        if (tbls.length > 0 && !selectedTable) {
          setSelectedTable(tbls[0]);
        }
      } else {
        setTables([]);
      }
    } catch {
      setCategories([]);
      setMenuItems([]);
      setTables([]);
    } finally {
      setCatalogLoading(false);
    }
  }, [selectedTable]);

  useEffect(() => {
    loadCatalogAndTables();

    // Listen to real-time events to refresh table statuses
    const handleOrderEvents = () => {
      loadCatalogAndTables();
    };

    window.addEventListener("sapru:order-created", handleOrderEvents);
    window.addEventListener("sapru:order-ready", handleOrderEvents);
    window.addEventListener("sapru:payment-completed", handleOrderEvents);

    return () => {
      window.removeEventListener("sapru:order-created", handleOrderEvents);
      window.removeEventListener("sapru:order-ready", handleOrderEvents);
      window.removeEventListener("sapru:payment-completed", handleOrderEvents);
    };
  }, [loadCatalogAndTables]);

  const addToCart = (prod: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuItem.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.menuItem.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { menuItem: prod, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.menuItem.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.qty, 0);
  const totalTax = cart.reduce((acc, item) => {
    const itemSub = item.menuItem.price * item.qty;
    return acc + (itemSub * (item.menuItem.taxRate || 5)) / 100;
  }, 0);
  const grandTotal = subtotal + totalTax;

  // Send Order to Kitchen (KOT)
  const handleSendKot = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setOrderSuccessMsg(null);

    const payload = {
      orderType: orderType,
      tableId: orderType === "DINE_IN" ? selectedTable?.id : null,
      customerName: customerName || "Walk-in Guest",
      items: cart.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.qty,
        notes: i.notes || "",
      })),
    };

    try {
      const res = await apiClient.post("/orders", payload);
      const placedOrder = res.data?.data;
      setLastPlacedOrder(placedOrder);
      setOrderSuccessMsg(`✨ KOT Sent! Order #${placedOrder?.orderNumber || "NEW"} dispatched to Kitchen.`);
      setCart([]);
      loadCatalogAndTables();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Instant Settle Payment
  const handleSettlePayment = async () => {
    if (!lastPlacedOrder?.id && cart.length === 0) return;
    setPaymentProcessing(true);

    try {
      let targetOrder = lastPlacedOrder;

      // If cart has items but not submitted as KOT yet, create order first
      if (cart.length > 0) {
        const payload = {
          orderType: orderType,
          tableId: orderType === "DINE_IN" ? selectedTable?.id : null,
          customerName: customerName || "Walk-in Guest",
          items: cart.map((i) => ({
            menuItemId: i.menuItem.id,
            quantity: i.qty,
            notes: i.notes || "",
          })),
        };
        const orderRes = await apiClient.post("/orders", payload);
        targetOrder = orderRes.data?.data;
      }

      if (targetOrder?.id) {
        await apiClient.post("/payments/settle", {
          orderId: targetOrder.id,
          amount: targetOrder.grandTotal,
          paymentMethod: paymentMethod,
          transactionReference: `TXN-${Date.now().toString().slice(-6)}`
        });

        setOrderSuccessMsg(`💳 Payment of ${formatCurrency(targetOrder.grandTotal)} received! Order #${targetOrder.orderNumber} settled & Table released.`);
        setShowPaymentModal(false);
        setCart([]);
        setLastPlacedOrder(null);
        loadCatalogAndTables();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to process payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategoryId === "ALL" || item.categoryId === activeCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Menu & Catalog */}
      <div className="flex-1 flex flex-col border-r border-[#E5E7EB] dark:border-[#165742]/40 bg-[#FAFAF8] dark:bg-[#0A291F] overflow-hidden">
        {/* Table, Channel & Search Bar */}
        <div className="p-3 border-b border-[#E5E7EB] dark:border-[#165742]/40 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0A291F]">
          <div className="flex items-center gap-2">
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs font-bold bg-[#0F3D2E]/10 text-[#0F3D2E] dark:bg-[#165742] dark:text-[#FAFAF8] border border-[#0F3D2E]/20 dark:border-[#165742] rounded-lg focus:outline-none"
            >
              <option value="DINE_IN">🍽️ Dine-In</option>
              <option value="TAKEAWAY">🛍️ Takeaway</option>
              <option value="DELIVERY">🛵 Delivery</option>
            </select>

            {orderType === "DINE_IN" && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#6B7280]">Table:</span>
                <select
                  value={selectedTable?.id || ""}
                  onChange={(e) => {
                    const t = tables.find((tbl) => tbl.id === e.target.value);
                    if (t) setSelectedTable(t);
                  }}
                  className="px-2.5 py-1.5 text-xs font-bold bg-[#FAFAF8] dark:bg-[#165742] border border-[#E5E7EB] dark:border-[#165742] rounded-lg focus:ring-2 focus:ring-[#FF6A3D] text-[#0B0B0B] dark:text-white"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tableNumber} ({t.section || "Floor"} - {t.status})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs justify-end">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search food, drinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAFAF8] dark:bg-[#165742] rounded-lg border border-[#E5E7EB] dark:border-[#165742] focus:outline-none focus:ring-1 focus:ring-[#FF6A3D] text-[#0B0B0B] dark:text-[#FAFAF8]"
              />
            </div>

            <MorphButton
              size="sm"
              onClick={loadCatalogAndTables}
              className="bg-white dark:bg-[#165742] text-[#0F3D2E] dark:text-white border border-[#E5E7EB] dark:border-[#165742]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${catalogLoading ? "animate-spin" : ""}`} />
            </MorphButton>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-3 py-2 border-b border-[#E5E7EB] dark:border-[#165742]/40 flex gap-1.5 overflow-x-auto shrink-0 bg-white dark:bg-[#0A291F]">
          <button
            onClick={() => setActiveCategoryId("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeCategoryId === "ALL"
                ? "bg-[#FF6A3D] text-white shadow-xs font-bold"
                : "bg-[#FAFAF8] dark:bg-[#165742] text-[#0B0B0B]/70 dark:text-[#E5E7EB] hover:bg-[#E5E7EB]"
            }`}
          >
            All Items ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeCategoryId === cat.id
                  ? "bg-[#FF6A3D] text-white shadow-xs font-bold"
                  : "bg-[#FAFAF8] dark:bg-[#165742] text-[#0B0B0B]/70 dark:text-[#E5E7EB] hover:bg-[#E5E7EB]"
              }`}
            >
              {cat.name} ({menuItems.filter(i => i.categoryId === cat.id).length})
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[#6B7280] space-y-2">
              <Utensils className="w-10 h-10 mx-auto text-[#6B7280] opacity-40" />
              <p className="text-xs font-semibold">No menu items found</p>
              <p className="text-[11px] text-[#6B7280]">Go to Menu Management in Admin to create dishes.</p>
            </div>
          ) : (
            filteredItems.map((prod) => (
              <button
                key={prod.id}
                onClick={() => addToCart(prod)}
                disabled={!prod.isAvailable}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-28 group relative ${
                  prod.isAvailable
                    ? "bg-white dark:bg-[#165742]/50 border-[#E5E7EB] dark:border-[#165742] hover:border-[#FF6A3D] hover:shadow-md cursor-pointer"
                    : "bg-[#FAFAF8] dark:bg-[#0A291F] border-[#E5E7EB] dark:border-[#165742]/40 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-[#0B0B0B] dark:text-[#FAFAF8] line-clamp-2 leading-snug">
                    {prod.name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                      prod.isVeg ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                    title={prod.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                  />
                </div>

                {!prod.isAvailable && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 self-start">
                    86&apos;d (Out of stock)
                  </span>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-[#0F3D2E] dark:text-[#FF6A3D] font-mono">
                    {formatCurrency(prod.price)}
                  </span>
                  <span className="p-1 rounded-md bg-[#FF6A3D]/10 text-[#FF6A3D] group-hover:bg-[#FF6A3D] group-hover:text-white transition">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Order Cart & Billing Console */}
      <div className="w-96 flex flex-col bg-white dark:bg-[#0A291F] border-l border-[#E5E7EB] dark:border-[#165742]/40 overflow-hidden">
        {/* Table & Guest Details */}
        <div className="p-3.5 border-b border-[#E5E7EB] dark:border-[#165742]/40 flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0F3D2E]">
          <div>
            <span className="text-xs font-extrabold text-[#0F3D2E] dark:text-[#FAFAF8] block">
              {orderType === "DINE_IN" ? `Table ${selectedTable?.tableNumber || "T-01"} (${selectedTable?.section || "Floor"})` : orderType}
            </span>
            <input
              type="text"
              placeholder="Guest Name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="text-[11px] text-slate-500 bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder-slate-400"
            />
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>

        {orderSuccessMsg && (
          <div className="m-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{orderSuccessMsg}</span>
            </div>
            <button onClick={() => setOrderSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6 space-y-2">
              <Receipt className="w-10 h-10 text-slate-500 opacity-40 mb-1" />
              <span className="font-semibold text-slate-300">Cart is Empty</span>
              <p className="text-[11px] text-slate-500">Tap items on the left to add food &amp; drinks to the current table order.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.menuItem.id}
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {item.menuItem.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {formatCurrency(item.menuItem.price)} × {item.qty} ={" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrency(item.menuItem.price * item.qty)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQty(item.menuItem.id, -1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.menuItem.id, 1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Actions */}
        <div className="p-4 bg-white dark:bg-[#0A291F] border-t border-[#E5E7EB] dark:border-[#165742]/40 space-y-3 shrink-0">
          <div className="space-y-1.5 text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 font-mono">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#0B0B0B] dark:text-white">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold text-[#0B0B0B] dark:text-white">{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#0B0B0B] dark:text-white pt-2 border-t border-[#E5E7EB] dark:border-[#165742]/40">
              <span>Grand Total</span>
              <span className="text-[#FF6A3D] font-bold">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <MorphButton
              onAction={handleSendKot}
              disabled={cart.length === 0 || loading}
              loadingLabel="Sending KOT..."
              successLabel="KOT Sent!"
              className="bg-[#0F3D2E] hover:bg-[#165742] text-white font-bold text-xs shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send KOT</span>
            </MorphButton>
            <MorphButton
              onClick={() => setShowPaymentModal(true)}
              disabled={(cart.length === 0 && !lastPlacedOrder) || loading}
              className="bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-bold text-xs shadow-md shadow-[#FF6A3D]/25"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Settle Bill</span>
            </MorphButton>
          </div>
        </div>
      </div>

      {/* POS Quick Settlement Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0A291F] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] dark:border-[#165742] space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-[#E5E7EB] dark:border-[#165742]/40">
              <div>
                <h3 className="font-bold text-base text-[#0F3D2E] dark:text-[#FAFAF8]">
                  Collect Payment &amp; Settle Bill
                </h3>
                <p className="text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70">
                  {orderType === "DINE_IN" ? `Table ${selectedTable?.tableNumber}` : orderType} • {customerName}
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#0B0B0B] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-2xl bg-[#FAFAF8] dark:bg-[#165742]/40 border border-[#E5E7EB] dark:border-[#165742] font-mono text-xs space-y-2">
              <div className="flex justify-between text-[#6B7280] dark:text-[#E5E7EB]/70">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#0B0B0B] dark:text-white">{formatCurrency(subtotal > 0 ? subtotal : (lastPlacedOrder?.subtotal || 0))}</span>
              </div>
              <div className="flex justify-between text-[#6B7280] dark:text-[#E5E7EB]/70">
                <span>Taxes &amp; GST (5%):</span>
                <span className="font-semibold text-[#0B0B0B] dark:text-white">{formatCurrency(totalTax > 0 ? totalTax : (lastPlacedOrder?.taxAmount || 0))}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0F3D2E] dark:text-[#FAFAF8] pt-2 border-t border-[#E5E7EB] dark:border-[#165742]">
                <span>Payable Amount:</span>
                <span className="text-[#FF6A3D] font-bold">{formatCurrency(grandTotal > 0 ? grandTotal : (lastPlacedOrder?.grandTotal || 0))}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F3D2E] dark:text-[#FAFAF8]">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CASH", label: "💵 Cash", desc: "Counter Cash" },
                  { id: "UPI", label: "📱 UPI / QR", desc: "GPay/PhonePe" },
                  { id: "CARD", label: "💳 Card", desc: "POS Swipe" }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                      paymentMethod === m.id
                        ? "bg-[#FF6A3D] text-white border-[#FF6A3D] shadow-md font-bold"
                        : "bg-[#FAFAF8] dark:bg-[#165742]/40 border-[#E5E7EB] dark:border-[#165742] text-[#0B0B0B] dark:text-[#FAFAF8] hover:bg-[#E5E7EB]"
                    }`}
                  >
                    <span className="text-xs">{m.label}</span>
                    <span className={`text-[10px] mt-0.5 ${paymentMethod === m.id ? "text-white/90" : "text-[#6B7280] dark:text-[#E5E7EB]/60"}`}>
                      {m.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === "UPI" && (
              <div className="p-4 rounded-2xl bg-[#FF6A3D]/10 border border-[#FF6A3D]/20 text-center space-y-2">
                <QrCode className="w-16 h-16 mx-auto text-[#FF6A3D]" />
                <p className="text-xs font-bold text-[#0F3D2E] dark:text-white">
                  Scan to Pay ₹{(grandTotal > 0 ? grandTotal : (lastPlacedOrder?.grandTotal || 0)).toFixed(2)}
                </p>
                <p className="text-[10px] text-[#6B7280] font-mono">UPI ID: royalbistro@icici</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#165742] text-xs font-semibold text-[#6B7280] dark:text-[#E5E7EB] hover:bg-[#FAFAF8] dark:hover:bg-[#165742] transition"
              >
                Cancel
              </button>
              <MorphButton
                onAction={handleSettlePayment}
                disabled={paymentProcessing}
                loadingLabel="Settling..."
                successLabel="Settled!"
                className="flex-1 bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs font-bold shadow-lg shadow-[#FF6A3D]/25"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm &amp; Settle</span>
              </MorphButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
