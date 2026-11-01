"use client";

import React, { createContext, useContext, useState } from "react";
import {
  BusinessStore,
  CallRecord,
  mockBusinesses,
  mockCalls,
} from "@/mock/mockData";
import { Icon } from "@/components/ui/Icon";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface BusinessContextType {
  businesses: BusinessStore[];
  activeBusiness: BusinessStore;
  setActiveBusinessId: (id: string) => void;
  calls: CallRecord[];
  retryCall: (orderId: string) => void;
  topUpBalance: (amount: number) => void;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<BusinessStore[]>(mockBusinesses);
  const [activeBusinessId, setActiveBusinessIdState] = useState<string>("biz-1");
  const [calls, setCalls] = useState<CallRecord[]>(mockCalls);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const activeBusiness =
    businesses.find((b) => b.id === activeBusinessId) || businesses[0];

  const showToast = (
    message: string,
    type: "success" | "info" | "warning" = "info"
  ) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const setActiveBusinessId = (id: string) => {
    setActiveBusinessIdState(id);
    const found = businesses.find((b) => b.id === id);
    if (found) {
      showToast(`Switched active workspace to ${found.name}`, "success");
    }
  };

  const retryCall = (orderId: string) => {
    setCalls((prev) =>
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
    showToast(`Instant redial queued for Order #${orderId} on Trunk #20`, "success");
  };

  const topUpBalance = (amount: number) => {
    setBusinesses((prev) =>
      prev.map((b) =>
        b.id === activeBusiness.id
          ? { ...b, cachedBalance: b.cachedBalance + amount }
          : b
      )
    );
    showToast(`Recharge of ৳${amount.toFixed(2)} BDT successfully credited!`, "success");
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        activeBusiness,
        setActiveBusinessId,
        calls,
        retryCall,
        topUpBalance,
        showToast,
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-3 transition-all transform translate-y-0 ${
              toast.type === "success"
                ? "bg-emerald-900 text-emerald-100 border-emerald-700"
                : toast.type === "warning"
                ? "bg-amber-900 text-amber-100 border-amber-700"
                : "bg-[#411264] text-white border-purple-500"
            }`}
          >
            <Icon
              name={
                toast.type === "success"
                  ? "check_circle"
                  : toast.type === "warning"
                  ? "info"
                  : "info"
              }
              size={18}
            />
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
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
