// components/market/ConvertedPrice.tsx
"use client";

import React from "react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";

interface ConvertedPriceProps {
  valueUSD: number;
  currency: string;
  className?: string;
}

export const ConvertedPrice: React.FC<ConvertedPriceProps> = ({
  valueUSD,
  currency,
  className,
}) => {
  const { convertedAmount, loading } = useCurrencyConverter(valueUSD, currency);

  if (loading) {
    return <span className={className || "opacity-50 text-xs"}>...</span>;
  }

  return <span className={className}>{convertedAmount}</span>;
};
