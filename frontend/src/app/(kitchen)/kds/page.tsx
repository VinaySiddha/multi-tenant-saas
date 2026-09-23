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
import { MorphButton } from "@/components/spectrumui/morph-button";

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
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();

    const handleOrderCreated = () => {
      fetchTickets();
      if (soundEnabled) playNotificationSound();
    };

    const handleKotUpdated = () => {
      fetchTickets();
    };

    window.addEventListener("sapru:order-created", handleOrderCreated);
    window.addEventListener("sapru:kot-updated", handleKotUpdated);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0A291F] p-3.5 rounded-2xl border border-[#E5E7EB] dark:border-[#165742] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#FF6A3D]/10 border border-[#FF6A3D]/20 text-[#FF6A3D]">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#0F3D2E] dark:text-[#FAFAF8] flex items-center gap-2">
              Live Kitchen Expediter Line
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAFAF8] dark:bg-[#165742] text-[#0F3D2E] dark:text-[#FAFAF8] border border-[#E5E7EB] dark:border-[#165742] font-mono font-bold">
                {activeTickets.length} active tickets
              </span>
            </h2>
            <p className="text-[11px] text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70">
              Real-time orders received from POS terminals and guest QR mobile scans
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
              soundEnabled
                ? "bg-[#FAFAF8] dark:bg-[#165742] text-[#0F3D2E] dark:text-[#FAFAF8] border-[#E5E7EB] dark:border-[#165742] hover:bg-white"
                : "bg-rose-50 text-rose-600 border-rose-200"
            }`}
            title="Toggle audio alerts"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5 text-rose-500" />}
            <span>{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>

          <MorphButton
            size="sm"
            onClick={fetchTickets}
            className="bg-[#FAFAF8] dark:bg-[#165742] hover:bg-white text-[#0F3D2E] dark:text-white border border-[#E5E7EB] dark:border-[#165742] text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </MorphButton>
        </div>
      </div>

      {/* Tickets Row */}
      {activeTickets.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#0A291F] border border-dashed border-[#E5E7EB] dark:border-[#165742] flex flex-col items-center justify-center text-[#6B7280] space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#FAFAF8] dark:bg-[#165742] border border-[#E5E7EB] dark:border-[#165742] flex items-center justify-center text-emerald-500 shadow-xs">
            <CheckCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0F3D2E] dark:text-[#FAFAF8]">Kitchen Queue is Clear</h3>
            <p className="text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 max-w-sm">
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
                className={`w-80 flex-shrink-0 rounded-2xl flex flex-col border shadow-md transition-all duration-200 bg-white dark:bg-[#0A291F] ${
                  isReady
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : isLate
                    ? "border-rose-500 ring-2 ring-rose-500/30"
                    : isProgress
                    ? "border-[#FF6A3D] ring-2 ring-[#FF6A3D]/20"
                    : "border-[#E5E7EB] dark:border-[#165742] hover:border-[#FF6A3D]/40"
                }`}
              >
                {/* Ticket Header */}
                <div
                  className={`p-4 rounded-t-2xl border-b flex items-center justify-between ${
                    isReady
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50"
                      : isLate
                      ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50"
                      : isProgress
                      ? "bg-[#FF6A3D]/10 border-[#FF6A3D]/20"
                      : "bg-[#FAFAF8] dark:bg-[#165742]/40 border-[#E5E7EB] dark:border-[#165742]"
                  }`}
                >
                  <div>
                    <span className="font-extrabold text-base text-[#0F3D2E] dark:text-white tracking-tight">
                      {ticket.kotNumber}
                    </span>
                    <span className="text-xs text-[#0B0B0B]/70 dark:text-[#E5E7EB]/70 block font-medium mt-0.5">
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
                        ? "bg-[#FF6A3D] text-white border-[#FF6A3D]"
                        : "bg-white dark:bg-[#165742] text-[#0F3D2E] dark:text-[#FAFAF8] border-[#E5E7EB] dark:border-[#165742]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ticket.elapsedMinutes || 0}m</span>
                  </div>
                </div>

                {/* Items Content */}
                <div className="p-4 flex-1 space-y-3">
                  <div className="text-xs text-[#0B0B0B] dark:text-slate-200 leading-relaxed font-mono whitespace-pre-line bg-[#FAFAF8] dark:bg-[#165742]/30 p-3.5 rounded-xl border border-[#E5E7EB] dark:border-[#165742] shadow-inner">
                    {ticket.itemsSummary || "No special item breakdown"}
                  </div>

                  {ticket.specialInstructions && (
                    <div className="p-2.5 rounded-lg bg-[#FF6A3D]/10 border border-[#FF6A3D]/20 text-[11px] text-[#0F3D2E] dark:text-[#FF6A3D]">
                      <strong>Cooking Note:</strong> {ticket.specialInstructions}
                    </div>
                  )}

                  <div className="text-[10px] text-[#6B7280] dark:text-[#E5E7EB]/60 flex items-center justify-between pt-1 font-mono">
                    <span>Placed: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}</span>
                    <span className="font-semibold text-[#0F3D2E] dark:text-white">Status: {ticket.status}</span>
                  </div>
                </div>

                {/* Interactive Workflow Actions */}
                <div className="p-3 bg-[#FAFAF8] dark:bg-[#165742]/40 border-t border-[#E5E7EB] dark:border-[#165742] rounded-b-2xl space-y-2">
                  {isPending && (
                    <MorphButton
                      onAction={() => updateStatus(ticket.id, "IN_PROGRESS")}
                      loadingLabel="Starting..."
                      successLabel="Cooking!"
                      className="w-full bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs font-bold shadow-md shadow-[#FF6A3D]/25"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Start Cooking</span>
                    </MorphButton>
                  )}

                  {isProgress && (
                    <MorphButton
                      onAction={() => updateStatus(ticket.id, "READY")}
                      loadingLabel="Notifying..."
                      successLabel="Ready!"
                      className="w-full bg-[#0F3D2E] hover:bg-[#165742] text-white text-xs font-bold shadow-md shadow-[#0F3D2E]/25"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark KOT Ready (Notify Server)</span>
                    </MorphButton>
                  )}

                  {isReady && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                        <CheckCircle2 className="w-4 h-4" />
                        Ready • Server Notified
                      </div>
                      <MorphButton
                        size="sm"
                        onAction={() => updateStatus(ticket.id, "SERVED")}
                        loadingLabel="Serving..."
                        successLabel="Served!"
                        className="w-full bg-white dark:bg-[#165742] hover:bg-[#FAFAF8] text-[#0F3D2E] dark:text-white text-xs font-semibold border border-[#E5E7EB] dark:border-[#165742]"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark Served (Dismiss)</span>
                      </MorphButton>
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
