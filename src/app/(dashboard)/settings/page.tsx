"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { mockDncList } from "@/mock/mockData";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
            Account profile, calling hours, number suppression, and API keys.
          </p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-surface-container pb-3">
        {[
          { id: "profile", label: "Profile", icon: "person" },
          { id: "hours", label: "Calling Hours", icon: "schedule" },
          { id: "dnc", label: "Do Not Call", icon: "block" },
          { id: "api", label: "API & Webhooks", icon: "code" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm border ${
              activeTab === tab.id
                ? "bg-primary-container text-on-primary border-primary-container shadow"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-outline-variant/30"
            }`}
            type="button"
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Profile Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-surface-container pb-3">
              <Icon name="person" size={20} className="text-primary-container" />
              <h2 className="text-base font-bold text-on-surface">Store Profile</h2>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
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
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs"
                  >
                    <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
                    <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                    <option value="UTC (GMT+0)">UTC (GMT+0)</option>
                  </select>
                  <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Password Update Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-surface-container pb-3">
              <Icon name="lock" size={20} className="text-secondary" />
              <h2 className="text-base font-bold text-on-surface">Security &amp; Password</h2>
            </div>

            <form onSubmit={handleRequestPasswordChange} className="space-y-3.5 text-xs sm:text-sm">
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
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
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
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-mono text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-2">
                <Icon name="shield" size={18} className="text-primary-container shrink-0" />
                <span>Password changes require 6-digit OTP verification sent to your phone.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:shadow hover:bg-primary transition-all active:scale-[0.99]"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: CALLING HOURS */}
      {activeTab === "hours" && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-stitch-card border border-outline-variant/30 space-y-6">
          <div>
            <h2 className="text-base font-bold text-on-surface">Calling Window</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
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
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs text-xs sm:text-sm"
                >
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM (Standard)</option>
                  <option value="10:00 AM">10:00 AM</option>
                </select>
                <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
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
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs text-xs sm:text-sm"
                >
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="09:00 PM">09:00 PM (Standard)</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
                <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-surface-container text-xs sm:text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
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
                className="w-5 h-5 accent-primary-container rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
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
                className="w-5 h-5 accent-primary-container rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DNC REGISTRY */}
      {activeTab === "dnc" && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-stitch-card border border-outline-variant/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-on-surface">Do Not Call List</h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Suppressed numbers that will never receive automated calls.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold self-start sm:self-auto">
              {dncList.length} Suppressed
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
              className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
            />
            <input
              type="text"
              value={newDncReason}
              onChange={(e) => setNewDncReason(e.target.value)}
              placeholder="Reason (Optional)"
              className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:shadow hover:bg-primary transition-all active:scale-95 shrink-0"
            >
              Add Number
            </button>
          </form>

          {/* DNC Table */}
          <div className="overflow-x-auto border border-outline-variant/20 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container text-outline text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-4">Phone Number</th>
                  <th className="py-2.5 px-4">Reason</th>
                  <th className="py-2.5 px-4">Date Added</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-on-surface">
                {dncList.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/40">
                    <td className="py-2.5 px-4 font-mono font-bold">{item.normalizedPhone}</td>
                    <td className="py-2.5 px-4 text-on-surface-variant">{item.reason}</td>
                    <td className="py-2.5 px-4 text-outline font-mono text-xs">{item.addedAt}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() =>
                          setDncToRemove({ id: item.id, phone: item.normalizedPhone })
                        }
                        className="p-1 rounded text-outline hover:text-error hover:bg-error-container/20 shadow-xs transition-colors"
                        title="Remove"
                        type="button"
                      >
                        <Icon name="delete" size={16} />
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
        <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-stitch-card border border-outline-variant/30 space-y-6">
          <div>
            <h2 className="text-base font-bold text-on-surface">API Credentials &amp; Webhooks</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Secure keys for integrating Dialyra with your WooCommerce or Shopify backend.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Live Webhook */}
            <div>
              <label className="text-outline uppercase text-[10px] font-bold tracking-wider block mb-1">
                Order Webhook URL
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
                  className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container shadow-xs"
                  type="button"
                >
                  <Icon name="save" size={16} />
                </button>
              </div>
            </div>

            {/* Signing Secret */}
            <div>
              <label className="text-outline uppercase text-[10px] font-bold tracking-wider block mb-1">
                Signing Secret
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <code className="font-mono text-on-surface text-xs truncate flex-1">
                  {webhookSecretRevealed
                    ? "whsec_live_948f217e293041c7fa10982348"
                    : "whsec_live_••••••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setWebhookSecretRevealed(!webhookSecretRevealed)}
                  className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant shadow-xs"
                  type="button"
                >
                  <Icon name={webhookSecretRevealed ? "visibility_off" : "visibility"} size={16} />
                </button>
                <button
                  onClick={() =>
                    handleCopy(
                      "whsec_live_948f217e293041c7fa10982348",
                      "Signing Secret"
                    )
                  }
                  className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container shadow-xs"
                  type="button"
                >
                  <Icon name="save" size={16} />
                </button>
              </div>
            </div>

            {/* REST API Token */}
            <div>
              <label className="text-outline uppercase text-[10px] font-bold tracking-wider block mb-1">
                REST API Bearer Token
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <code className="font-mono text-on-surface text-xs truncate flex-1">
                  {apiTokenRevealed
                    ? "dly_live_tok_991823746198471928374"
                    : "dly_live_tok_•••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setApiTokenRevealed(!apiTokenRevealed)}
                  className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant shadow-xs"
                  type="button"
                >
                  <Icon name={apiTokenRevealed ? "visibility_off" : "visibility"} size={16} />
                </button>
                <button
                  onClick={() =>
                    handleCopy("dly_live_tok_991823746198471928374", "API Token")
                  }
                  className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container shadow-xs"
                  type="button"
                >
                  <Icon name="save" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Floating Save / Discard Bar (Only shown if anything has changed) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40 bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-2xl border border-outline-variant/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-on-surface">Unsaved Changes</span>
          </div>

          <div className="h-4 w-px bg-surface-container" />

          <button
            onClick={() => setDiscardModalOpen(true)}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl border border-outline-variant/40 text-on-surface hover:bg-surface-container text-xs font-bold shadow-xs transition-all active:scale-95"
            type="button"
          >
            Discard
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95"
            type="button"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon name="save" size={15} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 5. 6-Digit OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container/15 text-primary-container flex items-center justify-center font-bold">
                  <Icon name="security" size={18} />
                </div>
                <h3 className="text-base font-bold text-on-surface">Verify Security Code</h3>
              </div>
              <button
                onClick={() => setOtpModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Enter the 6-digit verification code sent to <strong>{profileForm.phone}</strong>:
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
                    className="w-10 h-12 text-center text-lg font-bold font-mono bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 shadow-xs"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Code expires in 05:00</span>
                <button
                  type="button"
                  onClick={() => showToast("Resent OTP code to your phone", "info")}
                  className="text-primary-container font-bold hover:underline"
                >
                  Resend Code
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low text-xs font-semibold shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold text-xs shadow-sm hover:shadow hover:bg-primary transition"
                >
                  Verify &amp; Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove from DNC Confirmation Modal */}
      <ConfirmModal
        isOpen={!!dncToRemove}
        onClose={() => setDncToRemove(null)}
        onConfirm={() => {
          if (dncToRemove) {
            handleRemoveDnc(dncToRemove.id, dncToRemove.phone);
            setDncToRemove(null);
          }
        }}
        title="Remove from Do Not Call"
        description={`Are you sure you want to remove ${dncToRemove?.phone} from the suppression list? This number will become eligible to receive automated order calls again.`}
        confirmText="Remove Number"
        variant="warning"
        icon="block"
      />

      {/* Discard Changes Confirmation Modal */}
      <ConfirmModal
        isOpen={discardModalOpen}
        onClose={() => setDiscardModalOpen(false)}
        onConfirm={() => {
          setDiscardModalOpen(false);
          handleDiscard();
        }}
        title="Discard Unsaved Changes"
        description="Are you sure you want to discard your unsaved modifications? All recent settings adjustments will be reset."
        confirmText="Discard Changes"
        variant="warning"
        icon="undo"
      />
    </div>
  );
}
