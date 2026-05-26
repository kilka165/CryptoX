import React, { useState } from "react";
import { Search, X } from "lucide-react";

export interface CurrencyItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

interface CurrencySelectModalProps {
  open: boolean;
  onClose: () => void;
  coins: CurrencyItem[];
  onSelect: (coin: CurrencyItem) => void;
}

export function CurrencySelectModal({
  open,
  onClose,
  coins,
  onSelect,
}: CurrencySelectModalProps) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-300 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-800">
          <h3 className="text-lg font-bold">Выберите монету</h3>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-300 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">
              Ничего не найдено
            </p>
          ) : (
            filtered.map((coin) => (
              <button
                key={coin.id}
                onClick={() => {
                  onSelect(coin);
                  setSearch("");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                  {coin.symbol.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{coin.symbol.toUpperCase()}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{coin.name}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
