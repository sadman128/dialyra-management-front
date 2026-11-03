"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface Extension {
  id: string;
  number: string;
  type: "Agent" | "Department";
  targetName: string;
  protocol: string;
  status: "Active" | "Standby";
}

export default function ExtensionsPage() {
  const { showToast } = useBusiness();

  const [extensions, setExtensions] = useState<Extension[]>([
    {
      id: "ext-1",
      number: "101",
      type: "Agent",
      targetName: "Sadman Kabir",
      protocol: "SIP / UDP",
      status: "Active",
    },
    {
      id: "ext-2",
      number: "102",
      type: "Agent",
      targetName: "Customer Rep B",
      protocol: "SIP / UDP",
      status: "Active",
    },
    {
      id: "ext-3",
      number: "103",
      type: "Agent",
      targetName: "Senior Desk Lead",
      protocol: "SIP / UDP",
      status: "Active",
    },
    {
      id: "ext-4",
      number: "4001",
      type: "Department",
      targetName: "Customer Support Queue",
      protocol: "Internal Queue",
      status: "Active",
    },
    {
      id: "ext-5",
      number: "4002",
      type: "Department",
      targetName: "Order Escalations Queue",
      protocol: "Internal Queue",
      status: "Active",
    },
  ]);

  const [filterType, setFilterType] = useState<"all" | "Agent" | "Department">("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [extToDelete, setExtToDelete] = useState<Extension | null>(null);
  const [formData, setFormData] = useState({
    number: "105",
    type: "Agent" as "Agent" | "Department",
    targetName: "",
    protocol: "SIP / UDP",
  });

  const filteredExtensions = extensions.filter(
    (e) => filterType === "all" || e.type === filterType
  );

  const handleTestRing = (number: string, target: string) => {
    showToast(`Test call ringing on Ext #${number} (${target})`, "info");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number.trim() || !formData.targetName.trim()) return;

    const newExt: Extension = {
      id: `ext-${Date.now()}`,
      number: formData.number,
      type: formData.type,
      targetName: formData.targetName,
      protocol: formData.type === "Agent" ? "SIP / UDP" : "Internal Queue",
      status: "Active",
    };

    setExtensions([...extensions, newExt]);
    setAddModalOpen(false);
    showToast(`Extension #${formData.number} registered`, "success");
  };

  const handleDelete = (id: string, number: string) => {
    setExtensions((prev) => prev.filter((e) => e.id !== id));
    showToast(`Extension #${number} deleted`, "info");
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
            Extensions
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
            Internal dialing numbers mapped to agents and queues.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              number: `${extensions.length > 0 ? 100 + extensions.length + 1 : 101}`,
              type: "Agent",
              targetName: "",
              protocol: "SIP / UDP",
            });
            setAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:shadow hover:bg-primary transition-all active:scale-[0.99] self-start sm:self-auto"
          type="button"
        >
          <Icon name="add" size={18} />
          <span>Add Extension</span>
        </button>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Extensions
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {extensions.length}
              </span>
              <span className="text-xs text-on-tertiary-container font-semibold">
                Mapped
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <Icon name="dialpad" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Agent Extensions
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {extensions.filter((e) => e.type === "Agent").length}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">100-series</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
            <Icon name="support_agent" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Queue Extensions
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {extensions.filter((e) => e.type === "Department").length}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">4000-series</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-tertiary-container">
            <Icon name="call_split" size={22} />
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "Agent", "Department"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border ${
              filterType === t
                ? "bg-primary-container text-on-primary border-primary-container shadow"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-outline-variant/30"
            }`}
            type="button"
          >
            {t === "all" ? `All (${extensions.length})` : `${t}s`}
          </button>
        ))}
      </div>

      {/* 4. Extensions Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/80 border-b border-surface-container text-outline text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Extension</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Transport</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs sm:text-sm text-on-surface">
              {filteredExtensions.map((ext) => (
                <tr key={ext.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 font-mono font-bold text-on-surface bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/20 shadow-xs">
                      <Icon name="dialpad" size={15} className="text-primary-container" />
                      #{ext.number}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant font-bold text-xs">
                        <Icon
                          name={ext.type === "Agent" ? "person" : "call_split"}
                          size={16}
                        />
                      </div>
                      <span className="font-bold text-on-surface">{ext.targetName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        ext.type === "Agent"
                          ? "bg-primary-container/15 text-primary-container border border-primary-container/30"
                          : "bg-secondary-container/20 text-on-secondary-container border border-secondary-container/30"
                      }`}
                    >
                      {ext.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-on-surface-variant">
                    {ext.protocol}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {ext.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleTestRing(ext.number, ext.targetName)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold shadow-xs hover:shadow transition-all"
                        title="Test Call Ring"
                        type="button"
                      >
                        <Icon name="ring_volume" size={15} />
                        <span>Test</span>
                      </button>
                      <button
                        onClick={() => setExtToDelete(ext)}
                        className="p-1 rounded-lg text-outline hover:text-error hover:bg-error-container/20 shadow-xs transition-colors"
                        title="Delete Extension"
                        type="button"
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Extension Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Add Extension
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="e.g. 104"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono font-bold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "Agent" | "Department",
                        })
                      }
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs"
                    >
                      <option value="Agent">Agent Softphone</option>
                      <option value="Department">Department Queue</option>
                    </select>
                    <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Destination / Target Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.targetName}
                  onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                  placeholder="e.g. Support Desk or Agent Name"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low font-semibold shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold shadow-sm hover:shadow hover:bg-primary transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Extension Confirmation Modal */}
      <ConfirmModal
        isOpen={!!extToDelete}
        onClose={() => setExtToDelete(null)}
        onConfirm={() => {
          if (extToDelete) {
            handleDelete(extToDelete.id, extToDelete.number);
            setExtToDelete(null);
          }
        }}
        title="Delete Extension"
        description={`Are you sure you want to delete Extension #${extToDelete?.number} (${extToDelete?.targetName})? Call routing to this destination will stop working.`}
        confirmText="Delete Extension"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
