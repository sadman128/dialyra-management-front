"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBusiness } from "@/context/BusinessContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
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
  Trash2,
  X,
  Sliders,
  Check,
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
  greeting: string;
  dtmfNodes: DtmfNode[];
}

interface RoutingRule {
  id: string;
  businessId: string;
  name: string;
  type: "default" | "order_ids" | "price_threshold";
  conditionText: string;
  flowName: string;
  status: "Active" | "Standby";
}

export default function FlowsPage() {
  const { activeBusiness, showToast } = useBusiness();

  const [flows] = useState<FlowItem[]>([
    // Business 1: SongsharerBazar (Standalone)
    {
      id: "flow-1",
      businessId: "biz-1",
      name: "Order Confirmation Flow",
      version: "1.4",
      description: "Confirm cash on delivery orders, record cancel reasons, and transfer to human support.",
      isDefault: true,
      dialyraId: "104",
      greeting: "Press 1 to confirm your order, press 2 to cancel, press 3 for support.",
      dtmfNodes: [
        {
          key: "1",
          label: "Confirm Order",
          action: "Order Confirmed ➔ End",
          icon: "check_circle",
          color: "emerald" as const,
        },
        {
          key: "2",
          label: "Cancel Order",
          action: "Order Cancelled ➔ End",
          icon: "cancel",
          color: "rose" as const,
        },
        {
          key: "3",
          label: "Support Transfer",
          action: "Queue #4001 ➔ Human Agent",
          icon: "headset_mic",
          color: "purple" as const,
        },
        {
          key: "Timeout",
          label: "Repeat Menu",
          action: "Replay greeting (max 2 retries)",
          icon: "replay",
          color: "amber" as const,
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
      greeting: "Thank you for your high-value order. Press 1 to confirm, press 2 for personal desk agent.",
      dtmfNodes: [
        {
          key: "1",
          label: "VIP Confirm",
          action: "Priority Confirmed ➔ End",
          icon: "verified",
          color: "emerald" as const,
        },
        {
          key: "2",
          label: "Senior Desk Rep",
          action: "Transfer ➔ Queue #4002",
          icon: "headset_mic",
          color: "purple" as const,
        },
      ],
    },
    // Business 2: Uttara Super Shop (Standalone)
    {
      id: "flow-201",
      businessId: "biz-2",
      name: "Grocery Express Flow",
      version: "2.1",
      description: "Fast-dispatch confirmation for perishable produce and same-day grocery items.",
      isDefault: true,
      dialyraId: "201",
      greeting: "Your Uttara Super Shop grocery delivery is ready. Press 1 to accept immediate dispatch.",
      dtmfNodes: [
        {
          key: "1",
          label: "Accept Dispatch",
          action: "Order Dispatched ➔ End",
          icon: "check_circle",
          color: "emerald" as const,
        },
        {
          key: "2",
          label: "Modify Delivery Slot",
          action: "Transfer ➔ Grocery Desk #4003",
          icon: "headset_mic",
          color: "purple" as const,
        },
      ],
    },
    {
      id: "flow-202",
      businessId: "biz-2",
      name: "Bulk Wholesale Flow",
      version: "1.0",
      description: "Specialized IVR for institutional and business-tier wholesale grocery buyers.",
      isDefault: false,
      dialyraId: "202",
      greeting: "Uttara Super Shop Wholesale Desk. Press 1 to verify credit terms, 2 for account manager.",
      dtmfNodes: [
        {
          key: "1",
          label: "Verify Terms",
          action: "Terms Confirmed ➔ End",
          icon: "verified",
          color: "emerald" as const,
        },
        {
          key: "2",
          label: "Account Manager",
          action: "Direct Ring ➔ #4004",
          icon: "headset_mic",
          color: "purple" as const,
        },
      ],
    },
  ]);

  const [rules, setRules] = useState<RoutingRule[]>([
    // Rules for SongsharerBazar (biz-1)
    {
      id: "rule-1",
      businessId: "biz-1",
      name: "Standard Ingest Orders",
      type: "default",
      conditionText: "Default Flow (All other orders)",
      flowName: "Order Confirmation Flow",
      status: "Active",
    },
    {
      id: "rule-2",
      businessId: "biz-1",
      name: "High Value Orders",
      type: "price_threshold",
      conditionText: "Order Amount >= ৳ 3,000 BDT",
      flowName: "High Value Verification Flow",
      status: "Active",
    },
    {
      id: "rule-3",
      businessId: "biz-1",
      name: "Manual Order Group",
      type: "order_ids",
      conditionText: "Order IDs: 1042, 1045, 1099, 1102",
      flowName: "High Value Verification Flow",
      status: "Active",
    },
    // Rules for Uttara Super Shop (biz-2)
    {
      id: "rule-201",
      businessId: "biz-2",
      name: "Standard Grocery Orders",
      type: "default",
      conditionText: "Default Flow (All grocery orders)",
      flowName: "Grocery Express Flow",
      status: "Active",
    },
    {
      id: "rule-202",
      businessId: "biz-2",
      name: "Wholesale Bulk Tier",
      type: "price_threshold",
      conditionText: "Order Amount >= ৳ 5,000 BDT",
      flowName: "Bulk Wholesale Flow",
      status: "Active",
    },
    {
      id: "rule-203",
      businessId: "biz-2",
      name: "Corporate Order IDs",
      type: "order_ids",
      conditionText: "Order IDs: 201, 203, 205",
      flowName: "Bulk Wholesale Flow",
      status: "Active",
    },
  ]);

  // Scoped strictly per active business
  const currentFlows = flows.filter((f) => f.businessId === activeBusiness.id);
  const currentRules = rules.filter((r) => r.businessId === activeBusiness.id);

  // Add Rule Modal
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<RoutingRule | null>(null);
  const [ruleForm, setRuleForm] = useState({
    name: "",
    type: "price_threshold" as "default" | "order_ids" | "price_threshold",
    thresholdAmount: "3000",
    orderIdsList: "1050, 1051, 1052",
    flowName: "",
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    let condition = "Default Catch-All";
    if (ruleForm.type === "price_threshold") {
      condition = `Order Amount >= ৳ ${ruleForm.thresholdAmount} BDT`;
    } else if (ruleForm.type === "order_ids") {
      condition = `Order IDs: ${ruleForm.orderIdsList}`;
    }

    const targetFlow = ruleForm.flowName || currentFlows[0]?.name || "Default Flow";

    const newRule: RoutingRule = {
      id: `rule-${Date.now()}`,
      businessId: activeBusiness.id,
      name: ruleForm.name || (ruleForm.type === "price_threshold" ? "Price Filter" : "Order IDs Filter"),
      type: ruleForm.type,
      conditionText: condition,
      flowName: targetFlow,
      status: "Active",
    };

    setRules([...rules, newRule]);
    setRuleModalOpen(false);
    showToast(`Rule "${newRule.name}" created`, "success");
  };

  const handleDeleteRule = (id: string, name: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    showToast(`Rule "${name}" removed`, "info");
  };

  const getNodeColorClass = (color: DtmfNode["color"]) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          badge: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
          icon: "text-emerald-600 dark:text-emerald-400",
        };
      case "rose":
        return {
          bg: "bg-rose-500/10",
          border: "border-rose-500/30",
          badge: "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
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
            Call Flows &amp; IVR Menus
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Voice menus, keypad key responses, and order routing rules for{" "}
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

      {/* 2. Visual Flow Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {currentFlows.map((flow) => (
          <div
            key={flow.id}
            className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between space-y-5 transition-all"
          >
            <div className="space-y-4">
              {/* Flow Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <GitBranch size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg text-on-surface font-bold">
                      {flow.name}
                    </h3>
                    <span className="font-mono text-xs text-on-surface-variant">
                      Flow #{flow.dialyraId} · v{flow.version}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  {flow.id === activeBusiness.activeFlowId && (
                    <span className="badge-inverse-success text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active for {activeBusiness.name}
                    </span>
                  )}
                  {flow.isDefault && (
                    <span className="badge-inverse-info text-xs font-bold">
                      Default
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-medium">
                {flow.description}
              </p>

              {/* Diagram / Tree Visualizer */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                {/* Greeting Node */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#1a1329] border border-outline-variant/30 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-[#9a55ff] flex items-center justify-center shrink-0">
                    <Volume2 size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-on-surface truncate">
                    &quot;{flow.greeting}&quot;
                  </span>
                </div>

                {/* Connecting branch line */}
                <div className="flex items-center justify-center">
                  <div className="h-3 w-px bg-outline-variant" />
                </div>

                {/* DTMF Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                          <span className="text-xs sm:text-sm font-bold text-on-surface block leading-tight">
                            {node.label}
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium mt-0.5 block truncate">
                            {node.action}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <Check size={14} />
                <span>Published &amp; Ready</span>
              </span>
              <Link
                href={`/flows/builder/${flow.id}`}
                className="btn-gradient-primary text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs hover:shadow transition-all font-bold active:scale-95 cursor-pointer"
              >
                <span>Edit Flow</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Routing Rules */}
      <div className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg text-on-surface font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-info" />
              Routing Rules
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
              Route orders to specific call flows using price thresholds, order IDs, or default fallbacks.
            </p>
          </div>
          <button
            onClick={() => setRuleModalOpen(true)}
            className="btn-gradient-primary text-white font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-1.5 shadow-2xs hover:shadow transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
            type="button"
          >
            <Plus size={16} />
            <span>Add Rule</span>
          </button>
        </div>

        {/* Rules Table */}
        <div className="overflow-x-auto border border-outline-variant/20 rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container-low/80 border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Target Flow</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface">
              {currentRules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-on-surface-variant font-medium">
                    No custom routing rules configured for this business yet.
                  </td>
                </tr>
              ) : (
                currentRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-purple-500/[0.03] transition-colors">
                    <td className="py-3 px-4 font-bold text-on-surface">
                      {rule.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface">
                        {rule.conditionText}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#9a55ff]">
                      {rule.flowName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge-inverse-success text-xs font-bold">
                        {rule.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setRuleToDelete(rule)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Rule"
                        type="button"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rule Modal */}
      {ruleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Add Routing Rule
              </h3>
              <button
                onClick={() => setRuleModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  placeholder="e.g. VIP High Ticket Orders"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Rule Type
                </label>
                <div className="relative">
                  <select
                    value={ruleForm.type}
                    onChange={(e) =>
                      setRuleForm({
                        ...ruleForm,
                        type: e.target.value as typeof ruleForm.type,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 appearance-none pr-8 cursor-pointer"
                  >
                    <option value="price_threshold">Price Threshold (Orders &gt;= Minimum Amount)</option>
                    <option value="order_ids">Specific Order IDs (Comma-separated)</option>
                    <option value="default">Default Flow (Fallback)</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              {ruleForm.type === "price_threshold" && (
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Minimum Order Amount (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={ruleForm.thresholdAmount}
                    onChange={(e) =>
                      setRuleForm({ ...ruleForm, thresholdAmount: e.target.value })
                    }
                    placeholder="3000"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20"
                  />
                </div>
              )}

              {ruleForm.type === "order_ids" && (
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Order IDs (Comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={ruleForm.orderIdsList}
                    onChange={(e) =>
                      setRuleForm({ ...ruleForm, orderIdsList: e.target.value })
                    }
                    placeholder="1042, 1045, 1099, 1102"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20"
                  />
                  <span className="text-[11px] text-on-surface-variant mt-1 block font-medium">
                    Type order numbers separated by commas.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Target Call Flow
                </label>
                <div className="relative">
                  <select
                    value={ruleForm.flowName}
                    onChange={(e) => setRuleForm({ ...ruleForm, flowName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 appearance-none pr-8 cursor-pointer"
                  >
                    {currentFlows.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRuleModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface hover:bg-surface-container font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Routing Rule Confirmation Modal */}
      <ConfirmModal
        isOpen={!!ruleToDelete}
        onClose={() => setRuleToDelete(null)}
        onConfirm={() => {
          if (ruleToDelete) {
            handleDeleteRule(ruleToDelete.id, ruleToDelete.name);
            setRuleToDelete(null);
          }
        }}
        title="Delete Routing Rule"
        description={`Are you sure you want to remove "${ruleToDelete?.name}"? Orders previously matched by this rule will fall back to the default call flow.`}
        confirmText="Delete Rule"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
