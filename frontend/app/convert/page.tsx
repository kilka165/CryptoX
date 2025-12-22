"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
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
  name: string; // coin_id из CoinGecko (как в Asset::name)
  symbol: string;
  amount: number;
  logo_url: string | null;
}

const calcTargetAmount = (
  amountFrom: string,
  fromCoin: Coin | null,
  toCoin: Coin | null
) => {
  if (!fromCoin || !toCoin) return "0";
  const v = parseFloat(amountFrom.replace(",", "."));
  if (isNaN(v) || v <= 0) return "0";
  const usdValue = v * fromCoin.current_price;
  const targetAmount = usdValue / toCoin.current_price;
  return targetAmount.toLocaleString(undefined, {
    maximumFractionDigits: 8,
  });
};

export default function ConvertPage() {
  const router = useRouter();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [userAssets, setUserAssets] = useState<UserAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const [fromCoin, setFromCoin] = useState<Coin | null>(null);
  const [toCoin, setToCoin] = useState<Coin | null>(null);

  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("0");

  const [error, setError] = useState<string | null>(null);
  const [pickerTarget, setPickerTarget] = useState<"from" | "to" | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Монеты из CoinGecko
        const res = await axios.get<Coin[]>(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(res.data);
        setToCoin(res.data[1]);

        // 2. Активы пользователя из Laravel
        const token = localStorage.getItem("auth_token");
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
              setFromCoin(matchCoin);
            } else {
              setFromCoin(res.data[0]);
            }
          } else {
            setFromCoin(res.data[0]);
          }
        } else {
          setFromCoin(res.data[0]);
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

  useEffect(() => {
    setAmountTo(calcTargetAmount(amountFrom, fromCoin, toCoin));
  }, [amountFrom, fromCoin, toCoin]);

  const handleSwitch = () => {
    if (!fromCoin || !toCoin) return;
    const prev = fromCoin;
    setFromCoin(toCoin);
    setToCoin(prev);
  };

  // баланс выбранной монеты "Из"
  const fromAsset = fromCoin
    ? userAssets.find((a) => a.name === fromCoin.id)
    : undefined;
  const fromBalance = fromAsset ? fromAsset.amount : 0;

  const fromSymbol = fromCoin ? fromCoin.symbol.toUpperCase() : "...";
  const toSymbol = toCoin ? toCoin.symbol.toUpperCase() : "...";

  // ================== списки для модалки ==================

  // Все монеты (для выбора "В")
  const allCoinsAsItems: CurrencyItem[] = coins.map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    image: c.image,
  }));

  // Только монеты, которые есть у пользователя (для выбора "Из")
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

  const modalCoins =
    pickerTarget === "from" ? fromCoinsAsItems : allCoinsAsItems;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {/* back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100"
        >
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>

        {/* заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Convert: {fromSymbol} в {toSymbol}
          </h1>
          <p className="text-sm text-slate-400">
            Цена в реальном времени · Гарантированная цена · Любая пара
          </p>
        </div>

        {/* карточка конвертации */}
        <div className="max-w-2xl mx-auto">
          {error && (
            <p className="text-sm text-red-500 mb-3">
              {error}
            </p>
          )}

          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-5 space-y-4">
            {loading ? (
              <div className="h-40 animate-pulse bg-slate-800 rounded-xl" />
            ) : (
              <>
                {/* Из */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Из</span>
                    <span>
                      Доступный баланс ·
                      <span className="text-slate-200 ml-1">
                        {fromBalance.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}{" "}
                        {fromCoin?.symbol.toUpperCase() ?? ""}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-3 py-4 border border-slate-700 min-h-[72px]">
                    <button
                      type="button"
                      onClick={() => setPickerTarget("from")}
                      className="flex items-center gap-2 bg-slate-900 rounded-lg px-2 py-2 hover:bg-slate-800"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[11px] font-bold">
                        {(fromCoin?.symbol || "?")
                          .slice(0, 3)
                          .toUpperCase()}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold">
                          {fromCoin
                            ? fromCoin.symbol.toUpperCase()
                            : "Выберите монету"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {fromCoin?.name || ""}
                        </span>
                      </div>
                    </button>

                    <input
                      type="text"
                      placeholder="Введите сумму"
                      value={amountFrom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAmountFrom(
                          e.target.value.replace(/[^0-9.,]/g, "")
                        )
                      }
                      className="flex-1 bg-transparent text-right text-lg font-semibold outline-none"
                    />
                  </div>
                </div>

                {/* переключатель */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwitch}
                    className="h-9 w-9 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                  >
                    <ArrowUpDown size={16} />
                  </button>
                </div>

                {/* В */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>В</span>
                    <span>
                      Доступный баланс ·
                      <span className="text-slate-200 ml-1">
                        0 {toCoin?.symbol.toUpperCase() ?? ""}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 rounded-xl px-3 py-4 border border-slate-700 min-h-[72px]">
                    <button
                      type="button"
                      onClick={() => setPickerTarget("to")}
                      className="flex items-center gap-2 bg-slate-900 rounded-lg px-2 py-2 hover:bg-slate-800"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[11px] font-bold">
                        {(toCoin?.symbol || "?").slice(0, 3).toUpperCase()}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold">
                          {toCoin
                            ? toCoin.symbol.toUpperCase()
                            : "Выберите монету"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {toCoin?.name || ""}
                        </span>
                      </div>
                    </button>

                    <input
                      type="text"
                      readOnly
                      value={amountTo}
                      className="flex-1 bg-transparent text-right text-lg font-semibold text-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* курс */}
                {fromCoin && toCoin && (
                  <div className="text-xs text-slate-500 flex justify-between mt-2">
                    <span>
                      1 {fromCoin.symbol.toUpperCase()} ≈{" "}
                      {(
                        fromCoin.current_price / toCoin.current_price
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                      })}{" "}
                      {toCoin.symbol.toUpperCase()}
                    </span>
                    <span>
                      1 {toCoin.symbol.toUpperCase()} ≈{" "}
                      {(
                        toCoin.current_price / fromCoin.current_price
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                      })}{" "}
                      {fromCoin.symbol.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* кнопка обмена */}
                <button
                  type="button"
                  className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold py-3 rounded-xl disabled:opacity-40"
                  disabled={
                    !fromCoin ||
                    !toCoin ||
                    !amountFrom ||
                    parseFloat(amountFrom.replace(",", ".")) <= 0 ||
                    parseFloat(amountFrom.replace(",", ".")) > fromBalance
                  }
                  onClick={() => {
                    // сюда позже повесим запрос на Laravel /api/trade/swap
                    alert("Обмен пока как демо: логика свопа на backend ещё не подключена");
                  }}
                >
                  Обменять
                </button>
              </>
            )}
          </div>
        </div>

        {/* модальное окно выбора монеты */}
        <CurrencySelectModal
          open={pickerTarget !== null}
          onClose={() => setPickerTarget(null)}
          coins={modalCoins}
          onSelect={(coin) => {
            if (pickerTarget === "from") {
              const match = coins.find((c) => c.id === coin.id);
              if (match) setFromCoin(match);
            }
            if (pickerTarget === "to") {
              const match = coins.find((c) => c.id === coin.id);
              if (match) setToCoin(match);
            }
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
