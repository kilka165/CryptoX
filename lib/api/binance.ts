import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

interface Coin24hData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  total_volume?: number;
}

export const BinanceAPI = {
  /**
   * Получает все монеты с бэкенда
   */
  async get24hPrices(): Promise<Coin24hData[]> {
    try {
      const response = await axios.get(`${API_BASE}/coins`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching coins:', error.message);
      return [];
    }
  },

  /**
   * Получает цену конкретной монеты
   */
  async getPrice(symbol: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE}/coins/price/${symbol.toLowerCase()}`);
      return response.data.price;
    } catch (error: any) {
      console.error(`Error fetching price for ${symbol}:`, error.message);
      throw error;
    }
  },

  /**
   * Получает статистику за 24 часа
   */
  async get24hChange(symbol: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE}/coins/stats/${symbol.toLowerCase()}`);
      return parseFloat(response.data.priceChangePercent);
    } catch (error: any) {
      console.error(`Error fetching 24h change for ${symbol}:`, error.message);
      return 0;
    }
  },
};
