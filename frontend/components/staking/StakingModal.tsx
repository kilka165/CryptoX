// frontend/components/staking/StakingModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { StakingPlan, Asset, stakingApi } from "@/lib/api/stakingApi";
import { useTranslation } from "react-i18next";

interface StakingModalProps {
  isOpen: boolean;
  plan: StakingPlan | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function StakingModal({
  isOpen,
  plan,
  onClose,
  onSuccess,
}: StakingModalProps) {
  const { t } = useTranslation();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const data = await stakingApi.getUserAssets(token);
      setAssets(data);

      if (data.length > 0) {
        setSelectedCrypto(data[0].name);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      setError(t("staking.loadAssetsError"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!plan) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < plan.min_amount) {
      setError(t("staking.minAmount", { amount: plan.min_amount }));
      return;
    }

    const selectedAsset = assets.find((a) => a.name === selectedCrypto);
    if (!selectedAsset || selectedAsset.amount < amountNum) {
      setError(t("staking.insufficientBalance"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError(t("staking.authRequired"));
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      await stakingApi.stake(token, {
        crypto_currency: selectedCrypto,
        amount: amountNum,
        plan_id: plan.id,
      });

      setSuccess(true);
      setAmount("");

      // Закрываем модалку и обновляем данные через 1.5 секунды
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error("Error creating staking:", error);
      setError(
        error.response?.data?.message || t("staking.createError")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !plan) return null;

  const selectedAsset = assets.find((a) => a.name === selectedCrypto);
  const amountNum = parseFloat(amount) || 0;
  const estimatedReward = (amountNum * plan.rate) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 w-full max-w-md shadow-xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-slate-300 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold">{t("staking.modalTitle")}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {t("staking.planLabel", { name: plan.days === 0 ? t("staking.flexible") : t("staking.daysCount", { n: plan.days }), rate: plan.rate })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Сообщения об ошибках и успехе */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{t("staking.successCreated")}</span>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Выбор криптовалюты */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("staking.crypto")}
            </label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.name}>
                  {t("staking.assetOption", { name: asset.name, amount: asset.amount.toFixed(8) })}
                </option>
              ))}
            </select>
          </div>

          {/* Сумма */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("staking.amountToStake")}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  // Разрешаем только цифры и точку
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  // Разрешаем только одну точку
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    setAmount(parts[0] + "." + parts.slice(1).join(""));
                  } else {
                    setAmount(value);
                  }
                }}
                placeholder={t("staking.minPlaceholder", { amount: plan.min_amount })}
                className="w-full px-4 py-3 pr-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setAmount(selectedAsset?.amount.toString() || "0")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {t("common.max")}
              </button>
            </div>
            {selectedAsset && (
              <p className="text-xs text-slate-500 mt-1">
                {t("staking.availableAsset", { amount: selectedAsset.amount.toFixed(8), name: selectedAsset.name })}
              </p>
            )}
          </div>

          {/* Информация */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t("staking.lockPeriodLabel")}</span>
              <span className="font-medium">
                {plan.days === 0 ? t("staking.flexible") : t("staking.daysCount", { n: plan.days })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">{t("staking.annualRate")}</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {plan.rate}%
              </span>
            </div>
            {amountNum > 0 && (
              <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">{t("staking.expectedYield")}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  ~{estimatedReward.toFixed(8)} {selectedCrypto}
                </span>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !amount ||
                parseFloat(amount) < plan.min_amount ||
                success
              }
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("staking.creating")}
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t("staking.done")}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {t("staking.stake")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
