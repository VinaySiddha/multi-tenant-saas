"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  RefreshCw, 
  TrendingDown, 
  DollarSign, 
  Layers, 
  Edit3, 
  Trash2, 
  ArrowUpDown,
  CheckCircle2,
  X
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { InventoryItem } from "@/types";
import { MorphButton } from "@/components/spectrumui/morph-button";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "LOW_STOCK" | "IN_STOCK">("ALL");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    unit: "kg",
    currentStock: 0,
    minThreshold: 5,
    costPerUnit: 0
  });

  const [adjustData, setAdjustData] = useState({
    quantity: 1,
    type: "RESTOCK",
    reason: ""
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/inventory");
      if (res.data?.data) {
        setItems(res.data.data);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/inventory", {
        name: formData.name,
        unit: formData.unit,
        currentStock: Number(formData.currentStock),
        minThreshold: Number(formData.minThreshold),
        costPerUnit: Number(formData.costPerUnit)
      });
      if (res.data?.data) {
        setItems([res.data.data, ...items]);
      } else {
        const newItem: InventoryItem = {
          id: String(Date.now()),
          tenantId: "demo",
          name: formData.name,
          unit: formData.unit,
          currentStock: Number(formData.currentStock),
          minThreshold: Number(formData.minThreshold),
          costPerUnit: Number(formData.costPerUnit),
          isLowStock: Number(formData.currentStock) <= Number(formData.minThreshold)
        };
        setItems([newItem, ...items]);
      }
      setShowAddModal(false);
      setFormData({ name: "", unit: "kg", currentStock: 0, minThreshold: 5, costPerUnit: 0 });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create inventory item");
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const res = await apiClient.post(`/inventory/${selectedItem.id}/adjust`, {
        quantity: Number(adjustData.quantity),
        type: adjustData.type,
        reason: adjustData.reason
      });

      if (res.data?.data) {
        setItems(items.map(it => it.id === selectedItem.id ? res.data.data : it));
      } else {
        let updatedStock = selectedItem.currentStock;
        const q = Number(adjustData.quantity);
        if (adjustData.type === "RESTOCK") updatedStock += q;
        else if (adjustData.type === "WASTE" || adjustData.type === "DEDUCT") updatedStock = Math.max(0, updatedStock - q);
        else updatedStock = q;

        const updated: InventoryItem = {
          ...selectedItem,
          currentStock: updatedStock,
          isLowStock: updatedStock <= selectedItem.minThreshold
        };
        setItems(items.map(it => it.id === selectedItem.id ? updated : it));
      }
      setShowAdjustModal(false);
      setSelectedItem(null);
      setAdjustData({ quantity: 1, type: "RESTOCK", reason: "" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to adjust stock");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      await apiClient.delete(`/inventory/${id}`);
      setItems(items.filter(it => it.id !== id));
    } catch {
      setItems(items.filter(it => it.id !== id));
    }
  };

  // KPI calculations
  const totalItems = items.length;
  const lowStockCount = items.filter(i => i.isLowStock || i.currentStock <= i.minThreshold).length;
  const outOfStockCount = items.filter(i => i.currentStock <= 0).length;
  const totalValuation = items.reduce((sum, item) => sum + (item.currentStock * (item.costPerUnit || 0)), 0);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isLow = item.isLowStock || item.currentStock <= item.minThreshold;
    if (filterTab === "LOW_STOCK") return matchesSearch && isLow;
    if (filterTab === "IN_STOCK") return matchesSearch && !isLow && item.currentStock > 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F3D2E] flex items-center gap-2">
            <Package className="w-7 h-7 text-[#FF6A3D]" />
            Inventory &amp; Stock Manager
          </h1>
          <p className="text-xs text-[#0B0B0B]/70 mt-1">
            Track live raw material stocks, safety thresholds, ingredient consumption, and supplier costs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MorphButton
            size="sm"
            onClick={fetchInventory}
            className="bg-white border border-[#E5E7EB] text-xs font-semibold text-[#0B0B0B] hover:bg-[#FAFAF8] shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </MorphButton>
          <MorphButton
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs font-semibold shadow-md shadow-[#FF6A3D]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </MorphButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#0B0B0B]/70">Total Tracked Items</span>
            <div className="p-2 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0B0B0B]">{totalItems}</span>
            <span className="text-xs font-semibold text-[#0B0B0B]/60">Raw materials</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#0B0B0B]/70">Low Stock Warnings</span>
            <div className="p-2 rounded-xl bg-[#FF6A3D]/10 text-[#FF6A3D]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${lowStockCount > 0 ? "text-[#FF6A3D]" : "text-[#0B0B0B]"}`}>
              {lowStockCount}
            </span>
            <span className="text-xs font-semibold text-[#FF6A3D]">Needs restock</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#0B0B0B]/70">Out of Stock</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${outOfStockCount > 0 ? "text-rose-600" : "text-[#0B0B0B]"}`}>
              {outOfStockCount}
            </span>
            <span className="text-xs font-semibold text-[#0B0B0B]/60">Depleted</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#0B0B0B]/70">Estimated Stock Value</span>
            <div className="p-2 rounded-xl bg-[#0F3D2E]/10 text-[#0F3D2E]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0F3D2E]">
              {formatCurrency(totalValuation)}
            </span>
            <span className="text-xs font-semibold text-[#0F3D2E]">Asset Value</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#0B0B0B]/40" />
          <input
            type="text"
            placeholder="Search stock items (e.g. Paneer, Rice)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(["ALL", "LOW_STOCK", "IN_STOCK"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterTab === tab
                  ? "bg-[#FF6A3D] text-white shadow-xs font-bold"
                  : "bg-[#FAFAF8] border border-[#E5E7EB] text-[#0B0B0B]/70 hover:bg-[#E5E7EB]"
              }`}
            >
              {tab === "ALL" && `All Items (${totalItems})`}
              {tab === "LOW_STOCK" && `Low Stock (${lowStockCount})`}
              {tab === "IN_STOCK" && `Adequate (${totalItems - lowStockCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-[#0B0B0B]/70 border-b border-[#E5E7EB] font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Item Name</th>
                <th className="px-4 py-3.5">Unit</th>
                <th className="px-4 py-3.5">Current Stock</th>
                <th className="px-4 py-3.5">Min. Threshold</th>
                <th className="px-4 py-3.5">Cost / Unit</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#0B0B0B]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[#0B0B0B]/50">
                    No inventory items found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.isLowStock || item.currentStock <= item.minThreshold;
                  const isOut = item.currentStock <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#FAFAF8] transition">
                      <td className="px-5 py-4 font-semibold text-[#0B0B0B]">
                        {item.name}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#FAFAF8] border border-[#E5E7EB] font-mono text-[11px] text-[#0B0B0B]">
                          {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold">
                        <span className={isOut ? "text-rose-600" : isLow ? "text-[#FF6A3D]" : "text-[#0F3D2E]"}>
                          {item.currentStock.toFixed(2)} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#0B0B0B]/60 font-mono">
                        {item.minThreshold.toFixed(2)} {item.unit}
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold text-[#0B0B0B]">
                        {item.costPerUnit ? formatCurrency(item.costPerUnit) : "—"}
                      </td>
                      <td className="px-4 py-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/25">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0F3D2E]/10 text-[#0F3D2E] border border-[#0F3D2E]/20">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <MorphButton
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowAdjustModal(true);
                            }}
                            className="bg-[#0F3D2E]/10 hover:bg-[#0F3D2E]/15 text-[#0F3D2E] font-semibold text-[11px]"
                            title="Adjust Stock"
                          >
                            <ArrowUpDown className="w-3 h-3" />
                            <span>Adjust</span>
                          </MorphButton>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-[#0B0B0B]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B]/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#0F3D2E]">Add Inventory Material</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-[#0B0B0B]/40 hover:text-[#0B0B0B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                  Item / Ingredient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Paneer, Basmati Rice"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="gm">gm (Grams)</option>
                    <option value="ltr">ltr (Liters)</option>
                    <option value="ml">ml (Milliliters)</option>
                    <option value="pcs">pcs (Pieces / Cans)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                    Initial Stock Level *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                    Min. Safety Threshold *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                    Cost Per Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#0B0B0B]/70 hover:bg-[#FAFAF8] transition"
                >
                  Cancel
                </button>
                <MorphButton
                  type="submit"
                  size="sm"
                  className="bg-[#FF6A3D] hover:bg-[#FF5522] text-white text-xs font-semibold shadow-md shadow-[#FF6A3D]/25"
                >
                  <span>Save Material</span>
                </MorphButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B]/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#0F3D2E]">Adjust Stock Quantity</h3>
                <p className="text-xs text-[#0B0B0B]/60">{selectedItem.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedItem(null);
                }}
                className="p-1 rounded-lg text-[#0B0B0B]/40 hover:text-[#0B0B0B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex justify-between items-center text-xs">
              <span className="text-[#0B0B0B]/70">Current Stock:</span>
              <span className="font-bold text-[#0F3D2E]">
                {selectedItem.currentStock.toFixed(2)} {selectedItem.unit}
              </span>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                  Adjustment Type *
                </label>
                <select
                  value={adjustData.type}
                  onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                >
                  <option value="RESTOCK">Restock / Received Shipment (+)</option>
                  <option value="WASTE">Deduct / Wastage &amp; Spoilage (-)</option>
                  <option value="SET">Physical Count Audit (Set Exact)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                  Quantity ({selectedItem.unit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={adjustData.quantity}
                  onChange={(e) => setAdjustData({ ...adjustData, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B0B0B] mb-1">
                  Reason / Memo
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly vendor delivery PO-402, expired batch"
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#FF6A3D] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedItem(null);
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
                  <span>Apply Stock Update</span>
                </MorphButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
