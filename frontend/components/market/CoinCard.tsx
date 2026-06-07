"use client";

import React from "react";
import Link from "next/link";
import { Coin } from "@/types/coin";
import { CoinIcon } from "@/components/market/CoinIcon";
import { getCurrencySymbol } from "@/lib/currencies";
import { useTranslation } from "react-i18next";

interface CoinCardProps {
  coin: Coin;
  /** Порядковый номер (#). Не передаётся на странице рынка — скрыт. */
  index?: number;
  userCurrency: string;
  exchangeRate: number;
  onBuy: (coin: Coin) => void;
}

// Мобильный вид строки рынка — карточка в стиле профиля.
// Без объёма и капитализации: только монета, цена, изменение и кнопка торговли.
export function CoinCard({ coin, index, userCurrency, exchangeRate, onBuy }: CoinCardProps) {
  const { t } = useTranslation();
  const priceChange = coin.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;
  const convertedPrice = coin.current_price * exchangeRate;

  return (
    <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-slate-300 dark:border-slate-800 p-3">
      {typeof index === "number" && (
        <span className="hidden sm:block text-xs text-slate-400 font-medium w-5 text-center shrink-0">{index}</span>
      )}

      <Link href={`/market/${coin.id}`} className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 group">
        <CoinIcon src={coin.image} symbol={coin.symbol} className="w-9 h-9" />
        <div className="min-w-0">
          <div className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">{coin.name}</div>
          <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
        </div>
      </Link>

      <div className="flex flex-col items-end shrink-0">
        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
          {convertedPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          })}{" "}
          {getCurrencySymbol(userCurrency)}
        </span>
        <span
          className={`text-xs font-semibold ${
            isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {priceChange.toFixed(2)}%
        </span>
      </div>

      <button
        onClick={() => onBuy(coin)}
        className="px-2.5 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0"
      >
        {t("market.trade")}
      </button>
    </div>
  );
}
