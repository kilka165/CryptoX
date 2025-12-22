"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Header } from "@/components/Header";

// Компоненты
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

interface CoinPrice {
  usd: number;
  usd_24h_change: number;
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
  const [prices, setPrices] = useState<Record<string, CoinPrice>>({});
  const [selectedAsset, setSelectedAsset] = useState<EnrichedAsset | null>(null);

  // Загрузка данных пользователя
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadUserData(token);
  }, [router]);

  // Загрузка цен активов
  useEffect(() => {
    if (authUser?.assets && authUser.assets.length > 0) {
      const ids = authUser.assets.map((a) => a.name.toLowerCase()).join(",");
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        )
        .then((res) => setPrices(res.data))
        .catch((err) => console.error("Ошибка загрузки цен", err));
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

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  // Формирование списка активов
  const assetsList: EnrichedAsset[] = authUser?.assets?.map((asset) => {
    const priceData = prices[asset.name.toLowerCase()];
    const currentPriceUSD = priceData?.usd || 0;
    const change24h = priceData?.usd_24h_change || 0;
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <UserCard name={authUser.name} email={authUser.email} />
            <UserNavigation onLogout={handleLogout} />
          </aside>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="flex-1 space-y-6">
            <BalanceCard balance={rawBalance} currency={userCurrency} />

            {assetsList.length > 0 && (
              <PortfolioValue
                totalPortfolioUSD={totalPortfolioUSD}
                userCurrency={userCurrency}
              />
            )}

            <AssetsTable
              assets={assetsList}
              userCurrency={userCurrency}
              onSellClick={setSelectedAsset}
            />

            <TransactionHistory userCurrency={userCurrency} />
          </div>
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО */}
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
