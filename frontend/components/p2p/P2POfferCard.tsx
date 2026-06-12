// frontend/components/p2p/P2POfferCard.tsx
"use client";

import React, { useState } from "react";
import { P2POffer } from "@/lib/api/p2pApi";
import { TrendingUp, TrendingDown, CheckCircle, X, Eye, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_BASE } from "@/lib/config";
import { getCurrencySymbol } from "@/lib/currencies";
import { SellerAvatar } from "./SellerAvatar";

interface P2POfferCardProps {
  offer: P2POffer;
  currentUserId: number | null;
  tradeType: "buy" | "sell";
  onBuy: (offer: P2POffer) => void;
  onCancel?: (offerId: number) => void;
  onViewDetails?: (offer: P2POffer) => void;
}

export function P2POfferCard({
  offer,
  currentUserId,
  tradeType,
  onBuy,
  onCancel,
  onViewDetails
}: P2POfferCardProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isOwnOffer = currentUserId === offer.seller_id;

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("auth_token");
      await axios.delete(`${API_BASE}/p2p/offers/${offer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setShowCancelModal(false);
      
      if (onCancel) {
        onCancel(offer.id);
      }
    } catch (error) {
      console.error("Error canceling offer:", error);
      alert(t("p2p.offerCard.cancelError"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#131416] rounded-xl border border-slate-300 dark:border-slate-800 p-3 sm:p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          {/* Продавец */}
          <div className="flex-1 lg:min-w-[180px]">
            <div className="flex items-center gap-2 min-w-0">
              <SellerAvatar name={offer.seller_name} avatar={offer.seller_avatar} className="w-10 h-10 text-base" />
              <div className="min-w-0">
                <div className="font-medium flex items-center gap-2 min-w-0">
                  <span className="truncate">{offer.seller_name}</span>
                  {isOwnOffer && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded shrink-0">
                      {t("p2p.offerCard.myOffer")}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{t("p2p.offerCard.tradesCount", { n: offer.orders_count })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {offer.completion_rate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Цена и количество — в столбик на мобильном/планшете, в ряд на десктопе */}
          <div className="flex flex-col gap-2 lg:contents">
            {/* Цена */}
            <div className="flex-1 lg:min-w-[140px] min-w-0">
              <div className="text-base sm:text-lg font-bold break-words">
                {offer.price.toLocaleString()} {getCurrencySymbol(offer.currency)}
              </div>
              <div className="text-xs text-slate-500">
                {t("p2p.offerCard.per1", { crypto: offer.crypto_currency })}
              </div>
            </div>

            {/* Количество */}
            <div className="flex-1 lg:min-w-[140px] min-w-0">
              <div className="text-sm font-medium break-words">
                {offer.available_amount.toLocaleString()} {offer.crypto_currency}
              </div>
              <div className="text-xs text-slate-500">
                {t("p2p.offerCard.available")}
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="flex gap-2 lg:shrink-0 lg:w-[280px] lg:justify-end">
            {isOwnOffer ? (
              <>
                <button
                  onClick={() => onViewDetails && onViewDetails(offer)}
                  className="flex-1 lg:flex-none justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>{t("p2p.offerCard.viewDetails")}</span>
                </button>
                <button
                  onClick={handleCancelClick}
                  disabled={isDeleting}
                  className="flex-1 lg:flex-none justify-center px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                >
                  <X className="w-4 h-4 shrink-0" />
                  <span>{t("p2p.offerCard.cancel")}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onBuy(offer)}
                className={`flex-1 lg:flex-none justify-center px-6 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  tradeType === "sell"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {tradeType === "sell" ? (
                  <TrendingDown className="w-4 h-4 shrink-0" />
                ) : (
                  <TrendingUp className="w-4 h-4 shrink-0" />
                )}
                {tradeType === "sell"
                  ? t("p2p.offerCard.sell")
                  : t("p2p.offerCard.buy")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Модалка подтверждения отмены */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t("p2p.offerCard.cancelTitle")}</h3>
                  <p className="text-sm text-slate-500">
                    {t("p2p.offerCard.cancelIrreversible")}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">{t("p2p.offerCard.offerLabel")}</span>
                  <span className="font-medium">#{offer.id}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">{t("p2p.offerCard.cryptoLabel")}</span>
                  <span className="font-medium">{offer.available_amount} {offer.crypto_currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t("p2p.offerCard.priceLabel")}</span>
                  <span className="font-medium">{offer.price} {getCurrencySymbol(offer.currency)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {t("common.back")}
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("p2p.offerCard.cancelling")}
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      {t("p2p.offerCard.cancelOffer")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
