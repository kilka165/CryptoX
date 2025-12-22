"use client";

import Link from "next/link";
import { CreditCard, ArrowUpRight } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

export function BalanceCard({ balance, currency }: BalanceCardProps) {
  const { convertedAmount, loading } = useCurrencyConverter(Number(balance), currency);
  const ratesLoading = loading;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>

      <div className="relative z-10">
        <p className="text-blue-100 mb-1">Общий баланс</p>
        <div className="flex items-end gap-4 mb-6">
          <h1 className="text-4xl font-bold">
            {ratesLoading ? "..." : convertedAmount}
          </h1>

          {currency !== "USD" && (
            <span className="text-sm opacity-70 mb-2 font-mono">
              (${Number(balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })} USD)
            </span>
          )}

          <span className="bg-white/20 px-2 py-1 rounded-lg text-sm font-medium flex items-center gap-1 mb-1">
            <ArrowUpRight size={14} /> 12.5%
          </span>
        </div>

        <div className="flex gap-4">
          <Link href="/deposit">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
              <CreditCard size={18} /> Пополнить
            </button>
          </Link>
          <Link href="/withdraw">
          <button className="bg-blue-700/50 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors backdrop-blur-sm flex items-center gap-2 border border-white/10">
            <ArrowUpRight size={18} /> Вывести
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
