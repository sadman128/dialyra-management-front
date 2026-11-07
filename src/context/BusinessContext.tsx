"use client";

import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/context/ToastContext";
import {
  BusinessStore,
  CallRecord,
  mockBusinesses,
  mockCalls,
  FlowSummary,
  mockFlows,
  ProductItem,
  mockProducts,
  AudioAsset,
  mockAudioAssets,
} from "@/mock/mockData";
import { Icon } from "@/components/ui/Icon";

interface BusinessContextType {
  accountBalance: number;
  businesses: BusinessStore[];
  activeBusiness: BusinessStore;
  setActiveBusinessId: (id: string) => void;
  calls: CallRecord[];
  allCalls: CallRecord[];
  retryCall: (orderId: string) => void;
  topUpBalance: (amount: number) => void;
  showToast: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  flows: FlowSummary[];
  businessFlows: FlowSummary[];
  defaultFlow: FlowSummary | undefined;
  products: ProductItem[];
  allProducts: ProductItem[];
  addProduct: (product: Omit<ProductItem, "id" | "createdAt">) => void;
  updateProductFlow: (id: string, flowId: string, flowName: string) => void;
  updateProduct: (product: ProductItem) => void;
  deleteProduct: (id: string) => void;
  importProducts: (items: Omit<ProductItem, "id" | "createdAt">[]) => void;
  audioAssets: AudioAsset[];
  addAudioAsset: (asset: Omit<AudioAsset, "id">) => AudioAsset;
  deleteAudioAsset: (id: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { showToast: globalShowToast } = useToast();
  const [accountBalance, setAccountBalance] = useState<number>(500.0);
  const [businesses, setBusinesses] = useState<BusinessStore[]>(mockBusinesses);
  const [activeBusinessId, setActiveBusinessIdState] = useState<string>("biz-1");
  const [allCalls, setAllCalls] = useState<CallRecord[]>(mockCalls);
  const [flows] = useState<FlowSummary[]>(mockFlows);
  const [allProducts, setAllProducts] = useState<ProductItem[]>(mockProducts);
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>(mockAudioAssets);

  const rawActive =
    businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  const activeBusiness: BusinessStore = {
    ...rawActive,
    cachedBalance: accountBalance,
  };

  // Calls strictly isolated per active business
  const calls = allCalls.filter((c) => c.businessId === activeBusiness.id);

  // Flows and products scoped to active business
  const businessFlows = flows.filter((f) => f.businessId === activeBusiness.id);
  const defaultFlow = businessFlows.find((f) => f.isDefault) || businessFlows[0];
  const products = allProducts.filter((p) => p.businessId === activeBusiness.id);

  const addProduct = (item: Omit<ProductItem, "id" | "createdAt">) => {
    const newProduct: ProductItem = {
      ...item,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAllProducts((prev) => [newProduct, ...prev]);
    showToast(`Added product "${item.name}"`, "success");
  };

  const updateProductFlow = (id: string, flowId: string, flowName: string) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, flowId, flowName } : p))
    );
    showToast(`Assigned flow "${flowName}" to product`, "success");
  };

  const updateProduct = (updated: ProductItem) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`Updated product "${updated.name}"`, "success");
  };

  const deleteProduct = (id: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted successfully", "info");
  };

  const importProducts = (items: Omit<ProductItem, "id" | "createdAt">[]) => {
    const today = new Date().toISOString().split("T")[0];
    const newItems: ProductItem[] = items.map((item, idx) => ({
      ...item,
      id: `prod-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: today,
    }));
    setAllProducts((prev) => [...newItems, ...prev]);
    showToast(`Successfully imported ${items.length} products!`, "success");
  };

  const addAudioAsset = (asset: Omit<AudioAsset, "id">) => {
    const item: AudioAsset = {
      ...asset,
      id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setAudioAssets((prev) => [item, ...prev]);
    showToast(`"${item.name}" uploaded successfully`, "success");
    return item;
  };

  const deleteAudioAsset = (id: string) => {
    setAudioAssets((prev) => prev.filter((a) => a.id !== id));
    showToast("Audio asset deleted", "info");
  };

  const showToast = (
    message: string,
    type: "success" | "info" | "warning" | "error" = "info"
  ) => {
    globalShowToast(message, type, undefined, 3000);
  };

  const setActiveBusinessId = (id: string) => {
    setActiveBusinessIdState(id);
    const found = businesses.find((b) => b.id === id);
    if (found) {
      showToast(`Switched active workspace to ${found.name}`, "success");
    }
  };

  const retryCall = (orderId: string) => {
    setAllCalls((prev) =>
      prev.map((c) =>
        c.orderId === orderId
          ? {
              ...c,
              outcome: "RETRY_QUEUED",
              canRetry: false,
              attempts: [
                {
                  attemptNumber: c.attempts.length + 1,
                  startedAt: "Just now (Queued)",
                  outcome: "NO_ANSWER",
                  durationSec: 0,
                  costAmount: 0.0,
                },
                ...c.attempts,
              ],
            }
          : c
      )
    );
    showToast(`Instant redial queued for Order #${orderId}`, "success");
  };

  const topUpBalance = (amount: number) => {
    setAccountBalance((prev) => {
      const next = prev + amount;
      setBusinesses((bList) =>
        bList.map((b) => ({ ...b, cachedBalance: next }))
      );
      return next;
    });
    showToast(`Recharge of ৳${amount.toFixed(2)} credited to account!`, "success");
  };

  return (
    <BusinessContext.Provider
      value={{
        accountBalance,
        businesses: businesses.map((b) => ({ ...b, cachedBalance: accountBalance })),
        activeBusiness,
        setActiveBusinessId,
        calls,
        allCalls,
        retryCall,
        topUpBalance,
        showToast,
        flows,
        businessFlows,
        defaultFlow,
        products,
        allProducts,
        addProduct,
        updateProductFlow,
        updateProduct,
        deleteProduct,
        importProducts,
        audioAssets,
        addAudioAsset,
        deleteAudioAsset,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return ctx;
}
