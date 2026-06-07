"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Flame, TrendingUp, BarChart3, Zap, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Header } from "@/components/Header";
import { CoinRow } from "@/components/market/CoinRow";
import { CoinCard } from "@/components/market/CoinCard";
import { MarketCard } from "@/components/market/MarketCard";
import { MarketCardsCarousel, MarketCardDef } from "@/components/market/MarketCardsCarousel";
import { Pagination } from "@/components/market/Pagination";
import { getCurrencySymbol } from "@/lib/currencies";
import { BuyModal } from "@/components/market/BuyModal";
import { Footer } from "@/components/Footer";
import { BinanceAPI } from "@/lib/api/binance";
import { formatNumber } from "@/lib/format";
import { Coin } from "@/types/coin";
import { useTranslation } from "react-i18next";
import { useBuyFlow } from "@/hooks/useBuyFlow";

type SortKey = "current_price" | "price_change_percentage_24h" | "total_volume" | "market_cap";

export default function MarketPage() {
  const { t } = useTranslation();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const flow = useBuyFlow();
  const { userCurrency, exchangeRate, openBuy, selectedCoin } = flow;

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const binancePrices = await BinanceAPI.get24hPrices();

        const coinsData: Coin[] = binancePrices.map(bp => ({
          id: bp.id,
          symbol: bp.symbol,
          name: bp.name,
          image: bp.image || "",
          current_price: bp.current_price,
          price_change_percentage_24h: bp.price_change_percentage_24h || 0,
          market_cap: bp.market_cap || 0,
          total_volume: bp.total_volume || 0,
        }));

        setCoins(coinsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const filteredCoins = useMemo(
    () =>
      coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      ),
    [coins, search]
  );

  // Сортировка по выбранной колонке в три такта: убывание → возрастание → сброс.
  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir("asc");
    } else {
      // Третье нажатие — сбрасываем сортировку.
      setSortKey(null);
      setSortDir("desc");
    }
  };

  const sortedCoins = useMemo(() => {
    if (!sortKey) return filteredCoins;
    return [...filteredCoins].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [filteredCoins, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedCoins.length / perPage));
  const paginatedCoins = sortedCoins.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortKey, sortDir]);

  const topGainers = useMemo(
    () =>
      [...coins]
        .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
        .slice(0, 4),
    [coins]
  );

  const topVolume = useMemo(
    () =>
      [...coins]
        .sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0))
        .slice(0, 4),
    [coins]
  );

  const newGems = useMemo(
    () =>
      [...coins]
        .sort((a, b) => (a.market_cap ?? 0) - (b.market_cap ?? 0))
        .filter((c) => (c.market_cap ?? 0) > 0)
        .slice(0, 4),
    [coins]
  );

  const marketCards: MarketCardDef[] = [
    { title: t("market.popular"), icon: Flame, coins, href: "/market/overview" },
    { title: t("market.topGainers"), icon: TrendingUp, coins: topGainers, href: "/market/overview" },
    { title: t("market.byVolume"), icon: BarChart3, coins: topVolume, href: "/market/overview" },
    { title: t("market.new"), icon: Zap, coins: newGems, href: "/market/overview" },
  ];

  const sortIcon = (key: SortKey) =>
    sortKey !== key ? (
      <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
    ) : sortDir === "desc" ? (
      <ChevronDown className="w-3.5 h-3.5" />
    ) : (
      <ChevronUp className="w-3.5 h-3.5" />
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6">{t("market.title")}</h2>

          {!loading && (
            <>
              {/* Мобильная карусель карточек */}
              <MarketCardsCarousel
                cards={marketCards}
                onBuy={openBuy}
                userCurrency={userCurrency}
                exchangeRate={exchangeRate}
              />

              {/* Десктопная сетка карточек */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {marketCards.map((c) => (
                  <MarketCard
                    key={c.title}
                    title={c.title}
                    icon={c.icon}
                    coins={c.coins}
                    onBuy={openBuy}
                    userCurrency={userCurrency}
                    exchangeRate={exchangeRate}
                    href={c.href}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Поиск — под карточками, над списком */}
          <div className="relative w-full md:w-80 md:ml-auto mb-4">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("market.searchCoins")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-800 rounded-xl bg-white dark:bg-[#131416] outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Подписи колонок (планшет) */}
          <div className="hidden sm:flex lg:hidden items-center gap-3 px-3 mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            <span className="w-9 shrink-0" />
            <span className="flex-1 min-w-0">{t("market.coin")}</span>
            <span className="text-right shrink-0">
              {t("market.priceCur", { currency: getCurrencySymbol(userCurrency) })} / {t("market.change24h")}
            </span>
            <span className="px-3 text-sm invisible shrink-0">{t("market.buy")}</span>
          </div>

          {/* Мобильный/планшетный список — карточки */}
          <div className="lg:hidden space-y-2 mb-4">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl animate-pulse bg-slate-100 dark:bg-[#131416]" />
                ))
              : paginatedCoins.map((coin) => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    userCurrency={userCurrency}
                    exchangeRate={exchangeRate}
                    onBuy={openBuy}
                  />
                ))}
          </div>

          {/* Десктопная таблица */}
          <div className="hidden lg:block bg-white dark:bg-[#131416] rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="w-[18%] pl-[68px] pr-6 py-4">{t("market.coin")}</th>
                  <th className="px-3 sm:px-6 py-4 text-right w-[20%]">
                    <button
                      onClick={() => handleSort("current_price")}
                      className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      {t("market.priceCur", { currency: getCurrencySymbol(userCurrency) })}
                      {sortIcon("current_price")}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-right w-[11%]">
                    <button
                      onClick={() => handleSort("price_change_percentage_24h")}
                      className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      {t("market.change24h")}
                      {sortIcon("price_change_percentage_24h")}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-right hidden lg:table-cell w-[14%]">
                    <button
                      onClick={() => handleSort("total_volume")}
                      className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      {t("market.volume")}
                      {sortIcon("total_volume")}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-right hidden xl:table-cell w-[14%]">
                    <button
                      onClick={() => handleSort("market_cap")}
                      className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      {t("market.marketCap")}
                      {sortIcon("market_cap")}
                    </button>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-center w-[23%]">{t("market.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="h-16 animate-pulse bg-slate-50 dark:bg-[#131416]">
                        <td colSpan={6}></td>
                      </tr>
                    ))
                  : paginatedCoins.map((coin) => (
                      <CoinRow
                        key={coin.id}
                        coin={coin}
                        userCurrency={userCurrency}
                        exchangeRate={exchangeRate}
                        onBuy={openBuy}
                        formatNumber={formatNumber}
                        interactive
                      />
                    ))}
              </tbody>
            </table>
          </div>
          </div>

          {/* Пагинация — видна и на мобильном, и на десктопе */}
          <div className="flex justify-center py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={(p) => setCurrentPage(p)}
            />
          </div>
        </div>
      </div>

      {selectedCoin && <BuyModal flow={flow} />}

      <Footer />
    </div>
  );
}
