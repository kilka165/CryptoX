"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
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
  Globe,
} from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0d0d0d]   dark:to-[#131416] text-slate-700 dark:text-slate-300 border-t border-slate-300 dark:border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Верхняя секция с логотипом и описанием */}
        <div className="mb-12 pb-10 border-b border-slate-300 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <img src="/logo.svg" alt="CryptoX" className="h-30 w-auto" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("footer.description")}
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Преимущества */}
                <div>
                  <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4 text-sm">
                    {t("footer.advantages")}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="text-green-500" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        {t("footer.adv1")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="text-blue-500" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        {t("footer.adv2")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="text-purple-500" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        {t("footer.adv3")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Контакты */}
                <div>
                  <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4 text-sm">
                    {t("footer.contactUs")}
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
                        href="tel:+77473841410"
                        className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                      >
                        +7 (747) 384-14-10
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-slate-600 dark:text-slate-400">
                        {t("footer.location")}
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
                {t("footer.joinCommunity")}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t("footer.followUs")}
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
              {t("footer.companyTitle")}
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/footerPages/about">{t("footer.about")}</FooterLink>
              <FooterLink href="/footerPages/legal">{t("footer.legal")}</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              {t("footer.productsTitle")}
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/market">{t("footer.spotTrading")}</FooterLink>
              <FooterLink href="/staking">{t("footer.staking")}</FooterLink>
              <FooterLink href="/p2p">{t("footer.p2pTrading")}</FooterLink>
              <FooterLink href="/convert">{t("footer.convert")}</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              {t("footer.servicesTitle")}
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/market">{t("footer.buyCrypto")}</FooterLink>
              <FooterLink href="/profile">{t("footer.wallet")}</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              {t("footer.educationTitle")}
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/footerPages/guides">{t("footer.guides")}</FooterLink>
              <FooterLink href="/footerPages/prices">{t("footer.prices")}</FooterLink>
              <FooterLink href="/footerPages/glossary">{t("footer.glossary")}</FooterLink>
            </nav>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">
              {t("footer.supportTitle")}
            </h4>
            <nav className="space-y-2.5">
              <FooterLink href="/footerPages/support">{t("footer.helpCenter")}</FooterLink>
              <FooterLink href="/footerPages/fees">{t("footer.fees")}</FooterLink>
              <FooterLink href="/footerPages/security">{t("footer.security")}</FooterLink>
              <FooterLink href="/footerPages/verify">{t("footer.verify")}</FooterLink>
              <FooterLink href="/footerPages/bug-bounty">{t("footer.bugBounty")}</FooterLink>
            </nav>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mb-8 p-6 bg-slate-200/50 dark:bg-[#16181c] rounded-xl border border-slate-300 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {t("footer.riskTitle")}
              </p>
              <p>
                {t("footer.riskText")}
              </p>
            </div>
          </div>
        </div>

        {/* Нижний колонтитул */}
        <div className="pt-8 border-t border-slate-300 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-500">
              <span className="font-medium">
                {t("footer.copyright", { year: currentYear })}
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/footerPages/terms"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t("footer.terms")}
                </Link>
                <Link
                  href="/footerPages/privacy"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t("footer.privacy")}
                </Link>
                <Link
                  href="/footerPages/cookies"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t("footer.cookies")}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <span>{t("footer.dataProvidedBy")}</span>
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
              <span>{t("footer.version")}</span>
              <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">v2.4.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка "Наверх" */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
        aria-label={t("common.toTop")}
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
