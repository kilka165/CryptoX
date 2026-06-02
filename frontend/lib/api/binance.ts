// frontend/lib/api/binance.ts
import axios from 'axios';
import { API_BASE } from '@/lib/config';

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

// Кэш на уровне модуля: get24hPrices вызывается многими методами ниже, без
// него каждый делал бы отдельный полный запрос /coins. TTL синхронен с
// бэкенд-кэшем; coinsInFlight дедуплицирует параллельные вызовы.
let coinsCache: Coin24hData[] | null = null;
let coinsCacheAt = 0;
let coinsInFlight: Promise<Coin24hData[]> | null = null;
const COINS_TTL_MS = 30_000;

export const BinanceAPI = {
  /**
   * Получает все монеты с бэкенда (с кэшированием и дедупликацией запросов)
   */
  async get24hPrices(): Promise<Coin24hData[]> {
    const now = Date.now();
    if (coinsCache && now - coinsCacheAt < COINS_TTL_MS) {
      return coinsCache;
    }
    if (coinsInFlight) {
      return coinsInFlight;
    }

    coinsInFlight = axios
      .get(`${API_BASE}/coins`)
      .then((response) => {
        coinsCache = response.data;
        coinsCacheAt = Date.now();
        return coinsCache as Coin24hData[];
      })
      .catch((error: any) => {
        console.error('Error fetching coins:', error.message);
        return coinsCache ?? [];
      })
      .finally(() => {
        coinsInFlight = null;
      });

    return coinsInFlight;
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
