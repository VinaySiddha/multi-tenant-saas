"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  RefreshCw, 
  Utensils, 
  CheckCheck, 
  AlertCircle,
  Volume2,
  VolumeX,
  ChefHat,
  Sparkles
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { KitchenTicket } from "@/types";
import { useNotifications } from "@/context/NotificationContext";

export default function KdsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playNotificationSound } = useNotifications();

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/kitchen/tickets");
      if (res.data?.data) {
        setTickets(res.data.data);
      } else {
        setTickets([]);
      }
    } catch {
      // Clean error state - zero mock fallback
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();

    // Listen to real-time events dispatched from WebSocket NotificationContext
    const handleOrderCreated = () => {
      fetchTickets();
      if (soundEnabled) playNotificationSound();
    };

    const handleKotUpdated = () => {
      fetchTickets();
    };

    window.addEventListener("sapru:order-created", handleOrderCreated);
    window.addEventListener("sapru:kot-updated", handleKotUpdated);

    // 10-second polling fallback
    const interval = setInterval(fetchTickets, 10000);

    return () => {
      window.removeEventListener("sapru:order-created", handleOrderCreated);
      window.removeEventListener("sapru:kot-updated", handleKotUpdated);
      clearInterval(interval);
    };
  }, [fetchTickets, playNotificationSound, soundEnabled]);

  const updateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/kitchen/tickets/${ticketId}/status`, { status: newStatus });
      fetchTickets();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update kitchen ticket status");
    }
  };

  const activeTickets = tickets.filter(t => t.status !== "SERVED" && t.status !== "CANCELLED");

  return (
    <div className="space-y-4">
      {/* Header Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Live Kitchen Expediter Line
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {activeTickets.length} active tickets
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Real-time orders received from POS terminals and guest QR mobile scans
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
              soundEnabled
                ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                : "bg-rose-950/40 text-rose-400 border-rose-900"
            }`}
            title="Toggle audio alerts"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            <span>{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>

          <button
            onClick={fetchTickets}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold rounded-xl text-slate-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Tickets Row */}
      {activeTickets.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 shadow-inner">
            <CheckCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Kitchen Queue is Clear</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              All tickets are prepared and served. New customer orders from POS or QR menu will appear here automatically with audio alerts.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-6 items-start">
          {activeTickets.map((ticket) => {
            const isLate = (ticket.elapsedMinutes || 0) >= 15;
            const isReady = ticket.status === "READY";
            const isProgress = ticket.status === "IN_PROGRESS";
            const isPending = ticket.status === "PENDING";

            return (
              <div
                key={ticket.id}
                className={`w-80 flex-shrink-0 rounded-2xl flex flex-col border shadow-xl transition-all duration-200 ${
                  isReady
                    ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-950/40"
                    : isLate
                    ? "bg-slate-900 border-rose-500 ring-2 ring-rose-500/30 shadow-rose-950/40"
                    : isProgress
                    ? "bg-slate-900 border-amber-500/60 shadow-amber-950/20"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Ticket Header */}
                <div
                  className={`p-4 rounded-t-2xl border-b flex items-center justify-between ${
                    isReady
                      ? "bg-emerald-950/40 border-emerald-900/50"
                      : isLate
                      ? "bg-rose-950/40 border-rose-900/50"
                      : isProgress
                      ? "bg-amber-950/30 border-amber-900/40"
                      : "bg-slate-800/60 border-slate-800"
                  }`}
                >
                  <div>
                    <span className="font-extrabold text-base text-white tracking-tight">
                      {ticket.kotNumber}
                    </span>
                    <span className="text-xs text-slate-400 block font-medium mt-0.5">
                      {ticket.tableNumber ? `Table ${ticket.tableNumber}` : "Direct Takeaway"} • {ticket.orderType}
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${
                      isReady
                        ? "bg-emerald-500 text-white border-emerald-400 animate-pulse"
                        : isLate
                        ? "bg-rose-500 text-white border-rose-400 animate-pulse"
                        : isProgress
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ticket.elapsedMinutes || 0}m</span>
                  </div>
                </div>

                {/* Items Content */}
                <div className="p-4 flex-1 space-y-3">
                  <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 shadow-inner">
                    {ticket.itemsSummary || "No special item breakdown"}
                  </div>

                  {ticket.specialInstructions && (
                    <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40 text-[11px] text-amber-300">
                      <strong>Cooking Note:</strong> {ticket.specialInstructions}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Placed: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}</span>
                    <span className="font-semibold text-slate-400">Status: {ticket.status}</span>
                  </div>
                </div>

                {/* Interactive Workflow Actions */}
                <div className="p-3 bg-slate-950/90 border-t border-slate-800 rounded-b-2xl space-y-2">
                  {isPending && (
                    <button
                      onClick={() => updateStatus(ticket.id, "IN_PROGRESS")}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40"
                    >
                      <Flame className="w-4 h-4" />
                      Start Cooking
                    </button>
                  )}

                  {isProgress && (
                    <button
                      onClick={() => updateStatus(ticket.id, "READY")}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark KOT Ready (Notify Waiter)
                    </button>
                  )}

                  {isReady && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-400 text-xs font-bold bg-emerald-950/30 rounded-lg border border-emerald-900/40">
                        <CheckCircle2 className="w-4 h-4" />
                        Ready • Waiter Notified
                      </div>
                      <button
                        onClick={() => updateStatus(ticket.id, "SERVED")}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-700"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark Served (Dismiss)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
