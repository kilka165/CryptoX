"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coin } from "@/types/coin";
import { CoinIcon } from "@/components/market/CoinIcon";
import { getCurrencySymbol } from "@/lib/currencies";
import { useTranslation } from "react-i18next";

interface CoinRowProps {
  coin: Coin;
  /** Порядковый номер (#). Не передаётся на странице рынка — колонка скрыта. */
  index?: number;
  userCurrency: string;
  exchangeRate: number;
  onBuy: (coin: Coin) => void;
  formatNumber: (num: number) => string;
  /**
   * Включает крупные невидимые зоны клика: вся ячейка монеты ведёт на «Подробнее»,
   * ячейки с данными открывают «Торговать». В интерактивном режиме кнопки действий выровнены по центру колонки.
   */
  interactive?: boolean;
}

export function CoinRow({ coin, index, userCurrency, exchangeRate, onBuy, formatNumber, interactive }: CoinRowProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const priceChange = coin.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;

  // Конвертируем цену в выбранную валюту
  const convertedPrice = coin.current_price * exchangeRate;

  // Невидимые зоны клика (только когда interactive): монета → «Подробнее», данные → «Торговать».
  const goDetails = () => router.push(`/market/${coin.id}`);
  const clickable = interactive ? "cursor-pointer" : "";

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      {typeof index === "number" && (
        <td className="px-3 sm:px-6 py-4 text-slate-500 font-medium hidden sm:table-cell">{index}</td>
      )}
      <td onClick={interactive ? goDetails : undefined} className={`px-3 sm:px-6 py-4 ${clickable}`}>
        <Link
          href={`/market/${coin.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 group w-full"
        >
          <CoinIcon src={coin.image} symbol={coin.symbol} className="w-8 h-8" />
          <div className="min-w-0">
            <div className="font-semibold truncate group-hover:text-blue-600 transition-colors">{coin.name}</div>
            <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
          </div>
        </Link>
      </td>
      <td onClick={interactive ? () => onBuy(coin) : undefined} className={`px-3 sm:px-6 py-4 text-right font-semibold whitespace-nowrap ${clickable}`}>
        {convertedPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })}{" "}
        {getCurrencySymbol(userCurrency)}
      </td>
      <td onClick={interactive ? () => onBuy(coin) : undefined} className={`px-3 sm:px-6 py-4 text-right ${clickable}`}>
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
      <td onClick={interactive ? () => onBuy(coin) : undefined} className={`px-3 sm:px-6 py-4 text-right text-slate-600 dark:text-slate-400 hidden lg:table-cell whitespace-nowrap ${clickable}`}>
        {formatNumber(coin.total_volume ?? 0)} {getCurrencySymbol(userCurrency)}
      </td>
      <td onClick={interactive ? () => onBuy(coin) : undefined} className={`px-3 sm:px-6 py-4 text-right text-slate-600 dark:text-slate-400 hidden xl:table-cell whitespace-nowrap ${clickable}`}>
        {formatNumber((coin.market_cap ?? 0) * exchangeRate)} {getCurrencySymbol(userCurrency)}
      </td>

      <td className="px-3 sm:px-6 py-4">
        <div className={`flex items-center gap-2 whitespace-nowrap ${interactive ? "justify-center" : "justify-end"}`}>
          <Link
            href={`/market/${coin.id}`}
            className="px-3 sm:px-4 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors"
          >
            {t("market.details")}
          </Link>
          <button
            onClick={() => onBuy(coin)}
            className="px-3 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {t("market.trade")}
          </button>
        </div>
      </td>
    </tr>
  );
}
