// frontend/components/staking/StakingPositionCard.tsx
import React from "react";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { StakingPosition } from "@/lib/api/stakingApi";

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
  const isFlexible = position.lock_period_days === 0;
  const isCompleted = position.status === "completed";
  const isCancelled = position.status === "cancelled";

  const formatDate = (date: string | null) => {
    if (!date) return "Нет даты";
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{position.crypto_currency}</h3>
          <div className="flex items-center gap-2 mt-1">
            {isCompleted ? (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Завершён
              </span>
            ) : isCancelled ? (
              <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Отменён
              </span>
            ) : (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                Активен
              </span>
            )}
            <span className="text-xs text-slate-500">
              {isFlexible ? "Гибкий" : `${position.lock_period_days} дней`}
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
            <span className="text-slate-500">Прогресс</span>
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
          <div className="text-xs text-slate-500 mb-1">Застейкано</div>
          <div className="font-bold">{position.amount.toFixed(8)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Заработано</div>
          <div className="font-bold text-emerald-600 dark:text-emerald-400">
            +{position.earned_rewards.toFixed(8)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Начало</div>
          <div className="text-sm">{formatDate(position.started_at)}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">
            {isFlexible ? "Доступно" : "Окончание"}
          </div>
          <div className="text-sm">
            {isFlexible ? "Всегда" : formatDate(position.ends_at)}
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
              Вывести средства
            </button>
          ) : isFlexible ? (
            <button
              onClick={() => onCancel(position.id)}
              className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Отменить
            </button>
          ) : (
            <button
              disabled
              className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Период блокировки
            </button>
          )}
        </div>
      )}
    </div>
  );
}
