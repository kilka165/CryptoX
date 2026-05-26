// frontend/components/p2p/P2POfferCard.tsx
import React, { useState } from "react";
import { P2POffer } from "@/lib/api/p2pApi";
import { TrendingUp, CheckCircle, X, Eye, AlertTriangle } from "lucide-react";
import axios from "axios";

interface P2POfferCardProps {
  offer: P2POffer;
  currentUserId: number | null;
  onBuy: (offer: P2POffer) => void;
  onCancel?: (offerId: number) => void;
  onViewDetails?: (offer: P2POffer) => void;
}

export function P2POfferCard({ 
  offer, 
  currentUserId, 
  onBuy, 
  onCancel, 
  onViewDetails 
}: P2POfferCardProps) {
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
      await axios.delete(`http://localhost:8000/api/p2p/offers/${offer.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setShowCancelModal(false);
      
      if (onCancel) {
        onCancel(offer.id);
      }
    } catch (error) {
      console.error("Error canceling offer:", error);
      alert("Ошибка при отмене заявки");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Продавец */}
          <div className="flex-1 min-w-[180px]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {offer.seller_name[0].toUpperCase()}
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {offer.seller_name}
                  {isOwnOffer && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                      Моя заявка
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{offer.orders_count} сделок</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {offer.completion_rate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Цена */}
          <div className="flex-1 min-w-[140px]">
            <div className="text-lg font-bold">
              {offer.price.toLocaleString()} {offer.currency}
            </div>
            <div className="text-xs text-slate-500">
              За 1 {offer.crypto_currency}
            </div>
          </div>

          {/* Количество */}
          <div className="flex-1 min-w-[140px]">
            <div className="text-sm font-medium">
              {offer.available_amount.toLocaleString()} {offer.crypto_currency}
            </div>
            <div className="text-xs text-slate-500">
              Доступно
            </div>
          </div>

          {/* Действия */}
          <div className="flex gap-2">
            {isOwnOffer ? (
              <>
                <button
                  onClick={() => onViewDetails && onViewDetails(offer)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Подробнее</span>
                </button>
                <button
                  onClick={handleCancelClick}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Отменить</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onBuy(offer)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Купить
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Модалка подтверждения отмены */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Отменить заявку?</h3>
                  <p className="text-sm text-slate-500">
                    Это действие нельзя отменить
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Заявка:</span>
                  <span className="font-medium">#{offer.id}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Криптовалюта:</span>
                  <span className="font-medium">{offer.available_amount} {offer.crypto_currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Цена:</span>
                  <span className="font-medium">{offer.price} {offer.currency}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Назад
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Отмена...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Отменить заявку
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
