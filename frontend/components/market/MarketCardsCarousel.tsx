"use client";

import React, { ComponentType, useRef, useState } from "react";
import { MarketCard } from "./MarketCard";
import { Coin } from "@/types/coin";

export interface MarketCardDef {
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  coins: Coin[];
  href?: string;
}

interface MarketCardsCarouselProps {
  cards: MarketCardDef[];
  onBuy: (coin: Coin) => void;
  userCurrency: string;
  exchangeRate: number;
}

// Мобильная карусель карточек рынка: одна карточка на экране,
// листается свайпом (scroll-snap), переключается табами и точками.
export function MarketCardsCarousel({
  cards,
  onBuy,
  userCurrency,
  exchangeRate,
}: MarketCardsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setActive(i);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };

  return (
    <div className="md:hidden mb-8">
      {/* Табы-категории — сетка 2×2, без прокрутки */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {cards.map((c, i) => (
          <button
            key={c.title}
            onClick={() => goTo(i)}
            className={`flex items-center justify-center gap-1.5 min-w-0 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
              active === i
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <c.icon size={14} className="shrink-0" />
            <span className="truncate">{c.title}</span>
          </button>
        ))}
      </div>

      {/* Слайды */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {cards.map((c) => (
          <div key={c.title} className="snap-start shrink-0 w-full">
            <MarketCard
              title={c.title}
              icon={c.icon}
              coins={c.coins}
              onBuy={onBuy}
              userCurrency={userCurrency}
              exchangeRate={exchangeRate}
              href={c.href}
            />
          </div>
        ))}
      </div>

      {/* Точки-индикаторы */}
      <div className="flex justify-center gap-1.5 mt-3">
        {cards.map((c, i) => (
          <button
            key={c.title}
            onClick={() => goTo(i)}
            aria-label={c.title}
            className={`h-1.5 rounded-full transition-all ${
              active === i ? "w-5 bg-blue-600" : "w-1.5 bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
