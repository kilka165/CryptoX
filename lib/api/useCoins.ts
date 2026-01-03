// frontend/lib/hooks/useCoins.ts
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

// Глобальный кэш
let cachedCoins: Coin[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 секунд

export function useCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchCoins = async () => {
      // Проверяем кэш
      const now = Date.now();
      if (cachedCoins && now - cacheTimestamp < CACHE_DURATION) {
        setCoins(cachedCoins);
        setLoading(false);
        return;
      }

      // Если уже идёт запрос, ждём
      if (isFetching.current) {
        return;
      }

      isFetching.current = true;
      setLoading(true);

      try {
        const response = await axios.get('http://localhost:8000/api/coins');
        cachedCoins = response.data;
        cacheTimestamp = Date.now();
        setCoins(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching coins:', err);
        setError('Failed to load coins');
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    fetchCoins();
  }, []);

  return { coins, loading, error };
}
