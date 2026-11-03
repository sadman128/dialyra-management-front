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

const BUSINESS_FLOWS: Record<string, { count: number; defaultFlow: string }> = {
  "biz-1": { count: 3, defaultFlow: "Order Confirmation Flow" },
  "biz-2": { count: 1, defaultFlow: "Standard Checkout Validation Flow" },
};

export default function BusinessesPage() {
  const { accountBalance, businesses, activeBusiness, setActiveBusinessId, showToast } = useBusiness();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [filterQuery, setFilterQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreDomain, setNewStoreDomain] = useState("");
  const [newStoreTrigger, setNewStoreTrigger] = useState<"instant" | "manual">("instant");

  const filteredBusinesses = businesses.filter((b) => {
    return (
      b.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.domain.toLowerCase().includes(filterQuery.toLowerCase())
    );
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

      {/* Multi-Business Table */}
      <div className="bg-white dark:bg-[#1a1329] rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "850px" }}>
            <thead>
              <tr className="bg-surface-container-low/80 border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                <th className="py-3.5 px-5">Business Name</th>
                <th className="py-3.5 px-5">Business Domain</th>
                <th className="py-3.5 px-5">Number of Flows</th>
                <th className="py-3.5 px-5">Default Flow</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs sm:text-sm text-on-surface">
              {filteredBusinesses.map((biz) => {
                const isActive = biz.id === activeBusiness.id;
                const flowInfo = BUSINESS_FLOWS[biz.id] || {
                  count: 1,
                  defaultFlow: biz.boundFlowName,
                };

                return (
                  <tr
                    key={biz.id}
                    className={`hover:bg-purple-500/[0.03] transition-colors ${
                      isActive ? "bg-purple-500/5" : ""
                    }`}
                  >
                    {/* 1. Business Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#9a55ff] shrink-0 font-bold">
                          <ShoppingBag size={18} />
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-sm text-on-surface truncate">
                            {biz.name}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Business Domain (Clickable) */}
                    <td className="py-3.5 px-5">
                      <a
                        href={`https://${biz.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-[#9a55ff] hover:text-[#b66dff] hover:underline font-semibold transition-colors"
                      >
                        <span>{biz.domain}</span>
                        <ExternalLink size={13} className="shrink-0" />
                      </a>
                    </td>

                    {/* 3. Number of Flows */}
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-mono font-bold text-xs border border-outline-variant/30 shadow-2xs">
                        {flowInfo.count} {flowInfo.count === 1 ? "Flow" : "Flows"}
                      </span>
                    </td>

                    {/* 4. Default Flow */}
                    <td className="py-3.5 px-5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 shadow-2xs">
                        <GitBranch size={13} className="text-[#9a55ff] shrink-0" />
                        <span className="text-xs font-semibold text-on-surface truncate max-w-[200px]">
                          {flowInfo.defaultFlow}
                        </span>
                      </div>
                    </td>

                    {/* 5. Action */}
                    <td className="py-3.5 px-5 text-right">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 text-xs font-bold select-none">
                          <span>Active Business</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveBusinessId(biz.id);
                            showToast(`Switched active business to "${biz.name}"`, "info");
                          }}
                          className="px-4 py-1.5 rounded-full btn-gradient-primary text-white text-xs font-bold shadow-2xs hover:shadow transition-all active:scale-95 cursor-pointer"
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
