"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/profile/UserCard";
import { UserNavigation } from "@/components/profile/UserNavigation";
import { BalanceCard } from "@/components/profile/BalanceCard";
import { PortfolioValue } from "@/components/profile/PortfolioValue";
import { AssetsTable } from "@/components/profile/AssetsTable";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { SellModal } from "@/components/profile/SellModal";
import { Footer } from "@/components/Footer";

// Типы
interface Asset {
  id: number;
  symbol: string;
  name: string;
  amount: number;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  currency?: string;
  balance?: number;
  wallet?: {
    balance: number;
  };
  assets?: Asset[];
}

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
}

interface EnrichedAsset extends Asset {
  valueUSD: number;
  change24h: number;
  currentPriceUSD: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, BinanceTicker>>({});
  const [selectedAsset, setSelectedAsset] = useState<EnrichedAsset | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadUserData(token);
  }, [router]);

  useEffect(() => {
    if (authUser?.assets && authUser.assets.length > 0) {
      loadBinancePrices(authUser.assets);
    }
  }, [authUser]);

  const loadUserData = (token: string) => {
    axios
      .get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAuthUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка авторизации", error);
        localStorage.removeItem("auth_token");
        router.push("/login");
      });
  };

  const loadBinancePrices = async (assets: Asset[]) => {
    try {
      const response = await axios.get<BinanceTicker[]>(
        "https://api.binance.com/api/v3/ticker/24hr"
      );

      const priceMap: Record<string, BinanceTicker> = {};
      
      assets.forEach((asset) => {
        const ticker = response.data.find(
          (t) => t.symbol === `${asset.symbol.toUpperCase()}USDT`
        );
        
        if (ticker) {
          priceMap[asset.symbol.toLowerCase()] = ticker;
        }
      });

      setPrices(priceMap);
    } catch (error) {
      console.error("Ошибка загрузки цен с Binance:", error);
      
      try {
        const priceMap: Record<string, BinanceTicker> = {};
        
        for (const asset of assets) {
          try {
            const res = await axios.get<BinanceTicker>(
              `https://api.binance.com/api/v3/ticker/24hr?symbol=${asset.symbol.toUpperCase()}USDT`
            );
            priceMap[asset.symbol.toLowerCase()] = res.data;
          } catch (err) {
            console.error(`Не удалось загрузить цену для ${asset.symbol}:`, err);
          }
        }
        
        setPrices(priceMap);
      } catch (fallbackError) {
        console.error("Запасной метод загрузки цен тоже не сработал:", fallbackError);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  const assetsList: EnrichedAsset[] =
    authUser?.assets?.map((asset) => {
      const ticker = prices[asset.symbol.toLowerCase()];
      const currentPriceUSD = ticker ? parseFloat(ticker.lastPrice) : 0;
      const change24h = ticker ? parseFloat(ticker.priceChangePercent) : 0;
      const valueUSD = Number(asset.amount) * currentPriceUSD;

      return {
        ...asset,
        valueUSD,
        change24h,
        currentPriceUSD,
      };
    }) || [];

  const totalPortfolioUSD = assetsList.reduce(
    (sum, asset) => sum + asset.valueUSD,
    0
  );

  const rawBalance = authUser?.wallet?.balance ?? authUser?.balance ?? 0;
  const userCurrency = authUser?.currency || "USD";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="space-y-6">
            <UserCard name={authUser.name} email={authUser.email} />
            <UserNavigation onLogout={handleLogout} />
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="lg:col-span-2 space-y-6">
            <BalanceCard balance={rawBalance} currency={userCurrency} />
            <PortfolioValue 
              assets={authUser?.assets || []} 
              userCurrency={userCurrency} 
            />
            {assetsList.length > 0 && (
              <AssetsTable
                assets={assetsList}
                userCurrency={userCurrency}
                onSellClick={(asset) => setSelectedAsset(asset as EnrichedAsset)}
              />
            )}
          </div>
        </div>

        {/* ТРАНЗАКЦИИ НА ВСЮ ШИРИНУ */}
        <div className="mt-6">
          <TransactionHistory userCurrency={userCurrency} />
        </div>
      </div>

      <SellModal
        selectedAsset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        userCurrency={userCurrency}
        onSellSuccess={() => {
          const token = localStorage.getItem("auth_token");
          if (token) loadUserData(token);
        }}
      />

      <Footer />
    </div>
  );
}
