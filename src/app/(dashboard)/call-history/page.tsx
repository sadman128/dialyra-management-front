"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  History,
  Search,
  ChevronRight,
  ChevronDown,
  Download,
  Calendar,
  RotateCw,
  ShoppingBag,
  Hash,
  Clock,
  PhoneCall,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Volume2,
} from "lucide-react";

export default function CallHistoryPage() {
  const { activeBusiness, calls, retryCall, showToast } = useBusiness();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCallId, setExpandedCallId] = useState<string | null>(null);
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);
  const [callToRetry, setCallToRetry] = useState<typeof calls[0] | null>(null);
  const [showAll, setShowAll] = useState(false);

  const totalCallsCount = calls.length;
  const confirmedCount = calls.filter((c) => c.outcome === "CONFIRMED").length;
  const cancelledCount = calls.filter((c) => c.outcome === "CANCELLED").length;
  const failedCount = calls.filter(
    (c) => c.outcome === "NO_ANSWER" || c.outcome === "BUSY" || c.outcome === "RETRY_QUEUED"
  ).length;

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

  const displayedCalls = showAll ? filtered : filtered.slice(0, 7);

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
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Call History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <History size={20} />
            </span>
            Call History
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Call records and interaction logs for{" "}
            <strong className="text-on-surface font-bold">{activeBusiness.name}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-on-surface-variant bg-white dark:bg-[#121215] px-4 py-2 rounded-full border border-outline-variant/30 dark:border-zinc-800/80 shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync: <strong>{totalCallsCount} calls recorded</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#121215] rounded-2xl p-4 border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Search input with pill styling */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <Search size={17} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:bg-white dark:focus:bg-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 transition-all border border-outline-variant/30 font-medium shadow-2xs"
            placeholder="Search by Order ID, phone, or customer name..."
            type="text"
          />
        </div>

        {/* Center: Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-surface-container-low p-1.5 rounded-full shrink-0 border border-outline-variant/30">
          {[
            { id: "all", label: `All (${totalCallsCount})` },
            { id: "confirmed", label: `Confirmed (${confirmedCount})` },
            { id: "cancelled", label: `Cancelled (${cancelledCount})` },
            { id: "failed", label: `Failed (${failedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "btn-gradient-warning text-gray-950 font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Date Range & Export */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => showToast("Filtering by Today's date range", "info")}
            className="bg-surface-container-low hover:bg-surface-container text-on-surface text-xs sm:text-sm px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-2xs transition-all border border-outline-variant/30 font-bold active:scale-95 cursor-pointer"
            type="button"
          >
            <Calendar size={15} className="text-[#9a55ff]" />
            <span>Today</span>
            <ChevronDown size={14} className="text-on-surface-variant" />
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all font-bold active:scale-95 cursor-pointer"
            type="button"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Call History Table Card */}
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "800px" }}>
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant text-xs font-semibold border-b border-outline-variant/20">
                <th className="w-12 px-4 py-3 text-center"></th>
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">DTMF Key</th>
                <th className="px-5 py-3">Attempts</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Cost</th>
                <th className="px-5 py-3">Outcome Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
              {displayedCalls.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-on-surface-variant text-sm font-medium">
                    No calls found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              ) : (
                displayedCalls.map((call) => {
                  const isExpanded = expandedCallId === call.id;

                  return (
                    <React.Fragment key={call.id}>
                      <tr
                        onClick={() => toggleExpand(call.id)}
                        className="hover:bg-purple-500/[0.04] transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3.5 text-center">
                          <button
                            className="w-6 h-6 rounded-full bg-surface-container-low text-on-surface-variant hover:text-[#9a55ff] flex items-center justify-center transition-transform"
                            type="button"
                          >
                            <ChevronDown
                              size={15}
                              className={`transition-transform duration-200 ${
                                isExpanded ? "rotate-0" : "-rotate-90"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm sm:text-base text-[#9a55ff] dark:text-[#da8cff]">
                              #{call.orderId}
                            </span>
                            <ShoppingBag size={13} className="text-on-surface-variant/60" />
                          </div>
                          <span className="text-xs text-on-surface-variant font-medium">
                            {call.orderAmount}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-sm text-on-surface">
                          {call.customerName}
                        </td>
                        <td className="px-5 py-4 font-mono text-sm sm:text-base font-bold text-on-surface tracking-wide">
                          {call.normalizedPhone}
                        </td>
                        <td className="px-5 py-4">
                          {call.dtmfKey ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-mono font-bold text-xs border border-outline-variant/30 shadow-2xs">
                              <span>Key {call.dtmfKey}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-on-surface-variant font-mono">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/30">
                            Attempt {call.attempts.length} of 3
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs sm:text-sm font-mono font-medium text-on-surface">
                            {call.durationSec > 0 ? `${call.durationSec}s` : "0s"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs sm:text-sm font-mono font-bold text-on-surface">
                            ৳ {call.costAmount ? call.costAmount.toFixed(2) : "0.00"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {call.outcome === "CONFIRMED" && (
                            <span className="font-bold text-xs sm:text-sm text-emerald-500 select-none">
                              CONFIRMED
                            </span>
                          )}
                          {call.outcome === "CANCELLED" && (
                            <span className="font-bold text-xs sm:text-sm text-rose-500 select-none">
                              CANCELLED
                            </span>
                          )}
                          {call.outcome !== "CONFIRMED" && call.outcome !== "CANCELLED" && (
                            <span className="font-bold text-xs sm:text-sm text-amber-500 select-none">
                              {call.outcome.replace("_", " ")}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          {call.canRetry ? (
                            <button
                              onClick={() => setCallToRetry(call)}
                              className="w-[84px] h-[30px] rounded-full btn-gradient-warning text-gray-950 font-bold shadow-xs hover:shadow active:scale-95 transition-all inline-flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                              type="button"
                              title="Retry Call"
                              aria-label="Retry Call"
                            >
                              <RotateCw size={13} className="text-gray-950" />
                              <span>Retry</span>
                            </button>
                          ) : (
                            <span className="text-on-surface-variant/40">—</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Multi-Attempt Redial Timeline */}
                      {isExpanded && (
                        <tr className="bg-surface-container-low/40">
                          <td colSpan={10} className="p-4 pl-12 sm:pl-16">
                            <div className="bg-white dark:bg-[#18181b] rounded-2xl p-4 border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/15 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-[#9a55ff]">
                                    Call Session Diagnostics for Order #{call.orderId}
                                  </span>
                                  <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-md border border-outline-variant/20">
                                    Trunk: Trunk #20 (PJSIP Main)
                                  </span>
                                </div>
                                {call.recordingUrl ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (playingCallId === call.id) {
                                        setPlayingCallId(null);
                                      } else {
                                        setPlayingCallId(call.id);
                                        showToast(`Playing recording for order #${call.orderId}`, "info");
                                      }
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full btn-gradient-primary text-white text-xs font-bold shadow-xs hover:shadow transition active:scale-95 cursor-pointer"
                                  >
                                    <Play size={12} className={playingCallId === call.id ? "animate-pulse" : ""} />
                                    <span>{playingCallId === call.id ? "Playing Audio..." : "Play Recording"}</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-on-surface-variant font-medium">
                                    No audio recording (call unanswered)
                                  </span>
                                )}
                              </div>

                              <div className="space-y-2">
                                {call.attempts.map((att, idx) => (
                                 <div
                                    key={idx}
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs sm:text-sm font-medium"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="w-6 h-6 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                        #{att.attemptNumber}
                                      </span>
                                      <span className="font-semibold text-on-surface">
                                        {att.startedAt}
                                      </span>
                                      <span className="text-on-surface-variant/40">/</span>
                                      <span className="text-on-surface-variant">
                                        Duration: {att.durationSec}s
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-on-surface font-mono font-semibold">
                                        Cost: ৳ {att.costAmount.toFixed(2)}
                                      </span>
                                      <span
                                        className={
                                          att.outcome === "CONFIRMED"
                                            ? "badge-inverse-success text-xs"
                                            : att.outcome === "CANCELLED"
                                            ? "badge-inverse-danger text-xs"
                                            : "badge-inverse-warning text-xs"
                                        }
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paging Footer with Show All Button */}
        {filtered.length > 7 && (
          <div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/20 flex items-center justify-between px-6 text-xs sm:text-sm">
            <span className="text-on-surface-variant font-medium">
              Showing {displayedCalls.length} of {filtered.length} calls recorded.
            </span>
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-gradient-primary px-5 py-2 rounded-full text-xs font-bold text-white shadow-xs hover:shadow active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{showAll ? "Show Less" : `Show All (${filtered.length} Calls)`}</span>
            </button>
          </div>
        )}
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
        icon="history"
      />
    </div>
  );
}
