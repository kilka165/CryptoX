"use client";

import { useState } from "react";
import { Search, HelpCircle, MessageCircle, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
        question: "Как создать аккаунт на CryptoX?",
        answer: "Для создания аккаунта нажмите кнопку 'Регистрация' в правом верхнем углу, заполните форму с вашим email и паролем, подтвердите email и пройдите базовую верификацию.",
        category: "Аккаунт"
    },
    {
        question: "Как пополнить баланс?",
        answer: "Перейдите в раздел 'Кошелек', выберите криптовалюту или фиатную валюту, нажмите 'Пополнить' и следуйте инструкциям. Мы поддерживаем банковские карты, банковские переводы и криптовалютные депозиты.",
        category: "Пополнение и вывод"
    },
    {
        question: "Какие комиссии взимает CryptoX?",
        answer: "Торговые комиссии начинаются от 0.1% за сделку. Комиссии за вывод зависят от выбранной криптовалюты и метода вывода. Подробнее на странице 'Комиссии'.",
        category: "Комиссии"
    },
    {
        question: "Как долго обрабатывается вывод средств?",
        answer: "Криптовалютные выводы обрабатываются в течение 10-30 минут. Фиатные выводы на банковскую карту занимают 1-3 рабочих дня.",
        category: "Пополнение и вывод"
    },
    {
        question: "Что такое двухфакторная аутентификация (2FA)?",
        answer: "2FA — это дополнительный уровень защиты вашего аккаунта. После ввода пароля потребуется код из приложения Google Authenticator или SMS. Настоятельно рекомендуем включить 2FA в настройках безопасности.",
        category: "Безопасность"
    },
    {
        question: "Как пройти верификацию?",
        answer: "Перейдите в 'Профиль' → 'Верификация', загрузите документ, удостоверяющий личность (паспорт или ID карта), и селфи с документом. Проверка обычно занимает 1-24 часа.",
        category: "Верификация"
    },
    {
        question: "Что делать, если я забыл пароль?",
        answer: "Нажмите 'Забыли пароль?' на странице входа, введите email, и мы отправим вам ссылку для сброса пароля.",
        category: "Аккаунт"
    },
    {
        question: "Поддерживает ли CryptoX P2P торговлю?",
        answer: "Да! Вы можете покупать и продавать криптовалюту напрямую с другими пользователями через наш P2P маркетплейс с защитой сделок эскроу.",
        category: "Торговля"
    },
    {
        question: "Как вывести криптовалюту?",
        answer: "Перейдите в 'Кошелек', выберите криптовалюту, нажмите 'Вывести', укажите адрес кошелька и сумму, подтвердите через 2FA. Проверьте сеть (ERC20, TRC20 и т.д.) перед отправкой.",
        category: "Пополнение и вывод"
    },
    {
        question: "Какие документы нужны для верификации?",
        answer: "Для верификации принимаются: паспорт (внутренний или заграничный), национальная ID карта. Документ должен быть действительным, все данные четко видны.",
        category: "Верификация"
    },
    {
        question: "Как включить 2FA?",
        answer: "Перейдите в 'Настройки' → 'Безопасность' → 'Двухфакторная аутентификация'. Скачайте Google Authenticator, отсканируйте QR-код и введите код подтверждения.",
        category: "Безопасность"
    },
    {
        question: "Что такое Maker и Taker комиссии?",
        answer: "Maker — комиссия за создание лимитного ордера (добавление ликвидности). Taker — комиссия за исполнение рыночного ордера (забор ликвидности). Maker комиссии обычно ниже.",
        category: "Комиссии"
    },
    {
        question: "Как торговать на споте?",
        answer: "Перейдите в раздел 'Торговля', выберите торговую пару (например BTC/USDT), укажите цену и количество, выберите тип ордера (лимитный или рыночный) и нажмите 'Купить' или 'Продать'.",
        category: "Торговля"
    },
    {
        question: "Какие лимиты на вывод без верификации?",
        answer: "Без верификации вывод невозможен. С базовой верификацией (Email + документы) — до $50,000/день. С полной верификацией — до $500,000/день.",
        category: "Верификация"
    },
    {
        question: "Как изменить email или номер телефона?",
        answer: "Перейдите в 'Настройки' → 'Безопасность', нажмите 'Изменить email/телефон', подтвердите через старый email/телефон и 2FA код, затем укажите новые данные.",
        category: "Аккаунт"
    },
    {
        question: "Есть ли минимальная сумма для торговли?",
        answer: "Минимальная сумма сделки зависит от торговой пары и обычно составляет от 10 USDT. Точные лимиты указаны на странице каждой торговой пары.",
        category: "Торговля"
    },
    {
        question: "Как защитить аккаунт от взлома?",
        answer: "Включите 2FA, используйте сложный уникальный пароль, добавьте whitelist адресов для вывода, включите email/SMS уведомления для всех операций, не переходите по подозрительным ссылкам.",
        category: "Безопасность"
    },
    {
        question: "Взимается ли комиссия за пополнение?",
        answer: "Нет, пополнение счета (криптовалютой, картой или банковским переводом) полностью бесплатно. Комиссии взимаются только при выводе средств и торговле.",
        category: "Комиссии"
    },
    {
        question: "Что делать если перевел на неправильный адрес?",
        answer: "К сожалению, криптовалютные транзакции необратимы. Если вы отправили средства на неправильный адрес, мы не сможем их вернуть. Всегда тщательно проверяйте адрес перед отправкой.",
        category: "Пополнение и вывод"
    },
    {
        question: "Как работает стейкинг на CryptoX?",
        answer: "Перейдите в 'Стейкинг', выберите криптовалюту и срок (гибкий или фиксированный), укажите сумму. Вознаграждения начисляются ежедневно. Гибкий стейкинг позволяет вывести средства в любой момент.",
        category: "Торговля"
    }
    ];


  const categories = ["Все", "Аккаунт", "Пополнение и вывод", "Торговля", "Безопасность", "Верификация", "Комиссии"];

  const filteredFAQ = faqItems.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <HelpCircle size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Центр помощи</h1>
            <p className="text-lg text-blue-100">
              Найдите ответы на часто задаваемые вопросы
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
                placeholder="Поиск по вопросам..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
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
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Чат поддержки</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Онлайн 24/7</p>
              </div>
            </Link>

            <a
              href="mailto:crypto.x.kilka@gmail.com"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-green-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 transition-all group"
            >
              <Mail className="text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" size={28} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Email поддержка</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">crypto.x.kilka@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+77172000000"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-purple-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all group"
            >
              <Phone className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" size={28} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Телефон</h3>
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
                      : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-blue-500 hover:text-white"
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
                className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
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
                Вопросы не найдены. Попробуйте изменить параметры поиска.
              </p>
            </div>
          )}

          {/* Не нашли ответ */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-8 border border-blue-200 dark:border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Не нашли ответ на свой вопрос?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Наша команда поддержки готова помочь вам 24/7
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/footerPages/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-base"
              >
                <MessageCircle size={22} />
                Открыть чат
              </Link>
              <a
                href="mailto:crypto.x.kilka@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg font-semibold transition-colors text-base"
              >
                <Mail size={22} />
                Написать email
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
