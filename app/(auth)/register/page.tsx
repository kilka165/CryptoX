"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function RegisterPage() {

  const router = useRouter();
  // Храним данные формы
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Храним ошибки
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Функция для обновления полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при вводе, чтобы не раздражать пользователя
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Функция проверки (Валидация)
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // 1. Проверка имени
    if (formData.name.length < 3) {
      newErrors.name = "Имя должно быть не короче 3 символов";
    }

    // 2. Проверка Email (RegEx)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Введите корректный Email адрес";
    }

    // 3. Проверка сложности пароля
    const password = formData.password;
    if (password.length < 8) {
      newErrors.password = "Пароль должен быть не менее 8 символов";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Нужна хотя бы одна заглавная буква (A-Z)";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Нужна хотя бы одна строчная буква (a-z)";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Нужен хотя бы один спецсимвол (!@#$...)";
    }

    // 4. Проверка совпадения паролей
    if (password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    // Если ошибок нет, возвращаем true
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Если валидация не прошла - останавливаемся
    if (!validate()) return;

    try {
      // 1. Отправляем запрос на сервер
      const response = await api.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        // confirmPassword на сервер слать не обязательно, мы его проверили тут
      });

      // 2. Если успех
      console.log("Регистрация успешна:", response.data);
      
      // Сохраняем токен (чтобы пользователь сразу был залогинен)
      localStorage.setItem('token', response.data.token);
      
      // Показываем сообщение и перекидываем в профиль
      alert("Аккаунт создан! Перенаправляем...");
      router.push('/profile');

    } catch (error: any) {
      // 3. Если ошибка (например, email занят)
      console.error("Ошибка регистрации:", error);
      
      if (error.response && error.response.data.errors) {
        // Сервер вернул ошибки валидации (Laravel style)
        const serverErrors = error.response.data.errors;
        
        // Превращаем массив ошибок в наш формат
        const newErrors: Record<string, string> = {};
        if (serverErrors.email) newErrors.email = serverErrors.email[0];
        if (serverErrors.password) newErrors.password = serverErrors.password[0];
        if (serverErrors.name) newErrors.name = serverErrors.name[0];
        
        setErrors(newErrors);
      } else {
        alert("Произошла ошибка сервера. Попробуйте позже.");
      }
    }
  };


  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all relative">
      
      {/* Кнопка "Назад на главную" */}
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
          Создать аккаунт
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Начните торговать криптовалютой сегодня
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Имя */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Имя пользователя
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.name 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
              }`}
              placeholder="CryptoKing"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email адрес
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
              }`}
              placeholder="name@example.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
        </div>

        {/* Пароль */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Пароль
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.password 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.password}</p>}
          
          {!errors.password && (
            <p className="text-xs text-slate-400 mt-1">
              Мин. 8 символов, A-Z, a-z, спецсимвол.
            </p>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Подтвердите пароль
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckCircle className="h-5 w-5 text-slate-400" />
            </div>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-500/30 mt-4"
        >
          <UserPlus size={20} />
          Зарегистрироваться
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Войти
          </Link>
        </p>
      </div>
      
    </div>
    
  );
}
