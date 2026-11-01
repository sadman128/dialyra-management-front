"use client";

import React from "react";
import Link from "next/link";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";

export default function FlowsPage() {
  const { showToast } = useBusiness();

  const flows = [
    {
      id: "flow-1",
      name: "Order Confirmation Flow",
      version: "1.4",
      description: "Confirm cash on delivery orders, answer common questions, and offer automated support escalation transfer.",
      isDefault: true,
      dialyraId: "104",
      dtmfSummary: [
        { key: "1", label: "Confirm Order" },
        { key: "2", label: "Cancel Order" },
        { key: "3", label: "Support Transfer" },
      ],
    },
    {
      id: "flow-2",
      name: "VIP Verification Flow",
      version: "2.1",
      description: "High-value basket customer verification with instant human supervisor bridge.",
      isDefault: false,
      dialyraId: "105",
      dtmfSummary: [
        { key: "1", label: "VIP Priority Confirm" },
        { key: "2", label: "Cancel & Refund" },
      ],
    },
  ];

  const productRules = [
    { id: "pr-1", sku: "SKU-9901", name: "Premium Saffron 10g", flowName: "VIP Verification Flow", status: "Active" },
    { id: "pr-2", sku: "SKU-4412", name: "Organic Honey 500g", flowName: "Order Confirmation Flow", status: "Active" },
    { id: "pr-3", sku: "SKU-8823", name: "Cotton Panjabi (L)", flowName: "Order Confirmation Flow", status: "Active" },
  ];

  return (
    <div className="flex flex-col w-full space-y-8 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
            Call Flows
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
            Interactive voice menus, TTS greetings, and product routing rules.
          </p>
        </div>
        <Link
          href="/flows/builder/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary text-sm font-bold shadow-sm hover:shadow-md hover:bg-primary transition-all self-start sm:self-auto active:scale-95"
        >
          <Icon name="add" size={18} />
          <span>New Flow</span>
        </Link>
      </div>

      {/* 2. Published Flows Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-stitch-card border border-outline-variant/30 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center font-bold shrink-0">
                    <Icon name="schema" size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg text-on-surface font-bold">
                      {flow.name}
                    </h3>
                    <span className="font-mono text-xs text-outline block">
                      Flow #{flow.dialyraId} · v{flow.version}
                    </span>
                  </div>
                </div>

                {flow.isDefault && (
                  <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
                    Default
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {flow.description}
              </p>

              {/* DTMF Keys Summary Box */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-xs space-y-1.5 font-mono">
                <div className="text-outline uppercase text-[11px] font-bold tracking-wider">
                  Configured Keys:
                </div>
                <div className="flex flex-wrap gap-2">
                  {flow.dtmfSummary.map((act) => (
                    <span
                      key={act.key}
                      className="px-2 py-0.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-bold border border-outline-variant/30 shadow-xs"
                    >
                      Key {act.key} ➔ {act.label}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-lg bg-surface-container-lowest text-outline text-xs border border-outline-variant/30">
                    Timeout ➔ Repeat
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 mt-3.5 border-t border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-on-tertiary-container font-semibold">
                <Icon name="verified" size={16} />
                <span>Published to Engine</span>
              </span>
              <Link
                href={`/flows/builder/${flow.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-all shadow-xs hover:shadow border border-outline-variant/30 shrink-0 self-start sm:self-auto w-full sm:w-auto active:scale-95"
              >
                <span>Edit Flow</span>
                <Icon name="arrow_forward" size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Product Rules */}
      <div
        className="bg-surface-container-lowest rounded-xl p-5 shadow-stitch-card border border-outline-variant/30 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="layers" size={20} className="text-primary-container" />
            <h3 className="text-base sm:text-lg text-on-surface font-bold">
              Product Rules
            </h3>
          </div>
          <button
            onClick={() => showToast("Product mapping drawer triggered", "info")}
            className="text-xs sm:text-sm text-primary-container font-bold hover:underline flex items-center gap-1"
            type="button"
          >
            <Icon name="add_circle" size={16} />
            <span>Add Rule</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-surface-container text-outline text-xs uppercase tracking-wider font-bold">
                <th className="py-2.5 px-4">SKU</th>
                <th className="py-2.5 px-4">Product Name</th>
                <th className="py-2.5 px-4">IVR Flow</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs sm:text-sm text-on-surface">
              {productRules.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-on-surface">
                    {r.sku}
                  </td>
                  <td className="py-3 px-4 font-semibold text-on-surface">{r.name}</td>
                  <td className="py-3 px-4 text-primary-container font-semibold">
                    {r.flowName}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => showToast(`Edit mapping for ${r.sku}`, "info")}
                      className="text-xs text-outline hover:text-on-surface font-bold"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
