"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Header } from "@/components/Header";
import { Save, User, Globe, ArrowLeft, CheckCircle, Search, ChevronDown, X } from "lucide-react";
import { currencies } from "@/lib/currencies"; // Импортируем наш список
import { Footer } from "@/components/Footer";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  
  // Состояния для модального окна выбора валюты
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios.get("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setName(res.data.name);
      setCurrency(res.data.currency || "USD");
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      router.push("/login");
    });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem("auth_token");
      await axios.put("http://localhost:8000/api/user/settings", {
        name,
        currency
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  // Фильтрация валют
  const filteredCurrencies = currencies.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCurrencyInfo = currencies.find(c => c.code === currency) || { code: currency, name: "Unknown", symbol: "" };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6">
          <ArrowLeft size={20} /> Назад
        </button>

        <h1 className="text-3xl font-bold mb-8">Настройки профиля</h1>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Имя */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User size={16} /> Имя отображения
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Выбор валюты (Кастомный) */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Globe size={16} /> Валюта отображения
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Все цены будут конвертироваться в эту валюту.
              </p>
              
              {/* Кнопка открытия модалки */}
              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                     {selectedCurrencyInfo.symbol || "$"}
                   </div>
                   <div className="text-left">
                     <div className="font-bold text-sm">{selectedCurrencyInfo.code}</div>
                     <div className="text-xs text-slate-500">{selectedCurrencyInfo.name}</div>
                   </div>
                </div>
                <ChevronDown size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : <><Save size={20} /> Сохранить изменения</>}
              </button>
              {success && (
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle size={20} /> Сохранено!
                </span>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО ВЫБОРА ВАЛЮТЫ */}
      {isCurrencyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]">
            
            {/* Заголовок и поиск */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Выберите валюту</h3>
                <button onClick={() => setIsCurrencyModalOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Поиск (RUB, Евро...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Список валют */}
            <div className="overflow-y-auto p-2">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map(c => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setIsCurrencyModalOpen(false);
                      setSearchQuery(""); // Сброс поиска
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      currency === c.code 
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                        {c.symbol}
                      </div>
                      <div className="text-left">
                         <div className="font-bold text-sm">{c.code}</div>
                         <div className="text-xs text-slate-500">{c.name}</div>
                      </div>
                    </div>
                    {currency === c.code && <CheckCircle size={18} className="text-blue-600" />}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  Ничего не найдено
                </div>
              )}
            </div>

          </div>
        </div>
      )}
      <Footer />
    </div>
    
  );
}
