import React from "react";
import { ChevronDown } from "lucide-react";

interface CurrencyFieldProps {
  label: string;
  coin: { symbol: string; name?: string } | null;
  amount?: string;
  balance?: number;
  readonly?: boolean;
  onAmountChange?: (value: string) => void;
  onOpenPicker?: () => void;
}

export function CurrencyField({
  label,
  coin,
  amount,
  balance,
  readonly = false,
  onAmountChange,
  onOpenPicker,
}: CurrencyFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
        {balance !== undefined && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Баланс: {balance.toFixed(8)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 bg-white dark:bg-slate-950 rounded-xl px-3 py-4 border border-slate-300 dark:border-slate-700">
        <button
          type="button"
          onClick={onOpenPicker}
          className="flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg px-2 py-1"
          disabled={!onOpenPicker}
        >
          <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold">
            {coin ? coin.symbol.slice(0, 3).toUpperCase() : "?"}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold">
              {coin ? coin.symbol.toUpperCase() : "Выберите"}
            </span>
            {coin?.name && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {coin.name}
              </span>
            )}
          </div>
          {onOpenPicker && <ChevronDown size={14} className="text-slate-500" />}
        </button>

        {readonly ? (
          <span className="flex-1 text-right text-lg font-semibold text-slate-600 dark:text-slate-400">
            ≈ {amount || "0.00"}
          </span>
        ) : (
          <input
            type="text"
            placeholder="0.00"
            value={amount || ""}
            onChange={(e) => onAmountChange?.(e.target.value)}
            className="flex-1 bg-transparent text-right text-sm font-semibold outline-none"
          />
        )}
      </div>
    </div>
  );
}
