"use client";

import { Shield, Lock, Eye, Database } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <Shield size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("footerPages.privacy.title")}</h1>
            <p className="text-lg text-blue-100">
              {t("footerPages.terms.lastUpdate")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Введение */}
          <section className="mb-8">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t("footerPages.privacy.introP1")}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {t("footerPages.privacy.introP2")}
            </p>
          </section>

          {/* Секция 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s1Title")}
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Database size={20} className="text-blue-600 dark:text-blue-400" />
                  {t("footerPages.privacy.s1c1Title")}
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  {["s1c1i1", "s1c1i2", "s1c1i3", "s1c1i4", "s1c1i5"].map((k) => (
                    <li key={k}>{t(`footerPages.privacy.${k}`)}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Eye size={20} className="text-blue-600 dark:text-blue-400" />
                  {t("footerPages.privacy.s1c2Title")}
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  {["s1c2i1", "s1c2i2", "s1c2i3", "s1c2i4", "s1c2i5"].map((k) => (
                    <li key={k}>{t(`footerPages.privacy.${k}`)}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Lock size={20} className="text-blue-600 dark:text-blue-400" />
                  {t("footerPages.privacy.s1c3Title")}
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  {["s1c3i1", "s1c3i2", "s1c3i3", "s1c3i4"].map((k) => (
                    <li key={k}>{t(`footerPages.privacy.${k}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Секция 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s2Title")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <li key={n} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span><strong>{t(`footerPages.privacy.s2i${n}Bold`)}</strong>{t(`footerPages.privacy.s2i${n}Text`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Секция 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s3Title")}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t("footerPages.privacy.s3intro")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-green-50 dark:bg-[#131416] border border-green-200 dark:border-green-900 rounded-lg p-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{t(`footerPages.privacy.s3a${n}Title`)}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t(`footerPages.privacy.s3a${n}Desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Секция 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s4Title")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.privacy.s4intro")}
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n}>• <strong>{t(`footerPages.privacy.s4i${n}Bold`)}</strong>{t(`footerPages.privacy.s4i${n}Text`)}</li>
                ))}
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                {t("footerPages.privacy.s4notePre")}<strong>{t("footerPages.privacy.s4noteBold")}</strong>{t("footerPages.privacy.s4notePost")}
              </p>
            </div>
          </section>

          {/* Секция 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s5Title")}
            </h2>
            <div className="bg-blue-50 dark:bg-[#131416] rounded-lg p-5 border border-blue-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.privacy.s5intro")}
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <li key={n}>• <strong>{t(`footerPages.privacy.s5i${n}Bold`)}</strong>{t(`footerPages.privacy.s5i${n}Text`)}</li>
                ))}
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                {t("footerPages.privacy.s5contactPre")}<strong>privacy@cryptox.com</strong>
              </p>
            </div>
          </section>

          {/* Секция 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s6Title")}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400">
                {t("footerPages.privacy.s6p1")}
              </p>
            </div>
          </section>

          {/* Секция 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s7Title")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.privacy.s7pre")}
                <a href="/footerPages/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t("footerPages.privacy.s7link")}
                </a>.
              </p>
            </div>
          </section>

          {/* Контактная информация */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.privacy.s8Title")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.privacy.s8p1")}
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><strong>{t("footerPages.terms.s8emailLabel")}</strong> Crypto.x.kilka@gmail.com</li>
                <li><strong>{t("footerPages.terms.s8addrLabel")}</strong> {t("footerPages.terms.s8addrValue")}</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
