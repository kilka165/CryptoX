// frontend/lib/api/convertApi.ts
import axios from "axios";
import type { Coin } from "@/types/coin";
import { BinanceAPI } from "@/lib/api/binance";

const API_BASE = "http://127.0.0.1:8000/api";

export interface UserAsset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url: string | null;
}

export interface SwapRequest {
  from_coins: { coin_id: string; amount: number }[];
  to_coins: { coin_id: string; weight: number }[];
}

export const convertApi = {
  async getUserSettings(token: string) {
    const response = await axios.get(`${API_BASE}/user/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Получает список монет для маркета (вместо CoinGecko теперь через Binance API)
   * @param _currency - игнорируется, т.к. все цены с бэкенда в USD
   */
  async getMarketCoins(_currency: string = "usd"): Promise<Coin[]> {
    try {
      const coins = await BinanceAPI.getMarketCoinsFromBinance();
      return coins;
    } catch (error) {
      console.error("Error fetching market coins:", error);
      return [];
    }
  },

  async getUserAssets(token: string) {
    const response = await axios.get<UserAsset[]>(`${API_BASE}/user/assets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async executeSwap(token: string, swapData: SwapRequest) {
    const response = await axios.post(`${API_BASE}/trade/multi-swap`, swapData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /**
   * Получает топ монет по росту
   */
  async getTopGainers(limit: number = 10): Promise<Coin[]> {
    try {
      return await BinanceAPI.getTopGainers(limit);
    } catch (error) {
      console.error("Error fetching top gainers:", error);
      return [];
    }
  },

  /**
   * Получает топ монет по падению
   */
  async getTopLosers(limit: number = 10): Promise<Coin[]> {
    try {
      return await BinanceAPI.getTopLosers(limit);
    } catch (error) {
      console.error("Error fetching top losers:", error);
      return [];
    }
  },

  /**
   * Получает топ монет по объёму
   */
  async getTopByVolume(limit: number = 10): Promise<Coin[]> {
    try {
      return await BinanceAPI.getTopByVolume(limit);
    } catch (error) {
      console.error("Error fetching top by volume:", error);
      return [];
    }
  },

  /**
   * Поиск монет по названию или символу
   */
  async searchCoins(query: string): Promise<Coin[]> {
    try {
      return await BinanceAPI.searchCoins(query);
    } catch (error) {
      console.error("Error searching coins:", error);
      return [];
    }
  },

  /**
   * Получает информацию о конкретной монете
   */
  async getCoinById(coinId: string): Promise<Coin | null> {
    try {
      return await BinanceAPI.getCoinById(coinId);
    } catch (error) {
      console.error(`Error fetching coin ${coinId}:`, error);
      return null;
    }
  },
};
