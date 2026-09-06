"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, Flame, RefreshCw } from "lucide-react";
import apiClient from "@/lib/api-client";
import { KitchenTicket } from "@/types";

export default function KdsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultTickets = [
    {
      id: "kot-1",
      kotNumber: "KOT #104",
      tableNumber: "T-04",
      orderType: "DINE_IN",
      elapsedMinutes: 4,
      status: "IN_PROGRESS",
      itemsSummary: "2x Paneer Butter Masala (Medium spicy); 4x Butter Garlic Naan",
      specialInstructions: "Medium spicy",
    },
    {
      id: "kot-2",
      kotNumber: "KOT #105",
      tableNumber: "T-02",
      orderType: "DINE_IN",
      elapsedMinutes: 12,
      status: "PENDING",
      itemsSummary: "1x Chicken Dum Biryani; 1x Crispy Corn Pepper Salt",
      specialInstructions: "Extra raita",
    },
    {
      id: "kot-3",
      kotNumber: "KOT #106",
      tableNumber: "TA-01",
      orderType: "TAKEAWAY",
      elapsedMinutes: 2,
      status: "PENDING",
      itemsSummary: "2x Mango Lassi",
      specialInstructions: "",
    },
  ];

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 15000); // 15s poll backup for live WS
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await apiClient.get("/kitchen/tickets");
      if (res.data?.data && res.data.data.length > 0) {
        setTickets(res.data.data);
      } else {
        setTickets(defaultTickets);
      }
    } catch {
      setTickets(defaultTickets);
    }
  };

  const updateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/kitchen/tickets/${ticketId}/status`, { status: newStatus });
      fetchTickets();
    } catch {
      // Local state update for smooth demo
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-semibold">
          Active Prep Queue ({tickets.filter(t => t.status !== "SERVED").length} tickets)
        </span>
        <button
          onClick={fetchTickets}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 transition"
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 items-start">
        {tickets.map((ticket) => {
          const isLate = (ticket.elapsedMinutes || 0) >= 10;
          const isReady = ticket.status === "READY";
          const isProgress = ticket.status === "IN_PROGRESS";

          return (
            <div
              key={ticket.id}
              className={`w-80 flex-shrink-0 rounded-2xl flex flex-col border shadow-xl transition-all ${
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
                    : isProgress
                    ? "bg-amber-950/30 border-amber-900/40"
                    : "bg-slate-800/60 border-slate-800"
                }`}
              >
                <div>
                  <span className="font-bold text-base text-white">{ticket.kotNumber}</span>
                  <span className="text-xs text-slate-400 block">
                    Table {ticket.tableNumber || "Direct"} • {ticket.orderType}
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
                  <span>{ticket.elapsedMinutes || 0}m</span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 flex-1 space-y-3">
                <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {ticket.itemsSummary || "Standard preparation order"}
                </div>
                {ticket.specialInstructions && (
                  <p className="text-[11px] text-amber-400 italic">
                    Note: {ticket.specialInstructions}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 rounded-b-2xl">
                {isReady ? (
                  <div className="flex items-center justify-center gap-1.5 py-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Ready (Notified Captain)
                  </div>
                ) : isProgress ? (
                  <button
                    onClick={() => updateStatus(ticket.id, "READY")}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark KOT Ready
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(ticket.id, "IN_PROGRESS")}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    Start Cooking
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
