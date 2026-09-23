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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Package className="w-7 h-7 text-indigo-600" />
            Inventory & Stock Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track live raw material stocks, safety thresholds, ingredient consumption, and supplier costs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MorphButton
            size="sm"
            onClick={fetchInventory}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </MorphButton>
          <MorphButton
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md hover:shadow-indigo-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </MorphButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Tracked Items</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalItems}</span>
            <span className="text-xs font-semibold text-slate-500">Raw materials</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Low Stock Warnings</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${lowStockCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"}`}>
              {lowStockCount}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Needs restock</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Out of Stock</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${outOfStockCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-100"}`}>
              {outOfStockCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">Depleted</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Estimated Stock Value</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalValuation)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Asset Value</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock items (e.g. Paneer, Rice)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(["ALL", "LOW_STOCK", "IN_STOCK"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterTab === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    No inventory items found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.isLowStock || item.currentStock <= item.minThreshold;
                  const isOut = item.currentStock <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">
                          {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold">
                        <span className={isOut ? "text-rose-600 dark:text-rose-400" : isLow ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"}>
                          {item.currentStock.toFixed(2)} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500 font-mono">
                        {item.minThreshold.toFixed(2)} {item.unit}
                      </td>
                      <td className="px-4 py-4 font-mono">
                        {item.costPerUnit ? formatCurrency(item.costPerUnit) : "—"}
                      </td>
                      <td className="px-4 py-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
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
                            className="bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]"
                            title="Adjust Stock"
                          >
                            <ArrowUpDown className="w-3 h-3" />
                            <span>Adjust</span>
                          </MorphButton>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Add Inventory Material</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item / Ingredient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Paneer, Basmati Rice"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="gm">gm (Grams)</option>
                    <option value="ltr">ltr (Liters)</option>
                    <option value="ml">ml (Milliliters)</option>
                    <option value="pcs">pcs (Pieces / Cans)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock Level *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min. Safety Threshold *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Per Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <MorphButton
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Adjust Stock Quantity</h3>
                <p className="text-xs text-slate-500">{selectedItem.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedItem(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="text-slate-500">Current Stock:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {selectedItem.currentStock.toFixed(2)} {selectedItem.unit}
              </span>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adjustment Type *
                </label>
                <select
                  value={adjustData.type}
                  onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="RESTOCK">Restock / Received Shipment (+)</option>
                  <option value="WASTE">Deduct / Wastage & Spoilage (-)</option>
                  <option value="SET">Physical Count Audit (Set Exact)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity ({selectedItem.unit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={adjustData.quantity}
                  onChange={(e) => setAdjustData({ ...adjustData, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason / Memo
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly vendor delivery PO-402, expired batch"
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <MorphButton
                  type="submit"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md"
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
