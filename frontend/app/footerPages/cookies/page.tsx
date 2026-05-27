"use client";

import { Cookie, Settings } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function CookiesPage() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-12 " >
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <Cookie size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("footerPages.cookies.title")}</h1>
            <p className="text-lg text-orange-100">
              {t("footerPages.terms.lastUpdate")}
            </p>
          </div>
        </div>


        <div className="container mx-auto px-4 py-10 bg-slate-50 dark:bg-[#131416]" style={{ maxWidth: '900px' }}>
          {/* Введение */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.cookies.intro1Title")}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t("footerPages.cookies.intro1p1")}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                {t("footerPages.cookies.intro1p2")}
              </p>
            </div>
          </section>

          {/* Типы cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.cookies.typesTitle")}
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-[#131416] rounded-lg p-5 border border-blue-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.cookies.type1Title")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {t("footerPages.cookies.type1Desc")}
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>{t("footerPages.cookies.type1i1")}</li>
                  <li>{t("footerPages.cookies.type1i2")}</li>
                  <li>{t("footerPages.cookies.type1i3")}</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-[#131416] rounded-lg p-5 border border-green-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.cookies.type2Title")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {t("footerPages.cookies.type2Desc")}
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>{t("footerPages.cookies.type2i1")}</li>
                  <li>{t("footerPages.cookies.type2i2")}</li>
                  <li>{t("footerPages.cookies.type2i3")}</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-[#131416] rounded-lg p-5 border border-purple-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.cookies.type3Title")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {t("footerPages.cookies.type3Desc")}
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>{t("footerPages.cookies.type3i1")}</li>
                  <li>{t("footerPages.cookies.type3i2")}</li>
                  <li>{t("footerPages.cookies.type3i3")}</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-[#131416] rounded-lg p-5 border border-orange-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.cookies.type4Title")}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {t("footerPages.cookies.type4Desc")}
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>{t("footerPages.cookies.type4i1")}</li>
                  <li>{t("footerPages.cookies.type4i2")}</li>
                  <li>{t("footerPages.cookies.type4i3")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Таблица cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.cookies.tableTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t("footerPages.cookies.colName")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t("footerPages.cookies.colType")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t("footerPages.cookies.colDuration")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {t("footerPages.cookies.colPurpose")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">session_id</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.tNecessary")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.durSession")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.purpose1")}</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">auth_token</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.tNecessary")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.dur7days")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.purpose2")}</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">theme</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.tFunctional")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.dur1year")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.purpose3")}</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">language</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.tFunctional")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.dur1year")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.purpose4")}</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">_ga</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.tAnalytics")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.dur2years")}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t("footerPages.cookies.purpose5")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Управление cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.cookies.manageTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-4 mb-4">
                <Settings className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {t("footerPages.cookies.browserTitle")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {t("footerPages.cookies.browserDesc")}
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>• <strong>{t("footerPages.cookies.chromeBold")}</strong>{t("footerPages.cookies.chromeText")}</li>
                    <li>• <strong>{t("footerPages.cookies.firefoxBold")}</strong>{t("footerPages.cookies.firefoxText")}</li>
                    <li>• <strong>{t("footerPages.cookies.safariBold")}</strong>{t("footerPages.cookies.safariText")}</li>
                    <li>• <strong>{t("footerPages.cookies.edgeBold")}</strong>{t("footerPages.cookies.edgeText")}</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>{t("footerPages.cookies.warnBold")}</strong>{t("footerPages.cookies.warnText")}
                </p>
              </div>
            </div>
          </section>

          {/* Сторонние cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.cookies.thirdTitle")}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.cookies.thirdIntro")}
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>{t("footerPages.cookies.third1Bold")}</strong>{t("footerPages.cookies.third1Text")}</li>
                <li>• <strong>{t("footerPages.cookies.third2Bold")}</strong>{t("footerPages.cookies.third2Text")}</li>
                <li>• <strong>{t("footerPages.cookies.third3Bold")}</strong>{t("footerPages.cookies.third3Text")}</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                {t("footerPages.cookies.thirdNote")}
              </p>
            </div>
          </section>

          {/* Обновления политики */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.cookies.updatesTitle")}
            </h2>
            <div className="bg-blue-50 dark:bg-[#131416] rounded-lg p-5 border border-blue-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">
                {t("footerPages.cookies.updatesP1")}
              </p>
            </div>
          </section>

          {/* Контактная информация */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.cookies.questionsTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                {t("footerPages.cookies.questionsP1")}
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
