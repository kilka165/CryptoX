"use client";

import { Shield, Lock, Mail, KeyRound, History, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function SecurityPage() {
  const { t } = useTranslation();

  const securityFeatures = [
    { icon: Lock, title: t("footerPages.security.f1Title"), description: t("footerPages.security.f1Desc") },
    { icon: KeyRound, title: t("footerPages.security.f2Title"), description: t("footerPages.security.f2Desc") },
    { icon: Mail, title: t("footerPages.security.f3Title"), description: t("footerPages.security.f3Desc") },
    { icon: Shield, title: t("footerPages.security.f4Title"), description: t("footerPages.security.f4Desc") },
    { icon: History, title: t("footerPages.security.f5Title"), description: t("footerPages.security.f5Desc") },
    { icon: RefreshCw, title: t("footerPages.security.f6Title"), description: t("footerPages.security.f6Desc") }
  ];

  const bestPractices = [
    t("footerPages.security.p1"),
    t("footerPages.security.p2"),
    t("footerPages.security.p3"),
    t("footerPages.security.p4"),
    t("footerPages.security.p5"),
    t("footerPages.security.p6"),
    t("footerPages.security.p7"),
    t("footerPages.security.p8")
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <Shield size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("footerPages.security.title")}</h1>
            <p className="text-lg text-red-100">
              {t("footerPages.security.subtitle")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Функции безопасности */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.security.featuresTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-[#131416] p-5 rounded-xl border border-slate-300 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 transition-all"
                  >
                    <Icon className="text-red-600 dark:text-red-400 mb-3" size={28} />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Защита аккаунта */}
          <section className="mb-12">
            <div className="bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {t("footerPages.security.protectionTitle")}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {t("footerPages.security.protectionText")}
              </p>
              <Link
                href="/footerPages/verify"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Shield size={20} />
                {t("footerPages.security.verifyBtn")}
              </Link>
            </div>
          </section>

          {/* Рекомендации по безопасности */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.security.practicesTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bestPractices.map((practice, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-slate-50 dark:bg-[#131416] p-4 rounded-lg border border-slate-300 dark:border-slate-800"
                >
                  <CheckCircle className="flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" size={18} />
                  <p className="text-sm text-slate-600 dark:text-slate-400">{practice}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Предупреждения */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border-2 border-red-300 dark:border-red-900">
            <div className="flex items-start gap-4">
              <AlertTriangle className="flex-shrink-0 text-red-600 dark:text-red-400" size={28} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {t("footerPages.security.phishingTitle")}
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    <span>{t("footerPages.security.ph1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    <span>{t("footerPages.security.ph2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    <span>{t("footerPages.security.ph3")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    <span>{t("footerPages.security.ph4")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                    <span>{t("footerPages.security.ph5")}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
