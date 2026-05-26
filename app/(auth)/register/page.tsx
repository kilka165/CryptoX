"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

type Errors = Record<string, string>;

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Errors = {};
    const { name, email, password, confirmPassword } = formData;

    if (name.length < 3) {
      newErrors.name = "Имя должно быть не короче 3 символов";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Введите корректный Email адрес";
    }

    if (password.length < 8) {
      newErrors.password = "Пароль должен быть не менее 8 символов";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Нужна хотя бы одна заглавная буква (A-Z)";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Нужна хотя бы одна строчная буква (a-z)";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      newErrors.password = "Нужен хотя бы один спецсимвол (!@#$...)";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // сразу логиним пользователя
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }

      // без alert — прямой переход в профиль
      router.push("/profile");
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);

      if (error.response && error.response.data?.errors) {
        const serverErrors = error.response.data.errors;
        const newErrors: Errors = {};
        if (serverErrors.email) newErrors.email = serverErrors.email[0];
        if (serverErrors.password) newErrors.password = serverErrors.password[0];
        if (serverErrors.name) newErrors.name = serverErrors.name[0];
        setErrors(newErrors);
      } else {
        alert("Произошла ошибка сервера. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
          {/* Назад на главную */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={18} />
            На главную
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Создать аккаунт</h1>
              <p className="text-slate-400 text-sm">
                Начните торговать криптовалютой сегодня
              </p>
            </div>
          </div>

          {/* Если есть общие ошибки — можно добавить блок сюда */}

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Имя */}
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Имя пользователя</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ваш никнейм"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Email адрес</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Пароль */}
            <div className="space-y-1">
              <label className="text-sm text-slate-300">Пароль</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Минимум 8 символов"
                />
              </div>
              {errors.password ? (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Мин. 8 символов, A-Z, a-z, спецсимвол.
                </p>
              )}
            </div>

            {/* Подтверждение пароля */}
            <div className="space-y-1">
              <label className="text-sm text-slate-300">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Повторите пароль"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? "Создаём аккаунт..." : "Зарегистрироваться"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Уже есть аккаунт?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
