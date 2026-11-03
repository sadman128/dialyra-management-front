"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";

export default function BusinessesPage() {
  const { accountBalance, businesses, activeBusiness, setActiveBusinessId, showToast } = useBusiness();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [filterQuery, setFilterQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "woocommerce" | "shopify">("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreDomain, setNewStoreDomain] = useState("");
  const [newStoreTrigger, setNewStoreTrigger] = useState<"instant" | "manual">("instant");

  const filteredBusinesses = businesses.filter((b) => {
    const matchesQuery =
      b.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.domain.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" ||
      (platformFilter === "woocommerce" && b.platform.toLowerCase().includes("woo")) ||
      (platformFilter === "shopify" && b.platform.toLowerCase().includes("shopify"));
    return matchesQuery && matchesPlatform;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Webhook endpoint copied", "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSecret = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;
    showToast(`Business "${newStoreName}" created`, "success");
    setCreateModalOpen(false);
    setNewStoreName("");
    setNewStoreDomain("");
  };

  const totalBalance = businesses.reduce((acc, b) => acc + b.cachedBalance, 0);

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
              Businesses
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">
              {businesses.length} Businesses
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
            Manage connected businesses and webhooks.
          </p>
        </div>

        {/* Search & Create Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest rounded-xl font-medium text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 border border-outline-variant/30"
              placeholder="Search businesses..."
              type="text"
            />
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:shadow hover:bg-primary transition-all active:scale-[0.99]"
            type="button"
          >
            <Icon name="add" size={18} />
            <span>Create Store</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Connected Businesses
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {businesses.length}
              </span>
              <span className="text-xs text-on-tertiary-container font-semibold">
                Online
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <Icon name="storefront" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Account Balance
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                ৳ {accountBalance.toFixed(2)}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">BDT</span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium">
              Shared across all businesses
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed-variant">
            <Icon name="account_balance_wallet" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Calls Today
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">72</span>
              <span className="text-xs text-on-tertiary-container font-semibold">
                94.4% Confirmed
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-primary-fixed-variant">
            <Icon name="phone_in_talk" size={22} />
          </div>
        </div>
      </div>

      {/* 3. Platform Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: "all", label: `All Businesses (${businesses.length})` },
          { id: "woocommerce", label: "WooCommerce" },
          { id: "shopify", label: "Shopify" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPlatformFilter(tab.id as typeof platformFilter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border ${
              platformFilter === tab.id
                ? "bg-primary-container text-on-primary border-primary-container shadow"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-outline-variant/30"
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Multi-Business Multi-Table (No main cards, cards inside table cells) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/80 border-b border-surface-container text-outline text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Call Flow</th>
                <th className="py-3 px-4">Account Balance</th>
                <th className="py-3 px-4 min-w-[240px]">Webhook</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs sm:text-sm text-on-surface">
              {filteredBusinesses.map((biz) => {
                const isActive = biz.id === activeBusiness.id;
                const webhookUrl = `https://api.dialyra.com/v1/webhooks/orders/${biz.uuid}`;
                const secretKey = `whsec_live_${biz.uuid.substring(0, 8)}417e293041c7f`;
                const isSecretRevealed = !!revealedSecrets[biz.id];

                return (
                  <tr
                    key={biz.id}
                    className={`hover:bg-surface-container-low/40 transition-colors ${
                      isActive ? "bg-primary-container/5" : ""
                    }`}
                  >
                    {/* Store Cell (Card inside cell) */}
                    <td className="py-3 px-4">
                      <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 shadow-xs flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-container shrink-0 font-bold">
                          <Icon name="shopping_cart" size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-on-surface truncate">
                              {biz.name}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-on-surface-variant font-mono truncate">
                            {biz.domain}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Platform Cell (Card inside cell) */}
                    <td className="py-3 px-4">
                      <div className="p-2 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 shadow-xs inline-flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-on-surface">
                          {biz.platform}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-medium">
                          ⚡ Instant Dial
                        </span>
                      </div>
                    </td>

                    {/* Call Flow Cell (Card inside cell) */}
                    <td className="py-3 px-4">
                      <div className="p-2 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 shadow-xs inline-flex items-center gap-1.5">
                        <Icon name="call_split" size={15} className="text-primary-container" />
                        <span className="text-xs font-semibold text-on-surface truncate max-w-[160px]">
                          {biz.boundFlowName}
                        </span>
                      </div>
                    </td>

                    {/* Account Balance Cell (Shared across all stores) */}
                    <td className="py-3 px-4">
                      <div className="p-2 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 shadow-xs inline-flex flex-col">
                        <span className="text-xs font-bold text-on-surface font-mono">
                          ৳ {accountBalance.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-semibold">
                          Shared Pool
                        </span>
                      </div>
                    </td>

                    {/* Webhook Cell (Card inside cell) */}
                    <td className="py-3 px-4">
                      <div className="p-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 shadow-xs flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-mono text-on-surface truncate flex-1 bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">
                            {webhookUrl}
                          </code>
                          <button
                            onClick={() => handleCopy(webhookUrl, biz.id)}
                            className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface shadow-xs transition-colors"
                            title="Copy Webhook"
                            type="button"
                          >
                            <Icon name={copiedId === biz.id ? "check" : "save"} size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant font-mono">
                            Secret: {isSecretRevealed ? secretKey : `${secretKey.substring(0, 8)}••••`}
                          </span>
                          <button
                            onClick={() => toggleSecret(biz.id)}
                            className="text-primary-container font-bold hover:underline"
                            type="button"
                          >
                            {isSecretRevealed ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Action Cell */}
                    <td className="py-3 px-4 text-right">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface-variant text-xs font-bold shadow-xs">
                          <Icon name="check" size={14} />
                          <span>Managing</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveBusinessId(biz.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95"
                          type="button"
                        >
                          <span>Switch</span>
                          <Icon name="arrow_forward" size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Store Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Create Store
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  placeholder="e.g. Uttara Mart"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Business Domain
                </label>
                <input
                  type="text"
                  value={newStoreDomain}
                  onChange={(e) => setNewStoreDomain(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  placeholder="e.g. uttaramart.com.bd"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Trigger Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStoreTrigger("instant")}
                    className={`p-2.5 rounded-lg border text-center font-semibold transition shadow-xs ${
                      newStoreTrigger === "instant"
                        ? "bg-primary-container/15 border-primary-container text-primary-container font-bold"
                        : "border-outline-variant/30 text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    ⚡ Instant Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStoreTrigger("manual")}
                    className={`p-2.5 rounded-lg border text-center font-semibold transition shadow-xs ${
                      newStoreTrigger === "manual"
                        ? "bg-primary-container/15 border-primary-container text-primary-container font-bold"
                        : "border-outline-variant/30 text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    📋 Manual Batch
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low font-semibold shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold shadow-sm hover:shadow hover:bg-primary transition"
                >
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
