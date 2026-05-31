"use client";

import api from "@/lib/axios";
import { setAuthToken } from "@/lib/auth";
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
import { useTranslation } from "react-i18next";

type Errors = Record<string, string>;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();

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
      newErrors.name = t("auth.register.errNameShort");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = t("auth.register.errEmail");
    }

    if (password.length < 8) {
      newErrors.password = t("auth.register.errPassShort");
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = t("auth.register.errPassUpper");
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = t("auth.register.errPassLower");
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      newErrors.password = t("auth.register.errPassSpecial");
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = t("auth.register.errPassMismatch");
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
        setAuthToken(response.data.token);
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
        alert(t("auth.register.serverError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl transition-colors">
          {/* Назад на главную */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={18} />
            {t("auth.backToHome")}
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("auth.register.title")}</h1>
              <p className="text-slate-400 text-sm">
                {t("auth.register.subtitle")}
              </p>
            </div>
          </div>

          {/* Если есть общие ошибки — можно добавить блок сюда */}

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Имя */}
            <div className="space-y-1">
              <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.register.nameLabel")}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={t("auth.register.namePlaceholder")}
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
              <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.emailLabel")}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={t("common.emailPlaceholder")}
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
              <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.passwordLabel")}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={t("auth.register.passwordPlaceholder")}
                />
              </div>
              {errors.password ? (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  {t("auth.register.passwordHint")}
                </p>
              )}
            </div>

            {/* Подтверждение пароля */}
            <div className="space-y-1">
              <label className="text-sm text-slate-700 dark:text-slate-300">
                {t("auth.register.confirmLabel")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder={t("auth.register.confirmPlaceholder")}
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
              {isLoading ? t("auth.register.submitting") : t("auth.register.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {t("auth.register.haveAccount")}{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {t("auth.register.loginLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
