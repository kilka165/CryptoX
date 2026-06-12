"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";
import { getCurrencySymbol } from "@/lib/currencies";

interface PortfolioValueProps {
  // Суммарная стоимость портфеля в USD (считается родителем из единого источника цен)
  totalValueUSD?: number;
  userCurrency?: string;
  loading?: boolean;
}

export function PortfolioValue({
  totalValueUSD = 0,
  userCurrency = "USD",
  loading = false,
}: PortfolioValueProps) {
  const { t } = useTranslation();
  const { getRate } = useRates();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
          <div className="h-8 bg-white/20 rounded w-48"></div>
        </div>
      </div>
    );
  }

  const exchangeRate = getRate(userCurrency);
  const valueInUserCurrency = totalValueUSD * exchangeRate;
  const currencySymbol = getCurrencySymbol(userCurrency);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">{t("profile.portfolio.value")}</span>
        <TrendingUp size={20} className="opacity-80" />
      </div>
      <div className="text-3xl font-bold">
        {valueInUserCurrency.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        {currencySymbol}
      </div>
    </div>
  );
}
