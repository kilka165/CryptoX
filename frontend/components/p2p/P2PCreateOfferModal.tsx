// frontend/components/p2p/P2PCreateOfferModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle2, Plus, Wallet, TrendingUp, BarChart3 } from "lucide-react";
import { p2pApi } from "@/lib/api/p2pApi";
import { currencies } from "@/lib/currencies";
import { BinanceAPI } from "@/lib/api/binance";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";
import { intlLocale } from "@/lib/utils/locale";

interface P2PCreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cryptoOptions: string[];
}

interface UserAsset {
  name: string;
  symbol: string;
  amount: number;
}

interface WalletBalance {
  balance: number;
  currency: string;
}

export function P2PCreateOfferModal({
  isOpen,
  onClose,
  onSuccess,
  cryptoOptions,
}: P2PCreateOfferModalProps) {
  const { t, i18n } = useTranslation();
  const { convert } = useRates();
  const [type, setType] = useState<"buy" | "sell">("sell");
  const [cryptoCurrency, setCryptoCurrency] = useState("Bitcoin");
  const [displayCurrency, setDisplayCurrency] = useState("RUB");
  const [pricePerCrypto, setPricePerCrypto] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [loadingMarketPrice, setLoadingMarketPrice] = useState(false);

  const [userAssets, setUserAssets] = useState<UserAsset[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);

  const [loadingData, setLoadingData] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasFetchedData = useRef(false);

  // Конвертации курсов идут через единый RatesProvider (бэкенд /api/currency/rates).
  const convertFromUSD = (amountUSD: number, toCurrency: string): number =>
    convert(amountUSD, "USD", toCurrency);
  const convertToUSD = (amount: number, fromCurrency: string): number =>
    convert(amount, fromCurrency, "USD");

  // Получаем рыночную цену криптовалюты
  const fetchMarketPrice = async (cryptoName: string, currency: string) => {
    setLoadingMarketPrice(true);
    try {
      const coins = await BinanceAPI.get24hPrices();
      const coin = coins.find(c => c.name.toLowerCase() === cryptoName.toLowerCase());
      
      if (coin && coin.current_price) {
        const priceInUSD = coin.current_price;
        const priceInCurrency = convertFromUSD(priceInUSD, currency);
        setMarketPrice(priceInCurrency);
        setPricePerCrypto(priceInCurrency.toFixed(2));
        console.log("💰 Market price loaded:", {
          crypto: cryptoName,
          priceUSD: priceInUSD,
          currency,
          priceInCurrency
        });
      } else {
        console.warn("Market price not found for:", cryptoName);
        setMarketPrice(null);
      }
    } catch (error) {
      console.error("Failed to fetch market price:", error);
      setMarketPrice(null);
    } finally {
      setLoadingMarketPrice(false);
    }
  };

  // Загружаем данные пользователя
  useEffect(() => {
    if (!isOpen || hasFetchedData.current) {
      return;
    }

    const fetchUserData = async () => {
      setLoadingData(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        // Параллельно загружаем активы и баланс кошелька (курсы валют — из RatesProvider).
        const [assetsResponse, walletResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/user/assets", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/wallet/balance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("📦 Assets response:", assetsResponse.data);
        console.log("💰 Wallet response:", walletResponse.data);

        // Обрабатываем активы
        const assets: UserAsset[] = assetsResponse.data.map((asset: any) => ({
          name: asset.name || asset.coin_name,
          symbol: asset.symbol || asset.coin_symbol,
          amount: parseFloat(asset.amount || 0),
        }));

        setUserAssets(assets);
        setWalletBalance({
          balance: parseFloat(walletResponse.data.balance || 0),
          currency: "USD",
        });

        // Устанавливаем первую доступную крипту для продажи
        if (type === "sell" && assets.length > 0) {
          setCryptoCurrency(assets[0].name);
        }
        
        hasFetchedData.current = true;
      } catch (err) {
        console.error("❌ Error loading user data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [isOpen, type]);

  // Загружаем рыночную цену при изменении криптовалюты или валюты
  useEffect(() => {
    if (cryptoCurrency && displayCurrency) {
      fetchMarketPrice(cryptoCurrency, displayCurrency);
    }
  }, [cryptoCurrency, displayCurrency, convert]);

  useEffect(() => {
    if (!isOpen) {
      hasFetchedData.current = false;
    }
  }, [isOpen]);

  // Получаем релевантный баланс
  const getRelevantBalance = () => {
    if (type === "sell") {
      const asset = userAssets.find((a) => a.name === cryptoCurrency);
      return {
        amount: asset?.amount || 0,
        currency: asset?.symbol || cryptoCurrency,
        isUSD: false,
      };
    } else {
      const usdBalance = walletBalance?.balance || 0;
      const displayAmount = convertFromUSD(usdBalance, displayCurrency);
      return {
        amount: displayAmount,
        currency: displayCurrency,
        isUSD: true,
        originalUSD: usdBalance,
      };
    }
  };

  const balanceInfo = getRelevantBalance();

  // Расчёт общей стоимости в выбранной валюте
  const totalInDisplayCurrency = pricePerCrypto && cryptoAmount 
    ? (parseFloat(pricePerCrypto) * parseFloat(cryptoAmount))
    : 0;

  // Расчёт общей стоимости в USD (для проверки баланса)
  const totalInUSD = convertToUSD(totalInDisplayCurrency, displayCurrency);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pricePerCrypto || !cryptoAmount) {
      setError(t("p2p.createModal.fillAllFields"));
      return;
    }

    const priceNum = parseFloat(pricePerCrypto);
    const amountNum = parseFloat(cryptoAmount);

    if (priceNum <= 0 || amountNum <= 0) {
      setError(t("p2p.createModal.allPositive"));
      return;
    }

    // Проверка баланса
    if (type === "sell") {
      const cryptoAsset = userAssets.find((a) => a.name === cryptoCurrency);
      const availableCrypto = cryptoAsset?.amount || 0;

      if (amountNum > availableCrypto) {
        setError(t("p2p.createModal.insufficientCrypto", { crypto: cryptoCurrency, amount: availableCrypto.toFixed(8) }));
        return;
      }
    } else {
      const availableUSD = walletBalance?.balance || 0;

      if (totalInUSD > availableUSD) {
        setError(
          t("p2p.createModal.insufficientFunds", { usd: totalInUSD.toFixed(2), local: totalInDisplayCurrency.toFixed(2), currency: displayCurrency, available: availableUSD.toFixed(2) })
        );
        return;
      }
    }

    const minLimit = parseFloat((totalInDisplayCurrency * 0.01).toFixed(2));
    const maxLimit = parseFloat(totalInDisplayCurrency.toFixed(2));

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert(t("common.authRequired"));
        window.location.href = "/login";
        return;
      }

      console.log("📤 Creating offer:", {
        crypto_currency: cryptoCurrency,
        currency: displayCurrency,
        price: priceNum,
        min_limit: minLimit,
        max_limit: maxLimit,
        available_amount: amountNum,
        type,
        estimated_usd: totalInUSD,
      });

      await p2pApi.createOffer(token, {
        crypto_currency: cryptoCurrency,
        currency: displayCurrency,
        price: priceNum,
        min_limit: minLimit,
        max_limit: maxLimit,
        available_amount: amountNum,
        type,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 1500);
    } catch (err: any) {
      console.error("❌ Error creating offer:", err);
      setError(err.response?.data?.message || t("p2p.createModal.createError"));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setPricePerCrypto("");
    setCryptoAmount("");
    setMarketPrice(null);
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeChange = (newType: "buy" | "sell") => {
    setType(newType);
    setCryptoAmount("");
    setPricePerCrypto("");
    setError("");
    
    if (newType === "buy" && cryptoOptions.length > 0) {
      setCryptoCurrency(cryptoOptions[0] || "Bitcoin");
    } else if (newType === "sell" && userAssets.length > 0) {
      setCryptoCurrency(userAssets[0].name);
    }
  };

  const handleMaxClick = () => {
    if (type === "sell") {
      const cryptoAsset = userAssets.find((a) => a.name === cryptoCurrency);
      const maxCrypto = cryptoAsset?.amount || 0;
      setCryptoAmount(maxCrypto.toString());
    } else {
      if (pricePerCrypto && parseFloat(pricePerCrypto) > 0) {
        const availableUSD = walletBalance?.balance || 0;
        const priceInUSD = convertToUSD(parseFloat(pricePerCrypto), displayCurrency);
        const maxCrypto = availableUSD / priceInUSD;
        setCryptoAmount(maxCrypto.toFixed(8));
      } else {
        setError(t("p2p.createModal.enterPriceFirst"));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#131416] z-10">
          <div className="flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">
              {type === "sell" ? t("p2p.createModal.sellTitle") : t("p2p.createModal.buyTitle")}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Тип заявки */}
          <div>
            <label className="block text-sm font-medium mb-2">{t("p2p.createModal.offerType")}</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange("sell")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  type === "sell"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {t("p2p.createModal.sellTitle")}
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("buy")}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  type === "buy"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {t("p2p.createModal.buyTitle")}
              </button>
            </div>
          </div>

          {/* Выбор криптовалюты и валюты отображения */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === "sell" ? t("p2p.createModal.selling") : t("p2p.createModal.buying")}
              </label>
              <select
                value={cryptoCurrency}
                onChange={(e) => setCryptoCurrency(e.target.value)}
                disabled={loadingData}
                className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              >
                {loadingData ? (
                  <option value="">{t("common.loading")}</option>
                ) : type === "sell" ? (
                  userAssets.length > 0 ? (
                    userAssets.map((asset) => (
                      <option key={asset.name} value={asset.name}>
                        {asset.symbol}
                      </option>
                    ))
                  ) : (
                    <option value="">{t("p2p.createModal.noAssets")}</option>
                  )
                ) : (
                  cryptoOptions.map((crypto) => (
                    <option key={crypto} value={crypto}>
                      {crypto}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("p2p.createModal.priceCurrency")}
              </label>
              <select
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Показываем доступный баланс */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t("p2p.createModal.available")}
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {balanceInfo.amount.toLocaleString(intlLocale(i18n.language), {
                minimumFractionDigits: 2,
                maximumFractionDigits: balanceInfo.isUSD ? 2 : 8
              })} {balanceInfo.currency}
            </div>
          </div>

          {/* Цена за 1 единицу криптовалюты */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                {t("p2p.createModal.pricePerUnit", { unit: userAssets.find(a => a.name === cryptoCurrency)?.symbol || cryptoCurrency })}
              </label>
              {marketPrice && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{t("p2p.createModal.market", { price: marketPrice.toLocaleString(intlLocale(i18n.language), { minimumFractionDigits: 2, maximumFractionDigits: 2 }), currency: displayCurrency })}</span>
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={pricePerCrypto}
                onChange={(e) => setPricePerCrypto(e.target.value)}
                placeholder={loadingMarketPrice ? t("common.loading") : marketPrice ? marketPrice.toFixed(2) : "480.50"}
                disabled={loadingMarketPrice}
                className="w-full px-4 py-3 pr-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                {displayCurrency}
              </span>
            </div>

            {/* Блок отклонения от рыночной цены */}
            {marketPrice && pricePerCrypto && !isNaN(parseFloat(pricePerCrypto)) && (() => {
              const entered = parseFloat(pricePerCrypto);
              const diffAbs = entered - marketPrice;
              const diffPct = (diffAbs / marketPrice) * 100;
              const isAbove = diffAbs > 0;
              const isBelow = diffAbs < 0;
              return (
                <div className="mt-2 flex items-center gap-2 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {t("p2p.createModal.deviation", {
                      sign: isAbove ? "+" : isBelow ? "−" : "",
                      pct: Math.abs(diffPct).toFixed(2),
                      abs: Math.abs(diffAbs).toLocaleString(intlLocale(i18n.language), {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }),
                      currency: displayCurrency,
                      direction: isAbove
                        ? t("p2p.createModal.aboveMarket")
                        : t("p2p.createModal.belowMarket"),
                    })}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Количество криптовалюты */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("p2p.createModal.amountOf", { unit: userAssets.find(a => a.name === cryptoCurrency)?.symbol || cryptoCurrency })}
              <button
                type="button"
                onClick={handleMaxClick}
                className="ml-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-normal"
              >
                {t("p2p.createModal.maximum")}
              </button>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                placeholder="0.01"
                className="w-full px-4 py-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                {userAssets.find(a => a.name === cryptoCurrency)?.symbol || cryptoCurrency}
              </span>
            </div>
          </div>

          {/* Предпросмотр общей суммы */}
          {pricePerCrypto && cryptoAmount && (
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {type === "sell" ? t("p2p.createModal.youReceive") : t("p2p.createModal.youPay")}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalInDisplayCurrency.toLocaleString(intlLocale(i18n.language), {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} {displayCurrency}
                  </div>
                  {displayCurrency !== "USD" && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      ≈ {totalInUSD.toFixed(2)} USD
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{cryptoAmount} {userAssets.find(a => a.name === cryptoCurrency)?.symbol || cryptoCurrency}</span>
                <X className="w-3 h-3" />
                <span>{pricePerCrypto} {displayCurrency}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{t("p2p.createModal.successCreated")}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isProcessing || loadingData || loadingMarketPrice}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? t("p2p.createModal.creating") : loadingData ? t("common.loading") : t("p2p.createModal.createOffer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
