import { useState, useEffect } from "react";
import axios from "axios";

// Список валют, которые мы поддерживаем
const SUPPORTED_CURRENCIES = ["USD", "EUR", "RUB", "KZT", "GBP", "CNY"];

interface Rates {
  [key: string]: number;
}

export function useCurrencyConverter(baseAmountUSD: number, targetCurrency: string) {
  const [convertedAmount, setConvertedAmount] = useState<string>("...");
  const [rates, setRates] = useState<Rates>({});
  const [loading, setLoading] = useState(true);

  // 1. Загружаем курсы валют (один раз при загрузке сайта)
  useEffect(() => {
    // Проверяем, есть ли кэш в sessionStorage (чтобы не спамить запросами)
    const cachedRates = sessionStorage.getItem("exchange_rates");
    if (cachedRates) {
      setRates(JSON.parse(cachedRates));
      setLoading(false);
      return;
    }

    // Если нет кэша - грузим с бесплатного API
    axios
      .get("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => {
        const fetchedRates = response.data.rates;
        setRates(fetchedRates);
        setLoading(false);
        // Сохраняем в кэш сессии (обновится при закрытии вкладки)
        sessionStorage.setItem("exchange_rates", JSON.stringify(fetchedRates));
      })
      .catch((err) => {
        console.error("Ошибка загрузки курсов", err);
        setLoading(false);
      });
  }, []);

  // 2. Пересчитываем при изменении суммы или валюты
  useEffect(() => {
    if (loading || !rates[targetCurrency]) return;

    if (targetCurrency === "USD") {
      setConvertedAmount(
        baseAmountUSD.toLocaleString("en-US", { style: "currency", currency: "USD" })
      );
    } else {
      const rate = rates[targetCurrency];
      const result = baseAmountUSD * rate;
      
      // Форматируем красиво (например: 12 500 ₽)
      setConvertedAmount(
        result.toLocaleString("ru-RU", { 
          style: "currency", 
          currency: targetCurrency 
        })
      );
    }
  }, [baseAmountUSD, targetCurrency, rates, loading]);

  return { convertedAmount, loading };
}
