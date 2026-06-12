"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Settings, LogOut, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserNavigationProps {
  onLogout: () => void;
}

// Базовые классы пункта + варианты для активного/неактивного состояния
// (вынесены, чтобы стиль точно совпадал с прежним).
const NAV_ITEM_BASE =
  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors";
const NAV_ITEM_ACTIVE = "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
const NAV_ITEM_IDLE =
  "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800";

export function UserNavigation({ onLogout }: UserNavigationProps) {
  const { t } = useTranslation();
  const [active, setActive] = useState<"wallet" | "history">("wallet");

  // Плавная прокрутка к секции-якорю на странице профиля.
  const goTo = (id: string, key: "wallet" | "history") => {
    setActive(key);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="bg-white dark:bg-[#131416] rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 overflow-hidden">
      <div className="p-2 space-y-1">
        <button
          onClick={() => goTo("wallet-overview", "wallet")}
          className={`${NAV_ITEM_BASE} ${active === "wallet" ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE}`}
        >
          <Wallet size={18} /> {t("profile.nav.walletOverview")}
        </button>
        <button
          onClick={() => goTo("transaction-history", "history")}
          className={`${NAV_ITEM_BASE} ${active === "history" ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE}`}
        >
          <History size={18} /> {t("profile.nav.history")}
        </button>
        <Link href="/settings">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Settings size={18} /> {t("nav.settings")}
          </button>
        </Link>
        <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut size={18} /> {t("nav.logout")}
        </button>
      </div>
    </nav>
  );
}
