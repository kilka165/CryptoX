// frontend/components/p2p/P2PBuyModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, AlertCircle, Wallet, BarChart3 } from "lucide-react";
import { P2POffer } from "@/lib/api/p2pApi";
import { BinanceAPI } from "@/lib/api/binance";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";
import { intlLocale } from "@/lib/utils/locale";
import { getCurrencySymbol } from "@/lib/currencies";
import { sanitizeDecimalInput } from "@/lib/utils/number";
import axios from "axios";
import { API_BASE } from "@/lib/config";
import { SellerAvatar } from "./SellerAvatar";

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
  const { t, i18n } = useTranslation();
  const { convert } = useRates();
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [marketPrice, setMarketPrice] = useState<number | null>(null);
  const [loadingMarketPrice, setLoadingMarketPrice] = useState(false);
  const [walletUSD, setWalletUSD] = useState<number | null>(null);
  const [userAssets, setUserAssets] = useState<
    { name: string; symbol: string; amount: number }[]
  >([]);

  useEffect(() => {
    if (!isOpen) {
      setCryptoAmount("");
      setFiatAmount("");
      setError("");
      setMarketPrice(null);
      setWalletUSD(null);
      setUserAssets([]);
    }
  }, [isOpen]);

  // Загружаем баланс пользователя, чтобы проверять достаточность средств
  // на клиенте (а не ловить ошибку с бэкенда после попытки сделки).
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    let active = true;
    Promise.all([
      axios.get(`${API_BASE}/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE}/user/assets`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([wallet, assets]) => {
        if (!active) return;
        setWalletUSD(parseFloat(wallet.data.balance || 0));
        setUserAssets(
          (assets.data || []).map((a: any) => ({
            name: a.name || a.coin_name,
            symbol: a.symbol || a.coin_symbol,
            amount: parseFloat(a.amount || 0),
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to load balance:", err);
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  // Загружаем рыночную цену при открытии (курсы валют — из единого RatesProvider).
  useEffect(() => {
    if (!isOpen || !offer) return;

    let active = true;
    setLoadingMarketPrice(true);

    BinanceAPI.getPriceUSDByIdentifier(offer.crypto_currency)
      .then((priceUSD) => {
        if (!active) return;
        if (priceUSD != null && priceUSD > 0) {
          setMarketPrice(convert(priceUSD, "USD", offer.currency));
        } else {
          setMarketPrice(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch market price:", err);
        if (active) setMarketPrice(null);
      })
      .finally(() => {
        if (active) setLoadingMarketPrice(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, offer, convert]);

  if (!isOpen || !offer) return null;

  const fiat = getCurrencySymbol(offer.currency);
  const isBuying = offer.type === "sell";
  const isSelling = offer.type === "buy";

  // Минимальная сумма сделки — лимит заявки (заявки создаются с min_limit ≈ $0.1,
  // поэтому покупать можно от $0.1). Если лимит не задан — берём эквивалент $0.1.
  const minFiatAmount =
    offer.min_limit && offer.min_limit > 0
      ? offer.min_limit
      : convert(0.1, "USD", offer.currency);
  const minCryptoAmount = offer.price > 0 ? minFiatAmount / offer.price : 0;

  // Рассчитываем разницу с рынком
  const priceDifference = marketPrice ? ((offer.price - marketPrice) / marketPrice) * 100 : null;

  // Доступный баланс пользователя для этой сделки.
  // Покупка крипты (offer.type === "sell") → платим фиатом из USD-кошелька.
  // Продажа крипты (offer.type === "buy") → отдаём крипту со своего актива.
  const normAsset = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const cryptoAsset = userAssets.find(
    (a) =>
      normAsset(a.name) === normAsset(offer.crypto_currency) ||
      normAsset(a.symbol) === normAsset(offer.crypto_currency)
  );
  const availableCrypto = cryptoAsset?.amount ?? 0;
  const availableFiat =
    walletUSD != null ? convert(walletUSD, "USD", offer.currency) : null;

  const cryptoNumLive = parseFloat(cryptoAmount) || 0;
  const fiatNumLive = parseFloat(fiatAmount) || 0;
  // Покупка: проверяем фиат-баланс (надёжно — одна USD-сумма).
  // Продажа: проверяем только если актив однозначно сопоставлен, иначе не
  // блокируем (чтобы не дать ложный запрет из-за расхождения названий).
  const insufficientFunds = isBuying
    ? availableFiat != null && fiatNumLive > availableFiat + 1e-9
    : cryptoAsset != null && cryptoNumLive > availableCrypto + 1e-9;
  const showInsufficient =
    (cryptoNumLive > 0 || fiatNumLive > 0) && insufficientFunds;

  const insufficientMessage = isBuying
    ? t("p2p.buyModal.insufficientBuy", {
        amount: (availableFiat ?? 0).toLocaleString(intlLocale(i18n.language), {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        currency: fiat,
      })
    : t("p2p.buyModal.insufficientSell", {
        amount: availableCrypto.toLocaleString(intlLocale(i18n.language), {
          maximumFractionDigits: 8,
        }),
        crypto: offer.crypto_currency,
      });

  const handleCryptoChange = (value: string) => {
    const v = sanitizeDecimalInput(value);
    setCryptoAmount(v);
    setError("");

    if (v && !isNaN(parseFloat(v))) {
      const crypto = parseFloat(v);
      const calculatedFiat = crypto * offer.price;
      setFiatAmount(calculatedFiat.toFixed(2));
    } else {
      setFiatAmount("");
    }
  };

  const handleFiatChange = (value: string) => {
    const v = sanitizeDecimalInput(value);
    setFiatAmount(v);
    setError("");

    if (v && !isNaN(parseFloat(v))) {
      const fiat = parseFloat(v);
      const calculatedCrypto = fiat / offer.price;
      setCryptoAmount(calculatedCrypto.toFixed(8));
    } else {
      setCryptoAmount("");
    }
  };

  const handleConfirm = async () => {
    if (!cryptoAmount || !fiatAmount) {
      setError(t("p2p.buyModal.errEnterAmount"));
      return;
    }

    const cryptoNum = parseFloat(cryptoAmount);
    const fiatNum = parseFloat(fiatAmount);

    if (cryptoNum <= 0 || fiatNum <= 0) {
      setError(t("p2p.buyModal.errPositive"));
      return;
    }

    if (cryptoNum < minCryptoAmount) {
      setError(t("p2p.buyModal.errMinAmount", { amount: minCryptoAmount, crypto: offer.crypto_currency, fiat: minFiatAmount.toFixed(2), currency: fiat }));
      return;
    }

    if (cryptoNum > offer.available_amount) {
      setError(t("p2p.buyModal.errMaxAvailable", { amount: offer.available_amount, crypto: offer.crypto_currency }));
      return;
    }

    if (fiatNum < offer.min_limit) {
      setError(t("p2p.buyModal.errMinSum", { amount: offer.min_limit, currency: fiat }));
      return;
    }

    if (fiatNum > offer.max_limit) {
      setError(t("p2p.buyModal.errMaxSum", { amount: offer.max_limit, currency: fiat }));
      return;
    }

    if (insufficientFunds) {
      setError(insufficientMessage);
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(fiatNum, cryptoNum);
      onClose();
    } catch (err) {
      setError(t("p2p.buyModal.errTrade"));
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
      <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-300 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {isBuying ? (
              <>
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold">{t("p2p.buyModal.buyCrypto", { crypto: offer.crypto_currency })}</h3>
              </>
            ) : (
              <>
                <TrendingDown className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">{t("p2p.buyModal.sellCrypto", { crypto: offer.crypto_currency })}</h3>
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
            <SellerAvatar name={offer.seller_name} avatar={offer.seller_avatar} className="w-12 h-12 text-lg" />
            <div>
              <div className="font-medium">{offer.seller_name}</div>
              <div className="text-sm text-slate-500">
                {t("p2p.offerCard.tradesCount", { n: offer.orders_count })}
              </div>
            </div>
          </div>

          {/* Цена с рыночным сравнением */}
          <div className="space-y-2">
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <span className="text-sm text-slate-600 dark:text-slate-400">{t("p2p.buyModal.offerPrice")}</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {offer.price.toLocaleString()} {fiat}
              </span>
            </div>

            {/* Рыночная цена */}
            {loadingMarketPrice ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                <span className="text-xs text-slate-500">{t("p2p.buyModal.loadingMarketPrice")}</span>
              </div>
            ) : marketPrice && priceDifference !== null ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {t("p2p.buyModal.marketPrice")}: <strong>{marketPrice.toLocaleString(intlLocale(i18n.language), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiat}</strong>
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
            <span className="text-sm text-slate-500">{t("p2p.buyModal.available")}</span>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="w-4 h-4 text-slate-400" />
              {offer.available_amount.toLocaleString()} {offer.crypto_currency}
            </div>
          </div>

          {isBuying ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("p2p.buyModal.iReceive", { unit: offer.crypto_currency })}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={cryptoAmount}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    placeholder={t("p2p.buyModal.minPlaceholder", { amount: minCryptoAmount })}
                    className="w-full px-4 py-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {offer.crypto_currency}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {t("p2p.buyModal.minimumHint", { amount: minCryptoAmount, crypto: offer.crypto_currency, fiat: minFiatAmount.toFixed(2), currency: fiat })}
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
                  {t("p2p.buyModal.iPay", { unit: fiat })}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fiatAmount}
                    onChange={(e) => handleFiatChange(e.target.value)}
                    placeholder={`0.00 ${fiat}`}
                    className="w-full px-4 py-3 pr-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {fiat}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {t("p2p.buyModal.limit", { min: offer.min_limit.toLocaleString(intlLocale(i18n.language)), max: offer.max_limit.toLocaleString(intlLocale(i18n.language)), currency: fiat })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("p2p.buyModal.iGive", { unit: offer.crypto_currency })}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={cryptoAmount}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    placeholder={t("p2p.buyModal.minPlaceholder", { amount: minCryptoAmount })}
                    className="w-full px-4 py-3 pr-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {offer.crypto_currency}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {t("p2p.buyModal.minimumHint", { amount: minCryptoAmount, crypto: offer.crypto_currency, fiat: minFiatAmount.toFixed(2), currency: fiat })}
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
                  {t("p2p.buyModal.iReceive", { unit: fiat })}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fiatAmount}
                    onChange={(e) => handleFiatChange(e.target.value)}
                    placeholder={`0.00 ${fiat}`}
                    className="w-full px-4 py-3 pr-16 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition-colors text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {fiat}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {t("p2p.buyModal.limit", { min: offer.min_limit.toLocaleString(intlLocale(i18n.language)), max: offer.max_limit.toLocaleString(intlLocale(i18n.language)), currency: fiat })}
                </div>
              </div>
            </>
          )}

          {/* Предупреждение о нехватке средств */}
          {showInsufficient && !error && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{insufficientMessage}</span>
            </div>
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
              {t("common.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || !cryptoAmount || !fiatAmount || showInsufficient}
              className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isBuying 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("p2p.buyModal.processing")}
                </>
              ) : (
                <>{isBuying ? t("p2p.filters.buy") : t("p2p.filters.sell")}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
