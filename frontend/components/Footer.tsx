"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-t border-slate-300 dark:border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        {/* верх: соцсети */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Сообщество
            </span>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <button className="p-2 rounded-full bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800">
                <Twitter size={16} />
              </button>
              <button className="p-2 rounded-full bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800">
                <Facebook size={16} />
              </button>
              <button className="p-2 rounded-full bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800">
                <Instagram size={16} />
              </button>
              <button className="p-2 rounded-full bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800">
                <Youtube size={16} />
              </button>
              <button className="p-2 rounded-full bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800">
                <Github size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* колонки ссылок */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">О нас</h4>
            <nav className="space-y-2 text-slate-600 dark:text-slate-400">
              <FooterLink href="/">О проекте</FooterLink>
              <FooterLink href="#">Вакансии</FooterLink>
              <FooterLink href="#">Новости</FooterLink>
              <FooterLink href="#">Правовое регулирование</FooterLink>
              <FooterLink href="#">Условия использования</FooterLink>
              <FooterLink href="#">Конфиденциальность</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">Продукты</h4>
            <nav className="space-y-2 text-slate-600 dark:text-slate-400">
              <FooterLink href="/market">Торговля</FooterLink>
              <FooterLink href="/market">Купить криптовалюту</FooterLink>
              <FooterLink href="#">Стейкинг</FooterLink>
              <FooterLink href="#">P2P</FooterLink>
              <FooterLink href="#">Запуск токенов</FooterLink>
              <FooterLink href="/market/overview">Исследования</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">Для компаний</h4>
            <nav className="space-y-2 text-slate-600 dark:text-slate-400">
              <FooterLink href="#">Листинг токена</FooterLink>
              <FooterLink href="#">Институциональные услуги</FooterLink>
              <FooterLink href="#">API‑доступ</FooterLink>
              <FooterLink href="#">Партнёрские программы</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">Узнать больше</h4>
            <nav className="space-y-2 text-slate-600 dark:text-slate-400">
              <FooterLink href="#">Гайды по трейдингу</FooterLink>
              <FooterLink href="#">Стоимость криптовалют</FooterLink>
              <FooterLink href="#">Исторические данные</FooterLink>
              <FooterLink href="#">Ресерч по рынку</FooterLink>
              <FooterLink href="#">API CoinGecko</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">Поддержка</h4>
            <nav className="space-y-2 text-slate-600 dark:text-slate-400">
              <FooterLink href="#">Центр помощи</FooterLink>
              <FooterLink href="#">Чат 24/7</FooterLink>
              <FooterLink href="#">Комиссии</FooterLink>
              <FooterLink href="#">Безопасность аккаунта</FooterLink>
              <FooterLink href="#">Сообщить о баге</FooterLink>
            </nav>
          </div>
        </div>

        {/* низ */}
        <div className="mt-10 border-t border-slate-300 dark:border-slate-800 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-500">
          <span>© {new Date().getFullYear()} CryptoExchange. Все права защищены.</span>
          <span className="text-[11px]">
            Данные по рынку и ценам предоставлены CoinGecko.
          </span>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="block hover:text-slate-900 dark:hover:text-slate-100 hover:underline underline-offset-4"
  >
    {children}
  </Link>
);
