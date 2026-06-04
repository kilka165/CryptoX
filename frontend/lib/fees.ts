"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "@/lib/config";

// Ставки комиссий (доля: 0.01 = 1%). Источник правды — бэкенд (config/fees.php).
export interface FeeRates {
  trade: number;
  withdraw: number;
}

// Фоллбэк, пока запрос не разрешился или бэк недоступен. Бэкенд всё равно
// пересчитывает комиссию сам — это значение только для отображения.
export const DEFAULT_FEES: FeeRates = { trade: 0.01, withdraw: 0.01 };

let cache: FeeRates | null = null;
let inflight: Promise<FeeRates> | null = null;

export async function fetchFees(): Promise<FeeRates> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = axios
    .get<Partial<FeeRates>>(`${API_BASE}/fees`)
    .then((res) => {
      cache = {
        trade: Number(res.data.trade ?? DEFAULT_FEES.trade),
        withdraw: Number(res.data.withdraw ?? DEFAULT_FEES.withdraw),
      };
      return cache;
    })
    .catch(() => DEFAULT_FEES)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

// Хук для компонентов: возвращает ставки, подгружая их один раз (с кэшем в модуле).
export function useFees(): FeeRates {
  const [fees, setFees] = useState<FeeRates>(cache ?? DEFAULT_FEES);

  useEffect(() => {
    let active = true;
    fetchFees().then((f) => {
      if (active) setFees(f);
    });
    return () => {
      active = false;
    };
  }, []);

  return fees;
}
