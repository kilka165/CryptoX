"use client";

import Link from "next/link";
import { History, Settings, LogOut, Wallet } from "lucide-react";

interface UserNavigationProps {
  onLogout: () => void;
}

export function UserNavigation({ onLogout }: UserNavigationProps) {
  return (
    <nav className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-2 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
          <Wallet size={18} /> Обзор кошелька
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <History size={18} /> История операций
        </button>
        <Link href="/settings">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <Settings size={18} /> Настройки
          </button>
        </Link>
        <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
          <LogOut size={18} /> Выйти
        </button>
      </div>
    </nav>
  );
}
