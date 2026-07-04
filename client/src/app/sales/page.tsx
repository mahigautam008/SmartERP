"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Receipt } from "lucide-react";
import api from "@/lib/api";

type Customer = {
  id: number;
  name: string;
};

type Item = {
  id: number;
  name: string;
  sellingPrice: number;
  stock: number;
};

type Sale = {
  id: number;
  invoiceNo: string;
  total: number;
  createdAt: string;
  customer: Customer;
};

export default function SalesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [customerRes, itemRes, saleRes] = await Promise.all([
      api.get("/customers"),
      api.get("/items"),
      api.get("/sales"),
    ]);

    setCustomers(customerRes.data);
    setItems(itemRes.data);
    setSales(saleRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedItem = items.find(
    (item) => item.id === Number(itemId)
  );

  const handleItemChange = (value: string) => {
    setItemId(value);

    const item = items.find((item) => item.id === Number(value));
    setPrice(item ? String(item.sellingPrice) : "");
  };

  const total = Number(quantity || 0) * Number(price || 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/sales", {
        customerId: Number(customerId),
        items: [
          {
            itemId: Number(itemId),
            quantity: Number(quantity),
            price: Number(price),
          },
        ],
      });

      setCustomerId("");
      setItemId("");
      setQuantity("1");
      setPrice("");
      setMessage("Sale recorded successfully");

      await loadData();
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Unable to record sale"
      );
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Sales</h1>
        <p className="mt-1 text-slate-500">
          Create sales invoices and manage stock automatically
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-2">
          <Receipt className="text-indigo-600" size={22} />
          <h2 className="text-lg font-semibold">New Sales Invoice</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <select
            required
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5"
          >
            <option value="">Select customer</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
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
                {item.name} ({item.stock} in stock)
              </option>
            ))}
          </select>

          <input
            required
            min="1"
            max={selectedItem?.stock}
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
            placeholder="Selling price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5"
          />
        </div>

        {selectedItem && (
          <p className="mt-3 text-sm text-slate-500">
            Available stock:{" "}
            <span className="font-semibold text-slate-800">
              {selectedItem.stock} units
            </span>
          </p>
        )}

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-500">Invoice Total</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{total.toLocaleString()}
            </p>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create Invoice
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold">Sales History</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 font-medium text-indigo-600">
                  {sale.invoiceNo}
                </td>

                <td className="px-6 py-4">
                  {sale.customer.name}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {new Date(sale.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="px-6 py-4 text-right font-semibold">
                  ₹{sale.total.toLocaleString()}
                </td>
              </tr>
            ))}

            {sales.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No sales recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}