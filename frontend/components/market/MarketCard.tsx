"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Coin } from "./CoinRow";
import { CoinImage } from "./CoinImage";
import { ConvertedPrice } from "./ConvertedPrice";

interface MarketCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  coins: Coin[];
  userCurrency: string;
  href: string;
  onBuy: (coin: Coin) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  title,
  icon: Icon,
  coins,
  userCurrency,
  href,
  onBuy,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <Link
          href={href}
          className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
        >
          <Icon
            size={18}
            className="text-slate-500 group-hover:text-blue-600 transition-colors"
          />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <ArrowUpRight
            size={14}
            className="text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
          />
        </Link>
      </div>

      <div className="space-y-3 flex-1">
        {coins.slice(0, 3).map((coin) => (
          <div
            key={coin.id}
            className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 py-1 rounded-lg"
            onClick={() => onBuy(coin)}
          >
            <div className="flex items-center gap-7 min-w-0">
              <CoinImage
                coinId={coin.id}
                name={coin.name}
                className="w-5 h-5 rounded-full shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {coin.symbol.toUpperCase()}
                </div>
                <div className="text-xs text-slate-500 truncate max-w-[110px]">
                  <ConvertedPrice
                    valueUSD={coin.current_price}
                    currency={userCurrency}
                  />
                </div>
              </div>
            </div>
            <span
              className={`text-xs ml-2 ${
                coin.price_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {coin.price_change_percentage_24h > 0 ? "+" : ""}
              {coin.price_change_percentage_24h.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
