"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  UtensilsCrossed, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search,
  User,
  Phone,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { MenuItem, Category, DiningTable } from "@/types";
import { MorphButton } from "@/components/spectrumui/morph-button";

export default function QrMenuPage() {
  const params = useParams();
  const tableId = params?.tableId as string;

  const [table, setTable] = useState<DiningTable | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (tableId) {
      fetchMenuData();
    }
  }, [tableId]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/qr/menu/${tableId}`);
      if (res.data?.data) {
        const data = res.data.data;
        setTable(data.table);
        setCategories(data.categories || []);
        setMenuItems(data.menuItems || []);
      }
    } catch {
      // Clean zero mock data
      setTable(null);
      setCategories([]);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: updated };
    });
  };

  const totalItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const estimatedTax = subtotal * 0.05;
  const grandTotal = subtotal + estimatedTax;

  const handlePlaceOrder = async () => {
    if (totalItemsCount === 0 || !tableId) return;
    setIsSubmitting(true);

    const items = Object.entries(cart).map(([itemId, qty]) => ({
      menuItemId: itemId,
      quantity: qty,
      notes: notes[itemId] || "",
    }));

    try {
      const payload = {
        tableId: tableId,
        customerName: customerName || "Table Guest",
        customerPhone: customerPhone || "",
        notes: orderNotes || "",
        items: items,
      };

      const res = await apiClient.post("/qr/orders", payload);
      setPlacedOrder(res.data?.data);
      setCart({});
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit table order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 min-h-screen bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Loading digital dining menu...</p>
      </div>
    );
  }

  // Order Success Screen
  if (placedOrder) {
    return (
      <div className="flex-1 min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
        <div className="max-w-md mx-auto w-full space-y-6 pt-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Kitchen Order Confirmed
            </span>
            <h1 className="text-2xl font-black text-white">
              Order #{placedOrder.orderNumber}
            </h1>
            <p className="text-xs text-slate-400">
              Your order is placed for <strong className="text-white">Table {table?.tableNumber || "Your Table"}</strong>. The kitchen team has started preparation!
            </p>
          </div>

          {/* Prep Status Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Status</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                In Kitchen Prep
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" /> Estimated Time:
              </span>
              <span className="font-bold text-white">~15 Minutes</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Total Payable at Checkout:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                {formatCurrency(placedOrder.grandTotal)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
            💡 When you are done enjoying your meal, request the bill from the captain or pay at the cashier counter.
          </div>
        </div>

        <div className="max-w-md mx-auto w-full pt-6">
          <MorphButton
            onClick={() => setPlacedOrder(null)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            <span>Order More Dishes &amp; Drinks</span>
          </MorphButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">The Royal Bistro</h1>
            <p className="text-[11px] text-indigo-300 font-semibold">
              Contactless Table Ordering • Table {table?.tableNumber || "Direct"}
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === "ALL"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            All Dishes ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto pb-36">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <UtensilsCrossed className="w-10 h-10 mx-auto opacity-40 text-slate-600" />
            <p className="text-xs font-bold text-slate-300">No items available</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm flex flex-col gap-2 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.isVeg ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                        title={item.isVeg ? "Veg" : "Non-Veg"}
                      />
                      <h3 className="text-xs font-bold text-white">{item.name}</h3>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    {formatCurrency(item.price)}
                  </span>

                  {qty > 0 ? (
                    <div className="flex items-center gap-2 bg-indigo-950/60 rounded-xl p-1 border border-indigo-800">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1 text-indigo-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white px-1.5">{qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 text-indigo-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-indigo-950/40"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl z-40">
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-black text-sm text-white block font-mono">
                  {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"} • {formatCurrency(grandTotal)}
                </span>
                <span className="text-[10px] text-slate-400">Includes 5% GST</span>
              </div>
              <MorphButton
                onAction={handlePlaceOrder}
                disabled={isSubmitting || totalItemsCount === 0}
                loadingLabel="Sending to Kitchen..."
                successLabel="Order Sent!"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50"
              >
                <span>Submit to Kitchen</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </MorphButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
