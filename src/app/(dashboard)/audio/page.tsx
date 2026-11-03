"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { mockAudioAssets, AudioAsset } from "@/mock/mockData";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Volume2,
  Plus,
  ChevronRight,
  Play,
  Square,
  Download,
  Trash2,
  CloudUpload,
  FileAudio,
  X,
  Radio,
} from "lucide-react";

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
      showToast(`Playing audio prompt`, "info");
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
    showToast(`"${item.name}" uploaded successfully`, "success");
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Audio and Voice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Volume2 size={20} />
            </span>
            Audio and Voice
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            WAV and MP3 sound assets utilized by IVR flows, hold queues, and greetings.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="btn-gradient-primary text-white text-xs sm:text-sm px-4 py-2.5 rounded-full inline-flex items-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          type="button"
        >
          <CloudUpload size={16} />
          <span>Upload Audio</span>
        </button>
      </div>

      {/* 2. Signature Purple React Gradient Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="card-img-holder bg-gradient-primary text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              Storage Used
            </span>
            <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Radio size={18} />
            </span>
          </div>
          <div className="mt-4 z-10 flex items-baseline justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                14.8 MB
              </div>
              <div className="text-xs text-white/90 font-medium mt-1">
                Allocated out of 100 MB quota
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              15% Used
            </span>
          </div>
        </div>

        <div className="card-img-holder bg-gradient-success text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              Total Audio Files
            </span>
            <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <FileAudio size={18} />
            </span>
          </div>
          <div className="mt-4 z-10 flex items-baseline justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {assets.length}
              </div>
              <div className="text-xs text-white/90 font-medium mt-1">
                High-fidelity PCM audio prompts
              </div>
            </div>
            <span className="font-mono text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              All Ready
            </span>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 bg-surface-container-low p-1.5 rounded-full w-fit border border-outline-variant/30">
        {[
          { id: "all", label: `All (${assets.length})` },
          { id: "ivr_prompt", label: "Prompts" },
          { id: "hold_music", label: "Hold Music" },
          { id: "voicemail", label: "Voicemail" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              categoryFilter === tab.id
                ? "btn-gradient-primary text-white shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Audio Table */}
      <div className="bg-white dark:bg-[#1a1329] rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: "750px" }}>
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-outline-variant/20 text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                <th className="py-3.5 px-5">Name</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Duration</th>
                <th className="py-3.5 px-5 min-w-[180px]">Preview Player</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-sm text-on-surface">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-purple-500/[0.03] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 flex items-center justify-center shrink-0 shadow-2xs">
                        <FileAudio size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">{item.name}</span>
                        <span className="text-xs text-on-surface-variant font-mono">
                          {item.fileSizeFormatted} · {item.codec}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="badge-inverse-info capitalize text-xs font-bold">
                      {item.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-xs text-on-surface-variant">
                    00:{item.durationSec}s
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-full w-fit border border-outline-variant/30 shadow-2xs">
                      <button
                        onClick={() => togglePlayback(item.id)}
                        className="w-7 h-7 rounded-full btn-gradient-primary text-white flex items-center justify-center hover:opacity-90 transition shadow-2xs cursor-pointer"
                        type="button"
                      >
                        {playingId === item.id ? <Square size={13} /> : <Play size={13} className="ml-0.5" />}
                      </button>
                      <div className="flex items-center gap-0.5 h-3.5 w-20">
                        {[30, 60, 90, 40, 80, 100, 70, 50, 85, 40].map((h, i) => (
                          <span
                            key={i}
                            className={`flex-1 rounded-full transition-all ${
                              playingId === item.id ? "bg-[#9a55ff] animate-pulse" : "bg-outline-variant"
                            }`}
                            style={{ height: `${playingId === item.id ? h : 30}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono text-on-surface-variant">
                        0:{item.durationSec}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDownload(item.name)}
                        className="p-2 rounded-full text-on-surface-variant hover:text-[#9a55ff] hover:bg-purple-500/10 transition-colors cursor-pointer"
                        title="Download"
                        type="button"
                      >
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => setAssetToDelete(item)}
                        className="p-2 rounded-full text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete"
                        type="button"
                      >
                        <Trash2 size={15} />
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
          <div className="bg-white dark:bg-[#1a1329] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="text-lg font-bold text-on-surface">
                Upload Audio File
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X size={18} />
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
                  placeholder="e.g. holiday_greeting_2026.wav"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff]"
                />
              </div>

              <div>
                <label className="block text-on-surface font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as typeof newCategory)
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-2.5 font-semibold text-on-surface focus:outline-none focus:border-[#9a55ff] cursor-pointer"
                >
                  <option value="ivr_prompt">IVR Voice Prompt</option>
                  <option value="hold_music">Hold Music</option>
                  <option value="voicemail">Voicemail Announcement</option>
                </select>
              </div>

              <div className="p-6 border-2 border-dashed border-outline-variant rounded-xl text-center flex flex-col items-center justify-center gap-2 bg-surface-container-low/50">
                <CloudUpload size={28} className="text-[#9a55ff]" />
                <span className="font-semibold text-on-surface">Drag and drop audio file here</span>
                <span className="text-xs text-on-surface-variant">Supports 16-bit 8kHz Mono WAV or MP3</span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface hover:bg-surface-container font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-white font-bold text-xs px-5 py-2 rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!assetToDelete}
        onClose={() => setAssetToDelete(null)}
        onConfirm={() => {
          if (assetToDelete) {
            handleDelete(assetToDelete.id, assetToDelete.name);
            setAssetToDelete(null);
          }
        }}
        title="Delete Audio Asset"
        description={`Are you sure you want to delete "${assetToDelete?.name}"? Any active IVR menu using this recording will fall back to default TTS.`}
        confirmText="Delete Audio"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
