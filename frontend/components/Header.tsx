"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, User, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";


export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем авторизацию при загрузке (только на клиенте)
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token); // Если токен есть -> true, нет -> false
  }, []);

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#131416]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
              CryptoX
            </span>
          </Link>
          
          {/* Меню (скрыто на мобильных) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link href="/market" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Рынок
            </Link>
            <Link href="/p2p" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              P2P
            </Link>
            <Link href="/convert" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Конвертация
            </Link>
            <Link href="/staking" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Стейкинг
            </Link>
          </div>

          {/* Правая часть */}
          <div className="flex items-center gap-4">
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
                    <span>Профиль</span>
                  </Link>

                  {/* Кнопка НАСТРОЙКИ */}
                  <Link 
                    href="/settings" 
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Настройки"
                  >
                    <Settings size={20} />
                  </Link>
                </div>
              ) : (
              <>
                <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white text-sm font-medium transition-colors">
                  Войти
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
