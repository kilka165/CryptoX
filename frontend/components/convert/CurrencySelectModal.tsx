"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";

export interface CurrencyItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  coins: CurrencyItem[];
  onSelect: (coin: CurrencyItem) => void;
}

export function CurrencySelectModal({ open, onClose, coins, onSelect }: Props) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[80vh]">
        {/* Заголовок */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">
            Выберите монету
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Поиск */}
        <div className="px-5 py-3 border-b border-slate-800">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Список монет */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-8">
              Ничего не найдено
            </p>
          ) : (
            filtered.map((coin) => (
              <button
                key={coin.id}
                type="button"
                onClick={() => {
                  onSelect(coin);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                  {coin.symbol.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-slate-100">
                    {coin.symbol.toUpperCase()}
                  </div>
                  <div className="text-xs text-slate-400">{coin.name}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
