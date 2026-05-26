import Link from "next/link";
import { ComponentType } from "react";
import { Coin } from "@/types/coin";

interface MarketCardProps {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  coins: Coin[];
  onBuy: (coin: Coin) => void;
  userCurrency: string;
  exchangeRate: number;
  href?: string;
}

export function MarketCard({ title, icon: Icon, coins, onBuy, userCurrency, exchangeRate, href }: MarketCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        {href ? (
          <Link
            href={href}
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
          >
            <Icon
              size={18}
              className="text-slate-500 group-hover:text-blue-600 transition-colors"
            />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {coins.slice(0, 4).map((coin) => {
          const priceChange = coin.price_change_percentage_24h ?? 0;
          const isPositive = priceChange >= 0;
          
          // Конвертируем цену в выбранную валюту
          const convertedPrice = coin.current_price * exchangeRate;

          return (
            <div
              key={coin.id}
              className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => onBuy(coin)}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                  {coin.symbol.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">{coin.name}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {convertedPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  })}{" "}
                  {userCurrency}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
