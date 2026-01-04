import { Users, Target, Award, TrendingUp, Globe, Shield, Zap, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  const stats = [
    { value: "2M+", label: "Пользователей", icon: Users },
    { value: "$50B+", label: "Торговый объем", icon: TrendingUp },
    { value: "150+", label: "Стран", icon: Globe },
    { value: "500+", label: "Криптовалют", icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: "Безопасность",
      description: "Защита средств пользователей — наш главный приоритет"
    },
    {
      icon: Zap,
      title: "Инновации",
      description: "Постоянное развитие и внедрение новых технологий"
    },
    {
      icon: Heart,
      title: "Прозрачность",
      description: "Честность и открытость во всех наших действиях"
    },
    {
      icon: Users,
      title: "Сообщество",
      description: "Мы строим платформу вместе с нашими пользователями"
    }
  ];

  const team = [
    {
      name: "Алексей Иванов",
      position: "CEO & Основатель",
      description: "15 лет опыта в финтех и блокчейн технологиях"
    },
    {
      name: "Мария Петрова",
      position: "CTO",
      description: "Эксперт по кибербезопасности и криптографии"
    },
    {
      name: "Дмитрий Сидоров",
      position: "CFO",
      description: "Опыт в традиционных финансах и аудите"
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero секция */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4 text-center" style={{ maxWidth: '900px' }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">О CryptoX</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Ведущая криптовалютная биржа, которая делает торговлю цифровыми активами 
              простой, безопасной и доступной для каждого
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10" style={{ maxWidth: '900px' }}>
          {/* Статистика */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-5 rounded-xl border border-blue-200 dark:border-slate-700 text-center"
                  >
                    <Icon className="mx-auto mb-2 text-blue-600 dark:text-blue-400" size={28} />
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Наша история */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Наша история
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                CryptoX была основана в 2020 году командой энтузиастов блокчейн-технологий 
                и опытных финансистов. Наша цель — создать надежную и удобную платформу для 
                торговли криптовалютами, доступную каждому.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                За четыре года мы выросли от небольшого стартапа до одной из ведущих бирж 
                в регионе. Сегодня нам доверяют более 2 миллионов пользователей по всему миру.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Мы продолжаем развиваться, добавляя новые функции и улучшая безопасность, 
                чтобы предоставить нашим пользователям лучший опыт торговли криптовалютами.
              </p>
            </div>
          </section>

          {/* Наша миссия */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Наша миссия
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <Target className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    Демократизация финансов
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Мы верим, что каждый человек заслуживает доступа к современным финансовым 
                    инструментам. Наша миссия — сделать торговлю криптовалютами простой, безопасной 
                    и доступной для всех, независимо от опыта и географического положения.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Наши ценности */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Наши ценности
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800"
                  >
                    <Icon className="text-blue-600 dark:text-blue-400 mb-3" size={28} />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Связаться с нами */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-purple-200 dark:border-slate-700 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Присоединяйтесь к CryptoX
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Станьте частью крупнейшего криптовалютного сообщества
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/register"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Начать торговлю
              </a>
              <a
                href="/footerPages/support"
                className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg font-semibold transition-colors"
              >
                Связаться с нами
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
