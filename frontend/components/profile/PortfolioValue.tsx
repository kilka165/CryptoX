"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { BinanceAPI } from "@/lib/api/binance";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
}

interface PortfolioValueProps {
  assets?: Asset[];
  userCurrency?: string;
}

// Маппинг названий монет на символы
const getCoinSymbol = (name: string): string => {
  const symbolMap: Record<string, string> = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'ripple': 'XRP',  // ✅ Исправлено
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

export function PortfolioValue({ assets = [], userCurrency = "USD" }: PortfolioValueProps) {
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateTotal = async () => {
      if (!assets || assets.length === 0) {
        setTotalValue(0);
        setLoading(false);
        return;
      }

      try {
        let total = 0;

        await Promise.all(
          assets.map(async (asset) => {
            try {
              const binanceSymbol = getCoinSymbol(asset.name);
              const price = await BinanceAPI.getPrice(binanceSymbol);
              const assetValue = asset.amount * price;
              
              total += assetValue;
              
              console.log(`${asset.name}: ${asset.amount} × $${price} = $${assetValue}`);
            } catch (err) {
              console.error(`Ошибка для ${asset.name}:`, err);
            }
          })
        );

        console.log(`Общая стоимость портфеля: $${total}`);
        setTotalValue(total);
      } catch (error) {
        console.error("Ошибка расчёта портфеля:", error);
      } finally {
        setLoading(false);
      }
    };

    calculateTotal();
    
    const interval = setInterval(calculateTotal, 10000);
    return () => clearInterval(interval);
  }, [assets]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
          <div className="h-8 bg-white/20 rounded w-48"></div>
        </div>
      </div>
    );
  }

  const exchangeRate = getExchangeRate(userCurrency);
  const valueInUserCurrency = totalValue * exchangeRate;
  const currencySymbol = getCurrencySymbol(userCurrency);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">Стоимость портфеля</span>
        <TrendingUp size={20} className="opacity-80" />
      </div>
      <div className="text-3xl font-bold mb-1">
        {valueInUserCurrency.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        {currencySymbol}
      </div>
      <div className="text-sm opacity-75">
        В USD: ${totalValue.toFixed(2)}
      </div>
    </div>
  );
}
