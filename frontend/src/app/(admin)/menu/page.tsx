"use client";

import React, { useState, useEffect } from "react";
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  Percent, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Tag
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { MenuItem, Category } from "@/types";

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: 0,
    costPrice: 0,
    taxRate: 5,
    isVeg: true,
    isAvailable: true,
    preparationTimeMinutes: 15
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    displayOrder: 1
  });

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const [catRes, itemRes] = await Promise.all([
        apiClient.get("/menu/categories"),
        apiClient.get("/menu/items")
      ]);
      if (catRes.data?.data) {
        setCategories(catRes.data.data);
      } else {
        setCategories([]);
      }
      if (itemRes.data?.data) {
        setItems(itemRes.data.data);
      } else {
        setItems([]);
      }
    } catch {
      setCategories([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const newStatus = !item.isAvailable;
    try {
      await apiClient.patch(`/menu/items/${item.id}/availability?available=${newStatus}`);
      setItems(items.map(it => it.id === item.id ? { ...it, isAvailable: newStatus } : it));
    } catch {
      setItems(items.map(it => it.id === item.id ? { ...it, isAvailable: newStatus } : it));
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: itemForm.name,
        categoryId: itemForm.categoryId || (categories[0]?.id ?? ""),
        description: itemForm.description,
        price: Number(itemForm.price),
        costPrice: Number(itemForm.costPrice),
        taxRate: Number(itemForm.taxRate),
        isVeg: itemForm.isVeg,
        isAvailable: itemForm.isAvailable,
        preparationTimeMinutes: Number(itemForm.preparationTimeMinutes)
      };

      if (editingItem) {
        const res = await apiClient.put(`/menu/items/${editingItem.id}`, payload);
        const updated = res.data?.data || { ...editingItem, ...payload, categoryName: categories.find(c => c.id === payload.categoryId)?.name };
        setItems(items.map(it => it.id === editingItem.id ? updated : it));
      } else {
        const res = await apiClient.post("/menu/items", payload);
        const created = res.data?.data || {
          id: String(Date.now()),
          tenantId: "demo",
          ...payload,
          categoryName: categories.find(c => c.id === payload.categoryId)?.name
        };
        setItems([...items, created]);
      }
      setShowItemModal(false);
      setEditingItem(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save menu item");
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/menu/categories", {
        name: categoryForm.name,
        description: categoryForm.description,
        displayOrder: Number(categoryForm.displayOrder)
      });
      const created = res.data?.data || {
        id: String(Date.now()),
        tenantId: "demo",
        name: categoryForm.name,
        description: categoryForm.description,
        displayOrder: Number(categoryForm.displayOrder),
        isActive: true
      };
      setCategories([...categories, created]);
      setShowCategoryModal(false);
      setCategoryForm({ name: "", description: "", displayOrder: categories.length + 1 });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await apiClient.delete(`/menu/items/${id}`);
      setItems(items.filter(it => it.id !== id));
    } catch {
      setItems(items.filter(it => it.id !== id));
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      categoryId: item.categoryId,
      description: item.description || "",
      price: item.price,
      costPrice: item.costPrice || 0,
      taxRate: item.taxRate || 5,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      preparationTimeMinutes: item.preparationTimeMinutes || 15
    });
    setShowItemModal(true);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "ALL" || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-indigo-600" />
            Menu Catalog & Pricing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your food & drink catalog, recipes, margins, dynamic 86-ing (stock availability), and category hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMenuData}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            <Layers className="w-4 h-4" /> Add Category
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setItemForm({
                name: "",
                categoryId: categories[0]?.id || "",
                description: "",
                price: 0,
                costPrice: 0,
                taxRate: 5,
                isVeg: true,
                isAvailable: true,
                preparationTimeMinutes: 15
              });
              setShowItemModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu dishes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === "ALL"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            All Categories ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.name} ({items.filter(i => i.categoryId === cat.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const margin = item.costPrice && item.price > 0 ? (((item.price - item.costPrice) / item.price) * 100).toFixed(0) : null;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between transition ${
                item.isAvailable
                  ? "border-slate-200 dark:border-slate-800"
                  : "border-slate-300 dark:border-slate-800 opacity-60 bg-slate-50/50"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 ${
                        item.isVeg ? "border-emerald-600 text-emerald-600" : "border-rose-600 text-rose-600"
                      }`}
                      title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-emerald-600" : "bg-rose-600"}`} />
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.name}</h3>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.categoryName || categories.find(c => c.id === item.categoryId)?.name || "Dish"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {item.description || "No description provided."}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(item.price)}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    {margin && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {margin}% margin
                      </span>
                    )}
                    <span>• GST {item.taxRate || 5}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.preparationTimeMinutes || 15}m prep</span>
                  </div>

                  {/* Actions & 86 Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        item.isAvailable
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400"
                      }`}
                      title={item.isAvailable ? "Click to 86 / mark Out of Stock" : "Click to mark Available"}
                    >
                      {item.isAvailable ? "In Stock" : "86'd (Out)"}
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Modal (Create/Edit) */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {editingItem ? "Edit Menu Dish" : "Add New Menu Dish"}
              </h3>
              <button
                onClick={() => {
                  setShowItemModal(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paneer Butter Masala"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dietary Classification
                  </label>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, isVeg: true })}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        itemForm.isVeg ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      🌱 Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, isVeg: false })}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        !itemForm.isVeg ? "bg-rose-50 border-rose-500 text-rose-700" : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      🍗 Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, preparation notes, flavor profile..."
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={itemForm.costPrice}
                    onChange={(e) => setItemForm({ ...itemForm, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={itemForm.preparationTimeMinutes}
                    onChange={(e) => setItemForm({ ...itemForm, preparationTimeMinutes: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowItemModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Add Menu Category</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desserts, Woodfired Pizzas"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief note about this section"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={categoryForm.displayOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
