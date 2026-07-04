"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  ShoppingCart,
  Receipt,
  BookOpen,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Purchases", href: "/purchases", icon: ShoppingCart },
  { name: "Sales", href: "/sales", icon: Receipt },
  { name: "Ledgers", href: "/ledgers", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white p-5">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">SmartERP</h1>
        <p className="text-xs text-slate-400">Business Management</p>
      </div>

      <nav className="space-y-2">
        {menu.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
              pathname === href
                ? "bg-indigo-600"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Icon size={19} />
            {name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}