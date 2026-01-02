import React from "react";
import { X, CheckCircle } from "lucide-react";

interface BuyModalProps<T extends { id: string; name: string; symbol: string; current_price: number }> {
  isOpen: boolean;
  coin: T | null;
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

export function BuyModal<T extends { id: string; name: string; symbol: string; current_price: number }>({
  isOpen,
  coin,
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
}: BuyModalProps<T>) {
  if (!isOpen || !coin) return null;

  const canBuy = amountUserEntered > 0 && calculatedUSD <= userBalance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold">
            Купить {coin.name} ({coin.symbol.toUpperCase()})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Цена за 1 {coin.symbol.toUpperCase()}
            </label>
            <div className="text-2xl font-bold text-blue-600">
              {coin.current_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}{" "}
              USD
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Сумма в {userCurrency}
              </label>
              <button
                type="button"
                onClick={onSetMax}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Макс: {maxBalanceInUserCurrency.toFixed(2)} {userCurrency}
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

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Сумма в USD:</span>
              <span className="font-semibold">{calculatedUSD.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Получите:</span>
              <span className="font-semibold">
                {cryptoAmount.toFixed(8)} {coin.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Ваш баланс:</span>
              <span className="font-semibold">
                {userBalance.toFixed(2)} USD ({maxBalanceInUserCurrency.toFixed(2)}{" "}
                {userCurrency})
              </span>
            </div>
          </div>

          {calculatedUSD > userBalance && amountUserEntered > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-700 dark:text-red-400">
              Недостаточно средств на балансе
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
                Успешно!
              </>
            ) : isBuying ? (
              "Покупка..."
            ) : (
              "Купить"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
