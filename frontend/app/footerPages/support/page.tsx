"use client";

import { useState } from "react";
import { Search, HelpCircle, MessageCircle, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function SupportPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const allCat = t("footerPages.support.catAll");
  const [selectedCategory, setSelectedCategory] = useState(allCat);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const cat = {
    account: t("footerPages.support.catAccount"),
    deposit: t("footerPages.support.catDeposit"),
    trading: t("footerPages.support.catTrading"),
    security: t("footerPages.support.catSecurity"),
    verification: t("footerPages.support.catVerification"),
    fees: t("footerPages.support.catFees"),
  };

  const faqItems: FAQItem[] = [
    { question: t("footerPages.support.q1"), answer: t("footerPages.support.a1"), category: cat.account },
    { question: t("footerPages.support.q2"), answer: t("footerPages.support.a2"), category: cat.deposit },
    { question: t("footerPages.support.q3"), answer: t("footerPages.support.a3"), category: cat.fees },
    { question: t("footerPages.support.q4"), answer: t("footerPages.support.a4"), category: cat.deposit },
    { question: t("footerPages.support.q5"), answer: t("footerPages.support.a5"), category: cat.security },
    { question: t("footerPages.support.q6"), answer: t("footerPages.support.a6"), category: cat.verification },
    { question: t("footerPages.support.q7"), answer: t("footerPages.support.a7"), category: cat.account },
    { question: t("footerPages.support.q8"), answer: t("footerPages.support.a8"), category: cat.trading },
    { question: t("footerPages.support.q9"), answer: t("footerPages.support.a9"), category: cat.deposit },
    { question: t("footerPages.support.q10"), answer: t("footerPages.support.a10"), category: cat.verification },
    { question: t("footerPages.support.q11"), answer: t("footerPages.support.a11"), category: cat.security },
    { question: t("footerPages.support.q12"), answer: t("footerPages.support.a12"), category: cat.fees },
    { question: t("footerPages.support.q13"), answer: t("footerPages.support.a13"), category: cat.trading },
    { question: t("footerPages.support.q14"), answer: t("footerPages.support.a14"), category: cat.verification },
    { question: t("footerPages.support.q15"), answer: t("footerPages.support.a15"), category: cat.account },
    { question: t("footerPages.support.q16"), answer: t("footerPages.support.a16"), category: cat.trading },
    { question: t("footerPages.support.q17"), answer: t("footerPages.support.a17"), category: cat.security },
    { question: t("footerPages.support.q18"), answer: t("footerPages.support.a18"), category: cat.fees },
    { question: t("footerPages.support.q19"), answer: t("footerPages.support.a19"), category: cat.deposit },
    { question: t("footerPages.support.q20"), answer: t("footerPages.support.a20"), category: cat.trading }
  ];

  const categories = [allCat, cat.account, cat.deposit, cat.trading, cat.security, cat.verification, cat.fees];

  const filteredFAQ = faqItems.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === allCat || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <HelpCircle size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("footerPages.support.title")}</h1>
            <p className="text-lg text-blue-100">
              {t("footerPages.support.subtitle")}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Поиск */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t("footerPages.support.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-[#131416] border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/footerPages/chat"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
            >
              <MessageCircle className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={28} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t("footerPages.support.chatTitle")}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{t("footerPages.support.chatSubtitle")}</p>
              </div>
            </Link>

            <a
              href="mailto:crypto.x.kilka@gmail.com"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-green-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 transition-all group"
            >
              <Mail className="text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" size={28} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t("footerPages.support.emailTitle")}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">crypto.x.kilka@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+77172000000"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-purple-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all group"
            >
              <Phone className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" size={28} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t("footerPages.support.phoneTitle")}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">+7 (7172) 00-00-00</p>
              </div>
            </a>
          </div>

          {/* Категории */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory(category);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-[#131416] text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

            {/* FAQ список */}
          <div className="max-w-5xl mx-auto space-y-3 mb-8">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-[#131416] rounded-lg border border-slate-300 dark:border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFAQ(openFAQ === index ? null : index);
                  }}
                  className="w-full flex items-start justify-between p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      {item.category}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {item.question}
                    </h3>
                  </div>
                  {openFAQ === index ? (
                    <ChevronUp className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={18} />
                  ) : (
                    <ChevronDown className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-3 pb-3 pt-0">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQ.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto mb-3 text-slate-400" size={48} />
              <p className="text-slate-600 dark:text-slate-400">
                {t("footerPages.support.notFound")}
              </p>
            </div>
          )}

          {/* Не нашли ответ */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 border border-blue-200 dark:border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {t("footerPages.support.ctaTitle")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t("footerPages.support.ctaSubtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/footerPages/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-base"
              >
                <MessageCircle size={22} />
                {t("footerPages.support.openChat")}
              </Link>
              <a
                href="mailto:crypto.x.kilka@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg font-semibold transition-colors text-base"
              >
                <Mail size={22} />
                {t("footerPages.support.writeEmail")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
