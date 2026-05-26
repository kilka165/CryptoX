// frontend/components/p2p/P2PCreateOfferModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle2, Plus, Wallet } from "lucide-react";
import { p2pApi } from "@/lib/api/p2pApi";
import { currencies } from "@/lib/currencies";
import axios from "axios";

interface P2PCreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cryptoOptions: string[];
}

interface UserAsset {
  coin_symbol: string;
  amount: number;
  coin_name: string;
}

export function P2PCreateOfferModal({
  isOpen,
  onClose,
  onSuccess,
  cryptoOptions,
}: P2PCreateOfferModalProps) {
  const [type, setType] = useState<"buy" | "sell">("sell");
  const [cryptoCurrency, setCryptoCurrency] = useState("USDT");
  const [fiatCurrency, setFiatCurrency] = useState("KZT");
  const [pricePerCrypto, setPricePerCrypto] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  
  const [userAssets, setUserAssets] = useState<UserAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasFetchedAssets = useRef(false);

  const fiatCurrencies = ['USD', 'EUR', 'RUB', 'KZT', 'GBP', 'JPY', 'CNY', 'AED', 'TRY', 'BRL', 'INR'];

  // Загружаем активы
  useEffect(() => {
    if (!isOpen || hasFetchedAssets.current) {
      return;
    }

    const fetchUserAssets = async () => {
      setLoadingAssets(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/user/assets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Raw assets response:", response.data);

        const assets = response.data
          .map((asset: any) => ({
            coin_symbol: (asset.coin_symbol || asset.symbol || '').toUpperCase(),
            amount: parseFloat(asset.amount || asset.balance || 0),
            coin_name: asset.coin_name || asset.name || asset.coin_symbol || asset.symbol
          }));

        console.log("✅ Processed assets:", assets);
        setUserAssets(assets);

        // Находим первую крипту для продажи
        if (type === "sell") {
          const cryptoAssets = assets.filter((a: any) => !fiatCurrencies.includes(a.coin_symbol));
          if (cryptoAssets.length > 0) {
            setCryptoCurrency(cryptoAssets[0].coin_symbol);
          }
        }
        
        hasFetchedAssets.current = true;
      } catch (err) {
        console.error("❌ Error loading user assets:", err);
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchUserAssets();
  }, [isOpen, type]);

  useEffect(() => {
    if (!isOpen) {
      hasFetchedAssets.current = false;
    }
  }, [isOpen]);

  // Получаем баланс в зависимости от типа заявки
  const getRelevantBalance = () => {
    if (type === "sell") {
      // При продаже показываем баланс криптовалюты
      const asset = userAssets.find((asset) => asset.coin_symbol === cryptoCurrency);
      console.log("💰 Sell - looking for crypto:", cryptoCurrency, "found:", asset);
      return asset;
    } else {
      // При покупке показываем баланс фиата
      const asset = userAssets.find((asset) => asset.coin_symbol === fiatCurrency);
      console.log("💰 Buy - looking for fiat:", fiatCurrency, "found:", asset);
      console.log("💰 All assets:", userAssets);
      return asset;
    }
  };

  const selectedAsset = getRelevantBalance();
  const maxAvailable = selectedAsset?.amount || 0;
  const balanceSymbol = type === "sell" ? cryptoCurrency : fiatCurrency;

  console.log("🔍 Current state:", {
    type,
    cryptoCurrency,
    fiatCurrency,
    selectedAsset,
    maxAvailable,
    balanceSymbol,
    totalAssets: userAssets.length
  });

  const availableCryptos = type === "sell" 
    ? userAssets
        .filter((asset) => !fiatCurrencies.includes(asset.coin_symbol))
        .map((asset) => asset.coin_symbol)
    : cryptoOptions;

  // Расчёт общей стоимости
  const totalFiatAmount = pricePerCrypto && cryptoAmount 
    ? (parseFloat(pricePerCrypto) * parseFloat(cryptoAmount))
    : 0;

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
      // При продаже крипты: проверяем баланс криптовалюты
      const cryptoAsset = userAssets.find((asset) => asset.coin_symbol === cryptoCurrency);
      const availableCrypto = cryptoAsset?.amount || 0;
      
      console.log("✅ Sell validation:", { cryptoCurrency, availableCrypto, amountNum });
      
      if (amountNum > availableCrypto) {
        setError(`У вас недостаточно ${cryptoCurrency}. Доступно: ${availableCrypto.toFixed(8)}`);
        return;
      }
    } else {
      // При покупке крипты: проверяем баланс фиата
      const totalCost = priceNum * amountNum;
      const fiatAsset = userAssets.find((asset) => asset.coin_symbol === fiatCurrency);
      const availableFiat = fiatAsset?.amount || 0;
      
      console.log("✅ Buy validation:", { 
        fiatCurrency, 
        availableFiat, 
        totalCost,
        priceNum,
        amountNum,
        fiatAsset 
      });
      
      if (totalCost > availableFiat) {
        setError(`У вас недостаточно ${fiatCurrency}. Требуется: ${totalCost.toFixed(2)}, доступно: ${availableFiat.toFixed(2)}`);
        return;
      }
    }

    // Автоматически рассчитываем лимиты
    const minLimit = (priceNum * amountNum * 0.01).toFixed(2);
    const maxLimit = (priceNum * amountNum).toFixed(2);

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
        currency: fiatCurrency,
        price: priceNum,
        min_limit: parseFloat(minLimit),
        max_limit: parseFloat(maxLimit),
        available_amount: amountNum,
        type,
      });

      await p2pApi.createOffer(token, {
        crypto_currency: cryptoCurrency,
        currency: fiatCurrency,
        price: priceNum,
        min_limit: parseFloat(minLimit),
        max_limit: parseFloat(maxLimit),
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
      console.error("❌ Error response:", err.response?.data);
      setError(err.response?.data?.message || "Ошибка при создании заявки");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setPricePerCrypto("");
    setCryptoAmount("");
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
      setCryptoCurrency(cryptoOptions[0] || "USDT");
    } else if (newType === "sell") {
      const cryptoAssets = userAssets.filter((a) => !fiatCurrencies.includes(a.coin_symbol));
      if (cryptoAssets.length > 0) {
        setCryptoCurrency(cryptoAssets[0].coin_symbol);
      }
    }
  };

  const handleMaxClick = () => {
    if (type === "sell") {
      // При продаже: максимум криптовалюты
      setCryptoAmount(maxAvailable.toString());
    } else {
      // При покупке: рассчитываем максимум криптовалюты по доступному фиату
      if (pricePerCrypto && parseFloat(pricePerCrypto) > 0) {
        const maxCrypto = maxAvailable / parseFloat(pricePerCrypto);
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

          {/* Выбор криптовалюты и фиатной валюты */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === "sell" ? "Продаю" : "Покупаю"}
              </label>
              <select
                value={cryptoCurrency}
                onChange={(e) => setCryptoCurrency(e.target.value)}
                disabled={loadingAssets}
                className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              >
                {loadingAssets ? (
                  <option value="">Загрузка...</option>
                ) : type === "sell" && availableCryptos.length === 0 ? (
                  <option value="">Нет доступных активов</option>
                ) : (
                  availableCryptos.map((crypto) => (
                    <option key={crypto} value={crypto}>
                      {crypto}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {type === "sell" ? "Получаю" : "Плачу"}
              </label>
              <select
                value={fiatCurrency}
                onChange={(e) => setFiatCurrency(e.target.value)}
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
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Доступно: <strong>{maxAvailable.toLocaleString('ru-RU', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: type === "sell" ? 8 : 2 
              })}</strong> {balanceSymbol}
            </span>
          </div>

          {/* Цена за 1 единицу криптовалюты */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Цена за 1 {cryptoCurrency}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={pricePerCrypto}
                onChange={(e) => setPricePerCrypto(e.target.value)}
                placeholder="480.50"
                className="w-full px-4 py-3 pr-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                {fiatCurrency}
              </span>
            </div>
          </div>

          {/* Количество криптовалюты */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Количество {cryptoCurrency}
              <button
                type="button"
                onClick={handleMaxClick}
                className="ml-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                placeholder="100"
                className="w-full px-4 py-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                {cryptoCurrency}
              </span>
            </div>
          </div>

          {/* Предпросмотр общей суммы */}
          {pricePerCrypto && cryptoAmount && (
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {type === "sell" ? "Вы получите:" : "Вы заплатите:"}
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalFiatAmount.toLocaleString('ru-RU', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} {fiatCurrency}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {cryptoAmount} {cryptoCurrency} × {pricePerCrypto} {fiatCurrency}
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
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Создание..." : "Создать заявку"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
