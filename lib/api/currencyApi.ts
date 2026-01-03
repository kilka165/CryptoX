// frontend/lib/api/currencyApi.ts
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const currencyApi = {
  /**
   * Получить список поддерживаемых фиатных валют
   */
  async getSupportedCurrencies(): Promise<Currency[]> {
    try {
      const response = await axios.get(`${API_BASE}/currencies`);
      return response.data;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      // Fallback на статический список
      return [
        { code: "USD", name: "Доллар США", symbol: "$" },
        { code: "EUR", name: "Евро", symbol: "€" },
        { code: "RUB", name: "Российский рубль", symbol: "₽" },
        { code: "KZT", name: "Тенге", symbol: "₸" },
        { code: "GBP", name: "Фунт стерлингов", symbol: "£" },
        { code: "CNY", name: "Китайский юань", symbol: "¥" },
      ];
    }
  },
};
