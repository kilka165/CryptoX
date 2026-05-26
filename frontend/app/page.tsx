import React from 'react';
import Link from 'next/link';
import { ArrowRightLeft, Wallet } from 'lucide-react';
import { Header } from '@/components/Header'; 
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Покупайте и продавайте <br />
            <span className="text-blue-600 dark:text-blue-500">Криптовалюту</span> мгновенно
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            Самая надежная платформа для трейдинга. Низкие комиссии, 
            высокая скорость и безопасность ваших активов.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/market" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20">
              Начать торговлю <ArrowRightLeft size={20} />
            </Link>
            <button className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
              Создать кошелек <Wallet size={20} />
            </button>
          </div>
        </div>

        {/* Карточки преимуществ */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            { title: 'Безопасность', desc: 'Холодное хранение и 2FA защита' },
            { title: 'Мгновенный обмен', desc: 'Исполнение ордеров за миллисекунды' },
            { title: 'Поддержка 24/7', desc: 'Всегда на связи, чтобы помочь вам' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-blue-500 transition-colors shadow-sm dark:shadow-none">
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
