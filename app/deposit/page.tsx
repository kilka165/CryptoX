"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import axios from "axios";
import { Footer } from "@/components/Footer";

export default function DepositPage() {
  const router = useRouter();
  
  // Состояние формы
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Форматирование номера карты (1234 5678 ...)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    val = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(val);
  };

  // Умная валидация даты (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    
    if (val.length > 4) val = val.substring(0, 4);
    // Корректируем месяц
    if (val.length >= 2) {
      const month = parseInt(val.substring(0, 2));
      if (month > 12) {
        val = "12" + val.substring(2);
      } 
      else if (month === 0) {
         val = "01" + val.substring(2);
      }
    }

    if (val.length >= 3) {
      val = val.substring(0, 2) + "/" + val.substring(2);
    }
    
    setExpiry(val);
  };
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const depositAmount = parseFloat(amount);

      if (isNaN(depositAmount) || depositAmount <= 0) {
          alert("Пожалуйста, введите корректную сумму");
          setLoading(false);
          return;
      }
      
      // Отправляем запрос на сервер с полем currency
      await axios.post("http://localhost:8000/api/wallet/deposit", {
        amount: depositAmount,
        currency: "USD" // <-- ДОБАВЛЕНО ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      
      setTimeout(() => {
        router.push("/profile"); // Или куда вы хотите перенаправить после успеха
      }, 2000);

    } catch (error: any) {
      console.error("Ошибка пополнения", error);
      // Выводим сообщение от сервера, если оно есть
      const message = error.response?.data?.message || "Ошибка при пополнении баланса";
      alert(message);
    } finally {
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Успешно!</h2>
          <p className="text-slate-500 mt-2">Баланс пополнен на ${amount}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Назад
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            Пополнение баланса
          </h1>

          <form onSubmit={handleDeposit} className="space-y-8">
            
            {/* Сумма пополнения */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Сумма пополнения (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="10"
                  max="1000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-8 pr-4 py-4 text-2xl font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Визуализация карты */}
            <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden">
               {/* Декор фона */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
               
               <div className="relative z-10 flex flex-col justify-between h-full">
                 <div className="flex justify-between items-start">
                   <div className="w-12 h-8 bg-yellow-500/80 rounded-md flex items-center justify-center">
                      <div className="w-8 h-5 border border-black/20 rounded-sm"></div>
                   </div>
                   <span className="font-mono text-lg italic font-bold opacity-80">BANK</span>
                 </div>

                 <div className="font-mono text-2xl tracking-widest my-4">
                   {cardNumber || "•••• •••• •••• ••••"}
                 </div>

                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                     <p className="font-medium tracking-wide uppercase">CRYPTO USER</p>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase opacity-60">Expires</p>
                     <p className="font-medium tracking-wide">{expiry || "MM/YY"}</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Поля ввода карты */}
            <div className="grid gap-6">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Номер карты</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Срок действия</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-500 mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                "Обработка..."
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Оплатить ${amount || "0"}
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-400">
              Это тестовый платеж. Деньги списываться не будут.
            </p>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
