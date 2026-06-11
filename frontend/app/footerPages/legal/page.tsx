"use client";

import { Scale, FileText, Shield, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function LegalPage() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <Scale size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("footerPages.legal.title")}</h1>
            <p className="text-lg text-slate-300">
              {t("footerPages.legal.subtitle")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Основные документы */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.legal.mainDocs")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/footerPages/terms"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <FileText className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {t("footerPages.legal.doc1Title")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("footerPages.legal.doc1Desc")}
                  </p>
                </div>
              </a>

              <a
                href="/footerPages/privacy"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <Shield className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {t("footerPages.legal.doc2Title")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("footerPages.legal.doc2Desc")}
                  </p>
                </div>
              </a>

              <a
                href="/footerPages/cookies"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {t("footerPages.legal.doc3Title")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("footerPages.legal.doc3Desc")}
                  </p>
                </div>
              </a>

              <a
                href="/footerPages/terms"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <Scale className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {t("footerPages.legal.doc4Title")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("footerPages.legal.doc4Desc")}
                  </p>
                </div>
              </a>
            </div>
          </section>

          {/* Компания */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.legal.companyTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-6">
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t("footerPages.legal.legalName")}</h3>
                  <p>CryptoX</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t("footerPages.legal.legalAddress")}</h3>
                  <p>{t("footerPages.legal.legalAddressValue")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{t("footerPages.legal.legalEmail")}</h3>
                  <p>Crypto.x.kilka@gmail.com</p>
                </div>
              </div>
            </div>
          </section>

          {/* Важная информация */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-amber-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {t("footerPages.legal.importantTitle")}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {t("footerPages.legal.importantP1")}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("footerPages.legal.importantP2")}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
