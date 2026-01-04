import Link from "next/link";
import { BookOpen, TrendingUp, Shield, Wallet, ArrowRight, Clock, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function GuidesPage() {
  const guides = [
    {
      id: 1,
      title: "Как начать торговать криптовалютой",
      description: "Пошаговое руководство для новичков по первым шагам в криптотрейдинге",
      category: "Для начинающих",
      readTime: "10 мин",
      author: "Команда CryptoX",
      icon: TrendingUp,
      color: "blue"
    },
    {
      id: 2,
      title: "Как обезопасить свой криптокошелек",
      description: "Полное руководство по безопасности криптовалютных активов",
      category: "Безопасность",
      readTime: "8 мин",
      author: "Команда CryptoX",
      icon: Shield,
      color: "green"
    },
    {
      id: 3,
      title: "Понимание технического анализа",
      description: "Изучите основные паттерны графиков и индикаторы для трейдинга",
      category: "Продвинутый",
      readTime: "15 мин",
      author: "Команда CryptoX",
      icon: TrendingUp,
      color: "purple"
    },
    {
      id: 4,
      title: "Что такое стейкинг криптовалюты",
      description: "Руководство по заработку пассивного дохода через стейкинг",
      category: "Для начинающих",
      readTime: "7 мин",
      author: "Команда CryptoX",
      icon: Wallet,
      color: "yellow"
    },
    {
      id: 5,
      title: "P2P торговля: полное руководство",
      description: "Как безопасно покупать и продавать криптовалюту напрямую",
      category: "Средний",
      readTime: "12 мин",
      author: "Команда CryptoX",
      icon: TrendingUp,
      color: "red"
    },
    {
      id: 6,
      title: "Управление рисками в крипто",
      description: "Стратегии защиты вашего капитала на волатильном рынке",
      category: "Продвинутый",
      readTime: "13 мин",
      author: "Команда CryptoX",
      icon: Shield,
      color: "orange"
    }
  ];

  const categories = ["Все", "Для начинающих", "Средний", "Продвинутый", "Безопасность"];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">Гайды по криптовалютам</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            Изучите основы торговли, безопасности и стратегии с нашими подробными руководствами
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
                className="px-6 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 font-medium"
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
                className="group bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg overflow-hidden"
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
            Не нашли нужный гайд?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Напишите нам, и мы создадим руководство специально для вас!
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Связаться с нами
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
