// frontend/components/staking/StakingPlanCard.tsx
"use client";

import React from "react";
import { Lock, Zap, TrendingUp, Clock } from "lucide-react";
import { StakingPlan } from "@/lib/api/stakingApi";
import { useTranslation } from "react-i18next";

interface StakingPlanCardProps {
  plan: StakingPlan;
  onSelect: (plan: StakingPlan) => void;
}

const PLAN_DESC_KEYS: Record<number, string> = {
  0: "staking.planDescFlexible",
  30: "staking.planDescMid",
  90: "staking.planDescHigh",
  180: "staking.planDescMax",
};

export function StakingPlanCard({ plan, onSelect }: StakingPlanCardProps) {
  const { t } = useTranslation();
  const isFlexible = plan.days === 0;
  const localizedName = isFlexible ? t("staking.flexible") : t("staking.daysCount", { n: plan.days });
  const descKey = PLAN_DESC_KEYS[plan.days];
  const localizedDesc = descKey ? t(descKey) : plan.description;

  return (
    <div className="bg-white dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            {isFlexible ? (
              <Zap className="w-5 h-5 text-yellow-500" />
            ) : (
              <Lock className="w-5 h-5 text-blue-500" />
            )}
            {localizedName}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{localizedDesc}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {plan.rate}%
          </div>
          <div className="text-xs text-slate-500">{t("staking.perYear")}</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t("staking.period")}
          </span>
          <span className="font-medium">
            {isFlexible ? t("staking.flexible") : t("staking.daysCount", { n: plan.days })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t("staking.minimum")}
          </span>
          <span className="font-medium">{t("staking.minCrypto", { amount: plan.min_amount })}</span>
        </div>
      </div>

      <button
        onClick={() => onSelect(plan)}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors group-hover:shadow-lg group-hover:shadow-blue-500/50"
      >
        {t("staking.stake")}
      </button>
    </div>
  );
}
