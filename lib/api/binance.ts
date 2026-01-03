// frontend/lib/api/binance.ts
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

  /**
   * Получает список монет для конвертера (используется в /convert)
   * Возвращает топ-100 монет по капитализации
   */
  async getMarketCoinsFromBinance(): Promise<Coin24hData[]> {
    try {
      const coins = await this.get24hPrices();
      
      // Сортируем по капитализации (если есть) или по объёму
      const sorted = coins
        .filter((c) => c.current_price > 0)
        .sort((a, b) => {
          const capA = a.market_cap ?? 0;
          const capB = b.market_cap ?? 0;
          if (capA > 0 && capB > 0) return capB - capA;
          return (b.total_volume ?? 0) - (a.total_volume ?? 0);
        })
        .slice(0, 100);

      return sorted;
    } catch (error: any) {
      console.error('Error fetching market coins:', error.message);
      return [];
    }
  },

  /**
   * Получает информацию о конкретной монете по ID
   */
  async getCoinById(coinId: string): Promise<Coin24hData | null> {
    try {
      const coins = await this.get24hPrices();
      return coins.find((c) => c.id === coinId) || null;
    } catch (error: any) {
      console.error(`Error fetching coin ${coinId}:`, error.message);
      return null;
    }
  },

  /**
   * Поиск монет по названию или символу
   */
  async searchCoins(query: string): Promise<Coin24hData[]> {
    try {
      const coins = await this.get24hPrices();
      const lowerQuery = query.toLowerCase();
      
      return coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(lowerQuery) ||
          coin.symbol.toLowerCase().includes(lowerQuery)
      );
    } catch (error: any) {
      console.error('Error searching coins:', error.message);
      return [];
    }
  },

  /**
   * Получает топ монет по росту за 24ч
   */
  async getTopGainers(limit: number = 10): Promise<Coin24hData[]> {
    try {
      const coins = await this.get24hPrices();
      
      return coins
        .filter((c) => c.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, limit);
    } catch (error: any) {
      console.error('Error fetching top gainers:', error.message);
      return [];
    }
  },

  /**
   * Получает топ монет по падению за 24ч
   */
  async getTopLosers(limit: number = 10): Promise<Coin24hData[]> {
    try {
      const coins = await this.get24hPrices();
      
      return coins
        .filter((c) => c.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, limit);
    } catch (error: any) {
      console.error('Error fetching top losers:', error.message);
      return [];
    }
  },

  /**
   * Получает топ монет по объёму торгов за 24ч
   */
  async getTopByVolume(limit: number = 10): Promise<Coin24hData[]> {
    try {
      const coins = await this.get24hPrices();
      
      return coins
        .filter((c) => (c.total_volume ?? 0) > 0)
        .sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0))
        .slice(0, limit);
    } catch (error: any) {
      console.error('Error fetching top by volume:', error.message);
      return [];
    }
  },
};
