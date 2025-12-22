"use client";

import Link from "next/link";
import { ConvertedAssetPrice } from "./ConvertedAssetPrice";

interface EnrichedAsset {
  id: number;
  symbol: string;
  name: string;
  amount: number;
  valueUSD: number;
  change24h: number;
  currentPriceUSD: number;
}

interface AssetsTableProps {
  assets: EnrichedAsset[];
  userCurrency: string;
  onSellClick: (asset: EnrichedAsset) => void;
}

export function AssetsTable({
  assets,
  userCurrency,
  onSellClick,
}: AssetsTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-lg font-bold mb-4">Мои активы</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 text-left">
              <th className="pb-3 pl-2">Актив</th>
              <th className="pb-3 text-right">Количество</th>
              <th className="pb-3 text-right">Стоимость ({userCurrency})</th>
              <th className="pb-3 text-right">24ч %</th>
              <th className="pb-3 text-right">Действие</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                >
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold uppercase">
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase">
                          {asset.symbol}
                        </div>
                        <div className="text-xs text-slate-500 capitalize">
                          {asset.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right text-sm font-medium">
                    {Number(asset.amount).toFixed(6)}
                  </td>
                  <td className="py-4 text-right text-sm font-medium">
                    <ConvertedAssetPrice
                      valueUSD={asset.valueUSD}
                      currency={userCurrency}
                    />
                    {userCurrency !== "USD" && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        $
                        {asset.valueUSD.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    )}
                  </td>
                  <td
                    className={`py-4 text-right text-sm font-medium ${
                      asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {asset.change24h > 0 && "+"}
                    {asset.change24h.toFixed(2)}%
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onSellClick(asset)}
                      className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Продать
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  У вас пока нет активов.
                  <Link href="/market" className="text-blue-600 hover:underline ml-1">
                    Купить на Рынке
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
