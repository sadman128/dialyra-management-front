"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import { ToastItem } from "@/context/ToastContext";

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <aside
      aria-label="Notifications"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 w-[380px] max-w-[calc(100vw-32px)] pointer-events-none"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </aside>
  );
}

export function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const [progress, setProgress] = useState(100);
  const duration = item.duration ?? 3000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration]);

  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />,
      titleColor: "text-emerald-600 dark:text-emerald-400",
      border: "border-l-4 border-l-emerald-500",
      progressBg: "bg-emerald-500",
      defaultTitle: "Success",
    },
    error: {
      icon: <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />,
      titleColor: "text-rose-600 dark:text-rose-400",
      border: "border-l-4 border-l-rose-500",
      progressBg: "bg-rose-500",
      defaultTitle: "Error",
    },
    info: {
      icon: <Info className="w-4.5 h-4.5 text-[#9a55ff] shrink-0" />,
      titleColor: "text-[#9a55ff] dark:text-[#da8cff]",
      border: "border-l-4 border-l-[#9a55ff]",
      progressBg: "bg-[#9a55ff]",
      defaultTitle: "Notice",
    },
    warning: {
      icon: <AlertTriangle className="w-4.5 h-4.5 text-[#f0a60a] shrink-0" />,
      titleColor: "text-[#f0a60a] dark:text-[#f0a60a]",
      border: "border-l-4 border-l-[#f0a60a]",
      progressBg: "bg-[#f0a60a]",
      defaultTitle: "Warning",
    },
  }[item.type];

  const titleText = item.title || typeConfig.defaultTitle;
  const messageText = item.message;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative overflow-hidden rounded-xl shadow-xl shadow-black/10 dark:shadow-black/50 transition-transform transition-opacity duration-200 transform translate-y-0
        w-[380px] max-w-[calc(100vw-32px)] min-h-[64px] bg-white text-slate-800 border border-slate-200/90
        dark:bg-[#18181b] dark:text-zinc-100 dark:border-zinc-800/90
        backdrop-blur-md p-3.5 sm:p-4 flex flex-col justify-center ${typeConfig.border}`}
    >
      {/* Top Row: Icon + Bold Title + Dismiss Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 flex items-center justify-center">
            {typeConfig.icon}
          </span>
          <h4 className={`text-sm font-bold truncate ${typeConfig.titleColor}`}>
            {titleText}
          </h4>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a55ff]"
          aria-label="Dismiss toast"
        >
          <X size={15} />
        </button>
      </div>

      {/* Second Row: Description indented underneath title text */}
      {messageText && (
        <div className="pl-7 pr-3 mt-1">
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
            {messageText}
          </p>
        </div>
      )}

      {/* Synchronized Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full ${typeConfig.progressBg} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
