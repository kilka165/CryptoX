"use client";

import { X, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCurrencySymbol } from "@/lib/currencies";
import { useFees } from "@/lib/fees";
import { PriceChart } from "@/components/market/PriceChart";
import { useBuyFlow } from "@/hooks/useBuyFlow";

interface BuyModalProps {
  flow: ReturnType<typeof useBuyFlow>;
}

export function BuyModal({ flow }: BuyModalProps) {
  const { t } = useTranslation();
  const { trade: tradeRate } = useFees();

  const {
    selectedCoin: coin,
    userCurrency,
    userBalance,
    exchangeRate,
    mode,
    setMode,
    // покупка
    displayAmount,
    displayCryptoAmount,
    amountUserEntered,
    calculatedUSD,
    maxBalanceInUserCurrency,
    isBuying,
    buySuccess,
    handleInputChange,
    handleCryptoInputChange,
    handleBuySubmit,
    onSetBuyPercent,
    // продажа
    ownedAmount,
    sellCryptoAmount,
    sellFiatAmount,
    isSelling,
    sellSuccess,
    handleSellCryptoChange,
    handleSellFiatChange,
    onSetSellPercent,
    handleSellSubmit,
    closeBuy,
  } = flow;

  if (!coin) return null;

  const currencySymbol = getCurrencySymbol(userCurrency);
  const convertedPrice = coin.current_price * exchangeRate;
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Расчёты покупки (проверка баланса — в USD, отображение — в валюте пользователя).
  const feeUSD = calculatedUSD * tradeRate;
  const totalDeductUSD = calculatedUSD + feeUSD;
  const canBuy = amountUserEntered > 0 && totalDeductUSD <= userBalance;
  const feeInCurrency = feeUSD * exchangeRate;
  const totalDeductInCurrency = totalDeductUSD * exchangeRate;

  // Расчёты продажи (комиссия удерживается из выручки).
  const sellCryptoNum = parseFloat(sellCryptoAmount || "0") || 0;
  const sellGrossInCurrency = sellCryptoNum * convertedPrice;
  const sellFeeInCurrency = sellGrossInCurrency * tradeRate;
  const sellNetInCurrency = sellGrossInCurrency - sellFeeInCurrency;
  const canSell = sellCryptoNum > 0 && sellCryptoNum <= ownedAmount;
  const hasHoldings = ownedAmount > 0;

  const tabClass = (active: boolean, color: "blue" | "red") =>
    `flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
      active
        ? color === "blue"
          ? "bg-blue-600 text-white"
          : "bg-red-600 text-white"
        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
    }`;

  const inputClass =
    "w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#131416] rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-300 dark:border-slate-800 max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300 dark:border-slate-800 shrink-0">
          <h2 className="text-xl font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </h2>
          <button onClick={closeBuy} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        {/* Переключатель Покупка / Продажа */}
        <div className="flex gap-1 p-1 mx-6 mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
          <button type="button" onClick={() => setMode("buy")} className={tabClass(mode === "buy", "blue")}>
            {t("market.buyModal.buyTab")}
          </button>
          <button type="button" onClick={() => setMode("sell")} className={tabClass(mode === "sell", "red")}>
            {t("market.buyModal.sellTab")}
          </button>
        </div>

        <div className="p-6 pt-4 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Цена и график общие для обоих режимов; малый отступ — кнопки диапазона ближе к названию */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t("market.buyModal.currentPrice", { symbol: coin.symbol.toUpperCase() })}
              </span>
              <span className="text-xl font-bold text-blue-600">
                {currencySymbol}
                {convertedPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: convertedPrice < 1 ? 8 : 2,
                })}
              </span>
            </div>

            {/* Свечной график цены — в валюте пользователя */}
            <PriceChart
              symbol={coin.symbol}
              defaultRange="24h"
              height={220}
              priceMultiplier={exchangeRate}
              currencySymbol={currencySymbol}
            />
          </div>

          {mode === "buy" ? (
            <form onSubmit={handleBuySubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm">
                <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.availableBalance")}</span>
                <span className="font-semibold">{currencySymbol}{fmt(maxBalanceInUserCurrency)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("market.buyModal.amountCrypto", { symbol: coin.symbol.toUpperCase() })}
                  </label>
                  <input type="text" inputMode="decimal" value={displayCryptoAmount} onChange={(e) => handleCryptoInputChange(e.target.value)} placeholder="0.00000000" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("market.buyModal.amount", { currency: currencySymbol })}
                  </label>
                  <input type="text" inputMode="decimal" value={displayAmount} onChange={(e) => handleInputChange(e.target.value)} placeholder="0.00" className={inputClass} />
                </div>
              </div>

              <div className="flex gap-2">
                {[0.25, 0.5, 0.75, 1].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onSetBuyPercent(p)}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {p * 100}%
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.fee")}</span>
                  <span className="font-semibold text-red-500">-{currencySymbol}{fmt(feeInCurrency)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.totalDeduct")}</span>
                  <span className={`font-semibold ${totalDeductUSD > userBalance ? "text-red-500" : ""}`}>{currencySymbol}{fmt(totalDeductInCurrency)}</span>
                </div>
              </div>

              {totalDeductUSD > userBalance && amountUserEntered > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400">
                  {t("common.insufficientFunds")}
                </div>
              )}

              <button type="submit" disabled={!canBuy || isBuying} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
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
          ) : (
            <form onSubmit={handleSellSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-sm">
                <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.availableToSell")}</span>
                <span className="font-semibold">
                  {ownedAmount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {coin.symbol.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("market.buyModal.amountCrypto", { symbol: coin.symbol.toUpperCase() })}
                  </label>
                  <input type="text" inputMode="decimal" value={sellCryptoAmount} onChange={(e) => handleSellCryptoChange(e.target.value)} disabled={!hasHoldings} placeholder="0.00000000" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("market.buyModal.amount", { currency: currencySymbol })}
                  </label>
                  <input type="text" inputMode="decimal" value={sellFiatAmount} onChange={(e) => handleSellFiatChange(e.target.value)} disabled={!hasHoldings} placeholder="0.00" className={inputClass} />
                </div>
              </div>

              <div className="flex gap-2">
                {[0.25, 0.5, 0.75, 1].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onSetSellPercent(p)}
                    disabled={!hasHoldings}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {p * 100}%
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.fee")}</span>
                  <span className="font-semibold text-red-500">-{currencySymbol}{fmt(sellFeeInCurrency)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">{t("market.buyModal.totalReceive")}</span>
                  <span className="font-semibold text-green-600">{currencySymbol}{fmt(sellNetInCurrency)}</span>
                </div>
              </div>

              {sellCryptoNum > ownedAmount && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400">
                  {t("market.buyModal.insufficientCrypto", {
                    symbol: coin.symbol.toUpperCase(),
                    amount: ownedAmount.toLocaleString(undefined, { maximumFractionDigits: 8 }),
                  })}
                </div>
              )}

              <button type="submit" disabled={!canSell || isSelling} className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                {sellSuccess ? (
                  <>
                    <CheckCircle size={20} />
                    {t("common.success")}
                  </>
                ) : isSelling ? (
                  t("market.buyModal.selling")
                ) : (
                  t("market.sell")
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
