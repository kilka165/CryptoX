"use client";

import { FileText, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <FileText size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("footerPages.terms.title")}</h1>
            <p className="text-lg text-slate-300">
              {t("footerPages.terms.lastUpdate")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Важное уведомление */}
          <div className="bg-amber-50 dark:bg-[#131416] border-2 border-amber-300 dark:border-amber-900 rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.terms.noticeTitle")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("footerPages.terms.noticeText")}
                </p>
              </div>
            </div>
          </div>

          {/* Секция 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s1Title")}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s1p1")}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s1p2")}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {t("footerPages.terms.s1p3")}
              </p>
            </div>
          </section>

          {/* Секция 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s2Title")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                {["s2i1", "s2i2", "s2i3", "s2i4", "s2i5"].map((k) => (
                  <li key={k} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>{t(`footerPages.terms.${k}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Секция 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s3Title")}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s3p1")}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s3p2")}
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 ml-6">
                <li>{t("footerPages.terms.s3i1")}</li>
                <li>{t("footerPages.terms.s3i2")}</li>
                <li>{t("footerPages.terms.s3i3")}</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                {t("footerPages.terms.s3p3")}
              </p>
            </div>
          </section>

          {/* Секция 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s4Title")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s4p1")}
              </p>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                {["s4i1", "s4i2", "s4i3", "s4i4"].map((k) => (
                  <li key={k} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                    <span>{t(`footerPages.terms.${k}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Секция 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s5Title")}
            </h2>
            <div className="bg-red-50 dark:bg-[#131416] border border-red-200 dark:border-red-900 rounded-lg p-5">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s5p1")}
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                {["s5i1", "s5i2", "s5i3", "s5i4", "s5i5"].map((k) => (
                  <li key={k} className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                    <span>{t(`footerPages.terms.${k}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Секция 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s6Title")}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s6p1")}
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 ml-6 mb-3">
                <li>{t("footerPages.terms.s6i1")}</li>
                <li>{t("footerPages.terms.s6i2")}</li>
                <li>{t("footerPages.terms.s6i3")}</li>
                <li>{t("footerPages.terms.s6i4")}</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400">
                {t("footerPages.terms.s6p2")}
              </p>
            </div>
          </section>

          {/* Секция 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s7Title")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-300 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                {t("footerPages.terms.s7p1")}
              </p>
            </div>
          </section>

          {/* Контактная информация */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.terms.s8Title")}
            </h2>
            <div className="bg-blue-50 dark:bg-[#131416] rounded-lg p-5 border border-blue-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.terms.s8p1")}
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
