"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Закрытие по клику вне меню
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Заглушка до монтирования, чтобы не прыгало и не было рассинхрона гидрации
  if (!mounted) {
    return <div className="h-9 w-[52px]" />;
  }

  const current = i18n.resolvedLanguage || "ru";

  const change = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 px-2.5 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
      >
        {current.toUpperCase()}
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131416] shadow-lg py-1 z-50"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = current === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => change(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  active
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{lang.label}</span>
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
