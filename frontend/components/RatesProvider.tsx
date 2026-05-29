"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

// Запасные курсы относительно USD на случай, если бэкенд недоступен.
// Используются ТОЛЬКО при провале и первой отрисовке до загрузки данных.
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  RUB: 90,
  KZT: 450,
  GBP: 0.79,
  CNY: 7.24,
  JPY: 150,
  AUD: 1.52,
  CAD: 1.35,
  CHF: 0.88,
  INR: 83.2,
  BRL: 4.97,
  TRY: 33.5,
  MXN: 17.2,
  ZAR: 18.2,
  UAH: 41.2,
  BYN: 3.27,
  KRW: 1320,
  HKD: 7.83,
  SGD: 1.35,
  SEK: 10.4,
  NOK: 10.6,
  DKK: 6.87,
  PLN: 3.98,
  CZK: 22.8,
  HUF: 355,
  THB: 34.8,
  AED: 3.67,
  ILS: 3.65,
  IDR: 15750,
  MYR: 4.47,
  PHP: 56.5,
  VND: 25350,
  SAR: 3.75,
  GEL: 2.7,
  AMD: 387.5,
  AZN: 1.7,
  KGS: 84.5,
  UZS: 12750,
  NZD: 1.63,
};

const STORAGE_KEY = "currency_rates_cache";
const STORAGE_TTL_MS = 60 * 60 * 1000; // 1 час — синхронно с бэкенд-кэшем

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

type RatesMap = Record<string, number>;

interface RatesContextValue {
  rates: RatesMap;
  loading: boolean;
  /** Курс валюты к USD (USD → 1; неизвестная → 1). */
  getRate: (currency: string) => number;
  /** Конвертация суммы между валютами через USD-базу. */
  convert: (amount: number, from: string, to: string) => number;
}

const RatesContext = createContext<RatesContextValue | null>(null);

function readCachedRates(): RatesMap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { rates: RatesMap; savedAt: number };
    if (!parsed?.rates || typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) return null;
    return parsed.rates;
  } catch {
    return null;
  }
}

function writeCachedRates(rates: RatesMap) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ rates, savedAt: Date.now() })
    );
  } catch {
    // localStorage может быть недоступен — игнорируем
  }
}

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<RatesMap>(FALLBACK_RATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const cached = readCachedRates();
    if (cached) {
      setRates({ ...FALLBACK_RATES, ...cached });
      setLoading(false);
    }

    axios
      .get(`${API_URL}/currency/rates`, { timeout: 10000 })
      .then((res) => {
        if (!active) return;
        const fresh = res.data?.rates as RatesMap | undefined;
        if (fresh && typeof fresh === "object") {
          const merged = { ...FALLBACK_RATES, ...fresh };
          setRates(merged);
          writeCachedRates(fresh);
        }
      })
      .catch((err) => {
        console.error("Failed to load currency rates:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const getRate = useCallback(
    (currency: string): number => {
      const code = (currency || "USD").toUpperCase();
      if (code === "USD") return 1;
      const value = rates[code];
      return typeof value === "number" && value > 0 ? value : 1;
    },
    [rates]
  );

  const convert = useCallback(
    (amount: number, from: string, to: string): number => {
      const f = (from || "USD").toUpperCase();
      const t = (to || "USD").toUpperCase();
      if (f === t) return amount;
      const fromRate = getRate(f);
      const toRate = getRate(t);
      if (fromRate <= 0) return amount;
      return (amount * toRate) / fromRate;
    },
    [getRate]
  );

  const value = useMemo<RatesContextValue>(
    () => ({ rates, loading, getRate, convert }),
    [rates, loading, getRate, convert]
  );

  return <RatesContext.Provider value={value}>{children}</RatesContext.Provider>;
}

export function useRates(): RatesContextValue {
  const ctx = useContext(RatesContext);
  if (ctx) return ctx;
  // Безопасный фоллбэк, если кто-то использует хук вне провайдера.
  return {
    rates: FALLBACK_RATES,
    loading: false,
    getRate: (currency: string) => {
      const code = (currency || "USD").toUpperCase();
      if (code === "USD") return 1;
      const v = FALLBACK_RATES[code];
      return typeof v === "number" && v > 0 ? v : 1;
    },
    convert: (amount: number, from: string, to: string) => {
      const f = (from || "USD").toUpperCase();
      const t = (to || "USD").toUpperCase();
      if (f === t) return amount;
      const fromRate = FALLBACK_RATES[f] ?? 1;
      const toRate = FALLBACK_RATES[t] ?? 1;
      return fromRate > 0 ? (amount * toRate) / fromRate : amount;
    },
  };
}
