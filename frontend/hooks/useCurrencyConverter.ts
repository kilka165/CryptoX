import { useMemo } from "react";
import { useRates } from "@/components/RatesProvider";

/**
 * Конвертирует сумму из USD в выбранную валюту и возвращает её отформатированной.
 * Курсы берутся из единого RatesProvider (бэкенд /api/currency/rates с серверным кэшем).
 */
export function useCurrencyConverter(baseAmountUSD: number, targetCurrency: string) {
  const { convert, loading } = useRates();

  const convertedAmount = useMemo(() => {
    const target = (targetCurrency || "USD").toUpperCase();
    if (target === "USD") {
      return baseAmountUSD.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      });
    }

    const result = convert(baseAmountUSD, "USD", target);

    try {
      return result.toLocaleString("ru-RU", {
        style: "currency",
        currency: target,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      // Неизвестный код валюты для Intl — просто число + тикер
      return `${result.toLocaleString("ru-RU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${target}`;
    }
  }, [baseAmountUSD, targetCurrency, convert]);

  return { convertedAmount, loading };
}
