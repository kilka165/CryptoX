"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRightLeft, Wallet } from 'lucide-react';
import { useTranslation, Trans } from "react-i18next";
import { Header } from '@/components/Header';
import { Footer } from "@/components/Footer";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white transition-colors duration-300">
      
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            <Trans
              i18nKey="home.heroTitle"
              components={{
                br: <br />,
                hl: <span className="text-blue-600 dark:text-blue-500" />,
              }}
            />
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            {t("home.heroSubtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/market" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
              {t("home.startTrading")} <ArrowRightLeft size={20} />
            </Link>
            <button className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
              {t("home.createWallet")} <Wallet size={20} />
            </button>
          </div>
        </div>

        {/* Карточки преимуществ */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            { title: t('home.feature1Title'), desc: t('home.feature1Desc') },
            { title: t('home.feature2Title'), desc: t('home.feature2Desc') },
            { title: t('home.feature3Title'), desc: t('home.feature3Desc') },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#131416]/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-blue-500 transition-colors shadow-sm dark:shadow-none">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
