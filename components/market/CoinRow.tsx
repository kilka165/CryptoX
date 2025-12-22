// components/market/CoinRow.tsx

"use client";

import React from "react";
import { CoinImage } from "./CoinImage";
import { ConvertedPrice } from "./ConvertedPrice";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
  market_cap: number;
}

interface CoinRowProps {
  coin: Coin;
  userCurrency: string;
  onBuy: (coin: Coin) => void;
  formatNumber: (n: number) => string;
}

export const CoinRow: React.FC<CoinRowProps> = ({
  coin,
  userCurrency,
  onBuy,
  formatNumber,
}) => {
  const change = coin.price_change_percentage_24h ?? 0;

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <CoinImage
            coinId={coin.id}
            name={coin.name}
            className="w-6 h-6 rounded-full shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <div className="font-bold text-slate-900 dark:text-white truncate">
              {coin.symbol.toUpperCase()}
            </div>
            <div className="text-xs text-slate-500 truncate max-w-[120px]">
              {coin.name}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
        <ConvertedPrice
          valueUSD={coin.current_price}
          currency={userCurrency}
        />
      </td>

      <td
        className={`px-6 py-4 text-right ${
          change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "text-slate-500"
        }`}
      >
        {coin.price_change_percentage_24h != null
          ? change.toFixed(2)
          : "0.00"}
        %
      </td>

      <td className="px-6 py-4 text-right text-slate-500 hidden md:table-cell">
        {formatNumber(coin.total_volume)}
      </td>

      <td className="px-6 py-4 text-right text-slate-500 hidden lg:table-cell">
        {formatNumber(coin.market_cap)}
      </td>

      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onBuy(coin)}
          className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Купить
        </button>
      </td>
    </tr>
  );
};
