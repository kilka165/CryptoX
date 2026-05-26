// frontend/app/p2p/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { P2PFilters } from "@/components/p2p/P2PFilters";
import { P2PTableHeader } from "@/components/p2p/P2PTableHeader";
import { P2POfferCard } from "@/components/p2p/P2POfferCard";
import { P2PBuyModal } from "@/components/p2p/P2PBuyModal";
import { P2PCreateOfferModal } from "@/components/p2p/P2PCreateOfferModal";
import { p2pApi, P2POffer } from "@/lib/api/p2pApi";
import { Plus } from "lucide-react";
import axios from "axios";

export default function P2PPage() {
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "rate">("price");
  const [cryptoOptions, setCryptoOptions] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [selectedOffer, setSelectedOffer] = useState<P2POffer | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Получаем текущего пользователя ОДИН РАЗ
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.id);
        console.log("Current user ID:", response.data.id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const params: any = {
        type: tradeType,
      };
      
      if (selectedCrypto) {
        params.crypto_currency = selectedCrypto;
      }
      
      if (selectedCurrency) {
        params.currency = selectedCurrency;
      }

      console.log("Fetching offers with params:", params);
      
      const data = await p2pApi.getOffers(params);
      console.log("Fetched offers:", data);
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [selectedCrypto, selectedCurrency, tradeType]);

  const filteredOffers = offers
    .filter((offer) => {
      if (searchQuery) {
        return offer.seller_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return b.completion_rate - a.completion_rate;
    });

  const handleBuyClick = (offer: P2POffer) => {
    setSelectedOffer(offer);
    setIsBuyModalOpen(true);
  };

  const handleViewDetails = (offer: P2POffer) => {
    setSelectedOffer(offer);
    setIsDetailsModalOpen(true);
  };

  const handleCancelOffer = (offerId: number) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  };

  const handleConfirmBuy = async (amount: number, cryptoAmount: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Необходима авторизация");
      window.location.href = "/login";
      return;
    }

    if (!selectedOffer) return;

    try {
      await p2pApi.createTrade(token, {
        offer_id: selectedOffer.id,
        amount,
        crypto_amount: cryptoAmount,
      });

      fetchOffers();
    } catch (error) {
      console.error("Error creating trade:", error);
      alert("Ошибка создания сделки");
    }
  };

  const handleCryptoOptionsLoaded = (options: string[]) => {
    setCryptoOptions(options);
  };

  const handleOfferCreated = () => {
    console.log("Offer created, refreshing list...");
    fetchOffers();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">P2P Торговля</h1>
            <p className="text-sm text-slate-500 mt-1">
              Покупайте и продавайте криптовалюту напрямую
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Создать заявку</span>
          </button>
        </div>

        <P2PFilters
          tradeType={tradeType}
          selectedCrypto={selectedCrypto}
          selectedCurrency={selectedCurrency}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onTradeTypeChange={setTradeType}
          onCryptoChange={setSelectedCrypto}
          onCurrencyChange={setSelectedCurrency}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onCryptoOptionsLoaded={handleCryptoOptionsLoaded}
        />

        <P2PTableHeader />

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="space-y-3">
            {filteredOffers.map((offer) => (
              <P2POfferCard
                key={offer.id}
                offer={offer}
                currentUserId={currentUserId}
                onBuy={handleBuyClick}
                onCancel={handleCancelOffer}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium mb-2">Предложений не найдено</p>
            <p className="text-sm">
              {tradeType === "buy" 
                ? "Попробуйте создать своё предложение на продажу" 
                : "Попробуйте создать своё предложение на покупку"}
            </p>
          </div>
        )}
      </main>

      <P2PBuyModal
        isOpen={isBuyModalOpen}
        offer={selectedOffer}
        onClose={() => {
          setIsBuyModalOpen(false);
          setSelectedOffer(null);
        }}
        onConfirm={handleConfirmBuy}
      />

      <P2PCreateOfferModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleOfferCreated}
        cryptoOptions={cryptoOptions}
      />

      {/* Модалка с подробностями */}
      {isDetailsModalOpen && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Детали заявки</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">ID заявки:</span>
                <span className="font-medium">#{selectedOffer.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Криптовалюта:</span>
                <span className="font-medium">{selectedOffer.crypto_currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Валюта:</span>
                <span className="font-medium">{selectedOffer.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Цена:</span>
                <span className="font-medium text-lg">{selectedOffer.price.toLocaleString()} {selectedOffer.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Доступно:</span>
                <span className="font-medium">{selectedOffer.available_amount.toLocaleString()} {selectedOffer.crypto_currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Мин. лимит:</span>
                <span className="font-medium">{selectedOffer.min_limit.toLocaleString()} {selectedOffer.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Макс. лимит:</span>
                <span className="font-medium">{selectedOffer.max_limit.toLocaleString()} {selectedOffer.currency}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Тип:</span>
                <span className={`font-medium ${selectedOffer.type === 'sell' ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {selectedOffer.type === 'sell' ? 'Продажа' : 'Покупка'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="mt-6 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
