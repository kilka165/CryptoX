"use client";

import { Users, Target, Award, TrendingUp, Globe, Shield, Zap, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { value: "2M+", label: t("footerPages.about.statUsers"), icon: Users },
    { value: "$50B+", label: t("footerPages.about.statVolume"), icon: TrendingUp },
    { value: "150+", label: t("footerPages.about.statCountries"), icon: Globe },
    { value: "500+", label: t("footerPages.about.statCryptos"), icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: t("footerPages.about.value1Title"),
      description: t("footerPages.about.value1Desc")
    },
    {
      icon: Zap,
      title: t("footerPages.about.value2Title"),
      description: t("footerPages.about.value2Desc")
    },
    {
      icon: Heart,
      title: t("footerPages.about.value3Title"),
      description: t("footerPages.about.value3Desc")
    },
    {
      icon: Users,
      title: t("footerPages.about.value4Title"),
      description: t("footerPages.about.value4Desc")
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("footerPages.about.heroTitle")}</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              {t("footerPages.about.heroSubtitle")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Статистика */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-xl border border-blue-200 dark:border-slate-700 text-center"
                  >
                    <Icon className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={28} />
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Наша история */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.about.historyTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {t("footerPages.about.historyP1")}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {t("footerPages.about.historyP2")}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("footerPages.about.historyP3")}
              </p>
            </div>
          </section>

          {/* Наша миссия */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.about.missionTitle")}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <Target className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {t("footerPages.about.missionHeading")}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t("footerPages.about.missionText")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Наши ценности */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.about.valuesTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-[#131416] p-5 rounded-xl border border-slate-200 dark:border-slate-800"
                  >
                    <Icon className="text-blue-600 dark:text-blue-400 mb-3" size={28} />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Связаться с нами */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-purple-200 dark:border-slate-700 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {t("footerPages.about.joinTitle")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t("footerPages.about.joinSubtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/register"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                {t("footerPages.about.startTrading")}
              </a>
              <a
                href="/footerPages/support"
                className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg font-semibold transition-colors"
              >
                {t("footerPages.about.contactUs")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
