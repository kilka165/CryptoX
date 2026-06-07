"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { BinanceAPI } from "@/lib/api/binance";
import { formatNumber } from "@/lib/format";
import { ChartRange } from "@/types/coin";

const RANGES: { key: ChartRange; labelKey: string }[] = [
  { key: "24h", labelKey: "market.chart.range24h" },
  { key: "7d", labelKey: "market.chart.range7d" },
  { key: "30d", labelKey: "market.chart.range30d" },
  { key: "1y", labelKey: "market.chart.range1y" },
  { key: "all", labelKey: "market.chart.rangeAll" },
];

// Часы на оси нужны только для внутридневных диапазонов (свечи 1h/4h);
// для дневных и крупнее (30д/1г/Всё) показываем только дату.
const isIntradayRange = (range: ChartRange) => range === "24h" || range === "7d";

// Сколько знаков после запятой нужно, чтобы показать дешёвую монету
// (напр. SHIB ≈ 0.00002): ~4 значащих цифры, не больше 8 знаков.
const priceDecimals = (abs: number) =>
  abs >= 1 || abs === 0 ? 2 : Math.min(8, Math.ceil(-Math.log10(abs)) + 3);

// Подпись цены: компактно для крупных значений (1.23M), с нужной точностью —
// для мелких (0.002290). Пустой символ валюты допустим.
const formatChartPrice = (price: number, currencySymbol: string) => {
  const abs = Math.abs(price);
  if (abs >= 1000) return `${currencySymbol}${formatNumber(price)}`;
  return `${currencySymbol}${price.toFixed(priceDecimals(abs))}`;
};

// Минимальный шаг шкалы цены — без него (дефолт 0.01) диапазон дешёвой монеты
// схлопывается в один «0.00».
const priceMinMove = (refPrice: number) => {
  const abs = Math.abs(refPrice);
  return abs >= 1 ? 0.01 : Math.pow(10, -priceDecimals(abs));
};

const themeOptions = (isDark: boolean) => ({
  layout: { textColor: isDark ? "#94a3b8" : "#475569" },
  grid: {
    vertLines: { color: isDark ? "#1e293b" : "#e2e8f0" },
    horzLines: { color: isDark ? "#1e293b" : "#e2e8f0" },
  },
  rightPriceScale: { borderColor: isDark ? "#334155" : "#cbd5e1" },
  timeScale: { borderColor: isDark ? "#334155" : "#cbd5e1" },
});

interface PriceChartProps {
  symbol: string;
  defaultRange?: ChartRange;
  height?: number;
  /** Курс выбранной валюты к USD — свечи отображаются в валюте пользователя. */
  priceMultiplier?: number;
  /** Символ валюты для подписей оси цены. */
  currencySymbol?: string;
}

// Свечной график цены монеты (Binance klines через бэкенд). Переиспользуется
// на странице монеты и в BuyModal. График создаётся только на клиенте.
export function PriceChart({
  symbol,
  defaultRange = "7d",
  height = 320,
  priceMultiplier = 1,
  currencySymbol = "",
}: PriceChartProps) {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [range, setRange] = useState<ChartRange>(defaultRange);
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  // Создание графика — один раз на смонтированный компонент.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        attributionLogo: false,
      },
      crosshair: { mode: 0 },
      timeScale: { secondsVisible: false },
    });
    chart.applyOptions(themeOptions(isDark));

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderUpColor: "#16a34a",
      borderDownColor: "#dc2626",
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Перекраска под тему без пересоздания графика.
  useEffect(() => {
    chartRef.current?.applyOptions(themeOptions(isDark));
  }, [isDark]);

  // Загрузка данных при смене монеты, диапазона, курса или валюты.
  useEffect(() => {
    let active = true;
    setStatus("loading");

    // Для месяца и крупнее убираем время (часы) с оси — только дата.
    chartRef.current?.applyOptions({
      timeScale: { timeVisible: isIntradayRange(range), secondsVisible: false },
    });

    BinanceAPI.getKlines(symbol, range)
      .then((candles) => {
        if (!active) return;
        const series = seriesRef.current;
        if (!series) return;
        if (!candles.length) {
          series.setData([]);
          setStatus("empty");
          return;
        }

        const data = candles.map((c) => ({
          time: c.time as UTCTimestamp,
          open: c.open * priceMultiplier,
          high: c.high * priceMultiplier,
          low: c.low * priceMultiplier,
          close: c.close * priceMultiplier,
        }));

        // Точность шкалы/подписей подбираем под величину цены (дешёвые монеты
        // вроде SHIB требуют больше знаков, иначе всё схлопывается в 0.00).
        const refPrice = data.reduce((max, c) => Math.max(max, c.high), 0);
        series.applyOptions({
          priceFormat: {
            type: "custom",
            minMove: priceMinMove(refPrice),
            formatter: (price: number) => formatChartPrice(price, currencySymbol),
          },
        });
        series.setData(data);
        chartRef.current?.timeScale().fitContent();
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [symbol, range, priceMultiplier, currencySymbol]);

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-3">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              range === r.key
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t(r.labelKey)}
          </button>
        ))}
      </div>

      <div className="relative" style={{ height }}>
        <div ref={containerRef} className="w-full h-full" />
        {status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 bg-white/60 dark:bg-[#131416]/60">
            {status === "error"
              ? t("market.chart.error")
              : status === "empty"
              ? t("market.chart.noData")
              : t("market.chart.loading")}
          </div>
        )}
      </div>
    </div>
  );
}
