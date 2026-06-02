"use client";

import { Shield, Lock, Eye, Fingerprint, Server, CheckCircle, AlertTriangle, Key } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function SecurityPage() {
  const { t } = useTranslation();

  const securityFeatures = [
    { icon: Lock, title: t("footerPages.security.f1Title"), description: t("footerPages.security.f1Desc") },
    { icon: Server, title: t("footerPages.security.f2Title"), description: t("footerPages.security.f2Desc") },
    { icon: Fingerprint, title: t("footerPages.security.f3Title"), description: t("footerPages.security.f3Desc") },
    { icon: Shield, title: t("footerPages.security.f4Title"), description: t("footerPages.security.f4Desc") },
    { icon: Eye, title: t("footerPages.security.f5Title"), description: t("footerPages.security.f5Desc") },
    { icon: Key, title: t("footerPages.security.f6Title"), description: t("footerPages.security.f6Desc") }
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

  const verificationLevels = [
    { level: t("footerPages.security.lvl0Name"), description: t("footerPages.security.lvl0Desc"), withdrawalLimit: t("footerPages.security.lvl0Limit") },
    { level: t("footerPages.security.lvl1Name"), description: t("footerPages.security.lvl1Desc"), withdrawalLimit: t("footerPages.security.lvl1Limit") },
    { level: t("footerPages.security.lvl2Name"), description: t("footerPages.security.lvl2Desc"), withdrawalLimit: t("footerPages.security.lvl2Limit") },
    { level: t("footerPages.security.lvl3Name"), description: t("footerPages.security.lvl3Desc"), withdrawalLimit: t("footerPages.security.lvl3Limit") }
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
          {/* Статистика безопасности */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-blue-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">$1B</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{t("footerPages.security.statInsurance")}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-green-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">95%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{t("footerPages.security.statColdStorage")}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-purple-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">24/7</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{t("footerPages.security.statMonitoring")}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border border-orange-200 dark:border-slate-700 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">0</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{t("footerPages.security.statHacks")}</div>
            </div>
          </div>

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

          {/* Уровни верификации */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.security.levelsTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t("footerPages.security.colLevel")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t("footerPages.security.colRequirements")}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t("footerPages.security.colWithdrawLimit")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {verificationLevels.map((level, index) => (
                      <tr key={index} className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-semibold">
                          {level.level}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {level.description}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                          {level.withdrawalLimit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 text-center">
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
                    <span>{t("footerPages.security.ph2pre")}<strong>https://cryptox.com</strong>{t("footerPages.security.ph2post")}</span>
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
