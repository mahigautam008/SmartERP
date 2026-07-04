"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "@/lib/api";

type Item = {
  id: number;
  name: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  gst: number;
  stock: number;
};

const emptyForm = {
  name: "",
  sku: "",
  purchasePrice: "",
  sellingPrice: "",
  gst: "18",
  stock: "0",
};

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadItems = async () => {
    const res = await api.get("/items");
    setItems(res.data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/items/${editingId}`, form);
    } else {
      await api.post("/items", form);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadItems();
  };

  const handleEdit = (item: Item) => {
    setForm({
      name: item.name,
      sku: item.sku,
      purchasePrice: String(item.purchasePrice),
      sellingPrice: String(item.sellingPrice),
      gst: String(item.gst),
      stock: String(item.stock),
    });

    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/items/${id}`);
    loadItems();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
          <p className="mt-1 text-slate-500">
            Manage products, pricing and live stock levels
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Item" : "New Item"}
            </h2>

            <button type="button" onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              required
              placeholder="Item name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
            />

            <input
              required
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
            />

            <input
              required
              type="number"
              placeholder="Purchase price"
              value={form.purchasePrice}
              onChange={(e) =>
                setForm({ ...form, purchasePrice: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-4 py-2.5"
            />

            <input
              required
              type="number"
              placeholder="Selling price"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({ ...form, sellingPrice: e.target.value })
              }
              className="rounded-lg border border-slate-300 px-4 py-2.5"
            />

            <input
              type="number"
              placeholder="GST %"
              value={form.gst}
              onChange={(e) => setForm({ ...form, gst: e.target.value })}
              className="rounded-lg border border-slate-300 px-4 py-2.5"
            />

            <input
              type="number"
              placeholder="Opening stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="rounded-lg border border-slate-300 px-4 py-2.5"
            />
          </div>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white"
          >
            {editingId ? "Update Item" : "Save Item"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Purchase</th>
              <th className="px-6 py-4">Selling</th>
              <th className="px-6 py-4">GST</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.sku}</td>
                <td className="px-6 py-4">
                  ₹{item.purchasePrice.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  ₹{item.sellingPrice.toLocaleString()}
                </td>
                <td className="px-6 py-4">{item.gst}%</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      item.stock <= 5
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {item.stock} units
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No inventory items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}