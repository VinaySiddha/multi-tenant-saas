"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { UtensilsCrossed, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function QrMenuPage() {
  const params = useParams();
  const tableId = params?.tableId || "table-1";

  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const menu = [
    { id: "1", name: "Paneer Butter Masala", price: 340, isVeg: true, desc: "Cottage cheese cubes simmered in rich creamy tomato gravy" },
    { id: "2", name: "Butter Garlic Naan", price: 65, isVeg: true, desc: "Tandoor baked flatbread brushed with garlic and butter" },
    { id: "3", name: "Crispy Corn Pepper Salt", price: 260, isVeg: true, desc: "Golden sweet corn tossed with bell peppers and black pepper" },
    { id: "4", name: "Mango Lassi", price: 120, isVeg: true, desc: "Chilled sweetened yogurt blended with Alphonso mango pulp" },
  ];

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

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm">The Royal Bistro</h1>
            <p className="text-[11px] text-indigo-100 uppercase tracking-wide">
              Self-Order Menu • Table {String(tableId).replace("table-", "T-")}
            </p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {menu.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(item.price)}
                </span>

                {qty > 0 ? (
                  <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg p-1 border border-indigo-200 dark:border-indigo-800">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 text-indigo-600 dark:text-indigo-400"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-indigo-600 px-1">{qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 text-indigo-600 dark:text-indigo-400"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 max-w-md w-full px-4 left-1/2 -translate-x-1/2">
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800">
            <div>
              <span className="text-xs font-bold block">
                {totalItems} {totalItems === 1 ? "Item" : "Items"} • {formatCurrency(totalAmount)}
              </span>
              <span className="text-[10px] text-slate-400">Extra taxes calculated at checkout</span>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition">
              Place Order <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
