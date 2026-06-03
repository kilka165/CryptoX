"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import api from "@/lib/axios";
import {
  ShieldCheck,
  ShieldAlert,
  Mail,
  KeyRound,
  Lock,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Copy,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type TwoFaSetup = { secret: string; otpauth_url: string };

export function SecuritySettings() {
  const { t } = useTranslation();

  const [emailVerified, setEmailVerified] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // --- Email verification ---
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // --- 2FA ---
  const [twoFaSetup, setTwoFaSetup] = useState<TwoFaSetup | null>(null);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [twoFaErr, setTwoFaErr] = useState("");
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  // --- Change password ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    api
      .get("/user")
      .then((res) => {
        setEmailVerified(!!res.data.email_verified);
        setTwoFactorEnabled(!!res.data.two_factor_enabled);
      })
      .catch((err) => console.error(err));
  }, []);

  // ===================== EMAIL =====================
  const sendEmailCode = async () => {
    setEmailErr("");
    setEmailMsg("");
    setEmailLoading(true);
    try {
      await api.post("/email/verify/send");
      setShowEmailCode(true);
      setEmailMsg(t("settings.security.codeSent"));
    } catch (err: any) {
      setEmailErr(err.response?.data?.message || t("settings.security.serverError"));
    } finally {
      setEmailLoading(false);
    }
  };

  const verifyEmail = async () => {
    setEmailErr("");
    setEmailMsg("");
    setEmailLoading(true);
    try {
      await api.post("/email/verify", { code: emailCode });
      setEmailVerified(true);
      setShowEmailCode(false);
      setEmailCode("");
      setEmailMsg(t("settings.security.verifiedSuccess"));
    } catch (err: any) {
      setEmailErr(t("settings.security.invalidCode"));
    } finally {
      setEmailLoading(false);
    }
  };

  // ===================== 2FA =====================
  const enableTwoFa = async () => {
    setTwoFaErr("");
    setTwoFaLoading(true);
    try {
      const res = await api.post("/2fa/enable");
      setTwoFaSetup({ secret: res.data.secret, otpauth_url: res.data.otpauth_url });
      setRecoveryCodes(null);
    } catch (err: any) {
      setTwoFaErr(err.response?.data?.message || t("settings.security.serverError"));
    } finally {
      setTwoFaLoading(false);
    }
  };

  const confirmTwoFa = async () => {
    setTwoFaErr("");
    setTwoFaLoading(true);
    try {
      const res = await api.post("/2fa/confirm", { code: twoFaCode });
      setRecoveryCodes(res.data.recovery_codes || []);
      setTwoFaSetup(null);
      setTwoFaCode("");
      setTwoFactorEnabled(true);
    } catch (err: any) {
      setTwoFaErr(t("settings.security.invalidCode"));
    } finally {
      setTwoFaLoading(false);
    }
  };

  const disableTwoFa = async () => {
    setTwoFaErr("");
    setTwoFaLoading(true);
    try {
      await api.post("/2fa/disable", { password: disablePassword });
      setTwoFactorEnabled(false);
      setShowDisable(false);
      setDisablePassword("");
    } catch (err: any) {
      setTwoFaErr(err.response?.data?.errors?.password?.[0] || t("settings.security.serverError"));
    } finally {
      setTwoFaLoading(false);
    }
  };

  // ===================== CHANGE PASSWORD =====================
  const validatePassword = () => {
    if (newPassword.length < 8) return t("auth.register.errPassShort");
    if (!/[A-Z]/.test(newPassword)) return t("auth.register.errPassUpper");
    if (!/[a-z]/.test(newPassword)) return t("auth.register.errPassLower");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) return t("auth.register.errPassSpecial");
    if (newPassword !== confirmPassword) return t("auth.register.errPassMismatch");
    return "";
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdErr("");
    setPwdMsg("");

    const validationError = validatePassword();
    if (validationError) {
      setPwdErr(validationError);
      return;
    }

    setPwdLoading(true);
    try {
      await api.post("/password/change", {
        current_password: currentPassword,
        password: newPassword,
      });
      setPwdMsg(t("settings.security.passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.response?.status === 422 && err.response.data?.errors?.current_password) {
        setPwdErr(t("settings.security.wrongCurrent"));
      } else {
        setPwdErr(t("settings.security.serverError"));
      }
    } finally {
      setPwdLoading(false);
    }
  };

  const cardClass =
    "bg-white dark:bg-[#131416] rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 p-6 md:p-8";
  const inputClass =
    "block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500";
  const primaryBtn =
    "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-colors disabled:opacity-50";

  return (
    <div className="mt-6 space-y-6">
      {/* ===================== EMAIL VERIFICATION ===================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Mail size={18} /> {t("settings.security.emailTitle")}
          </h2>
          {emailVerified ? (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
              <ShieldCheck size={16} /> {t("settings.security.emailVerified")}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 font-medium">
              <ShieldAlert size={16} /> {t("settings.security.emailNotVerified")}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">{t("settings.security.emailHint")}</p>

        {emailMsg && (
          <p className="text-sm text-green-600 flex items-center gap-1 mb-3">
            <CheckCircle size={16} /> {emailMsg}
          </p>
        )}
        {emailErr && (
          <p className="text-sm text-red-500 flex items-center gap-1 mb-3">
            <AlertCircle size={16} /> {emailErr}
          </p>
        )}

        {!emailVerified && (
          <div className="space-y-3">
            {!showEmailCode ? (
              <button onClick={sendEmailCode} disabled={emailLoading} className={primaryBtn}>
                {emailLoading ? t("settings.security.sending") : t("settings.security.sendCode")}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder={t("settings.security.codePlaceholder")}
                  className={inputClass + " sm:max-w-[200px] tracking-widest"}
                />
                <button onClick={verifyEmail} disabled={emailLoading} className={primaryBtn}>
                  {emailLoading ? t("settings.security.verifying") : t("settings.security.verify")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================== 2FA ===================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Smartphone size={18} /> {t("settings.security.twoFactorTitle")}
          </h2>
          {twoFactorEnabled ? (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium">
              <ShieldCheck size={16} /> {t("settings.security.twoFactorEnabled")}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">
              <ShieldAlert size={16} /> {t("settings.security.twoFactorDisabled")}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">{t("settings.security.twoFactorHint")}</p>

        {twoFaErr && (
          <p className="text-sm text-red-500 flex items-center gap-1 mb-3">
            <AlertCircle size={16} /> {twoFaErr}
          </p>
        )}

        {/* Recovery-коды показываются один раз после подтверждения */}
        {recoveryCodes && (
          <div className="mb-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4">
            <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
              <KeyRound size={16} /> {t("settings.security.recoveryTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {t("settings.security.recoveryHint")}
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {recoveryCodes.map((c) => (
                <div key={c} className="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-center">
                  {c}
                </div>
              ))}
            </div>
            <button
              onClick={() => setRecoveryCodes(null)}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t("settings.security.recoveryDone")}
            </button>
          </div>
        )}

        {/* Состояние: 2FA выключен и не настраивается */}
        {!twoFactorEnabled && !twoFaSetup && !recoveryCodes &&
          (emailVerified ? (
            <button onClick={enableTwoFa} disabled={twoFaLoading} className={primaryBtn}>
              {twoFaLoading ? t("settings.security.enabling") : t("settings.security.enable")}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <ShieldAlert size={16} /> {t("settings.security.verifyEmailFirst")}
              </p>
              <button disabled className={primaryBtn + " cursor-not-allowed"}>
                {t("settings.security.enable")}
              </button>
            </div>
          ))}

        {/* Состояние: настройка 2FA (QR + ввод кода) */}
        {twoFaSetup && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">{t("settings.security.scanQr")}</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <QRCodeSVG value={twoFaSetup.otpauth_url} size={170} />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs text-slate-500">{t("settings.security.orEnterManually")}</p>
                <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 break-all">
                  <span className="flex-1">{twoFaSetup.secret}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(twoFaSetup.secret)}
                    className="text-slate-400 hover:text-blue-500"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">{t("settings.security.confirmCodeLabel")}</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value)}
                  placeholder="123456"
                  className={inputClass + " sm:max-w-[200px] tracking-widest"}
                />
                <button onClick={confirmTwoFa} disabled={twoFaLoading} className={primaryBtn}>
                  {twoFaLoading ? t("settings.security.confirming") : t("settings.security.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Состояние: 2FA включён — можно отключить */}
        {twoFactorEnabled && !recoveryCodes && (
          <div>
            {!showDisable ? (
              <button
                onClick={() => setShowDisable(true)}
                className="flex items-center gap-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-5 py-3 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                {t("settings.security.disable")}
              </button>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("settings.security.disableHint")}</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder={t("settings.security.passwordLabel")}
                    className={inputClass + " sm:max-w-[260px]"}
                  />
                  <button
                    onClick={disableTwoFa}
                    disabled={twoFaLoading}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
                  >
                    {twoFaLoading ? t("settings.security.disabling") : t("settings.security.disable")}
                  </button>
                  <button
                    onClick={() => {
                      setShowDisable(false);
                      setDisablePassword("");
                      setTwoFaErr("");
                    }}
                    className="px-5 py-3 rounded-xl font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {t("settings.security.cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================== CHANGE PASSWORD ===================== */}
      <div className={cardClass}>
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
          <Lock size={18} /> {t("settings.security.changePasswordTitle")}
        </h2>

        {pwdMsg && (
          <p className="text-sm text-green-600 flex items-center gap-1 mb-3">
            <CheckCircle size={16} /> {pwdMsg}
          </p>
        )}
        {pwdErr && (
          <p className="text-sm text-red-500 flex items-center gap-1 mb-3">
            <AlertCircle size={16} /> {pwdErr}
          </p>
        )}

        <form onSubmit={changePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.security.currentPassword")}</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
            <Link
              href="/forgot-password"
              className="inline-block text-sm font-medium text-blue-600 hover:text-blue-500 mt-1"
            >
              {t("settings.security.forgotPassword")}
            </Link>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.security.newPassword")}</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-slate-500 mt-1">{t("auth.register.passwordHint")}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("settings.security.confirmPassword")}</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={pwdLoading} className={primaryBtn}>
            {pwdLoading ? t("settings.security.changing") : t("settings.security.changePassword")}
          </button>
        </form>
      </div>
    </div>
  );
}
