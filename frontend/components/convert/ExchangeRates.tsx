import React from "react";

interface ExchangeRatesProps {
  fromCoins: Array<{ coin: { symbol: string; current_price: number } }>;
  toCoin: { symbol: string; current_price: number } | null;
}

export function ExchangeRates({ fromCoins, toCoin }: ExchangeRatesProps) {
  if (!toCoin || fromCoins.length === 0) return null;

  return (
    <div className="space-y-1">
      {fromCoins.map((fc, idx) => (
        <div
          key={idx}
          className="text-xs text-slate-500 dark:text-slate-500 flex justify-between px-1"
        >
          <span>
            1 {fc.coin.symbol.toUpperCase()} ≈{" "}
            {(fc.coin.current_price / toCoin.current_price).toFixed(8)}{" "}
            {toCoin.symbol.toUpperCase()}
          </span>
          <span>
            1 {toCoin.symbol.toUpperCase()} ≈{" "}
            {(toCoin.current_price / fc.coin.current_price).toFixed(8)}{" "}
            {fc.coin.symbol.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}
