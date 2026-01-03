"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { BinanceAPI } from "@/lib/api/binance";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url?: string | null;
  valueUSD?: number;
  change24h?: number;
  currentPriceUSD?: number;
}

interface AssetsTableProps {
  assets: Asset[];
  userCurrency?: string;
  onSellClick?: (asset: Asset) => void;
}

// Маппинг названий монет на их торговые символы в Binance
const getCoinSymbol = (name: string): string => {
  const symbolMap: Record<string, string> = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'ripple': 'XRP',
    'binancecoin': 'BNB',
    'cardano': 'ADA',
    'solana': 'SOL',
    'polkadot': 'DOT',
    'dogecoin': 'DOGE',
    'polygon': 'MATIC',
    'avalanche': 'AVAX',
    'chainlink': 'LINK',
    'litecoin': 'LTC',
    'uniswap': 'UNI',
        'usd-coin': 'USDC',
  };
  
  return symbolMap[name.toLowerCase()] || name.toUpperCase();
};

// Функция конвертации валюты в символ
const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    RUB: "₽",
    EUR: "€",
    KZT: "₸",
  };
  return symbols[currency] || currency;
};

// Функция конвертации из USD
const getExchangeRate = (currency: string): number => {
  const rates: Record<string, number> = {
    USD: 1,
    RUB: 90,
    EUR: 0.92,
    KZT: 450,
  };
  return rates[currency] || 1;
};

export function AssetsTable({ assets, userCurrency = "USD", onSellClick }: AssetsTableProps) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [changes, setChanges] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPrices = async () => {
      const newPrices: Record<string, number> = {};
      const newChanges: Record<string, number> = {};

      for (const asset of assets) {
        try {
          if (asset.currentPriceUSD) {
            newPrices[asset.name] = asset.currentPriceUSD;
          } else {
            const binanceSymbol = getCoinSymbol(asset.name);
            const price = await BinanceAPI.getPrice(binanceSymbol);
            newPrices[asset.name] = price;
          }

          if (asset.change24h !== undefined) {
            newChanges[asset.name] = asset.change24h;
          } else {
            const binanceSymbol = getCoinSymbol(asset.name);
            const change24h = await BinanceAPI.get24hChange(binanceSymbol);
            newChanges[asset.name] = change24h;
          }
        } catch (error) {
          console.error(`Ошибка для ${asset.name}:`, error);
          newPrices[asset.name] = 0;
          newChanges[asset.name] = 0;
        }
      }

      setPrices(newPrices);
      setChanges(newChanges);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, [assets]);

  const exchangeRate = getExchangeRate(userCurrency);
  const currencySymbol = getCurrencySymbol(userCurrency);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Ваши активы</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Актив</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Количество</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Цена</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Стоимость ({userCurrency})</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">24ч %</th>
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Действие</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const priceUSD = asset.currentPriceUSD || prices[asset.name] || 0;
              const priceInUserCurrency = priceUSD * exchangeRate;
              const change = asset.change24h !== undefined ? asset.change24h : (changes[asset.name] || 0);
              const totalValueUSD = asset.valueUSD || (asset.amount * priceUSD);
              const totalValueInUserCurrency = totalValueUSD * exchangeRate;

              return (
                <tr
                  key={asset.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                        {asset.symbol.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{asset.symbol.toUpperCase()}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm">{asset.amount.toFixed(8)}</td>
                  <td className="py-4 text-sm font-medium">
                    {currencySymbol}{priceInUserCurrency.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-4 text-sm font-semibold">
                    {currencySymbol}{totalValueInUserCurrency.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {change >= 0 ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {Math.abs(change).toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4">
                    <button 
                      onClick={() => onSellClick?.(asset)}
                      className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg"
                    >
                      Продать
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
