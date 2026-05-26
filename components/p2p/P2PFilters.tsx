// frontend/components/p2p/P2PFilters.tsx
import React, { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import { BinanceAPI } from "@/lib/api/binance";
import { currencies } from "@/lib/currencies";

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
  const [cryptoOptions, setCryptoOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchCryptos = async () => {
      try {
        const coins = await BinanceAPI.get24hPrices();
        const symbols = coins
          .slice(0, 50)
          .map((coin) => coin.symbol.toUpperCase());
        setCryptoOptions(symbols);
        onCryptoOptionsLoaded?.(symbols);
        hasFetched.current = true;
      } catch (error) {
        console.error("Error loading cryptos:", error);
        const fallbackOptions = [
          "BTC",
          "ETH",
          "USDT",
          "BNB",
          "XRP",
          "USDC",
          "ADA",
          "SOL",
          "DOGE",
          "TRX",
        ];
        setCryptoOptions(fallbackOptions);
        onCryptoOptionsLoaded?.(fallbackOptions);
        hasFetched.current = true;
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Купить/Продать */}
        <div className="flex gap-2">
          <button
            onClick={() => onTradeTypeChange("buy")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              tradeType === "buy"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Купить
          </button>
          <button
            onClick={() => onTradeTypeChange("sell")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              tradeType === "sell"
                ? "bg-red-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Продать
          </button>
        </div>

        {/* Криптовалюта */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 whitespace-nowrap">
            Монета:
          </span>
          <select
            value={selectedCrypto}
            onChange={(e) => onCryptoChange(e.target.value)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium border-0 outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Все монеты</option>
            {loading ? (
              <option value="">Загрузка...</option>
            ) : (
              cryptoOptions.map((crypto) => (
                <option key={crypto} value={crypto} className="bg-slate-800">
                  {crypto}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Валюта */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 whitespace-nowrap">
            Валюта:
          </span>
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-800 text-white border-0 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="">Все валюты</option>
            {currencies.map((curr) => (
              <option
                key={curr.code}
                value={curr.code}
                className="bg-slate-800"
              >
                {curr.code}
              </option>
            ))}
          </select>
        </div>

        {/* Поиск */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск продавца..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Сортировка */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 whitespace-nowrap">
            Сортировать:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "price" | "rate")}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="price">Цена</option>
            <option value="rate">Рейтинг</option>
          </select>
        </div>
      </div>
    </div>
  );
}
