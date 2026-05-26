"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  X,
  Shield,
  Award,
  TrendingUp,
  Globe,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-700 dark:text-slate-300 border-t border-slate-300 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Верхняя секция с логотипом и описанием */}
        <div className="mb-12 pb-10 border-b border-slate-300 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CryptoX
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Ведущая криптовалютная биржа с передовыми технологиями безопасности 
                и низкими комиссиями. Торгуйте, стейкайте и зарабатывайте с CryptoX.
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Преимущества */}
                <div>
                  <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4 text-sm">
                    Наши преимущества
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="text-green-500" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        Защита активов на $1 млрд
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="text-blue-500" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        Лицензирована в 50+ странах
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="text-purple-500" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        10М+ активных пользователей
                      </span>
                    </div>
                  </div>
                </div>

                {/* Контакты */}
                <div>
                  <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4 text-sm">
                    Связаться с нами
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
                      <a 
                        href="mailto:crypto.x.kilka@gmail.com" 
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        crypto.x.kilka@gmail.com
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <a 
                        href="tel:+77172000000" 
                        className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                      >
                        +7 (7172) 00-00-00
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        Астана, Казахстан
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Социальные сети */}
        <div className="mb-10 pb-10 border-b border-slate-300 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-3 text-sm">
                Присоединяйтесь к сообществу
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Следите за новостями и обновлениями в наших социальных сетях
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/cryptox" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="X"
              >
                <X size={18} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61586263641113" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/cryptox.kilka/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://youtube.com/cryptox" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-red-700 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a 
                href="https://github.com/kilka165/CryptoX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Колонки с ссылками */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10 text-sm">
          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              О компании
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/footerPages/about">О нас</FooterLink>
              <FooterLink href="/footerPages/legal">Правовая информация</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              Продукты
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/market">Спотовая торговля</FooterLink>
              <FooterLink href="/staking">Стейкинг</FooterLink>
              <FooterLink href="/p2p">P2P торговля</FooterLink>
              <FooterLink href="/convert">Конвертация</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              Сервисы
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/market">Купить крипту</FooterLink>
              <FooterLink href="/profile">Кошелек</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              Обучение
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/footerPages/guides">Гайды</FooterLink>
              <FooterLink href="/footerPages/prices">Цены криптовалют</FooterLink>
              <FooterLink href="/footerPages/glossary">Глоссарий</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              Поддержка
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/footerPages/support">Центр помощи</FooterLink>
              <FooterLink href="/footerPages/chat">Чат поддержки 24/7</FooterLink>
              <FooterLink href="/footerPages/fees">Комиссии</FooterLink>
              <FooterLink href="/footerPages/security">Безопасность</FooterLink>
              <FooterLink href="/footerPages/verify">Верификация</FooterLink>
              <FooterLink href="/footerPages/bug-bounty">Bug Bounty</FooterLink>
            </nav>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mb-8 p-6 bg-slate-200/50 dark:bg-slate-800/30 rounded-xl border border-slate-300 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Важная информация о рисках
              </p>
              <p>
                Торговля криптовалютами сопряжена с высоким уровнем риска и может не подходить 
                для всех инвесторов. Прежде чем начать торговлю, убедитесь, что вы полностью 
                понимаете связанные с этим риски и примите во внимание свой уровень опыта. 
                Рыночная волатильность может привести к значительным убыткам. Инвестируйте 
                только те средства, потерю которых вы можете себе позволить.
              </p>
            </div>
          </div>
        </div>

        {/* Нижний колонтитул */}
        <div className="pt-8 border-t border-slate-300 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-500">
              <span className="font-medium">
                © {currentYear} CryptoX Exchange. Все права защищены.
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Link 
                  href="/footerPages/terms" 
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Условия использования
                </Link>
                <Link 
                  href="/footerPages/privacy" 
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Политика конфиденциальности
                </Link>
                <Link 
                  href="/footerPages/cookies" 
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Cookies
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <span>Данные предоставлены</span>
              <a 
                href="https://www.binance.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Binance
              </a>
            </div>
          </div>

          {/* Версия */}
          <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-800 flex justify-center">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <span>Версия:</span>
              <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">v2.4.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка "Наверх" */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
        aria-label="Наверх"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
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
    className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
  >
    {children}
  </Link>
);
