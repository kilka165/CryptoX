// frontend/lib/api/p2pApi.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export interface P2POffer {
  id: number;
  seller_id: number;
  seller_name: string;
  orders_count: number;
  completion_rate: number;
  price: number;
  currency: string;
  crypto_currency: string;
  min_limit: number;
  max_limit: number;
  available_amount: number;
  type: "buy" | "sell"; // ← Добавлено!
  avg_completion_time: number;
  created_at: string;
}

interface GetOffersParams {
  crypto_currency?: string;
  currency?: string;
  type?: "buy" | "sell";
}

interface CreateOfferData {
  crypto_currency: string;
  currency: string;
  price: number;
  min_limit: number;
  max_limit: number;
  available_amount: number;
  type: "buy" | "sell";
}

interface CreateTradeData {
  offer_id: number;
  amount: number;
  crypto_amount: number;
}

export const p2pApi = {
  // Получить список предложений
  async getOffers(params: GetOffersParams = {}): Promise<P2POffer[]> {
    const response = await axios.get(`${API_URL}/p2p/offers`, { params });
    return response.data;
  },

  // Получить конкретное предложение
  async getOffer(id: number): Promise<P2POffer> {
    const response = await axios.get(`${API_URL}/p2p/offers/${id}`);
    return response.data;
  },

  // Создать своё предложение
  async createOffer(token: string, data: CreateOfferData) {
    const response = await axios.post(`${API_URL}/p2p/offers`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Создать сделку (купить)
  async createTrade(token: string, data: CreateTradeData) {
    const response = await axios.post(`${API_URL}/p2p/trades`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Получить мои сделки
  async getMyTrades(token: string) {
    const response = await axios.get(`${API_URL}/p2p/trades/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Удалить своё предложение
  async deleteOffer(token: string, id: number) {
    const response = await axios.delete(`${API_URL}/p2p/offers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
