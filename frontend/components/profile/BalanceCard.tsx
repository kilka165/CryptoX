"use client";

import Link from "next/link";
import { CreditCard, ArrowUpRight } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useTranslation } from "react-i18next";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

export function BalanceCard({ balance, currency }: BalanceCardProps) {
  const { t } = useTranslation();
  const { convertedAmount, loading } = useCurrencyConverter(Number(balance), currency);
  const ratesLoading = loading;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>

      <div className="relative z-10">
        <p className="text-blue-100 mb-1">{t("profile.balance.total")}</p>
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold break-all leading-tight">
            {ratesLoading ? "..." : convertedAmount}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link href="/deposit" className="flex-1 sm:flex-initial">
            <button className="w-full bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
              <CreditCard size={18} /> {t("profile.balance.deposit")}
            </button>
          </Link>
          <Link href="/withdraw" className="flex-1 sm:flex-initial">
          <button className="w-full bg-blue-700/50 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors backdrop-blur-sm flex items-center justify-center gap-2 border border-white/10">
            <ArrowUpRight size={18} /> {t("profile.balance.withdraw")}
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
