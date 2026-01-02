"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, TrendingUp, AlertCircle } from "lucide-react";
import { BinanceAPI } from "@/lib/api/binance";

interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url?: string | null;
}

interface SellModalProps {
  selectedAsset: Asset | null;
  onClose: () => void;
  userCurrency: string;
  onSellSuccess: () => void;
}

// Маппинг названий на символы
const getCoinSymbol = (name: string): string => {
  const symbolMap: Record<string, string> = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'ripple': 'XRP',
    'binancecoin': 'BNB',
    'cardano': 'ADA',
    'solana': 'SOL',
    'polkadot': 'DOT',
    'dogecoin': 'DOGE',
    'polygon': 'MATIC',
    'avalanche': 'AVAX',
    'chainlink': 'LINK',
    'litecoin': 'LTC',
    'uniswap': 'UNI',
  };
  
  return symbolMap[name.toLowerCase()] || name.toUpperCase();
};

export function SellModal({
  selectedAsset,
  onClose,
  userCurrency,
  onSellSuccess,
}: SellModalProps) {
  const [amount, setAmount] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (selectedAsset) {
      const fetchPrice = async () => {
        try {
          const binanceSymbol = getCoinSymbol(selectedAsset.name);
          const price = await BinanceAPI.getPrice(binanceSymbol);
          setCurrentPrice(price);
        } catch (err) {
          console.error("Ошибка загрузки цены:", err);
          setCurrentPrice(0);
        }
      };

      fetchPrice();
      const interval = setInterval(fetchPrice, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedAsset]);

  if (!selectedAsset) return null;

  const handleSell = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    const sellAmount = parseFloat(amount);
    if (sellAmount > selectedAsset.amount) {
      setError("Недостаточно средств");
      return;
    }

    setIsSelling(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Необходима авторизация");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/trade/sell",
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
      setAmount("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Ошибка продажи. Попробуйте позже."
      );
    } finally {
      setIsSelling(false);
    }
  };

  const totalValue = currentPrice * parseFloat(amount || "0");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-300 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold">Продать {selectedAsset.symbol.toUpperCase()}</h3>
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
              <span className="text-sm text-slate-600 dark:text-slate-400">Текущая цена</span>
              <span className="text-lg font-bold">
                ${currentPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Доступно</span>
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
              Количество для продажи
            </label>
            <input
              type="number"
              step="0.00000001"
              min="0"
              max={selectedAsset.amount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-lg font-semibold outline-none focus:border-blue-500"
            />
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => setAmount((selectedAsset.amount * 0.25).toFixed(8))}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                25%
              </button>
              <button
                onClick={() => setAmount((selectedAsset.amount * 0.5).toFixed(8))}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                50%
              </button>
              <button
                onClick={() => setAmount((selectedAsset.amount * 0.75).toFixed(8))}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                75%
              </button>
              <button
                onClick={() => setAmount(selectedAsset.amount.toFixed(8))}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                100%
              </button>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Итого получите</span>
              <span className="text-xl font-bold text-green-600">
                ${totalValue.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleSell}
            disabled={isSelling || !amount || parseFloat(amount) <= 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isSelling ? "Продаём..." : "Продать"}
          </button>
        </div>
      </div>
    </div>
  );
}
