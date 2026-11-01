"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";

export default function CallHistoryPage() {
  const { calls, retryCall, showToast } = useBusiness();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCallId, setExpandedCallId] = useState<string | null>("call-2");
  const [playingId, setPlayingId] = useState<string | null>(null);

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

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      showToast(`Streaming audio recording for Call Session #${id}`, "info");
    }
  };

  const handleExportCSV = () => {
    showToast("Generating dialyra_call_history.csv export...", "info");
    const headers = "Order ID,Customer,Phone,Attempts,Duration(s),Outcome,Started At\n";
    const rows = filtered
      .map(
        (c) =>
          `"${c.orderId}","${c.customerName}","${c.normalizedPhone}","${c.attempts.length}","${c.durationSec}","${c.outcome}","${c.startedAt}"`
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
      {/* 1. Telephony Overview & KPI Header Bar (Stitch UI 100% Exact) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Telephony Quick Stats Card (Spans 8 cols) */}
        <div
          className="xl:col-span-8 bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-stitch-card border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim animate-pulse" />
              <span className="text-sm font-bold text-on-surface uppercase tracking-wider">
                Live Telemetry
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container text-tertiary-fixed text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
              <span>3 Channels Active</span>
            </div>
          </div>

          {/* 4 Circular Percentage Dials (Prominent & Balanced) */}
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

        {/* Live Trunk Signal Status Card (Spans 4 cols) */}
        <div
          className="xl:col-span-4 bg-primary text-on-primary rounded-2xl p-6 md:p-8 shadow-stitch-card border border-primary-fixed/20 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon name="graphic_eq" size={24} className="text-tertiary-fixed-dim" />
              <span className="text-xl font-bold text-on-primary">
                Trunk Signal
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-primary-fixed">
              Jitter 4.2ms
            </span>
          </div>

          <div className="space-y-3 my-5">
            <div className="flex justify-between items-center text-sm text-primary-fixed-dim font-medium">
              <span>Banglalink Gateway</span>
              <span className="text-sm font-bold text-tertiary-fixed-dim">
                Nominal (-14 dBm)
              </span>
            </div>
            {/* Decibel meter SVG visualization (Stitch UI 100% Exact) */}
            <svg className="w-full h-8" fill="none" viewBox="0 0 280 24">
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="0" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="16" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="32" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="48" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="64" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="80" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="96" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="112" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="128" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="144" y="4" />
              <rect className="text-tertiary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="160" y="4" />
              <rect className="text-secondary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="176" y="4" />
              <rect className="text-secondary-fixed-dim opacity-90" fill="currentColor" height="16" rx="2" width="12" x="192" y="4" />
              <rect className="text-white/20" fill="currentColor" height="16" rx="2" width="12" x="208" y="4" />
              <rect className="text-white/20" fill="currentColor" height="16" rx="2" width="12" x="224" y="4" />
              <rect className="text-white/20" fill="currentColor" height="16" rx="2" width="12" x="240" y="4" />
              <rect className="text-white/20" fill="currentColor" height="16" rx="2" width="12" x="256" y="4" />
            </svg>
          </div>

          <div className="flex items-center justify-between pt-3 text-sm text-primary-fixed border-t border-white/10 font-medium">
            <span className="flex items-center gap-1.5">
              <Icon name="verified" size={18} className="text-tertiary-fixed-dim" />
              <span>WooCommerce Sync</span>
            </span>
            <span className="font-bold text-on-primary">ACTIVE · 0 errors</span>
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
            <Icon name="calendar_today" size={18} className="text-on-surface-variant" />
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant text-xs font-bold uppercase tracking-wider border-b border-outline-variant/20">
                <th className="w-12 px-4 py-3.5 text-center"></th>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Customer Phone</th>
                <th className="px-5 py-3.5">Attempts</th>
                <th className="px-5 py-3.5">Total Duration</th>
                <th className="px-5 py-3.5">Outcome Status</th>
                <th className="px-5 py-3.5 min-w-[200px]">Recording / Audio</th>
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
                          <span className="font-bold text-sm sm:text-base text-on-surface">
                            #{call.orderId}
                          </span>
                          <Icon name="shopping_cart" size={14} className="text-outline" />
                        </div>
                        <span className="text-code-sm font-code-sm text-on-surface-variant">
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
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        {call.recordingUrl ? (
                          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg w-fit border border-surface-container">
                            <button
                              onClick={() => togglePlay(call.id)}
                              className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 transition shadow-xs"
                              type="button"
                            >
                              <Icon name={playingId === call.id ? "close" : "play_arrow"} size={14} />
                            </button>
                            {/* Animated waveform bars */}
                            <div className="flex items-center gap-0.5 h-3">
                              {[40, 70, 90, 60, 80, 50, 75, 45].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-1 rounded-full bg-primary-container transition-all ${
                                    playingId === call.id ? "animate-pulse" : "opacity-60"
                                  }`}
                                  style={{ height: `${playingId === call.id ? h : 35}%` }}
                                />
                              ))}
                            </div>
                            <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">
                              0:{call.durationSec}
                            </span>
                          </div>
                        ) : (
                          <span className="text-body-sm font-body-sm italic text-on-surface-variant/70">
                            No audio recorded
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {call.canRetry ? (
                          <button
                            onClick={() => retryCall(call.orderId)}
                            className="bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-label-sm text-label-sm font-semibold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 shadow-sm"
                            type="button"
                          >
                            <Icon name="cached" size={15} />
                            <span>Retry Call Now</span>
                          </button>
                        ) : (
                          <span className="text-on-surface-variant/40">—</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Multi-Attempt Redial Timeline */}
                    {isExpanded && (
                      <tr className="bg-surface-container-low/30">
                        <td colSpan={8} className="p-4 pl-14">
                          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-xs space-y-3">
                            <span className="text-label-sm font-label-sm font-bold uppercase tracking-wider text-outline block">
                              Multi-Attempt Redial Timeline for Order #{call.orderId}
                            </span>
                            <div className="space-y-2">
                              {call.attempts.map((att, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/60 border border-surface-container text-body-sm font-body-sm"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-label-sm font-label-sm">
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
                                    <span className="text-on-surface-variant font-code-sm text-code-sm">
                                      Cost: ৳ {att.costAmount.toFixed(2)}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded text-label-sm font-label-sm font-bold ${
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
    </div>
  );
}
