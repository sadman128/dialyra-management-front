"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { mockAudioAssets, AudioAsset } from "@/mock/mockData";
import { Icon } from "@/components/ui/Icon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AudioLibraryPage() {
  const { showToast } = useBusiness();
  const [assets, setAssets] = useState<AudioAsset[]>(mockAudioAssets);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<AudioAsset | null>(null);
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
      showToast(`Playing audio "${id}"`, "info");
    }
  };

  const handleDownload = (name: string) => {
    showToast(`Downloading "${name}"`, "info");
  };

  const handleDelete = (id: string, name: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    showToast(`Deleted "${name}"`, "info");
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
      codec: "PCM Audio",
    };
    setAssets([...assets, item]);
    setUploadModalOpen(false);
    setNewFileName("");
    showToast(`Uploaded "${item.name}"`, "success");
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
            Audio Library
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
            Voice messages, prompts, and hold music.
          </p>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => showToast("Microphone ready", "info")}
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

      {/* 2. Simplified Clean Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Storage */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
              <Icon name="cloud_sync" size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                Storage Used
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
          <div className="text-right">
            <span className="text-xs font-bold text-primary-container font-mono">
              15% Used
            </span>
          </div>
        </div>

        {/* Total Audio Files */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
              <Icon name="audio_file" size={22} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                Total Files
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-2xl text-on-surface font-bold">
                  {assets.length}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  Audio Files
                </span>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Ready
          </span>
        </div>
      </div>

      {/* 3. Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: `All (${assets.length})` },
          { id: "ivr_prompt", label: "Prompts" },
          { id: "hold_music", label: "Hold Music" },
          { id: "voicemail", label: "Voicemail" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border ${
              categoryFilter === tab.id
                ? "bg-primary-container text-on-primary border-primary-container shadow"
                : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-outline-variant/30"
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Audio Table (No complex jargon, no Referenced in Flows) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/80 border-b border-surface-container text-outline text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 min-w-[180px]">Preview</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-xs sm:text-sm text-on-surface">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
                        <Icon name="audio_file" size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{item.name}</span>
                        <span className="text-[11px] text-outline font-mono">
                          {item.fileSizeFormatted}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold capitalize">
                      {item.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-on-surface-variant">
                    00:{item.durationSec}s
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 bg-surface-container-low px-2.5 py-1 rounded-lg w-fit border border-surface-container shadow-xs">
                      <button
                        onClick={() => togglePlayback(item.id)}
                        className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 transition shadow-xs"
                        type="button"
                      >
                        <Icon name={playingId === item.id ? "close" : "play_arrow"} size={14} />
                      </button>
                      <div className="flex items-center gap-0.5 h-3.5 w-20">
                        {[30, 60, 90, 40, 80, 100, 70, 50, 85, 40].map((h, i) => (
                          <span
                            key={i}
                            className={`flex-1 rounded-full bg-primary-container transition-all ${
                              playingId === item.id ? "animate-pulse" : "opacity-40"
                            }`}
                            style={{ height: `${playingId === item.id ? h : 30}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-mono text-on-surface-variant">
                        0:{item.durationSec}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDownload(item.name)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container shadow-xs transition-colors"
                        title="Download"
                        type="button"
                      >
                        <Icon name="download" size={17} />
                      </button>
                      <button
                        onClick={() => setAssetToDelete(item)}
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 shadow-xs transition-colors"
                        title="Delete"
                        type="button"
                      >
                        <Icon name="delete" size={17} />
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
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                Upload Audio
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. order_greeting.wav"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container shadow-xs"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 font-semibold text-on-surface focus:outline-none focus:border-primary-container appearance-none pr-8 shadow-xs"
                  >
                    <option value="ivr_prompt">Voice Prompt</option>
                    <option value="hold_music">Hold Music</option>
                    <option value="voicemail">Voicemail</option>
                  </select>
                  <Icon name="arrow_drop_down" size={20} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-5 text-center space-y-2 bg-surface-container-low">
                <Icon name="upload" size={32} className="text-outline mx-auto" />
                <p className="font-semibold text-on-surface">
                  Drag and drop WAV or MP3 (Max 15MB)
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low font-semibold shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-bold shadow-sm hover:shadow hover:bg-primary transition"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Audio Confirmation Modal */}
      <ConfirmModal
        isOpen={!!assetToDelete}
        onClose={() => setAssetToDelete(null)}
        onConfirm={() => {
          if (assetToDelete) {
            handleDelete(assetToDelete.id, assetToDelete.name);
            setAssetToDelete(null);
          }
        }}
        title="Delete Audio Prompt"
        description={`Are you sure you want to delete "${assetToDelete?.name}"? Call flows using this voice prompt will fall back to standard TTS.`}
        confirmText="Delete Audio"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
