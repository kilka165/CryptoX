"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setAuthToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";
import { LogIn, Mail, Lock, ArrowLeft, AlertCircle, ShieldCheck, KeyRound, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Шаг входа: "credentials" (email+пароль), "twoFactor" (TOTP-код)
  // или "verifyEmail" (подтверждение e-mail кодом, если регистрация не завершена).
  const [step, setStep] = useState<"credentials" | "twoFactor" | "verifyEmail">("credentials");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [emailCode, setEmailCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/login`, formData);

      // E-mail не подтверждён — нужно завершить верификацию кодом.
      if (response.data?.verification_required) {
        setStep("verifyEmail");
        setIsLoading(false);
        return;
      }

      // У пользователя включён 2FA — переходим ко второму шагу.
      if (response.data?.two_factor) {
        setStep("twoFactor");
        setIsLoading(false);
        return;
      }

      setAuthToken(response.data.token);
      // Жёсткий переход (а не router.push): перезапускает middleware уже с
      // выставленной cookie и сбрасывает кэш роутера, иначе навигация упирается
      // в закэшированный редирект на /login из разлогиненного состояния.
      window.location.href = "/profile";
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 401) {
        setError(t("auth.login.invalidCredentials"));
      } else {
        setError(t("auth.login.serverError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/login/2fa`, {
        email: formData.email,
        password: formData.password,
        code: twoFactorCode,
      });

      setAuthToken(response.data.token);
      // Жёсткий переход (а не router.push): перезапускает middleware уже с
      // выставленной cookie и сбрасывает кэш роутера, иначе навигация упирается
      // в закэшированный редирект на /login из разлогиненного состояния.
      window.location.href = "/profile";
    } catch (err: any) {
      console.error("2FA error:", err);
      if (err.response && (err.response.status === 422 || err.response.status === 401)) {
        setError(t("auth.twoFactor.invalidCode"));
      } else {
        setError(t("auth.login.serverError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/register/verify`, {
        email: formData.email,
        code: emailCode,
      });

      setAuthToken(response.data.token);
      // Жёсткий переход (а не router.push): перезапускает middleware уже с
      // выставленной cookie и сбрасывает кэш роутера, иначе навигация упирается
      // в закэшированный редирект на /login из разлогиненного состояния.
      window.location.href = "/profile";
    } catch (err: any) {
      console.error("Email verify error:", err);
      if (err.response && err.response.status === 422) {
        setError(t("auth.verify.invalidCode"));
      } else {
        setError(t("auth.verify.serverError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailCode = async () => {
    setError("");
    setInfo("");
    setIsResending(true);

    try {
      await axios.post(`${API_BASE}/register/verify/resend`, { email: formData.email });
      setInfo(t("auth.verify.resent"));
    } catch (err: any) {
      console.error("Resend code error:", err);
      setError(t("auth.verify.serverError"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-2xl p-8 shadow-xl transition-colors">
          {/* Кнопка назад */}
          <button
            type="button"
            onClick={() => (step === "credentials" ? router.push("/") : setStep("credentials"))}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={18} />
            {step === "credentials" ? t("auth.backToHome") : t("auth.twoFactor.back")}
          </button>

          {step === "credentials" ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
                  <p className="text-slate-400 text-sm">{t("auth.login.subtitle")}</p>
                </div>
              </div>

              {error && (
                <div className="mt-4 mb-4 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-200">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.emailLabel")}</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t("common.emailPlaceholder")}
                    />
                  </div>
                </div>

                {/* Пароль */}
                <div className="space-y-1">
                  <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.passwordLabel")}</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t("auth.passwordPlaceholder")}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      {t("auth.login.forgotPassword")}
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                {t("auth.login.noAccount")}{" "}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                  {t("auth.login.registerLink")}
                </Link>
              </p>
            </>
          ) : step === "twoFactor" ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t("auth.twoFactor.title")}</h1>
                  <p className="text-slate-400 text-sm">{t("auth.twoFactor.prompt")}</p>
                </div>
              </div>

              {error && (
                <div className="mt-4 mb-4 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-200">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleTwoFactorSubmit} className="space-y-5 mt-4">
                <div className="space-y-1">
                  <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.twoFactor.codeLabel")}</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      inputMode="text"
                      autoComplete="one-time-code"
                      autoFocus
                      required
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm tracking-widest outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t("auth.twoFactor.codePlaceholder")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading ? t("auth.twoFactor.submitting") : t("auth.twoFactor.submit")}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{t("auth.verify.title")}</h1>
                  <p className="text-slate-400 text-sm">
                    {t("auth.verify.prompt", { email: formData.email })}
                  </p>
                </div>
              </div>

              {info && (
                <div className="mt-4 mb-4 flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/40 px-3 py-2 text-sm text-green-300">
                  <CheckCircle className="w-4 h-4 mt-0.5" />
                  <span>{info}</span>
                </div>
              )}

              {error && (
                <div className="mt-4 mb-4 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-200">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleEmailVerify} className="space-y-5 mt-4">
                <div className="space-y-1">
                  <label className="text-sm text-slate-700 dark:text-slate-300">{t("auth.verify.codeLabel")}</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      autoFocus
                      required
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm tracking-widest outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t("auth.verify.codePlaceholder")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading ? t("auth.verify.submitting") : t("auth.verify.submit")}
                </button>

                <button
                  type="button"
                  onClick={handleResendEmailCode}
                  disabled={isResending}
                  className="w-full text-sm text-blue-400 hover:text-blue-300 disabled:opacity-60"
                >
                  {isResending ? t("auth.verify.resending") : t("auth.verify.resend")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
