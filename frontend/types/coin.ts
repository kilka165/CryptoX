export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h?: number | null;
  market_cap?: number;
  total_volume?: number;
  market_cap_rank?: number;
}

// Диапазоны графика цены (см. карту interval/limit в lib/api/binance.ts).
export type ChartRange = "24h" | "7d" | "30d" | "1y" | "all";

// Одна свеча OHLC; time — UNIX-секунды (формат lightweight-charts).
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}