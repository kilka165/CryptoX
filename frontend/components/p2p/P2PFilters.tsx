// frontend/components/p2p/P2PFilters.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { BinanceAPI } from "@/lib/api/binance";
import { currencies } from "@/lib/currencies";
import { SearchableSelect } from "./SearchableSelect";

export type SortKey = "price" | "orders";
export type SortDir = "asc" | "desc";

interface P2PFiltersProps {
  tradeType: "buy" | "sell";
  selectedCrypto: string;
  selectedCurrency: string;
  searchQuery: string;
  sortBy: SortKey;
  sortDir: SortDir;
  priceMin: string;
  priceMax: string;
  amountMin: string;
  amountMax: string;
  ordersMin: string;
  hideMine: boolean;
  onlyMine: boolean;
  onTradeTypeChange: (type: "buy" | "sell") => void;
  onCryptoChange: (crypto: string) => void;
  onCurrencyChange: (currency: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortKey) => void;
  onSortDirChange: (dir: SortDir) => void;
  onPriceMinChange: (value: string) => void;
  onPriceMaxChange: (value: string) => void;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
  onOrdersMinChange: (value: string) => void;
  onHideMineChange: (value: boolean) => void;
  onReset: () => void;
  onCryptoOptionsLoaded?: (options: string[]) => void;
}

const FALLBACK_CRYPTOS = [
  "Bitcoin",
  "Ethereum",
  "USD Coin",
  "Solana",
  "Ripple",
  "Dogecoin",
  "Pepe",
  "Zcash",
  "Binance Coin",
  "Bitcoin Cash",
];

interface RangeInputProps {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  suffix: string;
  minPlaceholder: string;
  maxPlaceholder: string;
}

function RangeInput({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  suffix,
  minPlaceholder,
  maxPlaceholder,
}: RangeInputProps) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={minValue}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder={minPlaceholder}
            className="w-full px-3 py-2 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
            {suffix}
          </span>
        </div>
        <span className="text-slate-400">—</span>
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={maxValue}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder={maxPlaceholder}
            className="w-full px-3 py-2 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
}

export function P2PFilters({
  tradeType,
  selectedCrypto,
  selectedCurrency,
  searchQuery,
  sortBy,
  sortDir,
  priceMin,
  priceMax,
  amountMin,
  amountMax,
  ordersMin,
  hideMine,
  onlyMine,
  onTradeTypeChange,
  onCryptoChange,
  onCurrencyChange,
  onSearchChange,
  onSortChange,
  onSortDirChange,
  onPriceMinChange,
  onPriceMaxChange,
  onAmountMinChange,
  onAmountMaxChange,
  onOrdersMinChange,
  onHideMineChange,
  onReset,
  onCryptoOptionsLoaded,
}: P2PFiltersProps) {
  const { t } = useTranslation();
  const [availableCryptos, setAvailableCryptos] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    const fetchAvailableAssets = async () => {
      try {
        const coins = await BinanceAPI.get24hPrices();
        const names = coins
          .map((c: any) => c.name)
          .filter((n: string | undefined): n is string => !!n);
        const unique = Array.from(new Set(names));
        const list = unique.length > 0 ? unique : FALLBACK_CRYPTOS;
        setAvailableCryptos(list);
        onCryptoOptionsLoaded?.(list);
      } catch (error) {
        console.error("Error fetching available coins:", error);
        setAvailableCryptos(FALLBACK_CRYPTOS);
        onCryptoOptionsLoaded?.(FALLBACK_CRYPTOS);
      }
    };

    fetchAvailableAssets();
  }, []);

  const activeRangeCount =
    [priceMin, priceMax, amountMin, amountMax, ordersMin].filter(
      (v) => v.trim() !== ""
    ).length + (hideMine ? 1 : 0);

  const priceSuffix = selectedCurrency || "—";
  const amountSuffix = selectedCrypto
    ? selectedCrypto.slice(0, 6).toUpperCase()
    : "—";

  const cryptoOptions = availableCryptos.map((c) => ({ value: c, label: c }));
  const currencyOptions = currencies.map((c) => ({
    value: c.code,
    label: `${c.code} — ${c.name}`,
  }));

  return (
    <div className="bg-white dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-4 space-y-4">
      {/* Ряд 1: широкие табы Купить/Продать */}
      {!onlyMine && (
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => onTradeTypeChange("buy")}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
              tradeType === "buy"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t("p2p.filters.buy")}
          </button>
          <button
            onClick={() => onTradeTypeChange("sell")}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
              tradeType === "sell"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t("p2p.filters.sell")}
          </button>
        </div>
      )}

      {/* Ряд 2: основные фильтры */}
      <div
        className={`grid grid-cols-1 gap-4 ${
          onlyMine ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t("p2p.filters.coin")}
          </label>
          <SearchableSelect
            value={selectedCrypto}
            options={cryptoOptions}
            onChange={onCryptoChange}
            allLabel={t("p2p.filters.allCoins")}
            searchPlaceholder={t("p2p.filters.searchCoin")}
            emptyText={t("p2p.filters.nothingFound")}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t("p2p.filters.currency")}
          </label>
          <SearchableSelect
            value={selectedCurrency}
            options={currencyOptions}
            onChange={onCurrencyChange}
            allLabel={t("p2p.filters.allCurrencies")}
            searchPlaceholder={t("p2p.filters.searchCurrency")}
            emptyText={t("p2p.filters.nothingFound")}
          />
        </div>

        {!onlyMine && (
          <>
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t("p2p.filters.searchSeller")}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t("p2p.filters.sellerPlaceholder")}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            {t("p2p.filters.sortBy")}
          </label>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortKey)}
              className="flex-1 min-w-0 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">{t("p2p.filters.price")}</option>
              <option value="orders">{t("p2p.filters.sortOrders")}</option>
            </select>
            <button
              type="button"
              onClick={() =>
                onSortDirChange(sortDir === "asc" ? "desc" : "asc")
              }
              title={
                sortDir === "asc"
                  ? t("p2p.filters.sortAsc")
                  : t("p2p.filters.sortDesc")
              }
              aria-label={
                sortDir === "asc"
                  ? t("p2p.filters.sortAsc")
                  : t("p2p.filters.sortDesc")
              }
              className="shrink-0 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
            >
              {sortDir === "asc" ? (
                <ArrowUpNarrowWide className="w-4 h-4" />
              ) : (
                <ArrowDownWideNarrow className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
          </>
        )}
      </div>

      {!onlyMine && (
        /* Ряд 3: «Расширенные фильтры» и «Сбросить» на одной линии */
        <div className="border-t border-slate-300 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {advancedOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>{t("p2p.filters.advanced")}</span>
              {activeRangeCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                  {t("p2p.filters.advancedCount", { count: activeRangeCount })}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex shrink-0 items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t("p2p.filters.reset")}</span>
            </button>
          </div>

          {advancedOpen && (
          <div className="mt-3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RangeInput
                label={t("p2p.filters.priceRange")}
                minValue={priceMin}
                maxValue={priceMax}
                onMinChange={onPriceMinChange}
                onMaxChange={onPriceMaxChange}
                suffix={priceSuffix}
                minPlaceholder={t("p2p.filters.min")}
                maxPlaceholder={t("p2p.filters.max")}
              />
              <RangeInput
                label={t("p2p.filters.amountRange")}
                minValue={amountMin}
                maxValue={amountMax}
                onMinChange={onAmountMinChange}
                onMaxChange={onAmountMaxChange}
                suffix={amountSuffix}
                minPlaceholder={t("p2p.filters.min")}
                maxPlaceholder={t("p2p.filters.max")}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">
                {t("p2p.filters.minTrades")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={ordersMin}
                onChange={(e) => onOrdersMinChange(e.target.value)}
                placeholder={t("p2p.filters.min")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={hideMine}
                onChange={(e) => onHideMineChange(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {t("p2p.filters.hideMine")}
              </span>
            </label>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
