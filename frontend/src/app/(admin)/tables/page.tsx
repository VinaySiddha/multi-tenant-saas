"use client";

import React, { useMemo, useState } from "react";
import { Plus, RefreshCw, Users } from "lucide-react";
import { adminApi, apiErrorMessage } from "@/lib/admin-api";
import { useFetch } from "@/hooks/useFetch";
import type { DiningTable, TableStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  Input,
  Label,
  Modal,
  Select,
  FieldError,
  ErrorState,
  EmptyState,
} from "@/components/ui";
import { TableStatusBadge } from "@/components/status-badges";
import { useToast } from "@/components/toast";

const ALL_STATUSES: TableStatus[] = ["AVAILABLE", "OCCUPIED", "RESERVED", "BILLING", "CLEANING"];

const statusRing: Record<string, string> = {
  AVAILABLE: "border-emerald-300 dark:border-emerald-700",
  OCCUPIED: "border-amber-300 dark:border-amber-700",
  RESERVED: "border-blue-300 dark:border-blue-700",
  BILLING: "border-rose-300 dark:border-rose-700",
  CLEANING: "border-slate-300 dark:border-slate-600",
};

export default function TablesPage() {
  const { toast } = useToast();
  const { data, loading, error, refresh } = useFetch<DiningTable[]>(async () => {
    try {
      return await adminApi.getTables();
    } catch (err) {
      throw new Error(apiErrorMessage(err, "Unable to load tables."));
    }
  });

  const [addOpen, setAddOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState({ tableNumber: "", section: "", capacity: "4" });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const tables = useMemo(
    () =>
      [...(data ?? [])].sort((a, b) =>
        a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true })
      ),
    [data]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, DiningTable[]>();
    tables.forEach((t) => {
      const key = t.section?.trim() || "Main Hall";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries());
  }, [tables]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    tables.forEach((t) => (c[t.status] = (c[t.status] ?? 0) + 1));
    return c;
  }, [tables]);

  const changeStatus = async (table: DiningTable, status: TableStatus) => {
    setBusyId(table.id);
    try {
      const updated = await adminApi.updateTableStatus(table.id, status);
      refresh();
      void updated;
      toast(`Table ${table.tableNumber} → ${status.toLowerCase()}`, "success");
    } catch (err) {
      toast(apiErrorMessage(err, "Could not update table status."), "error");
    } finally {
      setBusyId(null);
    }
  };

  const createTable = async () => {
    if (!form.tableNumber.trim()) {
      setFormError("Table number is required.");
      return;
    }
    const capacity = Number(form.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 50) {
      setFormError("Capacity must be a whole number between 1 and 50.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await adminApi.createTable({
        tableNumber: form.tableNumber.trim(),
        section: form.section.trim() || undefined,
        capacity,
      });
      toast(`Table ${form.tableNumber} created`, "success");
      setAddOpen(false);
      setForm({ tableNumber: "", section: "", capacity: "4" });
      refresh();
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not create table."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Floor Plan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {tables.length} tables •{" "}
            {ALL_STATUSES.map((s) => `${counts[s] ?? 0} ${s.toLowerCase()}`).join(" • ")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} loading={loading}>
            {!loading && <RefreshCw className="w-3.5 h-3.5" />} Refresh
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Add table
          </Button>
        </div>
      </div>

      {loading ? (
        <EmptyState title="Loading floor plan…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : tables.length === 0 ? (
        <EmptyState
          title="No tables configured yet"
          hint="Add your first table to start assigning dine-in orders and QR menus."
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([section, sectionTables]) => (
            <Card key={section} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{section}</h3>
                <span className="text-[11px] text-slate-500">{sectionTables.length} tables</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                {sectionTables.map((table) => (
                  <div
                    key={table.id}
                    className={cn(
                      "rounded-xl border-2 bg-white dark:bg-slate-900 p-3 transition",
                      statusRing[table.status] ?? "border-slate-200"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        T-{table.tableNumber}
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
                        <Users className="w-3 h-3" />
                        {table.capacity}
                      </span>
                    </div>
                    <TableStatusBadge status={table.status} />
                    <Select
                      value={table.status}
                      disabled={busyId === table.id}
                      onChange={(e) =>
                        changeStatus(table, e.target.value as TableStatus)
                      }
                      className="mt-2 text-xs h-8 py-1"
                      aria-label={`Status for table ${table.tableNumber}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add dining table"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={createTable}>
              Create table
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="table-number" required>
              Table number
            </Label>
            <Input
              id="table-number"
              value={form.tableNumber}
              onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
              placeholder="e.g. 12 or P-3 (patio)"
              maxLength={10}
            />
          </div>
          <div>
            <Label htmlFor="table-section">Section</Label>
            <Input
              id="table-section"
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              placeholder="e.g. Patio, Rooftop, Main Hall"
              maxLength={40}
            />
          </div>
          <div>
            <Label htmlFor="table-capacity" required>
              Seat capacity
            </Label>
            <Input
              id="table-capacity"
              type="number"
              min={1}
              max={50}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
          </div>
          <FieldError>{formError}</FieldError>
        </div>
      </Modal>
    </div>
  );
}
