// frontend/app/staking/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StakingPlanCard } from "@/components/staking/StakingPlanCard";
import { StakingPositionCard } from "@/components/staking/StakingPositionCard";
import { StakingModal } from "@/components/staking/StakingModal";
import { ConfirmDialog } from "@/components/staking/ConfirmDialog";
import { stakingApi, StakingPlan, StakingPosition } from "@/lib/api/stakingApi";
import { TrendingUp, Wallet, Lock } from "lucide-react";

export default function StakingPage() {
  const [plans, setPlans] = useState<StakingPlan[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<StakingPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"plans" | "positions">("plans");

  // Состояния для диалога подтверждения
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "unstake" | "cancel";
    stakingId: number | null;
    result?: {
      message: string;
      details?: string;
    };
  }>({
    isOpen: false,
    type: "unstake",
    stakingId: null,
    result: undefined,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const plansData = await stakingApi.getPlans();
      setPlans(plansData);

      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const positionsData = await stakingApi.getMyStaking(token);
          setPositions(positionsData);
        } catch (error) {
          console.error("Error fetching positions:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для форматирования чисел без научной нотации
  const formatNumber = (num: number | string): string => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    
    if (isNaN(n)) return "0";
    
    // Если число очень маленькое, форматируем с нужным количеством знаков
    if (Math.abs(n) < 0.000001) {
      return n.toFixed(8);
    }
    
    // Для обычных чисел используем стандартное форматирование
    return n.toString();
  };

  const handlePlanSelect = (plan: StakingPlan) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleUnstake = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      type: "unstake",
      stakingId: id,
      result: undefined,
    });
  };

  const handleCancel = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      type: "cancel",
      stakingId: id,
      result: undefined,
    });
  };

  const confirmUnstake = async () => {
    if (!confirmDialog.stakingId) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const result = await stakingApi.unstake(token, confirmDialog.stakingId);
      
      const totalFormatted = formatNumber(result.total_received);
      const rewardFormatted = formatNumber(result.reward);
      
      // Показываем результат в том же окне
      setConfirmDialog({
        isOpen: true,
        type: "unstake",
        stakingId: null,
        result: {
          message: `Успешно! Получено: ${totalFormatted}`,
          details: `(награда: ${rewardFormatted})`,
        },
      });

      fetchData();
    } catch (error: any) {
      console.error("Error unstaking:", error);
      setConfirmDialog({
        isOpen: true,
        type: "unstake",
        stakingId: null,
        result: {
          message: error.response?.data?.message || "Ошибка при выводе средств",
        },
      });
    }
  };

  const confirmCancel = async () => {
    if (!confirmDialog.stakingId) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      await stakingApi.cancelFlexible(token, confirmDialog.stakingId);
      
      // Показываем результат в том же окне
      setConfirmDialog({
        isOpen: true,
        type: "cancel",
        stakingId: null,
        result: {
          message: "Стейкинг отменён, средства возвращены",
        },
      });

      fetchData();
    } catch (error: any) {
      console.error("Error cancelling:", error);
      setConfirmDialog({
        isOpen: true,
        type: "cancel",
        stakingId: null,
        result: {
          message: error.response?.data?.message || "Ошибка при отмене",
        },
      });
    }
  };

  // Статистика
  const totalStaked = positions
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalEarned = positions
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.earned_rewards, 0);

  const activePositions = positions.filter((p) => p.status === "active").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Заголовок */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Стейкинг</h1>
          <p className="text-sm text-slate-500 mt-1">
            Зарабатывайте пассивный доход, размещая свои активы в стейкинг
          </p>
        </div>

        {/* Статистика */}
        {activePositions > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-sm opacity-90">Застейкано</div>
              </div>
              <div className="text-2xl font-bold">
                {totalStaked.toFixed(4)}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {activePositions} активных позиций
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-sm opacity-90">Заработано</div>
              </div>
              <div className="text-2xl font-bold">
                +{totalEarned.toFixed(8)}
              </div>
              <div className="text-xs opacity-75 mt-1">Текущая награда</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-sm opacity-90">Средний APY</div>
              </div>
              <div className="text-2xl font-bold">
                {activePositions > 0
                  ? (
                      positions
                        .filter((p) => p.status === "active")
                        .reduce((sum, p) => sum + p.reward_rate, 0) /
                      activePositions
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <div className="text-xs opacity-75 mt-1">По всем позициям</div>
            </div>
          </div>
        )}

        {/* Табы */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "plans"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Планы стейкинга
          </button>
          <button
            onClick={() => setActiveTab("positions")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "positions"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Мои позиции
            {activePositions > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                {activePositions}
              </span>
            )}
          </button>
        </div>

        {/* Контент */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : activeTab === "plans" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <StakingPlanCard
                key={plan.id}
                plan={plan}
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
        ) : positions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions.map((position) => (
              <StakingPositionCard
                key={position.id}
                position={position}
                onUnstake={handleUnstake}
                onCancel={handleCancel}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              У вас пока нет активных позиций
            </h3>
            <p className="text-slate-500 mb-4">
              Создайте свою первую позицию стейкинга
            </p>
            <button
              onClick={() => setActiveTab("plans")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Смотреть планы
            </button>
          </div>
        )}
      </main>

      {/* Модальное окно создания стейкинга */}
      <StakingModal
        isOpen={isModalOpen}
        plan={selectedPlan}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        onSuccess={fetchData}
      />

            {/* Диалог подтверждения с результатом */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.result ? "" : ""}
        message={
          confirmDialog.type === "unstake"
            ? "Вы уверены, что хотите вывести средства?"
            : "Вы уверены, что хотите отменить стейкинг?"
        }
        confirmText="ОК"
        cancelText="Отмена"
        type={confirmDialog.type === "cancel" ? "warning" : "info"}
        result={confirmDialog.result}
        onConfirm={confirmUnstake}
        onCancel={() =>
          setConfirmDialog({ isOpen: false, type: "unstake", stakingId: null, result: undefined })
        }
      />


      <Footer />
    </div>
  );
}
