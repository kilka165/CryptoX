"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Settings, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import { AUTH_EVENT, getAuthToken } from "@/lib/auth";


export function Header() {
  const { t, i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Реактивно отслеживаем авторизацию: при загрузке, при входе/выходе в этой
  // вкладке (событие auth-change) и при изменениях в других вкладках (storage).
  // Раньше токен читался один раз при монтировании, поэтому шапка «зависала»
  // в старом состоянии до полной перезагрузки страницы.
  useEffect(() => {
    const sync = () => setIsLoggedIn(!!getAuthToken());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Блокируем прокрутку body, когда открыто мобильное меню
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = (
    <>
      <Link href="/market" onClick={() => setMobileOpen(false)} className="hover:text-blue-600 dark:hover:text-white transition-colors">
        {t("nav.market")}
      </Link>
      <Link href="/p2p" onClick={() => setMobileOpen(false)} className="hover:text-blue-600 dark:hover:text-white transition-colors">
        {t("nav.p2p")}
      </Link>
      <Link href="/convert" onClick={() => setMobileOpen(false)} className="hover:text-blue-600 dark:hover:text-white transition-colors">
        {t("nav.convert")}
      </Link>
      <Link href="/staking" onClick={() => setMobileOpen(false)} className="hover:text-blue-600 dark:hover:text-white transition-colors">
        {t("nav.staking")}
      </Link>
    </>
  );

  return (
    <nav className="border-b border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-[#131416]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.svg"
              alt="CryptoX"
              className="h-12 sm:h-14 lg:h-16 w-auto pb-1 transition-opacity group-hover:opacity-80"
            />
          </Link>

          {/* Меню (инлайн только на десктопе) */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            {navLinks}
          </div>

          {/* Правая часть */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-2 hidden sm:block"></div>

            {/* 👇 УСЛОВНЫЙ РЕНДЕРИНГ */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2"> {/* Обертка для кнопок */}
                  {/* Кнопка ПРОФИЛЬ */}
                  <Link
                    href="/profile"
                    className="flex flex-row items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <User size={18} className="text-slate-500 dark:text-slate-400" />
                    <span className="hidden sm:inline">{t("nav.profile")}</span>
                  </Link>

                  {/* Кнопка НАСТРОЙКИ */}
                  <Link
                    href="/settings"
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:inline-flex"
                    title={t("nav.settings")}
                  >
                    <Settings size={20} />
                  </Link>
                </div>
              ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white text-sm font-medium transition-colors">
                  {t("nav.login")}
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                  {t("nav.register")}
                </Link>
              </div>
            )}

            {/* Кнопка-бургер (мобильные и планшеты) */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label={t("nav.menu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileOpen && (
        <>
          {/* Затемнение фона */}
          <div
            className="fixed inset-0 top-16 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 inset-x-0 lg:hidden bg-white dark:bg-[#131416] border-b border-slate-300 dark:border-slate-800 shadow-lg">
            <div className="px-4 py-4 flex flex-col gap-1 text-base font-medium text-slate-700 dark:text-slate-300">
              <div className="flex flex-col gap-1 [&>a]:py-3 [&>a]:px-2 [&>a]:rounded-lg [&>a:hover]:bg-slate-100 dark:[&>a:hover]:bg-slate-800">
                {navLinks}
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

              {isLoggedIn ? (
                <div className="flex flex-col gap-1 [&>a]:py-3 [&>a]:px-2 [&>a]:rounded-lg [&>a:hover]:bg-slate-100 dark:[&>a:hover]:bg-slate-800">
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                    <User size={18} /> {t("nav.profile")}
                  </Link>
                  <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                    <Settings size={18} /> {t("nav.settings")}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    {t("nav.register")}
                  </Link>
                </div>
              )}

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

              {/* Выбор языка */}
              <div className="px-2 py-1">
                <p className="text-xs text-slate-500 mb-2">{t("nav.language")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const active = i18n.resolvedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={`px-2 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {lang.code.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
