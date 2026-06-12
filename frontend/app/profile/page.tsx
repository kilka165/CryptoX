"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BinanceAPI } from "@/lib/api/binance";
import { clearAuthToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/profile/UserCard";
import { UserNavigation } from "@/components/profile/UserNavigation";
import { BalanceCard } from "@/components/profile/BalanceCard";
import { PortfolioValue } from "@/components/profile/PortfolioValue";
import { AssetsTable } from "@/components/profile/AssetsTable";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { BuyModal } from "@/components/market/BuyModal";
import { Footer } from "@/components/Footer";
import { useBuyFlow } from "@/hooks/useBuyFlow";
import { Coin } from "@/types/coin";

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
  avatar?: string | null;
  balance?: number;
  email_verified?: boolean;
  two_factor_enabled?: boolean;
  wallet?: {
    balance: number;
  };
  assets?: Asset[];
}

interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  // Правильный символ и картинка сопоставленной монеты (у активов символы бывают «битые»)
  coinSymbol: string;
  image: string;
  // id и отображаемое имя монеты — для открытия торговой модалки.
  coinId: string;
  coinName: string;
}

interface EnrichedAsset extends Asset {
  valueUSD: number;
  change24h: number;
  currentPriceUSD: number;
  iconSymbol?: string;
  iconSrc?: string;
  coinName?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, BinanceTicker>>({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const flow = useBuyFlow();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadUserData(token);
  }, [router]);

  // Единый источник цен: кэшированный бэкенд /api/coins.
  // Грузим один раз при появлении активов и обновляем раз в 30с.
  useEffect(() => {
    const assets = authUser?.assets;
    if (!assets || assets.length === 0) {
      setPricesLoading(false);
      return;
    }

    let active = true;

    const loadPrices = async () => {
      try {
        // Грузим цены строго по активам пользователя (id монеты хранится в
        // asset.name). Эндпоинт делает fallback в БД, если монета выпала из
        // живого топ-300 списка — иначе её цена обнулялась бы.
        const coins = await BinanceAPI.getAssetPrices(assets.map((a) => a.name));
        if (!active) return;

        const priceMap: Record<string, BinanceTicker> = {};
        assets.forEach((asset) => {
          const key = asset.symbol.toLowerCase();
          const nameKey = asset.name.toLowerCase();
          // Симвoлы у активов могут быть «битые» (BIT вместо BTC, USD вместо USDC) —
          // подстраховываемся матчингом по id монеты, который равен name актива.
          const coin = coins.find(
            (c) =>
              c.symbol.toLowerCase() === key ||
              c.id.toLowerCase() === nameKey
          );
          if (coin) {
            priceMap[key] = {
              symbol: `${coin.symbol.toUpperCase()}USDT`,
              lastPrice: String(coin.current_price),
              priceChangePercent: String(coin.price_change_percentage_24h ?? 0),
              coinSymbol: coin.symbol,
              image: coin.image,
              coinId: coin.id,
              coinName: coin.name,
            };
          }
        });

        setPrices(priceMap);
      } catch (error) {
        console.error("Ошибка загрузки цен:", error);
      } finally {
        if (active) setPricesLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [authUser]);

  const loadUserData = (token: string) => {
    axios
      .get(`${API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAuthUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка авторизации", error);
        clearAuthToken();
        router.push("/login");
      });
  };

  // После успешной сделки в модалке обновляем профиль (баланс и активы).
  useEffect(() => {
    if (!flow.buySuccess && !flow.sellSuccess) return;
    const token = localStorage.getItem("auth_token");
    if (token) loadUserData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.buySuccess, flow.sellSuccess]);

  const handleLogout = () => {
    clearAuthToken();
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
        iconSymbol: ticker?.coinSymbol,
        iconSrc: ticker?.image,
        coinName: ticker?.coinName,
      };
    }) || [];

  // Открытие торговой модалки (та же, что на рынке) на вкладке «Продажа».
  // Цена обязательна — без неё график/расчёты бессмысленны.
  const handleTrade = (asset: EnrichedAsset) => {
    if (!asset.currentPriceUSD) return;
    const coin: Coin = {
      id: asset.name, // name актива равен Coin.id
      symbol: asset.iconSymbol ?? asset.symbol,
      name: asset.coinName ?? asset.name,
      image: asset.iconSrc ?? "",
      current_price: asset.currentPriceUSD,
      price_change_percentage_24h: asset.change24h,
      market_cap: 0,
      total_volume: 0,
    };
    flow.openSell(coin);
  };

  const totalPortfolioUSD = assetsList.reduce(
    (sum, asset) => sum + asset.valueUSD,
    0
  );

  const rawBalance = authUser?.wallet?.balance ?? authUser?.balance ?? 0;
  const userCurrency = authUser?.currency || "USD";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d]">
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="space-y-6">
            <UserCard
              name={authUser.name}
              email={authUser.email}
              avatar={authUser.avatar}
              emailVerified={authUser.email_verified}
              twoFactorEnabled={authUser.two_factor_enabled}
            />
            <UserNavigation onLogout={handleLogout} />
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          {/* id-якорь для пункта «Обзор кошелька»; scroll-mt — отступ под липкую шапку */}
          <div id="wallet-overview" className="lg:col-span-2 space-y-6 scroll-mt-24">
            <BalanceCard balance={rawBalance} currency={userCurrency} />
            <PortfolioValue
              totalValueUSD={totalPortfolioUSD}
              userCurrency={userCurrency}
              loading={pricesLoading}
            />
            {assetsList.length > 0 && (
              <AssetsTable
                assets={assetsList}
                userCurrency={userCurrency}
                onTradeClick={(asset) => handleTrade(asset as EnrichedAsset)}
              />
            )}
          </div>
        </div>

        {/* ТРАНЗАКЦИИ НА ВСЮ ШИРИНУ */}
        {/* id-якорь для пункта «История операций» */}
        <div id="transaction-history" className="mt-6 scroll-mt-24">
          <TransactionHistory userCurrency={userCurrency} />
        </div>
      </div>

      {flow.selectedCoin && <BuyModal flow={flow} />}

      <Footer />
    </div>
  );
}
