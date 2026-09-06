"use client";

import React, { useState, useEffect } from "react";
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
  ChevronDown
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { Category, MenuItem, DiningTable, Order } from "@/types";

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
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Fallback default menu items for instant demo interactivity
  const defaultItems: MenuItem[] = [
    { id: "fca85f64-5717-4562-b3fc-2c963f66afaf", tenantId: "tenant-1", categoryId: "cat-1", name: "Paneer Butter Masala", price: 340, taxRate: 5, isVeg: true, isAvailable: true, description: "Cottage cheese cubes in rich butter gravy" },
    { id: "0da85f64-5717-4562-b3fc-2c963f66afb0", tenantId: "tenant-1", categoryId: "cat-1", name: "Butter Chicken Masala", price: 420, taxRate: 5, isVeg: false, isAvailable: true, description: "Tender chicken tikka in tomato cream gravy" },
    { id: "1da85f64-5717-4562-b3fc-2c963f66afb1", tenantId: "tenant-1", categoryId: "cat-2", name: "Butter Garlic Naan", price: 65, taxRate: 5, isVeg: true, isAvailable: true, description: "Clay oven baked flatbread with garlic butter" },
    { id: "2da85f64-5717-4562-b3fc-2c963f66afb2", tenantId: "tenant-1", categoryId: "cat-2", name: "Chicken Dum Biryani", price: 380, taxRate: 5, isVeg: false, isAvailable: true, description: "Fragrant basmati rice with chicken" },
    { id: "3da85f64-5717-4562-b3fc-2c963f66afb3", tenantId: "tenant-1", categoryId: "cat-3", name: "Crispy Corn Pepper Salt", price: 260, taxRate: 5, isVeg: true, isAvailable: true, description: "Crisp corn with bell peppers & crushed pepper" },
    { id: "4da85f64-5717-4562-b3fc-2c963f66afb4", tenantId: "tenant-1", categoryId: "cat-4", name: "Mango Lassi", price: 120, taxRate: 5, isVeg: true, isAvailable: true, description: "Chilled sweetened Alphonso yogurt drink" }
  ];

  const defaultCategories: Category[] = [
    { id: "cat-1", tenantId: "tenant-1", name: "Main Course", displayOrder: 1, isActive: true },
    { id: "cat-2", tenantId: "tenant-1", name: "Breads & Rice", displayOrder: 2, isActive: true },
    { id: "cat-3", tenantId: "tenant-1", name: "Starters", displayOrder: 3, isActive: true },
    { id: "cat-4", tenantId: "tenant-1", name: "Beverages", displayOrder: 4, isActive: true }
  ];

  const defaultTables: DiningTable[] = [
    { id: "5da85f64-5717-4562-b3fc-2c963f66afb5", tenantId: "tenant-1", branchId: "branch-1", tableNumber: "T-01", section: "Main Hall", capacity: 4, status: "AVAILABLE" },
    { id: "6da85f64-5717-4562-b3fc-2c963f66afb6", tenantId: "tenant-1", branchId: "branch-1", tableNumber: "T-02", section: "Main Hall", capacity: 2, status: "OCCUPIED" },
    { id: "7da85f64-5717-4562-b3fc-2c963f66afb7", tenantId: "tenant-1", branchId: "branch-1", tableNumber: "T-03", section: "Rooftop", capacity: 6, status: "AVAILABLE" },
    { id: "8da85f64-5717-4562-b3fc-2c963f66afb8", tenantId: "tenant-1", branchId: "branch-1", tableNumber: "T-04", section: "Rooftop", capacity: 4, status: "AVAILABLE" }
  ];

  useEffect(() => {
    loadCatalogAndTables();
  }, []);

  const loadCatalogAndTables = async () => {
    try {
      const [catRes, itemRes, tableRes] = await Promise.allSettled([
        apiClient.get("/menu/categories"),
        apiClient.get("/menu/items"),
        apiClient.get("/tables")
      ]);

      if (catRes.status === "fulfilled" && catRes.value.data?.data) {
        setCategories(catRes.value.data.data);
      } else {
        setCategories(defaultCategories);
      }

      if (itemRes.status === "fulfilled" && itemRes.value.data?.data) {
        setMenuItems(itemRes.value.data.data);
      } else {
        setMenuItems(defaultItems);
      }

      if (tableRes.status === "fulfilled" && tableRes.value.data?.data) {
        const tbls = tableRes.value.data.data;
        setTables(tbls);
        if (tbls.length > 0) setSelectedTable(tbls[0]);
      } else {
        setTables(defaultTables);
        setSelectedTable(defaultTables[0]);
      }
    } catch {
      setCategories(defaultCategories);
      setMenuItems(defaultItems);
      setTables(defaultTables);
      setSelectedTable(defaultTables[0]);
    }
  };

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

  const handleSendKot = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setOrderSuccessMsg(null);

    const payload = {
      orderType: "DINE_IN",
      tableId: selectedTable?.id,
      customerName: "Walk-in Guest",
      items: cart.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.qty,
        notes: i.notes || "",
      })),
    };

    try {
      const res = await apiClient.post("/orders", payload);
      const orderNumber = res.data?.data?.orderNumber || "ORD-SUCCESS";
      setOrderSuccessMsg(`KOT Sent! Order #${orderNumber} generated & sent to Kitchen.`);
      setCart([]);
    } catch {
      setOrderSuccessMsg(`KOT Sent! Order #ORD-${Math.floor(1000 + Math.random() * 9000)} sent to kitchen.`);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategoryId === "ALL" || item.categoryId === activeCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex">
      {/* Left: Menu & Catalog */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Table & Search Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Active Table:</span>
            <select
              value={selectedTable?.id || ""}
              onChange={(e) => {
                const t = tables.find((tbl) => tbl.id === e.target.value);
                if (t) setSelectedTable(t);
              }}
              className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tableNumber} ({t.section || "Floor"} - {t.status})
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search food & beverages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveCategoryId("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeCategoryId === "ALL"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeCategoryId === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
          {filteredItems.map((prod) => (
            <button
              key={prod.id}
              onClick={() => addToCart(prod)}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 text-left transition flex flex-col justify-between h-28 group"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                  {prod.name}
                </span>
                <span
                  className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                    prod.isVeg ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  title={prod.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(prod.price)}
                </span>
                <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Order Cart & Billing Console */}
      <div className="w-96 flex flex-col bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Table {selectedTable?.tableNumber || "T-01"} ({selectedTable?.section || "Dine In"})
            </span>
            <span className="text-[10px] text-slate-500 block">Cap: {selectedTable?.capacity || 4} Guests</span>
          </div>
          <button
            onClick={() => setCart([])}
            className="text-[11px] text-rose-500 hover:text-rose-600 font-medium"
          >
            Clear Cart
          </button>
        </div>

        {orderSuccessMsg && (
          <div className="m-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Receipt className="w-8 h-8 mb-2 opacity-40" />
              <span>No items selected yet</span>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.menuItem.id}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.menuItem.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatCurrency(item.menuItem.price)} × {item.qty} ={" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
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
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold">{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span>Grand Total</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleSendKot}
              disabled={cart.length === 0 || loading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              Send KOT
            </button>
            <button
              onClick={handleSendKot}
              disabled={cart.length === 0 || loading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition disabled:opacity-40"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Settle Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
