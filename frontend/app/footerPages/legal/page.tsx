import { Scale, FileText, Shield, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function LegalPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <Scale size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Правовая информация</h1>
            <p className="text-lg text-slate-300">
              Юридические документы и условия использования
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Основные документы */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Основные документы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/legal/terms"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <FileText className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Пользовательское соглашение
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Условия использования платформы CryptoX
                  </p>
                </div>
              </a>

              <a
                href="/legal/privacy"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <Shield className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Политика конфиденциальности
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Как мы собираем и защищаем ваши данные
                  </p>
                </div>
              </a>

              <a
                href="/legal/aml"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    AML/KYC политика
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Противодействие отмыванию денег
                  </p>
                </div>
              </a>

              <a
                href="/legal/risk"
                className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
              >
                <Scale className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={28} />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Предупреждение о рисках
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Риски торговли криптовалютой
                  </p>
                </div>
              </a>
            </div>
          </section>

          {/* Компания */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              О компании
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Юридическое название</h3>
                  <p>CryptoX</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Регистрационный номер</h3>
                  <p>88005353535</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Юридический адрес</h3>
                  <p>010000, Республика Казахстан, г. Астана, пр. Абая 76, д. 1</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Email для юридических вопросов</h3>
                  <p>Crypto.x.kilka@gmail.com</p>
                </div>
              </div>
            </div>
          </section>

          {/* Лицензии */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Лицензии и регулирование
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                CryptoX работает в соответствии с международными стандартами финансового регулирования:
              </p>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Лицензия на осуществление деятельности с виртуальными активами (№ VA-2024-001)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Соответствие требованиям FATF по противодействию отмыванию денег</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Регулярные аудиты безопасности от независимых компаний</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                  <span>Страхование активов пользователей на сумму $1 млрд</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Важная информация */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-amber-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Важная информация
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Торговля криптовалютами связана с высоким уровнем риска и может не подходить для всех инвесторов. 
              Прежде чем начать торговлю, убедитесь, что вы полностью понимаете связанные с этим риски.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              CryptoX не предоставляет инвестиционных советов. Все решения о торговле принимаются пользователями 
              самостоятельно на свой страх и риск.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
