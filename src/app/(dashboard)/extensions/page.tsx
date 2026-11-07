"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  PhoneCall,
  Plus,
  ChevronRight,
  Network,
  Users,
  CheckCircle2,
  Trash2,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";

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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [extToDelete, setExtToDelete] = useState<Extension | null>(null);

  // Close modals on focus loss or Escape
  React.useEffect(() => {
    const handleBlur = () => {
      setCreateModalOpen(false);
      setExtToDelete(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCreateModalOpen(false);
        setExtToDelete(null);
      }
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [formData, setFormData] = useState({
    number: "104",
    type: "Agent" as "Agent" | "Department",
    targetName: "",
    protocol: "SIP / UDP",
  });

  const filteredExtensions = extensions.filter(
    (e) => filterType === "all" || e.type === filterType
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.targetName.trim()) return;

    const newExt: Extension = {
      id: `ext-${Date.now()}`,
      number: formData.number,
      type: formData.type,
      targetName: formData.targetName,
      protocol: formData.protocol,
      status: "Active",
    };

    setExtensions([...extensions, newExt]);
    setCreateModalOpen(false);
    showToast(`Extension #${newExt.number} created`, "success");
  };

  const handleDelete = (id: string, number: string) => {
    setExtensions((prev) => prev.filter((e) => e.id !== id));
    showToast(`Extension #${number} unassigned`, "info");
  };

  const agentCount = extensions.filter((e) => e.type === "Agent").length;
  const deptCount = extensions.filter((e) => e.type === "Department").length;

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Extensions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <PhoneCall size={20} />
            </span>
            Extensions
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Internal routing numbers for agents and queues.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2.5 rounded-full inline-flex items-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <Plus size={16} />
          <span>New Extension</span>
        </button>
      </div>

      {/* 2. Signature Metric Cards (Pure White in Light, Dark Grey in Dark, Purple Half Circle Watermark) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1">
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
              Total extensions
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-[#9a55ff] dark:text-[#c084fc]">
              <PhoneCall size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              {extensions.length}
            </div>
          </div>
        </div>

        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
              Agent direct lines
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              {agentCount}
            </div>
          </div>
        </div>

        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
              ACD queue numbers
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-500/10 dark:bg-sky-500/20 flex items-center justify-center text-blue-600 dark:text-sky-400">
              <Network size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              {deptCount}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-surface-container-low p-1.5 rounded-full w-fit border border-outline-variant/30">
        {(["all", "Agent", "Department"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              filterType === tab
                ? "btn-gradient-primary text-white shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            {tab === "all" ? `All (${extensions.length})` : `${tab}s`}
          </button>
        ))}
      </div>

      {/* 4. Extensions Table */}
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "750px" }}>
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-outline-variant/20 text-on-surface-variant text-xs font-semibold">
                <th className="py-3.5 px-5">Extension</th>
                <th className="py-3.5 px-5">Destination / Owner</th>
                <th className="py-3.5 px-5">Type</th>
                <th className="py-3.5 px-5">Transport Protocol</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
              {filteredExtensions.map((ext) => (
                <tr key={ext.id} className="hover:bg-purple-500/[0.03] transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-mono text-base font-bold text-[#9a55ff] dark:text-[#da8cff]">
                      #{ext.number}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-on-surface">
                    {ext.targetName}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ext.type === "Agent"
                          ? "badge-inverse-primary"
                          : "badge-inverse-info"
                      }`}
                    >
                      {ext.type}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-on-surface-variant font-semibold">
                    {ext.protocol}
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{ext.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setExtToDelete(ext)}
                      className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                      title="Delete Extension"
                      type="button"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Extension Modal */}
      {createModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-lg font-bold text-on-surface">
                New Extension
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Extension Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-on-surface focus:outline-none focus:border-[#9a55ff]"
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
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff] appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Agent">Agent</option>
                      <option value="Department">Department Queue</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Target Destination / Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.targetName}
                  onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                  placeholder="e.g. Reception Desk"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Transport Protocol
                </label>
                <select
                  value={formData.protocol}
                  onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                >
                  <option value="SIP / UDP">SIP / UDP (Default)</option>
                  <option value="WebRTC / WSS">WebRTC / WSS (Secure)</option>
                  <option value="Internal Queue">Internal Queue</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface hover:bg-surface-container font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Create Extension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
        description={`Are you sure you want to unassign Extension #${extToDelete?.number} (${extToDelete?.targetName})? Call routing to this number will stop.`}
        confirmText="Delete Extension"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
