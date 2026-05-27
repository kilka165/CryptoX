"use client";

import Link from "next/link";
import { BookOpen, TrendingUp, Shield, Wallet, ArrowRight, Clock, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function GuidesPage() {
  const { t } = useTranslation();

  const guides = [
    {
      id: 1,
      title: t("footerPages.guides.g1Title"),
      description: t("footerPages.guides.g1Desc"),
      category: t("footerPages.guides.catBeginner"),
      readTime: t("footerPages.guides.minutes", { n: 10 }),
      author: t("footerPages.guides.author"),
      icon: TrendingUp,
      color: "blue"
    },
    {
      id: 2,
      title: t("footerPages.guides.g2Title"),
      description: t("footerPages.guides.g2Desc"),
      category: t("footerPages.guides.catSecurity"),
      readTime: t("footerPages.guides.minutes", { n: 8 }),
      author: t("footerPages.guides.author"),
      icon: Shield,
      color: "green"
    },
    {
      id: 3,
      title: t("footerPages.guides.g3Title"),
      description: t("footerPages.guides.g3Desc"),
      category: t("footerPages.guides.catAdvanced"),
      readTime: t("footerPages.guides.minutes", { n: 15 }),
      author: t("footerPages.guides.author"),
      icon: TrendingUp,
      color: "purple"
    },
    {
      id: 4,
      title: t("footerPages.guides.g4Title"),
      description: t("footerPages.guides.g4Desc"),
      category: t("footerPages.guides.catBeginner"),
      readTime: t("footerPages.guides.minutes", { n: 7 }),
      author: t("footerPages.guides.author"),
      icon: Wallet,
      color: "yellow"
    },
    {
      id: 5,
      title: t("footerPages.guides.g5Title"),
      description: t("footerPages.guides.g5Desc"),
      category: t("footerPages.guides.catIntermediate"),
      readTime: t("footerPages.guides.minutes", { n: 12 }),
      author: t("footerPages.guides.author"),
      icon: TrendingUp,
      color: "red"
    },
    {
      id: 6,
      title: t("footerPages.guides.g6Title"),
      description: t("footerPages.guides.g6Desc"),
      category: t("footerPages.guides.catAdvanced"),
      readTime: t("footerPages.guides.minutes", { n: 13 }),
      author: t("footerPages.guides.author"),
      icon: Shield,
      color: "orange"
    }
  ];

  const categories = [
    t("footerPages.guides.catAll"),
    t("footerPages.guides.catBeginner"),
    t("footerPages.guides.catIntermediate"),
    t("footerPages.guides.catAdvanced"),
    t("footerPages.guides.catSecurity")
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Header />
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">{t("footerPages.guides.title")}</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            {t("footerPages.guides.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Категории */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2.5 rounded-lg bg-slate-100 dark:bg-[#131416] text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка гайдов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.id}
                href={`/guides/${guide.id}`}
                className="group bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  {/* Иконка и категория */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${guide.color}-100 dark:bg-${guide.color}-900/30`}>
                      <Icon className={`text-${guide.color}-600`} size={24} />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${guide.color}-100 dark:bg-${guide.color}-900/30 text-${guide.color}-700 dark:text-${guide.color}-400`}>
                      {guide.category}
                    </span>
                  </div>

                  {/* Заголовок */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {guide.title}
                  </h3>

                  {/* Описание */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {guide.description}
                  </p>

                  {/* Метаинформация */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{guide.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{guide.author}</span>
                      </div>
                    </div>
                    <ArrowRight className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-blue-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t("footerPages.guides.notFoundTitle")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t("footerPages.guides.notFoundText")}
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            {t("footer.contactUs")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
