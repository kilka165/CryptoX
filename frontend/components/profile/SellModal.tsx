"use client";

import React, { useState } from "react";
import axios from "axios";
import { X, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";
import { API_BASE } from "@/lib/config";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url?: string | null;
  // Цена из обогащённого источника /api/coins (родитель profile/page.tsx).
  // Если undefined — продажу не разрешаем, чтобы не записать total_usd=0.
  currentPriceUSD?: number;
}

interface SellModalProps {
  selectedAsset: Asset | null;
  onClose: () => void;
  userCurrency: string;
  onSellSuccess: () => void;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  RUB: "₽",
  EUR: "€",
  KZT: "₸",
  GBP: "£",
};

const getCurrencySymbol = (currency: string): string =>
  CURRENCY_SYMBOLS[currency] || currency;

export function SellModal({
  selectedAsset,
  onClose,
  userCurrency,
  onSellSuccess,
}: SellModalProps) {
  const { t } = useTranslation();
  const { getRate } = useRates();
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedAsset) return null;

  const currentPrice = selectedAsset.currentPriceUSD ?? 0;
  const priceUnavailable = currentPrice <= 0;
  const exchangeRate = getRate(userCurrency);
  const currencySymbol = getCurrencySymbol(userCurrency);
  // Цена единицы актива в валюте пользователя (KZT и т.д.)
  const priceInUserCurrency = currentPrice * exchangeRate;

  // Двусторонняя синхронизация полей: правка одного пересчитывает другое
  // через ту же цену, которую видит пользователь сверху модалки.
  const handleCryptoChange = (raw: string) => {
    const val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setCryptoAmount(val);
    const n = parseFloat(val || "0");
    if (priceInUserCurrency > 0 && n > 0) {
      setFiatAmount((n * priceInUserCurrency).toFixed(2));
    } else {
      setFiatAmount("");
    }
  };

  const handleFiatChange = (raw: string) => {
    const val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setFiatAmount(val);
    const n = parseFloat(val || "0");
    if (priceInUserCurrency > 0 && n > 0) {
      setCryptoAmount((n / priceInUserCurrency).toFixed(8));
    } else {
      setCryptoAmount("");
    }
  };

  const setPercent = (pct: number) => {
    const crypto = selectedAsset.amount * pct;
    setCryptoAmount(crypto.toFixed(8));
    if (priceInUserCurrency > 0) {
      setFiatAmount((crypto * priceInUserCurrency).toFixed(2));
    } else {
      setFiatAmount("");
    }
  };

  const handleSell = async () => {
    if (priceUnavailable) {
      setError(t("profile.sellModal.errSellFailed"));
      return;
    }

    const sellAmount = parseFloat(cryptoAmount || "0");
    if (!sellAmount || sellAmount <= 0) {
      setError(t("profile.sellModal.errInvalidAmount"));
      return;
    }

    if (sellAmount > selectedAsset.amount) {
      setError(t("common.insufficientFunds"));
      return;
    }

    setIsSelling(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError(t("common.authRequired"));
        return;
      }

      await axios.post(
        `${API_BASE}/trade/sell`,
        {
          coin_id: selectedAsset.name,
          amount: sellAmount,
          price_usd: currentPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSellSuccess();
      onClose();
      setCryptoAmount("");
      setFiatAmount("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || t("profile.sellModal.errSellFailed")
      );
    } finally {
      setIsSelling(false);
    }
  };

  const totalReceiveFiat = parseFloat(fiatAmount || "0");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#131416] rounded-2xl shadow-2xl w-full max-w-md border border-slate-300 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-300 dark:border-slate-800">
          <h3 className="text-xl font-bold">{t("profile.sellModal.title", { symbol: selectedAsset.symbol.toUpperCase() })}</h3>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">{t("profile.sellModal.currentPrice")}</span>
              <span className="text-lg font-bold">
                {currencySymbol}
                {priceInUserCurrency.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: priceInUserCurrency < 1 ? 8 : 2,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">{t("profile.sellModal.available")}</span>
              <span className="text-sm font-semibold">
                {selectedAsset.amount.toFixed(8)} {selectedAsset.symbol.toUpperCase()}
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg px-3 py-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("profile.sellModal.amountToSell")} ({selectedAsset.symbol.toUpperCase()})
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={cryptoAmount}
              onChange={(e) => handleCryptoChange(e.target.value)}
              disabled={priceUnavailable}
              placeholder="0.00000000"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0d0d0d] text-lg font-semibold outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="mt-2 flex justify-between">
              <button
                type="button"
                onClick={() => setPercent(0.25)}
                disabled={priceUnavailable}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => setPercent(0.5)}
                disabled={priceUnavailable}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setPercent(0.75)}
                disabled={priceUnavailable}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => setPercent(1)}
                disabled={priceUnavailable}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40 disabled:no-underline"
              >
                100%
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("profile.sellModal.amountInCurrency", { currency: userCurrency })}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={fiatAmount}
              onChange={(e) => handleFiatChange(e.target.value)}
              disabled={priceUnavailable}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-[#0d0d0d] text-lg font-semibold outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">{t("profile.sellModal.totalReceive")}</span>
              <span className="text-xl font-bold text-green-600">
                {currencySymbol}
                {totalReceiveFiat.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <button
            onClick={handleSell}
            disabled={isSelling || !cryptoAmount || parseFloat(cryptoAmount) <= 0 || priceUnavailable}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isSelling ? t("profile.sellModal.selling") : t("profile.sellModal.sell")}
          </button>
        </div>
      </div>
    </div>
  );
}
