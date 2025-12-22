// components/market/BuyModal.tsx
"use client";

import React from "react";
import { X, Wallet, CheckCircle } from "lucide-react";
import { ConvertedPrice } from "./ConvertedPrice";
import { CoinImage } from "./CoinImage";

interface BuyModalProps<TCoin> {
  openCoin: TCoin | null;
  userCurrency: string;
  userBalance: number;
  exchangeRate: number;
  displayAmount: string;
  amountUserEntered: number;
  calculatedUSD: number;
  cryptoAmount: number;
  maxBalanceInUserCurrency: number;
  isBuying: boolean;
  buySuccess: boolean;
  onClose: () => void;
  onChangeAmount: (value: string) => void;
  onSetMax: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BuyModal<TCoin extends { id: string; name: string; symbol: string; current_price: number }>({
  openCoin,
  userCurrency,
  userBalance,
  exchangeRate,
  displayAmount,
  amountUserEntered,
  calculatedUSD,
  cryptoAmount,
  maxBalanceInUserCurrency,
  isBuying,
  buySuccess,
  onClose,
  onChangeAmount,
  onSetMax,
  onSubmit,
}: BuyModalProps<TCoin>) {
  if (!openCoin) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {buySuccess ? (
          <div className="text-center py-10">
            <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Успешно!</h2>
            <p className="text-slate-500 mt-2">Вы купили {openCoin.name}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <CoinImage coinId={openCoin.id} name={openCoin.name} className="w-12 h-12 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold">
                  Купить {openCoin.symbol.toUpperCase()}
                </h2>
                <div className="text-slate-500 text-sm flex gap-1">
                  Цена:
                  <ConvertedPrice
                    valueUSD={openCoin.current_price}
                    currency={userCurrency}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Сумма ({userCurrency})
                  </label>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    Доступно:
                    <span
                      className="font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600"
                      onClick={onSetMax}
                    >
                      {(userBalance * exchangeRate).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {userCurrency}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    {userCurrency}
                  </span>
                  <input
                    type="text"
                    value={displayAmount}
                    onChange={(e) => onChangeAmount(e.target.value)}
                    placeholder="0"
                    className={`block w-full pl-12 pr-16 py-4 text-xl font-bold border rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-600 outline-none ${
                      amountUserEntered > maxBalanceInUserCurrency
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={onSetMax}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    МАКС
                  </button>
                </div>

                {amountUserEntered > maxBalanceInUserCurrency && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    Недостаточно средств
                  </p>
                )}

                <div className="flex flex-col gap-2 mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Конвертация в USD:</span>
                    <span>
                      ≈ $
                      {calculatedUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 dark:text-slate-300">
                      Вы получите:
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {cryptoAmount.toFixed(6)} {openCoin.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isBuying || !displayAmount || amountUserEntered <= 0 ||
                  amountUserEntered > maxBalanceInUserCurrency
                }
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex justify-center gap-2"
>
                {isBuying ? "Обработка..." : (
                  <>
                    <Wallet size={20} /> Купить сейчас
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
