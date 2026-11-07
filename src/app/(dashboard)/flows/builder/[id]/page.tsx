"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { AudioAsset, mockDepartments } from "@/mock/mockData";
import { Icon } from "@/components/ui/Icon";

export interface DtmfActionItem {
  id: string;
  key: string;
  businessAction: string;
  nextStep: string;
  messageType: string;
  message: string;
  audioId?: string;
  language: string;
  voice: string;
  provider: string;
  badgeColor: string;
}

export interface FlowMenuNode {
  id: string;
  name: string;
  description: string;
  isStartMenu: boolean;
  msgType: string;
  instructionMsg: string;
  instructionAudioId?: string;
  instructionLang: string;
  instructionVoice: string;
  instructionProvider: string;
  maxDigits: number;
  timeoutSeconds: number;
  maxInvalidRetries: number;
  maxTimeoutRetries: number;
  dtmfActions: DtmfActionItem[];
  invalidMsgType: string;
  invalidMsg: string;
  invalidAudioId?: string;
  invalidLang: string;
  invalidVoice: string;
  invalidProvider: string;
  afterMaxInvalidAction: string;
  timeoutTab: "timeout" | "transfer_timeout" | "transfer_failed";
  timeoutMsgType?: string;
  timeoutMsg: string;
  timeoutAudioId?: string;
  timeoutNextStep: string;
  transferTimeoutMsgType?: string;
  transferTimeoutMsg: string;
  transferTimeoutAudioId?: string;
  transferTimeoutNextStep: string;
  transferFailedMsgType?: string;
  transferFailedMsg: string;
  transferFailedAudioId?: string;
  transferFailedNextStep: string;
}

// Pre-fixed / Template Menus for Quick Selection
const PRESET_MENU_TEMPLATES: Array<{
  templateKey: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  initialMenu: Omit<FlowMenuNode, "id">;
}> = [
  {
    templateKey: "order_confirmation",
    title: "Order Confirmation Menu",
    badge: "Order Ingestion",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    description: "Standard primary greeting for confirming or cancelling cash on delivery orders.",
    initialMenu: {
      name: "Order Confirmation Menu",
      description: "Primary customer confirmation menu",
      isStartMenu: false,
      msgType: "Text to Speech",
      instructionMsg: "Press 1 to confirm your order, press 2 to cancel, or press 3 for customer support.",
      instructionLang: "English",
      instructionVoice: "Standard voice",
      instructionProvider: "Google TTS",
      maxDigits: 1,
      timeoutSeconds: 5,
      maxInvalidRetries: 2,
      maxTimeoutRetries: 1,
      dtmfActions: [
        {
          id: "dtmf-c1",
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
          id: "dtmf-c2",
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
          id: "dtmf-c3",
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
      ],
      invalidMsgType: "Text to Speech",
      invalidMsg: "Sorry, that option is not available. Please try again.",
      invalidLang: "English",
      invalidVoice: "Standard voice",
      invalidProvider: "Google TTS",
      afterMaxInvalidAction: "Repeat Current Menu",
      timeoutTab: "timeout",
      timeoutMsg: "We could not complete this step. Please try again.",
      timeoutNextStep: "Repeat Current Menu",
      transferTimeoutMsg: "Customer care agent is busy. Please try again shortly.",
      transferTimeoutNextStep: "Repeat Current Menu",
      transferFailedMsg: "Department transfer failed. Returning to menu.",
      transferFailedNextStep: "Repeat Current Menu",
    },
  },
  {
    templateKey: "support_routing",
    title: "Support & Queues Sub-Menu",
    badge: "Department Transfer",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
    description: "Sub-menu routing customers to Support Desk, Accounts, or Human Operators.",
    initialMenu: {
      name: "Support Sub-Menu",
      description: "Department escalation & human operator routing",
      isStartMenu: false,
      msgType: "Text to Speech",
      instructionMsg: "Welcome to support. Press 1 for customer support, press 2 for billing inquiries, press 9 to return to previous menu.",
      instructionLang: "English",
      instructionVoice: "Standard voice",
      instructionProvider: "Google TTS",
      maxDigits: 1,
      timeoutSeconds: 6,
      maxInvalidRetries: 2,
      maxTimeoutRetries: 1,
      dtmfActions: [
        {
          id: "dtmf-s1",
          key: "1",
          businessAction: "Transfer to department",
          nextStep: "Transfer to Support (Ext #4001)",
          messageType: "Text to Speech",
          message: "Connecting to support desk.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
        },
        {
          id: "dtmf-s2",
          key: "2",
          businessAction: "Transfer to department",
          nextStep: "Transfer to Billing Queue",
          messageType: "Text to Speech",
          message: "Connecting to billing department.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
        },
        {
          id: "dtmf-s9",
          key: "9",
          businessAction: "Jump to Menu",
          nextStep: "Return to Main Menu",
          messageType: "Text to Speech",
          message: "Returning to main menu.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
        },
      ],
      invalidMsgType: "Text to Speech",
      invalidMsg: "Invalid option selected. Please listen carefully.",
      invalidLang: "English",
      invalidVoice: "Standard voice",
      invalidProvider: "Google TTS",
      afterMaxInvalidAction: "Repeat Current Menu",
      timeoutTab: "timeout",
      timeoutMsg: "No response received. Returning to menu.",
      timeoutNextStep: "Repeat Current Menu",
      transferTimeoutMsg: "All agents are busy. Please try again.",
      transferTimeoutNextStep: "Repeat Current Menu",
      transferFailedMsg: "Transfer failed. Replaying options.",
      transferFailedNextStep: "Repeat Current Menu",
    },
  },
  {
    templateKey: "cancellation_survey",
    title: "Cancellation Feedback Sub-Menu",
    badge: "Reason Capture",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
    description: "Captures why customer cancelled (e.g. ordered by mistake, late delivery, talk to manager).",
    initialMenu: {
      name: "Cancellation Reason Menu",
      description: "Collects cancellation reasons before hanging up",
      isStartMenu: false,
      msgType: "Text to Speech",
      instructionMsg: "To help us improve, press 1 if ordered by mistake, press 2 if delivery is delayed, or press 3 to speak with a manager.",
      instructionLang: "English",
      instructionVoice: "Standard voice",
      instructionProvider: "Google TTS",
      maxDigits: 1,
      timeoutSeconds: 5,
      maxInvalidRetries: 2,
      maxTimeoutRetries: 1,
      dtmfActions: [
        {
          id: "dtmf-can1",
          key: "1",
          businessAction: "Cancel order",
          nextStep: "Record: Mistake — Complete",
          messageType: "Text to Speech",
          message: "Thank you for the feedback. Your order has been cancelled.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
        },
        {
          id: "dtmf-can2",
          key: "2",
          businessAction: "Cancel order",
          nextStep: "Record: Late Delivery — Complete",
          messageType: "Text to Speech",
          message: "We apologize for the delivery delay. Order cancelled.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
        },
        {
          id: "dtmf-can3",
          key: "3",
          businessAction: "Transfer to department",
          nextStep: "Transfer to Escalations Desk",
          messageType: "Text to Speech",
          message: "Connecting you to an order retention manager.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
        },
      ],
      invalidMsgType: "Text to Speech",
      invalidMsg: "Sorry, that option is not valid.",
      invalidLang: "English",
      invalidVoice: "Standard voice",
      invalidProvider: "Google TTS",
      afterMaxInvalidAction: "Repeat Current Menu",
      timeoutTab: "timeout",
      timeoutMsg: "No response received. Order cancelled.",
      timeoutNextStep: "End Flow",
      transferTimeoutMsg: "Manager unavailable. Order recorded as cancelled.",
      transferTimeoutNextStep: "End Flow",
      transferFailedMsg: "Transfer could not be completed.",
      transferFailedNextStep: "End Flow",
    },
  },
  {
    templateKey: "language_selection",
    title: "Language Selection Gateway",
    badge: "Bilingual Gateway",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
    description: "Introductory greeting asking customers to choose English or Bengali before proceeding.",
    initialMenu: {
      name: "Language Gateway Menu",
      description: "Language selection gateway",
      isStartMenu: false,
      msgType: "Text to Speech",
      instructionMsg: "বাংলায় কথা বলতে ১ চাপুন। For English, press 2.",
      instructionLang: "Bengali",
      instructionVoice: "Standard voice",
      instructionProvider: "Google TTS",
      maxDigits: 1,
      timeoutSeconds: 5,
      maxInvalidRetries: 2,
      maxTimeoutRetries: 1,
      dtmfActions: [
        {
          id: "dtmf-l1",
          key: "1",
          businessAction: "Jump to Menu",
          nextStep: "Bangla Confirmation Menu",
          messageType: "Text to Speech",
          message: "বাংলায় কনফার্মেশন মেনুতে স্থানান্তর করা হচ্ছে।",
          language: "Bengali",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
        },
        {
          id: "dtmf-l2",
          key: "2",
          businessAction: "Jump to Menu",
          nextStep: "English Confirmation Menu",
          messageType: "Text to Speech",
          message: "Transferring to English order confirmation menu.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
        },
      ],
      invalidMsgType: "Text to Speech",
      invalidMsg: "সঠিক বাটন চাপুন। Please press 1 or 2.",
      invalidLang: "Bengali",
      invalidVoice: "Standard voice",
      invalidProvider: "Google TTS",
      afterMaxInvalidAction: "Repeat Current Menu",
      timeoutTab: "timeout",
      timeoutMsg: "কোনো উত্তর পাওয়া যায়নি। No response detected.",
      timeoutNextStep: "Repeat Current Menu",
      transferTimeoutMsg: "Transfer timed out.",
      transferTimeoutNextStep: "Repeat Current Menu",
      transferFailedMsg: "Transfer failed.",
      transferFailedNextStep: "Repeat Current Menu",
    },
  },
];

interface MessageAudioConfigProps {
  label: string;
  sublabel?: string;
  msgType: string;
  onMsgTypeChange: (type: "Text to Speech" | "Audio File") => void;
  // Text fields
  textValue: string;
  onTextChange: (val: string) => void;
  textPlaceholder?: string;
  isTextarea?: boolean;
  // Audio fields
  selectedAudioId?: string;
  onAudioSelect: (audioId: string) => void;
  onOpenUpload: () => void;
  audioAssets: AudioAsset[];
  playingAudioUrl: string | null;
  onTogglePlayAudio: (url?: string) => void;
  // Optional extras (e.g. TTS dropdowns)
  ttsExtras?: React.ReactNode;
}

function MessageAudioConfig({
  label,
  sublabel,
  msgType,
  onMsgTypeChange,
  textValue,
  onTextChange,
  textPlaceholder,
  isTextarea,
  selectedAudioId,
  onAudioSelect,
  onOpenUpload,
  audioAssets,
  playingAudioUrl,
  onTogglePlayAudio,
  ttsExtras,
}: MessageAudioConfigProps) {
  const isAudio = msgType === "Audio File";
  const selectedAsset =
    audioAssets.find((a) => a.id === selectedAudioId) || audioAssets[0];

  return (
    <div className="space-y-3">
      {/* Header with Label and 2-Option Switch: Text vs Audio */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant">
            {label}
          </label>
          {sublabel && (
            <p className="text-[11px] text-on-surface-variant/70">{sublabel}</p>
          )}
        </div>

        {/* 2-Option Pill Selector */}
        <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs">
          <button
            type="button"
            onClick={() => onMsgTypeChange("Text to Speech")}
            className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer text-xs ${
              !isAudio
                ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="record_voice_over" size={14} />
            <span>Write Text</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onMsgTypeChange("Audio File");
              if (!selectedAudioId && audioAssets.length > 0) {
                onAudioSelect(audioAssets[0].id);
              }
            }}
            className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer text-xs ${
              isAudio
                ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="audiotrack" size={14} />
            <span>Select Audio</span>
          </button>
        </div>
      </div>

      {/* OPTION 1: WRITE TEXT (TTS) */}
      {!isAudio && (
        <div className="space-y-3">
          {isTextarea ? (
            <textarea
              rows={3}
              value={textValue}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={textPlaceholder || "Type the spoken message prompt..."}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all resize-none"
            />
          ) : (
            <input
              type="text"
              value={textValue}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={textPlaceholder || "Type the response message..."}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary-container/20 transition-all"
            />
          )}

          {/* Dynamic Variable Chips for Telephony Webhook Context */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-on-surface-variant">
            <span className="text-xs font-semibold text-outline">
              Variables:
            </span>
            {[
              { label: "Customer Name", tag: "{{customer_name}}" },
              { label: "Order ID", tag: "{{order_id}}" },
              { label: "Total Amount", tag: "{{order_total}}" },
              { label: "Store Name", tag: "{{store_name}}" },
            ].map((v) => (
              <button
                key={v.tag}
                type="button"
                onClick={() =>
                  onTextChange(textValue ? `${textValue} ${v.tag}` : v.tag)
                }
                className="px-2 py-0.5 rounded-md bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-primary-container font-mono text-[10px] transition cursor-pointer active:scale-95"
                title={`Insert ${v.tag} dynamic webhook variable`}
              >
                + {v.tag}
              </button>
            ))}
          </div>

          {ttsExtras}
        </div>
      )}

      {/* OPTION 2: SELECT AUDIO FILE (Custom Audio) */}
      {isAudio && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <select
                value={selectedAudioId || (selectedAsset ? selectedAsset.id : "")}
                onChange={(e) => {
                  if (e.target.value === "__upload_new__") {
                    onOpenUpload();
                  } else {
                    onAudioSelect(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-outline-variant/30 shadow-xs appearance-none cursor-pointer"
              >
                {audioAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.durationSec}s / {asset.category})
                  </option>
                ))}
                <option value="__upload_new__">+ Upload New Audio File...</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                <Icon name="expand_more" size={16} />
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenUpload}
              className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs font-bold text-[#9a55ff] flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
            >
              <Icon name="cloud_upload" size={15} />
              <span>+ Upload Audio</span>
            </button>
          </div>

          {/* Selected Audio Asset Details Card */}
          {selectedAsset ? (
            <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-[#9a55ff]/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => onTogglePlayAudio(selectedAsset.url)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 ${
                    playingAudioUrl === selectedAsset.url
                      ? "bg-gradient-primary text-white animate-pulse"
                      : "bg-surface-container text-[#9a55ff] hover:bg-surface-container-high"
                  }`}
                  title={playingAudioUrl === selectedAsset.url ? "Pause playback" : "Play preview"}
                >
                  <Icon
                    name={playingAudioUrl === selectedAsset.url ? "pause" : "play_arrow"}
                    size={18}
                  />
                </button>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-on-surface truncate flex items-center gap-2">
                    <span className="truncate">{selectedAsset.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-[#9a55ff] shrink-0">
                      {selectedAsset.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant flex items-center gap-2 mt-0.5">
                    <span>{selectedAsset.durationSec}s duration</span>
                    <span className="text-on-surface-variant/30">/</span>
                    <span>{selectedAsset.fileSizeFormatted}</span>
                    <span className="hidden sm:inline text-on-surface-variant/30">/</span>
                    <span className="hidden sm:inline">{selectedAsset.codec}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/audio"
                target="_blank"
                className="text-[11px] font-semibold text-on-surface-variant hover:text-[#9a55ff] transition shrink-0 hidden md:inline-flex items-center gap-1"
                title="Manage audio in library"
              >
                <span>Audio Library</span>
                <Icon name="open_in_new" size={12} />
              </Link>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant border border-outline-variant/30 flex items-center justify-between">
              <span>No audio file selected. Upload or choose one above.</span>
              <button
                type="button"
                onClick={onOpenUpload}
                className="text-xs font-bold text-[#9a55ff] hover:underline"
              >
                Upload Audio
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FlowBuilderPage() {
  const router = useRouter();
  const { showToast, audioAssets, addAudioAsset } = useBusiness();

  // Audio Playback
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioPlay = (url?: string) => {
    if (!url) {
      showToast("No audio file URL available", "warning");
      return;
    }
    if (playingAudioUrl === url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setPlayingAudioUrl(null);
      setPlayingAudioUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // In-builder Upload Audio Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadCallback, setUploadCallback] = useState<((id: string) => void) | null>(null);
  const [newAudioName, setNewAudioName] = useState("");
  const [newAudioCategory, setNewAudioCategory] = useState<"ivr_prompt" | "hold_music" | "voicemail">("ivr_prompt");

  const handleOpenUploadModal = (callback: (audioId: string) => void) => {
    setUploadCallback(() => callback);
    setNewAudioName("");
    setUploadModalOpen(true);
  };

  const handleUploadAudioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudioName.trim()) return;
    const fileName =
      newAudioName.endsWith(".wav") || newAudioName.endsWith(".mp3")
        ? newAudioName.trim()
        : `${newAudioName.trim()}.wav`;

    const created = addAudioAsset({
      name: fileName,
      category: newAudioCategory,
      durationSec: 10,
      fileSizeBytes: 160000,
      fileSizeFormatted: "160 KB",
      referencedByFlows: [flowName],
      url: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
      codec: "PCM 16-bit 8000Hz / Mono",
    });

    if (uploadCallback) {
      uploadCallback(created.id);
    }
    setUploadModalOpen(false);
    setNewAudioName("");
  };

  // 01. Flow Info
  const [flowName, setFlowName] = useState("Order Confirmation Flow");
  const [flowDescription, setFlowDescription] = useState(
    "Confirm orders, answer common questions, and transfer customers when needed."
  );

  // 02. Menus Collection (Multiple menus in visual IVR tree)
  const [menus, setMenus] = useState<FlowMenuNode[]>([
    {
      id: "menu-main",
      name: "Main Menu",
      description: "First message customers hear to confirm or cancel order.",
      isStartMenu: true,
      msgType: "Text to Speech",
      instructionMsg: "Press 1 to confirm your order, press 2 to cancel, press 3 to talk to support.",
      instructionAudioId: "audio-1",
      instructionLang: "English",
      instructionVoice: "Standard voice",
      instructionProvider: "Google TTS",
      maxDigits: 1,
      timeoutSeconds: 5,
      maxInvalidRetries: 2,
      maxTimeoutRetries: 1,
      dtmfActions: [
        {
          id: "dtmf-1",
          key: "1",
          businessAction: "Confirm order",
          nextStep: "End Flow",
          messageType: "Text to Speech",
          message: "Your order is confirmed. Thank you!",
          audioId: "audio-2",
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
          audioId: "audio-4",
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
          audioId: "audio-3",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
        },
      ],
      invalidMsgType: "Text to Speech",
      invalidMsg: "Sorry, that option is not available.",
      invalidAudioId: "audio-2",
      invalidLang: "English",
      invalidVoice: "Standard voice",
      invalidProvider: "Google TTS",
      afterMaxInvalidAction: "Repeat Current Menu",
      timeoutTab: "timeout",
      timeoutMsgType: "Text to Speech",
      timeoutMsg: "We could not complete this step. Please try again.",
      timeoutAudioId: "audio-4",
      timeoutNextStep: "Repeat Current Menu",
      transferTimeoutMsgType: "Text to Speech",
      transferTimeoutMsg: "Customer care agent is busy. Please try again shortly.",
      transferTimeoutAudioId: "audio-3",
      transferTimeoutNextStep: "Repeat Current Menu",
      transferFailedMsgType: "Text to Speech",
      transferFailedMsg: "Department transfer failed. Returning to menu.",
      transferFailedAudioId: "audio-4",
      transferFailedNextStep: "Repeat Current Menu",
    },
  ]);

  const [activeMenuId, setActiveMenuId] = useState<string>("menu-main");
  const [isPlayingInstruction, setIsPlayingInstruction] = useState(false);

  // Add Menu Modal State
  const [addMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [addMenuTab, setAddMenuTab] = useState<"template" | "custom">("template");

  // Custom Menu Creation Form State
  const [customMenuName, setCustomMenuName] = useState("");
  const [customMenuDesc, setCustomMenuDesc] = useState("");
  const [customMenuMsgType, setCustomMenuMsgType] = useState<"Text to Speech" | "Audio File">("Text to Speech");
  const [customMenuPrompt, setCustomMenuPrompt] = useState("");
  const [customMenuAudioId, setCustomMenuAudioId] = useState("audio-1");

  // Edit Menu Modal State
  const [editMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editMenuName, setEditMenuName] = useState("");
  const [editMenuDesc, setEditMenuDesc] = useState("");
  const [editMenuIsStart, setEditMenuIsStart] = useState(false);
  const [editMenuMsgType, setEditMenuMsgType] = useState<"Text to Speech" | "Audio File">("Text to Speech");
  const [editMenuPrompt, setEditMenuPrompt] = useState("");
  const [editMenuAudioId, setEditMenuAudioId] = useState("audio-1");
  const [editMenuLang, setEditMenuLang] = useState("English");
  const [editMenuVoice, setEditMenuVoice] = useState("Standard voice");
  const [editMenuProvider, setEditMenuProvider] = useState("Google TTS");

  const menuEditorSectionRef = useRef<HTMLElement | null>(null);

  // Validation & Publish State
  const [isValidating, setIsValidating] = useState(false);

  // Close modals on Escape, window blur, or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAddMenuModalOpen(false);
        setUploadModalOpen(false);
        setEditMenuModalOpen(false);
      }
    };
    const handleBlur = () => {
      setAddMenuModalOpen(false);
      setUploadModalOpen(false);
      setEditMenuModalOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Currently active menu being edited
  const activeMenu = menus.find((m) => m.id === activeMenuId) || menus[0];
  const startMenu = menus.find((m) => m.isStartMenu) || menus[0];

  // Helper to update field in currently active menu
  const updateActiveMenu = <K extends keyof FlowMenuNode>(field: K, value: FlowMenuNode[K]) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === activeMenu.id ? { ...m, [field]: value } : m))
    );
  };

  // Set designated start menu
  const handleSetStartMenu = (menuId: string) => {
    setMenus((prev) =>
      prev.map((m) => ({
        ...m,
        isStartMenu: m.id === menuId,
      }))
    );
    const target = menus.find((m) => m.id === menuId);
    showToast(`"${target?.name}" set as flow Start Menu`, "success");
  };

  // Open Edit Menu Modal
  const handleOpenEditMenuModal = (menu: FlowMenuNode) => {
    setEditingMenuId(menu.id);
    setEditMenuName(menu.name);
    setEditMenuDesc(menu.description || "");
    setEditMenuIsStart(menu.isStartMenu);
    setEditMenuMsgType((menu.msgType as "Text to Speech" | "Audio File") || "Text to Speech");
    setEditMenuPrompt(menu.instructionMsg || "");
    setEditMenuAudioId(menu.instructionAudioId || "audio-1");
    setEditMenuLang(menu.instructionLang || "English");
    setEditMenuVoice(menu.instructionVoice || "Standard voice");
    setEditMenuProvider(menu.instructionProvider || "Google TTS");
    setEditMenuModalOpen(true);
  };

  // Save changes from Edit Menu Modal
  const handleSaveEditMenuModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuId || !editMenuName.trim()) {
      showToast("Menu name cannot be empty", "warning");
      return;
    }

    setMenus((prev) =>
      prev.map((m) => {
        if (m.id === editingMenuId) {
          return {
            ...m,
            name: editMenuName.trim(),
            description: editMenuDesc.trim(),
            isStartMenu: editMenuIsStart,
            msgType: editMenuMsgType,
            instructionMsg: editMenuPrompt.trim(),
            instructionAudioId: editMenuAudioId,
            instructionLang: editMenuLang,
            instructionVoice: editMenuVoice,
            instructionProvider: editMenuProvider,
          };
        }
        // If this menu was set to start menu, un-set other menus
        if (editMenuIsStart && m.isStartMenu) {
          return { ...m, isStartMenu: false };
        }
        return m;
      })
    );

    setActiveMenuId(editingMenuId);
    setEditMenuModalOpen(false);
    showToast(`Updated menu "${editMenuName}"`, "success");
  };

  // Select menu and smoothly scroll to active menu editor
  const handleSelectMenuForEditing = (menuId: string) => {
    setActiveMenuId(menuId);
    setTimeout(() => {
      menuEditorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Add menu from pre-defined template
  const handleAddFromTemplate = (templateKey: string) => {
    const template = PRESET_MENU_TEMPLATES.find((t) => t.templateKey === templateKey);
    if (!template) return;

    const newId = `menu-${Date.now()}`;
    const newName = `${template.title} ${menus.length > 1 ? `(#${menus.length + 1})` : ""}`;

    const newMenuNode: FlowMenuNode = {
      ...template.initialMenu,
      id: newId,
      name: newName,
      isStartMenu: false, // Default newly added menu to sub-menu
    };

    setMenus((prev) => [...prev, newMenuNode]);
    setActiveMenuId(newId);
    setAddMenuModalOpen(false);
    showToast(`Added "${template.title}" to flow menus`, "success");
  };

  // Add custom menu
  const handleCreateCustomMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMenuName.trim()) {
      showToast("Menu name is required", "warning");
      return;
    }

    const newId = `menu-${Date.now()}`;
    const newMenuNode: FlowMenuNode = {
      id: newId,
      name: customMenuName.trim(),
      description: customMenuDesc.trim() || "Custom IVR menu node",
      isStartMenu: false,
      msgType: customMenuMsgType,
      instructionMsg: customMenuPrompt.trim() || "Thank you for calling. Please make your selection.",
      instructionAudioId: customMenuAudioId,
      instructionLang: "English",
      instructionVoice: "Standard voice",
      instructionProvider: "Google TTS",
      maxDigits: 1,
      timeoutSeconds: 5,
      maxInvalidRetries: 2,
      maxTimeoutRetries: 1,
      dtmfActions: [
        {
          id: `dtmf-${Date.now()}-1`,
          key: "1",
          businessAction: "Confirm order",
          nextStep: "End Flow",
          messageType: "Text to Speech",
          message: "Option 1 confirmed.",
          language: "English",
          voice: "Standard voice",
          provider: "Google TTS",
          badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
        },
      ],
      invalidMsgType: "Text to Speech",
      invalidMsg: "Option not recognized. Please try again.",
      invalidLang: "English",
      invalidVoice: "Standard voice",
      invalidProvider: "Google TTS",
      afterMaxInvalidAction: "Repeat Current Menu",
      timeoutTab: "timeout",
      timeoutMsg: "No response received.",
      timeoutNextStep: "Repeat Current Menu",
      transferTimeoutMsg: "Agent transfer timed out.",
      transferTimeoutNextStep: "Repeat Current Menu",
      transferFailedMsg: "Transfer could not be completed.",
      transferFailedNextStep: "Repeat Current Menu",
    };

    setMenus((prev) => [...prev, newMenuNode]);
    setActiveMenuId(newId);
    setCustomMenuName("");
    setCustomMenuDesc("");
    setCustomMenuPrompt("");
    setAddMenuModalOpen(false);
    showToast(`Created custom menu "${newMenuNode.name}"`, "success");
  };

  // Delete menu (only allowed if > 1 menu)
  const handleDeleteMenu = (menuId: string) => {
    if (menus.length <= 1) {
      showToast("A call flow must have at least one menu.", "warning");
      return;
    }

    const menuToDelete = menus.find((m) => m.id === menuId);
    const remainingMenus = menus.filter((m) => m.id !== menuId);

    // If deleting the start menu, automatically promote the first remaining menu to start menu
    let updatedMenus = remainingMenus;
    if (menuToDelete?.isStartMenu && remainingMenus.length > 0) {
      updatedMenus = remainingMenus.map((m, idx) => ({
        ...m,
        isStartMenu: idx === 0,
      }));
    }

    setMenus(updatedMenus);
    if (activeMenuId === menuId) {
      setActiveMenuId(updatedMenus[0].id);
    }
    showToast(`Menu "${menuToDelete?.name}" deleted`, "info");
  };

  // DTMF action handlers for the active menu
  const handleAddDtmfAction = () => {
    const allKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"];
    const usedKeys = new Set(activeMenu.dtmfActions.map((a) => a.key));
    const nextKey = allKeys.find((k) => !usedKeys.has(k));

    if (!nextKey) {
      showToast(
        "All keypad digits (0-9, *, #) are already assigned in this menu.",
        "warning"
      );
      return;
    }

    const newAction: DtmfActionItem = {
      id: `dtmf-${Date.now()}`,
      key: nextKey,
      businessAction: "Transfer to department",
      nextStep: "Transfer to Customer Support (General) (SUPP-01)",
      messageType: "Text to Speech",
      message: "Processing your selection.",
      audioId: "audio-2",
      language: "English",
      voice: "Standard voice",
      provider: "Google TTS",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    };

    updateActiveMenu("dtmfActions", [...activeMenu.dtmfActions, newAction]);
    showToast(`Added Key [${nextKey}] to ${activeMenu.name}`, "info");
  };

  const handleRemoveDtmfAction = (id: string) => {
    updateActiveMenu(
      "dtmfActions",
      activeMenu.dtmfActions.filter((a) => a.id !== id)
    );
  };

  const handleUpdateDtmfAction = (id: string, field: keyof DtmfActionItem, value: string) => {
    updateActiveMenu(
      "dtmfActions",
      activeMenu.dtmfActions.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const validateFlowData = (): string[] => {
    const errors: string[] = [];
    if (!flowName.trim()) errors.push("Flow name cannot be empty.");
    if (flowName.length > 80) errors.push("Flow name exceeds 80 characters limit.");
    if (flowDescription.length > 255) errors.push("Flow description exceeds 255 characters limit.");
    if (!menus.some((m) => m.isStartMenu)) errors.push("Flow must have a designated Start Menu.");

    menus.forEach((m, idx) => {
      if (!m.name.trim()) errors.push(`Menu #${idx + 1} has no name.`);
      if (m.msgType === "Text to Speech" && !m.instructionMsg.trim()) {
        errors.push(`Menu "${m.name}" has an empty greeting prompt.`);
      }
      if (m.msgType === "Audio File" && !m.instructionAudioId) {
        errors.push(`Menu "${m.name}" has no audio file selected.`);
      }
      if (m.maxDigits < 1 || m.maxDigits > 6) {
        errors.push(`Menu "${m.name}" Max Digits must be between 1 and 6.`);
      }
      if (m.timeoutSeconds < 1 || m.timeoutSeconds > 30) {
        errors.push(`Menu "${m.name}" Timeout Seconds must be between 1 and 30.`);
      }
      if (m.maxInvalidRetries > 5) {
        errors.push(`Menu "${m.name}" Max Invalid Retries cannot exceed 5.`);
      }
      if (m.maxTimeoutRetries > 5) {
        errors.push(`Menu "${m.name}" Max Timeout Retries cannot exceed 5.`);
      }

      // Check duplicate keys in same menu
      const keysSeen = new Set<string>();
      m.dtmfActions.forEach((action) => {
        if (keysSeen.has(action.key)) {
          errors.push(`Menu "${m.name}" has duplicate keypad key [${action.key}].`);
        }
        keysSeen.add(action.key);
      });
    });

    return errors;
  };

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      const errors = validateFlowData();
      if (errors.length > 0) {
        showToast(errors[0], "error");
      } else {
        showToast(
          `Flow AST validated: ${menus.length} menus compiled with 0 errors.`,
          "success"
        );
      }
    }, 500);
  };

  const handlePublish = () => {
    const errors = validateFlowData();
    if (errors.length > 0) {
      showToast(errors[0], "error");
      return;
    }
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
              Start Menu: {startMenu.name}
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
            LEFT COLUMN (7 cols): Flow Config and Multi-Menu Editor
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
                  <p className="text-xs text-on-surface-variant">Name and describe this telephony flow.</p>
                </div>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-surface-container-low text-primary-container font-bold">
                UUID: FLW-104
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Flow Name
                  </label>
                  <span className="text-[10px] text-outline font-mono">{flowName.length}/80</span>
                </div>
                <input
                  type="text"
                  maxLength={80}
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold text-base border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                  placeholder="e.g. Order Confirmation Flow"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Description
                  </label>
                  <span className="text-[10px] text-outline font-mono">{flowDescription.length}/255</span>
                </div>
                <textarea
                  rows={2}
                  maxLength={255}
                  value={flowDescription}
                  onChange={(e) => setFlowDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-medium text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all resize-none"
                  placeholder="Confirm orders, answer common questions, and transfer customers when needed."
                />
              </div>
            </div>
          </section>

          {/* Section 02: Menus (Multi-Menu Management: Select Preset or Create Custom) */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
                  <Icon name="list_alt" size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-on-surface">Flow Menus</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-container/20 text-[#9a55ff]">
                      {menus.length} {menus.length === 1 ? "Menu" : "Menus"}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Entry point: <strong className="text-on-surface">{startMenu.name}</strong>. Select or add multiple menus.
                  </p>
                </div>
              </div>

              {/* Add Menu Action Button */}
              <button
                type="button"
                onClick={() => setAddMenuModalOpen(true)}
                className="btn-gradient-primary text-white text-xs font-bold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Icon name="add" size={16} />
                <span>+ Add Menu</span>
              </button>
            </div>

            {/* Menus Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {menus.map((m, idx) => {
                const isSelected = m.id === activeMenu.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMenuForEditing(m.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-500/10 dark:bg-purple-500/15 border-[#9a55ff] ring-2 ring-[#9a55ff]/40 shadow-sm"
                        : "bg-surface-container-low/70 hover:bg-surface-container-low border-outline-variant/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold shrink-0 ${
                            isSelected
                              ? "bg-gradient-primary text-white"
                              : "bg-surface-container text-on-surface-variant"
                          }`}>
                            0{idx + 1}
                          </span>
                          <span className="font-bold text-sm text-on-surface truncate">
                            {m.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {m.isStartMenu ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                              Start Menu
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetStartMenu(m.id);
                              }}
                              className="text-[10px] font-semibold text-on-surface-variant hover:text-[#9a55ff] px-1.5 py-0.5 rounded hover:bg-surface-container transition cursor-pointer"
                              title="Set as call entry point"
                            >
                              Make Start
                            </button>
                          )}

                          {menus.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMenu(m.id);
                              }}
                              className="p-1 text-on-surface-variant hover:text-rose-500 transition cursor-pointer"
                              title="Delete sub-menu"
                            >
                              <Icon name="delete" size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
                        {m.description || m.instructionMsg}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-on-surface-variant">
                        {m.dtmfActions.length} DTMF {m.dtmfActions.length === 1 ? "Action" : "Actions"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditMenuModal(m);
                        }}
                        className="btn-gradient-primary text-white font-bold flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs shadow-2xs hover:shadow transition active:scale-95 cursor-pointer"
                        title="Edit Menu"
                      >
                        <Icon name="edit" size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 03: Active Menu Basics */}
          <section
            ref={menuEditorSectionRef}
            className={`bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border transition-all space-y-4 ${
              activeMenu ? "border-[#9a55ff]/40 ring-1 ring-[#9a55ff]/20" : "border-outline-variant/30"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container/10 text-[#9a55ff] flex items-center justify-center font-bold">
                  <Icon name="tune" size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Menu Basics: {activeMenu.name}</h2>
                  <p className="text-xs text-on-surface-variant">Configuring properties for this selected menu.</p>
                </div>
              </div>

              <div>
                {activeMenu.isStartMenu ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                    Primary Start Menu
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetStartMenu(activeMenu.id)}
                    className="px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/30 text-on-surface hover:border-[#9a55ff] hover:text-[#9a55ff] transition cursor-pointer"
                  >
                    Set as Start Menu
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Menu Name
                </label>
                <input
                  type="text"
                  value={activeMenu.name}
                  onChange={(e) => updateActiveMenu("name", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold text-sm border border-outline-variant/30 shadow-xs focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                  Description <span className="text-outline font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={activeMenu.description}
                  onChange={(e) => updateActiveMenu("description", e.target.value)}
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
                  <p className="text-xs text-on-surface-variant">Voice message played upon entering {activeMenu.name}.</p>
                </div>
              </div>
            </div>

            <MessageAudioConfig
              label="Spoken Greeting Prompt"
              sublabel="Write text for TTS synthesis or select an uploaded custom audio file."
              msgType={activeMenu.msgType}
              onMsgTypeChange={(type) => updateActiveMenu("msgType", type)}
              isTextarea={true}
              textValue={activeMenu.instructionMsg}
              onTextChange={(val) => updateActiveMenu("instructionMsg", val)}
              textPlaceholder="e.g. Press 1 to confirm your order, press 2 to cancel, press 3 for support."
              selectedAudioId={activeMenu.instructionAudioId || "audio-1"}
              onAudioSelect={(id) => updateActiveMenu("instructionAudioId", id)}
              onOpenUpload={() =>
                handleOpenUploadModal((id) => updateActiveMenu("instructionAudioId", id))
              }
              audioAssets={audioAssets}
              playingAudioUrl={playingAudioUrl}
              onTogglePlayAudio={toggleAudioPlay}
              ttsExtras={
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Language
                      </label>
                      <div className="relative">
                        <select
                          value={activeMenu.instructionLang}
                          onChange={(e) => updateActiveMenu("instructionLang", e.target.value)}
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
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Voice Model
                      </label>
                      <div className="relative">
                        <select
                          value={activeMenu.instructionVoice}
                          onChange={(e) => updateActiveMenu("instructionVoice", e.target.value)}
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
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Provider
                      </label>
                      <div className="relative">
                        <select
                          value={activeMenu.instructionProvider}
                          onChange={(e) => updateActiveMenu("instructionProvider", e.target.value)}
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
                          showToast(
                            isPlayingInstruction
                              ? "TTS synthesis preview paused"
                              : `Synthesizing ${activeMenu.name} prompt`,
                            "info"
                          );
                        }}
                        className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 shadow-xs active:scale-95 transition-all cursor-pointer"
                      >
                        <Icon name={isPlayingInstruction ? "pause" : "play_arrow"} size={18} />
                      </button>
                      <span className="text-xs font-semibold text-on-surface">
                        Synthesize ({activeMenu.instructionLang} / {activeMenu.instructionProvider})
                      </span>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant">0:06</span>
                  </div>
                </div>
              }
            />
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
                  <p className="text-xs text-on-surface-variant">Keypad wait duration and retry limits for {activeMenu.name}.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Max Digits
                  </label>
                  <span className="text-[10px] text-outline font-mono">1-6</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={activeMenu.maxDigits}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(6, Number(e.target.value) || 1));
                    updateActiveMenu("maxDigits", val);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Timeout (sec)
                  </label>
                  <span className="text-[10px] text-outline font-mono">1-30s</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={activeMenu.timeoutSeconds}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(30, Number(e.target.value) || 1));
                    updateActiveMenu("timeoutSeconds", val);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Max Invalid
                  </label>
                  <span className="text-[10px] text-outline font-mono">0-5</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={activeMenu.maxInvalidRetries}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(5, Number(e.target.value) || 0));
                    updateActiveMenu("maxInvalidRetries", val);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    Max Timeout
                  </label>
                  <span className="text-[10px] text-outline font-mono">0-5</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={activeMenu.maxTimeoutRetries}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(5, Number(e.target.value) || 0));
                    updateActiveMenu("maxTimeoutRetries", val);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-extrabold text-lg border border-outline-variant/30 shadow-xs text-center"
                />
              </div>
            </div>
          </section>

          {/* Section 06: Keypad Actions (Can route to other menus or actions) */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-xs">
                  <Icon name="touch_app" size={20} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Keypad Actions ({activeMenu.name})</h2>
                  <p className="text-xs text-on-surface-variant">Map keypad digits to actions or jump to another menu.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddDtmfAction}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs shadow-sm hover:shadow active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Icon name="add" size={16} />
                <span>+ Add Action</span>
              </button>
            </div>

            <div className="space-y-4">
              {activeMenu.dtmfActions.map((action) => (
                <div
                  key={action.id}
                  className="p-5 rounded-xl bg-surface-container-low/70 border border-outline-variant/30 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <select
                          value={action.key}
                          onChange={(e) => {
                            const newKey = e.target.value;
                            const keyExists = activeMenu.dtmfActions.some(
                              (a) => a.id !== action.id && a.key === newKey
                            );
                            if (keyExists) {
                              showToast(
                                `Key [${newKey}] is already assigned in ${activeMenu.name}.`,
                                "warning"
                              );
                              return;
                            }
                            handleUpdateDtmfAction(action.id, "key", newKey);
                          }}
                          className="w-10 h-10 rounded-xl bg-primary-container text-on-primary font-extrabold text-base shadow-sm text-center appearance-none cursor-pointer hover:opacity-90 transition"
                          title="Change keypad digit"
                        >
                          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "*", "#"].map((k) => (
                            <option
                              key={k}
                              value={k}
                              className="bg-white dark:bg-[#18181b] text-on-surface"
                            >
                              {k}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-on-surface">
                            Keypad Digit [{action.key}]
                          </span>
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
                      className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-surface-container-lowest transition-all cursor-pointer"
                      title="Remove DTMF Action"
                    >
                      <Icon name="delete" size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Business Action
                      </label>
                      <div className="relative">
                        <select
                          value={action.businessAction}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdateDtmfAction(action.id, "businessAction", val);
                            if (val === "Jump to Menu") {
                              const otherMenu = menus.find((m) => m.id !== activeMenu.id) || menus[0];
                              handleUpdateDtmfAction(action.id, "nextStep", `Jump to: ${otherMenu.name}`);
                            }
                          }}
                          className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none cursor-pointer"
                        >
                          <option value="Confirm order">Confirm order</option>
                          <option value="Cancel order">Cancel order</option>
                          <option value="Transfer to department">Transfer to department</option>
                          <option value="Jump to Menu">Jump to Menu (Sub-menu)</option>
                          <option value="Repeat menu">Repeat menu</option>
                          <option value="End Flow">End Flow</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                          <Icon name="expand_more" size={16} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        Next Step / Destination
                      </label>
                      <div className="relative">
                        {action.businessAction === "Jump to Menu" ? (
                          <select
                            value={action.nextStep}
                            onChange={(e) => handleUpdateDtmfAction(action.id, "nextStep", e.target.value)}
                            className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-lowest text-[#9a55ff] font-bold text-xs border border-purple-500/30 shadow-xs appearance-none cursor-pointer"
                          >
                            {menus.map((m) => (
                              <option key={m.id} value={`Jump to: ${m.name}`}>
                                {m.name} {m.isStartMenu ? "(Start Menu)" : ""}
                              </option>
                            ))}
                          </select>
                        ) : action.businessAction === "Transfer to department" ? (
                          <select
                            value={action.nextStep}
                            onChange={(e) => handleUpdateDtmfAction(action.id, "nextStep", e.target.value)}
                            className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-lowest text-primary font-bold text-xs border border-outline-variant/30 shadow-xs appearance-none cursor-pointer"
                          >
                            {mockDepartments.map((dept) => (
                              <option key={dept.id} value={`Transfer to ${dept.name} (${dept.code})`}>
                                {dept.name} ({dept.code})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={action.nextStep}
                            onChange={(e) => handleUpdateDtmfAction(action.id, "nextStep", e.target.value)}
                            className="w-full px-3 py-2 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none cursor-pointer"
                          >
                            <option value="End Flow">End Flow</option>
                            <option value="Repeat Current Menu">Repeat Current Menu</option>
                          </select>
                        )}
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                          <Icon name="expand_more" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-outline-variant/15">
                    <MessageAudioConfig
                      label={`Key [${action.key}] Response Message`}
                      sublabel={`Prompt played after caller presses [${action.key}]`}
                      msgType={action.messageType || "Text to Speech"}
                      onMsgTypeChange={(type) => handleUpdateDtmfAction(action.id, "messageType", type)}
                      textValue={action.message}
                      onTextChange={(val) => handleUpdateDtmfAction(action.id, "message", val)}
                      textPlaceholder="e.g. Your order is confirmed. Thank you!"
                      selectedAudioId={action.audioId || "audio-2"}
                      onAudioSelect={(id) => handleUpdateDtmfAction(action.id, "audioId", id)}
                      onOpenUpload={() =>
                        handleOpenUploadModal((id) => handleUpdateDtmfAction(action.id, "audioId", id))
                      }
                      audioAssets={audioAssets}
                      playingAudioUrl={playingAudioUrl}
                      onTogglePlayAudio={toggleAudioPlay}
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
                  <p className="text-xs text-on-surface-variant">Action and prompt after unsupported keypress in {activeMenu.name}.</p>
                </div>
              </div>
            </div>

            <MessageAudioConfig
              label="Invalid Input Message"
              sublabel="Prompt played when caller presses an invalid or unconfigured key"
              msgType={activeMenu.invalidMsgType || "Text to Speech"}
              onMsgTypeChange={(type) => updateActiveMenu("invalidMsgType", type)}
              textValue={activeMenu.invalidMsg}
              onTextChange={(val) => updateActiveMenu("invalidMsg", val)}
              textPlaceholder="e.g. Sorry, that option is not available. Please try again."
              selectedAudioId={activeMenu.invalidAudioId || "audio-2"}
              onAudioSelect={(id) => updateActiveMenu("invalidAudioId", id)}
              onOpenUpload={() =>
                handleOpenUploadModal((id) => updateActiveMenu("invalidAudioId", id))
              }
              audioAssets={audioAssets}
              playingAudioUrl={playingAudioUrl}
              onTogglePlayAudio={toggleAudioPlay}
              ttsExtras={
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Provider &amp; Voice
                    </label>
                    <div className="relative">
                      <select
                        value={activeMenu.invalidProvider}
                        onChange={(e) => updateActiveMenu("invalidProvider", e.target.value)}
                        className="w-full px-3 py-2 pr-8 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs appearance-none"
                      >
                        <option value="Google TTS">Google TTS / Standard voice</option>
                        <option value="Amazon Polly">Amazon Polly / Neural</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                        <Icon name="expand_more" size={16} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      After Max Invalid Retry Action
                    </label>
                    <div className="relative">
                      <select
                        value={activeMenu.afterMaxInvalidAction}
                        onChange={(e) => updateActiveMenu("afterMaxInvalidAction", e.target.value)}
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
              }
            />
          </section>

          {/* Section 08: Timeout Handling */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Icon name="schedule" size={20} />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Timeout Handling</h2>
                  <p className="text-xs text-on-surface-variant">Keypad timeout actions for {activeMenu.name}.</p>
                </div>
              </div>
            </div>

            <MessageAudioConfig
              label="Timeout Prompt"
              sublabel="Prompt played when caller does not press any key within timeout window"
              msgType={activeMenu.timeoutMsgType || "Text to Speech"}
              onMsgTypeChange={(type) => updateActiveMenu("timeoutMsgType", type)}
              textValue={activeMenu.timeoutMsg}
              onTextChange={(val) => updateActiveMenu("timeoutMsg", val)}
              textPlaceholder="e.g. We did not receive your input. Please try again."
              selectedAudioId={activeMenu.timeoutAudioId || "audio-4"}
              onAudioSelect={(id) => updateActiveMenu("timeoutAudioId", id)}
              onOpenUpload={() =>
                handleOpenUploadModal((id) => updateActiveMenu("timeoutAudioId", id))
              }
              audioAssets={audioAssets}
              playingAudioUrl={playingAudioUrl}
              onTogglePlayAudio={toggleAudioPlay}
              ttsExtras={
                <div className="pt-1">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Timeout Next Step
                  </label>
                  <div className="relative">
                    <select
                      value={activeMenu.timeoutNextStep}
                      onChange={(e) => updateActiveMenu("timeoutNextStep", e.target.value)}
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
              }
            />
          </section>
        </div>

        {/* ==============================================================
            RIGHT COLUMN (5 cols): Preview Panel & Validation Panel
            ============================================================== */}
        <div className="xl:col-span-5 flex flex-col gap-6 sticky top-24">

          {/* 07 Preview Panel (Multi-Menu Live AST Tree) */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 shadow-stitch-card border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-xs">
                  <Icon name="account_tree" size={20} />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-on-surface">Multi-Menu Tree</h3>
                  <p className="text-xs text-on-surface-variant">{menus.length} interactive IVR menu nodes</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs">
                Live AST
              </span>
            </div>

            {/* Tree ASCII Structure for all menus */}
            <div className="p-4 rounded-xl bg-surface-container-low font-mono text-xs leading-relaxed text-on-surface border border-outline-variant/20 overflow-x-auto shadow-inner space-y-4">
              {menus.map((m) => {
                const isActive = m.id === activeMenu.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveMenuId(m.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? "bg-purple-500/10 border-purple-500/40"
                        : "bg-surface-container-lowest/60 border-outline-variant/20 hover:border-outline-variant/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 pb-1.5 border-b border-outline-variant/15">
                      <span className="font-bold text-primary dark:text-primary-fixed-dim">
                        {m.name}
                      </span>
                      {m.isStartMenu && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-700 dark:text-amber-300">
                          START
                        </span>
                      )}
                      {isActive && (
                        <span className="ml-auto text-[10px] text-[#9a55ff] font-bold">
                          ● Selected
                        </span>
                      )}
                    </div>

                    {/* Menu Prompt Preview */}
                    <div className="pt-1 text-[11px] text-on-surface-variant flex items-center gap-1.5 truncate border-b border-outline-variant/10 pb-1">
                      <span className="text-outline">Prompt:</span>
                      {m.msgType === "Audio File" ? (
                        <span className="text-[#9a55ff] font-bold truncate flex items-center gap-1">
                          <Icon name="audiotrack" size={12} />
                          <span>
                            {audioAssets.find((a) => a.id === m.instructionAudioId)?.name || "Audio File"}
                          </span>
                        </span>
                      ) : (
                        <span className="truncate italic">"{m.instructionMsg}"</span>
                      )}
                    </div>

                    <div className="pt-1.5 space-y-1">
                      {m.dtmfActions.map((action, idx) => {
                        const isLast = idx === m.dtmfActions.length - 1;
                        const isActionAudio = action.messageType === "Audio File";
                        const actionAudioName =
                          audioAssets.find((a) => a.id === action.audioId)?.name || "Audio";

                        return (
                          <div key={action.id} className="text-on-surface flex items-center gap-1.5">
                            <span className="text-outline font-normal">
                              {isLast ? "└──" : "├──"}
                            </span>
                            <span className="font-bold text-primary-container dark:text-primary-fixed">
                              {action.key}
                            </span>
                            <span className="text-outline">→</span>
                            <span className="font-semibold">{action.businessAction}</span>
                            <span className="text-[10px] text-on-surface-variant font-normal truncate max-w-[150px]">
                              ({action.nextStep})
                              {isActionAudio
                                ? ` / ${actionAudioName}`
                                : ` / "${action.message}"`}
                            </span>
                          </div>
                        );
                      })}
                      <div className="text-on-surface-variant flex items-center gap-1.5 pt-0.5">
                        <span className="text-outline">└──</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">Timeout</span>
                        <span className="text-outline">→</span>
                        <span>{m.timeoutNextStep}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Node Chain */}
            <div className="p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 space-y-2.5">
              <span className="text-xs font-semibold text-on-surface-variant">
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
                  <span className="font-semibold text-on-surface">
                    Play Start Menu ({startMenu.name})
                  </span>
                  <span className="text-outline ml-auto">{startMenu.timeoutSeconds}s Wait</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-tertiary text-on-tertiary font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span className="font-semibold text-on-surface">Branch or Jump to Sub-menus</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-auto">{menus.length} Menus Ready</span>
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
                  <p className="text-xs text-on-surface-variant">Review flow and menu integrity.</p>
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
                <span>Start menu designated ({startMenu.name}).</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
                <Icon name="check_circle" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{menus.length} menus configured with unique names.</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
                <Icon name="check_circle" size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Keypad routing &amp; jump targets verified.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
              <Icon name="info" size={18} className="text-primary-container shrink-0 mt-0.5" />
              <span>Multi-menu compilation audit ready. All nodes valid for Dialyra engine execution.</span>
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Add Menu (Select Pre-defined Template OR Create Open Custom Menu) */}
      {/* ========================================================================= */}
      {addMenuModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddMenuModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                  <Icon name="add_circle" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Add Menu to Flow</h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Choose a pre-configured template or create a custom menu from scratch.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddMenuModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Navigation Tabs between Template vs Custom */}
            <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <button
                type="button"
                onClick={() => setAddMenuTab("template")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  addMenuTab === "template"
                    ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Select Pre-defined Template
              </button>
              <button
                type="button"
                onClick={() => setAddMenuTab("custom")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  addMenuTab === "custom"
                    ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Create Custom Menu
              </button>
            </div>

            {/* TAB 1: PRESET MENU TEMPLATES */}
            {addMenuTab === "template" && (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {PRESET_MENU_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.templateKey}
                    className="p-3.5 rounded-xl border border-outline-variant/30 hover:border-[#9a55ff] bg-surface-container-low/50 hover:bg-surface-container-low transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">{tmpl.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tmpl.badgeColor}`}>
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        {tmpl.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddFromTemplate(tmpl.templateKey)}
                      className="px-3.5 py-1.5 rounded-full btn-gradient-primary text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      Select Menu
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: CUSTOM OPEN MENU CREATION */}
            {addMenuTab === "custom" && (
              <form onSubmit={handleCreateCustomMenu} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Menu Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customMenuName}
                    onChange={(e) => setCustomMenuName(e.target.value)}
                    placeholder="e.g. Delivery Reschedule Menu, VIP Express"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                  />
                </div>

                <div>
                  <label className="block text-on-surface font-semibold mb-1">
                    Description <span className="text-outline font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={customMenuDesc}
                    onChange={(e) => setCustomMenuDesc(e.target.value)}
                    placeholder="e.g. Custom options for specific order routing"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-on-surface font-semibold text-xs">
                      Greeting Prompt
                    </label>
                    <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setCustomMenuMsgType("Text to Speech")}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          customMenuMsgType === "Text to Speech"
                            ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Text (TTS)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomMenuMsgType("Audio File")}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          customMenuMsgType === "Audio File"
                            ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Audio File
                      </button>
                    </div>
                  </div>

                  {customMenuMsgType === "Text to Speech" ? (
                    <textarea
                      rows={2}
                      value={customMenuPrompt}
                      onChange={(e) => setCustomMenuPrompt(e.target.value)}
                      placeholder="e.g. Please choose an option from the menu below."
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 resize-none"
                    />
                  ) : (
                    <div className="relative">
                      <select
                        value={customMenuAudioId}
                        onChange={(e) => setCustomMenuAudioId(e.target.value)}
                        className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 appearance-none cursor-pointer"
                      >
                        {audioAssets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name} ({asset.durationSec}s / {asset.category})
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                        <Icon name="expand_more" size={16} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAddMenuModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                  >
                    Create Custom Menu
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit Menu Details */}
      {/* ========================================================================= */}
      {editMenuModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditMenuModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                  <Icon name="edit" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Edit Menu: {editMenuName}</h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Modify name, description, start status, and greeting message.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditMenuModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditMenuModal} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Menu Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editMenuName}
                  onChange={(e) => setEditMenuName(e.target.value)}
                  placeholder="e.g. Order Confirmation Menu"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editMenuDesc}
                  onChange={(e) => setEditMenuDesc(e.target.value)}
                  placeholder="e.g. Primary customer confirmation menu"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/20">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editMenuIsStart}
                    onChange={(e) => setEditMenuIsStart(e.target.checked)}
                    className="w-4 h-4 rounded text-[#9a55ff] focus:ring-[#9a55ff]/30 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-on-surface block">
                      Make this the Flow Start Menu
                    </span>
                    <span className="text-[11px] text-on-surface-variant block">
                      When callers dial in, this will be the first interactive menu played.
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-on-surface font-semibold text-xs">
                    Greeting Prompt Type
                  </label>
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setEditMenuMsgType("Text to Speech")}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                        editMenuMsgType === "Text to Speech"
                          ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Text (TTS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMenuMsgType("Audio File")}
                      className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                        editMenuMsgType === "Audio File"
                          ? "bg-white dark:bg-[#251b3b] text-[#9a55ff] shadow-2xs font-extrabold"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Audio File
                    </button>
                  </div>
                </div>

                {editMenuMsgType === "Text to Speech" ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={editMenuPrompt}
                      onChange={(e) => setEditMenuPrompt(e.target.value)}
                      placeholder="e.g. Press 1 to confirm your order, press 2 to cancel."
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 resize-none font-medium"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                          Language
                        </label>
                        <select
                          value={editMenuLang}
                          onChange={(e) => setEditMenuLang(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs"
                        >
                          <option value="English">English</option>
                          <option value="Bengali">Bengali</option>
                          <option value="Hindi">Hindi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                          Voice Model
                        </label>
                        <select
                          value={editMenuVoice}
                          onChange={(e) => setEditMenuVoice(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs"
                        >
                          <option value="Standard voice">Standard voice</option>
                          <option value="Studio Neural2-A">Studio Neural2-A</option>
                          <option value="Wavenet Female">Wavenet Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                          Provider
                        </label>
                        <select
                          value={editMenuProvider}
                          onChange={(e) => setEditMenuProvider(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs"
                        >
                          <option value="Google TTS">Google TTS</option>
                          <option value="Amazon Polly">Amazon Polly</option>
                          <option value="Azure Speech AI">Azure Speech AI</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={editMenuAudioId}
                      onChange={(e) => setEditMenuAudioId(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 appearance-none cursor-pointer"
                    >
                      {audioAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} ({asset.durationSec}s / {asset.category})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={16} />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditMenuModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {uploadModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setUploadModalOpen(false);
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white dark:bg-[#18181b] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 dark:border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
                  <Icon name="cloud_upload" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Upload Audio File</h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Audio will be saved to your library and selected for this message.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadAudioSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Audio File Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAudioName}
                  onChange={(e) => setNewAudioName(e.target.value)}
                  placeholder="e.g. order_confirm_custom.wav"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newAudioCategory}
                  onChange={(e) => setNewAudioCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30"
                >
                  <option value="ivr_prompt">IVR Prompt (Spoken message)</option>
                  <option value="hold_music">Hold Music</option>
                  <option value="voicemail">Voicemail</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low/40 flex flex-col items-center justify-center text-center gap-1.5">
                <Icon name="upload_file" size={28} className="text-[#9a55ff]" />
                <span className="font-bold text-xs text-on-surface">Choose or drop audio file</span>
                <span className="text-[11px] text-on-surface-variant">Supports .wav, .mp3, .ogg (PCM 16-bit 8000Hz recommended)</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  Upload &amp; Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
