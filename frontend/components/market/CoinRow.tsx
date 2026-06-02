"use client";

import React from "react";
import { Coin } from "@/types/coin";
import { CoinIcon } from "@/components/market/CoinIcon";
import { getCurrencySymbol } from "@/lib/currencies";
import { useTranslation } from "react-i18next";

interface CoinRowProps {
  coin: Coin;
  index: number;
  userCurrency: string;
  exchangeRate: number;
  onBuy: (coin: Coin) => void;
  formatNumber: (num: number) => string;
}

export function CoinRow({ coin, index, userCurrency, exchangeRate, onBuy, formatNumber }: CoinRowProps) {
  const { t } = useTranslation();
  const priceChange = coin.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;
  
  // Конвертируем цену в выбранную валюту
  const convertedPrice = coin.current_price * exchangeRate;

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-3 sm:px-6 py-4 text-slate-500 font-medium hidden sm:table-cell">{index}</td>
      <td className="px-3 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <CoinIcon src={coin.image} symbol={coin.symbol} className="w-8 h-8" />
          <div className="min-w-0">
            <div className="font-semibold truncate">{coin.name}</div>
            <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 text-right font-semibold whitespace-nowrap">
        {convertedPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })}{" "}
        {getCurrencySymbol(userCurrency)}
      </td>
      <td className="px-3 sm:px-6 py-4 text-right">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
            isPositive
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {priceChange.toFixed(2)}%
        </span>
      </td>
      <td className="px-3 sm:px-6 py-4 text-right text-slate-600 dark:text-slate-400 hidden lg:table-cell whitespace-nowrap">
        {formatNumber(coin.total_volume ?? 0)} {getCurrencySymbol(userCurrency)}
      </td>
      <td className="px-3 sm:px-6 py-4 text-right text-slate-600 dark:text-slate-400 hidden xl:table-cell whitespace-nowrap">
        {formatNumber((coin.market_cap ?? 0) * exchangeRate)} {getCurrencySymbol(userCurrency)}
      </td>

      <td className="px-3 sm:px-6 py-4 text-right">
        <button
          onClick={() => onBuy(coin)}
          className="px-3 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("market.buy")}
        </button>
      </td>
    </tr>
  );
}
