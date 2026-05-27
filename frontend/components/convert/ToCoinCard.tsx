"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ToCoinCardProps {
  toCoin: { symbol: string; name: string } | null;
  calculatedAmount: number;
  balance: number;
  onOpenPicker: () => void;
}

export function ToCoinCard({
  toCoin,
  calculatedAmount,
  balance,
  onOpenPicker,
}: ToCoinCardProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600 dark:text-slate-400">{t("convert.to")}</span>
        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
          {t("convert.balanceWithSymbol", { amount: balance.toFixed(8), symbol: toCoin?.symbol.toUpperCase() || "" })}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-white dark:bg-[#0d0d0d] rounded-xl px-3 py-4 border border-slate-300 dark:border-slate-700">
        <button
          type="button"
          onClick={onOpenPicker}
          className="flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg px-2 py-1"
        >
          <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold">
            {toCoin ? toCoin.symbol.slice(0, 3).toUpperCase() : "?"}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold">
              {toCoin ? toCoin.symbol.toUpperCase() : t("convert.select")}
            </span>
            <span className="text-[10px] text-slate-500">
              {toCoin?.name || ""}
            </span>
          </div>
          <ChevronDown size={14} className="text-slate-500" />
        </button>

        <span className="flex-1 text-right text-lg font-semibold text-slate-600 dark:text-slate-400">
          ≈ {calculatedAmount.toFixed(8)}
        </span>
      </div>
    </div>
  );
}
