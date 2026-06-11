"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CoinIcon } from "@/components/market/CoinIcon";
import { PriceChart } from "@/components/market/PriceChart";
import { BuyModal } from "@/components/market/BuyModal";
import { BinanceAPI, type Ticker24h } from "@/lib/api/binance";
import { coinDescriptions, type Locale } from "@/lib/coinsContent";
import { getCurrencySymbol } from "@/lib/currencies";
import { formatNumber } from "@/lib/format";
import { Coin, Candle, ChartRange } from "@/types/coin";
import { useTranslation } from "react-i18next";
import { useBuyFlow } from "@/hooks/useBuyFlow";

const LOCALES: Locale[] = ["ru", "en", "kk"];

// Ключ подписи диапазона графика — для подписей вроде «Максимум (7д)».
const RANGE_LABEL_KEY: Record<ChartRange, string> = {
  "24h": "market.chart.range24h",
  "7d": "market.chart.range7d",
  "30d": "market.chart.range30d",
  "1y": "market.chart.range1y",
  all: "market.chart.rangeAll",
};

export default function CoinDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const coinId = String(params?.coinId ?? "");

  const [coin, setCoin] = useState<Coin | null>(null);
  const [stats, setStats] = useState<Ticker24h | null>(null);
  const [loading, setLoading] = useState(true);

  // Свечи и диапазон выбранного графика — статистика «приводится» к ним.
  const [rangeCandles, setRangeCandles] = useState<Candle[]>([]);
  const [chartRange, setChartRange] = useState<ChartRange>("7d");
  // Исторические максимум/минимум (за всё доступное время пары).
  const [allTime, setAllTime] = useState<{ high: number; low: number } | null>(null);

  const flow = useBuyFlow();
  const { userCurrency, exchangeRate, openBuy, selectedCoin } = flow;

  const handleChartData = useCallback((candles: Candle[], range: ChartRange) => {
    setRangeCandles(candles);
    setChartRange(range);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setStats(null);
    BinanceAPI.getCoinById(coinId)
      .then((c) => {
        if (active) setCoin(c);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [coinId]);

  // Полная статистика за 24ч — после того, как известен символ монеты.
  useEffect(() => {
    if (!coin?.symbol) return;
    let active = true;
    BinanceAPI.get24hStats(coin.symbol).then((s) => {
      if (active) setStats(s);
    });
    return () => {
      active = false;
    };
  }, [coin?.symbol]);

  // Исторические максимум/минимум — из месячных свечей за всё время.
  useEffect(() => {
    if (!coin?.symbol) return;
    let active = true;
    setAllTime(null);
    BinanceAPI.getKlines(coin.symbol, "all").then((cs) => {
      if (!active || !cs.length) return;
      let high = -Infinity;
      let low = Infinity;
      for (const c of cs) {
        if (c.high > high) high = c.high;
        if (c.low < low) low = c.low;
      }
      setAllTime({ high, low });
    });
    return () => {
      active = false;
    };
  }, [coin?.symbol]);

  // Метрики за выбранный диапазон графика (макс/мин/открытие/изменение).
  const rangeMetrics = useMemo(() => {
    if (!rangeCandles.length) return null;
    let high = -Infinity;
    let low = Infinity;
    for (const c of rangeCandles) {
      if (c.high > high) high = c.high;
      if (c.low < low) low = c.low;
    }
    const open = rangeCandles[0].open;
    const close = rangeCandles[rangeCandles.length - 1].close;
    const changePct = open ? ((close - open) / open) * 100 : 0;
    return { high, low, open, changePct };
  }, [rangeCandles]);

  const priceChange = coin?.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;
  const convertedPrice = (coin?.current_price ?? 0) * exchangeRate;
  const currencySymbol = getCurrencySymbol(userCurrency);

  // Цена в валюте пользователя с подходящей точностью.
  const fmtPrice = (usd: number) => {
    const v = usd * exchangeRate;
    return `${v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: v < 1 ? 8 : 2,
    })} ${currencySymbol}`;
  };

  const lang = (i18n.language || "ru").split("-")[0];
  const locale: Locale = (LOCALES.includes(lang as Locale) ? lang : "ru") as Locale;
  const description = coin ? coinDescriptions[coin.id]?.[locale] : undefined;
  const rangeLabel = t(RANGE_LABEL_KEY[chartRange]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/market"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6"
          >
            <ArrowLeft size={16} />
            {t("market.title")}
          </Link>

          {loading ? (
            <div className="h-96 rounded-2xl animate-pulse bg-slate-100 dark:bg-[#131416]" />
          ) : !coin ? (
            <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 p-10 text-center text-slate-500">
              {t("market.chart.noData")}
            </div>
          ) : (
            <>
            <div className="bg-white dark:bg-[#131416] rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 p-4 md:p-6">
              {/* Шапка: монета, цена, изменение */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <CoinIcon src={coin.image} symbol={coin.symbol} className="w-12 h-12" />
                  <div>
                    <div className="text-xl font-bold">{coin.name}</div>
                    <div className="text-xs text-slate-500 uppercase">{coin.symbol}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {convertedPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: convertedPrice < 1 ? 8 : 2,
                    })}{" "}
                    {currencySymbol}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      isPositive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* График — в валюте пользователя */}
              <PriceChart
                symbol={coin.symbol}
                defaultRange="7d"
                height={360}
                priceMultiplier={exchangeRate}
                currencySymbol={currencySymbol}
                onData={handleChartData}
              />

              {/* Статистика: за выбранный диапазон + историческая + за 24ч */}
              {(rangeMetrics || allTime || stats) && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-slate-500 mb-3">
                    {t("market.detail.statsTitle")}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5">
                    {rangeMetrics && (
                      <>
                        <div>
                          <div className="text-xs text-slate-500">
                            {t("market.detail.changeRange", { range: rangeLabel })}
                          </div>
                          <div
                            className={`font-semibold ${
                              rangeMetrics.changePct >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {rangeMetrics.changePct >= 0 ? "+" : ""}
                            {rangeMetrics.changePct.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">
                            {t("market.detail.highRange", { range: rangeLabel })}
                          </div>
                          <div className="font-semibold">{fmtPrice(rangeMetrics.high)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">
                            {t("market.detail.lowRange", { range: rangeLabel })}
                          </div>
                          <div className="font-semibold">{fmtPrice(rangeMetrics.low)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">
                            {t("market.detail.openRange", { range: rangeLabel })}
                          </div>
                          <div className="font-semibold">{fmtPrice(rangeMetrics.open)}</div>
                        </div>
                      </>
                    )}

                    {allTime && (
                      <>
                        <div>
                          <div className="text-xs text-slate-500">{t("market.detail.ath")}</div>
                          <div className="font-semibold">{fmtPrice(allTime.high)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t("market.detail.atl")}</div>
                          <div className="font-semibold">{fmtPrice(allTime.low)}</div>
                        </div>
                      </>
                    )}

                    {stats && (
                      <>
                        <div>
                          <div className="text-xs text-slate-500">{t("market.detail.avgPrice")}</div>
                          <div className="font-semibold">{fmtPrice(stats.weightedAvg)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t("market.detail.volume24h")}</div>
                          <div className="font-semibold">
                            {formatNumber(stats.quoteVolume * exchangeRate)} {currencySymbol}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">
                            {t("market.detail.volumeCoin", { symbol: coin.symbol.toUpperCase() })}
                          </div>
                          <div className="font-semibold">{formatNumber(stats.volume)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t("market.detail.trades24h")}</div>
                          <div className="font-semibold">{stats.trades.toLocaleString()}</div>
                        </div>
                      </>
                    )}

                    <div>
                      <div className="text-xs text-slate-500">{t("market.marketCap")}</div>
                      <div className="font-semibold">
                        {formatNumber((coin.market_cap ?? 0) * exchangeRate)} {currencySymbol}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Покупка */}
              <button
                onClick={() => openBuy(coin)}
                className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {t("market.trade")}
              </button>
            </div>

            {/* О монете */}
            <div className="bg-white dark:bg-[#131416] rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 p-4 md:p-6 mt-6">
              <h2 className="text-lg font-bold mb-3">
                {t("market.detail.aboutTitle", { name: coin.name })}
              </h2>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {(description ?? [
                  t("market.detail.genericAbout", {
                    name: coin.name,
                    symbol: coin.symbol.toUpperCase(),
                  }),
                ]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 italic">
                {t("market.detail.disclaimer")}
              </p>
            </div>
            </>
          )}
        </div>
      </div>

      {selectedCoin && <BuyModal flow={flow} />}

      <Footer />
    </div>
  );
}
