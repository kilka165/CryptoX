"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { CoinIcon } from "@/components/market/CoinIcon";
import { Pagination } from "@/components/market/Pagination";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { intlLocale } from "@/lib/utils/locale";
import { BinanceAPI } from "@/lib/api/binance";

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

type SortKey = "name" | "current_price" | "price_change_percentage_24h" | "market_cap" | "total_volume";

export default function PricesPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  const fetchCryptoPrices = async () => {
    try {
      const coins = await BinanceAPI.getMarketCoinsFromBinance();
      const mapped: CryptoPrice[] = coins.slice(0, 50).map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        image: c.image,
        current_price: c.current_price,
        price_change_percentage_24h: c.price_change_percentage_24h,
        market_cap: c.market_cap ?? 0,
        total_volume: c.total_volume ?? 0,
      }));
      setCryptos(mapped);
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCryptos = useMemo(
    () =>
      cryptos.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [cryptos, searchTerm]
  );

  // Сортировка в три такта: убывание → возрастание → сброс.
  const handleSort = (key: SortKey) => {
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

  const sortedCryptos = useMemo(() => {
    if (!sortKey) return filteredCryptos;
    return [...filteredCryptos].sort((a, b) => {
      if (sortKey === "name") {
        const cmp = a.name.localeCompare(b.name);
        return sortDir === "desc" ? -cmp : cmp;
      }
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [filteredCryptos, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedCryptos.length / perPage));
  const paginatedCryptos = sortedCryptos.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Сбрасываем страницу при поиске/смене сортировки.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortKey, sortDir]);

  const sortIcon = (key: SortKey) =>
    sortKey !== key ? (
      <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
    ) : sortDir === "desc" ? (
      <ChevronDown className="w-3.5 h-3.5" />
    ) : (
      <ChevronUp className="w-3.5 h-3.5" />
    );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(intlLocale(i18n.language), {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        <Header />
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("footerPages.prices.title")}</h1>
          <p className="text-xl text-green-100">
            {t("footerPages.prices.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Поиск */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t("footerPages.prices.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-[#131416] border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Таблица цен */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t("footerPages.prices.loadingData")}</p>
          </div>
        ) : (
          <>
          {/* Десктоп: таблица */}
          <div className="hidden lg:block bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
                      >
                        {t("footerPages.prices.colName")}
                        {sortIcon("name")}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("current_price")}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
                      >
                        {t("market.price")}
                        {sortIcon("current_price")}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("price_change_percentage_24h")}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
                      >
                        {t("footerPages.prices.col24h")}
                        {sortIcon("price_change_percentage_24h")}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("market_cap")}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
                      >
                        {t("market.marketCap")}
                        {sortIcon("market_cap")}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("total_volume")}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition-colors uppercase tracking-wider"
                      >
                        {t("footerPages.prices.colVolume")}
                        {sortIcon("total_volume")}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {paginatedCryptos.map((crypto, index) => (
                    <tr
                      key={crypto.id}
                      onClick={() => router.push(`/market/${crypto.id}`)}
                      className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <CoinIcon src={crypto.image} symbol={crypto.symbol} className="w-8 h-8" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {crypto.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-500 uppercase">
                              {crypto.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900 dark:text-slate-100">
                        {formatPrice(crypto.current_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div
                          className={`flex items-center justify-end gap-1 font-semibold ${
                            crypto.price_change_percentage_24h >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600 dark:text-slate-400">
                        {formatNumber(crypto.market_cap)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600 dark:text-slate-400">
                        {formatNumber(crypto.total_volume)}
                      </td>
                    </tr>
                  ))}
                  {paginatedCryptos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                        {t("common.notFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Мобайл/планшет: карточки */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paginatedCryptos.map((crypto, index) => {
              const up = crypto.price_change_percentage_24h >= 0;
              return (
                <div
                  key={crypto.id}
                  onClick={() => router.push(`/market/${crypto.id}`)}
                  className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#131416] p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {/* Шапка: монета + изменение за 24ч */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-5 shrink-0">
                        {(currentPage - 1) * perPage + index + 1}
                      </span>
                      <CoinIcon src={crypto.image} symbol={crypto.symbol} className="w-9 h-9" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {crypto.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 uppercase">
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-semibold shrink-0 ${
                        up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>

                  {/* Остальная информация */}
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{t("market.price")}</span>
                    <span className="text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatPrice(crypto.current_price)}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">{t("market.marketCap")}</span>
                    <span className="text-right text-slate-700 dark:text-slate-300">
                      {formatNumber(crypto.market_cap)}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">{t("footerPages.prices.colVolume")}</span>
                    <span className="text-right text-slate-700 dark:text-slate-300">
                      {formatNumber(crypto.total_volume)}
                    </span>
                  </div>
                </div>
              );
            })}
            {paginatedCryptos.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
                {t("common.notFound")}
              </div>
            )}
          </div>

          {/* Пагинация */}
          <div className="flex justify-center py-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={(p) => setCurrentPage(p)}
            />
          </div>
          </>
        )}
      </div>
        <Footer />
    </div>
  );
}
