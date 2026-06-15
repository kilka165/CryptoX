"use client";

import Link from "next/link";
import { LogIn, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Окно «Вы не авторизованы» со ссылкой на вход. Показывается, когда
 * незалогиненный пользователь пытается совершить транзакцию на публичной
 * странице (P2P, конвертация, стейкинг).
 */
export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#131416] p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <LogIn className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>

        <h3 className="text-lg font-bold mb-2">{t("common.authRequiredTitle")}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {t("common.authRequiredText")}
        </p>

        <Link
          href="/login"
          className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          {t("common.authRequiredLogin")}
        </Link>
      </div>
    </div>
  );
}
