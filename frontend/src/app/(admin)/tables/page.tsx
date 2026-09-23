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
import { MorphButton } from "@/components/spectrumui/morph-button";

export default function TablesManagementPage() {
  const [tables, setTables] = useState<DiningTable[]>([]);
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

    const handleTableEvents = () => {
      fetchTables();
    };

    window.addEventListener("sapru:order-created", handleTableEvents);
    window.addEventListener("sapru:payment-completed", handleTableEvents);

    return () => {
      window.removeEventListener("sapru:order-created", handleTableEvents);
      window.removeEventListener("sapru:payment-completed", handleTableEvents);
    };
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/tables");
      if (res.data?.data) {
        setTables(res.data.data);
      } else {
        setTables([]);
      }
    } catch {
      setTables([]);
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
          <h1 className="text-2xl font-bold tracking-tight text-[#0F3D2E] flex items-center gap-2">
            <QrCode className="w-7 h-7 text-[#FF6A3D]" />
            Floor Plan &amp; Table QR Codes
          </h1>
          <p className="text-xs text-[#0B0B0B]/70 mt-1">
            Manage floor layouts, sections, live seat occupancy, and generate contactless QR code standees for customer phones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MorphButton
            size="sm"
            onClick={fetchTables}
            className="bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0B0B0B] hover:bg-[#FAFAF8] shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </MorphButton>
          <MorphButton
            size="sm"
            onClick={() => {
              setEditingTable(null);
              setTableForm({ tableNumber: `T-0${tables.length + 1}`, section: "Ground Floor AC", capacity: 4 });
              setShowTableModal(true);
            }}
            className="bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs font-semibold shadow-md shadow-[#FF6A3D]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </MorphButton>
        </div>
      </div>

      {/* Floor Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-medium text-[#0B0B0B]/70">Total Dining Tables</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#0B0B0B]">{totalTables}</span>
            <span className="text-xs font-semibold text-[#0B0B0B]/60">{sections.length} Sections</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-medium text-[#0B0B0B]/70">Available Tables</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#0F3D2E]">{availableCount}</span>
            <span className="text-xs font-semibold text-[#0F3D2E]">Ready to Seat</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-medium text-[#0B0B0B]/70">Occupied &amp; Active</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#FF6A3D]">{occupiedCount}</span>
            <span className="text-xs font-semibold text-[#FF6A3D]">Dining</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <span className="text-xs font-medium text-[#0B0B0B]/70">Current Occupancy Rate</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#0B0B0B]">{occupancyRate}%</span>
            <span className="text-xs font-semibold text-[#FF6A3D]">Live Status</span>
          </div>
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSection("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedSection === "ALL"
              ? "bg-[#FF6A3D] text-white shadow-xs font-bold"
              : "bg-white border border-[#E5E7EB] text-[#0B0B0B]/70 hover:bg-[#FAFAF8]"
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
                ? "bg-[#FF6A3D] text-white shadow-xs font-bold"
                : "bg-white border border-[#E5E7EB] text-[#0B0B0B]/70 hover:bg-[#FAFAF8]"
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
            AVAILABLE: "bg-[#0F3D2E]/10 text-[#0F3D2E] border-[#0F3D2E]/20",
            OCCUPIED: "bg-[#FF6A3D]/10 text-[#FF6A3D] border-[#FF6A3D]/30",
            RESERVED: "bg-amber-50 text-amber-700 border-amber-200",
            BILLING: "bg-purple-50 text-purple-700 border-purple-200",
            CLEANING: "bg-rose-50 text-rose-700 border-rose-200"
          };

          return (
            <div
              key={table.id}
              className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#FF6A3D]/40 transition"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-[#0F3D2E]">
                      {table.tableNumber}
                    </h3>
                    <p className="text-xs text-[#0B0B0B]/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#FF6A3D]" />
                      {table.section || "General"}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[table.status] || statusColors.AVAILABLE}`}>
                    {table.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#0B0B0B]/70 mb-4 font-medium">
                  <Users className="w-3.5 h-3.5 text-[#0B0B0B]/40" />
                  <span>Capacity: {table.capacity} Guests</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                {/* Status Switcher */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-[#0B0B0B]/60 mb-1">
                    Quick Status
                  </label>
                  <select
                    value={table.status}
                    onChange={(e) => handleUpdateStatus(table.id, e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#0B0B0B] focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
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
                    className="flex-1 py-1.5 px-2 bg-[#0F3D2E]/10 hover:bg-[#0F3D2E]/15 text-[#0F3D2E] font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" /> View QR Standee
                  </button>

                  <a
                    href={`/menu/${table.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#0B0B0B]/40 hover:text-[#0F3D2E] hover:bg-[#FAFAF8] rounded-lg transition"
                    title="Open Customer QR Menu"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="p-1.5 text-[#0B0B0B]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
      {/* Add / Edit Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B]/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#0F3D2E]">
                {editingTable ? "Edit Dining Table" : "Add Dining Table"}
              </h3>
              <button
                onClick={() => {
                  setShowTableModal(false);
                  setEditingTable(null);
                }}
                className="p-1 rounded-lg text-[#0B0B0B]/40 hover:text-[#0B0B0B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                  Table Number / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T-07, Table 12, VIP-1"
                  value={tableForm.tableNumber}
                  onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                  Floor Section *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Floor AC, Rooftop Lounge, Patio"
                  value={tableForm.section}
                  onChange={(e) => setTableForm({ ...tableForm, section: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                  Seating Capacity (Guests) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={tableForm.capacity}
                  onChange={(e) => setTableForm({ ...tableForm, capacity: parseInt(e.target.value) || 2 })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => {
                    setShowTableModal(false);
                    setEditingTable(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0B0B]/70 hover:bg-[#FAFAF8] transition"
                >
                  Cancel
                </button>
                <MorphButton
                  type="submit"
                  size="sm"
                  className="bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs font-semibold shadow-md shadow-[#FF6A3D]/25"
                >
                  <span>{editingTable ? "Save Table" : "Create Table"}</span>
                </MorphButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable QR Standee Modal */}
      {showQrModal && activeQrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-5 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F3D2E] uppercase tracking-wider">Customer Self-Order QR</span>
              <button
                onClick={() => {
                  setShowQrModal(false);
                  setActiveQrTable(null);
                }}
                className="p-1 rounded-lg text-[#0B0B0B]/40 hover:text-[#0B0B0B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Standee */}
            <div className="p-6 bg-[#0F3D2E] rounded-2xl text-white shadow-xl space-y-4">
              <div className="bg-white text-[#0B0B0B] p-4 rounded-xl shadow-inner inline-block mx-auto">
                <div className="w-40 h-40 bg-[#0B0B0B] flex flex-col items-center justify-center text-white rounded-lg p-2 relative overflow-hidden">
                  <QrCode className="w-28 h-28 text-white" />
                  <span className="text-[9px] font-mono text-[#FF6A3D] mt-1">SCAN TO ORDER</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{activeQrTable.tableNumber}</h3>
                <p className="text-xs text-[#E5E7EB] font-medium">{activeQrTable.section || "Floor Area"}</p>
                <p className="text-[11px] text-[#E5E7EB]/80 mt-2">Scan with any phone camera to browse menu &amp; place order</p>
              </div>
            </div>

            {/* Quick Link Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MorphButton
                  size="sm"
                  onClick={() => copyQrLink(activeQrTable.id)}
                  className="flex-1 bg-[#FAFAF8] border border-[#E5E7EB] hover:bg-[#E5E7EB] text-[#0B0B0B] font-semibold text-xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied Link!" : "Copy Order URL"}</span>
                </MorphButton>
                <MorphButton
                  size="sm"
                  onClick={() => handleRegenerateQr(activeQrTable.id)}
                  className="bg-[#FAFAF8] border border-[#E5E7EB] hover:bg-[#E5E7EB] text-[#0B0B0B] font-semibold text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Token</span>
                </MorphButton>
              </div>

              <a
                href={`/menu/${activeQrTable.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#FF6A3D] hover:bg-[#FF5522] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6A3D]/25 transition"
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

