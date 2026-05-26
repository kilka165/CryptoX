import { Cookie, Settings } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CookiesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-12 " >
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <Cookie size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Политика использования Cookies</h1>
            <p className="text-lg text-orange-100">
              Последнее обновление: 1 января 2026 года
            </p>
          </div>
        </div>
        

        <div className="container mx-auto px-4 py-10 bg-slate-50 dark:bg-slate-900" style={{ maxWidth: '900px' }}>
          {/* Введение */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Что такое cookies?
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Cookies — это небольшие текстовые файлы, которые сохраняются на вашем устройстве 
                (компьютере, смартфоне или планшете) при посещении веб-сайтов. Они помогают веб-сайтам 
                запоминать ваши действия и предпочтения, обеспечивая более удобное использование.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                CryptoX использует cookies для улучшения работы платформы, обеспечения безопасности и 
                предоставления персонализированного опыта.
              </p>
            </div>
          </section>

          {/* Типы cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Какие типы cookies мы используем
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-slate-900 rounded-lg p-5 border border-blue-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  1. Необходимые cookies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Эти cookies необходимы для работы сайта и не могут быть отключены.
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Аутентификация и управление сессией</li>
                  <li>• Безопасность и предотвращение мошенничества</li>
                  <li>• Запоминание настроек языка и региона</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-slate-900 rounded-lg p-5 border border-green-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  2. Функциональные cookies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Эти cookies позволяют улучшить функциональность и персонализацию.
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Запоминание выбранной темы (светлая/темная)</li>
                  <li>• Сохранение торговых предпочтений</li>
                  <li>• Настройки интерфейса и графиков</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-slate-900 rounded-lg p-5 border border-purple-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  3. Аналитические cookies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Эти cookies помогают понять, как пользователи взаимодействуют с платформой.
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Google Analytics — анализ трафика и поведения пользователей</li>
                  <li>• Метрики производительности сайта</li>
                  <li>• A/B тестирование новых функций</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-slate-900 rounded-lg p-5 border border-orange-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  4. Маркетинговые cookies
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Эти cookies используются для показа релевантной рекламы.
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Отслеживание эффективности рекламных кампаний</li>
                  <li>• Ретаргетинг и персонализированная реклама</li>
                  <li>• Партнерские программы</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Таблица cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Список используемых cookies
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Название
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Тип
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Срок хранения
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Назначение
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">session_id</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Необходимые</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Сессия</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Управление сеансом пользователя</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">auth_token</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Необходимые</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 дней</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Аутентификация пользователя</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">theme</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Функциональные</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 год</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Сохранение темы (светлая/темная)</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">language</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Функциональные</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 год</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Язык интерфейса</td>
                    </tr>
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">_ga</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Аналитические</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 года</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Google Analytics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Управление cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Как управлять cookies
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-4 mb-4">
                <Settings className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Настройки браузера
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Вы можете контролировать и удалять cookies через настройки браузера:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>• <strong>Google Chrome:</strong> Настройки → Конфиденциальность и безопасность → Файлы cookie</li>
                    <li>• <strong>Firefox:</strong> Настройки → Приватность и защита → Куки и данные сайтов</li>
                    <li>• <strong>Safari:</strong> Настройки → Конфиденциальность → Управление данными веб-сайтов</li>
                    <li>• <strong>Edge:</strong> Настройки → Файлы cookie и разрешения сайтов</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong>Внимание:</strong> Отключение необходимых cookies может нарушить работу платформы. 
                  Некоторые функции могут стать недоступны.
                </p>
              </div>
            </div>
          </section>

          {/* Сторонние cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Сторонние cookies
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Мы используем сторонние сервисы, которые могут устанавливать свои cookies:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>Google Analytics</strong> — для анализа трафика и поведения пользователей</li>
                <li>• <strong>Cloudflare</strong> — для безопасности и защиты от DDoS атак</li>
                <li>• <strong>Платежные процессоры</strong> — для обработки платежей</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                Мы не контролируем cookies третьих лиц. Рекомендуем ознакомиться с их политиками конфиденциальности.
              </p>
            </div>
          </section>

          {/* Обновления политики */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Обновления политики
            </h2>
            <div className="bg-blue-50 dark:bg-slate-900 rounded-lg p-5 border border-blue-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">
                Мы можем обновлять эту Политику cookies время от времени. Все изменения будут опубликованы 
                на этой странице. Рекомендуем периодически проверять эту страницу для получения актуальной информации.
              </p>
            </div>
          </section>

          {/* Контактная информация */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Вопросы?
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Если у вас есть вопросы о нашем использовании cookies, свяжитесь с нами:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><strong>Email:</strong> Crypto.x.kilka@gmail.com</li>
                <li><strong>Адрес:</strong> 010000, Республика Казахстан, г. Астана, пр. Абая 76, д. 1</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
