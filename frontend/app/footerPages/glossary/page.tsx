"use client";

import { useState } from "react";
import { BookText, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const terms: GlossaryTerm[] = [
    {
      term: "Blockchain (Блокчейн)",
      definition: "Распределенная база данных, которая хранит информацию о транзакциях в виде последовательных блоков, связанных криптографически.",
      category: "Технология"
    },
    {
      term: "Bitcoin (Биткоин)",
      definition: "Первая и самая популярная криптовалюта, созданная в 2009 году псевдонимным Сатоши Накамото как децентрализованная цифровая валюта.",
      category: "Криптовалюты"
    },
    {
      term: "Altcoin (Альткоин)",
      definition: "Любая криптовалюта, которая не является Bitcoin. Примеры: Ethereum, Ripple, Litecoin.",
      category: "Криптовалюты"
    },
    {
      term: "Wallet (Кошелек)",
      definition: "Программное или аппаратное устройство для хранения приватных ключей и управления криптовалютными активами.",
      category: "Основы"
    },
    {
      term: "Private Key (Приватный ключ)",
      definition: "Секретный криптографический код, который дает доступ к вашим криптоактивам. Потеря приватного ключа означает потерю доступа к средствам.",
      category: "Безопасность"
    },
    {
      term: "Public Key (Публичный ключ)",
      definition: "Криптографический адрес, который можно безопасно делиться с другими для получения платежей.",
      category: "Безопасность"
    },
    {
      term: "Mining (Майнинг)",
      definition: "Процесс подтверждения транзакций и добавления новых блоков в блокчейн с использованием вычислительной мощности. Майнеры получают вознаграждение в криптовалюте.",
      category: "Технология"
    },
    {
      term: "Staking (Стейкинг)",
      definition: "Процесс блокировки криптовалюты для поддержки работы блокчейн-сети и получения вознаграждений.",
      category: "Торговля"
    },
    {
      term: "Smart Contract (Смарт-контракт)",
      definition: "Самовыполняющийся контракт, условия которого записаны в коде блокчейна и автоматически исполняются при выполнении условий.",
      category: "Технология"
    },
    {
      term: "DeFi",
      definition: "Децентрализованные финансы - финансовые услуги на основе блокчейна без традиционных посредников.",
      category: "Технология"
    },
    {
      term: "NFT",
      definition: "Невзаимозаменяемый токен - уникальный цифровой актив, представляющий право собственности на конкретный предмет или контент.",
      category: "Технология"
    },
    {
      term: "FOMO",
      definition: "Fear Of Missing Out - страх упустить выгоду, психологический эффект, заставляющий инвесторов покупать на пике цены.",
      category: "Торговля"
    },
    {
      term: "FUD",
      definition: "Fear, Uncertainty and Doubt - распространение негативной информации для манипулирования рынком.",
      category: "Торговля"
    },
    {
      term: "HODL",
      definition: "Стратегия долгосрочного хранения криптовалюты независимо от колебаний цены. Происходит от опечатки слова 'hold'.",
      category: "Торговля"
    },
    {
      term: "Exchange (Биржа)",
      definition: "Платформа для покупки, продажи и обмена криптовалют.",
      category: "Основы"
    },
    {
      term: "Market Cap (Капитализация)",
      definition: "Общая рыночная стоимость криптовалюты, вычисляемая как цена одной монеты умноженная на количество монет в обращении.",
      category: "Торговля"
    },
    {
      term: "Volatility (Волатильность)",
      definition: "Степень изменчивости цены актива. Криптовалюты известны высокой волатильностью.",
      category: "Торговля"
    },
    {
      term: "Cold Storage (Холодное хранение)",
      definition: "Хранение криптовалюты в офлайн-кошельке, не подключенном к интернету, для максимальной безопасности.",
      category: "Безопасность"
    },
    {
      term: "Hot Wallet (Горячий кошелек)",
      definition: "Криптокошелек, подключенный к интернету, удобный для частых транзакций, но менее безопасный.",
      category: "Безопасность"
    },
    {
      term: "Gas Fee (Комиссия газа)",
      definition: "Комиссия за выполнение транзакций в блокчейне Ethereum и других сетях.",
      category: "Основы"
    },
    {
      term: "Proof of Work (PoW)",
      definition: "Алгоритм консенсуса, требующий решения сложных математических задач для подтверждения транзакций.",
      category: "Технология"
    },
    {
      term: "Proof of Stake (PoS)",
      definition: "Алгоритм консенсуса, где валидаторы выбираются на основе количества удерживаемых монет.",
      category: "Технология"
    },
    {
      term: "Pump and Dump",
      definition: "Манипулятивная схема искусственного повышения цены актива с последующей массовой продажей.",
      category: "Торговля"
    },
    {
      term: "Whitepaper",
      definition: "Технический документ, описывающий концепцию, технологию и план развития криптопроекта.",
      category: "Основы"
    }
  ];

  const categories = ["Все", "Основы", "Технология", "Торговля", "Безопасность", "Криптовалюты"];

  const filteredTerms = terms.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || item.category === selectedCategory;
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookText size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">Криптовалютный глоссарий</h1>
          </div>
          <p className="text-xl text-purple-100">
            Полный справочник терминов и понятий мира криптовалют
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
              placeholder="Поиск термина..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
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
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white"
                }`}
              >
                {category}
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
                    className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {item.term}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 whitespace-nowrap">
                        {item.category}
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
              Термины не найдены. Попробуйте изменить параметры поиска.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
  
}
