"use client";

import { ConvertedAssetPrice } from "./ConvertedAssetPrice";

interface PortfolioValueProps {
  totalPortfolioUSD: number;
  userCurrency: string;
}

export function PortfolioValue({
  totalPortfolioUSD,
  userCurrency,
}: PortfolioValueProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 mb-1">Стоимость портфеля</p>
          <h3 className="text-2xl font-bold">
            <ConvertedAssetPrice
              valueUSD={totalPortfolioUSD}
              currency={userCurrency}
            />
          </h3>
        </div>
        {userCurrency !== "USD" && (
          <div className="text-right">
            <p className="text-xs text-slate-400">В USD:</p>
            <p className="text-lg font-mono text-slate-600 dark:text-slate-400">
              $
              {totalPortfolioUSD.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
