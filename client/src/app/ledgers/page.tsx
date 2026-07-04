"use client";

import { useEffect, useState } from "react";
import { BookOpen, User, Truck } from "lucide-react";
import api from "@/lib/api";

type Party = {
  id: number;
  name: string;
};
type Transaction = {
  id: number;
  total: number;
  createdAt: string;
  invoiceNo?: string;
};
type LedgerData = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  outstanding: number;
  sales?: Transaction[];
  purchases?: Transaction[];
};

export default function LedgersPage() {
  const [type, setType] = useState<"customer" | "supplier">("customer");
  const [customers, setCustomers] = useState<Party[]>([]);
  const [suppliers, setSuppliers] = useState<Party[]>([]);
  const [partyId, setPartyId] = useState("");
  const [ledger, setLedger] = useState<LedgerData | null>(null);

  useEffect(() => {
    const loadParties = async () => {
      const [customerRes, supplierRes] = await Promise.all([
        api.get("/customers"),
        api.get("/suppliers"),
      ]);

      setCustomers(customerRes.data);
      setSuppliers(supplierRes.data);
    };

    loadParties();
  }, []);

  const changeType = (newType: "customer" | "supplier") => {
    setType(newType);
    setPartyId("");
    setLedger(null);
  };

  const loadLedger = async (id: string) => {
    setPartyId(id);

    if (!id) {
      setLedger(null);
      return;
    }

    const res = await api.get(`/ledgers/${type}/${id}`);
    setLedger(res.data);
  };

  const transactions =
    type === "customer" ? ledger?.sales || [] : ledger?.purchases || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Ledgers</h1>
        <p className="mt-1 text-slate-500">
          View party balances and transaction history
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex gap-3">
          <button
            onClick={() => changeType("customer")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium ${
              type === "customer"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <User size={18} />
            Customer Ledger
          </button>

          <button
            onClick={() => changeType("supplier")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium ${
              type === "supplier"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <Truck size={18} />
            Supplier Ledger
          </button>
        </div>

        <select
          value={partyId}
          onChange={(e) => loadLedger(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 md:w-96"
        >
          <option value="">
            Select {type === "customer" ? "customer" : "supplier"}
          </option>

          {(type === "customer" ? customers : suppliers).map((party) => (
            <option key={party.id} value={party.id}>
              {party.name}
            </option>
          ))}
        </select>
      </div>

      {ledger ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Party Name</p>
              <p className="mt-2 text-xl font-bold">{ledger.name}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="mt-2 text-xl font-bold">
                {ledger.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                {type === "customer" ? "Receivable" : "Payable"}
              </p>
              <p className="mt-2 text-xl font-bold text-indigo-600">
                ₹{ledger.outstanding.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-4">
              <BookOpen size={20} className="text-indigo-600" />
              <h2 className="font-semibold">Transaction History</h2>
            </div>

            <table className="w-full">
              <thead className="bg-slate-50 text-left text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    {type === "customer" ? "Invoice" : "Voucher"}
                  </th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 font-medium">
                      {transaction.invoiceNo ||
  `PUR-${String(transaction.id).padStart(4, "0")}`}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold">
                      ₹{transaction.total.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <BookOpen className="mx-auto text-slate-300" size={42} />
          <p className="mt-3 text-slate-500">
            Select a party to view ledger
          </p>
        </div>
      )}
    </div>
  );
}