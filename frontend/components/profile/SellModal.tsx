"use client";

import React, { useState } from "react";
import axios from "axios";
import { TrendingDown, X, CheckCircle } from "lucide-react";
import { ConvertedAssetPrice } from "./ConvertedAssetPrice";

interface EnrichedAsset {
  id: number;
  symbol: string;
  name: string;
  amount: number;
  valueUSD: number;
  change24h: number;
  currentPriceUSD: number;
}

interface SellModalProps {
  selectedAsset: EnrichedAsset | null;
  onClose: () => void;
  userCurrency: string;
  onSellSuccess: () => void;
}

const formatInputAmount = (value: string) => {
  if (!value) return "";
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

const cleanInputAmount = (value: string) => {
  return value.replace(/\s/g, "");
};

export function SellModal({
  selectedAsset,
  onClose,
  userCurrency,
  onSellSuccess,
}: SellModalProps) {
  const [displaySellAmount, setDisplaySellAmount] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);

  if (!selectedAsset) return null;

  const handleSellInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setDisplaySellAmount(formatInputAmount(val));
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSelling(true);
    const pureAmount = parseFloat(cleanInputAmount(displaySellAmount));

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Пожалуйста, войдите в аккаунт");
        window.location.href = "/login";
        return;
      }

      // Исправление: передаем price_usd, который требует валидатор Laravel
      await axios.post(
        "http://127.0.0.1:8000/api/trade/sell",
        {
          asset_id: selectedAsset.id,
          amount: pureAmount,
          price_usd: selectedAsset.currentPriceUSD, // Добавлено обязательное поле
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellSuccess(true);

      setTimeout(() => {
        onSellSuccess(); // Этот колбэк должен обновить данные в родительском компоненте
        setSellSuccess(false);
        onClose();
        setDisplaySellAmount("");
      }, 2000);
    } catch (error: any) {
      console.error("Sell error:", error);
      // Более подробный вывод ошибки для отладки
      const errorMessage = error.response?.data?.message || error.message || "Ошибка при продаже";
      alert(errorMessage);
    } finally {
      setIsSelling(false);
    }
  };

  const sellAmount = parseFloat(cleanInputAmount(displaySellAmount) || "0");
  const sellValueUSD = sellAmount * (selectedAsset?.currentPriceUSD || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {sellSuccess ? (
          <div className="text-center py-10">
            <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Продано!</h2>
            <p className="text-slate-500 mt-2">Вы продали {selectedAsset.symbol}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <TrendingDown
                  size={24}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Продать {selectedAsset.symbol.toUpperCase()}
                </h2>
                <div className="text-slate-500 text-sm">
                  Доступно: {Number(selectedAsset.amount).toFixed(6)}{" "}
                  {selectedAsset.symbol.toUpperCase()}
                </div>
              </div>
            </div>

            <form onSubmit={handleSell} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Количество
                  </label>
                  <div className="text-xs text-slate-500">
                    Цена: $
                    {selectedAsset.currentPriceUSD?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">
                    {selectedAsset.symbol}
                  </span>
                  <input
                    type="text"
                    value={displaySellAmount}
                    onChange={handleSellInputChange}
                    placeholder="0"
                    className={`block w-full pl-16 pr-16 py-4 text-xl font-bold border rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-red-600 outline-none ${
                      sellAmount > selectedAsset.amount
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDisplaySellAmount(
                        formatInputAmount(selectedAsset.amount.toString())
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded hover:bg-red-200"
                  >
                    ВСЁ
                  </button>
                </div>

                {sellAmount > selectedAsset.amount && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    Недостаточно {selectedAsset.symbol.toUpperCase()}
                  </p>
                )}

                <div className="flex flex-col gap-2 mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 dark:text-slate-300">
                      Вы получите (USD):
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      $
                      {sellValueUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {userCurrency !== "USD" && (
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>В {userCurrency}:</span>
                      <ConvertedAssetPrice
                        valueUSD={sellValueUSD}
                        currency={userCurrency}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isSelling ||
                  !displaySellAmount ||
                  sellAmount <= 0 ||
                  sellAmount > selectedAsset.amount
                }
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 flex justify-center gap-2"
              >
                {isSelling ? (
                  "Обработка..."
                ) : (
                  <>
                    <TrendingDown size={20} /> Продать сейчас
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
