"use client";

import React, { useState } from "react";
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
} from "lucide-react";

type SettingsTab = "profile" | "hours" | "dnc" | "api";

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
  });

  // Password & OTP State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(30);

  // Calling Hours State
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("09:00 PM");
  const [nightQueueHolding, setNightQueueHolding] = useState(true);
  const [fridayPrayerPause, setFridayPrayerPause] = useState(true);

  // DNC State
  const [dncList, setDncList] = useState(mockDncList);
  const [newDncPhone, setNewDncPhone] = useState("");
  const [newDncReason, setNewDncReason] = useState("");

  // API State
  const [apiTokenRevealed, setApiTokenRevealed] = useState(false);
  const [webhookSecretRevealed, setWebhookSecretRevealed] = useState(false);

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
      email: "admin@songsharerbazar.com",
      phone: "+8801711223344",
      timezone: "Asia/Dhaka (GMT+6)",
    });
    setStartTime("09:00 AM");
    setEndTime("09:00 PM");
    setNightQueueHolding(true);
    setFridayPrayerPause(true);
    setHasChanges(false);
    showToast("Changes discarded", "info");
  };

  // Save all changes
  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      showToast("Settings saved", "success");
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
            Store Settings &amp; Configuration
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Account profile, calling hours, number suppression, and API integration keys for{" "}
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
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
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
            </div>
          </div>

          {/* Security & Password Update Card */}
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-outline-variant/20 pb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-danger" />
              <h2 className="text-base sm:text-lg font-bold text-on-surface">Security &amp; Password</h2>
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
        <div className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-info" />
              Calling Window
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
              Automated calls will only dispatch to customers within these hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-on-surface font-semibold mb-1 text-xs sm:text-sm">
                Start Time
              </label>
              <div className="relative">
                <select
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff] appearance-none pr-8 text-xs sm:text-sm cursor-pointer"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM (Standard)</option>
                  <option value="10:00 AM">10:00 AM</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-on-surface font-semibold mb-1 text-xs sm:text-sm">
                End Time
              </label>
              <div className="relative">
                <select
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff] appearance-none pr-8 text-xs sm:text-sm cursor-pointer"
                >
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="09:00 PM">09:00 PM (Standard)</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-outline-variant/20 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="font-bold text-on-surface block">Hold Night Orders</span>
                <span className="text-xs text-on-surface-variant">
                  Orders placed after hours hold in queue and dial at 09:00 AM next morning.
                </span>
              </div>
              <input
                type="checkbox"
                checked={nightQueueHolding}
                onChange={(e) => {
                  setNightQueueHolding(e.target.checked);
                  setHasChanges(true);
                }}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div>
                <span className="font-bold text-on-surface block">Friday Prayer Break</span>
                <span className="text-xs text-on-surface-variant">
                  Automatically pause all outgoing calls between 12:30 PM – 02:00 PM on Friday.
                </span>
              </div>
              <input
                type="checkbox"
                checked={fridayPrayerPause}
                onChange={(e) => {
                  setFridayPrayerPause(e.target.checked);
                  setHasChanges(true);
                }}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DNC REGISTRY */}
      {activeTab === "dnc" && (
        <div className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
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
                <tr className="bg-surface-container-low/70 border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider font-bold">
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
        <div className="bg-white dark:bg-[#1a1329] rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-info" />
              API Credentials &amp; Webhooks
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
              Secure keys for integrating Dialyra with your WooCommerce or Shopify backend.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Live Webhook */}
            <div>
              <label className="text-on-surface-variant uppercase text-[10px] font-bold tracking-wider block mb-1">
                Order Inbound Webhook URL
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

            {/* Signing Secret */}
            <div>
              <label className="text-on-surface-variant uppercase text-[10px] font-bold tracking-wider block mb-1">
                Webhook HMAC Signing Secret
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

            {/* REST API Token */}
            <div>
              <label className="text-on-surface-variant uppercase text-[10px] font-bold tracking-wider block mb-1">
                Dialyra REST API Bearer Token
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <code className="font-mono text-on-surface text-xs truncate flex-1">
                  {apiTokenRevealed
                    ? "dly_live_token_719a0293bcf9128374a"
                    : "dly_live_token_••••••••••••••••••••"}
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
                    handleCopy("dly_live_token_719a0293bcf9128374a", "API Bearer Token")
                  }
                  className="p-1.5 rounded-lg text-[#9a55ff] hover:bg-purple-500/10 transition-colors cursor-pointer"
                  type="button"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Action Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-xs sm:text-sm font-semibold">You have unsaved changes</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiscardModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
              type="button"
            >
              Discard
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="btn-gradient-primary px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
              type="button"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* OTP Password Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
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
                  Verify &amp; Update
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
