"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Flame, TrendingUp, BarChart3, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { CoinRow } from "@/components/market/CoinRow";
import { CoinCard } from "@/components/market/CoinCard";
import { MarketCard } from "@/components/market/MarketCard";
import { MarketCardsCarousel, MarketCardDef } from "@/components/market/MarketCardsCarousel";
import { Pagination } from "@/components/market/Pagination";
import { getCurrencySymbol } from "@/lib/currencies";
import { BuyModal } from "@/components/market/BuyModal";
import { Footer } from "@/components/Footer";
import { BinanceAPI } from "@/lib/api/binance";
import { API_BASE } from "@/lib/config";
import { Coin } from "@/types/coin";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";
import { useFees } from "@/lib/fees";

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
  const { t } = useTranslation();
  const { getRate } = useRates();
  const { trade: tradeRate } = useFees();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [userBalance, setUserBalance] = useState<number>(0);

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [displayAmount, setDisplayAmount] = useState("");
  const [displayCryptoAmount, setDisplayCryptoAmount] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
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
      .get(`${API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.currency) setUserCurrency(res.data.currency);
        const balance = res.data.wallet?.balance ?? res.data.balance ?? 0;
        setUserBalance(Number(balance));
      })
      .catch((e) => console.error(e));
  }, []);

  const exchangeRate = getRate(userCurrency);

  const trimZeros = (s: string) => {
    if (!s.includes(".")) return s;
    return s.replace(/0+$/, "").replace(/\.$/, "");
  };

  const handleInputChange = (raw: string) => {
    let val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setDisplayAmount(formatInputAmount(val));

    const moneyNum = parseFloat(val || "0");
    if (selectedCoin && selectedCoin.current_price > 0 && exchangeRate > 0 && moneyNum > 0) {
      const cryptoNum = moneyNum / exchangeRate / selectedCoin.current_price;
      setDisplayCryptoAmount(trimZeros(cryptoNum.toFixed(8)));
    } else {
      setDisplayCryptoAmount("");
    }
  };

  const handleCryptoInputChange = (raw: string) => {
    let val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setDisplayCryptoAmount(val);

    const cryptoNum = parseFloat(val || "0");
    if (selectedCoin && selectedCoin.current_price > 0 && cryptoNum > 0) {
      const moneyNum = cryptoNum * selectedCoin.current_price * exchangeRate;
      setDisplayAmount(formatInputAmount(moneyNum.toFixed(2)));
    } else {
      setDisplayAmount("");
    }
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
        alert(t("common.authRequired"));
        window.location.href = "/login";
        return;
      }

      // Используем ту же цену, что показывали в модалке (selectedCoin.current_price),
      // а не отдельный /coins/price/{symbol} — иначе из-за рассинхрона между
      // кэшированным списком и live-эндпоинтом сумма в истории отличалась на ~0.01%.
      const coinPrice = selectedCoin.current_price;
      const cryptoAmountToBuy = amountInUSD / coinPrice;

      const payload = {
        coin_id: selectedCoin.id,
        amount: cryptoAmountToBuy,
        price_usd: coinPrice,
      };

      const response = await axios.post(
        `${API_BASE}/trade/buy`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserBalance((prev) => prev - amountInUSD * (1 + tradeRate));
      setBuySuccess(true);
      setTimeout(() => {
        setBuySuccess(false);
        setSelectedCoin(null);
        setDisplayAmount("");
        setDisplayCryptoAmount("");
      }, 2000);
    } catch (error: any) {
      console.error("=== ОШИБКА ПОКУПКИ ===");
      console.error("Полная ошибка:", error);
      console.error("Ответ сервера:", error.response?.data);
      
      alert(
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        t("market.buyError")
      );
    } finally {
      setIsBuying(false);
    }
  };


  const filteredCoins = useMemo(
    () =>
      coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      ),
    [coins, search]
  );

  const totalPages = Math.max(1, Math.ceil(filteredCoins.length / perPage));
  const paginatedCoins = filteredCoins.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const topGainers = useMemo(
    () =>
      [...coins]
        .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
        .slice(0, 4),
    [coins]
  );

  const topVolume = useMemo(
    () =>
      [...coins]
        .sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0))
        .slice(0, 4),
    [coins]
  );

  const newGems = useMemo(
    () =>
      [...coins]
        .sort((a, b) => (a.market_cap ?? 0) - (b.market_cap ?? 0))
        .filter((c) => (c.market_cap ?? 0) > 0)
        .slice(0, 4),
    [coins]
  );

  const amountUserEntered = parseFloat(cleanInputAmount(displayAmount) || "0") || 0;
  const calculatedUSD = amountUserEntered / exchangeRate;
  const maxBalanceInUserCurrency = userBalance * exchangeRate;

  const marketCards: MarketCardDef[] = [
    { title: t("market.popular"), icon: Flame, coins, href: "/market/overview" },
    { title: t("market.topGainers"), icon: TrendingUp, coins: topGainers, href: "/market/overview" },
    { title: t("market.byVolume"), icon: BarChart3, coins: topVolume, href: "/market/overview" },
    { title: t("market.new"), icon: Zap, coins: newGems, href: "/market/overview" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-6">{t("market.title")}</h2>

          {!loading && (
            <>
              {/* Мобильная карусель карточек */}
              <MarketCardsCarousel
                cards={marketCards}
                onBuy={setSelectedCoin}
                userCurrency={userCurrency}
                exchangeRate={exchangeRate}
              />

              {/* Десктопная сетка карточек */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {marketCards.map((c) => (
                  <MarketCard
                    key={c.title}
                    title={c.title}
                    icon={c.icon}
                    coins={c.coins}
                    onBuy={setSelectedCoin}
                    userCurrency={userCurrency}
                    exchangeRate={exchangeRate}
                    href={c.href}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Поиск — под карточками, над списком */}
          <div className="relative w-full md:w-80 md:ml-auto mb-4">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("market.searchCoins")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-800 rounded-xl bg-white dark:bg-[#131416] outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Подписи колонок (планшет) */}
          <div className="hidden sm:flex lg:hidden items-center gap-3 px-3 mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            <span className="w-5 text-center shrink-0">#</span>
            <span className="w-9 shrink-0" />
            <span className="flex-1 min-w-0">{t("market.coin")}</span>
            <span className="text-right shrink-0">
              {t("market.priceCur", { currency: getCurrencySymbol(userCurrency) })} / {t("market.change24h")}
            </span>
            <span className="px-3 text-sm invisible shrink-0">{t("market.buy")}</span>
          </div>

          {/* Мобильный/планшетный список — карточки */}
          <div className="lg:hidden space-y-2 mb-4">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl animate-pulse bg-slate-100 dark:bg-[#131416]" />
                ))
              : paginatedCoins.map((coin, idx) => (
                  <CoinCard
                    key={coin.id}
                    coin={coin}
                    index={(currentPage - 1) * perPage + idx + 1}
                    userCurrency={userCurrency}
                    exchangeRate={exchangeRate}
                    onBuy={setSelectedCoin}
                  />
                ))}
          </div>

          {/* Десктопная таблица */}
          <div className="hidden lg:block bg-white dark:bg-[#131416] rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 sm:px-6 py-4 hidden sm:table-cell">#</th>
                  <th className="px-3 sm:px-6 py-4">{t("market.coin")}</th>
                  <th className="px-3 sm:px-6 py-4 text-right">{t("market.priceCur", { currency: getCurrencySymbol(userCurrency) })}</th>
                  <th className="px-3 sm:px-6 py-4 text-right">{t("market.change24h")}</th>
                  <th className="px-3 sm:px-6 py-4 text-right hidden lg:table-cell">{t("market.volume")}</th>
                  <th className="px-3 sm:px-6 py-4 text-right hidden xl:table-cell">{t("market.marketCap")}</th>
                  <th className="px-3 sm:px-6 py-4 text-right">{t("market.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="h-16 animate-pulse bg-slate-50 dark:bg-[#131416]">
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
          </div>

          {/* Пагинация — видна и на мобильном, и на десктопе */}
          <div className="flex justify-center py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={(p) => setCurrentPage(p)}
            />
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
          displayCryptoAmount={displayCryptoAmount}
          amountUserEntered={amountUserEntered}
          calculatedUSD={calculatedUSD}
          maxBalanceInUserCurrency={maxBalanceInUserCurrency}
          isBuying={isBuying}
          buySuccess={buySuccess}
          onClose={() => {
            setSelectedCoin(null);
            setDisplayAmount("");
            setDisplayCryptoAmount("");
          }}
          onChangeAmount={handleInputChange}
          onChangeCryptoAmount={handleCryptoInputChange}
          onSetMax={() => handleInputChange((maxBalanceInUserCurrency / (1 + tradeRate)).toFixed(2))}
          onSubmit={handleBuySubmit}
        />
      )}

      <Footer />
    </div>
  );
}
