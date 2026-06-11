"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { guidesMeta, colorMap } from "@/lib/guidesContent";

export default function GuidesPage() {
  const { t } = useTranslation();

  const guides = guidesMeta.map((meta) => ({
    id: meta.id,
    title: t(meta.titleKey),
    description: t(meta.descKey),
    category: t(meta.categoryKey),
    readTime: t("footerPages.guides.minutes", { n: meta.minutes }),
    author: t("footerPages.guides.author"),
    icon: meta.icon,
    color: meta.color,
  }));

  const allCat = t("footerPages.guides.catAll");
  const [selectedCategory, setSelectedCategory] = useState(allCat);

  const categories = [
    allCat,
    t("footerPages.guides.catBeginner"),
    t("footerPages.guides.catIntermediate"),
    t("footerPages.guides.catAdvanced"),
    t("footerPages.guides.catSecurity")
  ];

  const filteredGuides = selectedCategory === allCat
    ? guides
    : guides.filter((guide) => guide.category === selectedCategory);

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
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-[#131416] text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Сетка гайдов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => {
            const Icon = guide.icon;
            const c = colorMap[guide.color];
            return (
              <Link
                key={guide.id}
                href={`/footerPages/guides/${guide.id}`}
                className="group bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  {/* Иконка и категория */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${c.box}`}>
                      <Icon className={c.icon} size={24} />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badge}`}>
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
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-300 dark:border-slate-800">
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
            href="/footerPages/support"
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
