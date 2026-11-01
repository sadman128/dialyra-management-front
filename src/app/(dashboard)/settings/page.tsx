"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";
import { mockDepartments, mockAgents, mockDncList } from "@/mock/mockData";

type SettingsTab =
  | "departments"
  | "agents"
  | "hours"
  | "pacing"
  | "dnc"
  | "api";

export default function SettingsPage() {
  const { activeBusiness, showToast } = useBusiness();

  // Tab State
  const [activeTab, setActiveTab] = useState<SettingsTab>("departments");

  // Save changes state
  const [isSaving, setIsSaving] = useState(false);

  // Departments State
  const [departments, setDepartments] = useState([
    {
      id: "dept-1",
      name: "Customer Support",
      queueNumber: "4001",
      priority: "Inbound IVR Priority",
      strategy: "Round Robin",
      strategyDesc: "Distribute calls evenly",
      strategyIcon: "autorenew",
      timeout: "30s",
      fallback: "Then fallback to voicemail",
      agentCount: 3,
      agentInitials: ["SK", "CR", "AL"],
      status: "Active",
    },
    {
      id: "dept-2",
      name: "Order Escalations",
      queueNumber: "4002",
      priority: "Urgent Delivery Ring",
      strategy: "Simultaneous Ring",
      strategyDesc: "Blast all phones at once",
      strategyIcon: "notifications_active",
      timeout: "20s",
      fallback: "Then fallback to Supervisor #103",
      agentCount: 2,
      agentInitials: ["DL", "MN"],
      status: "Active",
    },
  ]);

  // Agents State
  const [agents, setAgents] = useState([
    {
      id: "ag-1",
      name: "Sadman Kabir",
      role: "Primary Dispatcher",
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
      role: "Escalation Manager",
      initials: "SL",
      email: "lead@store.com",
      department: "Order Escalations",
      extension: "103",
      status: "Offline",
      sipUser: "agent_103",
      sipSecret: "xZ!91_aQk#7u3",
    },
  ]);

  // Calling Hours State
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("09:00 PM");
  const [nightQueueHolding, setNightQueueHolding] = useState(true);
  const [fridayPrayerPause, setFridayPrayerPause] = useState(true);

  // Pacing State
  const [maxConcurrency, setMaxConcurrency] = useState(5);
  const [interCallDelay, setInterCallDelay] = useState(2.5);
  const [maxRetries, setMaxRetries] = useState(3);
  const [retryInterval1, setRetryInterval1] = useState("15");
  const [retryInterval2, setRetryInterval2] = useState("60");
  const [retryInterval3, setRetryInterval3] = useState("180");

  // DNC State
  const [dncList, setDncList] = useState(mockDncList);
  const [newDncPhone, setNewDncPhone] = useState("");
  const [newDncReason, setNewDncReason] = useState("");

  // Modals State
  const [selectedAgentSip, setSelectedAgentSip] = useState<typeof agents[0] | null>(null);
  const [sipModalOpen, setSipModalOpen] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [addDeptModalOpen, setAddDeptModalOpen] = useState(false);
  const [addAgentModalOpen, setAddAgentModalOpen] = useState(false);

  // Edit Department state
  const [editingDept, setEditingDept] = useState<typeof departments[0] | null>(null);
  const [editDeptModalOpen, setEditDeptModalOpen] = useState(false);
  const [editDeptForm, setEditDeptForm] = useState({
    name: "",
    queueNumber: "",
    strategy: "Round Robin",
    timeout: "30s",
    fallback: "Then fallback to voicemail",
  });

  // Track unsaved changes for floating action bar
  const [hasChanges, setHasChanges] = useState(false);

  // Form states for new department
  const [deptForm, setDeptForm] = useState({
    name: "",
    queueNumber: "4003",
    strategy: "Round Robin",
    timeout: "30s",
  });

  // Form states for new agent
  const [agentForm, setAgentForm] = useState({
    name: "",
    email: "",
    department: "Customer Support",
    extension: "104",
  });

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard`, "info");
  };

  // Save changes handler
  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      showToast("All settings and PBX routing policies saved successfully!", "success");
    }, 700);
  };

  // Open Edit Department Modal
  const handleOpenEditDept = (dept: typeof departments[0]) => {
    setEditingDept(dept);
    setEditDeptForm({
      name: dept.name,
      queueNumber: dept.queueNumber,
      strategy: dept.strategy,
      timeout: dept.timeout,
      fallback: dept.fallback,
    });
    setEditDeptModalOpen(true);
  };

  // Save Edited Department
  const handleSaveEditDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept || !editDeptForm.name.trim()) return;

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === editingDept.id
          ? {
              ...d,
              name: editDeptForm.name,
              queueNumber: editDeptForm.queueNumber,
              strategy: editDeptForm.strategy,
              strategyDesc:
                editDeptForm.strategy === "Round Robin"
                  ? "Distribute calls evenly"
                  : editDeptForm.strategy === "Simultaneous Ring"
                  ? "Blast all phones simultaneously"
                  : "Route to least active agent",
              strategyIcon:
                editDeptForm.strategy === "Round Robin"
                  ? "autorenew"
                  : editDeptForm.strategy === "Simultaneous Ring"
                  ? "notifications_active"
                  : "hourglass_bottom",
              timeout: editDeptForm.timeout,
              fallback: editDeptForm.fallback,
            }
          : d
      )
    );
    setEditDeptModalOpen(false);
    setHasChanges(true);
    showToast(`Department "${editDeptForm.name}" updated successfully!`, "success");
  };

  // Add department
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name.trim()) return;

    const newDept = {
      id: `dept-${Date.now()}`,
      name: deptForm.name,
      queueNumber: deptForm.queueNumber,
      priority: "Custom Routing Queue",
      strategy: deptForm.strategy,
      strategyDesc: deptForm.strategy === "Round Robin" ? "Distribute calls evenly" : "Blast all phones simultaneously",
      strategyIcon: deptForm.strategy === "Round Robin" ? "autorenew" : "notifications_active",
      timeout: deptForm.timeout,
      fallback: "Fallback to voicemail",
      agentCount: 0,
      agentInitials: [],
      status: "Active",
    };

    setDepartments([...departments, newDept]);
    setDeptForm({ name: "", queueNumber: "4004", strategy: "Round Robin", timeout: "30s" });
    setAddDeptModalOpen(false);
    setHasChanges(true);
    showToast(`Department "${newDept.name}" created!`, "success");
  };

  // Add agent
  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name.trim() || !agentForm.email.trim()) return;

    const initials = agentForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AG";

    const newAgent = {
      id: `ag-${Date.now()}`,
      name: agentForm.name,
      role: "Agent",
      initials,
      email: agentForm.email,
      department: agentForm.department,
      extension: agentForm.extension,
      status: "Available",
      sipUser: `agent_${agentForm.extension}`,
      sipSecret: `sP!${Math.floor(1000 + Math.random() * 9000)}_kL#`,
    };

    setAgents([...agents, newAgent]);
    setAgentForm({ name: "", email: "", department: "Customer Support", extension: String(Number(agentForm.extension) + 1) });
    setAddAgentModalOpen(false);
    showToast(`Agent "${newAgent.name}" registered with Ext #${newAgent.extension}!`, "success");
  };

  // Add DNC
  const handleAddDnc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDncPhone.trim()) return;

    const formatted = newDncPhone.startsWith("+")
      ? newDncPhone
      : `+880${newDncPhone.replace(/^0/, "")}`;

    const newEntry = {
      id: `dnc-${Date.now()}`,
      normalizedPhone: formatted,
      reason: newDncReason || "Customer requested verbal opt-out",
      addedAt: new Date().toISOString().split("T")[0],
    };

    setDncList([newEntry, ...dncList]);
    setNewDncPhone("");
    setNewDncReason("");
    showToast(`Number ${formatted} added to DNC suppression registry!`, "success");
  };

  // Remove DNC
  const handleRemoveDnc = (id: string, phone: string) => {
    setDncList(dncList.filter((item) => item.id !== id));
    showToast(`Number ${phone} removed from DNC registry`, "info");
  };

  // Download MicroSIP config
  const handleDownloadMicroSipConfig = (agent: typeof agents[0]) => {
    const configContent = `[Account]
AccountName=Dialyra PBX - ${agent.name}
SIPServer=sip.dialyra.com
SIPServerPort=5060
Domain=sip.dialyra.com
AuthUser=${agent.sipUser}
User=${agent.extension}
Password=${agent.sipSecret}
Transport=TLS
SRTP=Mandatory
AudioCodecs=G.711u,Opus
`;
    const blob = new Blob([configContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `dialyra_microsip_${agent.extension}.ini`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded .microSIP config for Ext #${agent.extension}`, "success");
  };

  return (
    <div className="w-full space-y-8 pb-20">
      {/* 1. Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            <span>Telephony Core</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary dark:text-primary-fixed-dim font-semibold">
              Live Routing &amp; SIP
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl text-primary dark:text-primary-fixed-dim tracking-tight font-bold">
              Settings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed/50 text-primary dark:bg-primary-container dark:text-primary-fixed text-xs font-semibold border border-primary/20">
              v3.4.8-sip
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
              Store: <strong>{activeBusiness.name}</strong>
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Manage routing, softphones, pacing, and integrations.
          </p>
        </div>
      </div>

      {/* 2. Top Horizontal Tab Navigation */}
      <div className="w-full bg-surface-container-low dark:bg-surface-container-lowest/40 p-1.5 rounded-xl border border-outline-variant/20 mb-space-xl overflow-x-auto flex items-center gap-1 scrollbar-none shadow-sm">
        <button
          onClick={() => setActiveTab("departments")}
          className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-2 font-medium ${
            activeTab === "departments"
              ? "bg-primary-container text-on-primary shadow-sm font-semibold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70"
          }`}
          type="button"
        >
          <Icon name="domain_add" className="text-[18px]" />
          <span>Departments</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-primary-fixed text-primary font-bold">
            {departments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("agents")}
          className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-2 font-medium ${
            activeTab === "agents"
              ? "bg-primary-container text-on-primary shadow-sm font-semibold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70"
          }`}
          type="button"
        >
          <Icon name="headset_mic" className="text-[18px]" />
          <span>Agents</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-secondary-fixed text-on-secondary-fixed font-bold">
            {agents.filter((a) => a.status === "Available").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("hours")}
          className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 font-medium ${
            activeTab === "hours"
              ? "bg-primary-container text-on-primary shadow-sm font-semibold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70"
          }`}
          type="button"
        >
          <Icon name="schedule" className="text-[18px]" />
          <span>Calling Hours</span>
        </button>

        <button
          onClick={() => setActiveTab("pacing")}
          className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 font-medium ${
            activeTab === "pacing"
              ? "bg-primary-container text-on-primary shadow-sm font-semibold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70"
          }`}
          type="button"
        >
          <Icon name="speed" className="text-[18px]" />
          <span>Pacing</span>
        </button>

        <button
          onClick={() => setActiveTab("dnc")}
          className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 font-medium ${
            activeTab === "dnc"
              ? "bg-primary-container text-on-primary shadow-sm font-semibold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70"
          }`}
          type="button"
        >
          <Icon name="phone_disabled" className="text-[18px]" />
          <span>DNC List</span>
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 font-medium ${
            activeTab === "api"
              ? "bg-primary-container text-on-primary shadow-sm font-semibold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70"
          }`}
          type="button"
        >
          <Icon name="key" className="text-[18px]" />
          <span>API Keys</span>
        </button>
      </div>

      {/* 3. Telemetry Overview Bar (100% Stitch UI Specification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-space-xl">
        <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              SIP Trunk Status
            </span>
            <span className="text-xl md:text-2xl text-primary dark:text-primary-fixed-dim font-bold mt-1">
              200 OK
            </span>
            <span className="text-xs text-on-tertiary-container flex items-center gap-1 mt-0.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-ping" />
              Ultra-Low Jitter (12ms)
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed-dim">
            <Icon name="satellite_alt" size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Active Queues
            </span>
            <span className="text-xl md:text-2xl text-on-surface font-bold mt-1">
              {departments.length} Deployed
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5">
              Round Robin &amp; Blast
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed-dim">
            <Icon name="call_split" size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Connected SIP Endpoints
            </span>
            <span className="text-xl md:text-2xl text-on-surface font-bold mt-1">
              {agents.length} Softphones
            </span>
            <span className="text-xs text-on-tertiary-container mt-0.5 font-medium">
              MicroSIP &amp; Linphone
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-surface-container flex items-center justify-center text-on-tertiary-container">
            <Icon name="phone_in_talk" size={20} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Average Transfer Delay
            </span>
            <span className="text-xl md:text-2xl text-on-surface font-bold mt-1">
              1.4s
            </span>
            <span className="text-xs text-on-tertiary-container mt-0.5 font-medium">
              -0.3s vs SLA Benchmark
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-surface-container flex items-center justify-center text-on-tertiary-container">
            <Icon name="timer" size={20} />
          </div>
        </div>
      </div>

      {/* 4. Tab 1: Departments Section */}
      {activeTab === "departments" && (
        <div className="w-full bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(65,18,100,0.06)] overflow-hidden">
          <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Icon name="corporate_fare" className="text-[22px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl text-primary dark:text-primary-fixed-dim font-bold">
                    Departments
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary dark:bg-primary-container dark:text-primary-fixed text-xs font-semibold">
                    {departments.length} Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Manage department queues and call distribution.
                </p>
              </div>
            </div>

            <button
              onClick={() => setAddDeptModalOpen(true)}
              className="inline-flex items-center justify-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm active:scale-95 self-start sm:self-auto"
              type="button"
            >
              <Icon name="add_circle" className="text-[18px]" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-on-surface font-body-md">
              <thead className="bg-surface-container-low/70 dark:bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
                <tr>
                  <th className="py-3 px-space-lg font-label-sm text-label-sm uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                    Routing Strategy
                  </th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                    Ring Timeout
                  </th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                    Active Queue / Agents
                  </th>
                  <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-space-lg font-label-sm text-label-sm uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-surface-container-low/50 dark:hover:bg-surface-container/40 transition-colors"
                  >
                    <td className="py-3.5 px-space-lg">
                      <div className="flex items-center gap-space-md">
                        <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold shrink-0">
                          <Icon name="support_agent" className="text-[18px]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-lg text-label-lg font-bold text-on-surface">
                            {dept.name}
                          </span>
                          <span className="font-code-sm text-sm text-on-surface-variant tracking-wide">
                            Queue #{dept.queueNumber} • {dept.priority}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-space-md">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low dark:bg-surface-container text-primary dark:text-primary-fixed-dim font-label-sm text-label-sm font-semibold whitespace-nowrap">
                        <Icon name={dept.strategyIcon} size={15} className="text-primary dark:text-primary-fixed-dim shrink-0" />
                        <span>{dept.strategy}</span>
                      </div>
                      <span className="block font-body-sm text-sm text-on-surface-variant mt-0.5">
                        {dept.strategyDesc}
                      </span>
                    </td>

                    <td className="py-3.5 px-space-md">
                      <span className="font-code-sm text-code-sm font-semibold text-on-surface bg-surface-container-low dark:bg-surface-container px-2 py-0.5 rounded border border-outline-variant/20">
                        {dept.timeout}
                      </span>
                      <span className="block font-body-sm text-sm text-on-surface-variant mt-0.5">
                        {dept.fallback}
                      </span>
                    </td>

                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-sm">
                        {dept.agentInitials.length > 0 ? (
                          <div className="flex -space-x-2 overflow-hidden">
                            {dept.agentInitials.map((init, i) => (
                              <div
                                key={i}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-container-lowest bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center"
                              >
                                {init}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-on-surface-variant text-sm italic">
                            None assigned
                          </span>
                        )}
                        <span className="font-label-md text-label-md font-semibold text-on-surface">
                          {dept.agentCount} Agents
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-space-md">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
                        <span>{dept.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-space-lg text-right">
                      <button
                        onClick={() => handleOpenEditDept(dept)}
                        className="px-space-md py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all active:scale-95 inline-flex items-center gap-1 border border-outline-variant/30 shadow-xs hover:shadow"
                        type="button"
                      >
                        <Icon name="tune" className="text-[16px] text-on-surface-variant" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Agents & Softphones Section */}
      {activeTab === "agents" && (
        <div className="space-y-space-xl">
          <div className="w-full bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(65,18,100,0.06)] overflow-hidden">
            <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20">
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Icon name="badge" className="text-[22px]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl text-primary dark:text-primary-fixed-dim font-bold">
                      Agents
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary dark:bg-primary-container dark:text-primary-fixed text-xs font-semibold">
                      {agents.length} Configured
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Manage softphone extensions and SIP credentials.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAddAgentModalOpen(true)}
                className="inline-flex items-center justify-center gap-space-xs px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm active:scale-95 self-start sm:self-auto"
                type="button"
              >
                <Icon name="person_add" className="text-[18px]" />
                <span>Add Agent</span>
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-on-surface font-body-md">
                <thead className="bg-surface-container-low/70 dark:bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
                  <tr>
                    <th className="py-3 px-space-lg font-label-sm text-label-sm uppercase tracking-wider">
                      Agent Name
                    </th>
                    <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                      Assigned Department
                    </th>
                    <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                      SIP Extension
                    </th>
                    <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                      SIP Softphone Config
                    </th>
                    <th className="py-3 px-space-lg font-label-sm text-label-sm uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {agents.map((ag) => (
                    <tr
                      key={ag.id}
                      className="hover:bg-surface-container-low/50 dark:hover:bg-surface-container/40 transition-colors"
                    >
                      <td className="py-3.5 px-space-lg">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs tracking-wider shrink-0">
                            {ag.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                              {ag.name}
                            </span>
                            <span className="font-body-sm text-sm text-on-surface-variant">
                              {ag.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-space-md">
                        <span className="font-code-sm text-code-sm text-on-surface">
                          {ag.email}
                        </span>
                      </td>

                      <td className="py-3.5 px-space-md">
                        <span className="font-label-md text-label-md font-medium text-on-surface">
                          {ag.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-space-md">
                        <span className="font-code-sm text-code-sm font-bold text-primary dark:text-primary-fixed-dim bg-primary-fixed/40 dark:bg-primary-container px-2 py-1 rounded border border-primary/20">
                          Ext #{ag.extension}
                        </span>
                      </td>

                      <td className="py-3.5 px-space-md">
                        {ag.status === "Available" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
                            <span>Available</span>
                          </span>
                        )}
                        {ag.status === "Busy" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-secondary-container" />
                            <span>Busy</span>
                          </span>
                        )}
                        {ag.status === "Offline" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-outline" />
                            <span>Offline</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-space-md">
                        <button
                          onClick={() => {
                            setSelectedAgentSip(ag);
                            setSipModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-lg bg-surface-container-high dark:bg-surface-container hover:bg-surface-container-highest text-primary dark:text-primary-fixed-dim font-label-md text-label-md font-semibold transition-all border border-outline-variant/30"
                          type="button"
                        >
                          <Icon name="key" className="text-[16px] text-primary dark:text-primary-fixed-dim" />
                          <span>View SIP Credentials</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-space-lg text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleDownloadMicroSipConfig(ag)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                            title="Download MicroSIP config"
                            type="button"
                          >
                            <Icon name="download" className="text-[18px]" />
                          </button>
                          <button
                            onClick={() => showToast(`Edit Agent ${ag.name}`, "info")}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                            title="Edit Agent"
                            type="button"
                          >
                            <Icon name="edit" className="text-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inline Quick Softphone Reference Card (From Stitch UI 2) */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-[0_4px_16px_rgba(40,0,68,0.04)] p-space-lg flex flex-col gap-space-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-on-surface">
                    SIP Softphone Setup
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-tertiary-container font-mono text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
                    TLS / SRTP READY
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Register any SIP softphone (MicroSIP, Linphone, Zoiper) using these credentials.
                </p>
              </div>

              <div className="flex items-center gap-space-sm self-start md:self-auto">
                <span className="font-code-sm text-code-sm text-on-surface-variant">
                  Active Sample: <strong className="text-primary dark:text-primary-fixed-dim">Ext #101 (Sadman Kabir)</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col justify-between gap-space-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    SIP Server Host
                  </span>
                  <Icon name="dns" className="text-primary dark:text-primary-fixed-dim text-[18px]" />
                </div>
                <div className="flex items-center justify-between gap-space-xs">
                  <span className="font-code-sm text-code-sm text-on-surface font-semibold select-all truncate">
                    sip.dialyra.com
                  </span>
                  <button
                    onClick={() => handleCopy("sip.dialyra.com", "SIP Host")}
                    className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                    title="Copy Host"
                    type="button"
                  >
                    <Icon name="content_copy" className="text-[18px]" />
                  </button>
                </div>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col justify-between gap-space-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    SIP Port
                  </span>
                  <Icon name="settings_ethernet" className="text-primary dark:text-primary-fixed-dim text-[18px]" />
                </div>
                <div className="flex items-center justify-between gap-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-code-sm text-code-sm text-on-surface font-semibold select-all">
                      5060
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      (Default UDP/TLS)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy("5060", "SIP Port")}
                    className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                    title="Copy Port"
                    type="button"
                  >
                    <Icon name="content_copy" className="text-[18px]" />
                  </button>
                </div>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col justify-between gap-space-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Username / Ext
                  </span>
                  <Icon name="badge" className="text-primary dark:text-primary-fixed-dim text-[18px]" />
                </div>
                <div className="flex items-center justify-between gap-space-xs">
                  <span className="font-code-sm text-code-sm text-on-surface font-semibold select-all">
                    agent_101
                  </span>
                  <button
                    onClick={() => handleCopy("agent_101", "SIP Username")}
                    className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors"
                    title="Copy Username"
                    type="button"
                  >
                    <Icon name="content_copy" className="text-[18px]" />
                  </button>
                </div>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col justify-between gap-space-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Password / Secret
                  </span>
                  <Icon name="lock" className="text-primary dark:text-primary-fixed-dim text-[18px]" />
                </div>
                <div className="flex items-center justify-between gap-space-xs">
                  <span className="font-code-sm text-code-sm text-on-surface font-semibold select-all">
                    {pwdVisible ? "dY!89_kLq#2m9" : "••••••••••••"}
                  </span>
                  <div className="flex items-center">
                    <button
                      onClick={() => setPwdVisible(!pwdVisible)}
                      className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors"
                      title="Toggle visibility"
                      type="button"
                    >
                      <Icon name={pwdVisible ? "visibility_off" : "visibility"} size={18} />
                    </button>
                    <button
                      onClick={() => handleCopy("dY!89_kLq#2m9", "SIP Secret")}
                      className="p-1 rounded text-on-surface-variant hover:text-primary transition-colors"
                      title="Copy Secret"
                      type="button"
                    >
                      <Icon name="content_copy" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex items-center gap-space-md shadow-sm">
              <Icon name="graphic_eq" className="text-primary dark:text-primary-fixed-dim text-[20px] shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-space-xs">
                <span className="font-body-sm text-body-sm text-on-surface">
                  <strong>Recommended Softphone Audio Codecs:</strong> G.711u / PCMU (Toll Quality), Opus (24kHz Ultra-Wideband HD Voice)
                </span>
                <span className="font-code-sm text-code-sm text-on-surface-variant whitespace-nowrap">
                  Jitter Buffer: &lt; 20ms adaptive
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Calling Hours & Queue Holding Policy */}
      {activeTab === "hours" && (
        <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-[0_4px_16px_rgba(40,0,68,0.04)] p-space-lg flex flex-col gap-space-lg">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed-dim shrink-0 mt-0.5 shadow-sm">
              <Icon name="schedule" className="text-[22px]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl text-on-surface font-bold">
                Calling Hours
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Permitted automated calling hours and queue holding.
              </p>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg shadow-sm">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                Permitted Auto-Dial Window
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Triggers outside this window are automatically deferred to the morning release batch.
              </span>
            </div>

            <div className="flex items-center gap-space-md flex-wrap">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 px-space-md py-2 rounded-lg shadow-sm">
                <Icon name="wb_sunny" className="text-primary text-[18px]" />
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Start
                </span>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent font-code-sm text-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                </select>
              </div>

              <Icon name="arrow_forward" className="text-on-surface-variant text-[20px]" />

              <div className="flex items-center gap-space-xs bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 px-space-md py-2 rounded-lg shadow-sm">
                <Icon name="bedtime" className="text-secondary text-[18px]" />
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  End
                </span>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-transparent font-code-sm text-code-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
              </div>

              <div className="px-space-md py-2 rounded-lg bg-surface-container dark:bg-surface-container-high border border-outline-variant/30 text-on-surface font-code-sm text-code-sm font-semibold">
                (Asia/Dhaka GMT+6)
              </div>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
            <label className="flex items-start gap-space-md cursor-pointer select-none">
              <input
                checked={nightQueueHolding}
                onChange={(e) => setNightQueueHolding(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                type="checkbox"
              />
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg font-semibold text-on-surface">
                  Nighttime Queue Holding
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-0.5">
                  Automatically pause and hold orders placed after 9:00 PM, and automatically place the calls at 9:01 AM the next morning.
                </span>
              </div>
            </label>

            <div className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 shadow-sm self-start md:self-auto shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
              <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                Next release queue at 09:01 AM:
              </span>
              <span className="font-code-sm text-code-sm text-primary dark:text-primary-fixed-dim font-bold px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/20">
                14 held orders
              </span>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
            <label className="flex items-start gap-space-md cursor-pointer select-none">
              <input
                checked={fridayPrayerPause}
                onChange={(e) => setFridayPrayerPause(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                type="checkbox"
              />
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg font-semibold text-on-surface">
                  Friday Jumu&apos;ah Prayer Pause
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl mt-0.5">
                  Automatically pause automated calls between 12:45 PM and 2:00 PM every Friday.
                </span>
              </div>
            </label>

            <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-label-sm font-semibold">
              Bangladesh Standard
            </span>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Pacing & Trunk Concurrency */}
      {activeTab === "pacing" && (
        <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-[0_4px_16px_rgba(40,0,68,0.04)] p-space-lg flex flex-col gap-space-lg">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed-dim shrink-0 mt-0.5 shadow-sm">
              <Icon name="speed" className="text-[22px]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl text-on-surface font-bold">
                Pacing &amp; Retries
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Trunk concurrency limits and redial intervals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {/* Max Channels */}
            <div className="p-space-lg rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    Max Concurrent Trunk Channels
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Simultaneous outbound channels through SIP trunk.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-primary-container text-on-primary font-bold text-base">
                  {maxConcurrency} Calls
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="20"
                value={maxConcurrency}
                onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant">
                <span>1 Channel (Slow)</span>
                <span>5 Channels (Standard)</span>
                <span>20 Channels (Enterprise)</span>
              </div>
            </div>

            {/* Inter-call delay */}
            <div className="p-space-lg rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    Inter-Call Delay
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Wait period between dialing successive customer orders.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-bold text-base">
                  {interCallDelay}s
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={interCallDelay}
                onChange={(e) => setInterCallDelay(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
              <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant">
                <span>1.0s (Burst)</span>
                <span>2.5s (Safe)</span>
                <span>10.0s (Relaxed)</span>
              </div>
            </div>
          </div>

          {/* Redial Escalation Ladder */}
          <div className="p-space-lg rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 space-y-space-md">
            <h3 className="text-base font-bold text-on-surface">
              Redial Escalation Ladder
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Automated redial retry sequence for unanswered or busy calls:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-2">
              <div className="p-space-md rounded-lg bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 space-y-1">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase">
                  1st Retry Attempt
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={retryInterval1}
                    onChange={(e) => setRetryInterval1(e.target.value)}
                    className="bg-transparent font-code-sm text-code-sm font-bold text-on-surface border border-outline-variant/30 rounded px-2 py-1"
                  >
                    <option value="10">After 10 Minutes</option>
                    <option value="15">After 15 Minutes</option>
                    <option value="30">After 30 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 space-y-1">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase">
                  2nd Retry Attempt
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={retryInterval2}
                    onChange={(e) => setRetryInterval2(e.target.value)}
                    className="bg-transparent font-code-sm text-code-sm font-bold text-on-surface border border-outline-variant/30 rounded px-2 py-1"
                  >
                    <option value="45">After 45 Minutes</option>
                    <option value="60">After 1 Hour</option>
                    <option value="120">After 2 Hours</option>
                  </select>
                </div>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 space-y-1">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase">
                  3rd Retry Attempt
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={retryInterval3}
                    onChange={(e) => setRetryInterval3(e.target.value)}
                    className="bg-transparent font-code-sm text-code-sm font-bold text-on-surface border border-outline-variant/30 rounded px-2 py-1"
                  >
                    <option value="180">After 3 Hours</option>
                    <option value="360">After 6 Hours</option>
                    <option value="720">After 12 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Do Not Call (DNC) Suppression Registry */}
      {activeTab === "dnc" && (
        <div className="space-y-space-xl">
          <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-[0_4px_16px_rgba(40,0,68,0.04)] p-space-lg flex flex-col gap-space-lg">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed-dim shrink-0 mt-0.5 shadow-sm">
                <Icon name="phone_disabled" className="text-[22px]" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl text-on-surface font-bold">
                  DNC Registry
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Suppressed numbers will never be dialed.
                </p>
              </div>
            </div>

            {/* Add to DNC Form */}
            <form
              onSubmit={handleAddDnc}
              className="p-space-lg rounded-xl bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 flex flex-col sm:flex-row gap-space-md items-end"
            >
              <div className="flex-1 space-y-1 w-full">
                <label className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant">
                  Phone Number (e.g. 01700000000)
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                  value={newDncPhone}
                  onChange={(e) => setNewDncPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 font-code-sm text-code-sm text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex-1 space-y-1 w-full">
                <label className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant">
                  Reason for Suppression
                </label>
                <input
                  type="text"
                  placeholder="Customer requested verbal opt-out"
                  value={newDncReason}
                  onChange={(e) => setNewDncReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shrink-0 w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Icon name="block" className="text-[18px]" />
                <span>Add to DNC</span>
              </button>
            </form>

            {/* DNC List Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-on-surface font-body-md">
                <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant/20">
                  <tr>
                    <th className="py-3 px-space-lg font-label-sm text-label-sm uppercase tracking-wider">
                      Suppressed Phone Number
                    </th>
                    <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="py-3 px-space-md font-label-sm text-label-sm uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="py-3 px-space-lg font-label-sm text-label-sm uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {dncList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-on-surface-variant">
                        No suppressed phone numbers registered.
                      </td>
                    </tr>
                  ) : (
                    dncList.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-surface-container-low/50 dark:hover:bg-surface-container/40 transition-colors"
                      >
                        <td className="py-3.5 px-space-lg">
                          <span className="font-code-sm text-code-sm font-bold text-on-surface">
                            {item.normalizedPhone}
                          </span>
                        </td>
                        <td className="py-3.5 px-space-md font-body-sm text-body-sm text-on-surface-variant">
                          {item.reason}
                        </td>
                        <td className="py-3.5 px-space-md font-code-sm text-code-sm text-on-surface-variant">
                          {item.addedAt}
                        </td>
                        <td className="py-3.5 px-space-lg text-right">
                          <button
                            onClick={() => handleRemoveDnc(item.id, item.normalizedPhone)}
                            className="px-2.5 py-1 rounded hover:bg-error-container text-error font-label-md text-label-md font-semibold transition-colors"
                            type="button"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. Tab 6: API & Webhook Credentials */}
      {activeTab === "api" && (
        <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-[0_4px_16px_rgba(40,0,68,0.04)] p-space-lg flex flex-col gap-space-lg">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high dark:bg-surface-container flex items-center justify-center text-primary dark:text-primary-fixed-dim shrink-0 mt-0.5 shadow-sm">
              <Icon name="key" className="text-[22px]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl text-on-surface font-bold">
                API &amp; Webhooks
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Storefront webhook and Asterisk AMI credentials.
              </p>
            </div>
          </div>

          <div className="space-y-space-md">
            <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 space-y-1">
              <label className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant">
                Inbound Webhook Delivery Endpoint
              </label>
              <div className="flex items-center justify-between gap-space-xs">
                <span className="font-code-sm text-code-sm font-semibold text-on-surface break-all">
                  https://api.dialyra.com/v1/webhook/{activeBusiness.uuid}
                </span>
                <button
                  onClick={() => handleCopy(`https://api.dialyra.com/v1/webhook/${activeBusiness.uuid}`, "Webhook URL")}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 text-primary dark:text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary text-xs font-bold transition-all shadow-sm shrink-0"
                  type="button"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 space-y-1">
              <label className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant">
                Webhook Signing Secret (HMAC-SHA256)
              </label>
              <div className="flex items-center justify-between gap-space-xs">
                <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                  sec_live_98a76d8ef1234abcd5678efgh
                </span>
                <button
                  onClick={() => handleCopy("sec_live_98a76d8ef1234abcd5678efgh", "Webhook Secret")}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 text-primary dark:text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary text-xs font-bold transition-all shadow-sm shrink-0"
                  type="button"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="p-space-md rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 space-y-1">
              <label className="font-label-sm text-label-sm uppercase font-semibold text-on-surface-variant">
                FreePBX Asterisk AMI Socket Gateway
              </label>
              <div className="flex items-center justify-between gap-space-xs">
                <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                  ami.internal.dialyra.com:5038 (Connected • Ping 6ms)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed-variant text-xs font-bold">
                  MUTUAL TLS OK
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL: SIP Softphone Credentials (100% Stitch UI Specification) */}
      {sipModalOpen && selectedAgentSip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md transition-all">
          <div className="w-full max-w-xl bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl shadow-[0_20px_50px_rgba(65,18,100,0.25)] border border-outline-variant/30 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-space-xl pt-space-xl pb-space-lg bg-surface-container-lowest dark:bg-surface-container-low flex items-start justify-between gap-space-md border-b border-outline-variant/20">
              <div className="flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
                  <Icon name="dialer_sip" className="text-[26px]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
                      SIP Softphone Credentials
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-code-sm text-xs font-bold">
                      READY
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Enter these exact credentials into MicroSIP, Linphone, or Zoiper for agent <strong>{selectedAgentSip.name} (Ext #{selectedAgentSip.extension})</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSipModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container transition-colors flex items-center justify-center shrink-0"
                type="button"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-space-xl py-space-md space-y-space-md">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  SIP Server Host / Domain
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <Icon name="dns" className="text-[18px] text-primary dark:text-primary-fixed-dim" />
                    <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                      sip.dialyra.com
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy("sip.dialyra.com", "SIP Host")}
                    className="px-2.5 py-1 rounded bg-surface-container-lowest dark:bg-surface-container-low text-primary dark:text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary text-xs font-label-sm font-bold transition-all shadow-sm"
                    type="button"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Port
                  </label>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30">
                    <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                      5060
                    </span>
                    <span className="font-code-sm text-sm text-on-surface-variant">
                      Default SIP
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Transport Protocol
                  </label>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30">
                    <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                      UDP / TLS
                    </span>
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                      SRTP Encrypted
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  SIP Username / Extension Auth
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <Icon name="account_circle" className="text-[18px] text-primary dark:text-primary-fixed-dim" />
                    <span className="font-code-sm text-code-sm font-semibold text-on-surface">
                      {selectedAgentSip.sipUser}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedAgentSip.sipUser, "Username")}
                    className="px-2.5 py-1 rounded bg-surface-container-lowest dark:bg-surface-container-low text-primary dark:text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary text-xs font-label-sm font-bold transition-all shadow-sm"
                    type="button"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  SIP Secret (Password)
                </label>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <Icon name="lock" className="text-[18px] text-primary dark:text-primary-fixed-dim" />
                    <span className="font-code-sm text-code-sm font-semibold text-on-surface tracking-wider">
                      {pwdVisible ? selectedAgentSip.sipSecret : "••••••••••••"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPwdVisible(!pwdVisible)}
                      className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                      title="Toggle visibility"
                      type="button"
                    >
                      <Icon name={pwdVisible ? "visibility_off" : "visibility"} size={18} />
                    </button>
                    <button
                      onClick={() => handleCopy(selectedAgentSip.sipSecret, "Password")}
                      className="px-2.5 py-1 rounded bg-surface-container-lowest dark:bg-surface-container-low text-primary dark:text-primary-fixed-dim hover:bg-primary-container hover:text-on-primary text-xs font-label-sm font-bold transition-all shadow-sm"
                      type="button"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-primary-fixed/30 dark:bg-primary-container/40 flex items-center gap-space-sm text-on-primary-fixed-variant">
                <Icon name="graphic_eq" className="text-[20px] text-primary dark:text-primary-fixed-dim shrink-0" />
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-bold text-primary dark:text-primary-fixed-dim">
                    Recommended Softphone Audio Codecs
                  </span>
                  <span className="font-body-sm text-sm text-on-surface-variant">
                    G.711u / PCMU (Toll Quality), Opus (24kHz Ultra-Wideband HD Voice)
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-space-xl py-space-lg bg-surface-container-low/60 dark:bg-surface-container flex flex-wrap items-center justify-end gap-space-sm border-t border-outline-variant/20">
              <button
                onClick={() => setSipModalOpen(false)}
                className="px-space-lg py-2 rounded-lg bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant/30 text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all shadow-sm"
                type="button"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast("SIP 200 OK — Registration test successful on port 5060!", "success");
                }}
                className="px-space-lg py-2 rounded-lg bg-surface-container-highest dark:bg-surface-container text-primary dark:text-primary-fixed-dim font-label-md text-label-md hover:bg-surface-container transition-all flex items-center gap-1.5"
                type="button"
              >
                <Icon name="cell_tower" className="text-[18px]" />
                <span>Test SIP Registration</span>
              </button>
              <button
                onClick={() => handleDownloadMicroSipConfig(selectedAgentSip)}
                className="px-space-lg py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-[0_4px_12px_rgba(65,18,100,0.2)] flex items-center gap-1.5 active:scale-95"
                type="button"
              >
                <Icon name="download" className="text-[18px]" />
                <span>Download .microSIP Config</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL: Add Department */}
      {addDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-low rounded-xl shadow-2xl border border-outline-variant/30 p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim mb-1">
              Add Call Routing Department
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Create a new PBX department queue for human transfers.
            </p>

            <form onSubmit={handleAddDepartment} className="space-y-space-md">
              <div>
                <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Billing & Returns"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                    Queue Number
                  </label>
                  <input
                    type="text"
                    value={deptForm.queueNumber}
                    onChange={(e) => setDeptForm({ ...deptForm, queueNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-code-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                    Ring Timeout
                  </label>
                  <div className="relative">
                    <select
                      value={deptForm.timeout}
                      onChange={(e) => setDeptForm({ ...deptForm, timeout: e.target.value })}
                      className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-code-sm appearance-none"
                    >
                      <option value="15s">15s</option>
                      <option value="20s">20s</option>
                      <option value="30s">30s</option>
                      <option value="45s">45s</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                  Routing Strategy
                </label>
                <div className="relative">
                  <select
                    value={deptForm.strategy}
                    onChange={(e) => setDeptForm({ ...deptForm, strategy: e.target.value })}
                    className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-label-md appearance-none"
                  >
                    <option value="Round Robin">Round Robin (Next Available Agent)</option>
                    <option value="Simultaneous Ring">Simultaneous Ring (Blast All Phones)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                    <Icon name="expand_more" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-space-sm pt-space-sm">
                <button
                  type="button"
                  onClick={() => setAddDeptModalOpen(false)}
                  className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11b. MODAL: Edit Department (Full PBX API PUT /departments/:id support) */}
      {editDeptModalOpen && editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-low rounded-xl shadow-2xl border border-outline-variant/30 p-space-lg">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
                Edit Department
              </h3>
              <button
                type="button"
                onClick={() => setEditDeptModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Update routing rules, extension, and fallback policy.
            </p>

            <form onSubmit={handleSaveEditDept} className="space-y-space-md">
              <div>
                <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={editDeptForm.name}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:border-primary shadow-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                    Queue Number
                  </label>
                  <input
                    type="text"
                    value={editDeptForm.queueNumber}
                    onChange={(e) => setEditDeptForm({ ...editDeptForm, queueNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-code-sm shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                    Ring Timeout
                  </label>
                  <div className="relative">
                    <select
                      value={editDeptForm.timeout}
                      onChange={(e) => setEditDeptForm({ ...editDeptForm, timeout: e.target.value })}
                      className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-code-sm shadow-xs appearance-none"
                    >
                      <option value="15s">15s</option>
                      <option value="20s">20s</option>
                      <option value="25s">25s</option>
                      <option value="30s">30s</option>
                      <option value="45s">45s</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                  Routing Strategy
                </label>
                <div className="relative">
                  <select
                    value={editDeptForm.strategy}
                    onChange={(e) => setEditDeptForm({ ...editDeptForm, strategy: e.target.value })}
                    className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-label-md shadow-xs appearance-none"
                  >
                    <option value="Round Robin">Round Robin (Distribute calls evenly)</option>
                    <option value="Simultaneous Ring">Simultaneous Ring (Blast all phones simultaneously)</option>
                    <option value="Least Recent">Least Recent (Ring longest idle agent)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                    <Icon name="expand_more" size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                  Fallback Destination
                </label>
                <div className="relative">
                  <select
                    value={editDeptForm.fallback}
                    onChange={(e) => setEditDeptForm({ ...editDeptForm, fallback: e.target.value })}
                    className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-label-md shadow-xs appearance-none"
                  >
                    <option value="Fallback to voicemail">Fallback to Voicemail</option>
                    <option value="Then fallback to voicemail">Then fallback to voicemail</option>
                    <option value="Escalate to Tier 2 (Ext #4002)">Escalate to Tier 2 (Ext #4002)</option>
                    <option value="Then fallback to Supervisor #103">Then fallback to Supervisor #103</option>
                    <option value="Repeat Current Menu">Repeat Current Menu</option>
                    <option value="Disconnect Call">Disconnect Call</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                    <Icon name="expand_more" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-space-sm pt-space-sm">
                <button
                  type="button"
                  onClick={() => setEditDeptModalOpen(false)}
                  className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md shadow-xs hover:bg-surface-container transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. MODAL: Add Agent */}
      {addAgentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-low rounded-xl shadow-2xl border border-outline-variant/30 p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim mb-1">
              Register New Agent &amp; Extension
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Create a softphone account for human staff.
            </p>

            <form onSubmit={handleAddAgent} className="space-y-space-md">
              <div>
                <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                  Agent Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nusrat Jahan"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. nusrat@store.com"
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-body-md focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                    Assigned Dept
                  </label>
                  <select
                    value={agentForm.department}
                    onChange={(e) => setAgentForm({ ...agentForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-label-md"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant mb-1">
                    SIP Extension
                  </label>
                  <input
                    type="text"
                    value={agentForm.extension}
                    onChange={(e) => setAgentForm({ ...agentForm, extension: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low dark:bg-surface-container border border-outline-variant/30 text-on-surface font-code-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-space-sm pt-space-sm">
                <button
                  type="button"
                  onClick={() => setAddAgentModalOpen(false)}
                  className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold"
                >
                  Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Save/Discard Bar (Only shown if anything has changed) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-surface-container-lowest/95 dark:bg-surface-container-low/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 pr-2 border-r border-outline-variant/30 text-sm font-semibold text-primary dark:text-primary-fixed-dim">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span>Unsaved Changes</span>
          </div>
          <button
            onClick={() => {
              setHasChanges(false);
              showToast("Changes discarded", "info");
            }}
            className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-95"
            type="button"
          >
            Discard
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-sm hover:bg-primary transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
            type="button"
          >
            {isSaving ? (
              <>
                <Icon name="refresh" className="text-[18px] animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon name="done_all" className="text-[18px]" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
