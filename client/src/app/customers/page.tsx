"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import api from "@/lib/api";

type Customer = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  outstanding: number;
};

const emptyForm = {
  name: "",
  phone: "",
  address: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadCustomers = async () => {
    const response = await api.get("/customers");
    setCustomers(response.data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/customers/${editingId}`, form);
    } else {
      await api.post("/customers", form);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setForm({
      name: customer.name,
      phone: customer.phone || "",
      address: customer.address || "",
    });

    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this customer?")) return;

    await api.delete(`/customers/${id}`);
    loadCustomers();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="mt-1 text-slate-500">
            Manage customer accounts and outstanding balances
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
          Add Customer
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Customer" : "New Customer"}
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              required
              placeholder="Customer name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
            />

            <input
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
            />

            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            {editingId ? "Update Customer" : "Save Customer"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Outstanding</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 font-medium text-slate-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {customer.phone || "—"}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {customer.address || "—"}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  ₹{customer.outstanding.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}