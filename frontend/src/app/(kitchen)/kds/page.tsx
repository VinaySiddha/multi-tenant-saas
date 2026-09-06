"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, Flame, AlertCircle } from "lucide-react";

interface KdsItem {
  name: string;
  qty: number;
  notes?: string;
  status: "PENDING" | "PREPARING" | "READY";
}

interface KdsTicket {
  id: string;
  kotNumber: string;
  tableNumber: string;
  orderType: string;
  elapsedMinutes: number;
  status: "PENDING" | "IN_PROGRESS" | "READY";
  items: KdsItem[];
}

export default function KdsPage() {
  const [tickets, setTickets] = useState<KdsTicket[]>([
    {
      id: "kot-1",
      kotNumber: "KOT #104",
      tableNumber: "T-04",
      orderType: "Dine In",
      elapsedMinutes: 4,
      status: "IN_PROGRESS",
      items: [
        { name: "Paneer Butter Masala", qty: 2, notes: "Medium spicy", status: "PREPARING" },
        { name: "Butter Garlic Naan", qty: 4, status: "PREPARING" },
      ],
    },
    {
      id: "kot-2",
      kotNumber: "KOT #105",
      tableNumber: "T-08",
      orderType: "Dine In",
      elapsedMinutes: 11,
      status: "PENDING",
      items: [
        { name: "Chicken Biryani (Dum)", qty: 1, notes: "Extra raita", status: "PENDING" },
        { name: "Crispy Corn Pepper Salt", qty: 1, status: "PENDING" },
      ],
    },
    {
      id: "kot-3",
      kotNumber: "KOT #106",
      tableNumber: "TA-12",
      orderType: "Takeaway",
      elapsedMinutes: 1,
      status: "PENDING",
      items: [
        { name: "Mango Lassi", qty: 2, status: "PENDING" },
        { name: "Gulab Jamun with Rabri", qty: 1, status: "PENDING" },
      ],
    },
  ]);

  const markReady = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "READY" } : t))
    );
  };

  return (
    <div className="flex gap-6 h-full items-start">
      {tickets.map((ticket) => {
        const isLate = ticket.elapsedMinutes >= 10;
        const isReady = ticket.status === "READY";

        return (
          <div
            key={ticket.id}
            className={`w-80 rounded-2xl flex flex-col border shadow-xl transition-all ${
              isReady
                ? "bg-slate-900/60 border-emerald-500/40 opacity-70"
                : isLate
                ? "bg-slate-900 border-rose-500 ring-2 ring-rose-500/20"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            {/* Header */}
            <div
              className={`p-4 rounded-t-2xl border-b flex items-center justify-between ${
                isLate
                  ? "bg-rose-950/40 border-rose-900/50"
                  : "bg-slate-800/60 border-slate-800"
              }`}
            >
              <div>
                <span className="font-bold text-base text-white">{ticket.kotNumber}</span>
                <span className="text-xs text-slate-400 block">
                  Table {ticket.tableNumber} • {ticket.orderType}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                  isLate
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{ticket.elapsedMinutes}m</span>
              </div>
            </div>

            {/* Items List */}
            <div className="p-4 flex-1 space-y-3">
              {ticket.items.map((item, idx) => (
                <div key={idx} className="border-b border-slate-800/80 pb-2.5 last:border-0">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-semibold text-slate-200">
                      {item.qty} × {item.name}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-[11px] text-amber-400 mt-0.5 italic">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 rounded-b-2xl">
              {isReady ? (
                <div className="flex items-center justify-center gap-1.5 py-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Marked Ready (Notified Waiter)
                </div>
              ) : (
                <button
                  onClick={() => markReady(ticket.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark KOT Ready
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
