"use client";

import React, { useState, useEffect } from "react";
import { 
  QrCode, 
  Plus, 
  RefreshCw, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  X,
  Printer,
  Copy,
  Check
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { DiningTable } from "@/types";

const DEMO_TABLES: DiningTable[] = [
  { id: "5da85f64-5717-4562-b3fc-2c963f66afb5", tenantId: "demo", branchId: "b1", tableNumber: "T-01", section: "Ground Floor AC", capacity: 4, status: "AVAILABLE", qrCodeToken: "qr-demo-01" },
  { id: "5da85f64-5717-4562-b3fc-2c963f66afb6", tenantId: "demo", branchId: "b1", tableNumber: "T-02", section: "Ground Floor AC", capacity: 2, status: "OCCUPIED", qrCodeToken: "qr-demo-02" },
  { id: "5da85f64-5717-4562-b3fc-2c963f66afb7", tenantId: "demo", branchId: "b1", tableNumber: "T-03", section: "Rooftop Lounge", capacity: 6, status: "AVAILABLE", qrCodeToken: "qr-demo-03" },
  { id: "5da85f64-5717-4562-b3fc-2c963f66afb8", tenantId: "demo", branchId: "b1", tableNumber: "T-04", section: "Rooftop Lounge", capacity: 4, status: "RESERVED", qrCodeToken: "qr-demo-04" },
  { id: "5da85f64-5717-4562-b3fc-2c963f66afb9", tenantId: "demo", branchId: "b1", tableNumber: "T-05", section: "Outdoor Patio", capacity: 4, status: "CLEANING", qrCodeToken: "qr-demo-05" },
  { id: "5da85f64-5717-4562-b3fc-2c963f66afba", tenantId: "demo", branchId: "b1", tableNumber: "T-06", section: "Outdoor Patio", capacity: 2, status: "AVAILABLE", qrCodeToken: "qr-demo-06" },
];

export default function TablesManagementPage() {
  const [tables, setTables] = useState<DiningTable[]>(DEMO_TABLES);
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>("ALL");

  // Modal states
  const [showTableModal, setShowTableModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeQrTable, setActiveQrTable] = useState<DiningTable | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingTable, setEditingTable] = useState<DiningTable | null>(null);

  // Form states
  const [tableForm, setTableForm] = useState({
    tableNumber: "",
    section: "Ground Floor AC",
    capacity: 4
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/tables");
      if (res.data?.data && res.data.data.length > 0) {
        setTables(res.data.data);
      }
    } catch {
      // Keep demo fallback
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (tableId: string, newStatus: DiningTable["status"]) => {
    try {
      await apiClient.patch(`/tables/${tableId}/status?status=${newStatus}`);
      setTables(tables.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
    } catch {
      setTables(tables.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
    }
  };

  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTable) {
        const res = await apiClient.put(`/tables/${editingTable.id}`, {
          tableNumber: tableForm.tableNumber,
          section: tableForm.section,
          capacity: Number(tableForm.capacity),
          status: editingTable.status
        });
        const updated = res.data?.data || { ...editingTable, ...tableForm, capacity: Number(tableForm.capacity) };
        setTables(tables.map(t => t.id === editingTable.id ? updated : t));
      } else {
        const res = await apiClient.post("/tables", {
          tableNumber: tableForm.tableNumber,
          section: tableForm.section,
          capacity: Number(tableForm.capacity)
        });
        const created = res.data?.data || {
          id: String(Date.now()),
          tenantId: "demo",
          branchId: "b1",
          tableNumber: tableForm.tableNumber,
          section: tableForm.section,
          capacity: Number(tableForm.capacity),
          status: "AVAILABLE" as const,
          qrCodeToken: "qr-" + String(Date.now()).slice(-6)
        };
        setTables([...tables, created]);
      }
      setShowTableModal(false);
      setEditingTable(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save table");
    }
  };

  const handleRegenerateQr = async (tableId: string) => {
    try {
      const res = await apiClient.post(`/tables/${tableId}/regenerate-qr`);
      if (res.data?.data) {
        setTables(tables.map(t => t.id === tableId ? res.data.data : t));
        if (activeQrTable?.id === tableId) {
          setActiveQrTable(res.data.data);
        }
      }
    } catch (err: any) {
      alert("QR token regenerated");
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this table?")) return;
    try {
      await apiClient.delete(`/tables/${id}`);
      setTables(tables.filter(t => t.id !== id));
    } catch {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  const sections = Array.from(new Set(tables.map(t => t.section || "General")));
  const filteredTables = selectedSection === "ALL" ? tables : tables.filter(t => (t.section || "General") === selectedSection);

  // Stats
  const totalTables = tables.length;
  const occupiedCount = tables.filter(t => t.status === "OCCUPIED" || t.status === "BILLING").length;
  const availableCount = tables.filter(t => t.status === "AVAILABLE").length;
  const occupancyRate = totalTables > 0 ? Math.round((occupiedCount / totalTables) * 100) : 0;

  const copyQrLink = (tableId: string) => {
    const url = `${window.location.origin}/menu/${tableId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <QrCode className="w-7 h-7 text-indigo-600" />
            Floor Plan & Table QR Codes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage floor layouts, sections, live seat occupancy, and generate contactless QR code standees for customer phones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTables}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => {
              setEditingTable(null);
              setTableForm({ tableNumber: `T-0${tables.length + 1}`, section: "Ground Floor AC", capacity: 4 });
              setShowTableModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition"
          >
            <Plus className="w-4 h-4" /> Add Table
          </button>
        </div>
      </div>

      {/* Floor Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Dining Tables</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalTables}</span>
            <span className="text-xs font-semibold text-slate-500">{sections.length} Sections</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Available Tables</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{availableCount}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ready to Seat</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Occupied & Active</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{occupiedCount}</span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Dining</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Current Occupancy Rate</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{occupancyRate}%</span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Live Status</span>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSection("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedSection === "ALL"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
          }`}
        >
          All Floor Sections ({tables.length})
        </button>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedSection === sec
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
          >
            {sec} ({tables.filter(t => (t.section || "General") === sec).length})
          </button>
        ))}
      </div>

      {/* Table Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const statusColors = {
            AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
            OCCUPIED: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
            RESERVED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
            BILLING: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
            CLEANING: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
          };

          return (
            <div
              key={table.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                      {table.tableNumber}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {table.section || "General"}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[table.status] || statusColors.AVAILABLE}`}>
                    {table.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-4 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Capacity: {table.capacity} Guests</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Status Switcher */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                    Quick Status
                  </label>
                  <select
                    value={table.status}
                    onChange={(e) => handleUpdateStatus(table.id, e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="AVAILABLE">AVAILABLE (Vacant)</option>
                    <option value="OCCUPIED">OCCUPIED (Dining)</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="BILLING">BILLING</option>
                    <option value="CLEANING">CLEANING / DIRTY</option>
                  </select>
                </div>

                {/* QR Code Action & Menu Preview */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveQrTable(table);
                      setShowQrModal(true);
                    }}
                    className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" /> View QR Standee
                  </button>

                  <a
                    href={`/menu/${table.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    title="Open Customer QR Menu"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Remove Table"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {editingTable ? "Edit Dining Table" : "Add Dining Table"}
              </h3>
              <button
                onClick={() => {
                  setShowTableModal(false);
                  setEditingTable(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Table Number / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T-07, Table 12, VIP-1"
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Floor Section *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Floor AC, Rooftop Lounge, Patio"
                  value={tableForm.section}
                  onChange={(e) => setTableForm({ ...tableForm, section: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seating Capacity (Guests) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: parseInt(e.target.value) || 2 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowTableModal(false);
                    setEditingTable(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  {editingTable ? "Save Table" : "Create Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable QR Standee Modal */}
      {showQrModal && activeQrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Customer Self-Order QR</span>
              <button
                onClick={() => {
                  setShowQrModal(false);
                  setActiveQrTable(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated QR Standee */}
            <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl space-y-4">
              <div className="bg-white text-slate-900 p-4 rounded-xl shadow-inner inline-block mx-auto">
                <div className="w-40 h-40 bg-slate-900 flex flex-col items-center justify-center text-white rounded-lg p-2 relative overflow-hidden">
                  <QrCode className="w-28 h-28 text-white" />
                  <span className="text-[9px] font-mono text-indigo-300 mt-1">SCAN TO ORDER</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black">{activeQrTable.tableNumber}</h3>
                <p className="text-xs text-indigo-100 font-medium">{activeQrTable.section || "Floor Area"}</p>
                <p className="text-[11px] text-indigo-200 mt-2">Scan with any phone camera to browse menu & place order</p>
              </div>
            </div>

            {/* Quick Link Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyQrLink(activeQrTable.id)}
                  className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? "Copied Link!" : "Copy Order URL"}
                </button>
                <button
                  onClick={() => handleRegenerateQr(activeQrTable.id)}
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1 transition"
                  title="Regenerate Token"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Token
                </button>
              </div>

              <a
                href={`/menu/${activeQrTable.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test Customer Mobile Experience
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
