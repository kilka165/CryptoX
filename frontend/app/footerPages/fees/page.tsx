import { DollarSign, TrendingDown, Zap, Info } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FeesPage() {
  const withdrawalFees = [
    { crypto: "Bitcoin (BTC)", fee: "0.0005 BTC", minWithdrawal: "0.001 BTC", network: "Bitcoin" },
    { crypto: "Ethereum (ETH)", fee: "0.005 ETH", minWithdrawal: "0.01 ETH", network: "Ethereum" },
    { crypto: "USDT (TRC20)", fee: "1 USDT", minWithdrawal: "10 USDT", network: "Tron" },
    { crypto: "USDT (ERC20)", fee: "5 USDT", minWithdrawal: "10 USDT", network: "Ethereum" },
    { crypto: "USDT (BSC)", fee: "0.5 USDT", minWithdrawal: "10 USDT", network: "BSC" },
    { crypto: "BNB (BSC)", fee: "0.001 BNB", minWithdrawal: "0.01 BNB", network: "BSC" },
    { crypto: "Cardano (ADA)", fee: "1 ADA", minWithdrawal: "5 ADA", network: "Cardano" },
    { crypto: "Ripple (XRP)", fee: "0.25 XRP", minWithdrawal: "20 XRP", network: "Ripple" },
    { crypto: "Solana (SOL)", fee: "0.01 SOL", minWithdrawal: "0.1 SOL", network: "Solana" },
    { crypto: "Polygon (MATIC)", fee: "0.1 MATIC", minWithdrawal: "1 MATIC", network: "Polygon" }
  ];

  const fiatWithdrawalFees = [
    { method: "Банковская карта", fee: "2%", minAmount: "1,000 ₸", processing: "1-3 дня" },
    { method: "SWIFT перевод", fee: "$25", minAmount: "$100", processing: "3-5 дней" },
    { method: "SEPA перевод", fee: "€5", minAmount: "€50", processing: "1-2 дня" },
    { method: "Местный перевод (KZ)", fee: "Бесплатно", minAmount: "5,000 ₸", processing: "1 день" }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <DollarSign size={40} className="mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Комиссии и лимиты</h1>
            <p className="text-lg text-emerald-100">
              Пополнение и торговля — бесплатно
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-xl border border-green-200 dark:border-slate-700">
              <DollarSign className="text-green-600 dark:text-green-400 mb-2" size={28} />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                Бесплатное пополнение
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                0% на все депозиты
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-xl border border-blue-200 dark:border-slate-700">
              <TrendingDown className="text-blue-600 dark:text-blue-400 mb-2" size={28} />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                Без торговых комиссий
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                0% на все сделки
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-xl border border-purple-200 dark:border-slate-700">
              <Zap className="text-purple-600 dark:text-purple-400 mb-2" size={28} />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                Быстрые выводы
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                10-30 минут
              </p>
            </div>
          </div>

          {/* Комиссии за вывод криптовалюты */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Комиссии за вывод криптовалюты
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Криптовалюта
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Сеть
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Комиссия
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Минимум
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {withdrawalFees.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">
                          {item.crypto}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">
                          {item.network}
                        </td>
                        <td className="px-4 py-3 text-right text-orange-600 dark:text-orange-400 font-semibold">
                          {item.fee}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          {item.minWithdrawal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-slate-900 p-3 rounded-lg">
              <Info className="flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" size={14} />
              <p>
                Комиссии могут меняться в зависимости от загруженности сети. Переводы между пользователями CryptoX бесплатны.
              </p>
            </div>
          </section>

          {/* Комиссии за вывод фиата */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Комиссии за вывод фиатных средств
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Метод вывода
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Комиссия
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Минимум
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-900 dark:text-slate-100">
                        Обработка
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {fiatWithdrawalFees.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">
                          {item.method}
                        </td>
                        <td className="px-4 py-3 text-right text-orange-600 dark:text-orange-400 font-semibold">
                          {item.fee}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                          {item.minAmount}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 text-xs">
                          {item.processing}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Дополнительная информация */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-amber-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Важная информация
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                <span><strong>Пополнение бесплатно</strong> — 0% на депозиты криптой, картой или переводом</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                <span><strong>Торговля бесплатна</strong> — 0% на все спотовые сделки</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                <span>Внутренние переводы между пользователями CryptoX бесплатны</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                <span>Лимиты на вывод зависят от уровня верификации (до $500,000/день)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                <span>TRC20 дешевле ERC20 для USDT — выбирайте выгодную сеть</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
