// frontend/components/p2p/P2PBuyModal.tsx
import React, { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, AlertCircle, Wallet, BarChart3 } from "lucide-react";
import { P2POffer } from "@/lib/api/p2pApi";
import { BinanceAPI } from "@/lib/api/binance";
import axios from "axios";

interface P2PBuyModalProps {
  isOpen: boolean;
  offer: P2POffer | null;
  onClose: () => void;
  onConfirm: (fiatAmount: number, cryptoAmount: number) => void;
}

export function P2PBuyModal({
  isOpen,
  offer,
  onClose,
  onConfirm,
}: P2PBuyModalProps) {
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [loadingMarketPrice, setLoadingMarketPrice] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isOpen) {
      setCryptoAmount("");
      setFiatAmount("");
      setError("");
      setMarketPrice(null);
      setExchangeRates({});
    }
  }, [isOpen]);

  // Конвертация USD в выбранную валюту
  const convertFromUSD = (amountUSD: number, toCurrency: string): number => {
    if (toCurrency === "USD") return amountUSD;
    const rate = exchangeRates[toCurrency] || 1;
    return amountUSD * rate;
  };

  // Получаем рыночную цену
  const fetchMarketPrice = async (cryptoName: string, currency: string, rates: Record<string, number>) => {
    setLoadingMarketPrice(true);
    try {
      const coins = await BinanceAPI.get24hPrices();
      const coin = coins.find(c => c.name.toLowerCase() === cryptoName.toLowerCase());
      
      if (coin && coin.current_price) {
        const priceInUSD = coin.current_price;
        // Используем переданные курсы вместо state
        const rate = rates[currency] || 1;
        const priceInCurrency = currency === "USD" ? priceInUSD : priceInUSD * rate;
        
        setMarketPrice(priceInCurrency);
        console.log("💰 Market price loaded:", {
          crypto: cryptoName,
          priceUSD: priceInUSD,
          currency,
          rate,
          priceInCurrency
        });
      }
    } catch (error) {
      console.error("Failed to fetch market price:", error);
      setMarketPrice(null);
    } finally {
      setLoadingMarketPrice(false);
    }
  };

  // Загружаем курсы и рыночную цену при открытии
  useEffect(() => {
    if (isOpen && offer) {
      const fetchData = async () => {
        try {
          // Сначала загружаем курсы
          const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
          const rates = response.data.rates || {
            USD: 1,
            KZT: 450,
            RUB: 90,
            EUR: 0.85,
            GBP: 0.73,
          };
          
          setExchangeRates(rates);
          
          // Затем загружаем рыночную цену с уже полученными курсами
          await fetchMarketPrice(offer.crypto_currency, offer.currency, rates);
        } catch (error) {
          console.error("Failed to fetch exchange rates:", error);
          // Fallback курсы
          const fallbackRates = {
            USD: 1,
            KZT: 450,
            RUB: 90,
            EUR: 0.85,
            GBP: 0.73,
          };
          setExchangeRates(fallbackRates);
          await fetchMarketPrice(offer.crypto_currency, offer.currency, fallbackRates);
        }
      };

      fetchData();
    }
  }, [isOpen, offer]);

  // Рассчитываем минимальное количество криптовалюты на основе цены
  const getMinCryptoAmount = (price: number) => {
    if (price < 1000) {
      return 0.1;
    } else if (price < 10000) {
      return 0.01;
    } else if (price < 100000) {
      return 0.001;
    } else {
      return 0.0001;
    }
  };

  if (!isOpen || !offer) return null;

  const isBuying = offer.type === "sell";
  const isSelling = offer.type === "buy";

  const minCryptoAmount = getMinCryptoAmount(offer.price);
  const minFiatAmount = minCryptoAmount * offer.price;

  // Рассчитываем разницу с рынком
  const priceDifference = marketPrice ? ((offer.price - marketPrice) / marketPrice) * 100 : null;

  const handleCryptoChange = (value: string) => {
    setCryptoAmount(value);
    setError("");

    if (value && !isNaN(parseFloat(value))) {
      const crypto = parseFloat(value);
      const calculatedFiat = crypto * offer.price;
      setFiatAmount(calculatedFiat.toFixed(2));
    } else {
      setFiatAmount("");
    }
  };

  const handleFiatChange = (value: string) => {
    setFiatAmount(value);
    setError("");

    if (value && !isNaN(parseFloat(value))) {
      const fiat = parseFloat(value);
      const calculatedCrypto = fiat / offer.price;
      setCryptoAmount(calculatedCrypto.toFixed(8));
    } else {
      setCryptoAmount("");
    }
  };

  const handleConfirm = async () => {
    if (!cryptoAmount || !fiatAmount) {
      setError("Введите количество");
      return;
    }

    const cryptoNum = parseFloat(cryptoAmount);
    const fiatNum = parseFloat(fiatAmount);

    if (cryptoNum <= 0 || fiatNum <= 0) {
      setError("Значения должны быть больше нуля");
      return;
    }

    if (cryptoNum < minCryptoAmount) {
      setError(`Минимальное количество: ${minCryptoAmount} ${offer.crypto_currency} (≈${minFiatAmount.toFixed(2)} ${offer.currency})`);
      return;
    }

    if (cryptoNum > offer.available_amount) {
      setError(`Максимум доступно: ${offer.available_amount} ${offer.crypto_currency}`);
      return;
    }

    if (fiatNum < offer.min_limit) {
      setError(`Минимальная сумма: ${offer.min_limit} ${offer.currency}`);
      return;
    }

    if (fiatNum > offer.max_limit) {
      setError(`Максимальная сумма: ${offer.max_limit} ${offer.currency}`);
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(fiatNum, cryptoNum);
      onClose();
    } catch (err) {
      setError("Ошибка при создании сделки");
    } finally {
      setIsProcessing(false);
    }
  };

  const setPercentage = (percent: number) => {
    const cryptoValue = (offer.available_amount * percent) / 100;
    handleCryptoChange(cryptoValue.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {isBuying ? (
              <>
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold">Купить {offer.crypto_currency}</h3>
              </>
            ) : (
              <>
                <TrendingDown className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Продать {offer.crypto_currency}</h3>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Информация о продавце */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {offer.seller_name[0].toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{offer.seller_name}</div>
              <div className="text-sm text-slate-500">
                {offer.orders_count} сделок | {offer.completion_rate}% выполнено
              </div>
            </div>
          </div>

          {/* Цена с рыночным сравнением */}
          <div className="space-y-2">
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <span className="text-sm text-slate-600 dark:text-slate-400">Цена заявки</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {offer.price.toLocaleString()} {offer.currency}
              </span>
            </div>

            {/* Рыночная цена */}
            {loadingMarketPrice ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                <span className="text-xs text-slate-500">Загрузка рыночной цены...</span>
              </div>
            ) : marketPrice && priceDifference !== null ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Рыночная цена: <strong>{marketPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {offer.currency}</strong>
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  priceDifference > 0 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                    : priceDifference < 0
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {priceDifference > 0 ? '+' : ''}{priceDifference.toFixed(2)}%
                </span>
              </div>
            ) : null}
          </div>

          {/* Доступно */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Доступно</span>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="w-4 h-4 text-slate-400" />
              {offer.available_amount.toLocaleString()} {offer.crypto_currency}
            </div>
          </div>

          {isBuying ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Я получу ({offer.crypto_currency})
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={cryptoAmount}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    placeholder={`Мин: ${minCryptoAmount}`}
                    className="w-full px-4 py-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {offer.crypto_currency}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Минимум: {minCryptoAmount} {offer.crypto_currency} (≈{minFiatAmount.toFixed(2)} {offer.currency})
                </div>
                <div className="flex gap-2 mt-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setPercentage(percent)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Я плачу ({offer.currency})
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fiatAmount}
                    onChange={(e) => handleFiatChange(e.target.value)}
                    placeholder={`0.00 ${offer.currency}`}
                    className="w-full px-4 py-3 pr-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {offer.currency}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Лимит: {offer.min_limit.toLocaleString()} - {offer.max_limit.toLocaleString()} {offer.currency}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Я отдаю ({offer.crypto_currency})
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={cryptoAmount}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    placeholder={`Мин: ${minCryptoAmount}`}
                    className="w-full px-4 py-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {offer.crypto_currency}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Минимум: {minCryptoAmount} {offer.crypto_currency} (≈{minFiatAmount.toFixed(2)} {offer.currency})
                </div>
                <div className="flex gap-2 mt-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setPercentage(percent)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Я получу ({offer.currency})
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fiatAmount}
                    onChange={(e) => handleFiatChange(e.target.value)}
                    placeholder={`0.00 ${offer.currency}`}
                    className="w-full px-4 py-3 pr-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {offer.currency}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Лимит: {offer.min_limit.toLocaleString()} - {offer.max_limit.toLocaleString()} {offer.currency}
                </div>
              </div>
            </>
          )}

          {/* Ошибка */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || !cryptoAmount || !fiatAmount}
              className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isBuying 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Обработка...
                </>
              ) : (
                <>{isBuying ? 'Купить' : 'Продать'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
