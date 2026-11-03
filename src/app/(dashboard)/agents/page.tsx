"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
          showToast(`${a.name} status: ${nextStatus}`, "info");
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name.trim()) return;

    const initials = agentForm.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newAgent: Agent = {
      id: `ag-${Date.now()}`,
      name: agentForm.name,
      role: agentForm.role,
      initials: initials || "AG",
      email: agentForm.email,
      department: agentForm.department,
      extension: agentForm.extension,
      status: "Available",
      sipUser: `agent_${agentForm.extension}`,
      sipSecret: `sec_${Math.random().toString(36).substring(2, 9)}!`,
    };

    setAgents([...agents, newAgent]);
    setAddModalOpen(false);
    showToast(`Agent "${agentForm.name}" created`, "success");
  };

  const handleDelete = (id: string, name: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    showToast(`Agent "${name}" removed`, "info");
  };

  const availableCount = agents.filter((a) => a.status === "Available").length;

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
            Agents
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
            Manage human support agents and softphone credentials.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:shadow hover:bg-primary transition-all active:scale-[0.99] self-start sm:self-auto"
          type="button"
        >
          <Icon name="add" size={18} />
          <span>Add Agent</span>
        </button>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Agents
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {agents.length}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Registered
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <Icon name="support_agent" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Available Now
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {availableCount}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Ready for calls
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-emerald-500">
            <Icon name="check_circle" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Extensions
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {agents.length}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Active</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
            <Icon name="dialpad" size={22} />
          </div>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-2">
        {(["all", "Available", "Busy", "Offline"] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border ${
              filterStatus === st
                ? "bg-primary-container text-on-primary border-primary-container shadow"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-outline-variant/30"
            }`}
            type="button"
          >
            {st === "all" ? `All (${agents.length})` : st}
          </button>
        ))}
      </div>

      {/* 4. Agents Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/80 border-b border-surface-container text-outline text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Extension</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Softphone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs sm:text-sm text-on-surface">
              {filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {ag.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{ag.name}</span>
                        <span className="text-[11px] text-on-surface-variant">
                          {ag.email} · {ag.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                      {ag.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-on-surface">
                    Ext #{ag.extension}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(ag.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs transition-all ${
                        ag.status === "Available"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                          : ag.status === "Busy"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                          : "bg-surface-container text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-high"
                      }`}
                      title="Click to toggle status"
                      type="button"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ag.status === "Available"
                            ? "bg-emerald-500"
                            : ag.status === "Busy"
                            ? "bg-amber-500"
                            : "bg-outline"
                        }`}
                      />
                      <span>{ag.status}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleOpenSipModal(ag)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold shadow-xs hover:shadow transition-all"
                      type="button"
                    >
                      <Icon name="phonelink_ring" size={15} />
                      <span>Credentials</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setAgentToDelete(ag)}
                      className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 shadow-xs transition-colors"
                      title="Delete Agent"
                      type="button"
                    >
                      <Icon name="delete" size={17} />
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Add Agent
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  placeholder="e.g. Tanvir Rahman"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  placeholder="e.g. tanvir@store.com"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Extension
                  </label>
                  <input
                    type="text"
                    required
                    value={agentForm.extension}
                    onChange={(e) => setAgentForm({ ...agentForm, extension: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs"
                  >
                    <option value="Customer Support">Customer Support</option>
                    <option value="Order Escalations">Order Escalations</option>
                  </select>
                  <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
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

      {/* SIP Softphone Modal */}
      {sipModalOpen && selectedAgentSip && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface">
                  Softphone Credentials
                </h3>
                <span className="text-xs text-on-surface-variant">
                  {selectedAgentSip.name} (Ext #{selectedAgentSip.extension})
                </span>
              </div>
              <button
                onClick={() => setSipModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="text-[11px] uppercase font-bold text-outline block mb-1">
                  SIP Server / Domain
                </label>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <code className="font-mono text-on-surface">sip.dialyra.com</code>
                  <button
                    onClick={() => handleCopy("sip.dialyra.com", "SIP Server")}
                    className="p-1 rounded hover:bg-surface-container text-primary-container shadow-xs"
                    type="button"
                  >
                    <Icon name="save" size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-outline block mb-1">
                  Username / Account
                </label>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <code className="font-mono text-on-surface">{selectedAgentSip.sipUser}</code>
                  <button
                    onClick={() => handleCopy(selectedAgentSip.sipUser, "Username")}
                    className="p-1 rounded hover:bg-surface-container text-primary-container shadow-xs"
                    type="button"
                  >
                    <Icon name="save" size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-outline block mb-1">
                  Password
                </label>
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <code className="font-mono text-on-surface">
                    {pwdVisible ? selectedAgentSip.sipSecret : "••••••••••••"}
                  </code>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPwdVisible(!pwdVisible)}
                      className="p-1 rounded hover:bg-surface-container text-on-surface-variant shadow-xs"
                      type="button"
                    >
                      <Icon name={pwdVisible ? "visibility_off" : "visibility"} size={16} />
                    </button>
                    <button
                      onClick={() => handleCopy(selectedAgentSip.sipSecret, "Password")}
                      className="p-1 rounded hover:bg-surface-container text-primary-container shadow-xs"
                      type="button"
                    >
                      <Icon name="save" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <span className="text-outline uppercase text-[10px] font-bold block">Port</span>
                  <span className="font-mono font-bold text-on-surface">5060</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <span className="text-outline uppercase text-[10px] font-bold block">Transport</span>
                  <span className="font-mono font-bold text-on-surface">UDP</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 text-xs text-on-surface-variant space-y-1">
                <span className="font-bold text-on-surface block">Setup Tip:</span>
                <p>
                  Use these credentials in softphone apps like <strong>MicroSIP</strong> or <strong>Zoiper</strong> on PC/Mobile to receive customer calls directly.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSipModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold shadow-sm hover:shadow hover:bg-primary transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Agent Confirmation Modal */}
      <ConfirmModal
        isOpen={!!agentToDelete}
        onClose={() => setAgentToDelete(null)}
        onConfirm={() => {
          if (agentToDelete) {
            handleDelete(agentToDelete.id, agentToDelete.name);
            setAgentToDelete(null);
          }
        }}
        title="Remove Agent"
        description={`Are you sure you want to remove ${agentToDelete?.name} (Ext #${agentToDelete?.extension})? Their softphone line will be disconnected and unassigned from active queues.`}
        confirmText="Remove Agent"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
