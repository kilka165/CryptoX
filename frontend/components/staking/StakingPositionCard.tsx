// frontend/components/staking/StakingPositionCard.tsx
"use client";

import React from "react";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { StakingPosition } from "@/lib/api/stakingApi";
import { useTranslation } from "react-i18next";
import { intlLocale } from "@/lib/utils/locale";

interface StakingPositionCardProps {
  position: StakingPosition;
  onUnstake: (id: number) => void;
  onCancel: (id: number) => void;
}

export function StakingPositionCard({
  position,
  onUnstake,
  onCancel,
}: StakingPositionCardProps) {
  const { t, i18n } = useTranslation();
  const isFlexible = position.lock_period_days === 0;
  const isCompleted = position.status === "completed";
  const isCancelled = position.status === "cancelled";

  const formatDate = (date: string | null) => {
    if (!date) return t("staking.noDate");
    return new Date(date).toLocaleDateString(intlLocale(i18n.language), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-6">
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{position.crypto_currency}</h3>
          <div className="flex items-center gap-2 mt-1">
            {isCompleted ? (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {t("staking.completed")}
              </span>
            ) : isCancelled ? (
              <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {t("staking.cancelled")}
              </span>
            ) : (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                {t("staking.active")}
              </span>
            )}
            <span className="text-xs text-slate-500">
              {isFlexible ? t("staking.flexible") : t("staking.daysCount", { n: position.lock_period_days })}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {position.reward_rate}%
          </div>
          <div className="text-xs text-slate-500">APY</div>
        </div>
      </div>

      {/* Прогресс */}
      {!isCompleted && !isCancelled && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">{t("staking.progress")}</span>
            <span className="font-medium">{position.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${position.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Информация */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">{t("staking.staked")}</div>
          <div className="font-bold">{position.amount.toFixed(8)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">{t("staking.earned")}</div>
          <div className="font-bold text-emerald-600 dark:text-emerald-400">
            +{position.earned_rewards.toFixed(8)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">{t("staking.start")}</div>
          <div className="text-sm">{formatDate(position.started_at)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">
            {isFlexible ? t("staking.available") : t("staking.endDate")}
          </div>
          <div className="text-sm">
            {isFlexible ? t("staking.always") : formatDate(position.ends_at)}
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      {!isCompleted && !isCancelled && (
        <div className="flex gap-3">
          {position.can_unstake ? (
            <button
              onClick={() => onUnstake(position.id)}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              {t("staking.withdraw")}
            </button>
          ) : isFlexible ? (
            <button
              onClick={() => onCancel(position.id)}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              {t("staking.cancel")}
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              {t("staking.lockPeriod")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
