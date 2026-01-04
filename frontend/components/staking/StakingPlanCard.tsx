// frontend/components/staking/StakingPlanCard.tsx
import React from "react";
import { Lock, Zap, TrendingUp, Clock } from "lucide-react";
import { StakingPlan } from "@/lib/api/stakingApi";

interface StakingPlanCardProps {
  plan: StakingPlan;
  onSelect: (plan: StakingPlan) => void;
}

export function StakingPlanCard({ plan, onSelect }: StakingPlanCardProps) {
  const isFlexible = plan.days === 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            {isFlexible ? (
              <Zap className="w-5 h-5 text-yellow-500" />
            ) : (
              <Lock className="w-5 h-5 text-blue-500" />
            )}
            {plan.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {plan.rate}%
          </div>
          <div className="text-xs text-slate-500">годовых</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Период:
          </span>
          <span className="font-medium">
            {isFlexible ? "Гибкий" : `${plan.days} дней`}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Минимум:
          </span>
          <span className="font-medium">{plan.min_amount} крипты</span>
        </div>
      </div>

      <button
        onClick={() => onSelect(plan)}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors group-hover:shadow-lg group-hover:shadow-blue-500/50"
      >
        Застейкать
      </button>
    </div>
  );
}
