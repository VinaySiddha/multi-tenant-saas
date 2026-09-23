"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, CheckCircle2, Flame, Receipt, Utensils, X, AlertTriangle } from "lucide-react";
import Link from "next/link";

export interface AppNotification {
  id: string;
  type: "ORDER_CREATED" | "KOT_UPDATED" | "ORDER_READY" | "PAYMENT_COMPLETED" | "INFO";
  title: string;
  message: string;
  timestamp: Date;
  data?: any;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  playNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Web Audio API chime synthesis - requires no external audio assets and works everywhere
function playChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Melodic dual-tone chime (E5 -> A5)
    playTone(659.25, 0, 0.25);
    playTone(880.00, 0.15, 0.45);
  } catch {
    // AudioContext blocked by browser policy until user gesture
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { tenant, branch, token } = useAuthStore();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const addNotification = useCallback((notif: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotif: AppNotification = {
      ...notif,
      id: "notif-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
    setActiveToast(newNotif);

    if (notif.type === "ORDER_READY" || notif.type === "ORDER_CREATED") {
      playChime();
    }

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToast((current) => (current?.id === newNotif.id ? null : current));
    }, 6000);
  }, []);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const wsUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, "") + "/api/v1/ws";

    let stompClient: Client | null = null;

    try {
      stompClient = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: () => {},
        onConnect: () => {
          // Subscribe to general and tenant/branch topics
          const topics = [
            "/topic/orders",
            "/topic/kot",
            "/topic/notifications",
            "/topic/payments"
          ];

          if (tenant?.id && branch?.id) {
            topics.push(
              `/topic/tenant/${tenant.id}/branch/${branch.id}/orders`,
              `/topic/tenant/${tenant.id}/branch/${branch.id}/kot`,
              `/topic/tenant/${tenant.id}/branch/${branch.id}/payments`
            );
          }

          topics.forEach((topic) => {
            stompClient?.subscribe(topic, (message) => {
              try {
                const payload = JSON.parse(message.body);
                handleIncomingEvent(payload);
              } catch (e) {
                // Ignore parse errors
              }
            });
          });
        },
      });

      stompClient.activate();
    } catch {
      // WebSocket fallback handling
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [tenant?.id, branch?.id, token]);

  const handleIncomingEvent = (payload: { eventType: string; data: any }) => {
    const { eventType, data } = payload;
    const tableStr = data?.tableNumber ? `Table ${data.tableNumber}` : data?.tableName ? `Table ${data.tableName}` : "Takeaway / Direct";

    if (eventType === "ORDER_READY") {
      addNotification({
        type: "ORDER_READY",
        title: `🔔 Order Ready: ${data?.orderNumber || "New Order"}`,
        message: `Kitchen marked order for ${tableStr} as READY. Ready for serving and bill settlement!`,
        data,
      });
      window.dispatchEvent(new CustomEvent("sapru:order-ready", { detail: data }));
    } else if (eventType === "ORDER_CREATED") {
      addNotification({
        type: "ORDER_CREATED",
        title: `✨ New Order Placed: ${data?.orderNumber || ""}`,
        message: `Order for ${tableStr} received and ticket dispatched to Kitchen.`,
        data,
      });
      window.dispatchEvent(new CustomEvent("sapru:order-created", { detail: data }));
    } else if (eventType === "KOT_UPDATED") {
      window.dispatchEvent(new CustomEvent("sapru:kot-updated", { detail: data }));
    } else if (eventType === "PAYMENT_COMPLETED") {
      addNotification({
        type: "PAYMENT_COMPLETED",
        title: `💳 Bill Settled: ₹${data?.amount || ""}`,
        message: `Payment received via ${data?.paymentMethod || "CASH"}. Table is now freed.`,
        data,
      });
      window.dispatchEvent(new CustomEvent("sapru:payment-completed", { detail: data }));
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        playNotificationSound: playChime,
      }}
    >
      {children}

      {/* Real-time Floating Toast Alert */}
      {activeToast && (
        <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 transition-all ${
              activeToast.type === "ORDER_READY"
                ? "bg-emerald-950/95 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/30"
                : activeToast.type === "PAYMENT_COMPLETED"
                ? "bg-indigo-950/95 border-indigo-500 text-indigo-100 ring-2 ring-indigo-500/30"
                : "bg-slate-900/95 border-amber-500/50 text-slate-100"
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                activeToast.type === "ORDER_READY"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : activeToast.type === "PAYMENT_COMPLETED"
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {activeToast.type === "ORDER_READY" ? (
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
              ) : activeToast.type === "PAYMENT_COMPLETED" ? (
                <Receipt className="w-5 h-5" />
              ) : (
                <Utensils className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {activeToast.message}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href="/orders"
                  onClick={() => setActiveToast(null)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1"
                >
                  <Receipt className="w-3 h-3" /> Go to Billing &amp; Orders
                </Link>
                <button
                  onClick={() => setActiveToast(null)}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
