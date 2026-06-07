"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CoinIcon } from "@/components/market/CoinIcon";
import { PriceChart } from "@/components/market/PriceChart";
import { BuyModal } from "@/components/market/BuyModal";
import { BinanceAPI } from "@/lib/api/binance";
import { getCurrencySymbol } from "@/lib/currencies";
import { formatNumber } from "@/lib/format";
import { Coin } from "@/types/coin";
import { useTranslation } from "react-i18next";
import { useBuyFlow } from "@/hooks/useBuyFlow";

export default function CoinDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const coinId = String(params?.coinId ?? "");

  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);

  const flow = useBuyFlow();
  const { userCurrency, exchangeRate, openBuy, selectedCoin } = flow;

  useEffect(() => {
    let active = true;
    setLoading(true);
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

  const priceChange = coin?.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;
  const convertedPrice = (coin?.current_price ?? 0) * exchangeRate;
  const currencySymbol = getCurrencySymbol(userCurrency);

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
              />

              {/* Метрики + покупка */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <div>
                  <div className="text-xs text-slate-500">{t("market.volume")}</div>
                  <div className="font-semibold">
                    {formatNumber(coin.total_volume ?? 0)} {currencySymbol}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">{t("market.marketCap")}</div>
                  <div className="font-semibold">
                    {formatNumber((coin.market_cap ?? 0) * exchangeRate)} {currencySymbol}
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => openBuy(coin)}
                    className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    {t("market.trade")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedCoin && <BuyModal flow={flow} />}

      <Footer />
    </div>
  );
}
