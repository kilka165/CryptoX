"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle, AlertCircle, Wallet, Info } from "lucide-react";
import axios from "axios";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { intlLocale } from "@/lib/utils/locale";
import { API_BASE } from "@/lib/config";
import { useFees } from "@/lib/fees";

export default function WithdrawPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { withdraw: withdrawRate } = useFees();

  const [balance, setBalance] = useState(0); // Текущий баланс пользователя
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false); // данные /user получены

  // Загружаем баланс при открытии страницы
  useEffect(() => {
    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return;
            const res = await axios.get(`${API_BASE}/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(res.data.wallet?.balance || 0);
            setTwoFactorEnabled(!!res.data.two_factor_enabled);
        } catch (e) {
            console.error("Error loading balance", e);
        } finally {
            setProfileLoaded(true);
        }
    };
    fetchBalance();
  }, []);

  // Подсказка о дневном лимите вывода в зависимости от уровня защиты.
  const limitInfo = twoFactorEnabled
    ? { text: t("withdraw.limitNone"), tone: "ok" as const }
    : { text: t("withdraw.limitVerified"), tone: "warn" as const };

  const withdrawAmount = parseFloat(amount) || 0;
  const commission = withdrawAmount * withdrawRate;
  const totalToDeduct = withdrawAmount + commission;

  // Функция "Вывести ВСЁ"
  const handleMaxClick = () => {
    // x + rate*x = balance => x = balance / (1 + rate)
    // Округляем вниз до 2 знаков, чтобы точно хватило
    const maxAmount = Math.floor((balance / (1 + withdrawRate)) * 100) / 100;
    if (maxAmount > 0) {
        setAmount(maxAmount.toString());
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(val);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");
      
      await axios.post(`${API_BASE}/wallet/withdraw`, {
        amount: withdrawAmount,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      
      setTimeout(() => {
        router.push("/profile");
      }, 3000);

    } catch (err: any) {
      console.error("Withdraw error", err);
      setError(err.response?.data?.message || t("withdraw.withdrawError"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center animate-bounce-in p-6">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("withdraw.successTitle")}</h2>
          <p className="text-slate-500 mt-2 text-lg">
            {t("withdraw.fundsSent", { amount: withdrawAmount })}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {t("withdraw.commissionWas", { amount: commission.toFixed(2) })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> {t("common.back")}
        </button>

        <div className="bg-white dark:bg-[#131416] rounded-3xl shadow-xl border border-slate-300 dark:border-slate-800 p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-red-600">
            <CreditCard />
            {t("withdraw.title")}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-8">
            
            {/* Сумма */}
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("withdraw.amountLabel")}
                 </label>
                 {/* Баланс пользователя */}
                 <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Wallet size={14} />
                    <span>{t("withdraw.available")}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                        ${balance.toLocaleString(intlLocale(i18n.language), { minimumFractionDigits: 2 })}
                    </span>
                 </div>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="10"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-8 pr-20 py-4 text-2xl font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="0.00"
                />
                
                {/* Кнопка MAX */}
                <button
                    type="button"
                    onClick={handleMaxClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                    MAX
                </button>
              </div>
            </div>

            {/* Инфо о комиссии */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t("withdraw.withdrawAmount")}</span>
                <span className="font-bold">${withdrawAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{t("withdraw.commission")}</span>
                <span className="font-bold text-red-500">-${commission.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-lg">
                <span>{t("withdraw.totalDeduct")}</span>
                <span className={`${totalToDeduct > balance ? "text-red-500" : ""}`}>
                    ${totalToDeduct.toFixed(2)}
                </span>
              </div>
              {totalToDeduct > balance && (
                  <div className="text-xs text-red-500 text-right mt-1 font-medium">
                      {t("common.insufficientFunds")}
                  </div>
              )}
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Номер карты */}
            <div>
              <label className="block text-xs uppercase font-bold text-slate-500 mb-1">
                {t("withdraw.recipientCard")}
              </label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Информация о дневном лимите вывода (только после загрузки /user) */}
            {profileLoaded && (
              <div
                className={`p-4 rounded-xl flex items-start gap-3 text-sm border ${
                  limitInfo.tone === "ok"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                    : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                }`}
              >
                {limitInfo.tone === "ok" ? (
                  <ShieldCheck size={18} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <Info size={18} className="mt-0.5 flex-shrink-0" />
                )}
                <span>{limitInfo.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || withdrawAmount < 10 || cardNumber.length < 19 || totalToDeduct > balance}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                t("withdraw.processing")
              ) : (
                <>
                  <ShieldCheck size={20} />
                  {t("withdraw.withdraw", { amount: withdrawAmount || "0" })}
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              {t("withdraw.minInfo")}
            </p>

          </form>
        </div>
      </main>
    <Footer />
    </div>
  );
}
