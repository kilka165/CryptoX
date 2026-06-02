"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE } from "@/lib/config";
import { KeyRound, Mail, Lock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type Errors = Record<string, string>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // Шаг 1 — ввод e-mail, шаг 2 — код + новый пароль.
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = () => {
    const newErrors: Errors = {};
    if (password.length < 8) newErrors.password = t("auth.register.errPassShort");
    else if (!/[A-Z]/.test(password)) newErrors.password = t("auth.register.errPassUpper");
    else if (!/[a-z]/.test(password)) newErrors.password = t("auth.register.errPassLower");
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = t("auth.register.errPassSpecial");

    if (password !== confirmPassword) newErrors.confirmPassword = t("auth.register.errPassMismatch");
    if (!code.trim()) newErrors.code = t("auth.forgot.invalidCode");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setInfo("");
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE}/password/forgot`, { email });
      setInfo(t("auth.forgot.codeSent"));
      setStep(2);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setErrors({ email: t("auth.forgot.serverError") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfo("");
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/password/reset`, { email, code, password });
      router.push("/login");
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.response?.status === 422) {
        const serverErrors = err.response.data?.errors;
        if (serverErrors?.code) setErrors({ code: t("auth.forgot.invalidCode") });
        else if (serverErrors?.password) setErrors({ password: serverErrors.password[0] });
        else setErrors({ code: t("auth.forgot.invalidCode") });
      } else {
        setErrors({ code: t("auth.forgot.serverError") });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-2xl p-8 shadow-xl transition-colors">
          <button
            type="button"
            onClick={() => (step === 2 ? setStep(1) : router.push("/login"))}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={18} />
            {t("auth.forgot.backToLogin")}
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("auth.forgot.title")}</h1>
              <p className="text-slate-400 text-sm">{t("auth.forgot.subtitle")}</p>
            </div>
          </div>

          {info && (
            <div className="mt-4 mb-4 flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/40 px-3 py-2 text-sm text-green-300">
              <CheckCircle className="w-4 h-4 mt-0.5" />
              <span>{info}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-5 mt-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.forgot.emailLabel")}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? t("auth.forgot.sending") : t("auth.forgot.sendCode")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5 mt-4">
              {/* Код */}
              <div className="space-y-1">
                <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.forgot.codeLabel")}</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm tracking-widest outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder={t("auth.forgot.codePlaceholder")}
                  />
                </div>
                {errors.code && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.code}
                  </p>
                )}
              </div>

              {/* Новый пароль */}
              <div className="space-y-1">
                <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.forgot.newPasswordLabel")}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <p className="text-xs text-slate-500 mt-1">{t("auth.register.passwordHint")}</p>
                )}
              </div>

              {/* Подтверждение */}
              <div className="space-y-1">
                <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.forgot.confirmLabel")}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              {t("auth.forgot.backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
