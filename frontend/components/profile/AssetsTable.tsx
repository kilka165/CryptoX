"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { CoinIcon } from "@/components/market/CoinIcon";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";
import { getCurrencySymbol } from "@/lib/currencies";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url?: string | null;
  // Правильные символ/картинка монеты (символ актива бывает «битый»)
  iconSymbol?: string;
  iconSrc?: string | null;
  valueUSD?: number;
  change24h?: number;
  currentPriceUSD?: number;
}

interface AssetsTableProps {
  assets: Asset[];
  userCurrency?: string;
  onTradeClick?: (asset: Asset) => void;
}

type SortKey = "amount" | "price" | "value" | "change24h";

// На странице — до 8 активов; девятый и далее уходят на следующую страницу.
const PAGE_SIZE = 8;

export function AssetsTable({ assets, userCurrency = "USD", onTradeClick }: AssetsTableProps) {
  const { t } = useTranslation();
  const { getRate } = useRates();
  const router = useRouter();

  const exchangeRate = getRate(userCurrency);
  const currencySymbol = getCurrencySymbol(userCurrency);

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  // Сортировка в три такта: убывание → возрастание → сброс (как на странице рынка).
  const handleSort = (key: SortKey) => {
    setPage(1); // при смене сортировки возвращаемся на первую страницу
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir("asc");
    } else {
      setSortKey(null);
      setSortDir("desc");
    }
  };

  const sortValue = (a: Asset, key: SortKey): number => {
    if (key === "amount") return a.amount;
    if (key === "price") return a.currentPriceUSD ?? 0;
    if (key === "value") return a.valueUSD ?? a.amount * (a.currentPriceUSD ?? 0);
    return a.change24h ?? 0; // change24h
  };

  const sortedAssets = useMemo(() => {
    if (!sortKey) return assets;
    return [...assets].sort((x, y) => {
      const xv = sortValue(x, sortKey);
      const yv = sortValue(y, sortKey);
      return sortDir === "desc" ? yv - xv : xv - yv;
    });
  }, [assets, sortKey, sortDir]);

  // Пагинация: всего страниц и срез активов под текущую страницу.
  const totalPages = Math.max(1, Math.ceil(sortedAssets.length / PAGE_SIZE));

  // Если активов стало меньше (продажа) и текущая страница исчезла — подтягиваем
  // на последнюю существующую. Цены обновляются каждые 30с, но число активов при
  // этом не меняется, поэтому страница не сбрасывается на each-poll.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedAssets = useMemo(
    () => sortedAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedAssets, page]
  );

  const sortIcon = (key: SortKey) =>
    sortKey !== key ? (
      <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
    ) : sortDir === "desc" ? (
      <ChevronDown className="w-3.5 h-3.5" />
    ) : (
      <ChevronUp className="w-3.5 h-3.5" />
    );

  const sortHeader = (key: SortKey, label: string) => (
    <th className="pb-3 pr-4 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
      <button
        type="button"
        onClick={() => handleSort(key)}
        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        {label}
        {sortIcon(key)}
      </button>
    </th>
  );

  // Пока правильный символ монеты не определён — нейтральная заглушка,
  // чтобы в первые секунды не мелькал чужой логотип (символ актива бывает «битый»).
  const renderIcon = (asset: Asset, sizeClass: string) => {
    if (!asset.iconSymbol) {
      return (
        <div
          className={`${sizeClass} rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase shrink-0`}
        >
          {asset.symbol.slice(0, 3).toUpperCase()}
        </div>
      );
    }
    return (
      <CoinIcon src={asset.iconSrc ?? asset.logo_url} symbol={asset.iconSymbol} className={sizeClass} />
    );
  };

  // Монета (id актива равен Coin.id) → страница «Подробнее».
  const goDetails = (asset: Asset) => router.push(`/market/${asset.name}`);

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t("profile.assets.title")}</h3>
      </div>

      {/* Десктоп: таблица */}
      <div className="hidden lg:block overflow-x-auto">
        {/* table-fixed + colgroup: ширины колонок постоянны и не зависят от
            содержимого, поэтому при переключении страниц колонки не «съезжают». */}
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[19%]" /> {/* Актив */}
            <col className="w-[21%]" /> {/* Количество */}
            <col className="w-[16%]" /> {/* Цена */}
            <col className="w-[16%]" /> {/* Стоимость */}
            <col className="w-[12%]" /> {/* 24ч % */}
            <col className="w-[16%]" /> {/* Действие */}
          </colgroup>
          <thead>
            <tr className="text-left border-b border-slate-200 dark:border-slate-700">
              <th className="pb-3 pr-4 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.asset")}</th>
              {sortHeader("amount", t("profile.assets.amount"))}
              {sortHeader("price", t("profile.assets.price"))}
              {sortHeader("value", t("profile.assets.value", { currency: getCurrencySymbol(userCurrency) }))}
              {sortHeader("change24h", t("profile.assets.change24h"))}
              <th className="pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{t("profile.assets.action")}</th>
            </tr>
          </thead>
          <tbody>
            {pagedAssets.map((asset) => {
              const priceUSD = asset.currentPriceUSD || 0;
              const priceInUserCurrency = priceUSD * exchangeRate;
              const change = asset.change24h ?? 0;
              const totalValueUSD = asset.valueUSD || (asset.amount * priceUSD);
              const totalValueInUserCurrency = totalValueUSD * exchangeRate;

              return (
                <tr
                  key={asset.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {/* Монета → «Подробнее» (невидимая зона клика) */}
                  <td onClick={() => goDetails(asset)} className="py-4 pr-4 cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      {renderIcon(asset, "w-8 h-8")}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">{asset.symbol.toUpperCase()}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  {/* Данные → «Торговля» (невидимая зона клика) */}
                  <td onClick={() => onTradeClick?.(asset)} className="py-4 pr-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">{asset.amount.toFixed(8)}</td>
                  <td onClick={() => onTradeClick?.(asset)} className="py-4 pr-4 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                    {currencySymbol}{priceInUserCurrency.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: priceInUserCurrency < 1 ? 8 : 2,
                    })}
                  </td>
                  <td onClick={() => onTradeClick?.(asset)} className="py-4 pr-4 text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                    {currencySymbol}{totalValueInUserCurrency.toFixed(2)}
                  </td>
                  <td onClick={() => onTradeClick?.(asset)} className="py-4 pr-4 cursor-pointer">
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
                      onClick={() => onTradeClick?.(asset)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                    >
                      {t("profile.assets.trade")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Мобильный/планшет: карточки */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pagedAssets.map((asset) => {
          const priceUSD = asset.currentPriceUSD || 0;
          const priceInUserCurrency = priceUSD * exchangeRate;
          const change = asset.change24h ?? 0;
          const totalValueUSD = asset.valueUSD || (asset.amount * priceUSD);
          const totalValueInUserCurrency = totalValueUSD * exchangeRate;

          return (
            <div
              key={asset.id}
              className="rounded-xl border border-slate-300 dark:border-slate-800 p-4"
            >
              {/* Шапка карточки → «Подробнее» */}
              <div onClick={() => goDetails(asset)} className="flex items-center justify-between mb-3 cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  {renderIcon(asset, "w-9 h-9")}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{asset.symbol.toUpperCase()}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">{asset.name}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-sm font-medium shrink-0 ${
                    change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(change).toFixed(2)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                <span className="text-slate-500 dark:text-slate-400">{t("profile.assets.amount")}</span>
                <span className="text-right break-all">{asset.amount.toFixed(8)}</span>

                <span className="text-slate-500 dark:text-slate-400">{t("profile.assets.price")}</span>
                <span className="text-right font-medium">
                  {currencySymbol}{priceInUserCurrency.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: priceInUserCurrency < 1 ? 8 : 2,
                  })}
                </span>

                <span className="text-slate-500 dark:text-slate-400">{t("profile.assets.value", { currency: getCurrencySymbol(userCurrency) })}</span>
                <span className="text-right font-semibold">
                  {currencySymbol}{totalValueInUserCurrency.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => onTradeClick?.(asset)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
              >
                {t("profile.assets.trade")}
              </button>
            </div>
          );
        })}
      </div>

      {/* Пагинация: появляется с 9-го актива (больше одной страницы) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={`min-w-9 h-9 px-3 rounded-lg text-sm font-medium border transition-colors ${
                p === page
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
