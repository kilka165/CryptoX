import { FileText, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <FileText size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Условия использования</h1>
            <p className="text-lg text-slate-300">
              Последнее обновление: 1 января 2026 года
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Важное уведомление */}
          <div className="bg-amber-50 dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-900 rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Пожалуйста, внимательно прочитайте эти условия
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Используя платформу CryptoX, вы соглашаетесь с этими условиями использования. 
                  Если вы не согласны с какими-либо положениями, пожалуйста, не используйте наши услуги.
                </p>
              </div>
            </div>
          </div>

          {/* Секция 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              1. Общие положения
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует использование 
                платформы CryptoX и всех связанных с ней услуг.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                CryptoX Limited (далее — «Компания», «мы», «нас») предоставляет онлайн-платформу для 
                торговли криптовалютами и цифровыми активами.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Соглашение вступает в силу с момента регистрации на платформе или начала использования 
                любых наших услуг.
              </p>
            </div>
          </section>

          {/* Секция 2 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              2. Регистрация и аккаунт
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Для использования платформы вам должно быть не менее 18 лет</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Вы обязаны предоставить точную и актуальную информацию при регистрации</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Вы несете ответственность за сохранность своего пароля и данных для входа</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Запрещено создавать более одного аккаунта на одного пользователя</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Мы оставляем за собой право отказать в регистрации без объяснения причин</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Секция 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              3. Верификация (KYC/AML)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                В соответствии с международными требованиями по противодействию отмыванию денег (AML) 
                и финансированию терроризма (CFT), мы обязаны проводить верификацию личности пользователей.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Для прохождения верификации вам необходимо предоставить:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 ml-6">
                <li>• Документ, удостоверяющий личность (паспорт или ID карта)</li>
                <li>• Подтверждение адреса проживания (не старше 3 месяцев)</li>
                <li>• Селфи с документом</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-3">
                Без прохождения верификации функционал платформы будет ограничен.
              </p>
            </div>
          </section>

          {/* Секция 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              4. Торговля и комиссии
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Торговля на платформе осуществляется на условиях, указанных на сайте:
              </p>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Пополнение счета — бесплатно</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Торговые операции — 0% комиссии</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Вывод средств — комиссии согласно тарифам на странице "Комиссии"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>Мы оставляем за собой право изменять комиссии с предварительным уведомлением</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Секция 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              5. Запрещенная деятельность
            </h2>
            <div className="bg-red-50 dark:bg-slate-900 border border-red-200 dark:border-red-900 rounded-lg p-5">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                При использовании платформы строго запрещено:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  <span>Отмывание денег и финансирование терроризма</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  <span>Мошенничество и использование чужих документов</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  <span>Манипулирование рынком и инсайдерская торговля</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  <span>Использование ботов и автоматизированных систем без разрешения</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  <span>Нарушение законодательства любой юрисдикции</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Секция 6 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              6. Риски и ограничение ответственности
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Торговля криптовалютами связана с высокими рисками, включая:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 ml-6 mb-3">
                <li>• Полную потерю инвестированных средств</li>
                <li>• Высокую волатильность цен</li>
                <li>• Технические сбои и недоступность платформы</li>
                <li>• Регуляторные изменения</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400">
                Компания не несет ответственности за ваши торговые решения и их результаты. 
                Мы не предоставляем инвестиционных советов.
              </p>
            </div>
          </section>

          {/* Секция 7 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              7. Изменение условий
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400">
                Мы оставляем за собой право изменять настоящее Соглашение в любое время. 
                Все изменения вступают в силу с момента публикации на сайте. Продолжая использовать 
                платформу после внесения изменений, вы соглашаетесь с новыми условиями.
              </p>
            </div>
          </section>

          {/* Контактная информация */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              8. Контактная информация
            </h2>
            <div className="bg-blue-50 dark:bg-slate-900 rounded-lg p-5 border border-blue-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                По вопросам, связанным с условиями использования, обращайтесь:
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
