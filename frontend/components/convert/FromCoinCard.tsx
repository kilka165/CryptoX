import React from "react";
import { X, ChevronDown, AlertTriangle } from "lucide-react";

interface FromCoinCardProps {
  coin: { symbol: string };
  amount: string;
  balance: number;
  hasError: boolean;
  onAmountChange: (value: string) => void;
  onRemove: () => void;
  onOpenPicker: () => void;
  canRemove: boolean;
}

export function FromCoinCard({
  coin,
  amount,
  balance,
  hasError,
  onAmountChange,
  onRemove,
  onOpenPicker,
  canRemove,
}: FromCoinCardProps) {
  const inputAmount = parseFloat(amount.replace(",", ".")) || 0;

  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 bg-white dark:bg-slate-950 rounded-xl px-3 py-3 border ${
          hasError
            ? "border-red-500/50 bg-red-50 dark:bg-red-950/20"
            : "border-slate-300 dark:border-slate-700"
        }`}
      >
        <button
          type="button"
          onClick={onOpenPicker}
          className="flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg px-2 py-1"
        >
          <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold">
            {coin.symbol.slice(0, 3).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold">
              {coin.symbol.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Баланс: {balance.toFixed(8)}
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-500" />
        </button>
        <input
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className={`flex-1 bg-transparent text-right text-sm font-semibold outline-none ${
            hasError ? "text-red-600 dark:text-red-400" : ""
          }`}
        />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-slate-500 hover:text-red-600 dark:hover:text-red-400"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {hasError && inputAmount > 0 && (
        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 px-3">
          <AlertTriangle size={12} />
          <span>Недостаточно средств. Доступно: {balance.toFixed(8)}</span>
        </div>
      )}
    </div>
  );
}
