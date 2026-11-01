"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";

export default function BusinessesPage() {
  const { businesses, activeBusiness, setActiveBusinessId, showToast } = useBusiness();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [filterQuery, setFilterQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreDomain, setNewStoreDomain] = useState("");
  const [newStoreCountry, setNewStoreCountry] = useState("+880");
  const [newStoreTrigger, setNewStoreTrigger] = useState<"instant" | "manual">("instant");

  const filteredBusinesses = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.domain.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Inbound webhook endpoint copied to clipboard", "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSecret = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;
    showToast(`Storefront "${newStoreName}" successfully registered & provisioned!`, "success");
    setCreateModalOpen(false);
    setNewStoreName("");
    setNewStoreDomain("");
  };

  const totalBalance = businesses.reduce((acc, b) => acc + b.cachedBalance, 0);

  return (
    <div className="flex flex-col w-full space-y-8 pb-16">
      {/* 1. Header Title & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
              Storefronts
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant">
              {businesses.length} Stores
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
            Switch between stores or connect a new WooCommerce or Shopify storefront.
          </p>
        </div>

        {/* Search & Connect Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-surface-container-lowest rounded-xl font-medium text-sm text-on-surface placeholder:text-on-surface-variant/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all border border-outline-variant/30"
              placeholder="Filter stores..."
              type="text"
            />
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-sm shadow-sm hover:shadow hover:bg-primary transition-all active:scale-[0.99] w-full sm:w-auto justify-center"
            type="button"
          >
            <Icon name="add" size={18} />
            <span>Connect Store</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Strip: High-Density Telemetry Cards (Stitch UI 100% Exact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Active Connected Stores
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-on-surface tracking-tight">
                {businesses.length}
              </span>
              <span className="text-sm text-on-tertiary-container font-semibold">
                Live Stores
              </span>
            </div>
            <span className="text-xs text-on-surface-variant mt-0.5 font-medium">
              1 WooCommerce • 1 Shopify Plus
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <Icon name="storefront" size={22} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container via-surface-tint to-transparent opacity-80" />
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Total Telephony Balance
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-on-surface tracking-tight">
                ৳ {totalBalance.toFixed(2)}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                BDT
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-secondary font-medium">
              <Icon name="toll" size={14} />
              <span>Shared pool across all endpoints</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed-variant">
            <Icon name="account_balance_wallet" size={22} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container via-secondary to-transparent opacity-70" />
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Daily Dispatched Calls
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-on-surface tracking-tight">
                72
              </span>
              <span className="text-sm text-on-surface-variant font-medium">
                Outbound Today
              </span>
            </div>
            <span className="text-xs text-on-tertiary-container mt-0.5 font-medium flex items-center gap-1">
              <Icon name="trending_up" size={14} /> 94.4% verification success
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-on-primary-fixed-variant">
            <Icon name="phone_in_talk" size={22} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary-fixed-dim via-on-tertiary-container to-transparent opacity-80" />
        </div>
      </div>

      {/* 3. Storefront Cards Grid (Stitch UI 100% Exact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {filteredBusinesses.map((biz) => {
          const isActive = biz.id === activeBusiness.id;
          const webhookUrl = `https://api.dialyra.com/v1/webhooks/orders/${biz.uuid}`;
          const secretKey = `whsec_live_${biz.uuid.substring(0, 8)}417e293041c7f`;
          const isSecretRevealed = !!revealedSecrets[biz.id];

          return (
            <div
              key={biz.id}
              className="relative bg-surface-container-lowest rounded-2xl shadow-stitch-card border border-outline-variant/30 transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Line */}
              {isActive ? (
                <div className="h-1.5 w-full bg-gradient-to-r from-on-tertiary-container via-tertiary-fixed-dim to-surface-container-lowest" />
              ) : (
                <div className="h-1.5 w-full bg-surface-container" />
              )}

              <div className="p-6 md:p-7 flex flex-col gap-5">
                {/* Store Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                      <Icon name="shopping_cart" size={26} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg text-on-surface leading-snug font-bold">
                        {biz.name}
                      </span>
                      <a
                        className="text-sm text-on-primary-fixed-variant hover:underline flex items-center gap-1 font-medium mt-0.5"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span>{biz.domain}</span>
                        <Icon name="open_in_new" size={14} />
                      </a>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-tertiary-container text-tertiary-fixed-dim font-bold shadow-xs shrink-0">
                      <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping" />
                      ACTIVE STORE
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-semibold text-xs shrink-0">
                      Secondary Store
                    </span>
                  )}
                </div>

                {/* Metadata Properties Grid */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-container-low font-body-sm text-body-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="public" size={16} className="text-on-surface-variant" />
                    <div className="flex flex-col">
                      <span className="text-label-sm font-label-sm text-on-surface-variant leading-none">
                        Country
                      </span>
                      <span className="text-label-md font-label-md text-on-surface font-semibold">
                        Bangladesh ({biz.defaultCountryCode})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon name="calendar_today" size={16} className="text-on-surface-variant" />
                    <div className="flex flex-col">
                      <span className="text-label-sm font-label-sm text-on-surface-variant leading-none">
                        Timezone
                      </span>
                      <span className="text-label-md font-label-md text-on-surface font-semibold">
                        {biz.timezone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 col-span-2">
                    <Icon name="bolt" size={16} className="text-on-tertiary-container" />
                    <div className="flex flex-col">
                      <span className="text-label-sm font-label-sm text-on-surface-variant leading-none">
                        Mode
                      </span>
                      <span className="text-label-md font-label-md text-on-tertiary-container font-semibold">
                        {biz.triggerMode === "instant"
                          ? "⚡ Instant Auto-Call"
                          : "📋 Manual Batch"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telephony Balance Widget */}
                <div className="p-space-md rounded-lg bg-surface-bright flex flex-col gap-2 border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">
                      Telephony Credit Allocation
                    </span>
                    <button
                      onClick={() => showToast(`Top up modal for ${biz.name}`, "info")}
                      className="text-label-sm font-label-sm text-primary-container font-bold hover:underline flex items-center gap-0.5"
                      type="button"
                    >
                      <Icon name="add_circle" size={14} />
                      <span>Top Up</span>
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
                        ৳ {biz.cachedBalance.toFixed(2)}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        BDT
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-semibold w-fit">
                      ~{Math.floor(biz.cachedBalance)} verification calls
                    </span>
                  </div>
                  {/* Capacity Gauge */}
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-container h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (biz.cachedBalance / 500) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Webhook Integration Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold flex items-center justify-between">
                    <span>Inbound Order Webhook Endpoint</span>
                    <span className="text-label-sm font-label-sm text-on-tertiary-container font-medium">
                      SSL Verified
                    </span>
                  </label>
                  <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1.5 rounded-lg border border-outline-variant/30">
                    <code className="font-code-sm text-code-sm text-on-surface font-mono truncate flex-1 select-all">
                      {webhookUrl}
                    </code>
                    <button
                      className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      onClick={() => handleCopy(webhookUrl, biz.id)}
                      title="Copy Webhook URL"
                      type="button"
                    >
                      <Icon name={copiedId === biz.id ? "check" : "save"} size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Signing Secret:
                      </span>
                      <code className="font-code-sm text-code-sm text-on-surface-variant font-mono">
                        {isSecretRevealed ? secretKey : `${secretKey.substring(0, 11)}••••••••7f`}
                      </code>
                    </div>
                    <button
                      className="text-label-sm font-label-sm text-primary-container font-semibold hover:underline"
                      onClick={() => toggleSecret(biz.id)}
                      type="button"
                    >
                      {isSecretRevealed ? "Hide" : "Reveal"}
                    </button>
                  </div>
                </div>

                {/* Bound Telephony Route */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low text-on-surface">
                  <Icon name="call_split" size={18} className="text-primary-container" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-label-sm font-label-sm text-on-surface-variant leading-none">
                      Bound Telephony Route
                    </span>
                    <span className="text-body-sm font-body-sm font-semibold truncate">
                      {biz.boundFlowName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-space-lg pt-0">
                {isActive ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md cursor-default text-center"
                    type="button"
                  >
                    Currently Managing This Workspace
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveBusinessId(biz.id)}
                    className="w-full py-2.5 px-4 rounded-lg border border-primary-container text-primary-container hover:bg-primary-container/10 font-label-md text-label-md font-semibold transition text-center shadow-xs"
                    type="button"
                  >
                    Switch to This Store
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Storefront Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Connect New Storefront
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4 font-body-sm text-body-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Store / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container"
                  placeholder="e.g. Uttara Mart"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Store Domain URL
                </label>
                <input
                  type="text"
                  value={newStoreDomain}
                  onChange={(e) => setNewStoreDomain(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container"
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
                    className={`p-2.5 rounded-lg border text-center font-semibold transition ${
                      newStoreTrigger === "instant"
                        ? "bg-primary-container/15 border-primary-container text-primary-container font-bold"
                        : "border-outline-variant/30 text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    ⚡ Instant Auto-Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStoreTrigger("manual")}
                    className={`p-2.5 rounded-lg border text-center font-semibold transition ${
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
                  className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold shadow-sm hover:opacity-90 transition"
                >
                  Create &amp; Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
