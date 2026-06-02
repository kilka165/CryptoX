"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CoinIcon } from "@/components/market/CoinIcon";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url?: string | null;
  // Правильные символ/картинка монеты (символ актива бывает «битый»)
  iconSymbol?: string;
  iconSrc?: string | null;
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

  // Пока правильный символ монеты не определён — нейтральная заглушка,
  // чтобы в первые секунды не мелькал чужой логотип (символ актива бывает «битый»).
  const renderIcon = (asset: Asset, sizeClass: string) => {
    if (!asset.iconSymbol) {
      return (
        <div
          className={`${sizeClass} rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase shrink-0`}
        >
          {asset.symbol.slice(0, 3).toUpperCase()}
        </div>
      );
    }
    return (
      <CoinIcon src={asset.iconSrc ?? asset.logo_url} symbol={asset.iconSymbol} className={sizeClass} />
    );
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t("profile.assets.title")}</h3>
      </div>

      {/* Десктоп: таблица */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3 pr-4 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.asset")}</th>
              <th className="pb-3 pr-4 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.amount")}</th>
              <th className="pb-3 pr-4 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.price")}</th>
              <th className="pb-3 pr-4 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.value", { currency: userCurrency })}</th>
              <th className="pb-3 pr-4 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.change24h")}</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.action")}</th>
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
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      {renderIcon(asset, "w-8 h-8")}
                      <div>
                        <div className="font-semibold text-sm">{asset.symbol.toUpperCase()}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm whitespace-nowrap">{asset.amount.toFixed(8)}</td>
                  <td className="py-4 pr-4 text-sm font-medium whitespace-nowrap">
                    {currencySymbol}{priceInUserCurrency.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 pr-4 text-sm font-semibold whitespace-nowrap">
                    {currencySymbol}{totalValueInUserCurrency.toFixed(2)}
                  </td>
                  <td className="py-4 pr-4">
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

      {/* Мобильный/планшет: карточки */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {assets.map((asset) => {
          const priceUSD = asset.currentPriceUSD || 0;
          const priceInUserCurrency = priceUSD * exchangeRate;
          const change = asset.change24h ?? 0;
          const totalValueUSD = asset.valueUSD || (asset.amount * priceUSD);
          const totalValueInUserCurrency = totalValueUSD * exchangeRate;

          return (
            <div
              key={asset.id}
              className="rounded-xl border border-slate-300 dark:border-slate-800 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {renderIcon(asset, "w-9 h-9")}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{asset.symbol.toUpperCase()}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">{asset.name}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-sm font-medium shrink-0 ${
                    change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(change).toFixed(2)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                <span className="text-slate-500 dark:text-slate-400">{t("profile.assets.amount")}</span>
                <span className="text-right break-all">{asset.amount.toFixed(8)}</span>

                <span className="text-slate-500 dark:text-slate-400">{t("profile.assets.price")}</span>
                <span className="text-right font-medium">
                  {currencySymbol}{priceInUserCurrency.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>

                <span className="text-slate-500 dark:text-slate-400">{t("profile.assets.value", { currency: userCurrency })}</span>
                <span className="text-right font-semibold">
                  {currencySymbol}{totalValueInUserCurrency.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => onSellClick?.(asset)}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg"
              >
                {t("profile.assets.sell")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
