// components/convert/CurrencySelectModal.tsx
"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";

export interface CurrencyItem {
  id: string;
  symbol: string;
  name: string;
  image?: string;
}

interface CurrencySelectModalProps {
  open: boolean;
  onClose: () => void;
  coins: CurrencyItem[];
  onSelect: (coin: CurrencyItem) => void;
}

export const CurrencySelectModal: React.FC<CurrencySelectModalProps> = ({
  open,
  onClose,
  coins,
  onSelect,
}) => {
  const [tab, setTab] = useState<"single" | "multi">("single");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [coins, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg bg-slate-900 text-slate-50 rounded-2xl border border-slate-700 shadow-2xl max-h-[80vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h2 className="text-sm font-semibold">Select Currency</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* tabs */}
        <div className="px-4 pt-3">
          <div className="grid grid-cols-2 bg-slate-800 rounded-lg p-1 text-xs mb-3">
            <button
              onClick={() => setTab("single")}
              className={`py-1 rounded-md ${
                tab === "single"
                  ? "bg-slate-900 text-slate-50"
                  : "text-slate-400"
              }`}
            >
              Одна монета
            </button>
            <button
              onClick={() => setTab("multi")}
              className={`py-1 rounded-md ${
                tab === "multi"
                  ? "bg-slate-900 text-slate-50"
                  : "text-slate-400"
              }`}
            >
              Несколько монет
            </button>
          </div>

          {/* search */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {tab === "multi" && (
            <p className="px-2 text-[11px] text-slate-500 mb-2">
              Выберите до 5 монет (режим заглушка, сейчас выбирается одна)
            </p>
          )}

          {filtered.map((coin) => (
            <button
              key={coin.id}
              onClick={() => {
                onSelect(coin);
                onClose();
              }}
              className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-800 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[11px] font-bold">
                  {coin.symbol.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {coin.name}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* footer для multi (заглушка) */}
        {tab === "multi" && (
          <div className="border-t border-slate-700 px-4 py-3 text-[11px] text-slate-400">
            Выбрать все доступные монеты: (пока не реализовано)
          </div>
        )}
      </div>
    </div>
  );
};
