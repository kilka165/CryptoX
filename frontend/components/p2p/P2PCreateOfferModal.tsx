// frontend/components/p2p/P2PCreateOfferModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle2, Plus, Wallet, TrendingUp } from "lucide-react";
import { p2pApi } from "@/lib/api/p2pApi";
import { currencies } from "@/lib/currencies";
import { BinanceAPI } from "@/lib/api/binance";
import axios from "axios";

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
  const [type, setType] = useState<"buy" | "sell">("sell");
  const [cryptoCurrency, setCryptoCurrency] = useState("Bitcoin");
  const [displayCurrency, setDisplayCurrency] = useState("RUB");
  const [pricePerCrypto, setPricePerCrypto] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [loadingMarketPrice, setLoadingMarketPrice] = useState(false);
  
  const [userAssets, setUserAssets] = useState<UserAsset[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  
  const [loadingData, setLoadingData] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasFetchedData = useRef(false);

  // Получаем курсы валют
  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
      setExchangeRates(response.data.rates || {});
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      setExchangeRates({
        USD: 1,
        KZT: 450,
        RUB: 90,
        EUR: 0.85,
        GBP: 0.73,
      });
    }
  };

  // Конвертация USD в выбранную валюту
  const convertFromUSD = (amountUSD: number, toCurrency: string): number => {
    if (toCurrency === "USD") return amountUSD;
    const rate = exchangeRates[toCurrency] || 1;
    return amountUSD * rate;
  };

  // Конвертация из выбранной валюты в USD
  const convertToUSD = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === "USD") return amount;
    const rate = exchangeRates[fromCurrency] || 1;
    return amount / rate;
  };

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

        // Параллельно загружаем активы, баланс кошелька и курсы валют
        const [assetsResponse, walletResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/user/assets", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/wallet/balance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchExchangeRates(),
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
    if (cryptoCurrency && displayCurrency && exchangeRates && Object.keys(exchangeRates).length > 0) {
      fetchMarketPrice(cryptoCurrency, displayCurrency);
    }
  }, [cryptoCurrency, displayCurrency, exchangeRates]);

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
      setError("Заполните все поля");
      return;
    }

    const priceNum = parseFloat(pricePerCrypto);
    const amountNum = parseFloat(cryptoAmount);

    if (priceNum <= 0 || amountNum <= 0) {
      setError("Все значения должны быть больше нуля");
      return;
    }

    // Проверка баланса
    if (type === "sell") {
      const cryptoAsset = userAssets.find((a) => a.name === cryptoCurrency);
      const availableCrypto = cryptoAsset?.amount || 0;
      
      if (amountNum > availableCrypto) {
        setError(`Недостаточно ${cryptoCurrency}. Доступно: ${availableCrypto.toFixed(8)}`);
        return;
      }
    } else {
      const availableUSD = walletBalance?.balance || 0;
      
      if (totalInUSD > availableUSD) {
        setError(
          `Недостаточно средств. Требуется: ${totalInUSD.toFixed(2)} USD (${totalInDisplayCurrency.toFixed(2)} ${displayCurrency}), доступно: ${availableUSD.toFixed(2)} USD`
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
        alert("Необходима авторизация");
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
      setError(err.response?.data?.message || "Ошибка при создании заявки");
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
        setError("Сначала укажите цену");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">
              {type === "sell" ? "Продать криптовалюту" : "Купить криптовалюту"}
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
            <label className="block text-sm font-medium mb-2">Тип заявки</label>
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
                Продать криптовалюту
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
                Купить криптовалюту
              </button>
            </div>
          </div>

          {/* Выбор криптовалюты и валюты отображения */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === "sell" ? "Продаю" : "Покупаю"}
              </label>
              <select
                value={cryptoCurrency}
                onChange={(e) => setCryptoCurrency(e.target.value)}
                disabled={loadingData}
                className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              >
                {loadingData ? (
                  <option value="">Загрузка...</option>
                ) : type === "sell" ? (
                  userAssets.length > 0 ? (
                    userAssets.map((asset) => (
                      <option key={asset.name} value={asset.name}>
                        {asset.symbol}
                      </option>
                    ))
                  ) : (
                    <option value="">Нет доступных активов</option>
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
                Валюта цены
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
                Доступно:
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {balanceInfo.amount.toLocaleString('ru-RU', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: balanceInfo.isUSD ? 2 : 8 
              })} {balanceInfo.currency}
            </div>
          </div>

          {/* Цена за 1 единицу криптовалюты */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Цена за 1 {userAssets.find(a => a.name === cryptoCurrency)?.symbol || cryptoCurrency}
              </label>
              {marketPrice && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>Рыночная: {marketPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {displayCurrency}</span>
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={pricePerCrypto}
                onChange={(e) => setPricePerCrypto(e.target.value)}
                placeholder={loadingMarketPrice ? "Загрузка..." : marketPrice ? marketPrice.toFixed(2) : "480.50"}
                disabled={loadingMarketPrice}
                className="w-full px-4 py-3 pr-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                {displayCurrency}
              </span>
            </div>
          </div>

          {/* Количество криптовалюты */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Количество {userAssets.find(a => a.name === cryptoCurrency)?.symbol || cryptoCurrency}
              <button
                type="button"
                onClick={handleMaxClick}
                className="ml-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-normal"
              >
                Максимум
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
                  {type === "sell" ? "Вы получите:" : "Вы заплатите:"}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalInDisplayCurrency.toLocaleString('ru-RU', { 
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
              <span className="text-sm">Заявка успешно создана!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isProcessing || loadingData || loadingMarketPrice}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Создание..." : loadingData ? "Загрузка..." : "Создать заявку"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
