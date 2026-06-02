"use client";

import React, { useEffect, useMemo, useState } from "react";

interface CoinIconProps {
  /** URL картинки из данных (если есть), напр. coin.image / asset.logo_url */
  src?: string | null;
  symbol: string;
  /** Классы размера, напр. "w-8 h-8" */
  className?: string;
}

// Иконка монеты: пробует несколько источников картинки по очереди
// (CDN по символу → переданный URL), а если ни один не загрузился —
// откатывается на 3-буквенное обозначение монеты.
export function CoinIcon({ src, symbol, className = "w-8 h-8" }: CoinIconProps) {
  const candidates = useMemo(() => {
    const sym = symbol.trim();
    const list: string[] = [];
    if (sym) {
      // Binance CDN — иконки по символу, покрывает все листингованные монеты
      list.push(`https://bin.bnbstatic.com/static/assets/logos/${sym.toUpperCase()}.png`);
      // CoinCap — запасной источник
      list.push(`https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`);
    }
    if (src) list.push(src);
    return list;
  }, [src, symbol]);

  const [idx, setIdx] = useState(0);

  // Сбрасываем на первый источник при смене монеты (списки переиспользуют компонент)
  useEffect(() => setIdx(0), [candidates.join("|")]);

  const current = candidates[idx];

  if (!current) {
    return (
      <div
        className={`${className} rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase shrink-0`}
      >
        {symbol.slice(0, 3).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={current}
      alt={symbol}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
      className={`${className} rounded-full object-contain bg-slate-100 dark:bg-slate-800 p-0.5 shrink-0`}
    />
  );
}
