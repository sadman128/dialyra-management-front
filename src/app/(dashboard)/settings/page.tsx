"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { mockDncList } from "@/mock/mockData";
import {
  Settings,
  User,
  Clock,
  Ban,
  Code,
  Shield,
  Key,
  Copy,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

type SettingsTab = "profile" | "hours" | "dnc" | "api";

interface CallingSchedule {
  id: string;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  enabled: boolean;
}

interface ScheduleConflict {
  scheduleId1: string;
  scheduleId2: string;
  scheduleName1: string;
  scheduleName2: string;
  days: string[];
  message: string;
}

function parseTimeToMinutes(t: string): number {
  if (!t || !t.includes(":")) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function validateAndFindConflicts(schedules: CallingSchedule[]): {
  valid: boolean;
  error?: string;
  conflicts: ScheduleConflict[];
} {
  const conflicts: ScheduleConflict[] = [];

  // 1. Check individual schedule constraints
  for (const s of schedules) {
    if (!s.enabled) continue;

    if (s.days.length === 0) {
      return {
        valid: false,
        error: `"${s.name}" is enabled but has no weekdays selected.`,
        conflicts: [],
      };
    }

    const startMin = parseTimeToMinutes(s.startTime);
    const endMin = parseTimeToMinutes(s.endTime);

    if (startMin >= endMin) {
      return {
        valid: false,
        error: `"${s.name}" has invalid hours: Start time (${s.startTime}) must be strictly earlier than End time (${s.endTime}).`,
        conflicts: [],
      };
    }
  }

  // 2. Check for overlapping hours on shared weekdays
  const enabledSchedules = schedules.filter((s) => s.enabled);
  for (let i = 0; i < enabledSchedules.length; i++) {
    for (let j = i + 1; j < enabledSchedules.length; j++) {
      const s1 = enabledSchedules[i];
      const s2 = enabledSchedules[j];

      const commonDays = s1.days.filter((d) => s2.days.includes(d));
      if (commonDays.length === 0) continue;

      const s1Start = parseTimeToMinutes(s1.startTime);
      const s1End = parseTimeToMinutes(s1.endTime);
      const s2Start = parseTimeToMinutes(s2.startTime);
      const s2End = parseTimeToMinutes(s2.endTime);

      // Overlap condition: max(start1, start2) < min(end1, end2)
      if (Math.max(s1Start, s2Start) < Math.min(s1End, s2End)) {
        const daysStr = commonDays.join(", ");
        conflicts.push({
          scheduleId1: s1.id,
          scheduleId2: s2.id,
          scheduleName1: s1.name,
          scheduleName2: s2.name,
          days: commonDays,
          message: `"${s1.name}" (${s1.startTime}–${s1.endTime}) overlaps with "${s2.name}" (${s2.startTime}–${s2.endTime}) on ${daysStr}.`,
        });
      }
    }
  }

  if (conflicts.length > 0) {
    return {
      valid: false,
      error: `Schedule collision: ${conflicts[0].message} Please adjust times to prevent schedules from overriding each other.`,
      conflicts,
    };
  }

  return { valid: true, conflicts: [] };
}

const WEEKDAYS = [
  { short: "Mon", label: "Monday" },
  { short: "Tue", label: "Tuesday" },
  { short: "Wed", label: "Wednesday" },
  { short: "Thu", label: "Thursday" },
  { short: "Fri", label: "Friday" },
  { short: "Sat", label: "Saturday" },
  { short: "Sun", label: "Sunday" },
];

const INITIAL_SCHEDULES: CallingSchedule[] = [
  {
    id: "sched-1",
    name: "Weekdays Calling",
    days: ["Mon", "Tue", "Wed", "Thu"],
    startTime: "09:00",
    endTime: "20:00",
    enabled: true,
  },
  {
    id: "sched-2",
    name: "Weekend Calling",
    days: ["Fri", "Sat", "Sun"],
    startTime: "10:00",
    endTime: "18:00",
    enabled: true,
  },
];

export default function SettingsPage() {
  const { activeBusiness, showToast } = useBusiness();

  // Tab State
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Track unsaved changes for floating action bar
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile State
  const [profileForm, setProfileForm] = useState({
    businessName: activeBusiness?.name || "Songsharer Bazar",
    ownerName: "Sadman Kabir",
    email: "admin@songsharerbazar.com",
    phone: "+8801711223344",
    timezone: "Asia/Dhaka (GMT+6)",
    allowGlobalSipFallback: activeBusiness?.allowGlobalSipFallback ?? true,
    sipLoginPrefix: activeBusiness?.sipLoginPrefix || "0001",
  });

  // Password & OTP State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(30);

  // Close modals on focus loss or Escape
  React.useEffect(() => {
    const handleBlur = () => {
      setOtpModalOpen(false);
      setDiscardModalOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOtpModalOpen(false);
        setDiscardModalOpen(false);
      }
    };
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Store business-scoped schedules so saving schedules never overrides other businesses
  const [businessSchedulesMap, setBusinessSchedulesMap] = useState<Record<string, CallingSchedule[]>>({
    "biz-1": INITIAL_SCHEDULES,
    "biz-2": [
      {
        id: "sched-201",
        name: "Grocery Daily Outbound",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        startTime: "08:30",
        endTime: "21:30",
        enabled: true,
      },
    ],
  });

  // Calling Schedules State (Multiple manual weekday schedules)
  const [callingSchedules, setCallingSchedules] = useState<CallingSchedule[]>(INITIAL_SCHEDULES);

  // Sync schedules when activeBusiness changes
  useEffect(() => {
    const bizScheds = businessSchedulesMap[activeBusiness.id] || INITIAL_SCHEDULES;
    setCallingSchedules(bizScheds);
    setProfileForm({
      businessName: activeBusiness?.name || "Songsharer Bazar",
      ownerName: "Sadman Kabir",
      email: activeBusiness?.email || "admin@songsharerbazar.com",
      phone: "+8801711223344",
      timezone: activeBusiness?.timezone || "Asia/Dhaka (GMT+6)",
      allowGlobalSipFallback: activeBusiness?.allowGlobalSipFallback ?? true,
      sipLoginPrefix: activeBusiness?.sipLoginPrefix || "0001",
    });
    setHasChanges(false);
  }, [activeBusiness.id]);

  // Real-time conflict validation: detects when schedules override each other on the same day
  const scheduleValidation = useMemo(() => {
    return validateAndFindConflicts(callingSchedules);
  }, [callingSchedules]);

  const scheduleConflicts = scheduleValidation.conflicts;

  const conflictingScheduleIds = useMemo(() => {
    const ids = new Set<string>();
    scheduleConflicts.forEach((c) => {
      ids.add(c.scheduleId1);
      ids.add(c.scheduleId2);
    });
    return ids;
  }, [scheduleConflicts]);

  const handleAddSchedule = () => {
    const newSched: CallingSchedule = {
      id: `sched-${Date.now()}`,
      name: `Schedule #${callingSchedules.length + 1}`,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      startTime: "09:00",
      endTime: "18:00",
      enabled: true,
    };
    setCallingSchedules((prev) => [...prev, newSched]);
    setHasChanges(true);
    showToast("Added new calling schedule", "info");
  };

  const handleDeleteSchedule = (id: string) => {
    if (callingSchedules.length <= 1) {
      showToast("At least one calling schedule is required", "warning");
      return;
    }
    setCallingSchedules((prev) => prev.filter((s) => s.id !== id));
    setHasChanges(true);
    showToast("Schedule removed", "info");
  };

  const handleToggleSchedule = (id: string, enabled: boolean) => {
    setCallingSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    );
    setHasChanges(true);
  };

  const handleUpdateScheduleName = (id: string, name: string) => {
    setCallingSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name } : s))
    );
    setHasChanges(true);
  };

  const handleUpdateScheduleTime = (
    id: string,
    field: "startTime" | "endTime",
    val: string
  ) => {
    setCallingSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
    setHasChanges(true);
  };

  const handleToggleDay = (scheduleId: string, dayShort: string) => {
    setCallingSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== scheduleId) return s;
        const exists = s.days.includes(dayShort);
        const newDays = exists
          ? s.days.filter((d) => d !== dayShort)
          : [...s.days, dayShort];
        return { ...s, days: newDays };
      })
    );
    setHasChanges(true);
  };

  const handleSetScheduleDays = (scheduleId: string, days: string[]) => {
    setCallingSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, days } : s))
    );
    setHasChanges(true);
  };

  // DNC State
  const [dncList, setDncList] = useState(mockDncList);
  const [newDncPhone, setNewDncPhone] = useState("");
  const [newDncReason, setNewDncReason] = useState("");

  // API State
  const [v3AccessTokenRevealed, setV3AccessTokenRevealed] = useState(false);
  const [apiTokenRevealed, setApiTokenRevealed] = useState(false);
  const [webhookSecretRevealed, setWebhookSecretRevealed] = useState(false);
  const [outboundCallbackUrl, setOutboundCallbackUrl] = useState("https://store.songsharerbazar.com.bd/api/dialyra-callback");

  // Sensitive confirmation modals
  const [dncToRemove, setDncToRemove] = useState<{ id: string; phone: string } | null>(null);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  // Helper copy
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}`, "info");
  };

  // Discard all changes
  const handleDiscard = () => {
    setProfileForm({
      businessName: activeBusiness?.name || "Songsharer Bazar",
      ownerName: "Sadman Kabir",
      email: activeBusiness?.email || "admin@songsharerbazar.com",
      phone: "+8801711223344",
      timezone: activeBusiness?.timezone || "Asia/Dhaka (GMT+6)",
      allowGlobalSipFallback: activeBusiness?.allowGlobalSipFallback ?? true,
      sipLoginPrefix: activeBusiness?.sipLoginPrefix || "0001",
    });
    const bizScheds = businessSchedulesMap[activeBusiness.id] || INITIAL_SCHEDULES;
    setCallingSchedules(bizScheds);
    setHasChanges(false);
    showToast("Changes discarded", "info");
  };

  // Save all changes with strict conflict & override prevention
  const handleSaveAll = () => {
    // 1. Validate that schedules do not override or conflict with each other
    if (!scheduleValidation.valid) {
      showToast(
        scheduleValidation.error || "Cannot save: schedules override each other with overlapping hours.",
        "error"
      );
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setBusinessSchedulesMap((prev) => ({
        ...prev,
        [activeBusiness.id]: callingSchedules,
      }));
      setHasChanges(false);
      showToast("Settings and schedules saved with zero conflicts", "success");
    }, 600);
  };

  // Trigger Password change flow
  const handleRequestPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast("Please enter current and new password", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setOtpModalOpen(true);
    setOtpTimer(30);
    showToast("6-digit verification code sent to your phone", "info");
  };

  // Verify OTP and complete password update
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpCode.join("");
    if (fullOtp.length < 6) {
      showToast("Please enter complete 6-digit code", "error");
      return;
    }
    setOtpModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpCode(["", "", "", "", "", ""]);
    showToast("Password updated successfully", "success");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newArr = [...otpCode];
    newArr[index] = val.slice(-1);
    setOtpCode(newArr);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
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
      reason: newDncReason || "Customer requested opt-out",
      addedAt: new Date().toISOString().split("T")[0],
    };

    setDncList([newEntry, ...dncList]);
    setNewDncPhone("");
    setNewDncReason("");
    showToast(`Added ${formatted} to suppression list`, "success");
  };

  const handleRemoveDnc = (id: string, phone: string) => {
    setDncList(dncList.filter((item) => item.id !== id));
    showToast(`Removed ${phone}`, "info");
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-24 relative">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Settings size={20} />
            </span>
            Settings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Manage settings and preferences for{" "}
            <strong className="text-on-surface font-bold">{activeBusiness.name}</strong>.
          </p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-surface-container-low p-1.5 rounded-full w-fit border border-outline-variant/30">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "hours", label: "Calling Hours", icon: Clock },
          { id: "dnc", label: "Do Not Call", icon: Ban },
          { id: "api", label: "API & Webhooks", icon: Code },
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                activeTab === tab.id
                  ? "btn-gradient-primary text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              <IconComp size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Profile Card */}
          <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-outline-variant/20 dark:border-zinc-800/60 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-primary" />
              <h2 className="text-base sm:text-lg font-bold text-on-surface">Store Profile</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Store / Business Name
                </label>
                <input
                  type="text"
                  value={profileForm.businessName}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, businessName: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Owner / Administrator Name
                </label>
                <input
                  type="text"
                  value={profileForm.ownerName}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, ownerName: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, email: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, phone: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={profileForm.timezone}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, timezone: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff] appearance-none pr-8 cursor-pointer"
                  >
                    <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
                    <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                    <option value="UTC (GMT+0)">UTC (GMT+0)</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              {/* Dialyra v3 Telephony Controls */}
              <div className="p-3.5 rounded-xl bg-surface-container-low/80 border border-outline-variant/30 space-y-3">
                <span className="text-xs font-semibold text-[#9a55ff] block">
                  Dialyra v3 Engine Settings
                </span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profileForm.allowGlobalSipFallback}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, allowGlobalSipFallback: e.target.checked });
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 rounded text-[#9a55ff] focus:ring-[#9a55ff]/30 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-on-surface block">
                      Allow Global SIP Fallback (<code>allow_global_sip_fallback</code>)
                    </span>
                    <span className="text-[11px] text-on-surface-variant block">
                      Routes calls through shared carrier trunks when dedicated business trunk capacity is full.
                    </span>
                  </div>
                </label>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    SIP Extension Prefix (<code>sip_login_prefix</code>)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={profileForm.sipLoginPrefix}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, sipLoginPrefix: e.target.value });
                      setHasChanges(true);
                    }}
                    placeholder="0001"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-xs font-bold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Password Update Card */}
          <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-outline-variant/20 dark:border-zinc-800/60 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-danger" />
              <h2 className="text-base sm:text-lg font-bold text-on-surface">Security & Password</h2>
            </div>

            <form onSubmit={handleRequestPasswordChange} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-mono text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-[#9a55ff] flex items-center gap-2">
                <Shield size={18} className="text-[#9a55ff] shrink-0" />
                <span>Password changes require 6-digit OTP verification sent to your phone.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full btn-gradient-primary text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: CALLING HOURS */}
      {activeTab === "hours" && (
        <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-info" />
                Calling Schedules
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
                Configure manual outbound call dispatch times by weekdays. Schedules must not override each other.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSchedule}
              className="btn-gradient-primary text-white text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Add Schedule</span>
            </button>
          </div>

          {/* Schedule Conflict & Override Alert Banner */}
          {scheduleConflicts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex items-start gap-3 shadow-2xs animate-in fade-in">
              <AlertCircle size={20} className="shrink-0 text-rose-500 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Schedule Conflicts Detected (Will Override Each Other)</p>
                <p className="text-xs opacity-90">
                  Multiple schedules cannot claim overlapping hours on the same weekday. Please adjust hours or days before saving:
                </p>
                <ul className="list-disc list-inside text-xs space-y-1 pt-1 font-semibold">
                  {scheduleConflicts.map((c, i) => (
                    <li key={i}>{c.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* List of Multiple Schedules */}
          <div className="space-y-4">
            {callingSchedules.map((schedule, idx) => {
              const hasConflict = conflictingScheduleIds.has(schedule.id) && schedule.enabled;

              return (
                <div
                  key={schedule.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    hasConflict
                      ? "bg-rose-500/5 border-rose-500/50 ring-1 ring-rose-500/30 shadow-xs"
                      : schedule.enabled
                      ? "bg-surface-container-low/70 border-outline-variant/30 shadow-2xs"
                      : "bg-surface-container-low/20 border-outline-variant/15 opacity-60"
                  }`}
                >
                  {/* Header: Index, Name, Enable/Disable, Delete */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                    <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                        hasConflict
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                          : "bg-[#9a55ff]/15 text-[#9a55ff]"
                      }`}>
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={schedule.name}
                        onChange={(e) => handleUpdateScheduleName(schedule.id, e.target.value)}
                        placeholder="Schedule Name"
                        className="bg-transparent font-bold text-sm text-on-surface focus:outline-none focus:underline"
                      />
                      {hasConflict && (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                          Conflict Detected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer select-none">
                        <span className={schedule.enabled ? (hasConflict ? "text-rose-600 dark:text-rose-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold") : "text-on-surface-variant"}>
                          {schedule.enabled ? "Active" : "Disabled"}
                        </span>
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={(e) => handleToggleSchedule(schedule.id, e.target.checked)}
                          className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                        />
                      </label>

                      {callingSchedules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete Schedule"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Overlap Warning inside individual card */}
                  {hasConflict && (
                    <div className="mt-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-2 font-medium">
                      <AlertCircle size={14} className="shrink-0 text-rose-500" />
                      <span>
                        This schedule overlaps with another schedule on common weekdays. Adjust hours so they do not override each other.
                      </span>
                    </div>
                  )}

                  {/* Weekdays Selector */}
                  <div className="pt-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-on-surface-variant">
                        Active Weekdays
                      </label>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleSetScheduleDays(schedule.id, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])}
                          className="text-[#9a55ff] font-semibold hover:underline cursor-pointer"
                        >
                          All Week
                        </button>
                        <span className="text-on-surface-variant/30">/</span>
                        <button
                          type="button"
                          onClick={() => handleSetScheduleDays(schedule.id, ["Mon", "Tue", "Wed", "Thu"])}
                          className="text-[#9a55ff] font-semibold hover:underline cursor-pointer"
                        >
                          Mon-Thu
                        </button>
                        <span className="text-on-surface-variant/30">/</span>
                        <button
                          type="button"
                          onClick={() => handleSetScheduleDays(schedule.id, ["Fri", "Sat", "Sun"])}
                          className="text-[#9a55ff] font-semibold hover:underline cursor-pointer"
                        >
                          Fri-Sun
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {WEEKDAYS.map((day) => {
                        const isSelected = schedule.days.includes(day.short);
                        return (
                          <button
                            key={day.short}
                            type="button"
                            onClick={() => handleToggleDay(schedule.id, day.short)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-gradient-primary text-white shadow-xs"
                                : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/20"
                            }`}
                          >
                            {day.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Manual Time Inputs */}
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Start Time (Manual)
                      </label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleUpdateScheduleTime(schedule.id, "startTime", e.target.value)}
                        className={`w-full bg-white dark:bg-[#18181b] border rounded-xl px-3.5 py-2 font-mono font-bold text-xs sm:text-sm text-on-surface focus:outline-none shadow-2xs ${
                          hasConflict ? "border-rose-500/50 focus:border-rose-500" : "border-outline-variant/30 dark:border-zinc-800 focus:border-[#9a55ff]"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        End Time (Manual)
                      </label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleUpdateScheduleTime(schedule.id, "endTime", e.target.value)}
                        className={`w-full bg-white dark:bg-[#18181b] border rounded-xl px-3.5 py-2 font-mono font-bold text-xs sm:text-sm text-on-surface focus:outline-none shadow-2xs ${
                          hasConflict ? "border-rose-500/50 focus:border-rose-500" : "border-outline-variant/30 dark:border-zinc-800 focus:border-[#9a55ff]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Schedule Overview */}
          <div className="pt-4 border-t border-outline-variant/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-on-surface">
                Weekly Overview
              </h3>
              {scheduleConflicts.length === 0 && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={13} />
                  <span>Schedules Clean &amp; Non-overlapping</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {WEEKDAYS.map((day) => {
                const matching = callingSchedules.filter(
                  (s) => s.enabled && s.days.includes(day.short)
                );
                const dayHasConflict = scheduleConflicts.some((c) =>
                  c.days.includes(day.short)
                );

                return (
                  <div
                    key={day.short}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                      dayHasConflict
                        ? "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300 shadow-2xs"
                        : "bg-surface-container-low border-outline-variant/25"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">{day.short}</span>
                      {dayHasConflict && (
                        <span title="Overlapping conflict on this day">
                          <AlertCircle size={13} className="text-rose-500 shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {matching.length === 0 ? (
                        <span className="text-[11px] font-semibold text-on-surface-variant/50">
                          Closed
                        </span>
                      ) : dayHasConflict ? (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">
                          Overlap Clash
                        </span>
                      ) : (
                        matching.map((s) => (
                          <span
                            key={s.id}
                            className="block font-mono text-[10px] font-bold text-[#9a55ff]"
                          >
                            {s.startTime} - {s.endTime}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DNC REGISTRY */}
      {activeTab === "dnc" && (
        <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-danger" />
                Do Not Call (DNC) List
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
                Suppressed numbers that will never receive automated calls.
              </p>
            </div>
            <span className="badge-inverse-danger text-xs font-bold">
              {dncList.length} Suppressed Numbers
            </span>
          </div>

          {/* Add DNC Form */}
          <form onSubmit={handleAddDnc} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={newDncPhone}
              onChange={(e) => setNewDncPhone(e.target.value)}
              placeholder="Phone: 01711223344"
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
            />
            <input
              type="text"
              value={newDncReason}
              onChange={(e) => setNewDncReason(e.target.value)}
              placeholder="Reason (Optional)"
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-[#9a55ff]"
            />
            <button
              type="submit"
              className="btn-gradient-danger text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              Add Number
            </button>
          </form>

          {/* DNC Table */}
          <div className="overflow-x-auto border border-outline-variant/20 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-surface-container-low/70 border-b border-outline-variant/20 text-on-surface-variant text-xs font-semibold">
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Date Added</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                {dncList.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-500/[0.03]">
                    <td className="py-3 px-4 font-mono font-bold text-on-surface">{item.normalizedPhone}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{item.reason}</td>
                    <td className="py-3 px-4 text-on-surface-variant font-mono text-xs">{item.addedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          setDncToRemove({ id: item.id, phone: item.normalizedPhone })
                        }
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove"
                        type="button"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: API & WEBHOOKS */}
      {activeTab === "api" && (
        <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-info" />
              API & Webhooks
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
              API keys and inbound webhook endpoints.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* 1. Dialyra v3 Runtime Access Token */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-on-surface-variant text-xs font-semibold">
                  Dialyra v3 Access Token (<code>calls:originate</code>)
                </label>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Runtime Ready
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <code className="font-mono text-on-surface text-xs truncate flex-1">
                  {v3AccessTokenRevealed
                    ? "tok_calls_originate_948f217e293041c7fa10982348"
                    : "tok_calls_originate_••••••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setV3AccessTokenRevealed(!v3AccessTokenRevealed)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                  type="button"
                >
                  {v3AccessTokenRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() =>
                    handleCopy(
                      "tok_calls_originate_948f217e293041c7fa10982348",
                      "v3 Access Token"
                    )
                  }
                  className="p-1.5 rounded-lg text-[#9a55ff] hover:bg-purple-500/10 transition-colors cursor-pointer"
                  type="button"
                >
                  <Copy size={15} />
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Passed as <code>X-Dialyra-Access-Token</code> or <code>Bearer</code> header on <code>POST /api/v3/runtime/calls/originate</code>.
              </p>
            </div>

            {/* 2. Dialyra v2 Management JWT Token */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-on-surface-variant text-xs font-semibold">
                  Dialyra Management JWT Token (<code>businesses.manage</code>)
                </label>
                <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  Admin Scope
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <code className="font-mono text-on-surface text-xs truncate flex-1">
                  {apiTokenRevealed
                    ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiYnVzaW5lc3NJZCI6IjEiLCJyb2xlIjoiYWRtaW4ifQ.dly_sig719a"
                    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.••••••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setApiTokenRevealed(!apiTokenRevealed)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                  type="button"
                >
                  {apiTokenRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() =>
                    handleCopy("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiYnVzaW5lc3NJZCI6IjEiLCJyb2xlIjoiYWRtaW4ifQ.dly_sig719a", "Management JWT Token")
                  }
                  className="p-1.5 rounded-lg text-[#9a55ff] hover:bg-purple-500/10 transition-colors cursor-pointer"
                  type="button"
                >
                  <Copy size={15} />
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Used to author and publish IVR flows, sync SIP trunks, and configure departments.
              </p>
            </div>

            {/* 3. Inbound Webhook URL */}
            <div>
              <label className="text-on-surface-variant text-xs font-semibold block mb-1">
                Order Inbound Webhook URL (Storefront to Dialyra)
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <code className="font-mono text-on-surface text-xs truncate flex-1">
                  https://api.dialyra.com/v1/webhooks/orders/songsharer-bazar-9921
                </code>
                <button
                  onClick={() =>
                    handleCopy(
                      "https://api.dialyra.com/v1/webhooks/orders/songsharer-bazar-9921",
                      "Webhook URL"
                    )
                  }
                  className="p-1.5 rounded-lg text-[#9a55ff] hover:bg-purple-500/10 transition-colors cursor-pointer"
                  type="button"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            {/* 4. HMAC Signing Secret */}
            <div>
              <label className="text-on-surface-variant text-xs font-semibold block mb-1">
                Webhook HMAC SHA-256 Signing Secret
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <code className="font-mono text-on-surface text-xs truncate flex-1">
                  {webhookSecretRevealed
                    ? "whsec_live_948f217e293041c7fa10982348"
                    : "whsec_live_••••••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setWebhookSecretRevealed(!webhookSecretRevealed)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                  type="button"
                >
                  {webhookSecretRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() =>
                    handleCopy(
                      "whsec_live_948f217e293041c7fa10982348",
                      "Webhook Signing Secret"
                    )
                  }
                  className="p-1.5 rounded-lg text-[#9a55ff] hover:bg-purple-500/10 transition-colors cursor-pointer"
                  type="button"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            {/* 5. Outbound Store Callback URL */}
            <div>
              <label className="text-on-surface-variant text-xs font-semibold block mb-1">
                Outbound Store Callback URL (Dialyra to Storefront)
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <input
                  type="url"
                  value={outboundCallbackUrl}
                  onChange={(e) => {
                    setOutboundCallbackUrl(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-transparent font-mono text-xs text-on-surface focus:outline-none"
                  placeholder="https://yourstore.com/api/dialyra-callback"
                />
                <button
                  onClick={() =>
                    handleCopy(outboundCallbackUrl, "Callback URL")
                  }
                  className="p-1.5 rounded-lg text-[#9a55ff] hover:bg-purple-500/10 transition-colors cursor-pointer"
                  type="button"
                >
                  <Copy size={15} />
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Dialyra dispatches signed webhooks here when calls are confirmed, cancelled, or retry timers expire.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Action Bar */}
      {hasChanges && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 sm:gap-4 border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[94vw]">
          <span className="text-[11px] sm:text-sm font-semibold whitespace-nowrap">
            <span className="hidden sm:inline">You have unsaved changes</span>
            <span className="sm:hidden">Unsaved changes</span>
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setDiscardModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
              type="button"
            >
              Discard
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="btn-gradient-primary px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
              type="button"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* OTP Password Verification Modal */}
      {otpModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setOtpModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Verify OTP Code
              </h3>
              <button
                onClick={() => setOtpModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Enter the 6-digit code sent via SMS to {profileForm.phone} to confirm password change.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-between gap-1.5">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-mono font-bold bg-surface-container-low border border-outline-variant/30 rounded-xl focus:outline-none focus:border-[#9a55ff] text-on-surface"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Resend code in {otpTimer}s</span>
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={() => {
                    setOtpTimer(30);
                    showToast("New OTP sent", "info");
                  }}
                  className="text-[#9a55ff] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-sm"
                >
                  Verify & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      <ConfirmModal
        isOpen={discardModalOpen}
        onClose={() => setDiscardModalOpen(false)}
        onConfirm={() => {
          setDiscardModalOpen(false);
          handleDiscard();
        }}
        title="Discard Changes"
        description="Are you sure you want to discard your unsaved changes? All modified fields will revert to their previous values."
        confirmText="Discard Changes"
        variant="warning"
        icon="history"
      />

      {/* Remove DNC Confirmation Modal */}
      <ConfirmModal
        isOpen={!!dncToRemove}
        onClose={() => setDncToRemove(null)}
        onConfirm={() => {
          if (dncToRemove) {
            handleRemoveDnc(dncToRemove.id, dncToRemove.phone);
            setDncToRemove(null);
          }
        }}
        title="Remove from DNC"
        description={`Are you sure you want to remove ${dncToRemove?.phone} from the suppression list? This number will be eligible to receive automated order confirmation calls.`}
        confirmText="Remove Number"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
