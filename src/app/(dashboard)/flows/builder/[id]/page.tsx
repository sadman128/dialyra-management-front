"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";

interface DtmfActionItem {
  id: string;
  key: string;
  businessAction: string;
  nextStep: string;
  messageType: string;
  message: string;
  language: string;
  voice: string;
  provider: string;
  badgeColor: string;
}

export default function FlowBuilderPage() {
  const router = useRouter();
  const { showToast } = useBusiness();

  // 01. Flow Info
  const [flowName, setFlowName] = useState("Order Confirmation Flow");
  const [flowDescription, setFlowDescription] = useState(
    "Confirm orders, answer common questions, and transfer customers when needed."
  );

  // 02. Menus
  const [activeMenuName, setActiveMenuName] = useState("Main Menu");
  const [menuDescription, setMenuDescription] = useState("First message customers hear.");

  // 03. Customer Instruction Message
  const [msgType, setMsgType] = useState("Text to Speech");
  const [instructionMsg, setInstructionMsg] = useState(
    "Press 1 to confirm your order, press 2 to cancel, press 3 to talk to support."
  );
  const [instructionLang, setInstructionLang] = useState("English");
  const [instructionVoice, setInstructionVoice] = useState("Standard voice");
  const [instructionProvider, setInstructionProvider] = useState("Google TTS");
  const [isPlayingInstruction, setIsPlayingInstruction] = useState(false);

  // 04. Menu Input Settings
  const [maxDigits, setMaxDigits] = useState(1);
  const [timeoutSeconds, setTimeoutSeconds] = useState(5);
  const [maxInvalidRetries, setMaxInvalidRetries] = useState(2);
  const [maxTimeoutRetries, setMaxTimeoutRetries] = useState(1);

  // 05. DTMF Actions
  const [dtmfActions, setDtmfActions] = useState<DtmfActionItem[]>([
    {
      id: "dtmf-1",
      key: "1",
      businessAction: "Confirm order",
      nextStep: "End Flow",
      messageType: "Text to Speech",
      message: "Your order is confirmed. Thank you!",
      language: "English",
      voice: "Standard voice",
      provider: "Google TTS",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    },
    {
      id: "dtmf-2",
      key: "2",
      businessAction: "Cancel order",
      nextStep: "End Flow",
      messageType: "Text to Speech",
      message: "Your order has been cancelled.",
      language: "English",
      voice: "Standard voice",
      provider: "Google TTS",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
    },
    {
      id: "dtmf-3",
      key: "3",
      businessAction: "Transfer to department",
      nextStep: "Transfer to Support (Ext #4001)",
      messageType: "Text to Speech",
      message: "Connecting you with customer care. Please hold.",
      language: "English",
      voice: "Standard voice",
      provider: "Google TTS",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
    },
  ]);

  // 06. Invalid Input Handling
  const [invalidMsgType, setInvalidMsgType] = useState("Text to Speech");
  const [invalidMsg, setInvalidMsg] = useState("Sorry, that option is not available.");
  const [invalidLang, setInvalidLang] = useState("English");
  const [invalidVoice, setInvalidVoice] = useState("Standard voice");
  const [invalidProvider, setInvalidProvider] = useState("Google TTS");
  const [afterMaxInvalidAction, setAfterMaxInvalidAction] = useState("Repeat Current Menu");

  // 07. Timeout Handling
  const [timeoutTab, setTimeoutTab] = useState<"timeout" | "transfer_timeout" | "transfer_failed">("timeout");
  const [timeoutMsg, setTimeoutMsg] = useState("We could not complete this step. Please try again.");
  const [timeoutNextStep, setTimeoutNextStep] = useState("Repeat Current Menu");

  const [transferTimeoutMsg, setTransferTimeoutMsg] = useState("Customer care agent is busy. Please try again shortly.");
  const [transferTimeoutNextStep, setTransferTimeoutNextStep] = useState("Repeat Current Menu");

  const [transferFailedMsg, setTransferFailedMsg] = useState("Department transfer failed. Returning to menu.");
  const [transferFailedNextStep, setTransferFailedNextStep] = useState("Repeat Current Menu");

  // State
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(true);

  // Add DTMF Action
  const handleAddDtmfAction = () => {
    const nextKey = (dtmfActions.length + 1).toString();
    const newAction: DtmfActionItem = {
      id: `dtmf-${Date.now()}`,
      key: nextKey,
      businessAction: "Transfer to department",
      nextStep: "Repeat Current Menu",
      messageType: "Text to Speech",
      message: "Processing your request.",
      language: "English",
      voice: "Standard voice",
      provider: "Google TTS",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    };
    setDtmfActions([...dtmfActions, newAction]);
    showToast(`Added DTMF Keypad Action [Key ${nextKey}]`, "info");
  };

  const handleRemoveDtmfAction = (id: string) => {
    setDtmfActions(dtmfActions.filter((a) => a.id !== id));
  };

  const handleUpdateDtmfAction = (id: string, field: keyof DtmfActionItem, value: string) => {
    setDtmfActions(
      dtmfActions.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationSuccess(true);
      showToast("Flow AST syntax compiled successfully: 0 Errors, 0 Warnings", "success");
    }, 600);
  };

  const handlePublish = () => {
    showToast("Publishing flow to Dialyra Core Engine v2...", "info");
    setTimeout(() => {
      showToast("Flow successfully published and active for inbound calls!", "success");
      router.push("/flows");
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full pb-20 space-y-6">
      {/* 1. Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/flows"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm border border-gray-200 dark:border-white/10 active:scale-95 cursor-pointer font-bold text-xs"
          >
            <Icon name="arrow_back" size={16} className="text-gray-400" />
            <span>Back to Flows</span>
          </Link>
          <div className="h-5 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Icon name="schema" size={20} />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {flowName}
            </h1>
            <span className="badge-inverse-warning flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Start Menu: {activeMenuName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast("Draft saved to browser storage", "info")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm border border-gray-200 dark:border-white/10 font-bold text-xs active:scale-95 cursor-pointer"
            type="button"
          >
            <Icon name="save" size={16} className="text-gray-400" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-gradient-info text-white font-bold text-xs transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
            type="button"
          >
            <Icon name="check_circle" size={16} />
            <span>{isValidating ? "Validating..." : "Validate Flow"}</span>
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full btn-gradient-primary text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <Icon name="rocket_launch" size={16} />
            <span>Publish Flow</span>
          </button>
        </div>
      </div>

      {/* 2. Responsive 2-Column Grid (60% Form Settings, 40% Live Preview & Validation) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ==============================================================
            LEFT COLUMN (7 cols): Complete 8-Section Builder Config
            ============================================================== */}
        <div className="xl:col-span-7 flex flex-col gap-6">

          {/* Section 01: Flow Info */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center font-bold">
                  <Icon name="info" size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Flow Info</h2>
                  <p className="text-xs text-on-surface-variant">Name and describe this call flow</p>
                </div>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-surface-container-low text-primary-container font-bold">
                UUID: FLW-104
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                  Flow Name
                </label>
                <input
                  type="text"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold text-base border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                  placeholder="e.g. Order Confirmation Flow"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={flowDescription}
                  onChange={(e) => setFlowDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all resize-none"
                  placeholder="Confirm orders, answer common questions, and transfer customers when needed."
                />
              </div>
            </div>
          </section>

          {/* Section 02: Menus */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
                  <Icon name="list_alt" size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Menus</h2>
                  <p className="text-xs text-on-surface-variant">{activeMenuName} is the active start menu for this flow.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Valid
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-primary-container text-on-primary font-extrabold flex items-center justify-center text-sm shadow-xs">
                  01
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-on-surface">{activeMenuName}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-fixed text-primary">
                      Start Menu
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{menuDescription}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast("Main Menu selected for editing", "info")}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold shadow-xs border border-outline-variant/30 active:scale-95 transition-all"
                >
                  Selected
                </button>
              </div>
            </div>
          </section>

          {/* Section 03: Menu Basics */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center font-bold">
                  <Icon name="tune" size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Menu Basics</h2>
                  <p className="text-xs text-on-surface-variant">Edit the selected menu. Menu names must be unique.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                  Menu Name
                </label>
                <input
                  type="text"
                  value={activeMenuName}
                  onChange={(e) => setActiveMenuName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                  Description <span className="text-outline font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 04: Customer Instruction Message */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
                  <Icon name="record_voice_over" size={20} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Greeting Prompt</h2>
                  <p className="text-xs text-on-surface-variant">Voice greeting prompt or audio file.</p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={msgType}
                  onChange={(e) => setMsgType(e.target.value)}
                  className="px-3.5 py-1.5 pr-8 rounded-lg bg-surface-container-low text-on-surface text-xs font-bold border border-outline-variant/30 shadow-xs appearance-none"
                >
                  <option value="Text to Speech">Text to Speech</option>
                  <option value="Audio File">Audio File</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-on-surface-variant">
                  <Icon name="expand_more" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                  Message Prompt
                </label>
                <textarea
                  rows={3}
                  value={instructionMsg}
                  onChange={(e) => setInstructionMsg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      value={instructionLang}
                      onChange={(e) => setInstructionLang(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                    >
                      <option value="English">English (en-US)</option>
                      <option value="Bengali">Bengali (bn-BD)</option>
                      <option value="Hindi">Hindi (hi-IN)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                    Voice Model
                  </label>
                  <div className="relative">
                    <select
                      value={instructionVoice}
                      onChange={(e) => setInstructionVoice(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                    >
                      <option value="Standard voice">Standard voice</option>
                      <option value="Studio Neural2-A">Studio Neural2-A</option>
                      <option value="Wavenet Female">Wavenet Female</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                    Provider
                  </label>
                  <div className="relative">
                    <select
                      value={instructionProvider}
                      onChange={(e) => setInstructionProvider(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                    >
                      <option value="Google TTS">Google TTS</option>
                      <option value="Amazon Polly">Amazon Polly</option>
                      <option value="Azure Speech AI">Azure Speech AI</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Test Bar */}
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayingInstruction(!isPlayingInstruction);
                      showToast(isPlayingInstruction ? "TTS synthesis preview paused" : "Playing synthesized voice greeting", "info");
                    }}
                    className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 shadow-xs active:scale-95 transition-all"
                  >
                    <Icon name={isPlayingInstruction ? "pause" : "play_arrow"} size={18} />
                  </button>
                  <span className="text-xs font-semibold text-on-surface">
                    Instruction Audio Synthesis ({instructionLang} • {instructionProvider})
                  </span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant">0:06</span>
              </div>
            </div>
          </section>

          {/* Section 05: Menu Input Settings */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center font-bold">
                  <Icon name="dialpad" size={20} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Input Settings</h2>
                  <p className="text-xs text-on-surface-variant">Keypad wait duration and retry limits.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1">
                  Max Digits
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maxDigits}
                  onChange={(e) => setMaxDigits(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1">
                  Timeout (sec)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={timeoutSeconds}
                  onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1">
                  Max Invalid Retries
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={maxInvalidRetries}
                  onChange={(e) => setMaxInvalidRetries(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1">
                  Max Timeout Retries
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={maxTimeoutRetries}
                  onChange={(e) => setMaxTimeoutRetries(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>
            </div>
          </section>

          {/* Section 06: Keypad Actions */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-xs">
                  <Icon name="touch_app" size={20} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Keypad Actions</h2>
                  <p className="text-xs text-on-surface-variant">Map keypad digits to business actions.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddDtmfAction}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs shadow-sm hover:shadow active:scale-95 transition-all self-start sm:self-auto"
              >
                <Icon name="add" size={16} />
                <span>+ Add Action</span>
              </button>
            </div>

            <div className="space-y-4">
              {dtmfActions.map((action) => (
                <div
                  key={action.id}
                  className="p-5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-primary-container text-on-primary font-extrabold flex items-center justify-center text-base shadow-sm">
                        {action.key}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-on-surface">Input Key: {action.key}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${action.badgeColor}`}>
                            {action.businessAction}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant">Next Step: {action.nextStep}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDtmfAction(action.id)}
                      className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-surface-container-lowest transition-all"
                      title="Remove DTMF Action"
                    >
                      <Icon name="delete" size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1">
                        Business Action
                      </label>
                      <div className="relative">
                        <select
                          value={action.businessAction}
                          onChange={(e) => handleUpdateDtmfAction(action.id, "businessAction", e.target.value)}
                          className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                        >
                          <option value="Confirm order">Confirm order</option>
                          <option value="Cancel order">Cancel order</option>
                          <option value="Transfer to department">Transfer to department</option>
                          <option value="Repeat menu">Repeat menu</option>
                          <option value="End Flow">End Flow</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                          <Icon name="expand_more" size={16} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1">
                        Next Step
                      </label>
                      <div className="relative">
                        <select
                          value={action.nextStep}
                          onChange={(e) => handleUpdateDtmfAction(action.id, "nextStep", e.target.value)}
                          className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                        >
                          <option value="End Flow">End Flow</option>
                          <option value="Repeat Current Menu">Repeat Current Menu</option>
                          <option value="Transfer to Support (Ext #4001)">Transfer to Support (Ext #4001)</option>
                          <option value="Escalate to Supervisor (#4002)">Escalate to Supervisor (#4002)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                          <Icon name="expand_more" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-on-surface-variant mb-1">
                      Response Message (TTS Spoken Prompt)
                    </label>
                    <input
                      type="text"
                      value={action.message}
                      onChange={(e) => handleUpdateDtmfAction(action.id, "message", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-medium text-xs border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary-container/20 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 07: Invalid Input */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center font-bold">
                  <Icon name="error_outline" size={20} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Invalid Input</h2>
                  <p className="text-xs text-on-surface-variant">Action and prompt after unsupported keypress.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                  Message
                </label>
                <input
                  type="text"
                  value={invalidMsg}
                  onChange={(e) => setInvalidMsg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                    Provider &amp; Voice
                  </label>
                  <div className="relative">
                    <select
                      value={invalidProvider}
                      onChange={(e) => setInvalidProvider(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                    >
                      <option value="Google TTS">Google TTS • Standard voice</option>
                      <option value="Amazon Polly">Amazon Polly • Neural</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                    After Max Invalid Retry Action
                  </label>
                  <div className="relative">
                    <select
                      value={afterMaxInvalidAction}
                      onChange={(e) => setAfterMaxInvalidAction(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                    >
                      <option value="Repeat Current Menu">Repeat Current Menu</option>
                      <option value="End Flow">End Flow (Hang up)</option>
                      <option value="Transfer to Support (Ext #4001)">Transfer to Support (Ext #4001)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 08: Timeouts */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Icon name="timer" size={20} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Timeouts</h2>
                  <p className="text-xs text-on-surface-variant">Action and prompt when customer does not respond.</p>
                </div>
              </div>
            </div>

            {/* Sub-tabs for the 3 timeout handling states */}
            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/20 overflow-x-auto">
              {[
                { id: "timeout", label: "Timeout response" },
                { id: "transfer_timeout", label: "Transfer Timeout" },
                { id: "transfer_failed", label: "Transfer Failed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeoutTab(tab.id as typeof timeoutTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs whitespace-nowrap ${
                    timeoutTab === tab.id
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "bg-surface-container-lowest hover:bg-surface-container text-on-surface"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {timeoutTab === "timeout" && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                    Timeout Response Message
                  </label>
                  <input
                    type="text"
                    value={timeoutMsg}
                    onChange={(e) => setTimeoutMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                      Provider &amp; Language
                    </label>
                    <div className="relative">
                      <select className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none">
                        <option>Google TTS • English (en-US)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                        <Icon name="expand_more" size={16} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                      Next Step
                    </label>
                    <div className="relative">
                      <select
                        value={timeoutNextStep}
                        onChange={(e) => setTimeoutNextStep(e.target.value)}
                        className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                      >
                        <option value="Repeat Current Menu">Repeat Current Menu</option>
                        <option value="End Flow">End Flow</option>
                        <option value="Transfer to Support (Ext #4001)">Transfer to Support (Ext #4001)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                        <Icon name="expand_more" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {timeoutTab === "transfer_timeout" && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                    Transfer Timeout Message
                  </label>
                  <input
                    type="text"
                    value={transferTimeoutMsg}
                    onChange={(e) => setTransferTimeoutMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                    Next Step
                  </label>
                  <div className="relative">
                    <select
                      value={transferTimeoutNextStep}
                      onChange={(e) => setTransferTimeoutNextStep(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                    >
                      <option value="Repeat Current Menu">Repeat Current Menu</option>
                      <option value="Voicemail Drop">Voicemail Drop</option>
                      <option value="End Flow">End Flow</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {timeoutTab === "transfer_failed" && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1.5">
                    Transfer Failed Message
                  </label>
                  <input
                    type="text"
                    value={transferFailedMsg}
                    onChange={(e) => setTransferFailedMsg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                    Next Step
                  </label>
                  <div className="relative">
                    <select
                      value={transferFailedNextStep}
                      onChange={(e) => setTransferFailedNextStep(e.target.value)}
                      className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                    >
                      <option value="Repeat Current Menu">Repeat Current Menu</option>
                      <option value="End Flow">End Flow</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ==============================================================
            RIGHT COLUMN (5 cols): Preview Panel & Validation Panel
            ============================================================== */}
        <div className="xl:col-span-5 flex flex-col gap-6 sticky top-24">

          {/* 07 Preview Panel */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-xs">
                  <Icon name="account_tree" size={20} />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-on-surface">Menu Tree</h3>
                  <p className="text-xs text-on-surface-variant">Menu flow and keypad routing.</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs">
                Live AST
              </span>
            </div>

            {/* Tree ASCII Structure (Clean & Highly Readable) */}
            <div className="p-4 rounded-xl bg-surface-container-low font-mono text-sm leading-relaxed text-on-surface border border-outline-variant/20 overflow-x-auto shadow-inner">
              <div className="font-bold text-primary dark:text-primary-fixed-dim">
                {activeMenuName}
              </div>
              {dtmfActions.map((action, idx) => {
                const isLast = idx === dtmfActions.length - 1;
                return (
                  <div key={action.id} className="text-on-surface flex items-center gap-1.5">
                    <span className="text-outline font-normal">
                      {isLast ? "└──" : "├──"}
                    </span>
                    <span className="font-bold text-primary-container dark:text-primary-fixed">
                      {action.key}
                    </span>
                    <span className="text-outline">→</span>
                    <span className="font-semibold text-on-surface">{action.businessAction}</span>
                    <span className="text-xs text-on-surface-variant font-normal">
                      ({action.nextStep})
                    </span>
                  </div>
                );
              })}
              <div className="text-on-surface-variant flex items-center gap-1.5 mt-1 pt-1 border-t border-outline-variant/20">
                <span className="text-outline">└──</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">Timeout</span>
                <span className="text-outline">→</span>
                <span>{timeoutNextStep}</span>
              </div>
            </div>

            {/* Visual Node Chain */}
            <div className="p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Execution Flow Path
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span className="font-semibold text-on-surface">SIP Inbound Call Answered</span>
                  <span className="text-outline ml-auto">200 OK</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span className="font-semibold text-on-surface">Play Greeting Prompt ({instructionProvider})</span>
                  <span className="text-outline ml-auto">{timeoutSeconds}s Wait</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-tertiary text-on-tertiary font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span className="font-semibold text-on-surface">DTMF Keypad Evaluated</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-auto">{dtmfActions.length} Routes</span>
                </div>
              </div>
            </div>
          </section>

          {/* 08 Validation Panel */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Icon name="verified" size={20} />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-on-surface">Validation</h3>
                  <p className="text-xs text-on-surface-variant">Review warnings and publish status.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-xs shadow-xs">
                Pass
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
                <Icon name="check_circle" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Flow name is set ({flowName}).</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
                <Icon name="check_circle" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Start menu selected ({activeMenuName}).</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
                <Icon name="check_circle" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{dtmfActions.length} DTMF keypad responses configured.</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
                <Icon name="check_circle" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Invalid input and retry policies active ({maxInvalidRetries} retries).</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
                <Icon name="check_circle" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Timeout fallback triggers ({timeoutSeconds}s window).</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
              <Icon name="info" size={18} className="text-primary-container shrink-0 mt-0.5" />
              <span>Preview warnings appear here before publish. All telephony checks passed with 0 fatal errors. Ready to originate calls via Asterisk PBX.</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
