// frontend/lib/api/stakingApi.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export interface StakingPlan {
  id: number;
  name: string;
  days: number;
  rate: number;
  min_amount: number;
  description: string;
}

export interface StakingPosition {
  id: number;
  crypto_currency: string;
  amount: number;
  reward_rate: number;
  earned_rewards: number;
  status: "active" | "completed" | "cancelled";
  lock_period_days: number;
  progress: number;
  can_unstake: boolean;
  started_at: string;
  ends_at: string | null;
  claimed_at: string | null;
}

export interface Asset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  icon_url?: string;
}

export const stakingApi = {
  // Получить планы стейкинга
  async getPlans(): Promise<StakingPlan[]> {
    const response = await axios.get(`${API_URL}/staking/plans`);
    return response.data;
  },

  // Получить активы пользователя
  async getUserAssets(token: string): Promise<Asset[]> {
    const response = await axios.get(`${API_URL}/staking/assets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Получить мои стейкинги
  async getMyStaking(token: string): Promise<StakingPosition[]> {
    const response = await axios.get(`${API_URL}/staking/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Создать стейкинг
  async stake(
    token: string,
    data: {
      crypto_currency: string;
      amount: number;
      plan_id: number;
    }
  ): Promise<any> {
    const response = await axios.post(`${API_URL}/staking/stake`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Вывести средства
  async unstake(token: string, stakingId: number): Promise<any> {
    const response = await axios.post(
      `${API_URL}/staking/unstake/${stakingId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // Отменить гибкий стейкинг
  async cancelFlexible(token: string, stakingId: number): Promise<any> {
    const response = await axios.post(
      `${API_URL}/staking/cancel/${stakingId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
