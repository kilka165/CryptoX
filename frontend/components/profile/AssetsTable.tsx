"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url?: string | null;
  valueUSD?: number;
  change24h?: number;
  currentPriceUSD?: number;
}

interface AssetsTableProps {
  assets: Asset[];
  userCurrency?: string;
  onSellClick?: (asset: Asset) => void;
}

// Функция конвертации валюты в символ
const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    RUB: "₽",
    EUR: "€",
    KZT: "₸",
  };
  return symbols[currency] || currency;
};

export function AssetsTable({ assets, userCurrency = "USD", onSellClick }: AssetsTableProps) {
  const { t } = useTranslation();
  const { getRate } = useRates();

  const exchangeRate = getRate(userCurrency);
  const currencySymbol = getCurrencySymbol(userCurrency);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t("profile.assets.title")}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t("profile.assets.asset")}</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t("profile.assets.amount")}</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t("profile.assets.price")}</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t("profile.assets.value", { currency: userCurrency })}</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t("profile.assets.change24h")}</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{t("profile.assets.action")}</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const priceUSD = asset.currentPriceUSD || 0;
              const priceInUserCurrency = priceUSD * exchangeRate;
              const change = asset.change24h ?? 0;
              const totalValueUSD = asset.valueUSD || (asset.amount * priceUSD);
              const totalValueInUserCurrency = totalValueUSD * exchangeRate;

              return (
                <tr
                  key={asset.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                        {asset.symbol.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{asset.symbol.toUpperCase()}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm">{asset.amount.toFixed(8)}</td>
                  <td className="py-4 text-sm font-medium">
                    {currencySymbol}{priceInUserCurrency.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 text-sm font-semibold">
                    {currencySymbol}{totalValueInUserCurrency.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {change >= 0 ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {Math.abs(change).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4">
                    <button 
                      onClick={() => onSellClick?.(asset)}
                      className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg"
                    >
                      {t("profile.assets.sell")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
