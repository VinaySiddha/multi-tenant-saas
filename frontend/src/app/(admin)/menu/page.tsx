"use client";

import React, { useMemo, useState } from "react";
import { Plus, RefreshCw, Search, Leaf, Flame as FlameIcon } from "lucide-react";
import { adminApi, apiErrorMessage } from "@/lib/admin-api";
import { useFetch, useDebouncedValue } from "@/hooks/useFetch";
import { formatCurrency, cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/types";
import {
  Badge,
  Button,
  Card,
  DataTable,
  FieldError,
  Input,
  Label,
  Modal,
  Select,
  Textarea,
  type Column,
} from "@/components/ui";
import { useToast } from "@/components/toast";

type FormState = {
  name: string;
  categoryId: string;
  description: string;
  price: string;
  taxRate: string;
  isVeg: boolean;
  imageUrl: string;
};

const emptyForm: FormState = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  taxRate: "5",
  isVeg: true,
  imageUrl: "",
};

export default function MenuPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const debouncedSearch = useDebouncedValue(search);

  const categories = useFetch<Category[]>(async () => {
    try {
      return await adminApi.getCategories();
    } catch (err) {
      throw new Error(apiErrorMessage(err, "Unable to load menu categories."));
    }
  });

  const items = useFetch<MenuItem[]>(async () => {
    try {
      return await adminApi.getMenuItems();
    } catch (err) {
      throw new Error(apiErrorMessage(err, "Unable to load menu items."));
    }
  });

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [catForm, setCatForm] = useState({ name: "", description: "", displayOrder: "0" });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categoryOptions = categories.data ?? [];

  const filtered = useMemo(() => {
    let rows = [...(items.data ?? [])].sort((a, b) => a.name.localeCompare(b.name));
    if (categoryFilter !== "ALL") rows = rows.filter((i) => i.categoryId === categoryFilter);
    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.categoryName?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [items.data, categoryFilter, debouncedSearch]);

  const openItemModal = () => {
    setForm({ ...emptyForm, categoryId: categoryOptions[0]?.id ?? "" });
    setFormError(null);
    setItemModalOpen(true);
  };

  const createItem = async () => {
    if (!form.name.trim()) return setFormError("Item name is required.");
    if (!form.categoryId) return setFormError("Please choose a category first.");
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return setFormError("Enter a valid price above 0.");
    const taxRate = Number(form.taxRate);
    if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 40)
      return setFormError("Tax rate must be between 0 and 40%.");

    setSaving(true);
    setFormError(null);
    try {
      await adminApi.createMenuItem({
        name: form.name.trim(),
        categoryId: form.categoryId,
        description: form.description.trim() || undefined,
        price,
        taxRate,
        isVeg: form.isVeg,
        imageUrl: form.imageUrl.trim() || undefined,
      });
      toast(`"${form.name}" added to menu`, "success");
      setItemModalOpen(false);
      items.refresh();
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not create menu item."));
    } finally {
      setSaving(false);
    }
  };

  const createCategory = async () => {
    if (!catForm.name.trim()) return setFormError("Category name is required.");
    setSaving(true);
    try {
      await adminApi.createCategory({
        name: catForm.name.trim(),
        description: catForm.description.trim() || undefined,
        displayOrder: Number(catForm.displayOrder) || 0,
      });
      toast(`Category "${catForm.name}" created`, "success");
      setCatModalOpen(false);
      setCatForm({ name: "", description: "", displayOrder: "0" });
      categories.refresh();
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not create category."));
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<MenuItem>[] = [
    {
      key: "name",
      header: "Item",
      render: (i) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-4 h-4 rounded border-[1.5px] flex items-center justify-center text-[9px] font-bold shrink-0",
              i.isVeg
                ? "border-emerald-600 text-emerald-600"
                : "border-rose-600 text-rose-600"
            )}
            title={i.isVeg ? "Vegetarian" : "Non-vegetarian"}
          >
            ●
          </span>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{i.name}</p>
            {i.description && (
              <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{i.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (i) => <Badge tone="indigo">{i.categoryName ?? "—"}</Badge>,
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      render: (i) => (
        <span className="font-bold tabular-nums">{formatCurrency(Number(i.price ?? 0))}</span>
      ),
    },
    {
      key: "tax",
      header: "Tax",
      align: "right",
      render: (i) => <span className="text-xs tabular-nums">{i.taxRate}%</span>,
    },
    {
      key: "availability",
      header: "Availability",
      render: (i) =>
        i.isAvailable ? (
          <Badge tone="success">Available</Badge>
        ) : (
          <Badge tone="danger">Sold out</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Menu Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {items.data?.length ?? 0} items across {categoryOptions.length} categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { categories.refresh(); items.refresh(); }} loading={items.loading}>
            {!items.loading && <RefreshCw className="w-3.5 h-3.5" />} Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { setFormError(null); setCatModalOpen(true); }}>
            <Plus className="w-3.5 h-3.5" /> Category
          </Button>
          <Button size="sm" onClick={openItemModal} disabled={categoryOptions.length === 0}>
            <Plus className="w-3.5 h-3.5" /> Add item
          </Button>
        </div>
      </div>

      {categoryOptions.length === 0 && !categories.loading && (
        <Card className="p-4 border-amber-300 bg-amber-50/60 dark:bg-amber-950/30">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
            You need at least one category before adding menu items. Create your first category to
            get started.
          </p>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="pl-9"
              aria-label="Search menu"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="sm:w-52"
            aria-label="Filter by category"
          >
            <option value="ALL">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(i) => i.id}
        loading={items.loading}
        error={items.error ?? categories.error}
        onRetry={() => { categories.refresh(); items.refresh(); }}
        emptyTitle="No menu items found"
        emptyHint="Add dishes so customers can order from POS and QR menus."
      />

      {/* Add item modal */}
      <Modal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        title="Add menu item"
        width="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setItemModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={createItem}>
              Add to menu
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="mi-name" required>
              Item name
            </Label>
            <Input
              id="mi-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Paneer Tikka Masala"
              maxLength={80}
            />
          </div>
          <div>
            <Label htmlFor="mi-category" required>
              Category
            </Label>
            <Select
              id="mi-category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Dietary type</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, isVeg: true })}
                className={cn(
                  "flex-1 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition",
                  form.isVeg
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40"
                    : "border-slate-300 text-slate-500 dark:border-slate-700"
                )}
              >
                <Leaf className="w-3.5 h-3.5" /> Veg
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, isVeg: false })}
                className={cn(
                  "flex-1 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition",
                  !form.isVeg
                    ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40"
                    : "border-slate-300 text-slate-500 dark:border-slate-700"
                )}
              >
                <FlameIcon className="w-3.5 h-3.5" /> Non-veg
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="mi-price" required>
              Price (₹)
            </Label>
            <Input
              id="mi-price"
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="285.00"
            />
          </div>
          <div>
            <Label htmlFor="mi-tax" required>
              Tax rate (%)
            </Label>
            <Input
              id="mi-tax"
              type="number"
              min={0}
              max={40}
              step="0.5"
              value={form.taxRate}
              onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="mi-desc">Description</Label>
            <Textarea
              id="mi-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short, appetising description shown on the QR menu"
              maxLength={240}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="mi-img">Image URL (optional)</Label>
            <Input
              id="mi-img"
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://cdn.example.com/dishes/paneer.jpg"
            />
          </div>
          <div className="sm:col-span-2">
            <FieldError>{formError}</FieldError>
          </div>
        </div>
      </Modal>

      {/* Add category modal */}
      <Modal
        open={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title="Create category"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCatModalOpen(false)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={createCategory}>
              Create category
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="cat-name" required>
              Name
            </Label>
            <Input
              id="cat-name"
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              placeholder="e.g. Starters, Main Course, Beverages"
              maxLength={50}
            />
          </div>
          <div>
            <Label htmlFor="cat-desc">Description</Label>
            <Input
              id="cat-desc"
              value={catForm.description}
              onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
              maxLength={140}
            />
          </div>
          <div>
            <Label htmlFor="cat-order">Display order</Label>
            <Input
              id="cat-order"
              type="number"
              min={0}
              value={catForm.displayOrder}
              onChange={(e) => setCatForm({ ...catForm, displayOrder: e.target.value })}
            />
          </div>
          <FieldError>{formError}</FieldError>
        </div>
      </Modal>
    </div>
  );
}
