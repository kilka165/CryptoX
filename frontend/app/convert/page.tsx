"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowUpDown, CheckCircle, X, ChevronDown, AlertTriangle } from "lucide-react";
import {
  CurrencySelectModal,
  CurrencyItem,
} from "@/components/convert/CurrencySelectModal";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

interface UserAsset {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  logo_url: string | null;
}

interface SelectedCoin {
  coin: Coin;
  amount: string;
}

export default function ConvertPage() {
  const router = useRouter();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [userAssets, setUserAssets] = useState<UserAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState<string>("USD");

  const [fromCoins, setFromCoins] = useState<SelectedCoin[]>([]);
  const [toCoin, setToCoin] = useState<Coin | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [pickerTarget, setPickerTarget] = useState<"from" | "to" | "add-from" | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        
        // Загружаем настройки пользователя для получения валюты
        if (token) {
          try {
            const settingsRes = await axios.get("http://127.0.0.1:8000/api/user/settings", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserCurrency(settingsRes.data.currency || "USD");
          } catch (e) {
            console.error("Ошибка загрузки настроек:", e);
          }
        }

        const res = await axios.get<Coin[]>(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: userCurrency.toLowerCase(),
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(res.data);

        if (token) {
          const assetsRes = await axios.get<UserAsset[]>(
            "http://127.0.0.1:8000/api/user/assets",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserAssets(assetsRes.data);

          if (assetsRes.data.length > 0) {
            const firstAsset = assetsRes.data[0];
            const matchCoin = res.data.find((c) => c.id === firstAsset.name);
            if (matchCoin) {
              setFromCoins([{ coin: matchCoin, amount: "" }]);
            }
          }

          setToCoin(res.data[1]);
        }
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const allCoinsAsItems: CurrencyItem[] = coins.map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    image: c.image,
  }));

  const fromCoinsAsItems: CurrencyItem[] = userAssets
    .map((asset) => {
      const coin = coins.find((c) => c.id === asset.name);
      if (!coin) return null;
      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
      } as CurrencyItem;
    })
    .filter(Boolean) as CurrencyItem[];

  const availableFromCoins = fromCoinsAsItems.filter(
    (c) => !fromCoins.some((fc) => fc.coin.id === c.id)
  );

  const modalCoins =
    pickerTarget === "from" || pickerTarget === "add-from"
      ? fromCoinsAsItems
      : allCoinsAsItems;

  const openPicker = (target: "from" | "to", index?: number) => {
    setPickerTarget(target);
    setEditingIndex(index ?? null);
  };

  const openAddFromPicker = () => {
    if (fromCoins.length >= 5) return;
    if (availableFromCoins.length === 0) return;
    setPickerTarget("add-from");
    setEditingIndex(null);
  };

  const removeFromCoin = (index: number) => {
    setFromCoins(fromCoins.filter((_, i) => i !== index));
  };

  const updateFromAmount = (index: number, value: string) => {
    const updated = [...fromCoins];
    updated[index].amount = value.replace(/[^0-9.,]/g, "");
    setFromCoins(updated);
  };

  const handleCoinSelect = (selectedItem: CurrencyItem) => {
    const coin = coins.find((c) => c.id === selectedItem.id);
    if (!coin) return;

    if (pickerTarget === "from" && editingIndex !== null) {
      const updated = [...fromCoins];
      updated[editingIndex].coin = coin;
      setFromCoins(updated);
    } else if (pickerTarget === "add-from") {
      if (!fromCoins.some((fc) => fc.coin.id === coin.id)) {
        setFromCoins([...fromCoins, { coin, amount: "" }]);
      }
    } else if (pickerTarget === "to") {
      setToCoin(coin);
    }

    setPickerTarget(null);
    setEditingIndex(null);
  };

  const validateBalances = () => {
    const errors: boolean[] = [];
    
    for (const fc of fromCoins) {
      const val = parseFloat(fc.amount.replace(",", ".")) || 0;
      const asset = userAssets.find((a) => a.name === fc.coin.id);
      const balance = asset ? asset.amount : 0;
      errors.push(val > balance || val <= 0);
    }
    
    return errors;
  };

  const balanceErrors = validateBalances();
  const hasBalanceError = balanceErrors.some((e) => e);

  // Общая сумма в выбранной пользователем валюте
  const totalInUserCurrency = fromCoins.reduce((sum, fc) => {
    const val = parseFloat(fc.amount.replace(",", ".")) || 0;
    return sum + val * fc.coin.current_price;
  }, 0);

  const calculatedToAmount = toCoin ? totalInUserCurrency / toCoin.current_price : 0;

  const toBalance = toCoin
    ? userAssets.find((a) => a.name === toCoin.id)?.amount || 0
    : 0;

  const handleSwapSubmit = async () => {
    if (fromCoins.length === 0 || !toCoin) {
      alert("Выберите монеты для обмена");
      return;
    }

    const fromData = fromCoins.map((fc) => ({
      coin_id: fc.coin.id,
      amount: parseFloat(fc.amount.replace(",", ".")) || 0,
    }));

    for (const fd of fromData) {
      const asset = userAssets.find((a) => a.name === fd.coin_id);
      if (!asset || asset.amount < fd.amount) {
        alert(`Недостаточно ${fd.coin_id}`);
        return;
      }
    }

    setIsSwapping(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Необходима авторизация");
        router.push("/login");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/trade/multi-swap",
        {
          from_coins: fromData,
          to_coins: [{ coin_id: toCoin.id, weight: 1 }],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const assetsRes = await axios.get<UserAsset[]>(
        "http://127.0.0.1:8000/api/user/assets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserAssets(assetsRes.data);

      setSwapSuccess(true);
      setTimeout(() => {
        setSwapSuccess(false);
        setFromCoins([]);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Ошибка обмена. Попробуйте позже."
      );
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Конвертация валют
          </h1>
          <p className="text-sm text-slate-400">
            Обменивайте несколько монет одновременно в одну целевую валюту
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {error && (
            <p className="text-sm text-red-400 mb-3 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-5 space-y-4">
            {loading ? (
              <div className="h-40 animate-pulse bg-slate-800 rounded-xl" />
            ) : (
              <>
                {/* ИЗ */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Из (макс. 5)</span>
                    {fromCoins.length < 5 && availableFromCoins.length > 0 && (
                      <button
                        type="button"
                        onClick={openAddFromPicker}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        + Добавить монету
                      </button>
                    )}
                  </div>

                  {fromCoins.map((fc, idx) => {
                    const asset = userAssets.find((a) => a.name === fc.coin.id);
                    const balance = asset ? asset.amount : 0;
                    const inputAmount = parseFloat(fc.amount.replace(",", ".")) || 0;
                    const hasError = balanceErrors[idx];

                    return (
                      <div key={idx} className="space-y-1">
                        <div
                          className={`flex items-center gap-2 bg-slate-950 rounded-xl px-3 py-3 border ${
                            hasError
                              ? "border-red-500/50 bg-red-950/20"
                              : "border-slate-700"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => openPicker("from", idx)}
                            className="flex items-center gap-2 hover:bg-slate-800 rounded-lg px-2 py-1"
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[11px] font-bold">
                              {fc.coin.symbol.slice(0, 3).toUpperCase()}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-semibold">
                                {fc.coin.symbol.toUpperCase()}
                              </span>
                              <span className="text-xs text-slate-400">
                                Баланс: {balance.toFixed(8)}
                              </span>
                            </div>
                            <ChevronDown size={14} className="text-slate-500" />
                          </button>
                          <input
                            type="text"
                            placeholder="0.00"
                            value={fc.amount}
                            onChange={(e) => updateFromAmount(idx, e.target.value)}
                            className={`flex-1 bg-transparent text-right text-sm font-semibold outline-none ${
                              hasError ? "text-red-400" : ""
                            }`}
                          />
                          {fromCoins.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFromCoin(idx)}
                              className="text-slate-500 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        
                        {hasError && inputAmount > 0 && (
                          <div className="flex items-center gap-1 text-xs text-red-400 px-3">
                            <AlertTriangle size={12} />
                            <span>
                              Недостаточно средств
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Переключатель */}
                <div className="flex justify-center">
                  <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
                    <ArrowUpDown size={16} />
                  </div>
                </div>

                {/* В (одна монета) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">В</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 rounded-xl px-3 py-4 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => openPicker("to")}
                      className="flex items-center gap-2 hover:bg-slate-800 rounded-lg px-2 py-1"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[11px] font-bold">
                        {toCoin
                          ? toCoin.symbol.slice(0, 3).toUpperCase()
                          : "?"}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold">
                          {toCoin ? toCoin.symbol.toUpperCase() : "Выберите"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {toCoin?.name || ""}
                        </span>
                      </div>
                      <ChevronDown size={14} className="text-slate-500" />
                    </button>

                    <span className="flex-1 text-right text-lg font-semibold text-slate-400">
                      ≈ {calculatedToAmount.toFixed(8)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-400 text-center">
                  Общая сумма обмена: ≈{" "}
                  <span className="text-slate-200 font-semibold">
                    {totalInUserCurrency.toFixed(2)} {userCurrency}
                  </span>
                </div>

                {/* Курсы для всех монет */}
                {toCoin && fromCoins.length > 0 && (
                  <div className="space-y-1">
                    {fromCoins.map((fc, idx) => (
                      <div key={idx} className="text-xs text-slate-500 flex justify-between px-1">
                        <span>
                          1 {fc.coin.symbol.toUpperCase()} ≈{" "}
                          {(fc.coin.current_price / toCoin.current_price).toFixed(8)}{" "}
                          {toCoin.symbol.toUpperCase()}
                        </span>
                        <span>
                          1 {toCoin.symbol.toUpperCase()} ≈{" "}
                          {(toCoin.current_price / fc.coin.current_price).toFixed(8)}{" "}
                          {fc.coin.symbol.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSwapSubmit}
                  disabled={
                    fromCoins.length === 0 ||
                    !toCoin ||
                    isSwapping ||
                    totalInUserCurrency === 0 ||
                    hasBalanceError
                  }
                  className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  {swapSuccess ? (
                    <>
                      <CheckCircle size={18} />
                      Обмен успешен!
                    </>
                  ) : isSwapping ? (
                    "Обмениваем..."
                  ) : (
                    "Обменять"
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <CurrencySelectModal
          open={pickerTarget !== null}
          onClose={() => {
            setPickerTarget(null);
            setEditingIndex(null);
          }}
          coins={modalCoins}
          onSelect={handleCoinSelect}
        />
      </main>

      <Footer />
    </div>
  );
}
