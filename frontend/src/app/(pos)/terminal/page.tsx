"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Minus, 
  Trash2, 
  Receipt, 
  CreditCard, 
  Send, 
  Search,
  CheckCircle,
  Utensils
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function PosTerminalPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([
    { id: "1", name: "Paneer Butter Masala", price: 340, qty: 2 },
    { id: "2", name: "Butter Garlic Naan", price: 65, qty: 4 },
  ]);

  const categories = ["All", "Main Course", "Breads", "Starters", "Beverages", "Desserts"];

  const sampleProducts = [
    { id: "1", name: "Paneer Butter Masala", category: "Main Course", price: 340, isVeg: true },
    { id: "2", name: "Butter Garlic Naan", category: "Breads", price: 65, isVeg: true },
    { id: "3", name: "Chicken Biryani (Dum)", category: "Main Course", price: 420, isVeg: false },
    { id: "4", name: "Crispy Corn Pepper Salt", category: "Starters", price: 260, isVeg: true },
    { id: "5", name: "Mango Lassi", category: "Beverages", price: 120, isVeg: true },
    { id: "6", name: "Gulab Jamun with Rabri", category: "Desserts", price: 160, isVeg: true },
  ];

  const addToCart = (prod: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  return (
    <div className="h-full flex">
      {/* Left: Product Catalog */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Category & Search Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
          {sampleProducts
            .filter((p) => activeCategory === "All" || p.category === activeCategory)
            .map((prod) => (
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
                    className={`w-2 h-2 rounded-full mt-1 ${
                      prod.isVeg ? "bg-emerald-500" : "bg-rose-500"
                    }`}
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

      {/* Right: Order Cart & Billing */}
      <div className="w-96 flex flex-col bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
        {/* Cart Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Table T-04 (Dine In)
            </span>
            <span className="text-[10px] text-slate-500 block">Order #ORD-8402</span>
          </div>
          <button
            onClick={() => setCart([])}
            className="text-[11px] text-rose-500 hover:text-rose-600 font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Receipt className="w-8 h-8 mb-2 opacity-40" />
              <span>Cart is empty</span>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatCurrency(item.price)} × {item.qty} ={" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Bill Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-semibold">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span>Grand Total</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition">
              <Send className="w-3.5 h-3.5" />
              Send KOT
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition">
              <CreditCard className="w-3.5 h-3.5" />
              Settle Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
