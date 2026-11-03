"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import {
  Building2,
  Search,
  Plus,
  PhoneCall,
  Wallet,
  Copy,
  Check,
  GitBranch,
  Eye,
  EyeOff,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";

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

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Businesses</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl text-on-surface tracking-tight font-extrabold flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Building2 size={20} />
              </span>
              Businesses
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold badge-inverse-primary">
              {businesses.length} Businesses
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Manage connected storefronts, API webhooks, and routing assignments.
          </p>
        </div>

        {/* Search & Create Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1a1329] rounded-full font-medium text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/60 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 border border-outline-variant/30"
              placeholder="Search businesses..."
              type="text"
            />
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full btn-gradient-primary font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
            type="button"
          >
            <Plus size={16} />
            <span>Create Store</span>
          </button>
        </div>
      </div>

      {/* 2. Purple React Signature 3-Gradient Metric Cards with Circular Watermark */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-img-holder bg-gradient-primary text-white rounded-2xl p-6 shadow-md shadow-purple-500/20 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-bold text-white/90">
              Connected Businesses
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Building2 size={18} className="text-white" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              {businesses.length}
            </span>
          </div>
          <div className="mt-3 text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
              All Online
            </span>
            <span>Real-time webhook active</span>
          </div>
        </div>

        <div className="card-img-holder bg-gradient-info text-white rounded-2xl p-6 shadow-md shadow-blue-500/15 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-white/90 block">
                Account Balance
              </span>
              <span className="text-[10px] text-white/80">
                Shared pool
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Wallet size={18} className="text-white" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              ৳ {accountBalance.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
              BDT
            </span>
            <span>Shared across all businesses</span>
          </div>
        </div>

        <div className="card-img-holder bg-gradient-success text-white rounded-2xl p-6 shadow-md shadow-teal-500/15 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-bold text-white/90">
              Calls Today
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <PhoneCall size={18} className="text-white" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              72
            </span>
          </div>
          <div className="mt-3 text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
              94.4%
            </span>
            <span>Confirmed orders</span>
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
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              platformFilter === tab.id
                ? "btn-gradient-primary text-white shadow-xs"
                : "bg-white dark:bg-[#1a1329] text-on-surface-variant hover:bg-surface-container border border-outline-variant/30"
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Multi-Business Multi-Table */}
      <div className="bg-white dark:bg-[#1a1329] rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "850px" }}>
            <thead>
              <tr className="bg-surface-container-low/80 border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                <th className="py-3.5 px-5">Business</th>
                <th className="py-3.5 px-5">Platform</th>
                <th className="py-3.5 px-5">Call Flow</th>
                <th className="py-3.5 px-5">Account Balance</th>
                <th className="py-3.5 px-5 min-w-[240px]">Webhook</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs sm:text-sm text-on-surface">
              {filteredBusinesses.map((biz) => {
                const isActive = biz.id === activeBusiness.id;
                const webhookUrl = `https://api.dialyra.com/v1/webhooks/orders/${biz.uuid}`;
                const secretKey = `whsec_live_${biz.uuid.substring(0, 8)}417e293041c7f`;
                const isSecretRevealed = !!revealedSecrets[biz.id];

                return (
                  <tr
                    key={biz.id}
                    className={`hover:bg-purple-500/[0.03] transition-colors ${
                      isActive ? "bg-purple-500/5" : ""
                    }`}
                  >
                    {/* Store Cell */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#9a55ff] shrink-0 font-bold">
                          <ShoppingBag size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-on-surface truncate">
                              {biz.name}
                            </span>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-on-surface-variant font-mono truncate">
                            {biz.domain}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Platform Cell */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-on-surface">
                          {biz.platform}
                        </span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ⚡ Instant Dial
                        </span>
                      </div>
                    </td>

                    {/* Call Flow Cell */}
                    <td className="py-3.5 px-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/30">
                        <GitBranch size={13} className="text-[#9a55ff]" />
                        <span className="text-xs font-semibold text-on-surface truncate max-w-[150px]">
                          {biz.boundFlowName}
                        </span>
                      </div>
                    </td>

                    {/* Account Balance Cell */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-on-surface font-mono">
                          ৳ {accountBalance.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-semibold">
                          Shared Pool
                        </span>
                      </div>
                    </td>

                    {/* Webhook Cell */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[11px] font-mono text-on-surface truncate flex-1 bg-surface-container-low px-2 py-0.5 rounded-lg border border-outline-variant/30">
                            {webhookUrl}
                          </code>
                          <button
                            onClick={() => handleCopy(webhookUrl, biz.id)}
                            className="p-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface shadow-2xs transition-colors cursor-pointer"
                            title="Copy Webhook"
                            type="button"
                          >
                            {copiedId === biz.id ? (
                              <Check size={13} className="text-emerald-500" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant font-mono text-[10px]">
                            Secret: {isSecretRevealed ? secretKey : `${secretKey.substring(0, 8)}••••`}
                          </span>
                          <button
                            onClick={() => toggleSecret(biz.id)}
                            className="text-[#9a55ff] font-bold hover:underline cursor-pointer inline-flex items-center gap-1 text-[11px]"
                            type="button"
                          >
                            {isSecretRevealed ? <EyeOff size={11} /> : <Eye size={11} />}
                            <span>{isSecretRevealed ? "Hide" : "Reveal"}</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Action Cell */}
                    <td className="py-3.5 px-5 text-right">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full badge-inverse-success text-xs font-bold">
                          <span>Current Store</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveBusinessId(biz.id);
                            showToast(`Switched active business to "${biz.name}"`, "info");
                          }}
                          className="px-3.5 py-1.5 rounded-full btn-gradient-primary text-white text-xs font-bold shadow-2xs hover:shadow transition-all active:scale-95 cursor-pointer"
                          type="button"
                        >
                          Switch
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
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-lg font-bold text-on-surface">
                Create Store / Business
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Business Name
                </label>
                <input
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="e.g., Organic Lifestyle BD"
                  required
                  className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Store Domain
                </label>
                <input
                  value={newStoreDomain}
                  onChange={(e) => setNewStoreDomain(e.target.value)}
                  placeholder="e.g., organiclifestyle.com.bd"
                  required
                  className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Trigger Mechanism
                </label>
                <select
                  value={newStoreTrigger}
                  onChange={(e) => setNewStoreTrigger(e.target.value as "instant" | "manual")}
                  className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                >
                  <option value="instant">Instant Automatic Call on Order Created</option>
                  <option value="manual">Manual Batch / Approval Mode</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary px-5 py-2 rounded-full text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
