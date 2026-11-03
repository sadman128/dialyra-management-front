"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Network,
  Plus,
  Edit3,
  Trash2,
  Users,
  Clock,
  ChevronRight,
  PhoneCall,
  RotateCw,
  BellRing,
  X,
  CheckCircle2,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  queueNumber: string;
  priority: string;
  strategy: string;
  strategyDesc: string;
  timeout: string;
  fallback: string;
  agentCount: number;
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
      timeout: "30s",
      fallback: "Voicemail",
      agentCount: 3,
      status: "Active",
    },
    {
      id: "dept-2",
      name: "Order Escalations",
      queueNumber: "4002",
      priority: "Urgent Delivery",
      strategy: "Simultaneous Ring",
      strategyDesc: "Ring all phones together",
      timeout: "20s",
      fallback: "Supervisor #103",
      agentCount: 2,
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
      timeout: formData.timeout,
      fallback: formData.fallback,
      agentCount: 1,
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Departments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Network size={20} />
            </span>
            Departments &amp; Call Queues
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Configure ACD call queues, ring strategies, and operator assignments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2.5 rounded-full inline-flex items-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <Plus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      {/* 2. Signature Purple React Gradient Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="card-img-holder bg-gradient-primary text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              Active Queues
            </span>
            <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Network size={18} />
            </span>
          </div>
          <div className="mt-4 z-10">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {departments.length}
            </div>
            <div className="text-xs text-white/90 font-medium mt-1">
              Operational call queues
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-img-holder bg-gradient-success text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              Total Agents
            </span>
            <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Users size={18} />
            </span>
          </div>
          <div className="mt-4 z-10">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {departments.reduce((acc, d) => acc + d.agentCount, 0)}
            </div>
            <div className="text-xs text-white/90 font-medium mt-1">
              Live human supervisors &amp; reps
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-img-holder bg-gradient-info text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              Average Timeout
            </span>
            <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Clock size={18} />
            </span>
          </div>
          <div className="mt-4 z-10">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              25s
            </div>
            <div className="text-xs text-white/90 font-medium mt-1">
              Automated fallback
            </div>
          </div>
        </div>
      </div>

      {/* 3. Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    {dept.strategy === "Round Robin" ? (
                      <RotateCw size={20} />
                    ) : (
                      <BellRing size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-on-surface">
                      {dept.name}
                    </h3>
                    <span className="text-xs font-mono text-on-surface-variant font-medium">
                      Queue #{dept.queueNumber} · {dept.priority}
                    </span>
                  </div>
                </div>

                <span className="badge-inverse-success text-xs font-bold">
                  {dept.status}
                </span>
              </div>

              {/* Routing Strategy & Timeout details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs sm:text-sm">
                <div>
                  <span className="text-on-surface-variant uppercase text-[10px] font-bold tracking-wider block">
                    Strategy
                  </span>
                  <span className="font-bold text-on-surface">
                    {dept.strategy}
                  </span>
                  <span className="text-xs text-on-surface-variant block mt-0.5">
                    {dept.strategyDesc}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant uppercase text-[10px] font-bold tracking-wider block">
                    Timeout &amp; Fallback
                  </span>
                  <span className="font-bold text-on-surface">
                    {dept.timeout}
                  </span>
                  <span className="text-xs text-on-surface-variant block mt-0.5">
                    Fallback: {dept.fallback}
                  </span>
                </div>
              </div>

              {/* Assigned Agents (Clean text, no circle initials as requested) */}
              <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                <span className="text-on-surface-variant font-semibold flex items-center gap-1.5">
                  <Users size={16} className="text-[#9a55ff]" />
                  <span>{dept.agentCount} Agents Assigned</span>
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  Queue Active
                </span>
              </div>
            </div>

            {/* Actions: Edit + Red Delete Button with Trash icon & 'Delete' text */}
            <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-end gap-2.5">
              <button
                onClick={() => handleOpenEdit(dept)}
                className="btn-gradient-primary text-white text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 font-bold shadow-2xs hover:shadow active:scale-95 transition-all cursor-pointer"
                type="button"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setDeptToDelete(dept)}
                className="px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Delete Department"
                type="button"
              >
                <Trash2 size={13} className="text-rose-600 dark:text-rose-400" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-lg font-bold text-on-surface">
                Add Department
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Department Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Billing & Returns"
                  required
                  className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Queue Number
                  </label>
                  <input
                    value={formData.queueNumber}
                    onChange={(e) => setFormData({ ...formData, queueNumber: e.target.value })}
                    className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm font-mono border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Ring Strategy
                  </label>
                  <select
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  >
                    <option>Round Robin</option>
                    <option>Simultaneous Ring</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Timeout
                  </label>
                  <input
                    value={formData.timeout}
                    onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                    className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Fallback Action
                  </label>
                  <input
                    value={formData.fallback}
                    onChange={(e) => setFormData({ ...formData, fallback: e.target.value })}
                    className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary px-5 py-2 rounded-full text-xs font-bold text-white shadow-sm"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-lg font-bold text-on-surface">
                Edit Department
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Department Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Queue Number
                  </label>
                  <input
                    value={formData.queueNumber}
                    onChange={(e) => setFormData({ ...formData, queueNumber: e.target.value })}
                    className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm font-mono border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Ring Strategy
                  </label>
                  <select
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  >
                    <option>Round Robin</option>
                    <option>Simultaneous Ring</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Timeout
                  </label>
                  <input
                    value={formData.timeout}
                    onChange={(e) => setFormData({ ...formData, timeout: e.target.value })}
                    className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Fallback Action
                  </label>
                  <input
                    value={formData.fallback}
                    onChange={(e) => setFormData({ ...formData, fallback: e.target.value })}
                    className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-sm border border-outline-variant/30 focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary px-5 py-2 rounded-full text-xs font-bold text-white shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
        description={`Are you sure you want to delete "${deptToDelete?.name}"? Calls to Queue #${deptToDelete?.queueNumber} will no longer be routed.`}
        confirmText="Delete Department"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
