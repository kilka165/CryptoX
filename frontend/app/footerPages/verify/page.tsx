"use client";

import { Shield, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function VerifyPage() {
  const { t } = useTranslation();

  const benefits = [
    t("footerPages.verify.b1"),
    t("footerPages.verify.b2"),
    t("footerPages.verify.b3"),
    t("footerPages.verify.b4")
  ];

  const levels = [
    { level: t("footerPages.verify.lvl1Name"), requirement: t("footerPages.verify.lvl1Req"), withdrawalLimit: t("footerPages.verify.lvl1Limit") },
    { level: t("footerPages.verify.lvl2Name"), requirement: t("footerPages.verify.lvl2Req"), withdrawalLimit: t("footerPages.verify.lvl2Limit") }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <Shield size={48} className="mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("footerPages.verify.title")}</h1>
            <p className="text-xl text-purple-100">
              {t("footerPages.verify.subtitle")}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Что это даёт */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.verify.benefitsTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-lg border border-blue-200 dark:border-slate-700"
                >
                  <CheckCircle className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
                  <p className="text-slate-700 dark:text-slate-300">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Уровни защиты аккаунта */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.verify.levelsTitle")}
            </h2>
            <div className="space-y-4">
              {levels.map((level, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {level.level}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {level.requirement}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-500 mb-1">{t("footerPages.verify.withdrawLimit")}</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {level.withdrawalLimit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Как включить 2FA */}
          <section className="mb-12">
            <div className="bg-slate-50 dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 p-8">
              <div className="flex items-start gap-4">
                <Lock className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" size={28} />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {t("footerPages.verify.enable2faTitle")}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {t("footerPages.verify.enable2faText")}
                  </p>
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    {t("footerPages.verify.goToSettings")}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-purple-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.verify.faqTitle")}
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.verify.faq1Q")}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("footerPages.verify.faq1A")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.verify.faq2Q")}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("footerPages.verify.faq2A")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.verify.faq3Q")}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("footerPages.verify.faq3A")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
