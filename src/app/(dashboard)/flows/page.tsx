"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBusiness } from "@/context/BusinessContext";
import {
  GitBranch,
  Plus,
  ChevronRight,
  ChevronDown,
  Volume2,
  CheckCircle2,
  XCircle,
  Headphones,
  RotateCcw,
  ArrowRight,
  Edit3,
} from "lucide-react";

interface DtmfNode {
  key: string;
  label: string;
  action: string;
  icon: string;
  color: "emerald" | "rose" | "purple" | "amber" | "blue";
}

interface FlowItem {
  id: string;
  businessId: string;
  name: string;
  version: string;
  description: string;
  isDefault: boolean;
  dialyraId: string;
  rule: string;
  greeting: string;
  dtmfNodes: DtmfNode[];
}

export default function FlowsPage() {
  const { activeBusiness } = useBusiness();

  const [flows] = useState<FlowItem[]>([
    // Business 1: SongsharerBazar
    {
      id: "flow-1",
      businessId: "biz-1",
      name: "Order Confirmation Flow",
      version: "1.4",
      description: "Confirm cash on delivery orders, record cancel reasons, and transfer to human support.",
      isDefault: true,
      dialyraId: "104",
      rule: "Standard Ingest Orders (All webhooks)",
      greeting: "Press 1 to confirm your order, press 2 to cancel, press 3 for support.",
      dtmfNodes: [
        {
          key: "1",
          label: "Confirm Order",
          action: "Order Confirmed ➔ End",
          icon: "check_circle",
          color: "emerald",
        },
        {
          key: "2",
          label: "Cancel Order",
          action: "Order Cancelled ➔ End",
          icon: "cancel",
          color: "rose",
        },
        {
          key: "3",
          label: "Support Transfer",
          action: "Queue #4001 ➔ Human Agent",
          icon: "headset_mic",
          color: "purple",
        },
        {
          key: "Timeout",
          label: "Repeat Menu",
          action: "Replay greeting (max 2 retries)",
          icon: "replay",
          color: "amber",
        },
      ],
    },
    {
      id: "flow-1b",
      businessId: "biz-1",
      name: "High Value Verification Flow",
      version: "1.2",
      description: "Dedicated flow for high-ticket orders with direct priority agent connection.",
      isDefault: false,
      dialyraId: "105",
      rule: "Order Amount >= ৳ 3,000 BDT",
      greeting: "Thank you for your high-value order. Press 1 to confirm, press 2 for personal desk agent.",
      dtmfNodes: [
        {
          key: "1",
          label: "VIP Confirm",
          action: "Priority Confirmed ➔ End",
          icon: "verified",
          color: "emerald",
        },
        {
          key: "2",
          label: "Senior Desk Rep",
          action: "Transfer ➔ Queue #4002",
          icon: "headset_mic",
          color: "purple",
        },
      ],
    },
    // Business 2: Uttara Super Shop
    {
      id: "flow-201",
      businessId: "biz-2",
      name: "Grocery Express Flow",
      version: "2.1",
      description: "Fast-dispatch confirmation for perishable produce and same-day grocery items.",
      isDefault: true,
      dialyraId: "201",
      rule: "Standard Grocery Orders (All orders)",
      greeting: "Your grocery delivery is ready. Press 1 to accept immediate dispatch.",
      dtmfNodes: [
        {
          key: "1",
          label: "Accept Dispatch",
          action: "Order Dispatched ➔ End",
          icon: "check_circle",
          color: "emerald",
        },
        {
          key: "2",
          label: "Modify Delivery Slot",
          action: "Transfer ➔ Grocery Desk #4003",
          icon: "headset_mic",
          color: "purple",
        },
      ],
    },
    {
      id: "flow-202",
      businessId: "biz-2",
      name: "Bulk Wholesale Flow",
      version: "1.0",
      description: "Specialized flow for institutional and business-tier wholesale grocery buyers.",
      isDefault: false,
      dialyraId: "202",
      rule: "Order Amount >= ৳ 5,000 BDT (Wholesale)",
      greeting: "Wholesale Desk. Press 1 to verify terms, 2 for account manager.",
      dtmfNodes: [
        {
          key: "1",
          label: "Verify Terms",
          action: "Terms Confirmed ➔ End",
          icon: "verified",
          color: "emerald",
        },
        {
          key: "2",
          label: "Account Manager",
          action: "Direct Ring ➔ #4004",
          icon: "headset_mic",
          color: "purple",
        },
      ],
    },
  ]);

  const [expandedFlowIds, setExpandedFlowIds] = useState<Record<string, boolean>>({
    "flow-1": false,
  });

  const toggleExpand = (flowId: string) => {
    setExpandedFlowIds((prev) => ({
      ...prev,
      [flowId]: !prev[flowId],
    }));
  };

  // Close modals on focus loss or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedFlowIds({});
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentFlows = flows.filter((f) => f.businessId === activeBusiness.id);

  const getNodeColorClass = (color: DtmfNode["color"]) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          badge: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
          icon: "text-emerald-600 dark:text-emerald-400",
        };
      case "rose":
        return {
          bg: "bg-rose-500/10",
          border: "border-rose-500/30",
          badge: "bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/30",
          icon: "text-rose-600 dark:text-rose-400",
        };
      case "purple":
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          badge: "bg-purple-500/20 text-[#9a55ff] border-purple-500/30",
          icon: "text-[#9a55ff]",
        };
      case "amber":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          badge: "bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30",
          icon: "text-amber-600 dark:text-amber-400",
        };
      default:
        return {
          bg: "bg-sky-500/10",
          border: "border-sky-500/30",
          badge: "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/30",
          icon: "text-sky-600 dark:text-sky-400",
        };
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Call Flows</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <GitBranch size={20} />
            </span>
            Call Flows
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Call flows and keypad routing for{" "}
            <strong className="text-on-surface font-bold">{activeBusiness.name}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/flows/builder/new"
            className="btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all font-bold active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>New Flow</span>
          </Link>
        </div>
      </div>

      {/* 2. Call Flows Table */}
      <div className="bg-white dark:bg-[#1a1329] rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "750px" }}>
            <thead>
              <tr className="bg-surface-container-low/80 text-on-surface text-xs font-bold uppercase tracking-wider border-b border-outline-variant/20">
                <th className="w-12 px-4 py-3.5 text-center"></th>
                <th className="px-5 py-3.5">Flow Name</th>
                <th className="px-5 py-3.5">Flow Number</th>
                <th className="px-5 py-3.5">Rule</th>
                <th className="px-5 py-3.5">Default</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
              {currentFlows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant text-sm font-medium">
                    No call flows found for this business.
                  </td>
                </tr>
              ) : (
                currentFlows.map((flow) => {
                  const isExpanded = !!expandedFlowIds[flow.id];
                  return (
                    <React.Fragment key={flow.id}>
                      {/* Main Summary Row */}
                      <tr
                        onClick={() => toggleExpand(flow.id)}
                        className="hover:bg-purple-500/[0.04] transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3.5 text-center">
                          <button
                            className="w-6 h-6 rounded-full bg-surface-container-low text-on-surface-variant hover:text-[#9a55ff] flex items-center justify-center transition-transform"
                            type="button"
                            aria-label="Toggle details"
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
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-[#9a55ff] flex items-center justify-center shrink-0">
                              <GitBranch size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-on-surface group-hover:text-[#9a55ff] transition-colors">
                                {flow.name}
                              </div>
                              <div className="text-xs text-on-surface-variant">
                                v{flow.version}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#9a55ff] dark:text-[#da8cff]">
                            #{flow.dialyraId}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-medium">
                            {flow.rule}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          {flow.isDefault ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Default</span>
                            </span>
                          ) : (
                            <span className="text-xs text-on-surface-variant font-mono">—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/flows/builder/${flow.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-gradient-primary text-white text-xs font-bold shadow-2xs hover:shadow transition-all active:scale-95 cursor-pointer"
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </Link>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-surface-container-low/40">
                          <td colSpan={6} className="px-6 py-4 border-t border-outline-variant/15">
                            <div className="space-y-3.5 max-w-4xl">
                              {/* Flow Greeting Audio */}
                              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#1a1329] border border-outline-variant/30 shadow-2xs">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-[#9a55ff] flex items-center justify-center shrink-0">
                                  <Volume2 size={16} />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[11px] uppercase font-bold text-on-surface-variant block">
                                    Audio Greeting
                                  </span>
                                  <span className="text-xs sm:text-sm font-medium text-on-surface">
                                    &quot;{flow.greeting}&quot;
                                  </span>
                                </div>
                              </div>

                              {/* DTMF Nodes Grid */}
                              <div>
                                <span className="text-[11px] uppercase font-bold text-on-surface-variant block mb-2">
                                  Keypad Actions (DTMF)
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                  {flow.dtmfNodes.map((node) => {
                                    const colors = getNodeColorClass(node.color);
                                    return (
                                      <div
                                        key={node.key}
                                        className={`p-3 rounded-xl border shadow-2xs transition-all flex flex-col justify-between ${colors.bg} ${colors.border}`}
                                      >
                                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                          <span
                                            className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold border shadow-2xs ${colors.badge}`}
                                          >
                                            {node.key.startsWith("Key") ? node.key : `Key ${node.key}`}
                                          </span>
                                          {node.color === "emerald" ? (
                                            <CheckCircle2 size={15} className={colors.icon} />
                                          ) : node.color === "rose" ? (
                                            <XCircle size={15} className={colors.icon} />
                                          ) : node.color === "purple" ? (
                                            <Headphones size={15} className={colors.icon} />
                                          ) : (
                                            <RotateCcw size={15} className={colors.icon} />
                                          )}
                                        </div>
                                        <div>
                                          <span className="text-xs font-bold text-on-surface block leading-tight">
                                            {node.label}
                                          </span>
                                          <span className="text-[11px] text-on-surface-variant font-medium mt-0.5 block truncate">
                                            {node.action}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
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
      </div>
    </div>
  );
}
