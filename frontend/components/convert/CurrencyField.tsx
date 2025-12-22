"use client";

import React from "react";

// локальный тип Coin
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

interface CurrencyFieldProps {
  label: string;
  balanceLabel: string;
  coin: Coin | null;
  amount: string;
  readOnly?: boolean;
  onOpenPicker: () => void;
  onAmountChange?: (value: string) => void;
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  label,
  balanceLabel,
  coin,
  amount,
  readOnly,
  onOpenPicker,
  onAmountChange,
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs text-slate-400">
      <span>{label}</span>
      <span>
        Доступный баланс ·
        <span className="text-slate-200 ml-1">
          {balanceLabel} {coin?.symbol.toUpperCase() ?? ""}
        </span>
      </span>
    </div>

    <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-3 py-4 border border-slate-700 min-h-[72px]">
      <button
        type="button"
        onClick={onOpenPicker}
        className="flex items-center gap-2 bg-slate-900 rounded-lg px-2 py-2 hover:bg-slate-800"
      >
        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[11px] font-bold">
          {(coin?.symbol || "?").slice(0, 3).toUpperCase()}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold">
            {coin ? coin.symbol.toUpperCase() : "Выберите монету"}
          </span>
          <span className="text-[11px] text-slate-400">
            {coin?.name || ""}
          </span>
        </div>
      </button>

      <input
        type="text"
        placeholder={readOnly ? "" : "Введите сумму"}
        value={amount}
        readOnly={readOnly}
        onChange={
          readOnly || !onAmountChange
            ? undefined
            : (e) =>
                onAmountChange(e.target.value.replace(/[^0-9.,]/g, ""))
        }
        className={`flex-1 bg-transparent text-right text-lg font-semibold outline-none ${
          readOnly ? "text-slate-400" : ""
        }`}
      />
    </div>
  </div>
);
