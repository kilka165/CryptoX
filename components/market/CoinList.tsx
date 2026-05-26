// components/market/CoinList.tsx
"use client";
import React from "react";
import { CoinImage } from "./CoinImage";
import { ConvertedPrice } from "./ConvertedPrice";
import { Coin } from "@/types/coin";

interface CoinListProps {
  title: string;
  coins: Coin[];
  type: "gainers" | "losers" | "popular";
  userCurrency: string;
  onBuy: (coin: Coin) => void;
}

export const CoinList: React.FC<CoinListProps> = ({ title, coins, type, userCurrency, onBuy }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 text-center">{title}</h3>

      <div className="flex-1 w-full">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 text-left pl-2 w-8">#</th>
              <th className="pb-3 text-left">Монета</th>
              <th className="pb-3 text-right">Цена</th>
              <th className="pb-3 text-right">24ч %</th>
              <th className="pb-3 text-right w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {coins.map((coin, index) => (
              <tr
                key={coin.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <td className="py-4 text-sm text-slate-400 pl-2">{index + 1}</td>
                <td className="py-4 pr-2">
                  <div className="flex items-center gap-3">
                    <CoinImage
                      coinId={coin.id}
                      name={coin.name}
                      className="w-8 h-8 rounded-full shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm truncate">{coin.symbol.toUpperCase()}</span>
                      <span className="text-xs text-slate-500 hidden sm:inline truncate max-w-[100px]">
                        {coin.name}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right text-sm font-medium whitespace-nowrap px-2">
                  <ConvertedPrice valueUSD={coin.current_price} currency={userCurrency} />
                </td>
                <td className="py-4 text-right text-sm font-medium whitespace-nowrap px-2">
                  <span
                    className={
                      (coin.price_change_percentage_24h || 0) >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {(coin.price_change_percentage_24h || 0) >= 0 ? "+" : ""}
                    {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                  </span>
                </td>
                <td className="py-4 text-right pl-2">
                  <button
                    onClick={() => onBuy(coin)}
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 p-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Купить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
