"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Truck,
  Package,
  IndianRupee,
  ShoppingCart,
  Receipt,
} from "lucide-react";
import api from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    suppliers: 0,
    items: 0,
    stock: 0,
    purchases: 0,
    sales: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [customers, suppliers, items, purchases, sales] =
          await Promise.all([
            api.get("/customers"),
            api.get("/suppliers"),
            api.get("/items"),
            api.get("/purchases"),
            api.get("/sales"),
          ]);

        setStats({
          customers: customers.data.length,
          suppliers: suppliers.data.length,
          items: items.data.length,
          stock: items.data.reduce(
            (sum: number, item: { stock: number }) => sum + item.stock,
            0
          ),
          purchases: purchases.data.reduce(
            (sum: number, purchase: { total: number }) =>
              sum + purchase.total,
            0
          ),
          sales: sales.data.reduce(
            (sum: number, sale: { total: number }) => sum + sale.total,
            0
          ),
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
    },
    {
      title: "Suppliers",
      value: stats.suppliers,
      icon: Truck,
    },
    {
      title: "Inventory Items",
      value: stats.items,
      icon: Package,
    },
    {
      title: "Units in Stock",
      value: stats.stock,
      icon: Package,
    },
    {
      title: "Total Purchases",
      value: `₹${stats.purchases.toLocaleString()}`,
      icon: ShoppingCart,
    },
    {
      title: "Total Sales",
      value: `₹${stats.sales.toLocaleString()}`,
      icon: Receipt,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Overview of your business performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {value}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Icon size={25} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Business Summary
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Purchase Value</p>
            <p className="mt-1 text-xl font-semibold">
              ₹{stats.purchases.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Sales Value</p>
            <p className="mt-1 text-xl font-semibold">
              ₹{stats.sales.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Gross Difference</p>
            <p className="mt-1 text-xl font-semibold">
              ₹{(stats.sales - stats.purchases).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}