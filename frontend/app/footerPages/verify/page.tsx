"use client";

import { useState } from "react";
import { Shield, CheckCircle, Upload, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function VerifyPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const benefits = [
    t("footerPages.verify.b1"),
    t("footerPages.verify.b2"),
    t("footerPages.verify.b3"),
    t("footerPages.verify.b4")
  ];

  const verificationLevels = [
    { level: t("footerPages.verify.lvl1Name"), requirement: t("footerPages.verify.lvl1Req"), withdrawalLimit: t("footerPages.verify.lvl1Limit") },
    { level: t("footerPages.verify.lvl2Name"), requirement: t("footerPages.verify.lvl2Req"), withdrawalLimit: t("footerPages.verify.lvl2Limit") },
    { level: t("footerPages.verify.lvl3Name"), requirement: t("footerPages.verify.lvl3Req"), withdrawalLimit: t("footerPages.verify.lvl3Limit") }
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
          {/* Преимущества */}
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

          {/* Уровни верификации */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.verify.levelsTitle")}
            </h2>
            <div className="space-y-4">
              {verificationLevels.map((level, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-200 dark:border-slate-800"
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

          {/* Процесс верификации */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.verify.processTitle")}
            </h2>

            <div className="bg-slate-50 dark:bg-[#131416] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              {/* Шаг 1: Личные данные */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {t("footerPages.verify.step1Title")}
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {t("footerPages.verify.fullName")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("footerPages.verify.fullNamePlaceholder")}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {t("footerPages.verify.birthDate")}
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {t("footerPages.verify.country")}
                    </label>
                    <select className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100">
                      <option>{t("footerPages.verify.selectCountry")}</option>
                      <option>{t("footerPages.verify.countryKZ")}</option>
                      <option>{t("footerPages.verify.countryRU")}</option>
                      <option>{t("footerPages.verify.countryUS")}</option>
                      <option>{t("footerPages.verify.countryOther")}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Шаг 2: Документы */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {t("footerPages.verify.step2Title")}
                  </h3>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      {t("footerPages.verify.uploadDoc")}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {t("footerPages.verify.uploadDocHint")}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>{t("footerPages.verify.reqLabel")}</strong>{t("footerPages.verify.reqText")}
                    </p>
                  </div>
                </div>
              )}

              {/* Шаг 3: Селфи */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {t("footerPages.verify.step3Title")}
                  </h3>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      {t("footerPages.verify.uploadSelfie")}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {t("footerPages.verify.uploadSelfieHint")}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>{t("footerPages.verify.importantLabel")}</strong>{t("footerPages.verify.importantText")}
                    </p>
                  </div>
                </div>
              )}

              {/* Навигация */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t("common.back")}
                  </button>
                )}
                <button
                  onClick={() => step < 3 ? setStep(step + 1) : null}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {step === 3 ? t("footerPages.verify.submitReview") : t("common.next")}
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Индикатор шага */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-12 rounded-full transition-colors ${
                      s === step
                        ? "bg-purple-600"
                        : s < step
                        ? "bg-green-600"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
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
