"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "@/lib/config";
import { Coin } from "@/types/coin";
import { useRates } from "@/components/RatesProvider";
import { useFees } from "@/lib/fees";
import { useTranslation } from "react-i18next";
import { AUTH_EVENT, getAuthToken } from "@/lib/auth";

const formatInputAmount = (value: string) => {
  if (!value) return "";
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const cleanInputAmount = (value: string) => value.replace(/,/g, "");

const trimZeros = (s: string) => {
  if (!s.includes(".")) return s;
  return s.replace(/0+$/, "").replace(/\.$/, "");
};

export type TradeMode = "buy" | "sell";

interface OwnedAsset {
  name: string; // coin_id (совпадает с Coin.id)
  symbol: string;
  amount: number;
}

// Логика торговли криптой (валюта/баланс/активы пользователя, двусторонняя
// конвертация суммы↔крипты, отправка ордеров на покупку и продажу). Вынесена из
// страницы рынка, чтобы переиспользовать её на странице монеты /market/[coinId]
// вместе с BuyModal (модалка с вкладками «Покупка»/«Продажа»).
export function useBuyFlow() {
  const { t } = useTranslation();
  const { getRate } = useRates();
  const { trade: tradeRate } = useFees();

  const [userCurrency, setUserCurrency] = useState<string>("USD");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [assets, setAssets] = useState<OwnedAsset[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Реактивно отслеживаем авторизацию, чтобы модалка покупки показывала
  // «войдите в аккаунт» вместо «недостаточно средств» для гостя.
  useEffect(() => {
    const sync = () => setIsAuthenticated(!!getAuthToken());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [mode, setMode] = useState<TradeMode>("buy");

  // Поля покупки
  const [displayAmount, setDisplayAmount] = useState("");
  const [displayCryptoAmount, setDisplayCryptoAmount] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  // Поля продажи
  const [sellCryptoAmount, setSellCryptoAmount] = useState("");
  const [sellFiatAmount, setSellFiatAmount] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);

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
        const list = Array.isArray(res.data.assets) ? res.data.assets : [];
        setAssets(
          list.map((a: any) => ({
            name: a.name,
            symbol: a.symbol,
            amount: Number(a.amount) || 0,
          }))
        );
      })
      .catch((e) => console.error(e));
  }, []);

  const exchangeRate = getRate(userCurrency);
  // Цена единицы выбранной монеты в валюте пользователя (для конвертации полей).
  const priceInUserCurrency = (selectedCoin?.current_price ?? 0) * exchangeRate;

  // Сколько выбранной монеты на балансе пользователя (для лимита продажи).
  const ownedAmount = selectedCoin
    ? assets.find((a) => a.name === selectedCoin.id)?.amount ?? 0
    : 0;

  // Локальное обновление активов после сделки — без повторного запроса /user.
  const upsertAsset = (coinId: string, symbol: string, delta: number) => {
    setAssets((prev) => {
      const idx = prev.findIndex((a) => a.name === coinId);
      if (idx === -1) {
        return delta > 0 ? [...prev, { name: coinId, symbol, amount: delta }] : prev;
      }
      const next = [...prev];
      next[idx] = { ...next[idx], amount: Math.max(0, next[idx].amount + delta) };
      return next;
    });
  };

  // ---------- Покупка ----------
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

      await axios.post(
        `${API_BASE}/trade/buy`,
        { coin_id: selectedCoin.id, amount: cryptoAmountToBuy, price_usd: coinPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserBalance((prev) => prev - amountInUSD * (1 + tradeRate));
      upsertAsset(selectedCoin.id, selectedCoin.symbol.toUpperCase(), cryptoAmountToBuy);
      setBuySuccess(true);
      setTimeout(() => {
        setBuySuccess(false);
        setSelectedCoin(null);
        setDisplayAmount("");
        setDisplayCryptoAmount("");
      }, 2000);
    } catch (error: any) {
      console.error("Ошибка покупки:", error.response?.data ?? error);
      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          t("market.buyError")
      );
    } finally {
      setIsBuying(false);
    }
  };

  const amountUserEntered = parseFloat(cleanInputAmount(displayAmount) || "0") || 0;
  const calculatedUSD = amountUserEntered / exchangeRate;
  const maxBalanceInUserCurrency = userBalance * exchangeRate;

  // «Макс»: сколько можно потратить на покупку (база, без комиссии).
  // Бэкенд округляет комиссию вверх до центов USD (round), из-за чего фактическое
  // списание бывает на доли цента больше «точного». Оставляем ~1 цент USD запаса
  // (в валюте пользователя) и округляем базу ВНИЗ до копейки, иначе при «Макс»
  // сервер отвечает «Недостаточно средств на балансе».
  const onSetMax = () => onSetBuyPercent(1);

  // Доля баланса на покупку (25/50/75/100%). 100% == «Макс»: учитывает запас на
  // округление комиссии бэкендом и округляет базу вниз до копейки.
  const onSetBuyPercent = (pct: number) => {
    const feeRoundingBuffer = 0.01 * exchangeRate; // ~1 цент USD в валюте пользователя
    const maxBase = (maxBalanceInUserCurrency - feeRoundingBuffer) / (1 + tradeRate);
    const base = Math.max(0, maxBase) * pct;
    handleInputChange((Math.floor(base * 100) / 100).toFixed(2));
  };

  // ---------- Продажа ----------
  const handleSellCryptoChange = (raw: string) => {
    let val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setSellCryptoAmount(val);

    const n = parseFloat(val || "0");
    if (priceInUserCurrency > 0 && n > 0) {
      setSellFiatAmount((n * priceInUserCurrency).toFixed(2));
    } else {
      setSellFiatAmount("");
    }
  };

  const handleSellFiatChange = (raw: string) => {
    let val = raw.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setSellFiatAmount(val);

    const n = parseFloat(val || "0");
    if (priceInUserCurrency > 0 && n > 0) {
      setSellCryptoAmount(trimZeros((n / priceInUserCurrency).toFixed(8)));
    } else {
      setSellCryptoAmount("");
    }
  };

  const onSetSellPercent = (pct: number) => {
    const crypto = ownedAmount * pct;
    setSellCryptoAmount(trimZeros(crypto.toFixed(8)));
    setSellFiatAmount(priceInUserCurrency > 0 ? (crypto * priceInUserCurrency).toFixed(2) : "");
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;

    const amount = parseFloat(sellCryptoAmount || "0");
    if (!amount || amount <= 0) return;
    if (amount > ownedAmount) {
      alert(t("common.insufficientFunds"));
      return;
    }

    setIsSelling(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert(t("common.authRequired"));
        window.location.href = "/login";
        return;
      }

      const coinPrice = selectedCoin.current_price;

      await axios.post(
        `${API_BASE}/trade/sell`,
        { coin_id: selectedCoin.id, amount, price_usd: coinPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Выручка в USD за вычетом комиссии — для мгновенного обновления баланса.
      setUserBalance((prev) => prev + amount * coinPrice * (1 - tradeRate));
      upsertAsset(selectedCoin.id, selectedCoin.symbol.toUpperCase(), -amount);
      setSellSuccess(true);
      setTimeout(() => {
        setSellSuccess(false);
        setSelectedCoin(null);
        setSellCryptoAmount("");
        setSellFiatAmount("");
      }, 2000);
    } catch (error: any) {
      console.error("Ошибка продажи:", error.response?.data ?? error);
      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          t("market.buyError")
      );
    } finally {
      setIsSelling(false);
    }
  };

  const resetFields = () => {
    setDisplayAmount("");
    setDisplayCryptoAmount("");
    setSellCryptoAmount("");
    setSellFiatAmount("");
  };

  const openBuy = (coin: Coin) => {
    setSelectedCoin(coin);
    setMode("buy");
    resetFields();
  };
  const openSell = (coin: Coin) => {
    setSelectedCoin(coin);
    setMode("sell");
    resetFields();
  };
  const closeBuy = () => {
    setSelectedCoin(null);
    resetFields();
  };

  return {
    userCurrency,
    userBalance,
    exchangeRate,
    isAuthenticated,
    selectedCoin,
    mode,
    setMode,

    // покупка
    displayAmount,
    displayCryptoAmount,
    isBuying,
    buySuccess,
    amountUserEntered,
    calculatedUSD,
    maxBalanceInUserCurrency,
    handleInputChange,
    handleCryptoInputChange,
    handleBuySubmit,
    onSetMax,
    onSetBuyPercent,

    // продажа
    ownedAmount,
    sellCryptoAmount,
    sellFiatAmount,
    isSelling,
    sellSuccess,
    handleSellCryptoChange,
    handleSellFiatChange,
    onSetSellPercent,
    handleSellSubmit,

    // общие
    openBuy,
    openSell,
    closeBuy,
  };
}
