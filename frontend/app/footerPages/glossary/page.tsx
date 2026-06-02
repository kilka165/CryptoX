"use client";

import { useState } from "react";
import { BookText, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";

type CategoryKey = "all" | "basics" | "tech" | "trading" | "security" | "cryptos";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: CategoryKey;
}

export default function GlossaryPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");

  const categoryLabels: Record<CategoryKey, string> = {
    all: t("footerPages.glossary.catAll"),
    basics: t("footerPages.glossary.catBasics"),
    tech: t("footerPages.glossary.catTech"),
    trading: t("footerPages.glossary.catTrading"),
    security: t("footerPages.glossary.catSecurity"),
    cryptos: t("footerPages.glossary.catCryptos"),
  };

  const terms: GlossaryTerm[] = [
    { term: t("footerPages.glossary.t1Term"), definition: t("footerPages.glossary.t1Def"), category: "tech" },
    { term: t("footerPages.glossary.t2Term"), definition: t("footerPages.glossary.t2Def"), category: "cryptos" },
    { term: t("footerPages.glossary.t3Term"), definition: t("footerPages.glossary.t3Def"), category: "cryptos" },
    { term: t("footerPages.glossary.t4Term"), definition: t("footerPages.glossary.t4Def"), category: "basics" },
    { term: t("footerPages.glossary.t5Term"), definition: t("footerPages.glossary.t5Def"), category: "security" },
    { term: t("footerPages.glossary.t6Term"), definition: t("footerPages.glossary.t6Def"), category: "security" },
    { term: t("footerPages.glossary.t7Term"), definition: t("footerPages.glossary.t7Def"), category: "tech" },
    { term: t("footerPages.glossary.t8Term"), definition: t("footerPages.glossary.t8Def"), category: "trading" },
    { term: t("footerPages.glossary.t9Term"), definition: t("footerPages.glossary.t9Def"), category: "tech" },
    { term: t("footerPages.glossary.t10Term"), definition: t("footerPages.glossary.t10Def"), category: "tech" },
    { term: t("footerPages.glossary.t11Term"), definition: t("footerPages.glossary.t11Def"), category: "tech" },
    { term: t("footerPages.glossary.t12Term"), definition: t("footerPages.glossary.t12Def"), category: "trading" },
    { term: t("footerPages.glossary.t13Term"), definition: t("footerPages.glossary.t13Def"), category: "trading" },
    { term: t("footerPages.glossary.t14Term"), definition: t("footerPages.glossary.t14Def"), category: "trading" },
    { term: t("footerPages.glossary.t15Term"), definition: t("footerPages.glossary.t15Def"), category: "basics" },
    { term: t("footerPages.glossary.t16Term"), definition: t("footerPages.glossary.t16Def"), category: "trading" },
    { term: t("footerPages.glossary.t17Term"), definition: t("footerPages.glossary.t17Def"), category: "trading" },
    { term: t("footerPages.glossary.t18Term"), definition: t("footerPages.glossary.t18Def"), category: "security" },
    { term: t("footerPages.glossary.t19Term"), definition: t("footerPages.glossary.t19Def"), category: "security" },
    { term: t("footerPages.glossary.t20Term"), definition: t("footerPages.glossary.t20Def"), category: "basics" },
    { term: t("footerPages.glossary.t21Term"), definition: t("footerPages.glossary.t21Def"), category: "tech" },
    { term: t("footerPages.glossary.t22Term"), definition: t("footerPages.glossary.t22Def"), category: "tech" },
    { term: t("footerPages.glossary.t23Term"), definition: t("footerPages.glossary.t23Def"), category: "trading" },
    { term: t("footerPages.glossary.t24Term"), definition: t("footerPages.glossary.t24Def"), category: "basics" }
  ];

  const categories: CategoryKey[] = ["all", "basics", "tech", "trading", "security", "cryptos"];

  const filteredTerms = terms.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        <Header />
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookText size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">{t("footerPages.glossary.title")}</h1>
          </div>
          <p className="text-xl text-purple-100">
            {t("footerPages.glossary.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Поиск и фильтры */}
        <div className="mb-10 space-y-6">
          {/* Поиск */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t("footerPages.glossary.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-[#131416] border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Категории */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 dark:bg-[#131416] text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white"
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Список терминов */}
        <div className="space-y-8">
          {Object.keys(groupedTerms).sort().map((letter) => (
            <div key={letter}>
              <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4 pb-2 border-b-2 border-purple-600 dark:border-purple-400">
                {letter}
              </h2>
              <div className="space-y-4">
                {groupedTerms[letter].map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-[#131416] rounded-lg p-6 border border-slate-300 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {item.term}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 whitespace-nowrap">
                        {categoryLabels[item.category]}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t("footerPages.glossary.notFound")}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );

}
