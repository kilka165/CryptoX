"use client";

import { CoinIcon } from "@/components/market/CoinIcon";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BinanceAPI } from "@/lib/api/binance";
import { getCurrencySymbol } from "@/lib/currencies";
import { useTranslation } from "react-i18next";
import { useRates } from "@/components/RatesProvider";
import { intlLocale } from "@/lib/utils/locale";
import { API_BASE } from "@/lib/config";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader, 
  ChevronLeft, 
  ChevronRight,
  Filter, 
  Wallet
} from "lucide-react";

interface Transaction {
  id: number;
  type: "buy" | "sell" | "deposit" | "withdraw";
  status: "completed" | "pending" | "failed";
  amount: number;
  price_usd: number;
  total_usd: number;
  description: string;
  // Сохраняется на бэке при создании транзакции — нужен, чтобы история не теряла
  // название монеты, если актив пользователь полностью продал и его строка удалена.
  coin: string | null;
  asset: {
    symbol: string;
    name: string;
    logo_url?: string | null;
  } | null;
  created_at: string;
}

interface TransactionResponse {
  data: Transaction[];
  current_page: number;
  last_page: number;
  total: number;
}

interface TransactionHistoryProps {
  userCurrency?: string;
}

export function TransactionHistory({ userCurrency = "USD" }: TransactionHistoryProps) {
  const { t, i18n } = useTranslation();
  const { getRate } = useRates();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buy" | "sell" | "deposit" | "withdraw">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Карта монет (id/символ -> правильный символ и картинка),
  // т.к. в транзакциях символ актива бывает «битый» (BIT вместо BTC).
  const [coinMap, setCoinMap] = useState<Record<string, { symbol: string; image: string }>>({});

  useEffect(() => {
    let active = true;
    BinanceAPI.get24hPrices().then((coins) => {
      if (!active) return;
      const map: Record<string, { symbol: string; image: string }> = {};
      coins.forEach((c) => {
        const entry = { symbol: c.symbol, image: c.image };
        map[c.id.toLowerCase()] = entry;
        map[c.symbol.toLowerCase()] = entry;
      });
      setCoinMap(map);
    });
    return () => {
      active = false;
    };
  }, []);

  // Иконка транзакции: ищем монету по id (name актива) или символу.
  // Пока монеты не загружены — нейтральная текстовая заглушка, без чужого логотипа.
  const renderTxIcon = (tx: Transaction, sizeClass: string) => {
    const idKey = (tx.asset?.name || tx.coin || "").toLowerCase();
    const symKey = (tx.asset?.symbol || "").toLowerCase();
    const coin = coinMap[idKey] || coinMap[symKey];
    const letters = (tx.asset?.symbol || tx.coin || "").slice(0, 3).toUpperCase();

    if (!coin) {
      return (
        <div
          className={`${sizeClass} rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase shrink-0`}
        >
          {letters}
        </div>
      );
    }

    return (
      <CoinIcon src={coin.image} symbol={coin.symbol} className={sizeClass} />
    );
  };

  useEffect(() => {
    loadTransactions(currentPage);
  }, [filter, search, currentPage]);

  const loadTransactions = async (page: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
          setLoading(false);
          return;
      }

      const params: any = { page };
      if (filter !== "all") params.type = filter;
      if (search) params.search = search;

      const response = await axios.get<TransactionResponse>(
        `${API_BASE}/transactions/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setTransactions(response.data.data);
      setTotalPages(response.data.last_page);
      
      if (page > response.data.last_page && response.data.last_page > 0) {
          setCurrentPage(1);
      }
      
    } catch (error) {
      console.error("Error loading history", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      buy: t("profile.history.typeBuy"),
      sell: t("profile.history.typeSell"),
      deposit: t("profile.history.typeDeposit"),
      withdraw: t("profile.history.typeWithdraw"),
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <ArrowDownLeft size={16} className="text-green-500" />;
      case "deposit":
        return <Wallet size={16} className="text-blue-400" />;
      case "sell":
        return <ArrowUpRight size={16} className="text-red-500" />;  
      case "withdraw":
        return <ArrowUpRight size={16} className="text-blue-400" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "buy":
        return "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50";
      case "deposit":
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50";
      case "sell":
        return "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50";
      case "withdraw":
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(intlLocale(i18n.language), {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exchangeRate = getRate(userCurrency);
  const currencySymbol = getCurrencySymbol(userCurrency);

  return (
    <div className="bg-white dark:bg-[#131416] rounded-2xl shadow-sm border border-slate-300 dark:border-slate-800 p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">{t("profile.history.title")}</h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t("profile.history.searchPlaceholder")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
            >
              <option value="all">{t("profile.history.allOps")}</option>
              <option value="buy">{t("profile.history.buys")}</option>
              <option value="sell">{t("profile.history.sells")}</option>
              <option value="deposit">{t("profile.history.deposits")}</option>
              <option value="withdraw">{t("profile.history.withdrawals")}</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
        </div>
      ) : transactions.length > 0 ? (
        <>
          {/* Десктоп: таблица */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 text-left">
                  <th className="pb-3 pl-2">{t("profile.history.colType")}</th>
                  <th className="pb-3">{t("profile.history.colAsset")}</th>
                  <th className="pb-3 text-right">{t("profile.history.colAmount")}</th>
                  <th className="pb-3 text-right">{t("profile.history.colPrice")}</th>
                  <th className="pb-3 text-right">{t("profile.history.colTotal", { currency: getCurrencySymbol(userCurrency) })}</th>
                  <th className="pb-3 text-right pr-2">{t("profile.history.colDate")}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const priceUSD = Number(tx.price_usd);
                  const totalUSD = Number(tx.total_usd);
                  const priceConverted = priceUSD * exchangeRate;
                  const totalConverted = totalUSD * exchangeRate;

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 pl-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeColor(tx.type)}`}>
                          {getTypeIcon(tx.type)}
                          <span className="text-xs font-medium">{getTypeLabel(tx.type)}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {(() => {
                          const symbol = tx.asset?.symbol
                            || (tx.coin ? tx.coin.slice(0, 4).toUpperCase() : "");
                          const name = tx.asset?.name || tx.coin || "";
                          if (!symbol && !name) {
                            return <span className="text-slate-400 text-xs">-</span>;
                          }
                          return (
                            <div className="flex items-center gap-2">
                              {renderTxIcon(tx, "w-6 h-6")}
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white uppercase">
                                  {symbol}
                                </div>
                                <div className="text-xs text-slate-500 capitalize">
                                  {name}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {tx.type === 'deposit' || tx.type === 'withdraw' ? (
                          <span className="text-slate-400">-</span>
                        ) : (
                          Number(tx.amount).toFixed(6)
                        )}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {tx.type === 'deposit' || tx.type === 'withdraw' ? (
                          <span className="text-slate-400">-</span> 
                        ) : (
                          `${currencySymbol}${priceConverted.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        )}
                      </td>
                      <td className={`py-3 text-right font-bold ${
                        tx.type === 'buy' || tx.type === 'withdraw' ? 'text-slate-900 dark:text-white' : 'text-green-600'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'sell' ? '+' : '-'}{currencySymbol}{totalConverted.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right pr-2 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(tx.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Мобильный/планшет: карточки */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
            {transactions.map((tx) => {
              const priceUSD = Number(tx.price_usd);
              const totalUSD = Number(tx.total_usd);
              const priceConverted = priceUSD * exchangeRate;
              const totalConverted = totalUSD * exchangeRate;
              const symbol = tx.asset?.symbol || (tx.coin ? tx.coin.slice(0, 4).toUpperCase() : "");
              const name = tx.asset?.name || tx.coin || "";
              const isCoinTx = tx.type !== "deposit" && tx.type !== "withdraw";

              return (
                <div
                  key={tx.id}
                  className="rounded-xl border border-slate-300 dark:border-slate-800 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeColor(tx.type)}`}>
                      {getTypeIcon(tx.type)}
                      <span className="text-xs font-medium">{getTypeLabel(tx.type)}</span>
                    </div>
                    <span className={`font-bold ${
                      tx.type === 'buy' || tx.type === 'withdraw' ? 'text-slate-900 dark:text-white' : 'text-green-600'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'sell' ? '+' : '-'}{currencySymbol}{totalConverted.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {(symbol || name) && (
                    <div className="flex items-center gap-2 mb-3">
                      {renderTxIcon(tx, "w-6 h-6")}
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white uppercase text-sm">{symbol}</div>
                        <div className="text-xs text-slate-500 capitalize truncate">{name}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                    {isCoinTx && (
                      <>
                        <span className="text-slate-500 dark:text-slate-400">{t("profile.history.colAmount")}</span>
                        <span className="text-right break-all">{Number(tx.amount).toFixed(6)}</span>

                        <span className="text-slate-500 dark:text-slate-400">{t("profile.history.colPrice")}</span>
                        <span className="text-right">
                          {currencySymbol}{priceConverted.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </>
                    )}
                    <span className="text-slate-500 dark:text-slate-400">{t("profile.history.colDate")}</span>
                    <span className="text-right text-xs text-slate-500">{formatDate(tx.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-sm text-slate-500">
                {t("market.pageOf", { page: currentPage, total: totalPages })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} /> {t("common.back")}
                </button>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  {t("common.next")} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="opacity-50" size={32} />
          </div>
          <p className="font-medium">{t("profile.history.empty")}</p>
        </div>
      )}
    </div>
  );
}
