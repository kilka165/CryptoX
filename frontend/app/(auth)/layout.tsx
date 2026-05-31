import React from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
