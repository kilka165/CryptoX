// components/market/CoinImage.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface CoinImageProps {
  coinId: string;
  name: string;
  className?: string; // чтобы можно было задавать размер снаружи
}

export const CoinImage: React.FC<CoinImageProps> = ({ coinId, name, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchIcon = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/coins-db/${coinId}/icon`);
        setImageUrl(res.data.icon_url || res.data.logo_url || null);
      } catch {
        setImageUrl(null);
      }
    };
    fetchIcon();
  }, [coinId]);

  if (imgError || !imageUrl) {
    return (
      <div
        className={
          className ||
          "w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold"
        }
      >
        {name.slice(0, 3).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className={className || "w-6 h-6 rounded-full"}
      onError={() => setImgError(true)}
    />
  );
};
