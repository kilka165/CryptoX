// frontend/components/p2p/P2PTableHeader.tsx
"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export function P2PTableHeader() {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-[180px]">
          <span className="text-xs font-medium text-slate-500 uppercase">
            {t("p2p.tableHeader.makers")}
          </span>
        </div>
        <div className="flex-1 min-w-[140px]">
          <span className="text-xs font-medium text-slate-500 uppercase">
            {t("p2p.tableHeader.price")}
          </span>
        </div>
        <div className="flex-1 min-w-[140px]">
          <span className="text-xs font-medium text-slate-500 uppercase">
            {t("p2p.tableHeader.amount")}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-medium text-slate-500 uppercase">
            {t("p2p.tableHeader.trades")}
          </span>
        </div>
      </div>
    </div>
  );
}
