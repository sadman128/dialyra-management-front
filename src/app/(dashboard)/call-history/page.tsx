"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function CallHistoryPage() {
  const { activeBusiness, calls, retryCall, showToast } = useBusiness();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [callToRetry, setCallToRetry] = useState<typeof calls[0] | null>(null);

  const totalCallsCount = calls.length;
  const confirmedCount = calls.filter((c) => c.outcome === "CONFIRMED").length;
  const cancelledCount = calls.filter((c) => c.outcome === "CANCELLED").length;
  const failedCount = calls.filter(
    (c) => c.outcome === "NO_ANSWER" || c.outcome === "BUSY" || c.outcome === "RETRY_QUEUED"
  ).length;

  const confirmedPct = totalCallsCount > 0 ? ((confirmedCount / totalCallsCount) * 100).toFixed(1) : "0.0";
  const cancelledPct = totalCallsCount > 0 ? ((cancelledCount / totalCallsCount) * 100).toFixed(1) : "0.0";
  const failedPct = totalCallsCount > 0 ? ((failedCount / totalCallsCount) * 100).toFixed(1) : "0.0";

  const filtered = calls.filter((c) => {
    const matchesSearch =
      c.orderId.includes(search) ||
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.normalizedPhone.includes(search);
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "confirmed" && c.outcome === "CONFIRMED") ||
      (statusFilter === "cancelled" && c.outcome === "CANCELLED") ||
      (statusFilter === "failed" &&
        (c.outcome === "NO_ANSWER" || c.outcome === "BUSY" || c.outcome === "RETRY_QUEUED"));
    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedCallId(expandedCallId === id ? null : id);
  };

  const handleExportCSV = () => {
    showToast("Generating call_history.csv export...", "info");
    const headers = "Order ID,Customer,Phone,DTMF Key,Attempts,Duration(s),Cost,Outcome,Started At\n";
    const rows = filtered
      .map(
        (c) =>
          `"${c.orderId}","${c.customerName}","${c.normalizedPhone}","${c.dtmfKey || "None"}","${c.attempts.length}","${c.durationSec}","${c.costAmount}","${c.outcome}","${c.startedAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `dialyra_call_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full space-y-8 pb-16">
      {/* 1. Call Summary KPI Card (Full Width - Zero Jargon) */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-stitch-card border border-outline-variant/30 flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Icon name="history" size={20} className="text-primary-container" />
            <span className="text-base sm:text-lg font-bold text-on-surface">
              Call Summary
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-on-surface-variant font-medium bg-surface-container-low px-3 py-1 rounded-lg border border-outline-variant/20">
              Business: <strong className="text-on-surface">{activeBusiness.name}</strong>
            </span>
            <span className="text-xs text-on-surface-variant font-medium bg-surface-container-low px-3 py-1 rounded-lg border border-outline-variant/20">
              Total: <strong>{totalCallsCount} calls</strong>
            </span>
          </div>
        </div>

        {/* 4 Circular Percentage Dials */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 bg-surface-container-low/60 rounded-xl p-4">
          {/* Stat 1: Total Volume */}
          <div className="flex flex-col items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all text-center">
            <span className="text-xs uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold mb-1.5">
              Total Calls
            </span>
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-purple-100 dark:stroke-surface-container"
                  strokeWidth="3.2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-purple-600 dark:stroke-purple-400"
                  strokeDasharray="100, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-extrabold text-on-surface leading-none">
                  {totalCallsCount}
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-0.5 uppercase tracking-wider">
                  Calls
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 mt-1.5">
              100% Volume
            </span>
          </div>

          {/* Stat 2: Confirmed */}
          <div className="flex flex-col items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all text-center">
            <span className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mb-1.5">
              Confirmed
            </span>
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-emerald-100 dark:stroke-surface-container"
                  strokeWidth="3.2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-emerald-500 dark:stroke-emerald-400"
                  strokeDasharray={`${confirmedPct}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-none">
                  {confirmedCount}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono mt-0.5">
                  {confirmedPct}%
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 mt-1.5">
              {confirmedCount} of {totalCallsCount} Confirmed
            </span>
          </div>

          {/* Stat 3: Cancelled */}
          <div className="flex flex-col items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all text-center">
            <span className="text-xs uppercase tracking-wider text-rose-700 dark:text-rose-400 font-bold mb-1.5">
              Cancelled
            </span>
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-rose-100 dark:stroke-surface-container"
                  strokeWidth="3.2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-rose-400 dark:stroke-rose-400"
                  strokeDasharray={`${cancelledPct}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-extrabold text-rose-700 dark:text-rose-300 leading-none">
                  {cancelledCount}
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold font-mono mt-0.5">
                  {cancelledPct}%
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 mt-1.5">
              {cancelledCount} of {totalCallsCount} Cancelled
            </span>
          </div>

          {/* Stat 4: Failed */}
          <div className="flex flex-col items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs hover:shadow-sm transition-all text-center">
            <span className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1.5">
              Failed
            </span>
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-amber-100 dark:stroke-surface-container"
                  strokeWidth="3.2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-amber-400 dark:stroke-amber-400"
                  strokeDasharray={`${failedPct}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-300 leading-none">
                  {failedCount}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold font-mono mt-0.5">
                  {failedPct}%
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mt-1.5">
              {failedCount} of {totalCallsCount} Failed
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Filter Bar (Stitch UI 100% Exact) */}
      <div
        className="bg-surface-container-lowest rounded-2xl p-6 shadow-stitch-card border border-outline-variant/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4"
      >
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
            <Icon name="search" size={20} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl text-base text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all border border-outline-variant/30 font-medium"
            placeholder="Search order, phone, or name..."
            type="text"
          />
        </div>

        {/* Center: Status Filter Pills (Dynamically Calculated Counts) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 bg-surface-container-low/70 p-1.5 rounded-xl shrink-0">
          {[
            { id: "all", label: `All (${totalCallsCount})` },
            { id: "confirmed", label: `Confirmed (${confirmedCount})`, color: "bg-tertiary-container" },
            { id: "cancelled", label: `Cancelled (${cancelledCount})`, color: "bg-error" },
            { id: "failed", label: `Failed (${failedCount})`, color: "bg-secondary-fixed-dim" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-primary-container text-on-primary font-bold shadow-md"
                  : "bg-surface-container-lowest hover:bg-surface-container text-on-surface"
              }`}
              type="button"
            >
              {tab.color && <span className={`w-2 h-2 rounded-full ${tab.color}`} />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Date Range & Export */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => showToast("Filtering by Today's date range", "info")}
            className="bg-surface-container-low hover:bg-surface-container text-on-surface text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all border border-outline-variant/30 font-bold active:scale-95"
            type="button"
          >
            <Icon name="schedule" size={18} className="text-on-surface-variant" />
            <span>Today</span>
            <Icon name="expand_more" size={16} className="text-on-surface-variant" />
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-primary-container text-on-primary text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md hover:bg-primary transition-all border border-transparent font-bold active:scale-95"
            type="button"
          >
            <Icon name="download" size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 3. Call History Table Card (Stitch UI 100% Exact) */}
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-stitch-card border border-outline-variant/30 overflow-hidden flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "750px" }}>
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant text-xs font-bold uppercase tracking-wider border-b border-outline-variant/20">
                <th className="w-12 px-4 py-3.5 text-center"></th>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer &amp; Phone</th>
                <th className="px-5 py-3.5">DTMF Key</th>
                <th className="px-5 py-3.5">Attempts</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Cost</th>
                <th className="px-5 py-3.5">Outcome Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-sm text-on-surface">
              {filtered.map((call) => {
                const isExpanded = expandedCallId === call.id;

                return (
                  <React.Fragment key={call.id}>
                    <tr
                      onClick={() => toggleExpand(call.id)}
                      className="hover:bg-surface-container-low/40 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3.5 text-center">
                        <button
                          className="w-6 h-6 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-transform"
                          type="button"
                        >
                          <Icon name={isExpanded ? "expand_more" : "chevron_right"} size={16} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm sm:text-base text-primary-container dark:text-primary-fixed-dim">
                            #{call.orderId}
                          </span>
                          <Icon name="shopping_cart" size={14} className="text-outline" />
                        </div>
                        <span className="text-xs text-on-surface-variant font-medium">
                          {call.orderAmount}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm sm:text-base font-bold text-on-surface tracking-wide">
                          {call.normalizedPhone}
                        </span>
                        <div className="text-xs sm:text-sm font-medium text-on-surface-variant">
                          {call.customerName} · {call.city}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {call.dtmfKey ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface font-mono font-bold text-xs border border-outline-variant/30 shadow-2xs">
                            <Icon name="dialpad" size={13} className="text-primary-container" />
                            <span>Key {call.dtmfKey} ({call.dtmfKey === "1" ? "Confirm" : call.dtmfKey === "2" ? "Cancel" : "Support"})</span>
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface-variant font-mono">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                          Attempt {call.attempts.length} of 3
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono font-medium text-on-surface">
                          {call.durationSec > 0 ? `${call.durationSec}s` : "0s"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono font-bold text-on-surface">
                          ৳ {call.costAmount ? call.costAmount.toFixed(2) : "0.00"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {call.outcome === "CONFIRMED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/15 text-on-tertiary-container text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                            CONFIRMED
                          </span>
                        )}
                        {call.outcome === "NO_ANSWER" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" />
                            NO ANSWER
                          </span>
                        )}
                        {call.outcome === "CANCELLED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-error" />
                            CANCELLED
                          </span>
                        )}
                        {call.outcome === "BUSY" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            BUSY
                          </span>
                        )}
                        {call.outcome === "TRANSFERRED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-primary-container" />
                            TRANSFERRED
                          </span>
                        )}
                        {call.outcome === "RETRY_QUEUED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim" />
                            RETRY QUEUED
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {call.canRetry ? (
                          <button
                            onClick={() => setCallToRetry(call)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs hover:shadow active:scale-95 transition-all inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                            type="button"
                            title="Retry Call"
                            aria-label="Retry Call"
                          >
                            <Icon name="history" size={15} />
                            <span>Retry</span>
                          </button>
                        ) : (
                          <span className="text-on-surface-variant/40">—</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Multi-Attempt Redial Timeline */}
                    {isExpanded && (
                      <tr className="bg-surface-container-low/30">
                        <td colSpan={9} className="p-4 pl-14">
                          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-xs space-y-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-outline block">
                              Multi-Attempt Redial Timeline for Order #{call.orderId}
                            </span>
                            <div className="space-y-2">
                              {call.attempts.map((att, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/60 border border-surface-container text-xs font-medium"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                                      #{att.attemptNumber}
                                    </span>
                                    <span className="font-semibold text-on-surface">
                                      {att.startedAt}
                                    </span>
                                    <span className="text-outline-variant">•</span>
                                    <span className="text-on-surface-variant">
                                      Duration: {att.durationSec}s
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="text-on-surface-variant font-mono">
                                      Cost: ৳ {att.costAmount.toFixed(2)}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        att.outcome === "CONFIRMED"
                                          ? "bg-tertiary-container/15 text-on-tertiary-container"
                                          : att.outcome === "CANCELLED"
                                          ? "bg-error-container text-on-error-container"
                                          : "bg-secondary-container/20 text-secondary"
                                      }`}
                                    >
                                      {att.outcome}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retry Call Confirmation Modal */}
      <ConfirmModal
        isOpen={!!callToRetry}
        onClose={() => setCallToRetry(null)}
        onConfirm={() => {
          if (callToRetry) {
            retryCall(callToRetry.orderId);
            setCallToRetry(null);
          }
        }}
        title="Retry Call"
        description={`Are you sure you want to trigger an immediate outbound phone call for Order #${callToRetry?.orderId} to ${callToRetry?.customerName} (${callToRetry?.normalizedPhone})?`}
        confirmText="Retry Now"
        variant="warning"
        icon="phone_in_talk"
      />
    </div>
  );
}
