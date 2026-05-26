import { Shield, Lock, Eye, Database } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <Shield size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Политика конфиденциальности</h1>
            <p className="text-lg text-blue-100">
              Последнее обновление: 1 января 2026 года
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Введение */}
          <section className="mb-8">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              CryptoX Limited («мы», «нас», «наш») серьезно относится к защите вашей конфиденциальности. 
              Настоящая Политика конфиденциальности описывает, как мы собираем, используем, храним и 
              защищаем вашу персональную информацию.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Используя нашу платформу, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
            </p>
          </section>

          {/* Секция 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              1. Какую информацию мы собираем
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Database size={20} className="text-blue-600 dark:text-blue-400" />
                  Персональные данные
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Имя, фамилия, дата рождения</li>
                  <li>• Адрес электронной почты и номер телефона</li>
                  <li>• Адрес проживания</li>
                  <li>• Документы, удостоверяющие личность (паспорт, ID карта)</li>
                  <li>• Фотография (селфи с документом)</li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Eye size={20} className="text-blue-600 dark:text-blue-400" />
                  Данные об использовании
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• IP-адрес и данные об устройстве</li>
                  <li>• Информация о браузере и операционной системе</li>
                  <li>• История торговых операций</li>
                  <li>• Логи входов и действий на платформе</li>
                  <li>• Cookies и аналогичные технологии</li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Lock size={20} className="text-blue-600 dark:text-blue-400" />
                  Финансовая информация
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Банковские реквизиты</li>
                  <li>• Криптовалютные адреса</li>
                  <li>• История транзакций</li>
                  <li>• Источник средств</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Секция 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              2. Как мы используем вашу информацию
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>Верификация личности</strong> — для соблюдения требований KYC/AML</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>Обработка транзакций</strong> — для выполнения ваших торговых операций</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>Безопасность</strong> — для предотвращения мошенничества и взломов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>Коммуникация</strong> — для отправки уведомлений и поддержки клиентов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>Улучшение сервиса</strong> — для анализа и оптимизации платформы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>Соблюдение законодательства</strong> — для выполнения юридических обязательств</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Секция 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              3. Как мы защищаем вашу информацию
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Мы применяем современные меры безопасности для защиты ваших данных:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-slate-900 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Шифрование</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    SSL/TLS шифрование для всех передаваемых данных
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-slate-900 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Двухфакторная аутентификация</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Дополнительный уровень защиты аккаунта
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-slate-900 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Холодное хранение</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    95% средств в офлайн кошельках
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-slate-900 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Мониторинг 24/7</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Постоянный контроль безопасности
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Секция 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              4. Передача данных третьим лицам
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Мы можем передавать вашу информацию следующим третьим лицам:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>Регуляторам и правоохранительным органам</strong> — при наличии юридических требований</li>
                <li>• <strong>Партнерам по обработке платежей</strong> — для проведения финансовых операций</li>
                <li>• <strong>Сервисам верификации</strong> — для проверки личности (KYC)</li>
                <li>• <strong>Аналитическим сервисам</strong> — для улучшения платформы (анонимизированные данные)</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                Мы <strong>не продаем</strong> ваши персональные данные третьим лицам в маркетинговых целях.
              </p>
            </div>
          </section>

          {/* Секция 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              5. Ваши права
            </h2>
            <div className="bg-blue-50 dark:bg-slate-900 rounded-lg p-5 border border-blue-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                В соответствии с законодательством о защите данных, вы имеете право:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>Доступ</strong> — запросить копию ваших персональных данных</li>
                <li>• <strong>Исправление</strong> — обновить неточную или неполную информацию</li>
                <li>• <strong>Удаление</strong> — запросить удаление ваших данных (при соблюдении условий)</li>
                <li>• <strong>Ограничение обработки</strong> — ограничить использование ваших данных</li>
                <li>• <strong>Переносимость</strong> — получить данные в структурированном формате</li>
                <li>• <strong>Возражение</strong> — возразить против обработки данных</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                Для реализации своих прав обращайтесь по адресу: <strong>privacy@cryptox.com</strong>
              </p>
            </div>
          </section>

          {/* Секция 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              6. Хранение данных
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400">
                Мы храним ваши персональные данные столько, сколько необходимо для выполнения целей, 
                указанных в настоящей Политике, или в соответствии с требованиями законодательства. 
                После закрытия аккаунта некоторые данные могут храниться до 7 лет для соблюдения 
                юридических обязательств.
              </p>
            </div>
          </section>

          {/* Секция 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              7. Cookies и аналогичные технологии
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Мы используем cookies для улучшения работы платформы. Подробнее читайте в нашей{' '}
                <a href="/footerPages/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Политике использования cookies
                </a>.
              </p>
            </div>
          </section>

          {/* Контактная информация */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              8. Контактная информация
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                По вопросам конфиденциальности обращайтесь:
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
