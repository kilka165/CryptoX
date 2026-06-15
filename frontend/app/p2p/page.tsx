// frontend/app/p2p/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { P2PFilters, SortKey, SortDir } from "@/components/p2p/P2PFilters";
import { P2PTableHeader } from "@/components/p2p/P2PTableHeader";
import { P2POfferCard } from "@/components/p2p/P2POfferCard";
import { P2PBuyModal } from "@/components/p2p/P2PBuyModal";
import { P2PCreateOfferModal } from "@/components/p2p/P2PCreateOfferModal";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import { p2pApi, P2POffer } from "@/lib/api/p2pApi";
import { Plus, User } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_BASE } from "@/lib/config";
import { getCurrencySymbol } from "@/lib/currencies";

export default function P2PPage() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<P2POffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("price");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [ordersMin, setOrdersMin] = useState("");
  const [hideMine, setHideMine] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);
  const [cryptoOptions, setCryptoOptions] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [selectedOffer, setSelectedOffer] = useState<P2POffer | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Получаем текущего пользователя ОДИН РАЗ
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await axios.get(`${API_BASE}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.id);
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

      const data = await p2pApi.getOffers(params);
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
    .filter((offer) => {
      const pMin = parseFloat(priceMin.replace(",", "."));
      const pMax = parseFloat(priceMax.replace(",", "."));
      const aMin = parseFloat(amountMin.replace(",", "."));
      const aMax = parseFloat(amountMax.replace(",", "."));
      const oMin = parseFloat(ordersMin.replace(",", "."));
      if (!isNaN(pMin) && offer.price < pMin) return false;
      if (!isNaN(pMax) && offer.price > pMax) return false;
      if (!isNaN(aMin) && offer.available_amount < aMin) return false;
      if (!isNaN(aMax) && offer.available_amount > aMax) return false;
      if (!isNaN(oMin) && offer.orders_count < oMin) return false;
      return true;
    })
    .filter((offer) => {
      const isMine = currentUserId != null && offer.seller_id === currentUserId;
      if (onlyMine) return isMine;
      if (hideMine) return !isMine;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === "price") cmp = a.price - b.price;
      else cmp = a.orders_count - b.orders_count;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleResetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setAmountMin("");
    setAmountMax("");
    setOrdersMin("");
    setHideMine(false);
    setSearchQuery("");
    setSortBy("price");
    setSortDir("asc");
  };

  const handleBuyClick = (offer: P2POffer) => {
    if (!localStorage.getItem("auth_token")) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedOffer(offer);
    setIsBuyModalOpen(true);
  };

  const handleCreateOfferClick = () => {
    if (!localStorage.getItem("auth_token")) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsCreateModalOpen(true);
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
      setIsBuyModalOpen(false);
      setIsAuthModalOpen(true);
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
      // Пробрасываем ошибку, чтобы модалка показала её inline-сообщением,
      // а не системным alert поверх страницы.
      throw error;
    }
  };

  const handleCryptoOptionsLoaded = (options: string[]) => {
    setCryptoOptions(options);
  };

  const handleOfferCreated = () => {
    fetchOffers();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0d] text-slate-900 dark:text-white transition-colors">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t("p2p.title")}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("p2p.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyMine((v) => !v)}
              className={`flex items-center gap-2 px-4 md:px-5 py-3 rounded-lg font-medium border transition-colors ${
                onlyMine
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-transparent border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{t("p2p.myOffers")}</span>
            </button>
            <button
              onClick={handleCreateOfferClick}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t("p2p.createOffer")}</span>
            </button>
          </div>
        </div>

        <P2PFilters
          tradeType={tradeType}
          selectedCrypto={selectedCrypto}
          selectedCurrency={selectedCurrency}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortDir={sortDir}
          priceMin={priceMin}
          priceMax={priceMax}
          amountMin={amountMin}
          amountMax={amountMax}
          ordersMin={ordersMin}
          hideMine={hideMine}
          onlyMine={onlyMine}
          onTradeTypeChange={setTradeType}
          onCryptoChange={setSelectedCrypto}
          onCurrencyChange={setSelectedCurrency}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onSortDirChange={setSortDir}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          onAmountMinChange={setAmountMin}
          onAmountMaxChange={setAmountMax}
          onOrdersMinChange={setOrdersMin}
          onHideMineChange={setHideMine}
          onReset={handleResetFilters}
          onCryptoOptionsLoaded={handleCryptoOptionsLoaded}
        />

        <P2PTableHeader />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 dark:bg-[#131416] rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {filteredOffers.map((offer) => (
              <P2POfferCard
                key={offer.id}
                offer={offer}
                currentUserId={currentUserId}
                tradeType={tradeType}
                onBuy={handleBuyClick}
                onCancel={handleCancelOffer}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium mb-2">{t("p2p.noOffers")}</p>
            <p className="text-sm">
              {tradeType === "buy"
                ? t("p2p.tryCreateSell")
                : t("p2p.tryCreateBuy")}
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

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Модалка с подробностями */}
      {isDetailsModalOpen && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#131416] rounded-2xl border border-slate-300 dark:border-slate-800 w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">{t("p2p.details")}</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t("p2p.offerId")}</span>
                <span className="font-medium">#{selectedOffer.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t("p2p.crypto")}</span>
                <span className="font-medium">{selectedOffer.crypto_currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t("p2p.currency")}</span>
                <span className="font-medium">{selectedOffer.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t("p2p.price")}</span>
                <span className="font-medium text-lg">{selectedOffer.price.toLocaleString()} {getCurrencySymbol(selectedOffer.currency)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t("p2p.available")}</span>
                <span className="font-medium">{selectedOffer.available_amount.toLocaleString()} {selectedOffer.crypto_currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t("p2p.minLimit")}</span>
                <span className="font-medium">{selectedOffer.min_limit.toLocaleString()} {getCurrencySymbol(selectedOffer.currency)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-800">
                <span className="text-slate-500">{t("p2p.maxLimit")}</span>
                <span className="font-medium">{selectedOffer.max_limit.toLocaleString()} {getCurrencySymbol(selectedOffer.currency)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">{t("p2p.type")}</span>
                <span className={`font-medium ${selectedOffer.type === 'sell' ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {selectedOffer.type === 'sell' ? t("p2p.sell") : t("p2p.buy")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="mt-6 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
