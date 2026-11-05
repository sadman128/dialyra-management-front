"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Users,
  Plus,
  ChevronRight,
  CheckCircle2,
  PhoneCall,
  Key,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  X,
  ChevronDown,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  initials: string;
  email: string;
  department: string;
  extension: string;
  status: "Available" | "Busy" | "Offline";
  sipUser: string;
  sipSecret: string;
}

export default function AgentsPage() {
  const { showToast } = useBusiness();

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "ag-1",
      name: "Sadman Kabir",
      role: "Lead Dispatcher",
      initials: "SK",
      email: "sadman@store.com",
      department: "Customer Support",
      extension: "101",
      status: "Available",
      sipUser: "agent_101",
      sipSecret: "dY!89_kLq#2m9",
    },
    {
      id: "ag-2",
      name: "Customer Rep B",
      role: "Tier-1 Support",
      initials: "CR",
      email: "rep2@store.com",
      department: "Customer Support",
      extension: "102",
      status: "Busy",
      sipUser: "agent_102",
      sipSecret: "vT!44_wMn#9p1",
    },
    {
      id: "ag-3",
      name: "Senior Desk Lead",
      role: "Escalations",
      initials: "SL",
      email: "lead@store.com",
      department: "Order Escalations",
      extension: "103",
      status: "Offline",
      sipUser: "agent_103",
      sipSecret: "xZ!91_aQk#7u3",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<"all" | "Available" | "Busy" | "Offline">("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sipModalOpen, setSipModalOpen] = useState(false);
  const [selectedAgentSip, setSelectedAgentSip] = useState<Agent | null>(null);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  // Close modals on focus loss or Escape
  React.useEffect(() => {
    const handleBlur = () => {
      setAddModalOpen(false);
      setSipModalOpen(false);
      setAgentToDelete(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAddModalOpen(false);
        setSipModalOpen(false);
        setAgentToDelete(null);
      }
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // New Agent Form
  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    role: "Support Agent",
    department: "Customer Support",
    extension: "104",
  });

  const filteredAgents = agents.filter(
    (a) => filterStatus === "all" || a.status === filterStatus
  );

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}`, "info");
  };

  const handleOpenSipModal = (agent: Agent) => {
    setSelectedAgentSip(agent);
    setPwdVisible(false);
    setSipModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus: Agent["status"] =
            a.status === "Available"
              ? "Busy"
              : a.status === "Busy"
              ? "Offline"
              : "Available";
          showToast(`${a.name} is now ${nextStatus}`, "info");
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name.trim()) return;

    const initials = agentForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const newAgent: Agent = {
      id: `ag-${Date.now()}`,
      name: agentForm.name,
      role: agentForm.role,
      initials,
      email: agentForm.email || `${initials.toLowerCase()}@store.com`,
      department: agentForm.department,
      extension: agentForm.extension,
      status: "Available",
      sipUser: `agent_${agentForm.extension}`,
      sipSecret: `sec_${Math.random().toString(36).substring(2, 9)}!`,
    };

    setAgents([...agents, newAgent]);
    setAddModalOpen(false);
    showToast(`Agent "${newAgent.name}" registered`, "success");
  };

  const handleDeleteAgent = (id: string, name: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    showToast(`Agent "${name}" removed`, "info");
  };

  const availableCount = agents.filter((a) => a.status === "Available").length;

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Agents</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Users size={20} />
            </span>
            Agents
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Manage call center operators and credentials.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2.5 rounded-full inline-flex items-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <Plus size={16} />
          <span>Add Agent</span>
        </button>
      </div>

      {/* 2. Signature Metric Cards (Pure White Light, Dark Grey #141417, Purple Watermark) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1">
        {/* Metric 1: Total Agents */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
              Total Agents
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#9a55ff]/10 dark:bg-[#9a55ff]/20 flex items-center justify-center text-[#9a55ff]">
              <Users size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-zinc-50 tracking-tight">
              {agents.length}
            </div>
          </div>
        </div>

        {/* Metric 2: Available Now */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
              Available Now
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-zinc-50 tracking-tight">
              {availableCount}
            </div>
          </div>
        </div>

        {/* Metric 3: Active Extensions */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
              Active Extensions
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-500/10 dark:bg-sky-500/20 flex items-center justify-center text-blue-600 dark:text-sky-400">
              <PhoneCall size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-zinc-50 tracking-tight">
              {agents.length}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-surface-container-low p-1.5 rounded-full w-fit border border-outline-variant/30">
        {(["all", "Available", "Busy", "Offline"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              filterStatus === st
                ? "btn-gradient-primary text-white shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            {st === "all" ? `All (${agents.length})` : st}
          </button>
        ))}
      </div>

      {/* 4. Agents Table */}
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "750px" }}>
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                <th className="py-3.5 px-5">Agent</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Extension</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Softphone</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
              {filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-purple-500/[0.03] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-primary text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {ag.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{ag.name}</span>
                        <span className="text-xs text-on-surface-variant font-medium">
                          {ag.email} · {ag.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs font-semibold">
                      {ag.department}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono font-bold text-[#9a55ff]">
                    Ext #{ag.extension}
                  </td>
                  <td className="py-4 px-5">
                    <button
                      onClick={() => handleToggleStatus(ag.id)}
                      className="cursor-pointer transition-transform active:scale-95 inline-flex items-center"
                      title="Click to toggle status"
                      type="button"
                    >
                      {ag.status === "Available" && (
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Available</span>
                        </span>
                      )}
                      {ag.status === "Busy" && (
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Busy</span>
                        </span>
                      )}
                      {ag.status === "Offline" && (
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <span>Offline</span>
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-5">
                    <button
                      onClick={() => handleOpenSipModal(ag)}
                      className="btn-gradient-info text-white text-xs px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 font-bold shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer"
                      type="button"
                    >
                      <Key size={13} />
                      <span>Credentials</span>
                    </button>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setAgentToDelete(ag)}
                      className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                      title="Delete Agent"
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

      {/* Add Agent Modal */}
      {addModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-lg font-bold text-on-surface">
                Register Agent
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  placeholder="e.g. Farhan Ali"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  placeholder="farhan@store.com"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={agentForm.role}
                    onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Extension
                  </label>
                  <input
                    type="text"
                    value={agentForm.extension}
                    onChange={(e) => setAgentForm({ ...agentForm, extension: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-on-surface focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={agentForm.department}
                    onChange={(e) => setAgentForm({ ...agentForm, department: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff] appearance-none pr-8 cursor-pointer"
                  >
                    <option>Customer Support</option>
                    <option>Order Escalations</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface hover:bg-surface-container font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIP Softphone Credentials Modal */}
      {sipModalOpen && selectedAgentSip && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSipModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-[#9a55ff]" />
                <h3 className="text-base sm:text-lg font-bold text-on-surface">
                  SIP Softphone Credentials
                </h3>
              </div>
              <button
                onClick={() => setSipModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant font-medium">
              Use these SIP WebRTC credentials to connect MicroSIP, ZoiPer, or the Dialyra Agent Softphone.
            </p>

            <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">SIP Server / Proxy</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-on-surface">
                  <span>pbx.dialyra.com:5060</span>
                  <button
                    onClick={() => handleCopy("pbx.dialyra.com:5060", "SIP Server")}
                    className="p-1 hover:text-[#9a55ff]"
                    title="Copy"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Username / Extension</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-on-surface">
                  <span>{selectedAgentSip.sipUser}</span>
                  <button
                    onClick={() => handleCopy(selectedAgentSip.sipUser, "SIP Username")}
                    className="p-1 hover:text-[#9a55ff]"
                    title="Copy"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Secret Password</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-on-surface">
                  <span>{pwdVisible ? selectedAgentSip.sipSecret : "••••••••••••"}</span>
                  <button
                    onClick={() => setPwdVisible(!pwdVisible)}
                    className="p-1 hover:text-[#9a55ff]"
                    title="Toggle"
                  >
                    {pwdVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button
                    onClick={() => handleCopy(selectedAgentSip.sipSecret, "SIP Secret")}
                    className="p-1 hover:text-[#9a55ff]"
                    title="Copy"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-medium">Transport Protocol</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  WSS / TLS (Secure)
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSipModalOpen(false)}
                className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Agent Confirmation Modal */}
      <ConfirmModal
        isOpen={!!agentToDelete}
        onClose={() => setAgentToDelete(null)}
        onConfirm={() => {
          if (agentToDelete) {
            handleDeleteAgent(agentToDelete.id, agentToDelete.name);
            setAgentToDelete(null);
          }
        }}
        title="Delete Agent"
        description={`Are you sure you want to remove ${agentToDelete?.name}? Extension #${agentToDelete?.extension} will be unassigned and softphone access revoked.`}
        confirmText="Delete Agent"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
