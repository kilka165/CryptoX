"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, User, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { guidesMeta, guidesContent, colorMap, type Locale } from "@/lib/guidesContent";

const LOCALES: Locale[] = ["ru", "en", "kk"];

export default function GuideArticlePage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = Number(params?.id);

  const meta = guidesMeta.find((m) => m.id === id);
  const content = guidesContent[id];

  if (!meta || !content) {
    notFound();
  }

  const lang = (i18n.language || "ru").split("-")[0];
  const locale: Locale = (LOCALES.includes(lang as Locale) ? lang : "ru") as Locale;
  const article = content[locale];

  const c = colorMap[meta.color];
  const Icon = meta.icon;

  const related = guidesMeta.filter((m) => m.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Назад к списку */}
        <Link
          href="/footerPages/guides"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t("footerPages.guides.backToGuides")}
        </Link>

        {/* Шапка статьи */}
        <div className="flex items-center justify-between mb-5">
          <div className={`p-3 rounded-lg ${c.box}`}>
            <Icon className={c.icon} size={26} />
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badge}`}>
            {t(meta.categoryKey)}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {t(meta.titleKey)}
        </h1>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500 pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock size={15} />
            <span>{t("footerPages.guides.minutes", { n: meta.minutes })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={15} />
            <span>{t("footerPages.guides.author")}</span>
          </div>
        </div>

        {/* Вступление */}
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-10">
          {article.intro}
        </p>

        {/* Разделы */}
        <div className="space-y-10">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {section.heading}
              </h2>
              {section.body.map((p, j) => (
                <p key={j} className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 mt-3">
                  {section.bullets.map((b, k) => (
                    <li key={k} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <span className={`mt-0.5 ${c.icon}`}>•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Ключевые выводы */}
        <div className={`mt-12 rounded-xl p-6 ${c.box}`}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t("footerPages.guides.takeawaysTitle")}
          </h2>
          <ul className="space-y-3">
            {article.takeaways.map((tk, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className={`flex-shrink-0 mt-0.5 ${c.icon}`} size={18} />
                <span>{tk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-6">
          <p className="text-slate-700 dark:text-slate-300 mb-4">{article.ctaText}</p>
          <Link
            href={article.ctaHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            {article.ctaButton}
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Дисклеймер */}
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 italic">
          {t("footerPages.guides.disclaimer")}
        </p>

        {/* Другие гайды */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            {t("footerPages.guides.relatedTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((g) => {
              const rc = colorMap[g.color];
              const RIcon = g.icon;
              return (
                <Link
                  key={g.id}
                  href={`/footerPages/guides/${g.id}`}
                  className="group bg-slate-50 dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 p-5"
                >
                  <div className={`inline-flex p-2.5 rounded-lg mb-3 ${rc.box}`}>
                    <RIcon className={rc.icon} size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t(g.titleKey)}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
