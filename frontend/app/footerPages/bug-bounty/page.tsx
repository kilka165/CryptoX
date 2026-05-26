import { Bug, DollarSign, Mail, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function BugBountyPage() {
  const rewards = [
    { severity: "Критическая", reward: "$5,000 - $10,000", color: "red" },
    { severity: "Высокая", reward: "$1,000 - $5,000", color: "orange" },
    { severity: "Средняя", reward: "$500 - $1,000", color: "yellow" },
    { severity: "Низкая", reward: "$100 - $500", color: "blue" }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <Bug className="mx-auto mb-4" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bug Bounty Program</h1>
            <p className="text-xl text-green-100">
              Нашли уязвимость? Получите вознаграждение до $10,000
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Что это такое */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Что такое Bug Bounty?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Bug Bounty — это программа вознаграждения за обнаружение уязвимостей в системе безопасности CryptoX. 
              Мы приглашаем исследователей безопасности помочь сделать нашу платформу безопаснее.
            </p>
          </section>

          {/* Вознаграждения */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Размер вознаграждений
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-400 mb-2`}>
                      {item.severity}
                    </span>
                    <div className="text-sm text-slate-500 dark:text-slate-500">уязвимость</div>
                  </div>
                  <div className="text-right">
                    <DollarSign className="inline-block text-green-600 dark:text-green-400 mb-1" size={20} />
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {item.reward}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Примеры уязвимостей */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Что мы ищем?
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span><strong>Критические:</strong> SQL инъекции, удаленное выполнение кода, доступ к средствам пользователей</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400 mt-1">•</span>
                  <span><strong>Высокие:</strong> XSS атаки, CSRF, обход аутентификации</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                  <span><strong>Средние:</strong> Утечка данных, обход верификации</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span><strong>Низкие:</strong> Информационная утечка, мелкие баги безопасности</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Правила */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Основные правила
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>✓ Не раскрывайте уязвимость публично до ее устранения</li>
                <li>✓ Не получайте доступ к данным других пользователей</li>
                <li>✓ Не проводите DDoS атаки</li>
                <li>✓ Удаляйте тестовые данные после исследования</li>
                <li>✓ Отправляйте отчеты только на crypto.x.kilka@gmail.com</li>
              </ul>
            </div>
          </section>

          {/* Как отправить отчет */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Как отправить отчет
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={28} />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Отправьте письмо на crypto.x.kilka@gmail.com с описанием:
                  </h3>
                  <ol className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>1. Что за уязвимость вы нашли</li>
                    <li>2. Как ее воспроизвести (пошагово)</li>
                    <li>3. Скриншоты или видео (если возможно)</li>
                    <li>4. Ваши контактные данные</li>
                  </ol>
                </div>
              </div>
              <a
                href="mailto:crypto.x.kilka@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Mail size={20} />
                Отправить отчет
              </a>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Частые вопросы
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Когда я получу вознаграждение?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  После проверки и устранения уязвимости (обычно 1-2 недели). Выплата производится в USDT или Bitcoin.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Могу ли я оставаться анонимным?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Да, мы уважаем вашу конфиденциальность. Можете использовать псевдоним.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Что если уязвимость уже известна?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Вознаграждение получает первый, кто сообщил о проблеме. Мы сообщим вам в течение 24 часов.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
