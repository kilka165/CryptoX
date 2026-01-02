import React from "react";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h?: number | null; // ← Добавьте undefined
  market_cap?: number;
  total_volume?: number;
}

interface CoinRowProps {
  coin: Coin;
  index: number;
  userCurrency: string;
  onBuy: (coin: Coin) => void;
  formatNumber: (num: number) => string;
}

export function CoinRow({ coin, index, userCurrency, onBuy, formatNumber }: CoinRowProps) {
  const priceChange = coin.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 text-slate-500 font-medium">{index}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
            {coin.symbol.slice(0, 3).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{coin.name}</div>
            <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right font-semibold">
        {coin.current_price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })}{" "}
        {userCurrency}
      </td>
      <td className="px-6 py-4 text-right">
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
      <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 hidden md:table-cell">
        {formatNumber(coin.total_volume ?? 0)}
      </td>
      <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 hidden lg:table-cell">
        {formatNumber(coin.market_cap ?? 0)}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onBuy(coin)}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Купить
        </button>
      </td>
    </tr>
  );
}
