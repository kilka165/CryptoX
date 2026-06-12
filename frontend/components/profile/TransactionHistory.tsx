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
  Wallet,
  Users,
  Coins,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

type TxKind =
  | "buy"
  | "sell"
  | "deposit"
  | "withdraw"
  | "p2p_buy"
  | "p2p_sell"
  | "staking";

interface StakingMeta {
  days: number;
  apr: number;
  profit: number;
  progress?: number;
  started_at?: string | null;
  ends_at?: string | null;
  claimed_at?: string | null;
}

interface Transaction {
  // id уникален в пределах смешанной ленты (tx-… / p2p-… / stk-…), поэтому строка.
  id: string;
  kind: TxKind;
  status: "completed" | "pending" | "failed" | "active" | "cancelled";
  amount: number;
  price_usd: number;
  total_usd: number;
  // coin — id монеты (name актива), symbol — её тикер (бывает «битый»).
  coin: string | null;
  symbol?: string | null;
  fee?: number;
  // Пополнение/вывод: маска карты 3333********3333.
  card_mask?: string | null;
  // P2P: контрагент и роль.
  counterparty?: string | null;
  role?: "buyer" | "seller";
  fiat_amount?: number;
  fiat_currency?: string;
  // Стейкинг: дни/APR/прибыль/прогресс.
  staking?: StakingMeta | null;
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

type FilterValue =
  | "all"
  | "buy"
  | "sell"
  | "deposit"
  | "withdraw"
  | "p2p"
  | "staking";

// Колонки, по которым доступна сортировка (значения совпадают с бэкендом).
type SortKey = "type" | "asset" | "amount" | "price" | "total" | "date";

const CASH_KINDS: TxKind[] = ["deposit", "withdraw"];
const INCOMING_KINDS: TxKind[] = ["deposit", "sell", "p2p_sell"];

export function TransactionHistory({ userCurrency = "USD" }: TransactionHistoryProps) {
  const { t, i18n } = useTranslation();
  const { getRate } = useRates();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  // Сортировка: null — по умолчанию (бэкенд отдаёт по дате убыванием).
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  // Транзакция, открытая в модалке с подробностями (null — модалка закрыта).
  const [selected, setSelected] = useState<Transaction | null>(null);

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

  // Закрытие модалки по Escape.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  useEffect(() => {
    loadTransactions(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search, currentPage, sortKey, sortDir]);

  const loadTransactions = async (page: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const params: Record<string, string | number> = { page };
      if (filter !== "all") params.type = filter;
      if (search) params.search = search;
      if (sortKey) {
        params.sort = sortKey;
        params.dir = sortDir;
      }

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

  const exchangeRate = getRate(userCurrency);
  const currencySymbol = getCurrencySymbol(userCurrency);

  // USD -> валюта пользователя, форматированная строка с символом.
  const money = (usd: number) => {
    const v = Number(usd) * exchangeRate;
    return `${currencySymbol}${v.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: v < 1 ? 6 : 2,
    })}`;
  };

  // Количество монеты без хвостовых нулей (до 8 знаков).
  const fmtAmount = (n: number) =>
    Number(n).toLocaleString("en-US", { maximumFractionDigits: 8 });

  const isCash = (k: TxKind) => CASH_KINDS.includes(k);

  // Правильные символ/иконка монеты по id или тикеру.
  const coinView = (tx: Transaction) => {
    const idKey = (tx.coin || "").toLowerCase();
    const symKey = (tx.symbol || "").toLowerCase();
    const resolved = coinMap[idKey] || coinMap[symKey];
    const symbol = (resolved?.symbol || tx.symbol || tx.coin || "").toUpperCase();
    const name = tx.coin || "";
    return { resolved, symbol, name };
  };

  const renderIcon = (tx: Transaction, sizeClass: string) => {
    if (isCash(tx.kind)) {
      return (
        <div
          className={`${sizeClass} rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0`}
        >
          <Wallet size={14} className="text-blue-500" />
        </div>
      );
    }
    const { resolved, symbol } = coinView(tx);
    if (!resolved) {
      return (
        <div
          className={`${sizeClass} rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold uppercase shrink-0`}
        >
          {symbol.slice(0, 3)}
        </div>
      );
    }
    return <CoinIcon src={resolved.image} symbol={resolved.symbol} className={sizeClass} />;
  };

  const getTypeLabel = (kind: TxKind) => {
    const labels: Record<TxKind, string> = {
      buy: t("profile.history.typeBuy"),
      sell: t("profile.history.typeSell"),
      deposit: t("profile.history.typeDeposit"),
      withdraw: t("profile.history.typeWithdraw"),
      p2p_buy: t("profile.history.typeP2pBuy"),
      p2p_sell: t("profile.history.typeP2pSell"),
      staking: t("profile.history.typeStaking"),
    };
    return labels[kind] || kind;
  };

  const getTypeIcon = (kind: TxKind) => {
    switch (kind) {
      case "buy":
        return <ArrowDownLeft size={16} className="text-green-500" />;
      case "sell":
        return <ArrowUpRight size={16} className="text-red-500" />;
      case "deposit":
        return <Wallet size={16} className="text-blue-400" />;
      case "withdraw":
        return <ArrowUpRight size={16} className="text-blue-400" />;
      case "p2p_buy":
        return <Users size={16} className="text-green-500" />;
      case "p2p_sell":
        return <Users size={16} className="text-red-500" />;
      case "staking":
        return <Coins size={16} className="text-amber-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = (kind: TxKind) => {
    switch (kind) {
      case "buy":
        return "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50";
      case "sell":
        return "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50";
      case "deposit":
      case "withdraw":
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50";
      case "p2p_buy":
      case "p2p_sell":
        return "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50";
      case "staking":
        return "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent";
    }
  };

  // Бейдж статуса — только для незавершённых операций.
  const renderStatusBadge = (status: Transaction["status"]) => {
    if (status === "completed") return null;
    const map: Record<string, { label: string; cls: string }> = {
      pending: {
        label: t("profile.history.statusPending"),
        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
      active: {
        label: t("profile.history.statusActive"),
        cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      cancelled: {
        label: t("profile.history.statusCancelled"),
        cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
      failed: {
        label: t("profile.history.statusCancelled"),
        cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    };
    const m = map[status];
    if (!m) return null;
    return (
      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${m.cls}`}>
        {m.label}
      </span>
    );
  };

  // Читаемое описание операции (что/сколько/курс/контрагент/карта/стейкинг).
  const buildDescription = (tx: Transaction) => {
    const { symbol } = coinView(tx);
    const amount = fmtAmount(tx.amount);
    const price = money(tx.price_usd);

    switch (tx.kind) {
      case "buy":
        return t("profile.history.descBuy", { amount, symbol, price });
      case "sell":
        return t("profile.history.descSell", { amount, symbol, price });
      case "deposit":
        return tx.card_mask
          ? t("profile.history.descDepositCard", { amount: money(tx.amount), card: tx.card_mask })
          : t("profile.history.descDeposit", { amount: money(tx.amount) });
      case "withdraw":
        return tx.card_mask
          ? t("profile.history.descWithdrawCard", { amount: money(tx.amount), card: tx.card_mask })
          : t("profile.history.descWithdraw", { amount: money(tx.amount) });
      case "p2p_buy":
        return t("profile.history.descP2pBuy", { amount, symbol, counterparty: tx.counterparty || "—" });
      case "p2p_sell":
        return t("profile.history.descP2pSell", { amount, symbol, counterparty: tx.counterparty || "—" });
      case "staking":
        return t("profile.history.descStaking", {
          amount,
          symbol,
          days: tx.staking?.days ?? 0,
          apr: tx.staking?.apr ?? 0,
          profit: `+${fmtAmount(tx.staking?.profit ?? 0)} ${symbol}`,
        });
      default:
        return "";
    }
  };

  // Колонка «Итого»: знак, цвет и значение зависят от вида операции.
  const renderTotal = (tx: Transaction) => {
    if (tx.kind === "staking") {
      const { symbol } = coinView(tx);
      return (
        <span className="text-green-600 font-bold">
          +{fmtAmount(tx.staking?.profit ?? 0)} {symbol}
        </span>
      );
    }
    const incoming = INCOMING_KINDS.includes(tx.kind);
    return (
      <span className={`font-bold ${incoming ? "text-green-600" : "text-slate-900 dark:text-white"}`}>
        {incoming ? "+" : "-"}
        {money(tx.total_usd)}
      </span>
    );
  };

  const renderPrice = (tx: Transaction) => {
    if (isCash(tx.kind)) return <span className="text-slate-400">-</span>;
    if (tx.kind === "staking")
      return <span className="font-medium">{tx.staking?.apr ?? 0}%</span>;
    return <span className="font-medium">{money(tx.price_usd)}</span>;
  };

  const renderAmount = (tx: Transaction) => {
    if (isCash(tx.kind)) return <span className="text-slate-400">-</span>;
    return <span className="font-medium">{fmtAmount(tx.amount)}</span>;
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

  const statusText = (s: Transaction["status"]) => {
    const map: Record<string, string> = {
      completed: t("profile.history.statusCompleted"),
      pending: t("profile.history.statusPending"),
      active: t("profile.history.statusActive"),
      cancelled: t("profile.history.statusCancelled"),
      failed: t("profile.history.statusCancelled"),
    };
    return map[s] || s;
  };

  // Список «метка → значение» для модалки подробностей, зависит от вида операции.
  const detailRows = (tx: Transaction): { label: string; value: React.ReactNode; mono?: boolean }[] => {
    const { symbol, name } = coinView(tx);
    const cash = isCash(tx.kind);
    const rows: { label: string; value: React.ReactNode; mono?: boolean }[] = [];

    if (!cash) {
      rows.push({ label: t("profile.history.colAsset"), value: name ? `${symbol} · ${name}` : symbol });
      rows.push({ label: t("profile.history.colAmount"), value: `${fmtAmount(tx.amount)} ${symbol}` });
    } else {
      rows.push({ label: t("profile.history.colAmount"), value: money(tx.amount) });
    }

    if (tx.kind === "staking") {
      rows.push({ label: t("profile.history.apr"), value: `${tx.staking?.apr ?? 0}%` });
      rows.push({
        label: t("profile.history.lockPeriod"),
        value: (tx.staking?.days ?? 0) > 0
          ? t("profile.history.daysValue", { days: tx.staking?.days ?? 0 })
          : t("profile.history.flexible"),
      });
      rows.push({ label: t("profile.history.profit"), value: `+${fmtAmount(tx.staking?.profit ?? 0)} ${symbol}` });
      if (typeof tx.staking?.progress === "number") {
        rows.push({ label: t("profile.history.progress"), value: `${Math.round(tx.staking.progress)}%` });
      }
    } else if (!cash) {
      rows.push({ label: t("profile.history.colPrice"), value: money(tx.price_usd) });
    }

    if (tx.kind !== "staking") {
      rows.push({ label: t("profile.history.colTotal", { currency: currencySymbol }), value: money(tx.total_usd) });
    }

    if ((tx.fee ?? 0) > 0) {
      rows.push({ label: t("profile.history.fee"), value: money(tx.fee as number) });
    }

    if (tx.kind === "p2p_buy" || tx.kind === "p2p_sell") {
      rows.push({ label: t("profile.history.counterparty"), value: tx.counterparty || "—" });
      if (tx.role) {
        rows.push({
          label: t("profile.history.role"),
          value: tx.role === "buyer" ? t("profile.history.roleBuyer") : t("profile.history.roleSeller"),
        });
      }
      if (tx.fiat_amount != null && tx.fiat_currency) {
        rows.push({
          label: t("profile.history.fiatAmount"),
          value: `${tx.fiat_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${tx.fiat_currency}`,
        });
      }
    }

    if (cash && tx.card_mask) {
      rows.push({ label: t("profile.history.card"), value: tx.card_mask, mono: true });
    }

    if (tx.kind === "staking") {
      if (tx.staking?.started_at) rows.push({ label: t("profile.history.start"), value: formatDate(tx.staking.started_at) });
      rows.push({ label: t("profile.history.end"), value: tx.staking?.ends_at ? formatDate(tx.staking.ends_at) : "—" });
      if (tx.staking?.claimed_at) rows.push({ label: t("profile.history.claimed"), value: formatDate(tx.staking.claimed_at) });
    }

    rows.push({ label: t("profile.history.status"), value: statusText(tx.status) });
    rows.push({ label: t("profile.history.colDate"), value: formatDate(tx.created_at) });

    return rows;
  };

  // Сортировка в три такта: убывание → возрастание → сброс к умолчанию (по дате).
  const handleSort = (key: SortKey) => {
    setCurrentPage(1);
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir("asc");
    } else {
      setSortKey(null);
      setSortDir("desc");
    }
  };

  const sortIcon = (key: SortKey) =>
    sortKey !== key ? (
      <ChevronsUpDown className="w-3 h-3 opacity-40" />
    ) : sortDir === "desc" ? (
      <ChevronDown className="w-3 h-3" />
    ) : (
      <ChevronUp className="w-3 h-3" />
    );

  const sortHeader = (key: SortKey, label: string, align: "left" | "right" = "left") => (
    <th className={`pb-3 ${align === "right" ? "text-right" : ""} ${key === "type" ? "pl-2" : ""} ${key === "date" ? "pr-2" : ""}`}>
      <button
        type="button"
        onClick={() => handleSort(key)}
        className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        {label}
        {sortIcon(key)}
      </button>
    </th>
  );

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
                setFilter(e.target.value as FilterValue);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
            >
              <option value="all">{t("profile.history.allOps")}</option>
              <option value="buy">{t("profile.history.buys")}</option>
              <option value="sell">{t("profile.history.sells")}</option>
              <option value="deposit">{t("profile.history.deposits")}</option>
              <option value="withdraw">{t("profile.history.withdrawals")}</option>
              <option value="p2p">{t("profile.history.p2p")}</option>
              <option value="staking">{t("profile.history.staking")}</option>
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
                  {sortHeader("type", t("profile.history.colType"))}
                  {sortHeader("asset", t("profile.history.colAsset"))}
                  {sortHeader("amount", t("profile.history.colAmount"), "right")}
                  {sortHeader("price", t("profile.history.colPrice"), "right")}
                  {sortHeader("total", t("profile.history.colTotal", { currency: currencySymbol }), "right")}
                  {sortHeader("date", t("profile.history.colDate"), "right")}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const { symbol, name } = coinView(tx);
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelected(tx)}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 pl-2 align-top">
                        <div className="flex flex-col gap-1 items-start">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeColor(tx.kind)}`}>
                            {getTypeIcon(tx.kind)}
                            <span className="text-xs font-medium">{getTypeLabel(tx.kind)}</span>
                          </div>
                          {renderStatusBadge(tx.status)}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {renderIcon(tx, "w-6 h-6")}
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 dark:text-white uppercase">
                              {isCash(tx.kind) ? getTypeLabel(tx.kind) : symbol}
                            </div>
                            {!isCash(tx.kind) && name && (
                              <div className="text-xs text-slate-500 capitalize truncate max-w-[280px]">
                                {name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right">{renderAmount(tx)}</td>
                      <td className="py-3 text-right">{renderPrice(tx)}</td>
                      <td className="py-3 text-right">{renderTotal(tx)}</td>
                      <td className="py-3 text-right pr-2 text-xs text-slate-500 whitespace-nowrap align-top">
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
              const { symbol, name } = coinView(tx);
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelected(tx)}
                  className="rounded-xl border border-slate-300 dark:border-slate-800 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeColor(tx.kind)}`}>
                        {getTypeIcon(tx.kind)}
                        <span className="text-xs font-medium">{getTypeLabel(tx.kind)}</span>
                      </div>
                      {renderStatusBadge(tx.status)}
                    </div>
                    <div className="text-right whitespace-nowrap">{renderTotal(tx)}</div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {renderIcon(tx, "w-6 h-6")}
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 dark:text-white uppercase text-sm">
                        {isCash(tx.kind) ? getTypeLabel(tx.kind) : symbol}
                      </div>
                      {!isCash(tx.kind) && name && (
                        <div className="text-xs text-slate-500 capitalize truncate">{name}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                    {!isCash(tx.kind) && (
                      <>
                        <span className="text-slate-500 dark:text-slate-400">{t("profile.history.colAmount")}</span>
                        <span className="text-right break-all">{fmtAmount(tx.amount)}</span>

                        <span className="text-slate-500 dark:text-slate-400">
                          {tx.kind === "staking" ? t("profile.history.apr") : t("profile.history.colPrice")}
                        </span>
                        <span className="text-right">
                          {tx.kind === "staking" ? `${tx.staking?.apr ?? 0}%` : money(tx.price_usd)}
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

      {/* Модалка с подробностями операции (клик по любой области строки/карточки). */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#131416] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeColor(selected.kind)}`}>
                  {getTypeIcon(selected.kind)}
                  <span className="text-xs font-medium">{getTypeLabel(selected.kind)}</span>
                </div>
                {renderStatusBadge(selected.status)}
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label={t("profile.history.close")}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                {renderIcon(selected, "w-10 h-10")}
                <div className="min-w-0">
                  <div className="font-semibold uppercase">
                    {isCash(selected.kind) ? getTypeLabel(selected.kind) : coinView(selected).symbol}
                  </div>
                  <div className="text-sm text-slate-500">{buildDescription(selected)}</div>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {detailRows(selected).map((r, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                    <span className="text-slate-500 dark:text-slate-400 shrink-0">{r.label}</span>
                    <span className={`text-right font-medium break-all ${r.mono ? "font-mono tracking-wide" : ""}`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
