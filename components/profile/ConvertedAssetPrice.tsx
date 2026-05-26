"use client";

import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

interface ConvertedAssetPriceProps {
  valueUSD: number;
  currency: string;
}

export function ConvertedAssetPrice({
  valueUSD,
  currency,
}: ConvertedAssetPriceProps) {
  const { convertedAmount, loading } = useCurrencyConverter(
    valueUSD,
    currency
  );
  if (loading) return <span className="opacity-50 text-xs">...</span>;
  return <>{convertedAmount}</>;
}
