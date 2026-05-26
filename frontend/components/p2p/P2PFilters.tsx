// frontend/components/p2p/P2PFilters.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import axios from "axios";

interface P2PFiltersProps {
  tradeType: "buy" | "sell";
  selectedCrypto: string;
  selectedCurrency: string;
  searchQuery: string;
  sortBy: "price" | "rate";
  onTradeTypeChange: (type: "buy" | "sell") => void;
  onCryptoChange: (crypto: string) => void;
  onCurrencyChange: (currency: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: "price" | "rate") => void;
  onCryptoOptionsLoaded?: (options: string[]) => void;
}

// Маппинг символов криптовалют к их полным названиям
const CRYPTO_NAME_MAP: Record<string, string> = {
  "BTC": "Bitcoin",
  "ETH": "Ethereum",
  "USDC": "USD Coin",
  "SOL": "Solana",
  "XRP": "Ripple",
  "DOGE": "Dogecoin",
  "PEPE": "Pepe",
  "ZEC": "Zcash",
  "BNB": "Binance Coin",
  "BCH": "Bitcoin Cash",
  "BONK": "Bonk",
};

export function P2PFilters({
  tradeType,
  selectedCrypto,
  selectedCurrency,
  searchQuery,
  sortBy,
  onTradeTypeChange,
  onCryptoChange,
  onCurrencyChange,
  onSearchChange,
  onSortChange,
  onCryptoOptionsLoaded,
}: P2PFiltersProps) {
  const [availableCryptos, setAvailableCryptos] = useState<string[]>([]);

  useEffect(() => {
    const fetchAvailableAssets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/assets");
        const cryptoNames = response.data.map((asset: any) => asset.name);
        setAvailableCryptos(cryptoNames);
        
        if (onCryptoOptionsLoaded) {
          onCryptoOptionsLoaded(cryptoNames);
        }
      } catch (error) {
        console.error("Error fetching available assets:", error);
        // Фоллбэк на стандартные криптовалюты
        const fallbackCryptos = Object.values(CRYPTO_NAME_MAP);
        setAvailableCryptos(fallbackCryptos);
        if (onCryptoOptionsLoaded) {
          onCryptoOptionsLoaded(fallbackCryptos);
        }
      }
    };

    fetchAvailableAssets();
  }, []);

  const handleCryptoSelect = (symbol: string) => {
    // Конвертируем символ в полное название
    const fullName = CRYPTO_NAME_MAP[symbol] || symbol;
    onCryptoChange(fullName);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Тип сделки */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => onTradeTypeChange("buy")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              tradeType === "buy"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Купить
          </button>
          <button
            onClick={() => onTradeTypeChange("sell")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              tradeType === "sell"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Продать
          </button>
        </div>

        {/* Фильтр по криптовалюте */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">Монета:</label>
          <select
            value={selectedCrypto}
            onChange={(e) => onCryptoChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все монеты</option>
            {availableCryptos.map((crypto) => (
              <option key={crypto} value={crypto}>
                {crypto}
              </option>
            ))}
          </select>
        </div>

        {/* Фильтр по валюте */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">Валюта:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все валюты</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUB">RUB</option>
            <option value="KZT">KZT</option>
          </select>
        </div>

        {/* Поиск по продавцу */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Поиск продавца:
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Имя продавца..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Сортировка */}
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Сортировать:
          </label>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "price" | "rate")}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Цена</option>
              <option value="rate">Рейтинг</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
