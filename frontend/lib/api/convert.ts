import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";
const COINGECKO_API = "https://api.coingecko.com/api/v3";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

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

  async getMarketCoins(currency: string = "usd") {
    const response = await axios.get<Coin[]>(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: currency.toLowerCase(),
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
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
};
