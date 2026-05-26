// frontend/components/p2p/P2PTableHeader.tsx
import React from "react";

export function P2PTableHeader() {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-[180px]">
          <span className="text-xs font-medium text-slate-500 uppercase">
            Мейкеры
          </span>
        </div>
        <div className="flex-1 min-w-[140px]">
          <span className="text-xs font-medium text-slate-500 uppercase">
            Цена
          </span>
        </div>
        <div className="flex-1 min-w-[140px]">
          <span className="text-xs font-medium text-slate-500 uppercase">
            Количество
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase">
            Торгов
          </span>
        </div>
      </div>
    </div>
  );
}
