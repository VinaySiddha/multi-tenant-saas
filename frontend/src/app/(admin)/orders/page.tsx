"use client";

import React, { useMemo, useState } from "react";
import { RefreshCw, Ban, CreditCard, Eye, Search } from "lucide-react";
import { adminApi, apiErrorMessage } from "@/lib/admin-api";
import { useFetch, useDebouncedValue } from "@/hooks/useFetch";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { OrderView } from "@/types";
import {
  Button,
  Card,
  DataTable,
  Input,
  Modal,
  Select,
  Label,
  FieldError,
  type Column,
} from "@/components/ui";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  OrderTypeLabel,
} from "@/components/status-badges";
import { useToast } from "@/components/toast";

const CANCELLABLE = new Set(["PLACED", "CONFIRMED"]);

export default function OrdersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const { data, loading, error, refresh } = useFetch<OrderView[]>(async () => {
    try {
      return await adminApi.getOrders();
    } catch (err) {
      throw new Error(apiErrorMessage(err, "Unable to load orders."));
    }
  });

  const [detail, setDetail] = useState<OrderView | null>(null);
  const [cancelTarget, setCancelTarget] = useState<OrderView | null>(null);
  const [payTarget, setPayTarget] = useState<OrderView | null>(null);
  const [busy, setBusy] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [payMethod, setPayMethod] = useState("CASH");
  const [payRef, setPayRef] = useState("");
  const [payError, setPayError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = [...(data ?? [])].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    if (statusFilter !== "ALL") rows = rows.filter((o) => o.status === statusFilter);
    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.tableNumber?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [data, statusFilter, debouncedSearch]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((o) => o.status && set.add(o.status));
    return Array.from(set).sort();
  }, [data]);

  const openPayModal = (order: OrderView) => {
    setPayTarget(order);
    setPayMethod("CASH");
    setPayRef("");
    setPayError(null);
  };

  const handleSettle = async () => {
    if (!payTarget) return;
    if (payMethod !== "CASH" && !payRef.trim()) {
      setPayError("Transaction reference is required for non-cash payments.");
      return;
    }
    setBusy(true);
    try {
      await adminApi.settlePayment({
        orderId: payTarget.id,
        amount: Number(payTarget.grandTotal ?? 0),
        paymentMethod: payMethod,
        transactionReference: payRef.trim() || undefined,
      });
      toast(`Payment settled for ${payTarget.orderNumber}`, "success");
      setPayTarget(null);
      refresh();
    } catch (err) {
      setPayError(apiErrorMessage(err, "Payment settlement failed."));
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setBusy(true);
    try {
      await adminApi.cancelOrder(cancelTarget.id, cancelReason.trim() || undefined);
      toast(`Order ${cancelTarget.orderNumber} cancelled`, "success");
      setCancelTarget(null);
      setCancelReason("");
      refresh();
    } catch (err) {
      toast(apiErrorMessage(err, "Could not cancel order."), "error");
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<OrderView>[] = [
    {
      key: "orderNumber",
      header: "Order",
      render: (o) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200">{o.orderNumber}</p>
          <p className="text-[11px] text-slate-500">{formatDateTime(o.createdAt)}</p>
        </div>
      ),
    },
    { key: "type", header: "Channel", render: (o) => <OrderTypeLabel type={o.orderType} /> },
    {
      key: "table",
      header: "Table / Customer",
      render: (o) => (
        <span className="text-xs">
          {o.tableNumber ? `T-${o.tableNumber}` : o.customerName || "—"}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (o) => <OrderStatusBadge status={o.status} /> },
    {
      key: "payment",
      header: "Payment",
      render: (o) => <PaymentStatusBadge status={o.paymentStatus} />,
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (o) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(Number(o.grandTotal ?? 0))}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (o) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setDetail(o)} aria-label="View order">
            <Eye className="w-3.5 h-3.5" />
          </Button>
          {o.paymentStatus === "UNPAID" && o.status !== "CANCELLED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openPayModal(o)}
              title="Settle payment"
            >
              <CreditCard className="w-3.5 h-3.5" /> Settle
            </Button>
          )}
          {CANCELLABLE.has(o.status) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              onClick={() => setCancelTarget(o)}
            >
              <Ban className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            All orders across POS, QR and delivery channels
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} loading={loading}>
          {!loading && <RefreshCw className="w-3.5 h-3.5" />} Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, table or customer…"
              className="pl-9"
              aria-label="Search orders"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-48"
            aria-label="Filter by status"
          >
            <option value="ALL">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(o) => o.id}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No orders match your filters"
        emptyHint="Create an order from the POS terminal or share a QR menu link."
      />

      {/* Detail modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail ? `Order ${detail.orderNumber}` : "Order"}
        width="max-w-xl"
        footer={
          <Button variant="secondary" onClick={() => setDetail(null)}>
            Close
          </Button>
        }
      >
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge status={detail.status} />
              <PaymentStatusBadge status={detail.paymentStatus} />
              <OrderTypeLabel type={detail.orderType} />
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              {(detail.items ?? []).map((item, idx) => (
                <li key={item.id ?? idx} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.itemName} × {item.quantity}
                    </p>
                    {item.notes && <p className="text-[10px] text-slate-500">{item.notes}</p>}
                  </div>
                  <span className="text-xs font-bold tabular-nums">
                    {formatCurrency(Number(item.totalPrice ?? 0))}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="tabular-nums">{formatCurrency(Number(detail.subtotal ?? 0))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Tax</dt>
                <dd className="tabular-nums">{formatCurrency(Number(detail.taxAmount ?? 0))}</dd>
              </div>
              {Number(detail.discountAmount ?? 0) > 0 && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Discount</dt>
                  <dd className="tabular-nums text-emerald-600">
                    −{formatCurrency(Number(detail.discountAmount))}
                  </dd>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-200 dark:border-slate-800">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCurrency(Number(detail.grandTotal ?? 0))}</dd>
              </div>
            </dl>
            {detail.notes && (
              <p className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3">
                <span className="font-semibold">Note:</span> {detail.notes}
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Cancel modal */}
      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title={`Cancel ${cancelTarget?.orderNumber ?? "order"}?`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelTarget(null)}>
              Keep order
            </Button>
            <Button variant="danger" loading={busy} onClick={handleCancel}>
              Cancel order
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          Cancelling releases the table and stops kitchen preparation. This action is recorded in
          the audit trail and cannot be undone.
        </p>
        <Label htmlFor="cancel-reason">Reason (optional)</Label>
        <Input
          id="cancel-reason"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="e.g. Customer walked out"
          maxLength={200}
        />
      </Modal>

      {/* Settle payment modal */}
      <Modal
        open={!!payTarget}
        onClose={() => setPayTarget(null)}
        title={`Settle ${payTarget?.orderNumber ?? "order"}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayTarget(null)}>
              Cancel
            </Button>
            <Button loading={busy} onClick={handleSettle}>
              Confirm payment
            </Button>
          </>
        }
      >
        {payTarget && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Amount due
              </span>
              <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(Number(payTarget.grandTotal ?? 0))}
              </span>
            </div>
            <div>
              <Label htmlFor="pay-method" required>
                Payment method
              </Label>
              <Select
                id="pay-method"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="WALLET">Wallet</option>
                <option value="ONLINE">Online gateway</option>
              </Select>
            </div>
            {payMethod !== "CASH" && (
              <div>
                <Label htmlFor="pay-ref" required>
                  Gateway transaction reference
                </Label>
                <Input
                  id="pay-ref"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="Verified server-side against the gateway"
                />
                <FieldError>{payError}</FieldError>
              </div>
            )}
            {payMethod === "CASH" && payError && <FieldError>{payError}</FieldError>}
          </div>
        )}
      </Modal>
    </div>
  );
}
