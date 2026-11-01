"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { mockAudioAssets, AudioAsset } from "@/mock/mockData";
import { Icon } from "@/components/ui/Icon";

export default function AudioLibraryPage() {
  const { showToast } = useBusiness();
  const [assets, setAssets] = useState<AudioAsset[]>(mockAudioAssets);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newCategory, setNewCategory] = useState<"ivr_prompt" | "hold_music" | "voicemail">("ivr_prompt");

  const filtered = assets.filter((a) => {
    if (categoryFilter === "all") return true;
    return a.category === categoryFilter;
  });

  const togglePlayback = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      showToast(`Playing audio sample "${id}"`, "info");
    }
  };

  const handleDownload = (name: string) => {
    showToast(`Downloading audio asset "${name}" to your local drive`, "info");
  };

  const handleDelete = (id: string, name: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    showToast(`Deleted audio asset "${name}"`, "info");
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const item: AudioAsset = {
      id: `audio-${Date.now()}`,
      name:
        newFileName.endsWith(".wav") || newFileName.endsWith(".mp3")
          ? newFileName
          : `${newFileName}.wav`,
      category: newCategory,
      durationSec: 15,
      fileSizeBytes: 240000,
      fileSizeFormatted: "240 KB",
      referencedByFlows: ["Order Confirmation Flow"],
      url: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
      codec: "PCM 16-bit 8000Hz • Mono",
    };
    setAssets([...assets, item]);
    setUploadModalOpen(false);
    setNewFileName("");
    showToast(`Uploaded audio prompt "${item.name}"`, "success");
  };

  return (
    <div className="flex flex-col w-full space-y-8 pb-16">
      {/* 1. Top Hero & Telemetry Bar */}
      <div className="flex flex-col gap-6">
        {/* Header Title & Action Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Media Server: BD-02
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
              Audio Library
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl font-medium">
              Recorded voice prompts, greetings, and queue hold music for low-latency SIP trunks.
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => showToast("SIP WebRTC microphone recorder ready (0 dBm)", "info")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all shadow-sm hover:shadow text-xs sm:text-sm font-bold border border-outline-variant/30 active:scale-95"
              type="button"
            >
              <Icon name="mic" size={18} />
              <span>Record</span>
            </button>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary hover:bg-primary transition-all shadow-sm hover:shadow text-xs sm:text-sm font-bold active:scale-95"
              type="button"
            >
              <Icon name="upload" size={18} />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* 3 Telemetry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Storage Telemetry */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <Icon name="cloud_sync" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase text-on-surface-variant font-bold">
                  Storage
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl sm:text-2xl text-on-surface font-bold">
                    14.8 MB
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    / 100 MB
                  </span>
                </div>
              </div>
            </div>
            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-primary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="14.8, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-primary">
                15%
              </span>
            </div>
          </div>

          {/* Encoding & Standards Telemetry */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center gap-3.5 border border-outline-variant/30">
            <div className="w-11 h-11 rounded-xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container shrink-0">
              <Icon name="graphic_eq" size={24} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs uppercase text-on-surface-variant font-bold">
                SIP Optimization
              </span>
              <span className="text-base text-on-surface font-bold truncate mt-0.5">
                G.711u / PCM Mono
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                Low latency cellular routes
              </span>
            </div>
          </div>

          {/* Active In-Flow Count */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-secondary-container/20 flex items-center justify-center text-on-secondary-container shrink-0">
                <Icon name="call_split" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase text-on-surface-variant font-bold">
                  Active in Flows
                </span>
                <span className="text-xl sm:text-2xl text-on-surface font-bold mt-0.5">
                  4 Prompts Bound
                </span>
              </div>
            </div>
            <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-bold">
              Live In Use
            </span>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-space-md">
        {[
          { id: "all", label: `All Audio (${assets.length})` },
          { id: "ivr_prompt", label: "IVR Prompts (2)" },
          { id: "hold_music", label: "Hold Music (1)" },
          { id: "voicemail", label: "Voicemail Greetings (1)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-space-md py-1.5 rounded-lg text-label-md font-label-md font-semibold transition-all border border-outline-variant/20 shadow-xs ${
              categoryFilter === tab.id
                ? "bg-primary-container text-on-primary shadow-sm"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container"
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Audio Assets Table (Stitch UI 100% Exact) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-surface-container text-outline text-label-sm font-label-sm uppercase tracking-wider">
                <th className="py-3 px-5">Audio Asset Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Duration &amp; Size</th>
                <th className="py-3 px-5">Referenced in Flows</th>
                <th className="py-3 px-5 min-w-[200px]">Playback Preview</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-body-md font-body-md text-on-surface">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
                        <Icon name="audio_file" size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{item.name}</span>
                        <span className="font-code-sm text-code-sm text-outline">
                          {item.codec}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-label-sm font-semibold capitalize">
                      {item.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-code-sm text-code-sm text-on-surface-variant">
                    00:{item.durationSec}s · {item.fileSizeFormatted}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-primary-fixed/40 text-primary text-label-sm font-label-sm font-semibold">
                      {item.referencedByFlows.join(", ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded-lg w-fit border border-surface-container">
                      <button
                        onClick={() => togglePlayback(item.id)}
                        className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 transition"
                        type="button"
                      >
                        <Icon name={playingId === item.id ? "close" : "play_arrow"} size={14} />
                      </button>
                      {/* Waveform Bars */}
                      <div className="flex items-center gap-0.5 h-3.5 w-20">
                        {[30, 60, 90, 40, 80, 100, 70, 50, 85, 40].map((h, i) => (
                          <span
                            key={i}
                            className={`flex-1 rounded-full bg-primary-container transition-all ${
                              playingId === item.id ? "animate-pulse" : "opacity-50"
                            }`}
                            style={{ height: `${playingId === item.id ? h : 30}%` }}
                          />
                        ))}
                      </div>
                      <span className="font-code-sm text-code-sm text-on-surface-variant">
                        0:{item.durationSec}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDownload(item.name)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                        title="Download Audio"
                        type="button"
                      >
                        <Icon name="download" size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors"
                        title="Delete Asset"
                        type="button"
                      >
                        <Icon name="delete" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Audio Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Upload New Audio Prompt
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 font-body-sm text-body-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. order_greeting_bn.wav"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container"
                >
                  <option value="ivr_prompt">IVR Voice Prompt</option>
                  <option value="hold_music">Hold Music</option>
                  <option value="voicemail">Voicemail Greeting</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-6 text-center space-y-2 bg-surface-container-low">
                <Icon name="upload" size={36} className="text-outline mx-auto" />
                <p className="text-body-sm font-medium text-on-surface">
                  Drag and drop WAV or MP3 file here (Max 15MB)
                </p>
                <span className="font-code-sm text-code-sm text-outline block">
                  PCM 16-bit 8000Hz or standard MP3 supported
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold shadow-sm hover:opacity-90 transition"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
