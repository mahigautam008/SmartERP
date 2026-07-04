import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "SmartERP",
  description: "Smart Business Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Sidebar />

        <div className="ml-64 min-h-screen">
          <Header />
          <main className="p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}