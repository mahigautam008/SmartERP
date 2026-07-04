"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import api from "@/lib/api";

type Supplier = {
  id: number;
  name: string;
};

type Item = {
  id: number;
  name: string;
  purchasePrice: number;
};

type Purchase = {
  id: number;
  total: number;
  createdAt: string;
  supplier: Supplier;
};

export default function PurchasesPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const [supplierId, setSupplierId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");

  const loadData = async () => {
    const [supplierRes, itemRes, purchaseRes] = await Promise.all([
      api.get("/suppliers"),
      api.get("/items"),
      api.get("/purchases"),
    ]);

    setSuppliers(supplierRes.data);
    setItems(itemRes.data);
    setPurchases(purchaseRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleItemChange = (value: string) => {
    setItemId(value);

    const item = items.find((item) => item.id === Number(value));
    setPrice(item ? String(item.purchasePrice) : "");
  };

  const total = Number(quantity || 0) * Number(price || 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await api.post("/purchases", {
      supplierId: Number(supplierId),
      items: [
        {
          itemId: Number(itemId),
          quantity: Number(quantity),
          price: Number(price),
        },
      ],
    });

    setSupplierId("");
    setItemId("");
    setQuantity("1");
    setPrice("");

    await loadData();
    alert("Purchase recorded successfully");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Purchases</h1>
        <p className="mt-1 text-slate-500">
          Record stock purchases from suppliers
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <ShoppingCart className="text-indigo-600" size={22} />
          <h2 className="text-lg font-semibold">New Purchase Voucher</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <select
            required
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5"
          >
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>

          <select
            required
            value={itemId}
            onChange={(e) => handleItemChange(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5"
          >
            <option value="">Select item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            required
            min="1"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5"
          />

          <input
            required
            min="0"
            type="number"
            placeholder="Purchase price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5"
          />
        </div>

        <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-500">Voucher Total</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{total.toLocaleString()}
            </p>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={18} />
            Record Purchase
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold">Purchase History</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4">Voucher</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td className="px-6 py-4 font-medium">
                  PUR-{String(purchase.id).padStart(4, "0")}
                </td>

                <td className="px-6 py-4">
                  {purchase.supplier.name}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {new Date(purchase.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  ₹{purchase.total.toLocaleString()}
                </td>
              </tr>
            ))}

            {purchases.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No purchases recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}