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
  ChevronDown,
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
  const [expandedDeptIds, setExpandedDeptIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (deptId: string) => {
    setExpandedDeptIds((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  // Close modals on focus loss or Escape
  React.useEffect(() => {
    const handleBlur = () => {
      setAddModalOpen(false);
      setEditModalOpen(false);
      setDeptToDelete(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeptToDelete(null);
      }
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            Departments
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Configure departments, queues, and operator assignments.
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

      {/* 2. Signature Metric Cards (Pure White in Light, Dark Grey in Dark, Purple Half Circle Watermark) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1">
        {/* Metric 1 */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
              Active Queues
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-[#9a55ff] dark:text-[#c084fc]">
              <Network size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              {departments.length}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
              Total Agents
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              {departments.reduce((acc, d) => acc + d.agentCount, 0)}
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-lg border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
              Average Timeout
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-500/10 dark:bg-sky-500/20 flex items-center justify-center text-blue-600 dark:text-sky-400">
              <Clock size={14} />
            </span>
          </div>
          <div className="mt-1 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              25s
            </div>
          </div>
        </div>
      </div>

      {/* 3. Departments Table with Expandable Details */}
      <div className="bg-white dark:bg-[#121215] rounded-2xl border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "750px" }}>
            <thead>
              <tr className="bg-surface-container-low/80 text-on-surface text-xs font-bold uppercase tracking-wider border-b border-outline-variant/20">
                <th className="w-12 px-4 py-3.5 text-center"></th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Queue Number</th>
                <th className="px-5 py-3.5">Strategy</th>
                <th className="px-5 py-3.5">Agents</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant text-sm font-medium">
                    No departments found.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => {
                  const isExpanded = !!expandedDeptIds[dept.id];
                  return (
                    <React.Fragment key={dept.id}>
                      {/* Summary Row */}
                      <tr
                        onClick={() => toggleExpand(dept.id)}
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
                              {dept.strategy === "Round Robin" ? (
                                <RotateCw size={16} />
                              ) : (
                                <BellRing size={16} />
                              )}
                            </div>
                            <span className="font-bold text-sm text-on-surface group-hover:text-[#9a55ff] transition-colors">
                              {dept.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#9a55ff] dark:text-[#da8cff]">
                            #{dept.queueNumber}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-medium">
                            {dept.strategy}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 font-medium text-xs sm:text-sm text-on-surface">
                          {dept.agentCount} {dept.agentCount === 1 ? "Agent" : "Agents"}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-500 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{dept.status}</span>
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(dept)}
                              className="px-3 py-1 rounded-full btn-gradient-primary text-white text-xs font-bold shadow-2xs hover:shadow active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1"
                              type="button"
                            >
                              <Edit3 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeptToDelete(dept)}
                              className="px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold inline-flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                              title="Delete Department"
                              type="button"
                            >
                              <Trash2 size={12} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-surface-container-low/40">
                          <td colSpan={7} className="px-6 py-4 border-t border-outline-variant/15">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">
                              <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-outline-variant/30 dark:border-zinc-800/80 shadow-2xs">
                                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">
                                  Strategy Details
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-on-surface block mt-0.5">
                                  {dept.strategy}
                                </span>
                                <span className="text-xs text-on-surface-variant block mt-0.5">
                                  {dept.strategyDesc}
                                </span>
                              </div>

                              <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-outline-variant/30 dark:border-zinc-800/80 shadow-2xs">
                                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">
                                  Timeout & Fallback
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-on-surface block mt-0.5">
                                  {dept.timeout} Timeout
                                </span>
                                <span className="text-xs text-on-surface-variant block mt-0.5">
                                  Fallback: {dept.fallback}
                                </span>
                              </div>

                              <div className="p-3 rounded-xl bg-white dark:bg-[#18181b] border border-outline-variant/30 dark:border-zinc-800/80 shadow-2xs">
                                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">
                                  Priority & Queue
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-on-surface block mt-0.5">
                                  {dept.priority}
                                </span>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                                  Queue Active ({dept.agentCount} Agents Assigned)
                                </span>
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

      {/* Add Department Modal */}
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
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-4">
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
