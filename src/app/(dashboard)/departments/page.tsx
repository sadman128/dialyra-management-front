"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface Department {
  id: string;
  name: string;
  queueNumber: string;
  priority: string;
  strategy: string;
  strategyDesc: string;
  strategyIcon: string;
  timeout: string;
  fallback: string;
  agentCount: number;
  agentInitials: string[];
  status: string;
}

export default function DepartmentsPage() {
  const { showToast } = useBusiness();

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "dept-1",
      name: "Customer Support",
      queueNumber: "4001",
      priority: "Priority Inbound",
      strategy: "Round Robin",
      strategyDesc: "Distribute calls evenly",
      strategyIcon: "autorenew",
      timeout: "30s",
      fallback: "Voicemail",
      agentCount: 3,
      agentInitials: ["SK", "CR", "AL"],
      status: "Active",
    },
    {
      id: "dept-2",
      name: "Order Escalations",
      queueNumber: "4002",
      priority: "Urgent Delivery",
      strategy: "Simultaneous Ring",
      strategyDesc: "Ring all phones together",
      strategyIcon: "notifications_active",
      timeout: "20s",
      fallback: "Supervisor #103",
      agentCount: 2,
      agentInitials: ["DL", "MN"],
      status: "Active",
    },
  ]);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    queueNumber: "4003",
    strategy: "Round Robin",
    timeout: "30s",
    fallback: "Voicemail",
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      queueNumber: `400${departments.length + 1}`,
      strategy: "Round Robin",
      timeout: "30s",
      fallback: "Voicemail",
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name,
      queueNumber: dept.queueNumber,
      strategy: dept.strategy,
      timeout: dept.timeout,
      fallback: dept.fallback,
    });
    setEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: formData.name,
      queueNumber: formData.queueNumber,
      priority: "Standard Queue",
      strategy: formData.strategy,
      strategyDesc:
        formData.strategy === "Round Robin"
          ? "Distribute calls evenly"
          : "Ring all phones together",
      strategyIcon:
        formData.strategy === "Round Robin" ? "autorenew" : "notifications_active",
      timeout: formData.timeout,
      fallback: formData.fallback,
      agentCount: 1,
      agentInitials: ["AD"],
      status: "Active",
    };

    setDepartments([...departments, newDept]);
    setAddModalOpen(false);
    showToast(`Department "${formData.name}" created`, "success");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !formData.name.trim()) return;

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === selectedDept.id
          ? {
              ...d,
              name: formData.name,
              queueNumber: formData.queueNumber,
              strategy: formData.strategy,
              strategyDesc:
                formData.strategy === "Round Robin"
                  ? "Distribute calls evenly"
                  : "Ring all phones together",
              timeout: formData.timeout,
              fallback: formData.fallback,
            }
          : d
      )
    );
    setEditModalOpen(false);
    showToast(`Department "${formData.name}" updated`, "success");
  };

  const handleDelete = (id: string, name: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    showToast(`Department "${name}" deleted`, "info");
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
            Departments
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
            Manage call routing queues and agent distribution.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:shadow hover:bg-primary transition-all active:scale-[0.99] self-start sm:self-auto"
          type="button"
        >
          <Icon name="add" size={18} />
          <span>Add Department</span>
        </button>
      </div>

      {/* 2. Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Active Queues
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {departments.length}
              </span>
              <span className="text-xs text-on-tertiary-container font-semibold">
                Online
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <Icon name="call_split" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Total Agents
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                {departments.reduce((acc, d) => acc + d.agentCount, 0)}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Assigned</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
            <Icon name="support_agent" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Default Timeout
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">25s</span>
              <span className="text-xs text-on-surface-variant font-medium">Average</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
            <Icon name="timer" size={22} />
          </div>
        </div>
      </div>

      {/* 3. Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-surface-container-lowest rounded-2xl p-5 shadow-stitch-card border border-outline-variant/30 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary-container flex items-center justify-center font-bold shrink-0">
                    <Icon name={dept.strategyIcon} size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">
                      {dept.name}
                    </h3>
                    <span className="text-xs font-mono text-outline">
                      Queue #{dept.queueNumber} · {dept.priority}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {dept.status}
                </span>
              </div>

              {/* Routing Strategy & Timeout details */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20 text-xs">
                <div>
                  <span className="text-outline uppercase text-[10px] font-bold tracking-wider block">
                    Strategy
                  </span>
                  <span className="font-semibold text-on-surface">
                    {dept.strategy}
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">
                    {dept.strategyDesc}
                  </span>
                </div>
                <div>
                  <span className="text-outline uppercase text-[10px] font-bold tracking-wider block">
                    Timeout &amp; Fallback
                  </span>
                  <span className="font-semibold text-on-surface">
                    {dept.timeout}
                  </span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">
                    Fallback: {dept.fallback}
                  </span>
                </div>
              </div>

              {/* Assigned Agents */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-on-surface-variant font-medium">
                  {dept.agentCount} Agents Assigned
                </span>
                <div className="flex -space-x-1.5">
                  {dept.agentInitials.map((init, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center border-2 border-surface-container-lowest shadow-xs"
                    >
                      {init}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(dept)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold shadow-xs hover:shadow transition-all"
                type="button"
              >
                <Icon name="edit" size={15} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setDeptToDelete(dept)}
                className="p-1.5 rounded-xl text-outline hover:text-error hover:bg-error-container/20 shadow-xs transition-colors"
                title="Delete Department"
                type="button"
              >
                <Icon name="delete" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Add Department
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
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sales & Support"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Queue Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.queueNumber}
                    onChange={(e) => setFormData({ ...formData, queueNumber: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Timeout
                  </label>
                  <input
                    type="text"
                    value={formData.timeout}
                    onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Routing Strategy
                </label>
                <div className="relative">
                  <select
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs"
                  >
                    <option value="Round Robin">Round Robin (Distribute evenly)</option>
                    <option value="Simultaneous Ring">Simultaneous Ring (Ring all phones)</option>
                    <option value="Least Busy">Least Busy (Route to idle agent)</option>
                  </select>
                  <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Fallback Destination
                </label>
                <input
                  type="text"
                  value={formData.fallback}
                  onChange={(e) => setFormData({ ...formData, fallback: e.target.value })}
                  placeholder="e.g. Voicemail or Supervisor #103"
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

      {/* Edit Department Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Edit Department
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Queue Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.queueNumber}
                    onChange={(e) => setFormData({ ...formData, queueNumber: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Timeout
                  </label>
                  <input
                    type="text"
                    value={formData.timeout}
                    onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Routing Strategy
                </label>
                <div className="relative">
                  <select
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs"
                  >
                    <option value="Round Robin">Round Robin (Distribute evenly)</option>
                    <option value="Simultaneous Ring">Simultaneous Ring (Ring all phones)</option>
                    <option value="Least Busy">Least Busy (Route to idle agent)</option>
                  </select>
                  <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Fallback Destination
                </label>
                <input
                  type="text"
                  value={formData.fallback}
                  onChange={(e) => setFormData({ ...formData, fallback: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low font-semibold shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold shadow-sm hover:shadow hover:bg-primary transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Department Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={() => {
          if (deptToDelete) {
            handleDelete(deptToDelete.id, deptToDelete.name);
            setDeptToDelete(null);
          }
        }}
        title="Delete Department"
        description={`Are you sure you want to delete "${deptToDelete?.name}" (Queue #${deptToDelete?.queueNumber})? Inbound calls will no longer route to this team.`}
        confirmText="Delete Department"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
