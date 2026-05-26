"use client";

import { useState } from "react";
import { Shield, CheckCircle, Upload, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function VerifyPage() {
  const [step, setStep] = useState(1);

  const benefits = [
    "Увеличение лимитов на вывод до $500,000/день",
    "Доступ к P2P торговле",
    "Пониженные торговые комиссии",
    "Приоритетная поддержка 24/7"
  ];

  const verificationLevels = [
    {
      level: "Уровень 1",
      requirement: "Email верификация",
      withdrawalLimit: "$1,000/день"
    },
    {
      level: "Уровень 2",
      requirement: "Паспорт или ID карта",
      withdrawalLimit: "$50,000/день"
    },
    {
      level: "Уровень 3",
      requirement: "Полная верификация + селфи",
      withdrawalLimit: "$500,000/день"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <Shield size={48} className="mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Верификация аккаунта</h1>
            <p className="text-xl text-purple-100">
              Пройдите верификацию для получения полного доступа к платформе
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Преимущества */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Преимущества верификации
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-lg border border-blue-200 dark:border-slate-700"
                >
                  <CheckCircle className="flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" size={20} />
                  <p className="text-slate-700 dark:text-slate-300">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Уровни верификации */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Уровни верификации
            </h2>
            <div className="space-y-4">
              {verificationLevels.map((level, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {level.level}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {level.requirement}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-500 mb-1">Лимит вывода</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {level.withdrawalLimit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Процесс верификации */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Как пройти верификацию
            </h2>
            
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              {/* Шаг 1: Личные данные */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Шаг 1: Личные данные
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Имя и Фамилия
                    </label>
                    <input
                      type="text"
                      placeholder="Введите полное имя"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Дата рождения
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Страна
                    </label>
                    <select className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-slate-100">
                      <option>Выберите страну</option>
                      <option>Казахстан</option>
                      <option>Россия</option>
                      <option>США</option>
                      <option>Другая</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Шаг 2: Документы */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Шаг 2: Загрузите документ
                  </h3>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Загрузите фото документа
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Паспорт или ID карта • JPG, PNG • Максимум 10MB
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Требования:</strong> Документ должен быть четко виден, все данные читаемы, без бликов
                    </p>
                  </div>
                </div>
              )}

              {/* Шаг 3: Селфи */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Шаг 3: Селфи с документом
                  </h3>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                      Загрузите селфи с документом
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Держите документ рядом с лицом • JPG, PNG • Максимум 10MB
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Важно:</strong> Лицо и документ должны быть четко видны на одном фото
                    </p>
                  </div>
                </div>
              )}

              {/* Навигация */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Назад
                  </button>
                )}
                <button
                  onClick={() => step < 3 ? setStep(step + 1) : null}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {step === 3 ? "Отправить на проверку" : "Далее"}
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Индикатор шага */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-12 rounded-full transition-colors ${
                      s === step
                        ? "bg-purple-600"
                        : s < step
                        ? "bg-green-600"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-purple-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Часто задаваемые вопросы
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Сколько времени занимает верификация?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Обычно от 1 до 24 часов. В редких случаях до 3 рабочих дней.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Безопасно ли загружать документы?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Да, все данные шифруются и защищены. Мы не передаем данные третьим лицам.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Какие документы принимаются?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Паспорт (внутренний или заграничный) или национальное удостоверение личности (ID карта).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
