"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Flame, TrendingUp, BarChart3, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { CoinRow } from "@/components/market/CoinRow";
import { MarketCard } from "@/components/market/MarketCard";
import { BuyModal } from "@/components/market/BuyModal";
import { Footer } from "@/components/Footer";
import { BinanceAPI } from "@/lib/api/binance";
import { Coin } from "@/types/coin";

const formatNumber = (num: number) => {
  if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + "T";
  if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
  if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
  if (num >= 1.0e3) return (num / 1.0e3).toFixed(2) + "K";
  return num.toFixed(2);
};

const formatInputAmount = (value: string) => {
  if (!value) return "";
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const cleanInputAmount = (value: string) => value.replace(/,/g, "");

export default function MarketPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [displayAmount, setDisplayAmount] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        console.log("Загружаем цены с Binance...");
        const binancePrices = await BinanceAPI.get24hPrices();
        
        const coinsData: Coin[] = binancePrices.map(bp => ({
          id: bp.id,
          symbol: bp.symbol,
          name: bp.name,
          image: bp.image || "",
          current_price: bp.current_price,
          price_change_percentage_24h: bp.price_change_percentage_24h || 0,
          market_cap: bp.market_cap || 0,
          total_volume: bp.total_volume || 0,
        }));

        setCoins(coinsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.currency) setUserCurrency(res.data.currency);
        const balance = res.data.wallet?.balance ?? res.data.balance ?? 0;
        setUserBalance(Number(balance));
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (userCurrency === "USD") {
      setExchangeRate(1);
      return;
    }

    const rates: Record<string, number> = {
      RUB: 90,
      EUR: 0.92,
      KZT: 450,
    };

    setExchangeRate(rates[userCurrency] ?? 1);
  }, [userCurrency]);

  const handleInputChange = (raw: string) => {
    let val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setDisplayAmount(formatInputAmount(val));
  };

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;

    setIsBuying(true);
    const pureAmount = parseFloat(cleanInputAmount(displayAmount) || "0");
    const amountInUSD = pureAmount / exchangeRate;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Необходима авторизация");
        window.location.href = "/login";
        return;
      }

      const binancePrice = await BinanceAPI.getPrice(selectedCoin.symbol);
      const cryptoAmountToBuy = amountInUSD / binancePrice;

      const payload = {
        coin_id: selectedCoin.id,
        amount: cryptoAmountToBuy,
        price_usd: binancePrice,
      };

      console.log("=== ПОКУПКА ===");
      console.log("selectedCoin:", selectedCoin);
      console.log("Сумма в USD:", amountInUSD);
      console.log("Цена Binance:", binancePrice);
      console.log("Количество крипты:", cryptoAmountToBuy);
      console.log("Отправляем payload:", payload);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/trade/buy",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Ответ от сервера:", response.data);

      setUserBalance((prev) => prev - amountInUSD);
      setBuySuccess(true);
      setTimeout(() => {
        setBuySuccess(false);
        setSelectedCoin(null);
        setDisplayAmount("");
      }, 2000);
    } catch (error: any) {
      console.error("=== ОШИБКА ПОКУПКИ ===");
      console.error("Полная ошибка:", error);
      console.error("Ответ сервера:", error.response?.data);
      
      alert(
        error.response?.data?.message || 
        JSON.stringify(error.response?.data) ||
        "Ошибка при покупке"
      );
    } finally {
      setIsBuying(false);
    }
  };


  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredCoins.length / perPage));
  const paginatedCoins = filteredCoins.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const topGainers = [...coins]
    .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
    .slice(0, 4);

  const topVolume = [...coins]
    .sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0))
    .slice(0, 4);

  const newGems = [...coins]
    .sort((a, b) => (a.market_cap ?? 0) - (b.market_cap ?? 0))
    .filter((c) => (c.market_cap ?? 0) > 0)
    .slice(0, 4);

  const amountUserEntered = parseFloat(cleanInputAmount(displayAmount) || "0") || 0;
  const calculatedUSD = amountUserEntered / exchangeRate;
  const cryptoAmount =
    selectedCoin && selectedCoin.current_price
      ? calculatedUSD / selectedCoin.current_price
      : 0;
  const maxBalanceInUserCurrency = userBalance * exchangeRate;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
            <h2 className="text-2xl font-bold">Рынок криптовалют</h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск монет..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {loading ? null : (
              <>
                <MarketCard
                  title="Популярные"
                  icon={Flame}
                  coins={coins}
                  onBuy={setSelectedCoin}
                  userCurrency={userCurrency}
                  exchangeRate={exchangeRate}
                  href="/market/overview"
                />
                <MarketCard
                  title="Топ роста"
                  icon={TrendingUp}
                  coins={topGainers}
                  onBuy={setSelectedCoin}
                  userCurrency={userCurrency}
                  exchangeRate={exchangeRate}
                  href="/market/overview"
                />
                <MarketCard
                  title="По объёму"
                  icon={BarChart3}
                  coins={topVolume}
                  onBuy={setSelectedCoin}
                  userCurrency={userCurrency}
                  exchangeRate={exchangeRate}
                  href="/market/overview"
                />
                <MarketCard
                  title="Новые"
                  icon={Zap}
                  coins={newGems}
                  onBuy={setSelectedCoin}
                  userCurrency={userCurrency}
                  exchangeRate={exchangeRate}
                  href="/market/overview"
                />
              </>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Монета</th>
                  <th className="px-6 py-4 text-right">Цена ({userCurrency})</th>
                  <th className="px-6 py-4 text-right">24ч</th>
                  <th className="px-6 py-4 text-right hidden md:table-cell">Объём</th>
                  <th className="px-6 py-4 text-right hidden lg:table-cell">Капитализация</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="h-16 animate-pulse bg-slate-50 dark:bg-slate-900">
                        <td colSpan={7}></td>
                      </tr>
                    ))
                  : paginatedCoins.map((coin, idx) => (
                      <CoinRow
                        key={coin.id}
                        coin={coin}
                        index={(currentPage - 1) * perPage + idx + 1}
                        userCurrency={userCurrency}
                        exchangeRate={exchangeRate}
                        onBuy={setSelectedCoin}
                        formatNumber={formatNumber}
                      />
                    ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-sm text-slate-500">
              Страница {currentPage} из {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg text-sm border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Назад
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg text-sm border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Вперёд
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedCoin && (
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
          onChangeAmount={handleInputChange}
          onSetMax={() =>
            setDisplayAmount(formatInputAmount(maxBalanceInUserCurrency.toFixed(2)))
          }
          onSubmit={handleBuySubmit}
        />
      )}

      <Footer />
    </div>
  );
}
