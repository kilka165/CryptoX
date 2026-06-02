"use client";

import { Bug, DollarSign, Mail, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function BugBountyPage() {
  const { t } = useTranslation();

  const rewards = [
    { severity: t("footerPages.bugBounty.sevCritical"), reward: "$5,000 - $10,000", color: "red" },
    { severity: t("footerPages.bugBounty.sevHigh"), reward: "$1,000 - $5,000", color: "orange" },
    { severity: t("footerPages.bugBounty.sevMedium"), reward: "$500 - $1,000", color: "yellow" },
    { severity: t("footerPages.bugBounty.sevLow"), reward: "$100 - $500", color: "blue" }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <Bug className="mx-auto mb-4" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bug Bounty Program</h1>
            <p className="text-xl text-green-100">
              {t("footerPages.bugBounty.subtitle")}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Что это такое */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("footerPages.bugBounty.whatTitle")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t("footerPages.bugBounty.whatText")}
            </p>
          </section>

          {/* Вознаграждения */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.bugBounty.rewardsTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800"
                >
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-400 mb-2`}>
                      {item.severity}
                    </span>
                    <div className="text-sm text-slate-500 dark:text-slate-500">{t("footerPages.bugBounty.vulnerability")}</div>
                  </div>
                  <div className="text-right">
                    <DollarSign className="inline-block text-green-600 dark:text-green-400 mb-1" size={20} />
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {item.reward}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Примеры уязвимостей */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.bugBounty.lookingTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-6">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span><strong>{t("footerPages.bugBounty.look1Bold")}</strong>{t("footerPages.bugBounty.look1Text")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                  <span><strong>{t("footerPages.bugBounty.look2Bold")}</strong>{t("footerPages.bugBounty.look2Text")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                  <span><strong>{t("footerPages.bugBounty.look3Bold")}</strong>{t("footerPages.bugBounty.look3Text")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>{t("footerPages.bugBounty.look4Bold")}</strong>{t("footerPages.bugBounty.look4Text")}</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Правила */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.bugBounty.rulesTitle")}
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>{t("footerPages.bugBounty.rule1")}</li>
                <li>{t("footerPages.bugBounty.rule2")}</li>
                <li>{t("footerPages.bugBounty.rule3")}</li>
                <li>{t("footerPages.bugBounty.rule4")}</li>
                <li>{t("footerPages.bugBounty.rule5")}</li>
              </ul>
            </div>
          </section>

          {/* Как отправить отчет */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.bugBounty.howTitle")}
            </h2>
            <div className="bg-slate-50 dark:bg-[#131416] rounded-xl p-6 border border-slate-300 dark:border-slate-800">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={28} />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {t("footerPages.bugBounty.howHeading")}
                  </h3>
                  <ol className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>{t("footerPages.bugBounty.howStep1")}</li>
                    <li>{t("footerPages.bugBounty.howStep2")}</li>
                    <li>{t("footerPages.bugBounty.howStep3")}</li>
                    <li>{t("footerPages.bugBounty.howStep4")}</li>
                  </ol>
                </div>
              </div>
              <a
                href="mailto:crypto.x.kilka@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Mail size={20} />
                {t("footerPages.bugBounty.sendReport")}
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              {t("footerPages.bugBounty.faqTitle")}
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-[#131416] rounded-lg border border-slate-300 dark:border-slate-800 p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.bugBounty.faq1Q")}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("footerPages.bugBounty.faq1A")}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#131416] rounded-lg border border-slate-300 dark:border-slate-800 p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.bugBounty.faq2Q")}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("footerPages.bugBounty.faq2A")}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-[#131416] rounded-lg border border-slate-300 dark:border-slate-800 p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {t("footerPages.bugBounty.faq3Q")}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("footerPages.bugBounty.faq3A")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
