"use client";

import { CryptoIcon } from "@/components/CryptoIcon";
import React, { useState, useEffect } from "react";
import axios from "axios";
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

// Функция конвертации валюты в символ
const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: "$",
    RUB: "₽",
    EUR: "€",
    KZT: "₸",
  };
  return symbols[currency] || currency;
};

// Функция конвертации из USD
const getExchangeRate = (currency: string): number => {
  const rates: Record<string, number> = {
    USD: 1,
    RUB: 90,
    EUR: 0.92,
    KZT: 450,
  };
  return rates[currency] || 1;
};

export function TransactionHistory({ userCurrency = "USD" }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buy" | "sell" | "deposit" | "withdraw">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

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
        "http://localhost:8000/api/transactions/history",
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
      console.error("Ошибка загрузки истории", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      buy: "Покупка",
      sell: "Продажа",
      deposit: "Пополнение",
      withdraw: "Вывод",
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
        return "bg-green-900/30 text-green-400 border border-green-900/50";
      case "deposit":
        return "bg-blue-900/30 text-blue-400 border border-blue-900/50";
      case "sell":
        return "bg-red-900/30 text-red-400 border border-red-900/50";
      case "withdraw":
        return "bg-blue-900/30 text-blue-400 border border-blue-900/50";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exchangeRate = getExchangeRate(userCurrency);
  const currencySymbol = getCurrencySymbol(userCurrency);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">История операций</h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по описанию..."
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
              <option value="all">Все операции</option>
              <option value="buy">Покупки</option>
              <option value="sell">Продажи</option>
              <option value="deposit">Пополнения</option>
              <option value="withdraw">Выводы</option>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 text-left">
                  <th className="pb-3 pl-2">Тип</th>
                  <th className="pb-3">Актив</th>
                  <th className="pb-3 text-right">Количество</th>
                  <th className="pb-3 text-right">Цена</th>
                  <th className="pb-3 text-right">Итого ({userCurrency})</th>
                  <th className="pb-3 text-right pr-2">Дата</th>
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
                        {tx.asset ? (
                          <div className="flex items-center gap-2">
                            <CryptoIcon
                              symbol={tx.asset.symbol}
                              logoUrl={tx.asset.logo_url}
                              size={24}
                            />
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white uppercase">
                                {tx.asset.symbol}
                              </div>
                              <div className="text-xs text-slate-500 capitalize">
                                {tx.asset.name}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
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

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-sm text-slate-500">
                Страница {currentPage} из {totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} /> Назад
                </button>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  Далее <ChevronRight size={16} />
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
          <p className="font-medium">История транзакций пуста</p>
        </div>
      )}
    </div>
  );
}
