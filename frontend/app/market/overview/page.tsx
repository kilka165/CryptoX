// frontend/app/market/overview/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Flame, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BinanceAPI } from "@/lib/api/binance";
import { API_BASE } from "@/lib/config";
import type { Coin } from "@/types/coin";
import { MarketCard } from "@/components/market/MarketCard";
import { CoinRow } from "@/components/market/CoinRow";
import { CoinCard } from "@/components/market/CoinCard";
import { getCurrencySymbol } from "@/lib/currencies";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";

const formatNumber = (num: number) => {
  if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + "T";
  if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
  if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
  if (num >= 1.0e3) return (num / 1.0e3).toFixed(2) + "K";
  return num.toFixed(2);
};

export default function MarketOverviewPage() {
  const { t } = useTranslation();
  const { getRate } = useRates();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<string>("USD");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const binancePrices = await BinanceAPI.get24hPrices();

        const coinsData: Coin[] = binancePrices.map((bp: any) => ({
          id: bp.id,
          symbol: bp.symbol,
          name: bp.name,
          image: bp.image || "",
          current_price: bp.current_price,
          price_change_percentage_24h: bp.price_change_percentage_24h ?? null,
          market_cap: bp.market_cap ?? null,
          total_volume: bp.total_volume ?? null,
          market_cap_rank: bp.market_cap_rank ?? null,
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

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    axios
      .get(`${API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.currency) setUserCurrency(res.data.currency);
      })
      .catch((e) => console.error(e));
  }, []);

  const exchangeRate = getRate(userCurrency);

  const totalMarketCap = coins.reduce(
    (acc, c) => acc + (c.market_cap ?? 0),
    0
  );
  const totalVolume = coins.reduce(
    (acc, c) => acc + (c.total_volume ?? 0),
    0
  );
  const positiveCount = coins.filter(
    (c) => (c.price_change_percentage_24h ?? 0) > 0
  ).length;

  const topByMarketCap = [...coins]
    .filter((c) => (c.market_cap ?? 0) > 0)
    .sort((a, b) => (b.market_cap ?? 0) - (a.market_cap ?? 0))
    .slice(0, 4);

  const topVolume = [...coins]
    .filter((c) => (c.total_volume ?? 0) > 0)
    .sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0))
    .slice(0, 4);

  const topGainers = [...coins]
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h ?? 0) -
        (a.price_change_percentage_24h ?? 0)
    )
    .slice(0, 4);

  const topTable = [...coins]
    .sort((a, b) => (a.market_cap_rank ?? 999999) - (b.market_cap_rank ?? 999999))
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("market.overview.title")}
          </h1>
          <p className="text-sm md:text-base text-slate-500">
            {t("market.overview.subtitle")}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">
                {t("market.overview.totalMarketCap")}
              </span>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-lg font-semibold">
              {formatNumber(totalMarketCap * exchangeRate)} {getCurrencySymbol(userCurrency)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t("market.overview.basedOnTop")}
            </p>
          </div>

          <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">
                {t("market.overview.volume24h")}
              </span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-lg font-semibold">
              {formatNumber(totalVolume * exchangeRate)} {getCurrencySymbol(userCurrency)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t("market.overview.totalTradingVolume")}
            </p>
          </div>

          <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">
                {t("market.overview.coinsUp24h")}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-lg font-semibold">
              {positiveCount} / {coins.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t("market.overview.positiveCount")}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MarketCard
            title={t("market.overview.topByMarketCap")}
            icon={BarChart3}
            coins={topByMarketCap}
            onBuy={() => {}}
            userCurrency={userCurrency}
            exchangeRate={exchangeRate}
          />
          <MarketCard
            title={t("market.overview.topGainers24h")}
            icon={TrendingUp}
            coins={topGainers}
            onBuy={() => {}}
            userCurrency={userCurrency}
            exchangeRate={exchangeRate}
          />
          <MarketCard
            title={t("market.overview.topByVolume")}
            icon={Flame}
            coins={topVolume}
            onBuy={() => {}}
            userCurrency={userCurrency}
            exchangeRate={exchangeRate}
          />
        </section>

        <section className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm md:text-base font-semibold">
              {t("market.overview.top20")}
            </h2>
            <span className="text-xs text-slate-500">
              {t("market.overview.pricesIn", { currency: getCurrencySymbol(userCurrency) })}
            </span>
          </div>

          {/* Подписи колонок (планшет) */}
          <div className="hidden sm:flex lg:hidden items-center gap-3 px-5 pt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            <span className="w-5 text-center shrink-0">#</span>
            <span className="w-9 shrink-0" />
            <span className="flex-1 min-w-0">{t("market.coin")}</span>
            <span className="text-right shrink-0">
              {t("market.priceCur", { currency: getCurrencySymbol(userCurrency) })} / {t("market.change24h")}
            </span>
            <span className="px-3 text-sm invisible shrink-0">{t("market.buy")}</span>
          </div>

          {/* Мобильный/планшетный список — карточки */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse bg-slate-50 dark:bg-[#131416]/40" />
                ))
              : topTable.map((coin, index) => (
                  <div key={coin.id} className="p-2">
                    <CoinCard
                      coin={coin}
                      index={index + 1}
                      userCurrency={userCurrency}
                      exchangeRate={exchangeRate}
                      onBuy={() => {}}
                    />
                  </div>
                ))}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">{t("market.coin")}</th>
                  <th className="px-6 py-3 text-right">{t("market.priceCur", { currency: getCurrencySymbol(userCurrency) })}</th>
                  <th className="px-6 py-3 text-right">{t("market.change24h")}</th>
                  <th className="px-6 py-3 text-right hidden lg:table-cell">
                    {t("market.volume")}
                  </th>
                  <th className="px-6 py-3 text-right hidden xl:table-cell">
                    {t("market.marketCap")}
                  </th>
                  <th className="px-6 py-3 text-right">{t("market.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading
                  ? [...Array(8)].map((_, i) => (
                      <tr
                        key={i}
                        className="h-14 animate-pulse bg-slate-50 dark:bg-[#131416]/40"
                      >
                        <td colSpan={7}></td>
                      </tr>
                    ))
                  : topTable.map((coin, index) => (
                      <CoinRow
                        key={coin.id}
                        coin={coin}
                        index={index + 1}
                        userCurrency={userCurrency}
                        exchangeRate={exchangeRate}
                        onBuy={() => {}}
                        formatNumber={formatNumber}
                      />
                    ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
