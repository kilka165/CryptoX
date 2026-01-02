"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { CoinList, OverviewCoin } from "@/components/market/CoinList";
import { BuyModal } from "@/components/market/BuyModal";
import { Footer } from "@/components/Footer";

// вспомогательные функции
const formatInputAmount = (value: string) => {
  if (!value) return "";
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

const cleanInputAmount = (value: string) => value.replace(/\s/g, "");

export default function MarketOverviewPage() {
  const [coins, setCoins] = useState<OverviewCoin[]>([]);
  const [loading, setLoading] = useState(true);

  const [userCurrency, setUserCurrency] = useState("USD");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  const [selectedCoin, setSelectedCoin] = useState<OverviewCoin | null>(null);
  const [displayAmount, setDisplayAmount] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  // ===== Загрузка монет =====
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets" +
            "?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (e) {
        console.error("Ошибка загрузки:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.currency) setUserCurrency(res.data.currency);
        const balance = res.data.wallet?.balance || res.data.balance || 0;
        setUserBalance(Number(balance));
      })
      .catch((e) => console.error(e));
  }, []);

  // ===== Курс валюты =====
  useEffect(() => {
    if (userCurrency === "USD") {
      setExchangeRate(1);
      return;
    }
    axios
      .get("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => {
        const rate = res.data.rates[userCurrency];
        if (rate) setExchangeRate(rate);
      })
      .catch(() => {
        const fallback: Record<string, number> = {
          RUB: 90,
          EUR: 0.92,
          KZT: 450,
        };
        setExchangeRate(fallback[userCurrency] || 1);
      });
  }, [userCurrency]);

  // ===== Производные выборки =====
  const popularCoins = coins.slice(0, 10);
  const topGainers = [...coins]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 10);
  const topLosers = [...coins]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 10);

  // ===== Суммы =====
  const amountUserEntered = parseFloat(cleanInputAmount(displayAmount) || "0");
  const calculatedUSD = amountUserEntered / exchangeRate;
  const cryptoAmount =
    calculatedUSD / (selectedCoin?.current_price || 1);
  const maxBalanceInUserCurrency = userBalance * exchangeRate;

  // ===== Обработчики =====
  const handleAmountChange = (raw: string) => {
    let val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setDisplayAmount(formatInputAmount(val));
  };

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;
    setIsBuying(true);

    const pureAmount = parseFloat(cleanInputAmount(displayAmount));
    const amountInUSD = pureAmount / exchangeRate;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Пожалуйста, войдите в аккаунт");
        window.location.href = "/login";
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/trade/buy",
        {
          coin_id: selectedCoin.id,
          symbol: selectedCoin.symbol,
          amount_usd: amountInUSD,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserBalance((prev) => prev - amountInUSD);
      setBuySuccess(true);
      setTimeout(() => {
        setBuySuccess(false);
        setSelectedCoin(null);
        setDisplayAmount("");
      }, 2000);
    } catch (error: any) {
      alert(error.response?.data?.message || "Ошибка при покупке");
    } finally {
      setIsBuying(false);
    }
  };

  // ===== Рендер =====
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="p-4 md:p-8">
        <div className="w-full max-w-[1600px] mx-auto mb-8">
          <Link
            href="/market"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Назад к рынку
          </Link>

          <h1 className="text-3xl font-bold mb-8">Обзор рынка</h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[600px] bg-slate-200 dark:bg-slate-900 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <CoinList
                title="Популярные монеты"
                coins={popularCoins}
                type="popular"
                userCurrency={userCurrency}
                onBuy={setSelectedCoin}
              />
              <CoinList
                title="Показывают рост"
                coins={topGainers}
                type="gainers"
                userCurrency={userCurrency}
                onBuy={setSelectedCoin}
              />
              <CoinList
                title="Теряют в цене"
                coins={topLosers}
                type="losers"
                userCurrency={userCurrency}
                onBuy={setSelectedCoin}
              />
            </div>
          )}
        </div>
      </div>

      <BuyModal
        isOpen={!!selectedCoin}
        coin={selectedCoin}
        userCurrency={userCurrency}
        userBalance={userBalance}
        exchangeRate={exchangeRate}
        displayAmount={displayAmount}
        amountUserEntered={amountUserEntered}
        calculatedUSD={calculatedUSD}
        cryptoAmount={cryptoAmount}
        maxBalanceInUserCurrency={maxBalanceInUserCurrency}
        isBuying={isBuying}
        buySuccess={buySuccess}
        onClose={() => setSelectedCoin(null)}
        onChangeAmount={handleAmountChange}
        onSetMax={() =>
          setDisplayAmount(formatInputAmount(maxBalanceInUserCurrency.toFixed(2)))
        }
        onSubmit={handleBuySubmit}
      />

      <Footer />
    </div>
  );
}
