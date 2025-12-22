"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogIn, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();

  // Состояние данных формы
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Состояние загрузки и ошибок
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Обработчик ввода
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Отправляем запрос на бэкенд
      const response = await axios.post("http://localhost:8000/api/login", formData);

      // 2. Сохраняем токен
      localStorage.setItem("auth_token", response.data.token);

      // 3. Редирект в профиль
      router.push("/profile");
      
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 401) {
        setError("Неверный email или пароль");
      } else {
        setError("Ошибка сервера. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Обертка для центрирования на весь экран
    <div className="full-width">
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all relative">
        
        {/* 👇 Кнопка назад */}
        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
            title="На главную"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            С возвращением!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Войдите, чтобы управлять активами
          </p>
        </div>

        {/* 👇 Блок отображения ошибки */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email адрес
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Пароль */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Пароль
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Забыли пароль?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              "Вход..."
            ) : (
              <>
                <LogIn size={20} />
                Войти
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Нет аккаунта?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
        
      </div>  
      
    </div>
    <Footer />
    </div>
    
  );

}
