"use client";

import React from "react";
import { X, CheckCircle } from "lucide-react";
import { Coin } from "@/types/coin";
import { useTranslation } from "react-i18next";
import { getCurrencySymbol } from "@/lib/currencies";
import { useFees } from "@/lib/fees";

interface BuyModalProps {
  isOpen: boolean;
  coin: Coin | null;
  userCurrency: string;
  userBalance: number;
  exchangeRate: number;
  displayAmount: string;
  displayCryptoAmount: string;
  amountUserEntered: number;
  calculatedUSD: number;
  maxBalanceInUserCurrency: number;
  isBuying: boolean;
  buySuccess: boolean;
  onClose: () => void;
  onChangeAmount: (value: string) => void;
  onChangeCryptoAmount: (value: string) => void;
  onSetMax: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BuyModal({
  isOpen,
  coin,
  userCurrency,
  userBalance,
  exchangeRate,
  displayAmount,
  displayCryptoAmount,
  amountUserEntered,
  calculatedUSD,
  maxBalanceInUserCurrency,
  isBuying,
  buySuccess,
  onClose,
  onChangeAmount,
  onChangeCryptoAmount,
  onSetMax,
  onSubmit,
}: BuyModalProps) {
  const { t } = useTranslation();
  const { trade: tradeRate } = useFees();
  if (!isOpen || !coin) return null;

  // Комиссия начисляется сверху стоимости крипты (расчёт и проверка баланса — в USD).
  const feeUSD = calculatedUSD * tradeRate;
  const totalDeductUSD = calculatedUSD + feeUSD;
  const canBuy = amountUserEntered > 0 && totalDeductUSD <= userBalance;
  const currencySymbol = getCurrencySymbol(userCurrency);
  const convertedPrice = coin.current_price * exchangeRate;

  // Те же суммы в выбранной валюте пользователя — только для отображения.
  const amountInCurrency = calculatedUSD * exchangeRate;
  const feeInCurrency = feeUSD * exchangeRate;
  const totalDeductInCurrency = totalDeductUSD * exchangeRate;
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#131416] rounded-2xl shadow-2xl w-full max-w-md border border-slate-300 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-300 dark:border-slate-800">
          <h2 className="text-xl font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("market.buyModal.currentPrice", { symbol: coin.symbol.toUpperCase() })}
            </label>
            <div className="text-2xl font-bold text-blue-600">
              {currencySymbol}
              {convertedPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: convertedPrice < 1 ? 8 : 2,
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">{t("market.buyModal.amount", { currency: getCurrencySymbol(userCurrency) })}</label>
              <button type="button" onClick={onSetMax} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                {t("market.buyModal.max", { amount: maxBalanceInUserCurrency.toFixed(2), symbol: currencySymbol })}
              </button>
            </div>
            <input
              type="text"
              value={displayAmount}
              onChange={(e) => onChangeAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 text-lg font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t("market.buyModal.amountCrypto", { symbol: coin.symbol.toUpperCase() })}
            </label>
            <input
              type="text"
              value={displayCryptoAmount}
              onChange={(e) => onChangeCryptoAmount(e.target.value)}
              placeholder="0.00000000"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 text-lg font-semibold"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.amount", { currency: currencySymbol })}</span>
              <span className="font-semibold">{currencySymbol}{fmt(amountInCurrency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.fee")}</span>
              <span className="font-semibold text-red-500">-{currencySymbol}{fmt(feeInCurrency)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.totalDeduct")}</span>
              <span className={`font-semibold ${totalDeductUSD > userBalance ? "text-red-500" : ""}`}>{currencySymbol}{fmt(totalDeductInCurrency)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.availableBalance")}</span>
              <span className="font-semibold">{currencySymbol}{fmt(maxBalanceInUserCurrency)}</span>
            </div>
          </div>

          {totalDeductUSD > userBalance && amountUserEntered > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400">
              {t("common.insufficientFunds")}
            </div>
          )}

          <button
            type="submit"
            disabled={!canBuy || isBuying}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {buySuccess ? (
              <>
                <CheckCircle size={20} />
                {t("common.success")}
              </>
            ) : isBuying ? (
              t("market.buyModal.buying")
            ) : (
              t("market.buy")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
